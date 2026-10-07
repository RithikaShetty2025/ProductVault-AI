// Browser-side document reading: PDF text-layer extraction + OCR fallback.
// Never fabricates text — if nothing can be read, says so explicitly.
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { createWorker } from 'tesseract.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// PDF.js needs standard font glyph data to render/measure text for PDFs that
// reference the 14 base fonts without embedding them. Without this, pdf.js
// throws "UnknownErrorException: Ensure that the standardFontDataUrl API
// parameter is provided." The font files are copied into /public/standard_fonts
// (from pdfjs-dist/standard_fonts) so they're served as static assets at runtime.
const STANDARD_FONT_DATA_URL = `${import.meta.env.BASE_URL}standard_fonts/`;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_PDF_PAGES = 10;
export const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

export interface DocumentReadResult {
  ocrText: string;
  ocrConfidence: number; // 0-1
  pageCount: number;
  extractionMethod: 'pdf_text_layer' | 'ocr' | 'mixed';
}

export function validateFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'Unsupported file type. Please upload a JPG, PNG, or PDF file.';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File is too large. Maximum allowed size is 10 MB.';
  }
  if (file.size === 0) {
    return 'File appears to be empty or corrupted.';
  }
  return null;
}

// Runs Tesseract OCR against an image-like source (canvas), returning text + confidence (0-1).
async function runOcrOnCanvas(canvas: HTMLCanvasElement): Promise<{ text: string; confidence: number }> {
  const worker = await createWorker('eng');
  try {
    const { data } = await worker.recognize(canvas);
    return { text: data.text.trim(), confidence: (data.confidence ?? 0) / 100 };
  } finally {
    await worker.terminate();
  }
}

async function ocrImageFile(file: File): Promise<DocumentReadResult> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to read image data from this file.');
  }
  ctx.drawImage(bitmap, 0, 0);

  const { text, confidence } = await runOcrOnCanvas(canvas);
  if (!text) {
    throw new Error('No readable text was found in this image.');
  }

  return { ocrText: text, ocrConfidence: confidence, pageCount: 1, extractionMethod: 'ocr' };
}

async function readPdfFile(file: File): Promise<DocumentReadResult> {
  const arrayBuffer = await file.arrayBuffer();

  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer, standardFontDataUrl: STANDARD_FONT_DATA_URL }).promise;
  } catch (err) {
    throw new Error('This PDF could not be opened. It may be encrypted or corrupted.');
  }

  const pageCount = Math.min(pdf.numPages, MAX_PDF_PAGES);
  let combinedText = '';
  let usedOcr = false;
  let usedTextLayer = false;
  const ocrConfidences: number[] = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => ('str' in item ? item.str : '')).join(' ').trim();

    if (pageText.length > 20) {
      // Usable text layer — no need to OCR this page.
      combinedText += pageText + '\n';
      usedTextLayer = true;
      continue;
    }

    // Fall back to OCR by rendering the page to a canvas.
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    const { text, confidence } = await runOcrOnCanvas(canvas);
    if (text) {
      combinedText += text + '\n';
      ocrConfidences.push(confidence);
      usedOcr = true;
    }
  }

  const finalText = combinedText.trim();
  if (!finalText) {
    throw new Error('No readable text could be extracted from this PDF.');
  }

  const extractionMethod: DocumentReadResult['extractionMethod'] =
    usedOcr && usedTextLayer ? 'mixed' : usedOcr ? 'ocr' : 'pdf_text_layer';

  // Text-layer pages are treated as fully reliable (confidence 1); OCR pages
  // use their actual Tesseract confidence. Overall confidence is the average.
  const avgOcrConfidence = ocrConfidences.length
    ? ocrConfidences.reduce((a, b) => a + b, 0) / ocrConfidences.length
    : 1;
  const overallConfidence = usedTextLayer && !usedOcr ? 1 : avgOcrConfidence;

  return { ocrText: finalText, ocrConfidence: overallConfidence, pageCount, extractionMethod };
}

// Reads a validated file and returns real extracted text — never simulated.
export async function readDocument(file: File): Promise<DocumentReadResult> {
  if (file.type === 'application/pdf') {
    return readPdfFile(file);
  }
  if (file.type.startsWith('image/')) {
    return ocrImageFile(file);
  }
  throw new Error('Unsupported file type for reading.');
}
