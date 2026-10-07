// Real-data fetching layer. Replaces all mock/demo arrays with queries
// against the signed-in user's own rows in Supabase (RLS-scoped by
// auth.uid()). Nothing here fabricates data — any field with no backing
// database column is left empty/zeroed rather than filled with samples.
import { supabase } from './supabaseClient';
import {
  Product,
  DurableProduct,
  BeautyProduct,
  ProductDocument,
  ExtractedField,
  ConfidenceLevel,
  VerificationStatus,
  AttentionItem,
  TimelineEvent,
} from '../types';

const DOC_TYPE_DB_TO_LABEL: Record<string, ProductDocument['type']> = {
  invoice: 'Invoice',
  warranty_card: 'Warranty Document',
  product_label: 'Product Label',
  service_receipt: 'Service Receipt',
  claim_evidence: 'Claim Evidence',
  claim_rejection: 'Claim Rejection Document',
  batch_code_sticker: 'Batch Code Sticker',
  packaging_scan: 'Packaging Scan',
  other: 'Other Record',
};

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function mapDocStatus(processingStatus: string): ProductDocument['status'] {
  if (processingStatus === 'extracted') return 'verified';
  if (processingStatus === 'error') return 'error';
  return 'processing';
}

function mapConfidence(value: number | null): ConfidenceLevel {
  if (value === null || value === undefined) return 'low';
  if (value >= 0.8) return 'high';
  if (value >= 0.5) return 'medium';
  return 'low';
}

function mapFieldStatus(status: string): VerificationStatus {
  if (status === 'verified' || status === 'corrected') return 'verified';
  if (status === 'needs_review') return 'needs_review';
  return 'pending';
}

