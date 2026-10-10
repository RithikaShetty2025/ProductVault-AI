import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Building2, 
  Tag, 
  Barcode, 
  ShieldAlert, 
  Sparkles, 
  RefreshCw, 
  ExternalLink,
  ChevronRight,
  Info,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Download,
  Check,
  X,
  Eye,
  FileCheck,
  AlertCircle,
  HelpCircle,
  FileSpreadsheet,
  ChevronDown,
  Navigation,
  Phone,
  Star,
  MapPin,
  CalendarCheck,
  SlidersHorizontal,
  Flame,
  Droplet
} from 'lucide-react';
import { 
  Product, 
  DurableProduct, 
  BeautyProduct, 
  AppRoute, 
  ProductDocument, 
  ExtractedField, 
  DocumentConflict, 
  ProductIssue, 
  PlannerItem, 
  RenewalPlan, 
  TimelineEvent, 
  ServiceCenter,
  ClaimChecklistItem 
} from '../types';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
  onNavigate: (route: AppRoute) => void;
  onUpdateProduct: (updated: Product) => void;
  onTriggerToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onBack,
  onNavigate,
  onUpdateProduct,
  onTriggerToast
}) => {
  const isDurable = product.type === 'durable';
  const durable = isDurable ? (product as DurableProduct) : null;
  const beauty = !isDurable ? (product as BeautyProduct) : null;

  // Tabs
  type DurableTab = 'Overview' | 'Documents' | 'Verify' | 'Conflicts' | 'Warranty' | 'Issues' | 'Claims' | 'Planner' | 'Renewal' | 'Timeline';
  type BeautyTab = 'Overview' | 'Documents' | 'Verify' | 'Timeline';

  const durableTabs: DurableTab[] = ['Overview', 'Documents', 'Verify', 'Conflicts', 'Warranty', 'Issues', 'Claims', 'Planner', 'Renewal', 'Timeline'];
  const beautyTabs: BeautyTab[] = ['Overview', 'Documents', 'Verify', 'Timeline'];

  const [activeTab, setActiveTab] = useState<string>('Overview');

  // Modals & Panels
  const [docPreviewModal, setDocPreviewModal] = useState<ProductDocument | null>(null);
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);
  const [serviceCentersOpen, setServiceCentersOpen] = useState(false);
  const [claimBundleOpen, setClaimBundleOpen] = useState(false);
  const [denialAnalyzerOpen, setDenialAnalyzerOpen] = useState(false);
  const [addRenewalOpen, setAddRenewalOpen] = useState(false);
  const [openedDateModalOpen, setOpenedDateModalOpen] = useState(false);

  // Inline editing state for Verify tab
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingFieldValue, setEditingFieldValue] = useState('');

  // Conflict resolution manual input
  const [conflictManualVals, setConflictManualVals] = useState<Record<string, string>>({});

  // Issue reporting form state
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [newIssueCategory, setNewIssueCategory] = useState<'Hardware' | 'Display' | 'Audio / Speaker' | 'Battery / Power' | 'Connectivity'>('Hardware');
  const [newIssueSeverity, setNewIssueSeverity] = useState<'critical' | 'moderate' | 'minor'>('moderate');
  const [newIssueEvidenceName, setNewIssueEvidenceName] = useState('Hardware_Defect_Photo_1.jpg');

  // New Document Upload form state
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<any>('Invoice');
  const [newDocSnippet, setNewDocSnippet] = useState('');

  // New Renewal Plan form state
  const [newPlanProvider, setNewPlanProvider] = useState('');
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanCoverage, setNewPlanCoverage] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('$79.00 / year');

  // New Opened Date state for Beauty
  const [tempOpenedDate, setTempOpenedDate] = useState(beauty?.openedDate || '2026-09-29');

  // Helper: append a timeline event
  const logTimelineEvent = (title: string, description: string, category: any) => {
    const newEvent: TimelineEvent = {
      id: `tl-${Date.now()}`,
      date: 'Just now',
      title,
      description,
      category
    };
    return [newEvent, ...(product.timeline || [])];
  };

  // ---------------------------------------------------------------------------
  // HANDLERS FOR VERIFICATION
  // ---------------------------------------------------------------------------
  const handleVerifyField = (fieldId: string) => {
    const updatedFields = (product.extractedFields || []).map(f => {
      if (f.id === fieldId) {
        return { ...f, status: 'verified' as const };
      }
      return f;
    });

    const targetField = updatedFields.find(f => f.id === fieldId);
    let updatedProduct: Product = {
      ...product,
      extractedFields: updatedFields,
      timeline: logTimelineEvent(
        `Field Verified: ${targetField?.label}`,
        `Attested value "${targetField?.value}" from source ${targetField?.sourceDoc}.`,
        'verification'
      )
    };

    if (isDurable && targetField?.key === 'serialNumber') {
      updatedProduct = {
        ...updatedProduct,
        serialNumber: targetField.value,
        claimReadinessScore: Math.min(100, (durable?.claimReadinessScore || 80) + 5)
      } as DurableProduct;
    }

    onUpdateProduct(updatedProduct);
    onTriggerToast('success', 'Field Verified', `${targetField?.label} marked as verified.`);
  };

  const handleSaveFieldEdit = (fieldId: string) => {
    const updatedFields = (product.extractedFields || []).map(f => {
      if (f.id === fieldId) {
        return { ...f, value: editingFieldValue, status: 'verified' as const };
      }
      return f;
    });

    const targetField = updatedFields.find(f => f.id === fieldId);
    let updatedProduct: Product = {
      ...product,
      extractedFields: updatedFields,
      timeline: logTimelineEvent(
        `Field Corrected: ${targetField?.label}`,
        `Updated value to "${editingFieldValue}" with verified human approval.`,
        'verification'
      )
    };

    if (isDurable) {
      if (targetField?.key === 'serialNumber') {
        updatedProduct = { ...updatedProduct, serialNumber: editingFieldValue } as DurableProduct;
      } else if (targetField?.key === 'model') {
        updatedProduct = { ...updatedProduct, model: editingFieldValue } as DurableProduct;
      } else if (targetField?.key === 'purchaseDate') {
        updatedProduct = { ...updatedProduct, purchaseDate: editingFieldValue } as DurableProduct;
      }
    } else {
      if (targetField?.key === 'batchNumber') {
        updatedProduct = { ...updatedProduct, batchNumber: editingFieldValue } as BeautyProduct;
      }
    }

    onUpdateProduct(updatedProduct);
    setEditingFieldId(null);
    onTriggerToast('success', 'Field Updated', `${targetField?.label} saved and verified.`);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS FOR CONFLICT RESOLUTION
  // ---------------------------------------------------------------------------
  const handleResolveConflictValue = (conflictId: string, resolvedVal: string) => {
    if (!isDurable || !durable) return;

    const targetConflict = (durable.conflicts || []).find(c => c.id === conflictId);
    if (!targetConflict) return;

    const updatedConflicts: DocumentConflict[] = (durable.conflicts || []).map(c => {
      if (c.id === conflictId) {
        return {
          ...c,
          status: 'resolved' as const,
          resolvedValue: resolvedVal,
          resolvedAt: 'Just now'
        };
      }
      return c;
    });

    // Update the actual field on durable product
    let updatedProd: DurableProduct = {
      ...durable,
      conflicts: updatedConflicts,
      hasConflict: updatedConflicts.some(c => c.status !== 'resolved'),
      status: 'active',
      claimReadinessScore: Math.min(100, durable.claimReadinessScore + 18),
      timeline: logTimelineEvent(
        `Conflict Resolved: ${targetConflict.fieldLabel}`,
        `Synchronized to "${resolvedVal}" between ${targetConflict.sourceA.docName} and ${targetConflict.sourceB.docName}.`,
        'conflict'
      )
    };

    if (targetConflict.fieldKey === 'purchaseDate') {
      updatedProd.purchaseDate = resolvedVal;
    } else if (targetConflict.fieldKey === 'serialNumber') {
      updatedProd.serialNumber = resolvedVal;
    } else if (targetConflict.fieldKey === 'model') {
      updatedProd.model = resolvedVal;
    }

    // Also sync extractedFields
    updatedProd.extractedFields = (updatedProd.extractedFields || []).map(f => {
      if (f.key === targetConflict.fieldKey) {
        return { ...f, value: resolvedVal, status: 'verified' as const, confidence: 'high' };
      }
      return f;
    });

    onUpdateProduct(updatedProd);
    onTriggerToast('success', 'Conflict Resolved', `${targetConflict.fieldLabel} synchronized to ${resolvedVal}.`);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS FOR ISSUE REPORTING
  // ---------------------------------------------------------------------------
  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDurable || !durable) return;
    if (!newIssueTitle.trim()) return;

    const newIssue: ProductIssue = {
      id: `iss-${Date.now()}`,
      productId: product.id,
      title: newIssueTitle,
      description: newIssueDesc,
      category: newIssueCategory,
      date: new Date().toISOString().split('T')[0],
      severity: newIssueSeverity,
      status: 'open',
      evidenceDocName: newIssueEvidenceName || undefined
    };

    const updatedProd: DurableProduct = {
      ...durable,
      issues: [newIssue, ...(durable.issues || [])],
      status: 'claim_in_progress',
      timeline: logTimelineEvent(
        `Issue Reported: ${newIssueTitle}`,
        `${newIssueCategory} failure flagged (${newIssueSeverity} severity). Diagnostic evidence linked.`,
        'issue'
      )
    };

    onUpdateProduct(updatedProd);
    setNewIssueTitle('');
    setNewIssueDesc('');
    onTriggerToast('info', 'Issue Logged', `Case opened: ${newIssueTitle}. Claim readiness updated.`);
  };

  // ---------------------------------------------------------------------------
  // HANDLERS FOR DOCUMENT MANAGEMENT
  // ---------------------------------------------------------------------------
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: ProductDocument = {
      id: `doc-${Date.now()}`,
      productId: product.id,
      name: newDocName,
      type: newDocType,
      uploadDate: new Date().toISOString().split('T')[0],
      size: '1.5 MB',
      source: 'Direct Upload',
      status: 'verified',
      previewSnippet: newDocSnippet || `Verified ${newDocType} indexed on ${new Date().toLocaleDateString()}.`,
      pageCount: 1
    };

    const updatedProd: Product = {
      ...product,
      documents: [newDoc, ...(product.documents || [])],
      timeline: logTimelineEvent(
        `Document Uploaded: ${newDocName}`,
        `${newDocType} attached to vault record and OCR indexed.`,
        'document'
      )
    };

    if (isDurable) {
      (updatedProd as DurableProduct).documentsCount = updatedProd.documents.length;
      (updatedProd as DurableProduct).claimReadinessScore = Math.min(100, ((durable?.claimReadinessScore || 70) + 15));
    }

    onUpdateProduct(updatedProd);
    setDocUploadModalOpen(false);
    setNewDocName('');
    setNewDocSnippet('');
    onTriggerToast('success', 'Document Attached', `${newDocName} added to vault records.`);
  };

  const handleDeleteDocument = (docId: string) => {
    const docToDelete = (product.documents || []).find(d => d.id === docId);
    const updatedProd: Product = {
      ...product,
      documents: (product.documents || []).filter(d => d.id !== docId),
      timeline: logTimelineEvent(
        `Document Removed: ${docToDelete?.name || 'File'}`,
        'Removed from active vault indexing.',
        'document'
      )
    };
    if (isDurable) {
      (updatedProd as DurableProduct).documentsCount = updatedProd.documents.length;
    }
    onUpdateProduct(updatedProd);
    onTriggerToast('info', 'Document Removed', 'File unlinked from product record.');
  };

  // ---------------------------------------------------------------------------
  // HANDLERS FOR PLANNER
  // ---------------------------------------------------------------------------
  const handleTogglePlannerItem = (itemId: string) => {
    if (!isDurable || !durable) return;

    const updatedPlanner = (durable.plannerItems || []).map(p => {
      if (p.id === itemId) {
        return { ...p, completed: !p.completed };
      }
      return p;
    });

    const targetItem = updatedPlanner.find(p => p.id === itemId);

    const updatedProd: DurableProduct = {
      ...durable,
      plannerItems: updatedPlanner,
      timeline: targetItem?.completed ? logTimelineEvent(
        `Action Completed: ${targetItem.title}`,
        'Marked completed in Product Lifecycle Planner.',
        'product'
      ) : durable.timeline
    };

    onUpdateProduct(updatedProd);
    onTriggerToast('success', 'Planner Updated', targetItem?.completed ? 'Item marked completed.' : 'Item reopened.');
  };

  // ---------------------------------------------------------------------------
  // HANDLERS FOR RENEWALS
  // ---------------------------------------------------------------------------
  const handleAddRenewalPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDurable || !durable || !newPlanName.trim()) return;

    const newPlan: RenewalPlan = {
      id: `rp-${Date.now()}`,
      provider: newPlanProvider || durable.brand,
      planName: newPlanName,
      coverage: newPlanCoverage || 'Extended hardware and parts replacement protection',
      price: newPlanPrice,
      startDate: durable.warrantyExpiryDate,
      endDate: '2028-10-18',
      status: 'available'
    };

    const updatedProd: DurableProduct = {
      ...durable,
      renewalPlans: [newPlan, ...(durable.renewalPlans || [])],
      timeline: logTimelineEvent(
        `Extended Plan Added: ${newPlanName}`,
        `Protection plan quote from ${newPlan.provider} added to vault.`,
        'warranty'
      )
    };

    onUpdateProduct(updatedProd);
    setAddRenewalOpen(false);
    setNewPlanName('');
    setNewPlanProvider('');
    setNewPlanCoverage('');
    onTriggerToast('success', 'Plan Cataloged', `${newPlanName} added to renewal options.`);
  };

  const handleDeleteRenewalPlan = (planId: string) => {
    if (!isDurable || !durable) return;
    const updatedProd: DurableProduct = {
      ...durable,
      renewalPlans: (durable.renewalPlans || []).filter(p => p.id !== planId)
    };
    onUpdateProduct(updatedProd);
    onTriggerToast('info', 'Plan Removed', 'Policy option discarded.');
  };

  // ---------------------------------------------------------------------------
  // HANDLERS FOR BEAUTY LIFECYCLE
  // ---------------------------------------------------------------------------
  const handleUpdateOpenedDate = () => {
    if (!beauty) return;

    const updatedProd: BeautyProduct = {
      ...beauty,
      openedDate: tempOpenedDate,
      openedStatus: 'fresh',
      timeline: logTimelineEvent(
        'Opened Date Updated',
        `Product marked opened on ${tempOpenedDate}. PAO timer active.`,
        'verification'
      )
    };

    onUpdateProduct(updatedProd);
    setOpenedDateModalOpen(false);
    onTriggerToast('success', 'Opened Date Saved', `PAO cycle recalculated from ${tempOpenedDate}.`);
  };

  // ---------------------------------------------------------------------------
  // CLAIMS READINESS CHECKLIST (For Durable)
  // ---------------------------------------------------------------------------
  const claimChecklist: ClaimChecklistItem[] = isDurable && durable ? [
    {
      key: 'invoice',
      label: 'Store Purchase Invoice',
      status: (durable.documents || []).some(d => d.type === 'Invoice') ? 'available' : 'missing',
      docRef: (durable.documents || []).find(d => d.type === 'Invoice')?.name,
      actionLabel: 'Upload Invoice',
      actionTargetTab: 'Documents'
    },
    {
      key: 'warranty_card',
      label: 'Manufacturer Warranty Certificate',
      status: (durable.documents || []).some(d => d.type === 'Warranty Document') ? 'available' : 'missing',
      docRef: (durable.documents || []).find(d => d.type === 'Warranty Document')?.name,
      actionLabel: 'Upload Warranty Doc',
      actionTargetTab: 'Documents'
    },
    {
      key: 'serial',
      label: 'Verified Hardware Serial Number',
      status: (durable.extractedFields || []).find(f => f.key === 'serialNumber')?.status === 'verified'
        ? (durable.hasConflict ? 'conflict' : 'available')
        : 'needs_verification',
      docRef: durable.serialNumber,
      actionLabel: durable.hasConflict ? 'Resolve Conflict' : 'Verify Serial',
      actionTargetTab: durable.hasConflict ? 'Conflicts' : 'Verify'
    },
    {
      key: 'purchase_date',
      label: 'Purchase Date Attestation',
      status: durable.hasConflict ? 'conflict' : 'available',
      docRef: durable.purchaseDate,
      actionLabel: 'Audit Date',
      actionTargetTab: durable.hasConflict ? 'Conflicts' : 'Verify'
    },
    {
      key: 'issue_evidence',
      label: 'Issue Description & Defect Proof',
      status: (durable.issues || []).length > 0 ? 'available' : 'missing',
      docRef: durable.issues?.[0]?.title,
      actionLabel: 'Report Issue',
      actionTargetTab: 'Issues'
    }
  ] : [];

  const isClaimBundleReady = isDurable && claimChecklist.every(i => i.status === 'available');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      
      {/* Top Header / Back Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
            isDurable ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-teal-50 text-teal-700 border border-teal-200'
          }`}>
            {product.type} Domain Record
          </span>
          {isDurable && durable?.hasConflict && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-white animate-pulse">
              Active Conflict
            </span>
          )}
        </div>
      </div>

      {/* Main Product Hero Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Image */}
          <div className="w-full md:w-52 h-44 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative group">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/75 text-white backdrop-blur-xs">
              {product.category}
            </span>
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <span>{product.brand}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal normal-case">
                {isDurable ? durable?.model : (beauty?.volumeSize || 'Standard')}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{product.name}</h1>

            <div className="mt-2 text-xs text-slate-600 leading-relaxed max-w-2xl">
              {product.notes || 'Autonomous lifecycle intelligence record maintained by ProductVault.'}
            </div>

            {/* Quick Status Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              {isDurable ? (
                <>
                  <span className={`px-2.5 py-1 rounded-lg font-semibold ${
                    durable?.warrantyStatus === 'expiring_soon' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    durable?.warrantyStatus === 'expired' ? 'bg-rose-100 text-rose-800' : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}>
                    Warranty: {durable?.warrantyStatus === 'expiring_soon' ? 'Expiring in 18 Days' : durable?.warrantyStatus}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    SN: <span className="font-mono font-bold text-slate-900">{durable?.serialNumber}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                    Claim Readiness: {durable?.claimReadinessScore}%
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-semibold border border-teal-200">
                    PAO: {beauty?.paoMonths} ({beauty?.openedStatus})
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                    Batch: <span className="font-mono font-bold text-slate-900">{beauty?.batchNumber}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold">
                    {beauty?.openedDate ? `Opened ${beauty.openedDate}` : 'Sealed & Factory Fresh'}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Context Action Buttons */}
          <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            {isDurable ? (
              <>
                <button
                  onClick={() => setActiveTab('Issues')}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200/80 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Report Issue</span>
                </button>
                <button
                  onClick={() => onNavigate('/ai')}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Warranty AI</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setOpenedDateModalOpen(true)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-2xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Update Opened Date</span>
                </button>
                <button
                  onClick={() => onNavigate('/ai')}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Check Ingredients AI</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* DYNAMIC TAB NAVIGATION BAR */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {(isDurable ? durableTabs : beautyTabs).map((tab) => {
            const isActive = activeTab === tab;
            let badge = null;
            if (tab === 'Conflicts' && isDurable && durable?.hasConflict) {
              badge = <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse ml-1.5" />;
            } else if (tab === 'Documents') {
              badge = <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">{product.documents?.length || 0}</span>;
            } else if (tab === 'Issues' && isDurable && (durable?.issues?.length || 0) > 0) {
              badge = <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold">{durable?.issues?.length}</span>;
            }

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>{tab}</span>
                {badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW TAB (DURABLE & BEAUTY SEPARATE)
         ========================================================================= */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          {isDurable && durable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Hardware Specs & Identification */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-indigo-600" />
                    <span>Product Identification &amp; Purchase</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('Verify')}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Audit Values &rarr;
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Brand &amp; Line:</span>
                    <span className="font-semibold text-slate-800">{durable.brand}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Hardware Model:</span>
                    <span className="font-semibold text-slate-800">{durable.model}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Serial Number:</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{durable.serialNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Purchase Date:</span>
                    <span className="font-semibold text-slate-800">{durable.purchaseDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Purchase Price:</span>
                    <span className="font-mono font-semibold text-slate-800">{durable.purchasePrice || 'Not available'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Authorized Retailer:</span>
                    <span className="font-semibold text-slate-800">{durable.seller}</span>
                  </div>
                </div>
              </div>

              {/* Warranty Coverage Engine Overview */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Warranty &amp; Service Terms</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('Warranty')}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    View Clauses &rarr;
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Warranty Term:</span>
                    <span className="font-semibold text-slate-800">
                      {durable.warrantyDurationText
                        ? durable.warrantyDurationText
                        : durable.warrantyPeriodMonths > 0
                        ? `${durable.warrantyPeriodMonths} Months`
                        : 'Not available'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Coverage Duration:</span>
                    <span className="font-semibold text-slate-800">
                      {durable.warrantyStartDate || 'Unknown'} &rarr; {durable.warrantyExpiryDate || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Status:</span>
                    <span className={`font-semibold capitalize ${
                      durable.warrantyStatus === 'expiring_soon' ? 'text-amber-600 font-bold' :
                      durable.warrantyStatus === 'expired' ? 'text-rose-600' : 'text-teal-700'
                    }`}>
                      {durable.warrantyStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-800 block mb-0.5">Coverage Scope:</span>
                    {durable.warrantyCoverageSummary || 'Not available from uploaded documents yet.'}
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => setActiveTab('Claims')}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors text-center"
                  >
                    Check Claim Readiness ({durable.claimReadinessScore}%)
                  </button>
                  <button
                    onClick={() => onNavigate('/ai')}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                    title="Ask Warranty AI"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              </div>

            </div>
          )}

          {!isDurable && beauty && (
            <div className="space-y-6">
              
              {/* Visual Beauty Lifecycle Pipeline */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Cosmetic Freshness Lifecycle</h3>
                    <p className="text-xs text-slate-500">Tracking chemical stability from batch production to post-opening oxidation</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                    PAO: {beauty.paoMonths}
                  </span>
                </div>

                {/* 5-Stage Step Flow */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                  {[
                    { step: '1. Manufactured', date: beauty.manufacturingDate, status: 'done', desc: `Batch ${beauty.batchNumber}` },
                    { step: '2. Purchased', date: beauty.createdAt.split('T')[0], status: 'done', desc: beauty.seller || 'Store' },
                    { step: '3. Opened', date: beauty.openedDate || 'Unopened', status: beauty.openedDate ? 'done' : 'active', desc: beauty.openedDate ? 'Air seal broken' : 'Click to set' },
                    { step: '4. Usage Period', date: `${beauty.usagePeriodDays ?? 0} Days Remaining`, status: beauty.openedDate ? 'active' : 'pending', desc: `${beauty.paoMonths} window` },
                    { step: '5. Expiry', date: beauty.expiryDate, status: beauty.openedStatus === 'expiring_soon' ? 'warning' : 'pending', desc: 'Safety cutoff' }
                  ].map((s, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-xl border ${
                        s.status === 'done' ? 'bg-teal-50/60 border-teal-200 text-teal-900' :
                        s.status === 'active' ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold' :
                        s.status === 'warning' ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' :
                        'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <p className="text-[10px] uppercase font-bold opacity-75">{s.step}</p>
                      <p className="text-xs font-semibold mt-0.5">{s.date}</p>
                      <p className="text-[10px] opacity-80 mt-0.5">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beauty Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3 text-xs">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Tag className="w-4 h-4 text-teal-600" />
                    <span>Batch Identification &amp; Origins</span>
                  </h3>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Batch Code:</span>
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{beauty.batchNumber}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Manufacturing Date:</span>
                    <span className="font-semibold text-slate-800">{beauty.manufacturingDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Factory Expiry Date:</span>
                    <span className="font-semibold text-slate-800">{beauty.expiryDate}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Net Volume:</span>
                    <span className="font-semibold text-slate-800">{beauty.volumeSize || 'Standard'}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3 text-xs">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Usage Reminders &amp; PAO Tracker</span>
                  </h3>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">PAO Limit:</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{beauty.paoMonths}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Opened Date:</span>
                    <span className="font-semibold text-slate-900">{beauty.openedDate || 'Not yet opened'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Days Remaining:</span>
                    <span className="font-semibold text-slate-800">{beauty.usagePeriodDays ?? 0} days</span>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setOpenedDateModalOpen(true)}
                      className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-2xs transition-colors"
                    >
                      Update Opened Date &amp; Reset PAO Timer
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: DOCUMENTS TAB
         ========================================================================= */}
      {activeTab === 'Documents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Document Management Vault</h2>
              <p className="text-xs text-slate-500">
                Original source documents, verified OCR layers, and claim evidence on file for {product.name}
              </p>
            </div>

            <button
              onClick={() => setDocUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Attach New Document</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Indexed Proof Files ({(product.documents || []).length})</span>
              <span>Encrypted local storage simulation</span>
            </div>

            <div className="divide-y divide-slate-100">
              {(product.documents || []).map((doc) => (
                <div 
                  key={doc.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 truncate">{doc.name}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {doc.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Uploaded on {doc.uploadDate} • {doc.size} • Source: {doc.source}
                      </p>
                      {doc.previewSnippet && (
                        <p className="text-[11px] text-slate-400 mt-1 truncate font-mono">
                          OCR Excerpt: &quot;{doc.previewSnippet}&quot;
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setDocPreviewModal(doc)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {(product.documents || []).length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500">
                  No documents attached to this product record yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: VERIFY TAB (HUMAN-IN-THE-LOOP AUDIT)
         ========================================================================= */}
      {activeTab === 'Verify' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Human-in-the-Loop Field Verification</h2>
              <p className="text-xs text-slate-500">
                Audited data fields extracted from source invoices and certificates with confidence attestation
              </p>
            </div>

            <button
              onClick={() => {
                const verified = (product.extractedFields || []).map(f => ({ ...f, status: 'verified' as const }));
                onUpdateProduct({ ...product, extractedFields: verified });
                onTriggerToast('success', 'Batch Verified', 'All fields attested.');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 self-start sm:self-auto"
            >
              Mark All Fields Verified
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Field Attribute</th>
                    <th className="py-3 px-4">Extracted Value</th>
                    <th className="py-3 px-4">Source Document</th>
                    <th className="py-3 px-4">Confidence</th>
                    <th className="py-3 px-4">Audit Status</th>
                    <th className="py-3 px-4 text-right">Human Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(product.extractedFields || []).map((field) => {
                    const isLow = field.confidence === 'low';
                    const isEditing = editingFieldId === field.id;

                    return (
                      <tr 
                        key={field.id}
                        className={`transition-colors ${
                          isLow ? 'bg-amber-50/50' : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {field.label}
                        </td>

                        <td className="py-3 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editingFieldValue}
                                onChange={(e) => setEditingFieldValue(e.target.value)}
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

                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px] truncate max-w-xs">
                          {field.sourceDoc}
                        </td>

                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            field.confidence === 'high' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                            field.confidence === 'medium' ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                            'bg-amber-100 text-amber-800 border border-amber-300 font-bold animate-pulse'
                          }`}>
                            {field.confidence}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {field.status === 'verified' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Review Required
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {field.status !== 'verified' && (
                              <button
                                onClick={() => handleVerifyField(field.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setEditingFieldId(field.id);
                                setEditingFieldValue(field.value);
                              }}
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
        </div>
      )}

      {/* =========================================================================
          TAB 4: CONFLICTS TAB (DURABLE ONLY)
         ========================================================================= */}
      {activeTab === 'Conflicts' && isDurable && durable && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Document Conflict Detection</h2>
            <p className="text-xs text-slate-500">
              Cross-document discrepancies flagged by multi-pass extraction models between invoices and warranty registrations
            </p>
          </div>

          {(durable.conflicts || []).length > 0 ? (
            <div className="space-y-4">
              {(durable.conflicts || []).map((conflict) => {
                const isResolved = conflict.status === 'resolved';

                return (
                  <div 
                    key={conflict.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                      isResolved ? 'border-teal-200 bg-teal-50/20' : 'border-amber-300 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isResolved ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {conflict.status.replace('_', ' ')}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          Field: {conflict.fieldLabel}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500">
                        {isResolved ? `Resolved as: ${conflict.resolvedValue}` : 'Action Required'}
                      </span>
                    </div>

                    {/* Side by Side Sources */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Source A */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200">
                        <p className="text-[11px] font-bold uppercase text-slate-500 truncate mb-1">
                          Source A: {conflict.sourceA.docName}
                        </p>
                        <p className="text-base font-bold text-slate-900 font-mono">
                          {conflict.sourceA.value}
                        </p>
                        {!isResolved && (
                          <button
                            onClick={() => handleResolveConflictValue(conflict.id, conflict.sourceA.value)}
                            className="mt-3 w-full py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                          >
                            Accept Source A Value
                          </button>
                        )}
                      </div>

                      {/* Source B */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200">
                        <p className="text-[11px] font-bold uppercase text-slate-500 truncate mb-1">
                          Source B: {conflict.sourceB.docName}
                        </p>
                        <p className="text-base font-bold text-slate-900 font-mono">
                          {conflict.sourceB.value}
                        </p>
                        {!isResolved && (
                          <button
                            onClick={() => handleResolveConflictValue(conflict.id, conflict.sourceB.value)}
                            className="mt-3 w-full py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                          >
                            Accept Source B Value
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Custom Value Resolution Input */}
                    {!isResolved && (
                      <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                        <span className="text-xs text-slate-600 font-medium shrink-0">Or enter manual value:</span>
                        <input
                          type="text"
                          placeholder="Type authoritative value..."
                          value={conflictManualVals[conflict.id] || ''}
                          onChange={(e) => setConflictManualVals({ ...conflictManualVals, [conflict.id]: e.target.value })}
                          className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg flex-1"
                        />
                        <button
                          onClick={() => {
                            const val = conflictManualVals[conflict.id];
                            if (val) handleResolveConflictValue(conflict.id, val);
                          }}
                          className="px-4 py-1.5 bg-indigo-600 text-white font-semibold text-xs rounded-lg hover:bg-indigo-700"
                        >
                          Save Resolution
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-900">Zero Document Conflicts</p>
              <p className="text-slate-500 mt-0.5">All invoice records and warranty registration serial numbers align with 100% parity.</p>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 5: WARRANTY TAB (DURABLE ONLY)
         ========================================================================= */}
      {activeTab === 'Warranty' && isDurable && durable && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Warranty Coverage Engine</h2>
              <p className="text-xs text-slate-500">
                Coverage clauses, inclusions, exclusions, and statutory guarantee deadlines
              </p>
            </div>

            <button
              onClick={() => onNavigate('/ai')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Warranty AI Assistant</span>
            </button>
          </div>

          {/* Status Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Policy Status</p>
                <p className={`text-base font-bold mt-1 capitalize ${
                  durable.warrantyDurationConflict
                    ? 'text-amber-600'
                    : durable.warrantyStatus === 'expiring_soon'
                    ? 'text-amber-600'
                    : 'text-teal-700'
                }`}>
                  {durable.warrantyDurationConflict ? 'Needs Verification' : durable.warrantyStatus.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Coverage Term</p>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {durable.warrantyDurationText
                    ? durable.warrantyDurationText
                    : durable.warrantyPeriodMonths > 0
                    ? `${durable.warrantyPeriodMonths} Months`
                    : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Start Date</p>
                <p className="text-base font-bold text-slate-900 mt-1">{durable.warrantyStartDate || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Expiry Date</p>
                <p className="text-base font-bold text-slate-900 mt-1">{durable.warrantyExpiryDate || 'Unknown'}</p>
              </div>
            </div>

            {durable.warrantyDurationConflict && (
              <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">{durable.warrantyDurationConflict}</p>
              </div>
            )}
          </div>

          {/* Terms Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            
            {/* Inclusions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-teal-800">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Explicitly Covered</span>
              </h3>
              {durable.warrantyTerms?.coverage && durable.warrantyTerms.coverage.length > 0 ? (
                <ul className="space-y-2 text-slate-600 list-disc list-inside">
                  {durable.warrantyTerms.coverage.map((c, i) => (
                    <li key={i} className="leading-relaxed">{c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 italic">Not available from uploaded documents yet.</p>
              )}
            </div>

            {/* Exclusions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-rose-800">
                <X className="w-4 h-4 text-rose-600" />
                <span>Policy Exclusions</span>
              </h3>
              {durable.warrantyTerms?.exclusions && durable.warrantyTerms.exclusions.length > 0 ? (
                <ul className="space-y-2 text-slate-600 list-disc list-inside">
                  {durable.warrantyTerms.exclusions.map((e, i) => (
                    <li key={i} className="leading-relaxed">{e}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 italic">Not available from uploaded documents yet.</p>
              )}
            </div>

            {/* Conditions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-indigo-800">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Prerequisites for Claim</span>
              </h3>
              {durable.warrantyTerms?.conditions && durable.warrantyTerms.conditions.length > 0 ? (
                <ul className="space-y-2 text-slate-600 list-disc list-inside">
                  {durable.warrantyTerms.conditions.map((cd, i) => (
                    <li key={i} className="leading-relaxed">{cd}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-400 italic">Not available from uploaded documents yet.</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: ISSUES TAB (DURABLE ONLY)
         ========================================================================= */}
      {activeTab === 'Issues' && isDurable && durable && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Reported Hardware Issues &amp; Diagnostic Proof</h2>
              <p className="text-xs text-slate-500">
                Log hardware defects, attach photographic/audio evidence, and access nearby authorized service centers
              </p>
            </div>

            <button
              onClick={() => setServiceCentersOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors self-start sm:self-auto"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>View Authorized Service Centers</span>
            </button>
          </div>

          {/* Issue Reporting Form */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Report New Product Issue</h3>
            <form onSubmit={handleReportIssue} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Issue Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Display backlight flicker or right speaker distortion"
                    value={newIssueTitle}
                    onChange={(e) => setNewIssueTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={newIssueCategory}
                    onChange={(e) => setNewIssueCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Hardware">Hardware / Logic Board</option>
                    <option value="Display">Display / Screen</option>
                    <option value="Audio / Speaker">Audio / Microphone</option>
                    <option value="Battery / Power">Battery / Charging</option>
                    <option value="Connectivity">Wi-Fi / Bluetooth</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Defect Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe when the issue occurs and observable symptoms..."
                  value={newIssueDesc}
                  onChange={(e) => setNewIssueDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">Severity:</span>
                  {(['critical', 'moderate', 'minor'] as const).map((sev) => (
                    <label key={sev} className="flex items-center gap-1.5 cursor-pointer capitalize">
                      <input
                        type="radio"
                        name="severity"
                        checked={newIssueSeverity === sev}
                        onChange={() => setNewIssueSeverity(sev)}
                        className="text-indigo-600"
                      />
                      <span>{sev}</span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors"
                >
                  Log Issue to Case Record
                </button>
              </div>
            </form>
          </div>

          {/* Issue History Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Issue History ({(durable.issues || []).length})</h3>

            {(durable.issues || []).map((iss) => (
              <div key={iss.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      iss.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {iss.severity}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{iss.title}</h4>
                  </div>
                  <span className="text-xs text-slate-400">{iss.date}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{iss.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Category: <strong className="text-slate-700">{iss.category}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('Claims')}
                      className="text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Prepare Claim Bundle &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {(durable.issues || []).length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                No active issues reported for this product.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: CLAIMS TAB (DURABLE ONLY)
         ========================================================================= */}
      {activeTab === 'Claims' && isDurable && durable && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Warranty Claim Readiness &amp; Bundle Generator</h2>
              <p className="text-xs text-slate-500">
                Autonomous audit of required evidentiary documents and one-click claim packet generation
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDenialAnalyzerOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                Claim Denial Analyzer
              </button>
              <button
                onClick={() => setClaimBundleOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
                <span>Generate Claim Bundle</span>
              </button>
            </div>
          </div>

          {/* Structured Readiness Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Evidentiary Readiness Checklist</h3>
                <p className="text-[11px] text-slate-500">Mandatory verification points required by authorized manufacturer centers</p>
              </div>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                isClaimBundleReady ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isClaimBundleReady ? '100% Ready to File' : 'Action Required'}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {claimChecklist.map((item) => (
                <div key={item.key} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.status === 'available' && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
                    {item.status === 'missing' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                    {item.status === 'needs_verification' && <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />}
                    {item.status === 'conflict' && <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />}

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      {item.docRef ? (
                        <p className="text-[11px] text-slate-500 truncate font-mono">Referenced: {item.docRef}</p>
                      ) : (
                        <p className="text-[11px] text-rose-600 font-medium">Missing from vault records</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.status === 'available' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                      item.status === 'conflict' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.status.replace('_', ' ')}
                    </span>

                    {item.status !== 'available' && (
                      <button
                        onClick={() => setActiveTab(item.actionTargetTab as any)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors"
                      >
                        {item.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: PLANNER TAB (DURABLE ONLY)
         ========================================================================= */}
      {activeTab === 'Planner' && isDurable && durable && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Warranty Action Planner</h2>
              <p className="text-xs text-slate-500">Scheduled milestones, upcoming statutory deadlines, and protective reminders</p>
            </div>
          </div>

          <div className="space-y-3">
            {(durable.plannerItems || []).map((item) => (
              <div 
                key={item.id}
                onClick={() => handleTogglePlannerItem(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  item.completed 
                    ? 'bg-slate-50/70 border-slate-200 opacity-60' 
                    : item.type === 'urgent' 
                      ? 'bg-amber-50/40 border-amber-300 shadow-2xs' 
                      : 'bg-white border-slate-200/90 shadow-2xs hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                    item.completed ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {item.completed && <Check className="w-4 h-4" />}
                  </div>

                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Target Date: {item.deadline}
                    </p>
                  </div>
                </div>

                {item.actionTab && !item.completed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(item.actionTab as any);
                    }}
                    className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold shrink-0"
                  >
                    {item.actionLabel || 'Execute'} &rarr;
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: RENEWAL TAB (DURABLE ONLY)
         ========================================================================= */}
      {activeTab === 'Renewal' && isDurable && durable && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Extended Warranty &amp; Renewal Options</h2>
              <p className="text-xs text-slate-500">Cataloged manufacturer extensions, third-party insurance, and service contracts</p>
            </div>

            <button
              onClick={() => setAddRenewalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Coverage Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(durable.renewalPlans || []).map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-indigo-600 uppercase tracking-wider">{plan.provider}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {plan.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{plan.planName}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{plan.coverage}</p>

                  <div className="mt-3 text-xs text-slate-500 flex justify-between border-t border-slate-100 pt-2">
                    <span>Effective: {plan.startDate} &rarr; {plan.endDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-base font-bold text-slate-900 font-mono">{plan.price}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteRenewalPlan(plan.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onTriggerToast('success', 'Plan Activated', `${plan.planName} selected as active policy.`)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs"
                    >
                      Mark Active
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 10: TIMELINE TAB (BOTH DURABLE & BEAUTY)
         ========================================================================= */}
      {activeTab === 'Timeline' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Product Lifecycle Audit Timeline</h2>
            <p className="text-xs text-slate-500">Immutable ledger of document ingestion, field verifications, conflicts, and events</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
            <div className="relative border-l border-slate-200 ml-4 space-y-6">
              {(product.timeline || []).map((event) => (
                <div key={event.id} className="relative pl-6">
                  {/* Bullet */}
                  <span className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                    event.category === 'conflict' ? 'bg-amber-500' :
                    event.category === 'issue' ? 'bg-rose-500' :
                    event.category === 'verification' ? 'bg-teal-500' :
                    event.category === 'claim' ? 'bg-indigo-600' : 'bg-slate-600'
                  }`} />

                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{event.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">{event.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS & DRAWERS
         ========================================================================= */}

      {/* 1. DOCUMENT PREVIEW MODAL */}
      {docPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-xs">{docPreviewModal.name}</h3>
                <p className="text-[11px] text-slate-500">{docPreviewModal.type} • {docPreviewModal.size}</p>
              </div>
              <button 
                onClick={() => setDocPreviewModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">OCR Extracted Text Snippet</span>
              <p className="font-mono text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                {docPreviewModal.previewSnippet || 'Document verified with encrypted vault checksum.'}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDocPreviewModal(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ATTACH DOCUMENT MODAL */}
      {docUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Attach Document to Vault</h3>
              <button onClick={() => setDocUploadModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Official_Warranty_Card_Scan.pdf"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Invoice">Store Purchase Invoice</option>
                  <option value="Warranty Document">Warranty Card / Policy</option>
                  <option value="Product Label">Product Label / Serial Sticker</option>
                  <option value="Service Receipt">Service / Repair Receipt</option>
                  <option value="Claim Evidence">Claim Photographic Evidence</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">OCR Excerpt or Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Serial stamp verified on back chassis"
                  value={newDocSnippet}
                  onChange={(e) => setNewDocSnippet(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDocUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Attach &amp; Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CLAIM BUNDLE PREVIEW MODAL */}
      {claimBundleOpen && isDurable && durable && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Automated Evidentiary Packet</span>
                <h3 className="text-lg font-bold text-slate-900">Warranty Claim Bundle: {durable.name}</h3>
              </div>
              <button onClick={() => setClaimBundleOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-500 block">Product:</span>
                  <strong className="text-slate-900">{durable.name}</strong>
                  <p className="text-[11px] text-slate-500">SN: {durable.serialNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500 block">Purchase Verified:</span>
                  <strong className="text-slate-900">{durable.purchaseDate}</strong>
                  <p className="text-[11px] text-slate-500">Seller: {durable.seller}</p>
                </div>
              </div>

              <div className="pb-3 border-b border-slate-200">
                <span className="text-slate-500 block">Active Issue Citation:</span>
                <strong className="text-slate-900">{durable.issues?.[0]?.title || 'Hardware acoustic/component failure'}</strong>
                <p className="text-[11px] text-slate-600 mt-0.5">{durable.issues?.[0]?.description || 'Reported within standard warranty term.'}</p>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Attached Evidentiary Index ({(durable.documents || []).length} files):</span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-700 list-disc list-inside">
                  {(durable.documents || []).map((d) => (
                    <li key={d.id}>{d.name} ({d.type})</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">Format: Standardized Manufacturer PDF Packet</span>
              <button
                onClick={() => {
                  onTriggerToast('success', 'Packet Generated', 'Claim bundle PDF exported with attached checksums.');
                  setClaimBundleOpen(false);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified Claim Packet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CLAIM DENIAL ANALYZER MODAL */}
      {denialAnalyzerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">Document-Based Analysis</span>
                <h3 className="text-base font-bold text-slate-900">Claim Denial Reason Analyzer</h3>
              </div>
              <button onClick={() => setDenialAnalyzerOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block mb-0.5">Simulated Denial Review:</span>
                <p className="text-amber-800">
                  Manufacturer flagged rejection citing &quot;Section 4.2: Lack of itemized tax invoice displaying purchase date and serial number match.&quot;
                </p>
              </div>

              <div className="space-y-1.5">
                <strong className="text-slate-900 block">Identified Gaps:</strong>
                <p className="text-slate-600">• Order confirmation email on file lacks VAT breakdown number.</p>
                <p className="text-slate-600">• Serial number is handwritten rather than machine-printed on registration slip.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
                <strong className="text-slate-900 block">Recommended Appeal Strategy:</strong>
                <p>1. Download official VAT receipt from retailer portal.</p>
                <p>2. Re-attach receipt to vault documents and export updated Claim Packet.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-100 text-[10px] text-slate-500 leading-tight">
                * Note: This analyzer provides technical document-based comparisons only and does not constitute formal legal advice.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDenialAnalyzerOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl"
              >
                Acknowledge Analysis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SERVICE CENTERS DRAWER / MODAL */}
      {serviceCentersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Nearby Authorized Service Centers</h3>
                <p className="text-[11px] text-slate-500">Certified for {product.brand} warranty service</p>
              </div>
              <button onClick={() => setServiceCentersOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              <div className="text-center py-8 text-xs text-slate-500">
                Authorized service center listings are not available yet.
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setServiceCentersOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-800 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. ADD RENEWAL PLAN MODAL */}
      {addRenewalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Extended Protection Plan</h3>
              <button onClick={() => setAddRenewalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleAddRenewalPlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Provider</label>
                <input
                  type="text"
                  placeholder="e.g. AppleCare+, SquareTrade, or Allstate"
                  value={newPlanProvider}
                  onChange={(e) => setNewPlanProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. 2-Year Complete Hardware & Accidental"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coverage Scope</label>
                <textarea
                  rows={2}
                  placeholder="Describe deductible and covered failure types..."
                  value={newPlanCoverage}
                  onChange={(e) => setNewPlanCoverage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cost / Price</label>
                <input
                  type="text"
                  placeholder="e.g. $89.00 / year"
                  value={newPlanPrice}
                  onChange={(e) => setNewPlanPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddRenewalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Catalog Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. UPDATE OPENED DATE MODAL (BEAUTY) */}
      {openedDateModalOpen && beauty && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Record Opened Date</h3>
              <button onClick={() => setOpenedDateModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Enter the date you broke the seal and began using this cosmetic product to calculate its {beauty.paoMonths} PAO window:
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date Opened</label>
                <input
                  type="date"
                  value={tempOpenedDate}
                  onChange={(e) => setTempOpenedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setOpenedDateModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOpenedDate}
                className="px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
              >
                Save &amp; Start PAO Timer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
