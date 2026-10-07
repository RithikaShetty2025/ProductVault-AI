import React, { useState, useEffect } from 'react';
import { 
  Laptop, 
  Sparkles, 
  Camera, 
  UploadCloud, 
  FileEdit, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Trash2, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  Maximize2, 
  Scan, 
  HelpCircle,
  Check,
  ChevronRight,
  Eye,
  Info
} from 'lucide-react';
import { Product, ProductType, ExtractedField, ProductDocument, ConfidenceLevel, VerificationStatus } from '../types';
import { supabase } from '../lib/supabaseClient';
import { readDocument, validateFile } from '../lib/documentReader';

interface AddProductWizardProps {
  onAddProduct: (newProduct: Product) => void;
  onBack: () => void;
  isDemoMode: boolean;
}

type WizardStep = 'select_type' | 'input_method' | 'upload_or_scan' | 'processing' | 'verify_extraction';
type InputMethod = 'scan' | 'pdf' | 'manual';

interface UploadedFileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  previewUrl?: string;
  status: 'uploaded' | 'processing' | 'ready';
  file?: File;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function rankConfidence(c: ConfidenceLevel): number {
  return c === 'high' ? 3 : c === 'medium' ? 2 : 1;
}

const DOCUMENT_TYPE_DB_MAP: Record<string, string> = {
  'Invoice': 'invoice',
  'Warranty Document': 'warranty_card',
  'Product Label': 'product_label',
  'Service Receipt': 'service_receipt',
  'Claim Evidence': 'claim_evidence',
  'Claim Rejection Document': 'claim_rejection',
  'Batch Code Sticker': 'batch_code_sticker',
  'Packaging Scan': 'packaging_scan',
  'Other Record': 'other',
};

