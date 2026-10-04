export type ProductType = 'durable' | 'beauty';

export type DurableWarrantyStatus = 'active' | 'expiring_soon' | 'expired' | 'unregistered';
export type BeautyExpiryStatus = 'fresh' | 'expiring_soon' | 'expired' | 'unopened';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type VerificationStatus = 'verified' | 'pending' | 'needs_review';

export interface ProductDocument {
  id: string;
  productId: string;
  name: string;
  type: 
    | 'Invoice' 
    | 'Warranty Document' 
    | 'Product Label' 
    | 'Service Receipt' 
    | 'Claim Evidence' 
    | 'Claim Rejection Document' 
    | 'Batch Code Sticker' 
    | 'Packaging Scan'
    | 'Other Record';
  uploadDate: string;
  size: string;
  source: string;
  status: 'verified' | 'conflict' | 'processing' | 'unverified' | 'needs_verification' | 'error';
  previewSnippet?: string;
  pageCount?: number;
  fileUrl?: string;
}

export interface ExtractedField {
  id: string;
  key: string;
  label: string;
  value: string;
  sourceDoc: string;
  confidence: ConfidenceLevel;
  status: VerificationStatus;
  originalExtractedValue?: string;
  notes?: string;
}

export interface DocumentConflict {
  id: string;
  fieldKey: string;
  fieldLabel: string;
  sourceA: { docName: string; value: string };
  sourceB: { docName: string; value: string };
  status: 'detected' | 'under_review' | 'resolved';
  resolvedValue?: string;
  resolvedAt?: string;
}

export interface ProductIssue {
  id: string;
  productId: string;
  title: string;
  description: string;
  category: 'Hardware' | 'Display' | 'Audio / Speaker' | 'Battery / Power' | 'Connectivity' | 'Wear & Tear' | 'Cosmetic';
  date: string;
  severity: 'critical' | 'moderate' | 'minor';
  status: 'open' | 'investigating' | 'claim_filed' | 'resolved';
  evidenceDocName?: string;
}

export interface ClaimChecklistItem {
  key: string;
  label: string;
  status: 'available' | 'missing' | 'needs_verification' | 'conflict';
  docRef?: string;
  actionLabel: string;
  actionTargetTab: string;
}

export interface PlannerItem {
  id: string;
  title: string;
  deadline: string;
  type: 'urgent' | 'recommended' | 'optional';
  completed: boolean;
  actionTab?: string;
  actionLabel?: string;
}

export interface RenewalPlan {
  id: string;
  provider: string;
  planName: string;
  coverage: string;
  price: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'available' | 'expired';
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  category: 'product' | 'document' | 'verification' | 'conflict' | 'warranty' | 'issue' | 'claim' | 'service';
}

export interface ServiceCenter {
  id: string;
  name: string;
  brand: string;
  address: string;
  distance: string;
  phone: string;
  rating: number;
  type: 'Authorized Partner' | 'Flagship Hub' | 'Direct Service Center';
  turnaroundTime: string;
  openStatus: string;
  supportedServices: string[];
}

export interface ProductClaim {
  id: string;
  productId: string;
  productName: string;
  productBrand: string;
  productType: ProductType;
  issueTitle: string;
  issueCategory: string;
  status: 'Draft' | 'Preparing' | 'Submitted' | 'Approved' | 'Rejected';
  evidenceCompleteness: number; // 0 - 100
  evidenceChecklist: {
    invoice: boolean;
    warranty: boolean;
    serial: boolean;
    issueEvidence: boolean;
  };
  createdAt: string;
  updatedAt: string;
  nextAction: string;
  nextActionRoute: AppRoute;
  claimAmount?: string;
  denialReason?: string;
  clausesCited?: string[];
  timeline: { title: string; date: string; note: string }[];
}

export interface PriceComparisonItem {
  id: string;
  currentProductId: string;
  modelName: string;
  brand: string;
  price: string;
  keySpecs: string;
  similarityPercentage: number;
  availability: 'In Stock' | 'Limited Stock' | 'Pre-order';
  recommendedFor: string;
}

export interface AppNotification {
  id: string;
  type: 'warranty' | 'conflict' | 'evidence' | 'beauty' | 'claim' | 'system';
  title: string;
  explanation: string;
  timestamp: string;
  read: boolean;
  targetRoute: AppRoute;
  productId?: string;
}

export interface BaseProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  type: ProductType;
  image: string;
  status: 'active' | 'attention' | 'archived' | 'claim_in_progress';
  createdAt: string;
  notes?: string;
  documents: ProductDocument[];
  extractedFields: ExtractedField[];
  timeline: TimelineEvent[];
}

export interface DurableProduct extends BaseProduct {
  type: 'durable';
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice?: string;
  seller: string;
  warrantyStatus: DurableWarrantyStatus;
  warrantyStartDate: string;
  warrantyExpiryDate: string;
  warrantyPeriodMonths: number;
  warrantyCoverageSummary?: string;
  warrantyTerms?: {
    coverage: string[];
    exclusions: string[];
    conditions: string[];
  };
  documentsCount: number;
  verifiedFieldsCount: number;
  totalFieldsCount: number;
  hasConflict?: boolean;
  conflictDescription?: string;
  claimReadinessScore: number; // 0 - 100
  conflicts: DocumentConflict[];
  issues: ProductIssue[];
  plannerItems: PlannerItem[];
  renewalPlans: RenewalPlan[];
}

export interface BeautyProduct extends BaseProduct {
  type: 'beauty';
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  paoMonths: string; // e.g. "6M", "12M"
  openedDate?: string;
  openedStatus: BeautyExpiryStatus;
  usagePeriodDays?: number;
  allergensWarning?: string[];
  volumeSize?: string;
  purchasePrice?: string;
  seller?: string;
  reminderIntervalDays?: number;
}

export type Product = DurableProduct | BeautyProduct;

export interface AttentionItem {
  id: string;
  title: string;
  productId: string;
  productName: string;
  productType: ProductType;
  severity: 'high' | 'medium' | 'low';
  category: 'needs_attention' | 'upcoming' | 'completed';
  whatHappened: string;
  whyItMatters: string;
  recommendedAction: string;
  ctaText: string;
  targetRoute: AppRoute;
  timeRemaining?: string;
  completedAt?: string;
}

export interface ActivityItem {
  id: string;
  type: 'product_added' | 'document_uploaded' | 'field_verified' | 'conflict_detected' | 'issue_reported' | 'claim_evidence_added';
  title: string;
  productName: string;
  detail: string;
  timestamp: string;
}

export type AppRoute = 
  | '/landing'
  | '/dashboard'
  | '/products'
  | '/products/new'
  | `/products/${string}`
  | '/documents'
  | '/attention'
  | '/claims'
  | '/ai'
  | '/services'
  | '/post-warranty'
  | '/settings'
  | '/login'
  | '/signup';