function daysBetween(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

/** Fetches every product (and its documents + extracted fields) owned by the
 * signed-in user, mapping the raw rows into the UI's `Product` shape. */
export async function fetchUserProducts(userId: string): Promise<Product[]> {
  const { data: productRows, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (productsError) throw new Error(productsError.message);
  const products = productRows || [];
  if (products.length === 0) return [];

  const productIds = products.map((p) => p.id);

  const { data: docRows, error: docsError } = await supabase
    .from('documents')
    .select('*')
    .in('product_id', productIds)
    .order('created_at', { ascending: false });
  if (docsError) throw new Error(docsError.message);

  const { data: fieldRows, error: fieldsError } = await supabase
    .from('extracted_fields')
    .select('*')
    .in('product_id', productIds);
  if (fieldsError) throw new Error(fieldsError.message);

  const docsByProduct = new Map<string, any[]>();
  for (const d of docRows || []) {
    const list = docsByProduct.get(d.product_id) || [];
    list.push(d);
    docsByProduct.set(d.product_id, list);
  }
  const docNameById = new Map<string, string>();
  for (const d of docRows || []) docNameById.set(d.id, d.file_name);

  const fieldsByProduct = new Map<string, any[]>();
  for (const f of fieldRows || []) {
    const list = fieldsByProduct.get(f.product_id) || [];
    list.push(f);
    fieldsByProduct.set(f.product_id, list);
  }

  return products.map((row) => mapProductRow(row, docsByProduct.get(row.id) || [], fieldsByProduct.get(row.id) || [], docNameById));
}

function mapProductRow(row: any, rawDocs: any[], rawFields: any[], docNameById: Map<string, string>): Product {
  const documents: ProductDocument[] = rawDocs.map((d) => ({
    id: d.id,
    productId: d.product_id,
    name: d.file_name,
    type: DOC_TYPE_DB_TO_LABEL[d.document_type] || 'Other Record',
    uploadDate: (d.created_at || '').slice(0, 10),
    size: formatBytes(d.file_size),
    source: 'Uploaded File',
    status: mapDocStatus(d.processing_status),
    previewSnippet: d.ocr_text ? String(d.ocr_text).slice(0, 160) : undefined,
    pageCount: d.page_count || undefined,
  }));

  const extractedFields: ExtractedField[] = rawFields.map((f) => ({
    id: f.id,
    key: f.field_key,
    label: f.field_label,
    value: f.value || '',
    sourceDoc: docNameById.get(f.document_id) || 'Unknown Document',
    confidence: mapConfidence(f.confidence),
    status: mapFieldStatus(f.status),
    originalExtractedValue: f.original_extracted_value || undefined,
    notes: f.notes || undefined,
  }));

  const verifiedFieldsCount = extractedFields.filter((f) => f.status === 'verified').length;
  const totalFieldsCount = extractedFields.length;
  const claimReadinessScore = totalFieldsCount > 0 ? Math.round((verifiedFieldsCount / totalFieldsCount) * 100) : 0;

  const timeline: TimelineEvent[] = [
    {
      id: `tl-created-${row.id}`,
      date: (row.created_at || '').slice(0, 10),
      title: 'Product Added to Vault',
      description: `${row.name || 'Product'} registered in the vault.`,
      category: 'product',
    },
    ...documents.map((d) => ({
      id: `tl-doc-${d.id}`,
      date: d.uploadDate,
      title: 'Document Uploaded',
      description: `${d.name} (${d.type}) linked to this product.`,
      category: 'document' as const,
    })),
  ];

  if (row.type === 'durable') {
    let warrantyStatus: DurableProduct['warrantyStatus'] = 'unregistered';
    if (row.warranty_expiry_date) {
      const remaining = daysBetween(row.warranty_expiry_date);
      if (remaining < 0) warrantyStatus = 'expired';
      else if (remaining <= 30) warrantyStatus = 'expiring_soon';
      else warrantyStatus = 'active';
    }

    const durable: DurableProduct = {
      id: row.id,
      name: row.name || '',
      brand: row.brand || '',
      category: row.category || '',
      type: 'durable',
      image: row.image || '',
      status: row.status === 'draft' ? 'active' : row.status,
      createdAt: row.created_at,
      notes: row.notes || undefined,
      documents,
      extractedFields,
      timeline,
      model: row.model || '',
      serialNumber: row.serial_number || '',
      purchaseDate: row.purchase_date || '',
      purchasePrice: row.purchase_price != null ? String(row.purchase_price) : undefined,
      seller: row.seller || '',
      warrantyStatus,
      warrantyStartDate: row.warranty_start_date || '',
      warrantyExpiryDate: row.warranty_expiry_date || '',
      warrantyPeriodMonths: row.warranty_period_months || 0,
      warrantyCoverageSummary: row.warranty_coverage_summary || undefined,
      warrantyTerms: { coverage: [], exclusions: [], conditions: [] },
      documentsCount: documents.length,
      verifiedFieldsCount,
      totalFieldsCount,
      hasConflict: false,
      claimReadinessScore,
      conflicts: [],
      issues: [],
      plannerItems: [],
      renewalPlans: [],
    };
    return durable;
  }

  let openedStatus: BeautyProduct['openedStatus'] = 'unopened';
  if (row.opened_date) {
    if (row.expiry_date) {
      const remaining = daysBetween(row.expiry_date);
      if (remaining < 0) openedStatus = 'expired';
      else if (remaining <= 30) openedStatus = 'expiring_soon';
      else openedStatus = 'fresh';
    } else {
      openedStatus = 'fresh';
    }
  }

  const beauty: BeautyProduct = {
    id: row.id,
    name: row.name || '',
    brand: row.brand || '',
    category: row.category || '',
    type: 'beauty',
    image: row.image || '',
    status: row.status === 'draft' ? 'active' : row.status,
    createdAt: row.created_at,
    notes: row.notes || undefined,
    documents,
    extractedFields,
    timeline,
    batchNumber: row.batch_number || '',
    manufacturingDate: row.manufacturing_date || '',
    expiryDate: row.expiry_date || '',
    paoMonths: row.pao_months || '',
    openedDate: row.opened_date || undefined,
    openedStatus,
    usagePeriodDays: row.opened_date ? Math.max(0, Math.floor((Date.now() - new Date(row.opened_date).getTime()) / 86400000)) : undefined,
    purchasePrice: row.purchase_price != null ? String(row.purchase_price) : undefined,
    seller: row.seller || undefined,
  };
  return beauty;
}

/** Derives attention items purely from real product fields — warranty/PAO
 * expiry windows and unverified extracted fields. No fabricated entries. */
export function deriveAttentionItems(products: Product[]): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const p of products) {
    if (p.type === 'durable') {
      if (p.warrantyStatus === 'expiring_soon' || p.warrantyStatus === 'expired') {
        items.push({
          id: `att-warranty-${p.id}`,
          title: p.warrantyStatus === 'expired' ? 'Warranty Expired' : 'Warranty Expiring Soon',
          productId: p.id,
          productName: p.name,
          productType: p.type,
          severity: p.warrantyStatus === 'expired' ? 'high' : 'medium',
          category: 'needs_attention',
          whatHappened: p.warrantyExpiryDate
            ? `Manufacturer warranty ${p.warrantyStatus === 'expired' ? 'expired' : 'expires'} on ${p.warrantyExpiryDate}.`
            : 'Warranty expiry date is not on file.',
          whyItMatters: 'Unresolved hardware issues should be reported before coverage ends.',
          recommendedAction: 'Review the warranty record and file a claim if needed.',
          ctaText: 'Review Warranty',
          targetRoute: `/products/${p.id}`,
        });
      }

      const needsReview = p.extractedFields.filter((f) => f.status === 'needs_review');
      if (needsReview.length > 0) {
        items.push({
          id: `att-review-${p.id}`,
          title: `${needsReview.length} Field${needsReview.length > 1 ? 's' : ''} Need Review`,
          productId: p.id,
          productName: p.name,
          productType: p.type,
          severity: 'low',
          category: 'needs_attention',
          whatHappened: `${needsReview.length} extracted field(s) were flagged with low confidence.`,
          whyItMatters: 'Unverified fields may be inaccurate for records or claims.',
          recommendedAction: 'Verify the flagged fields on the product Verify tab.',
          ctaText: 'Verify Fields',
          targetRoute: `/products/${p.id}`,
        });
      }
    } else {
      if (p.openedStatus === 'expiring_soon' || p.openedStatus === 'expired') {
        items.push({
          id: `att-pao-${p.id}`,
          title: p.openedStatus === 'expired' ? 'Product Expired' : 'Product Expiring Soon',
          productId: p.id,
          productName: p.name,
          productType: p.type,
          severity: p.openedStatus === 'expired' ? 'high' : 'medium',
          category: 'needs_attention',
          whatHappened: p.expiryDate
            ? `This product ${p.openedStatus === 'expired' ? 'expired' : 'is expiring'} on ${p.expiryDate}.`
            : 'Expiry date is not on file.',
          whyItMatters: 'Using an expired cosmetic product may reduce efficacy or cause irritation.',
          recommendedAction: 'Check remaining shelf life and consider replacement.',
          ctaText: 'View Product',
          targetRoute: `/products/${p.id}`,
        });
      }
    }
  }

  return items;
}
