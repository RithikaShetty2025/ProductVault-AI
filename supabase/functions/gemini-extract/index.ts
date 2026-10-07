// Supabase Edge Function: gemini-extract
// Takes raw OCR text for one document and asks Gemini to extract structured
// product fields as JSON. Never persists anything itself — the frontend is
// responsible for writing verified rows into `extracted_fields` under the
// user's own authenticated session (RLS enforced).
//
// Required secret: GEMINI_API_KEY (set via `supabase secrets set GEMINI_API_KEY=...`)

import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
// 'gemini-2.0-flash' was shut down. Use the 'latest' alias so this keeps
// working as Google rotates the underlying stable Flash model, instead of
// pinning to a dated model id that will eventually be retired again.
const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const DURABLE_FIELDS = [
  ['productName', 'Product Name'],
  ['brand', 'Brand'],
  ['model', 'Model'],
  ['serialNumber', 'Serial Number'],
  ['purchaseDate', 'Purchase Date'],
  ['purchasePrice', 'Purchase Price'],
  ['seller', 'Authorized Retailer / Seller'],
  ['warrantyPeriodMonths', 'Warranty Duration (months)'],
  ['warrantyStartDate', 'Warranty Start Date'],
  ['warrantyExpiryDate', 'Warranty Expiry Date'],
];

const BEAUTY_FIELDS = [
  ['productName', 'Product Name'],
  ['brand', 'Brand'],
  ['batchNumber', 'Batch Code'],
  ['manufacturingDate', 'Manufacturing Date'],
  ['expiryDate', 'Factory Expiry Date'],
  ['paoMonths', 'PAO (Period After Opening)'],
  ['openedDate', 'Opened Date'],
];

function buildPrompt(productType: string, ocrText: string): string {
  const fields = productType === 'beauty' ? BEAUTY_FIELDS : DURABLE_FIELDS;
  const fieldList = fields.map(([key, label]) => `- ${key}: ${label}`).join('\n');

  return `You are extracting structured data from OCR text of a ${productType === 'beauty' ? 'cosmetics product' : 'durable goods'} document (invoice, warranty card, label, or receipt).

Extract ONLY the following fields if they are actually present in the text. Do not guess or invent values.

${fieldList}

Rules:
- Return strict JSON: an array of objects, each with "key", "value", "confidence" ("high" | "medium" | "low").
- Only include a field if evidence for it exists in the text.
- "confidence" reflects how clearly/unambiguously the value appears in the text.
- Dates must be normalized to YYYY-MM-DD when possible.
- Do not include explanations, markdown, or any text outside the JSON array.

OCR TEXT:
"""
${ocrText.slice(0, 12000)}
"""`;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Server is not configured with GEMINI_API_KEY.' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { ocrText, productType } = await req.json();

    if (!ocrText || typeof ocrText !== 'string' || !ocrText.trim()) {
      return new Response(JSON.stringify({ error: 'ocrText is required.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }
    if (productType !== 'durable' && productType !== 'beauty') {
      return new Response(JSON.stringify({ error: 'productType must be "durable" or "beauty".' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const prompt = buildPrompt(productType, ocrText);

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(
        JSON.stringify({ error: `Gemini API error (HTTP ${geminiRes.status} from ${GEMINI_MODEL}): ${errText}` }),
        {
          status: 502,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    const geminiJson = await geminiRes.json();
    const rawText: string | undefined = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return new Response(JSON.stringify({ error: 'Gemini returned no extractable content.' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    let parsedFields: Array<{ key: string; value: string; confidence: string }>;
    try {
      parsedFields = JSON.parse(rawText);
    } catch {
      return new Response(JSON.stringify({ error: 'Gemini response was not valid JSON.' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const fieldDefs = productType === 'beauty' ? BEAUTY_FIELDS : DURABLE_FIELDS;
    const labelByKey = new Map(fieldDefs.map(([key, label]) => [key, label]));

    const fields = (Array.isArray(parsedFields) ? parsedFields : [])
      .filter((f) => f && typeof f.key === 'string' && labelByKey.has(f.key) && typeof f.value === 'string' && f.value.trim())
      .map((f) => ({
        key: f.key,
        label: labelByKey.get(f.key),
        value: f.value.trim(),
        confidence: ['high', 'medium', 'low'].includes(f.confidence) ? f.confidence : 'medium',
      }));

    return new Response(JSON.stringify({ fields }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: `Unexpected error: ${(err as Error).message}` }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