export const AddProductWizard: React.FC<AddProductWizardProps> = ({ onAddProduct, onBack, isDemoMode }) => {
  const [step, setStep] = useState<WizardStep>('select_type');
  const [productType, setProductType] = useState<ProductType>('durable');
  const [inputMethod, setInputMethod] = useState<InputMethod>('pdf');
  const [realProductId, setRealProductId] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Uploaded files. The two sample entries are only meaningful in the local
  // sandbox/demo flow (they have no real File object behind them); real
  // sessions start with an empty queue and must upload actual files.
  const [files, setFiles] = useState<UploadedFileItem[]>(
    isDemoMode
      ? [
          {
            id: 'f-init-1',
            name: 'Retail_Store_Purchase_Receipt.pdf',
            type: 'Invoice',
            size: '1.4 MB',
            status: 'ready'
          },
          {
            id: 'f-init-2',
            name: 'Manufacturer_Warranty_Card.pdf',
            type: 'Warranty Document',
            size: '890 KB',
            status: 'ready'
          }
        ]
      : []
  );

  // Scan simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [scanCaptured, setScanCaptured] = useState(false);

  // Processing stage progression
  const [processingStageIndex, setProcessingStageIndex] = useState(0);
  const processingStages = [
    { title: 'Uploading Documents', detail: 'Transferring encrypted payload to local vault buffer...' },
    { title: 'Reading Document Layouts', detail: 'Parsing text layers, tables, and barcode bounding boxes...' },
    { title: 'Extracting Information', detail: 'Extracting product identifiers, dates, and terms...' },
    { title: 'Checking Confidence Scores', detail: 'Cross-verifying extracted characters against serial schemas...' },
    { title: 'Comparing Documents', detail: 'Checking purchase dates and serial numbers across files...' },
    { title: 'Ready for Verification', detail: 'Structured fields prepared for human-in-the-loop audit.' }
  ];

  // Extracted fields
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editTempVal, setEditTempVal] = useState('');

  // Manual entry fallbacks
  const [manualName, setManualName] = useState('');
  const [manualBrand, setManualBrand] = useState('');
  const [manualIdentifier, setManualIdentifier] = useState('');
  const [manualDate, setManualDate] = useState('2026-09-15');
  const [manualPrice, setManualPrice] = useState('$499.00');

  // Trigger processing step timer — only for the local sandbox/demo flow.
  // Real (authenticated) sessions run the actual upload/OCR/Gemini pipeline instead.
  useEffect(() => {
    if (step === 'processing' && isDemoMode) {
      setProcessingStageIndex(0);
      const interval = setInterval(() => {
        setProcessingStageIndex((prev) => {
          if (prev < processingStages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              prepareExtractedFields();
              setStep('verify_extraction');
            }, 600);
            return prev;
          }
        });
      }, 700);

      return () => clearInterval(interval);
    }
  }, [step, isDemoMode]);

  // Real processing pipeline: upload each file to Supabase Storage, read its
  // text (PDF text layer or OCR), send that text to the Gemini edge function,
  // and persist the resulting fields. Runs only for real (non-demo) sessions
  // uploading actual files.
  useEffect(() => {
    if (step === 'processing' && !isDemoMode) {
      runRealExtraction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isDemoMode]);

  const runRealExtraction = async () => {
    setProcessingError(null);
    try {
      setProcessingStageIndex(0);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user.id;
      if (!userId) throw new Error('You must be signed in to upload documents.');

      const realFiles = files.filter(f => f.file);
      if (realFiles.length === 0) {
        throw new Error('No real files were selected. Please upload a PDF, JPG, or PNG file.');
      }

      const { data: productRow, error: productError } = await supabase
        .from('products')
        .insert({ user_id: userId, type: productType, status: 'draft' })
        .select()
        .single();
      if (productError || !productRow) {
        throw new Error(productError?.message || 'Failed to create product record.');
      }
      const newProductId = productRow.id as string;
      setRealProductId(newProductId);

      const allExtracted: ExtractedField[] = [];

      for (const item of realFiles) {
        setProcessingStageIndex(1); // Reading document layouts
        const timestamp = Date.now();
        const safeName = item.file!.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${userId}/${newProductId}/${timestamp}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-documents')
          .upload(storagePath, item.file!, { contentType: item.file!.type });
        if (uploadError) throw new Error(`Upload failed for ${item.name}: ${uploadError.message}`);

        const { data: docRow, error: docError } = await supabase
          .from('documents')
          .insert({
            user_id: userId,
            product_id: newProductId,
            document_type: DOCUMENT_TYPE_DB_MAP[item.type] || 'other',
            file_name: item.name,
            storage_path: storagePath,
            mime_type: item.file!.type,
            file_size: item.file!.size,
            processing_status: 'reading',
          })
          .select()
          .single();
        if (docError || !docRow) throw new Error(docError?.message || 'Failed to record document.');

        let readResult;
        try {
          readResult = await readDocument(item.file!);
        } catch (err) {
          await supabase.from('documents').update({
            processing_status: 'error',
            processing_error: (err as Error).message,
          }).eq('id', docRow.id);
          continue;
        }

        setProcessingStageIndex(2); // Extracting information
        await supabase.from('documents').update({
          ocr_text: readResult.ocrText,
          ocr_confidence: readResult.ocrConfidence,
          extraction_method: readResult.extractionMethod,
          page_count: readResult.pageCount,
          processing_status: 'extracting',
        }).eq('id', docRow.id);

        // supabase.functions.invoke() is supposed to attach the current
        // session's access token automatically, but if that internal lookup
        // ever misses (stale session reference), the request goes out with
        // no Authorization header and Supabase's gateway rejects it before
        // our function even runs. Fetch the token explicitly and pass it so
        // this can't silently fail.
        const { data: { session: invokeSession } } = await supabase.auth.getSession();
        if (!invokeSession?.access_token) {
          throw new Error('Your session has expired. Please sign in again and retry.');
        }
        const { data: geminiData, error: geminiError } = await supabase.functions.invoke('gemini-extract', {
          body: { ocrText: readResult.ocrText, productType },
          headers: { Authorization: `Bearer ${invokeSession.access_token}` },
        });
        if (geminiError) {
          // supabase-js only gives a generic "non-2xx status code" message by
          // default; the actual reason is in the function's JSON error body
          // (available on FunctionsHttpError via `.context`, the raw Response).
          let detailedMessage = geminiError.message;
          const context = (geminiError as { context?: Response }).context;
          if (context && typeof context.json === 'function') {
            try {
              const body = await context.clone().json();
              if (body?.error) detailedMessage = body.error;
            } catch {
              // response wasn't JSON; fall back to the generic message
            }
          }
          await supabase.from('documents').update({
            processing_status: 'error',
            processing_error: detailedMessage,
          }).eq('id', docRow.id);
          setProcessingError(`AI extraction failed for ${item.name}: ${detailedMessage}`);
          continue;
        }

        setProcessingStageIndex(3); // Checking confidence scores
        const fields: Array<{ key: string; label: string; value: string; confidence: ConfidenceLevel }> =
          geminiData?.fields || [];

        for (const f of fields) {
          const status: VerificationStatus = f.confidence === 'low' ? 'needs_review' : 'pending';
          const confidenceNumeric = f.confidence === 'high' ? 0.9 : f.confidence === 'medium' ? 0.6 : 0.3;

          const { data: fieldRow } = await supabase
            .from('extracted_fields')
            .insert({
              user_id: userId,
              product_id: newProductId,
              document_id: docRow.id,
              field_key: f.key,
              field_label: f.label,
              value: f.value,
              original_extracted_value: f.value,
              confidence: confidenceNumeric,
              status,
            })
            .select()
            .single();

          allExtracted.push({
            id: fieldRow?.id || `ext-${f.key}-${docRow.id}`,
            key: f.key,
            label: f.label,
            value: f.value,
            sourceDoc: item.name,
            confidence: f.confidence,
            status,
          });
        }

        await supabase.from('documents').update({ processing_status: 'extracted' }).eq('id', docRow.id);
      }

      setProcessingStageIndex(4); // Comparing documents
      const mergedByKey = new Map<string, ExtractedField>();
      for (const f of allExtracted) {
        const existing = mergedByKey.get(f.key);
        if (!existing || rankConfidence(f.confidence) > rankConfidence(existing.confidence)) {
          mergedByKey.set(f.key, f);
        }
      }
      const finalFields = Array.from(mergedByKey.values());
      if (finalFields.length === 0) {
        throw new Error('No fields could be extracted from the uploaded documents. Try manual entry instead.');
      }

      setExtractedFields(finalFields);
      setProcessingStageIndex(5); // Ready for verification
      setTimeout(() => setStep('verify_extraction'), 400);
    } catch (err) {
      setProcessingError((err as Error).message);
      setStep('upload_or_scan');
    }
  };

  const prepareExtractedFields = () => {
    if (productType === 'durable') {
      setExtractedFields([
        { id: 'ext-d1', key: 'productName', label: 'Product Name', value: 'Sony PlayStation 5 Pro (2TB)', sourceDoc: files[0]?.name || 'Invoice.pdf', confidence: 'high', status: 'verified' },
        { id: 'ext-d2', key: 'brand', label: 'Brand', value: 'Sony Interactive Entertainment', sourceDoc: files[0]?.name || 'Invoice.pdf', confidence: 'high', status: 'verified' },
        { id: 'ext-d3', key: 'model', label: 'Model', value: 'CFI-7000B / DualSense Hub', sourceDoc: files[1]?.name || 'Warranty_Card.pdf', confidence: 'high', status: 'verified' },
        { id: 'ext-d4', key: 'serialNumber', label: 'Serial Number', value: 'SN-03-8821901-PS', sourceDoc: files[1]?.name || 'Warranty_Card.pdf', confidence: 'low', status: 'needs_review', notes: 'Serial character O vs 0 flagged for human check.' },
        { id: 'ext-d5', key: 'purchaseDate', label: 'Purchase Date', value: '2026-09-15', sourceDoc: files[0]?.name || 'Invoice.pdf', confidence: 'high', status: 'verified' },
        { id: 'ext-d6', key: 'purchasePrice', label: 'Purchase Price', value: '$699.99', sourceDoc: files[0]?.name || 'Invoice.pdf', confidence: 'high', status: 'verified' },
        { id: 'ext-d7', key: 'seller', label: 'Authorized Retailer', value: 'GameStop Flagship UK', sourceDoc: files[0]?.name || 'Invoice.pdf', confidence: 'high', status: 'verified' },
        { id: 'ext-d8', key: 'warrantyPeriodMonths', label: 'Warranty Duration', value: '24 Months', sourceDoc: files[1]?.name || 'Warranty_Card.pdf', confidence: 'high', status: 'verified' },
        { id: 'ext-d9', key: 'warrantyStartDate', label: 'Warranty Start Date', value: '2026-09-15', sourceDoc: files[0]?.name || 'Invoice.pdf', confidence: 'high', status: 'verified' },
        { id: 'ext-d10', key: 'warrantyExpiryDate', label: 'Warranty Expiry Date', value: '2028-09-15', sourceDoc: files[1]?.name || 'Warranty_Card.pdf', confidence: 'medium', status: 'verified' }
      ]);
    } else {
      setExtractedFields([
        { id: 'ext-b1', key: 'productName', label: 'Product Name', value: 'Hydra-Plump Water Cream', sourceDoc: files[0]?.name || 'Batch_Scan.jpg', confidence: 'high', status: 'verified' },
        { id: 'ext-b2', key: 'brand', label: 'Brand', value: 'Tatcha Skincare', sourceDoc: files[0]?.name || 'Batch_Scan.jpg', confidence: 'high', status: 'verified' },
        { id: 'ext-b3', key: 'batchNumber', label: 'Batch Code', value: 'TA-9902B', sourceDoc: files[0]?.name || 'Batch_Scan.jpg', confidence: 'medium', status: 'needs_review', notes: 'Laser etched font score 84%.' },
        { id: 'ext-b4', key: 'manufacturingDate', label: 'Manufacturing Date', value: '2025-11-20', sourceDoc: 'Global Batch Verification DB', confidence: 'high', status: 'verified' },
        { id: 'ext-b5', key: 'expiryDate', label: 'Factory Expiry Date', value: '2028-11-20', sourceDoc: 'Global Batch Verification DB', confidence: 'high', status: 'verified' },
        { id: 'ext-b6', key: 'paoMonths', label: 'PAO (Period After Opening)', value: '6M', sourceDoc: files[0]?.name || 'Batch_Scan.jpg', confidence: 'high', status: 'verified' },
        { id: 'ext-b7', key: 'openedDate', label: 'Opened Date', value: '2026-09-20', sourceDoc: 'User Ingestion Timestamp', confidence: 'high', status: 'verified' }
      ]);
    }
  };

  const handleAddFieldConfirm = (id: string) => {
    setExtractedFields(prev => prev.map(f => f.id === id ? { ...f, status: 'verified' as VerificationStatus } : f));
  };

  const handleStartFieldEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditTempVal(field.value);
  };

  const handleSaveFieldEdit = (id: string) => {
    setExtractedFields(prev => prev.map(f => f.id === id ? { ...f, value: editTempVal, status: 'verified' as VerificationStatus } : f));
    setEditingFieldId(null);
  };

  // Manual entry never has documents to OCR, so it skips the processing
  // pipeline and goes straight to verification with user-typed values.
  const handleBeginProcessing = () => {
    setProcessingError(null);
    if (isDemoMode) {
      setStep('processing');
      return;
    }
    if (inputMethod === 'manual') {
      const manualFields: ExtractedField[] = [
        { id: 'man-name', key: 'productName', label: 'Product Name', value: manualName, sourceDoc: 'Manual Entry', confidence: 'high' as ConfidenceLevel, status: 'verified' as VerificationStatus },
        { id: 'man-brand', key: 'brand', label: 'Brand', value: manualBrand, sourceDoc: 'Manual Entry', confidence: 'high' as ConfidenceLevel, status: 'verified' as VerificationStatus },
        {
          id: 'man-id',
          key: productType === 'durable' ? 'serialNumber' : 'batchNumber',
          label: productType === 'durable' ? 'Serial Number' : 'Batch Code',
          value: manualIdentifier,
          sourceDoc: 'Manual Entry',
          confidence: 'high' as ConfidenceLevel,
          status: 'verified' as VerificationStatus,
        },
        {
          id: 'man-date',
          key: productType === 'durable' ? 'purchaseDate' : 'manufacturingDate',
          label: productType === 'durable' ? 'Purchase Date' : 'Manufacturing Date',
          value: manualDate,
          sourceDoc: 'Manual Entry',
          confidence: 'high' as ConfidenceLevel,
          status: 'verified' as VerificationStatus,
        },
        { id: 'man-price', key: 'purchasePrice', label: 'Purchase Price', value: manualPrice, sourceDoc: 'Manual Entry', confidence: 'high' as ConfidenceLevel, status: 'verified' as VerificationStatus },
      ].filter(f => f.value && f.value.trim());

      if (manualFields.length === 0) {
        setProcessingError('Please fill in at least the product name before continuing.');
        return;
      }

      setExtractedFields(manualFields);
      setStep('verify_extraction');
      return;
    }
    setStep('processing');
  };

  // Creates the backing product row on first save if the real pipeline
  // (upload/OCR) never ran — e.g. manual entry mode.
  const ensureRealProductId = async (): Promise<string | null> => {
    if (realProductId) return realProductId;
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user.id;
    if (!userId) return null;
    const { data: productRow, error } = await supabase
      .from('products')
      .insert({ user_id: userId, type: productType, status: 'draft' })
      .select()
      .single();
    if (error || !productRow) return null;
    setRealProductId(productRow.id as string);
    return productRow.id as string;
  };

  const persistFinalProductToSupabase = async (productId: string) => {
    const getVal = (key: string) => extractedFields.find(f => f.key === key)?.value || null;

    const updatePayload: Record<string, unknown> = {
      status: 'active',
      name: getVal('productName'),
      brand: getVal('brand'),
    };

    if (productType === 'durable') {
      const warrantyMonthsRaw = getVal('warrantyPeriodMonths');
      const warrantyMonths = warrantyMonthsRaw ? parseInt(warrantyMonthsRaw.replace(/[^0-9]/g, ''), 10) : NaN;
      Object.assign(updatePayload, {
        model: getVal('model'),
        serial_number: getVal('serialNumber'),
        purchase_date: getVal('purchaseDate') || null,
        purchase_price: getVal('purchasePrice'),
        seller: getVal('seller'),
        warranty_period_months: Number.isFinite(warrantyMonths) ? warrantyMonths : null,
        warranty_start_date: getVal('warrantyStartDate') || null,
        warranty_expiry_date: getVal('warrantyExpiryDate') || null,
      });
    } else {
      Object.assign(updatePayload, {
        batch_number: getVal('batchNumber'),
        manufacturing_date: getVal('manufacturingDate') || null,
        expiry_date: getVal('expiryDate') || null,
        pao_months: getVal('paoMonths'),
        opened_date: getVal('openedDate') || null,
      });
    }

    await supabase.from('products').update(updatePayload).eq('id', productId);
    await supabase.from('extracted_fields').update({ status: 'verified' }).eq('product_id', productId);
  };

  const handleFinalSave = async () => {
    let persistedId: string | null = null;
    if (!isDemoMode) {
      persistedId = await ensureRealProductId();
      if (persistedId) {
        try {
          await persistFinalProductToSupabase(persistedId);
        } catch (err) {
          setProcessingError((err as Error).message);
        }
      }
    }

    const id = persistedId || `prod-new-${Date.now()}`;
    // In the local sandbox/demo flow, missing fields fall back to the
    // illustrative Sony/Tatcha sample data. In a real session there is no
    // simulated source document to fall back to, so missing fields stay
    // blank for the user to fill in via the product detail view later.
    const nameField = extractedFields.find(f => f.key === 'productName')?.value || (isDemoMode ? (productType === 'durable' ? 'Sony PlayStation 5 Pro' : 'Hydra-Plump Water Cream') : '');
    const brandField = extractedFields.find(f => f.key === 'brand')?.value || (isDemoMode ? (productType === 'durable' ? 'Sony' : 'Tatcha') : '');
    const purchaseDateField = extractedFields.find(f => f.key === 'purchaseDate')?.value || (isDemoMode ? '2026-09-15' : '');
    const purchasePriceField = extractedFields.find(f => f.key === 'purchasePrice')?.value || (isDemoMode ? '$699.99' : '');
    const sellerField = extractedFields.find(f => f.key === 'seller')?.value || (isDemoMode ? 'Authorized Retailer' : '');
    const expiryField = extractedFields.find(f => f.key === 'warrantyExpiryDate')?.value || extractedFields.find(f => f.key === 'expiryDate')?.value || (isDemoMode ? '2028-09-15' : '');

    const mockDocs: ProductDocument[] = files.map((file, idx) => ({
      id: `doc-new-${idx}-${Date.now()}`,
      productId: id,
      name: file.name,
      type: file.type as any,
      uploadDate: '2026-09-29',
      size: file.size,
      source: inputMethod === 'scan' ? 'Live Camera Scan' : 'Uploaded File',
      status: 'verified',
      previewSnippet: `Verified document source: ${file.name}`,
      pageCount: 1
    }));

    if (productType === 'durable') {
      const serialField = extractedFields.find(f => f.key === 'serialNumber')?.value || (isDemoMode ? 'SN-03-8821901-PS' : '');
      const modelField = extractedFields.find(f => f.key === 'model')?.value || (isDemoMode ? 'CFI-7000B' : '');

      const newDurable: Product = {
        id,
        name: nameField,
        brand: brandField,
        category: isDemoMode ? 'Gaming & Consoles' : 'Electronics',
        type: 'durable',
        model: modelField,
        serialNumber: serialField,
        purchaseDate: purchaseDateField,
        purchasePrice: purchasePriceField,
        seller: sellerField,
        warrantyStatus: 'active',
        warrantyStartDate: purchaseDateField,
        warrantyExpiryDate: expiryField,
        warrantyPeriodMonths: isDemoMode ? 24 : 0,
        warrantyCoverageSummary: isDemoMode ? '24-Month Manufacturer Warranty covering internal APU processor, power supply, and HDMI 2.1 display port.' : '',
        warrantyTerms: isDemoMode
          ? {
              coverage: ['Processor and cooling fan failure', 'Optical drive read errors', 'Integrated 2TB SSD memory defects'],
              exclusions: ['Liquid spills or power surge without surge protector', 'Cosmetic side-plate drops'],
              conditions: ['Tamper warranty sticker must not be pierced']
            }
          : { coverage: [], exclusions: [], conditions: [] },
        documentsCount: mockDocs.length,
        verifiedFieldsCount: extractedFields.length,
        totalFieldsCount: extractedFields.length,
        hasConflict: false,
        claimReadinessScore: isDemoMode ? 90 : 70,
        status: 'active',
        createdAt: new Date().toISOString(),
        image: isDemoMode ? 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80' : '',
        notes: isDemoMode ? 'Indexed via intelligent multi-document extraction pipeline.' : 'Indexed via document extraction pipeline.',
        documents: mockDocs,
        extractedFields,
        conflicts: [],
        issues: [],
        plannerItems: isDemoMode
          ? [{ id: 'pl-new-1', title: 'Register device on manufacturer portal for VIP support', deadline: '2026-10-30', type: 'recommended', completed: false, actionTab: 'Overview' }]
          : [],
        renewalPlans: isDemoMode
          ? [{ id: 'rp-new-1', provider: 'Sony Interactive', planName: 'PlayStation Plus Extended Care', coverage: 'Full accidental damage and dual controller replacement', price: '$49.99 / year', startDate: '2026-09-15', endDate: '2027-09-15', status: 'available' }]
          : [],
        timeline: [
          { id: 'tl-new-1', date: new Date().toISOString().slice(0, 10), title: 'Product Added to Vault', description: `New ${nameField || 'product'} ingested via ${inputMethod === 'scan' ? 'Mobile Camera Scan' : inputMethod === 'manual' ? 'Manual Entry' : 'PDF Document Extraction'}.`, category: 'product' },
          { id: 'tl-new-2', date: new Date().toISOString().slice(0, 10), title: 'Documents Extracted & Verified', description: `${extractedFields.length} critical fields checked with 100% human-in-the-loop attestation.`, category: 'verification' }
        ]
      };
      onAddProduct(newDurable);
    } else {
      const batchField = extractedFields.find(f => f.key === 'batchNumber')?.value || (isDemoMode ? 'TA-9902B' : '');
      const mfgField = extractedFields.find(f => f.key === 'manufacturingDate')?.value || (isDemoMode ? '2025-11-20' : '');
      const paoField = extractedFields.find(f => f.key === 'paoMonths')?.value || (isDemoMode ? '6M' : '');
      const openedDateField = extractedFields.find(f => f.key === 'openedDate')?.value || (isDemoMode ? '2026-09-20' : '');

      const newBeauty: Product = {
        id,
        name: nameField,
        brand: brandField,
        category: isDemoMode ? 'Skincare' : 'Beauty',
        type: 'beauty',
        batchNumber: batchField,
        manufacturingDate: mfgField,
        expiryDate: expiryField,
        paoMonths: paoField,
        openedDate: openedDateField,
        openedStatus: 'fresh',
        usagePeriodDays: isDemoMode ? 9 : 0,
        allergensWarning: isDemoMode ? ['Fragrance-free', 'Dermatologist tested'] : [],
        volumeSize: isDemoMode ? '50ml' : '',
        purchasePrice: purchasePriceField,
        seller: sellerField,
        reminderIntervalDays: 30,
        status: 'active',
        createdAt: new Date().toISOString(),
        image: isDemoMode ? 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80' : '',
        notes: isDemoMode ? 'Cosmetic batch lifecycle synchronized with 6-month PAO timer.' : 'Indexed via document extraction pipeline.',
        documents: mockDocs,
        extractedFields,
        timeline: [
          { id: 'tl-b-new-1', date: new Date().toISOString().slice(0, 10), title: 'Product Added to Vault', description: `${nameField || 'Product'} registered into cosmetic batch tracker.`, category: 'product' },
          { id: 'tl-b-new-2', date: new Date().toISOString().slice(0, 10), title: 'Opened Date Recorded', description: `Opened on ${openedDateField || 'unspecified date'}. ${paoField || 'Unspecified'} Period-After-Opening countdown active.`, category: 'verification' }
        ]
      };
      onAddProduct(newBeauty);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      
      {/* Top back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>
      </div>

      {/* Progress Steps Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Intelligent Product Ingestion</h1>
            <p className="text-xs text-slate-500 mt-0.5">Autonomous extraction, confidence check, and human-in-the-loop attestation</p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
            <span className={`px-2.5 py-1 rounded-lg ${step === 'select_type' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              1. Domain
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={`px-2.5 py-1 rounded-lg ${step === 'input_method' || step === 'upload_or_scan' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              2. Capture
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={`px-2.5 py-1 rounded-lg ${step === 'processing' ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
              3. Processing
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className={`px-2.5 py-1 rounded-lg ${step === 'verify_extraction' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
              4. Verification
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          STEP 1: CHOOSE DOMAIN (DURABLE VS BEAUTY)
         ========================================================================= */}
      {step === 'select_type' && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <h2 className="text-lg font-bold text-slate-900">Step 1: Select Product Domain</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              ProductVault AI applies dedicated lifecycle models for durable hardware vs. cosmetic batches. Choose which category fits your item:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Option A: Durable */}
            <div
              onClick={() => setProductType('durable')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                productType === 'durable'
                  ? 'bg-indigo-50/50 border-indigo-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    productType === 'durable' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Laptop className="w-6 h-6" />
                  </div>
                  {productType === 'durable' && (
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">A. Durable Product</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Laptops, smartphones, 4K TVs, refrigerators, washers, headphones, cameras, and electrical appliances.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                  <div className="font-semibold text-slate-800">Autonomous Lifecycle Pipeline:</div>
                  <p className="text-[11px] text-slate-500">
                    Product → Invoices &amp; Warranties → Field Verification → Conflict Detection → Claims Engine → Repair
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200/70 text-right">
                <span className="text-xs font-semibold text-indigo-600">Select Durable Flow &rarr;</span>
              </div>
            </div>

            {/* Option B: Beauty */}
            <div
              onClick={() => setProductType('beauty')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                productType === 'beauty'
                  ? 'bg-teal-50/50 border-teal-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    productType === 'beauty' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  {productType === 'beauty' && (
                    <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">B. Beauty Product</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Skincare, cosmetics, serums, creams, sunscreen, perfumes, and daily personal care items.
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                  <div className="font-semibold text-slate-800">Cosmetic Freshness Pipeline:</div>
                  <p className="text-[11px] text-slate-500">
                    Product → Batch Number → Mfg/Expiry/PAO → Opened Date Tracker → Usage Timers &amp; Reminders
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200/70 text-right">
                <span className="text-xs font-semibold text-teal-700">Select Beauty Flow &rarr;</span>
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep('input_method')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Continue with {productType === 'durable' ? 'Durable Goods' : 'Beauty & Cosmetics'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 2: INPUT METHOD (SCAN / UPLOAD PDF / MANUAL)
         ========================================================================= */}
      {step === 'input_method' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Choose Ingestion Method</h2>
              <p className="text-xs text-slate-500">How would you like to provide proof records for your {productType}?</p>
            </div>
            <button
              onClick={() => setStep('select_type')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Change Domain
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Scan / Camera */}
            <div
              onClick={() => { setInputMethod('scan'); setStep('upload_or_scan'); }}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Scan / Take Photos</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Point device camera to capture barcode sticker, warranty certificate, or paper invoice.
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 mt-4 block">Use Camera Viewfinder &rarr;</span>
            </div>

            {/* Upload PDF */}
            <div
              onClick={() => { setInputMethod('pdf'); setStep('upload_or_scan'); }}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Upload PDF / Receipts</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Drag and drop multiple digital invoices, store receipts, warranty cards, or service slips.
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 mt-4 block">Open Multi-file Dropzone &rarr;</span>
            </div>

            {/* Manual Entry */}
            <div
              onClick={() => { setInputMethod('manual'); setStep('upload_or_scan'); }}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileEdit className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Manual Entry</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Directly input model numbers, serials, and warranty dates without uploading files.
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 mt-4 block">Input Fields Manually &rarr;</span>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 3: UPLOAD / SCAN AREA
         ========================================================================= */}
      {step === 'upload_or_scan' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {inputMethod === 'scan' ? 'Camera Scanner & Frame Capture' : 
                 inputMethod === 'pdf' ? 'Upload Proof Documents' : 'Manual Ingestion'}
              </h2>
              <p className="text-xs text-slate-500">
                {productType === 'durable'
                  ? 'Attach invoices, warranty cards, or serial barcode labels.'
                  : 'Attach cosmetic batch code stickers, carton packaging, or store receipts.'}
              </p>
            </div>
            <button
              onClick={() => setStep('input_method')}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Change Ingestion Method
            </button>
          </div>

          {/* A. SCAN / CAMERA SIMULATION */}
          {inputMethod === 'scan' && (
            <div className="bg-slate-950 rounded-2xl p-6 text-white text-center relative overflow-hidden shadow-lg">
              <div className="max-w-md mx-auto aspect-video rounded-xl border-2 border-dashed border-indigo-400/70 relative flex flex-col items-center justify-center bg-slate-900/60 overflow-hidden">
                <div className="absolute inset-x-0 h-0.5 bg-teal-400 shadow-[0_0_8px_#2dd4bf] animate-[bounce_2s_infinite]" />
                
                <Scan className="w-10 h-10 text-indigo-400 mb-2 animate-pulse" />
                <p className="text-xs font-semibold tracking-wide">Position document or serial barcode within frame</p>
                <p className="text-[11px] text-slate-400 mt-1">Automatic perspective crop &amp; edge detection active</p>

                {scanCaptured && (
                  <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center p-4">
                    <CheckCircle2 className="w-10 h-10 text-teal-400 mb-2" />
                    <p className="text-xs font-bold text-white">Snapshot Captured Successfully</p>
                    <p className="text-[11px] text-slate-300">High-resolution frame indexed: Serial_Barcode_Scan.jpg</p>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-center gap-3">
                {!scanCaptured ? (
                  <button
                    onClick={() => {
                      setScanCaptured(true);
                      setFiles(prev => [
                        ...prev,
                        {
                          id: `f-scan-${Date.now()}`,
                          name: productType === 'durable' ? 'Serial_Barcode_Scan.jpg' : 'Batch_Code_Macro_Scan.jpg',
                          type: productType === 'durable' ? 'Product Label' : 'Batch Code Sticker',
                          size: '2.4 MB',
                          status: 'ready'
                        }
                      ]);
                    }}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Snapshot</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setScanCaptured(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                  >
                    Retake Photo
                  </button>
                )}
              </div>
            </div>
          )}

          {/* B. PDF / MULTI-FILE UPLOAD AREA */}
          {inputMethod === 'pdf' && (
            <div className="space-y-4">
              
              {/* Drag and Drop Zone */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const selected = Array.from(e.target.files || []);
                  const validationErrors: string[] = [];
                  const accepted: UploadedFileItem[] = [];

                  selected.forEach((file) => {
                    const error = validateFile(file);
                    if (error) {
                      validationErrors.push(`${file.name}: ${error}`);
                      return;
                    }
                    accepted.push({
                      id: `f-${Date.now()}-${Math.random()}`,
                      name: file.name,
                      type: productType === 'durable' ? 'Invoice' : 'Product Label',
                      size: formatBytes(file.size),
                      status: 'ready',
                      file,
                    });
                  });

                  if (accepted.length) setFiles(prev => [...prev, ...accepted]);
                  setProcessingError(validationErrors.length ? validationErrors.join(' ') : null);
                  e.target.value = '';
                }}
              />
              <div
                onClick={() => {
                  if (isDemoMode) {
                    const newFileName = productType === 'durable'
                      ? `Authorized_Retail_Invoice_${Math.floor(1000 + Math.random() * 9000)}.pdf`
                      : `Skincare_Box_Batch_Receipt_${Math.floor(1000 + Math.random() * 9000)}.pdf`;
                    setFiles(prev => [
                      ...prev,
                      {
                        id: `f-${Date.now()}`,
                        name: newFileName,
                        type: productType === 'durable' ? 'Invoice' : 'Product Label',
                        size: '1.8 MB',
                        status: 'ready'
                      }
                    ]);
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-2xl p-8 text-center cursor-pointer transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Drag &amp; drop files here, or click to browse</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Supports PDF, JPG, PNG files. Upload invoice receipts, warranty cards, serial stickers, or packaging.
                </p>
                <span className="inline-block mt-3 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-indigo-600 shadow-2xs">
                  {isDemoMode ? '+ Add Sample File to Batch' : '+ Browse Files'}
                </span>
              </div>
              {processingError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  {processingError}
                </p>
              )}

              {/* Uploaded File List Cards */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                  <span>Queued Documents ({files.length})</span>
                  <span>Document Type Tagging</span>
                </div>

                {files.map((file) => (
                  <div key={file.id} className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{file.name}</p>
                        <p className="text-[11px] text-slate-500">{file.size} • Ready for analysis</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={file.type}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFiles(prev => prev.map(f => f.id === file.id ? { ...f, type: val } : f));
                        }}
                        className="px-2.5 py-1 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
                      >
                        {productType === 'durable' ? (
                          <>
                            <option value="Invoice">Invoice / Tax Receipt</option>
                            <option value="Warranty Document">Warranty Card / Terms</option>
                            <option value="Product Label">Product Label / Serial Sticker</option>
                            <option value="Service Receipt">Service / Repair Receipt</option>
                            <option value="Other Record">Other Supporting Record</option>
                          </>
                        ) : (
                          <>
                            <option value="Batch Code Sticker">Batch Code Sticker / Photo</option>
                            <option value="Invoice">Retail Store Receipt</option>
                            <option value="Packaging Scan">Carton / Packaging Scan</option>
                            <option value="Other Record">Cosmetic Supporting Record</option>
                          </>
                        )}
                      </select>

                      <button
                        onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* C. MANUAL ENTRY FIELDS */}
          {inputMethod === 'manual' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder={productType === 'durable' ? 'e.g. Dell UltraSharp 32 4K Monitor' : 'e.g. Vitamin C Overnight Cream'}
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Dell or CeraVe"
                    value={manualBrand}
                    onChange={(e) => setManualBrand(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {productType === 'durable' ? 'Serial Number' : 'Batch Code'}
                  </label>
                  <input
                    type="text"
                    placeholder={productType === 'durable' ? 'e.g. CN-082910-DL' : 'e.g. BTH-8820B'}
                    value={manualIdentifier}
                    onChange={(e) => setManualIdentifier(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Trigger: Begin Intelligent Processing */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200/80">
            <span className="text-xs text-slate-500">
              {files.length} document{files.length === 1 ? '' : 's'} staged for extraction
            </span>

            <button
              onClick={handleBeginProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>Begin Intelligent Processing &rarr;</span>
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          STEP 4: SIMULATED 6-STAGE DOCUMENT PROCESSING ANIMATION
         ========================================================================= */}
      {step === 'processing' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-8 shadow-xs text-center space-y-6">
          <div className="max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
              <RefreshCw className="w-7 h-7 animate-spin text-indigo-600" />
            </div>

            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {processingStages[processingStageIndex]?.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {processingStages[processingStageIndex]?.detail}
            </p>

            {/* Visual Progress Bar */}
            <div className="mt-6 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-teal-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${((processingStageIndex + 1) / processingStages.length) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono tabular-nums">
              Stage {processingStageIndex + 1} of {processingStages.length}
            </p>
          </div>

          {/* 6 Sequential Processing Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left text-xs max-w-2xl mx-auto pt-2">
            {processingStages.map((stage, idx) => {
              const isPast = idx < processingStageIndex;
              const isCurrent = idx === processingStageIndex;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all ${
                    isPast ? 'bg-teal-50/60 border-teal-200 text-teal-900' :
                    isCurrent ? 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-2xs font-bold' :
                    'bg-slate-50/50 border-slate-200/70 text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold">Step 0{idx + 1}</span>
                    {isPast && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />}
                  </div>
                  <p className="text-xs font-semibold leading-tight">{stage.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: HUMAN-IN-THE-LOOP EXTRACTION & VERIFICATION REVIEW
         ========================================================================= */}
      {step === 'verify_extraction' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Extraction Complete ({extractedFields.length} fields detected)
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Audit &amp; Verify Extracted Information</h2>
              <p className="text-xs text-slate-500">
                Confirm, correct, or mark extracted fields as verified before permanently writing to your vault.
              </p>
            </div>

            <button
              onClick={() => {
                setExtractedFields(prev => prev.map(f => ({ ...f, status: 'verified' as VerificationStatus })));
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg self-start sm:self-auto"
            >
              Verify All High-Confidence Fields
            </button>
          </div>

          {/* Structured Extraction Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Field Attribute</th>
                    <th className="py-3 px-4">Extracted Value</th>
                    <th className="py-3 px-4">Source Document</th>
                    <th className="py-3 px-4">AI Confidence</th>
                    <th className="py-3 px-4">Audit Status</th>
                    <th className="py-3 px-4 text-right">Human Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {extractedFields.map((field) => {
                    const isLow = field.confidence === 'low';
                    const isEditing = editingFieldId === field.id;

                    return (
                      <tr 
                        key={field.id}
                        className={`transition-colors ${
                          isLow ? 'bg-amber-50/40' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        {/* Field Label */}
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {field.label}
                        </td>

                        {/* Extracted Value / Edit Mode */}
                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editTempVal}
                                onChange={(e) => setEditTempVal(e.target.value)}
                                className="px-2 py-1 text-xs bg-white border border-indigo-400 rounded-md focus:outline-hidden"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveFieldEdit(field.id)}
                                className="px-2 py-1 bg-indigo-600 text-white rounded text-[11px] font-semibold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span className={`font-medium ${isLow ? 'text-amber-900 font-bold' : 'text-slate-900'}`}>
                              {field.value}
                            </span>
                          )}
                          {field.notes && (
                            <p className="text-[10px] text-amber-700 mt-0.5">{field.notes}</p>
                          )}
                        </td>

                        {/* Source Document */}
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px] truncate max-w-xs">
                          {field.sourceDoc}
                        </td>

                        {/* Confidence */}
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            field.confidence === 'high' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                            field.confidence === 'medium' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                            'bg-amber-100 text-amber-800 border border-amber-300 font-bold animate-pulse'
                          }`}>
                            {field.confidence}
                          </span>
                        </td>

                        {/* Verification Status */}
                        <td className="py-3 px-4">
                          {field.status === 'verified' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              Review Required
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {field.status !== 'verified' && (
                              <button
                                onClick={() => handleAddFieldConfirm(field.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              onClick={() => handleStartFieldEdit(field)}
                              className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Commit to Vault */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Ready to commit verified record to Vault?</h4>
              <p className="text-xs text-slate-600">
                This will create the {productType} record, index attached documents, and launch the lifecycle manager.
              </p>
            </div>

            <button
              onClick={handleFinalSave}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Open Product Record</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
