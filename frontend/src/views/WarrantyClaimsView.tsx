import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Plus, 
  ChevronRight, 
  ArrowRight, 
  Download, 
  ExternalLink, 
  X, 
  Sparkles, 
  Upload, 
  Laptop, 
  ShieldAlert, 
  Check, 
  FileCheck2, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Scale
} from 'lucide-react';
import { Product, DurableProduct, ProductClaim, AppRoute, ProductDocument } from '../types';
import { INITIAL_CLAIMS } from '../data/mockData';

interface WarrantyClaimsViewProps {
  products: Product[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (productId: string) => void;
  onTriggerToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const WarrantyClaimsView: React.FC<WarrantyClaimsViewProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onTriggerToast
}) => {
  // Claims state (initialized with rich mock data)
  const [claims, setClaims] = useState<ProductClaim[]>(INITIAL_CLAIMS);
  const [activeTab, setActiveTab] = useState<'dossiers' | 'auditor'>('dossiers');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Preparing' | 'Submitted' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Claim for Detail Dossier Modal
  const [selectedClaim, setSelectedClaim] = useState<ProductClaim | null>(null);

  // Rebuttal state
  const [rebuttalModalOpen, setRebuttalModalOpen] = useState(false);
  const [rebuttalText, setRebuttalText] = useState('');

  // Claim Readiness Auditor selected product
  const durableProducts = useMemo(() => {
    return products.filter((p): p is DurableProduct => p.type === 'durable');
  }, [products]);

  const [auditorProductId, setAuditorProductId] = useState<string>(durableProducts[0]?.id || '');
  const auditorProduct = useMemo(() => {
    return durableProducts.find(p => p.id === auditorProductId) || durableProducts[0];
  }, [durableProducts, auditorProductId]);

  // "File New Claim" Wizard Modal state
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);
  const [newClaimProductId, setNewClaimProductId] = useState<string>(durableProducts[0]?.id || '');
  const [newClaimIssueTitle, setNewClaimIssueTitle] = useState('');
  const [newClaimCategory, setNewClaimCategory] = useState<'Display' | 'Hardware' | 'Audio / Speaker' | 'Battery / Power' | 'Connectivity'>('Hardware');
  const [newClaimDescription, setNewClaimDescription] = useState('');
  const [newClaimAmount, setNewClaimAmount] = useState('$350.00');

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return claims.filter(c => {
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.productName.toLowerCase().includes(q);
        const matchesIssue = c.issueTitle.toLowerCase().includes(q);
        const matchesBrand = c.productBrand.toLowerCase().includes(q);
        if (!matchesName && !matchesIssue && !matchesBrand) return false;
      }
      return true;
    });
  }, [claims, statusFilter, searchQuery]);

  // Handle Rebuttal Submission
  const handleRebuttalSubmit = () => {
    if (!selectedClaim || !rebuttalText.trim()) return;
    
    const updated = {
      ...selectedClaim,
      status: 'Submitted' as const,
      nextAction: 'Under Appeal: Rebuttal evidence transmitted to dispute arbiter',
      timeline: [
        {
          title: 'Official Rebuttal & Appeal Filed',
          date: new Date().toISOString().split('T')[0],
          note: rebuttalText
        },
        ...selectedClaim.timeline
      ]
    };

    setClaims(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelectedClaim(updated);
    setRebuttalModalOpen(false);
    setRebuttalText('');
    onTriggerToast('success', 'Appeal Submitted', `Rebuttal dossier filed for ${selectedClaim.productName}.`);
  };

  // Handle New Claim Submission
  const handleCreateClaimSubmit = () => {
    const target = durableProducts.find(p => p.id === newClaimProductId);
    if (!target) return;

    const newClaim: ProductClaim = {
      id: `clm-${Date.now().toString().slice(-4)}`,
      productId: target.id,
      productName: target.name,
      productBrand: target.brand,
      productType: 'durable',
      issueTitle: newClaimIssueTitle || 'Hardware Malfunction',
      issueCategory: newClaimCategory,
      status: 'Submitted',
      evidenceCompleteness: target.claimReadinessScore || 90,
      evidenceChecklist: {
        invoice: true,
        warranty: true,
        serial: true,
        issueEvidence: true
      },
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      nextAction: 'Under initial technician desk assessment (ETA 48 hours)',
      nextActionRoute: `/products/${target.id}`,
      claimAmount: newClaimAmount,
      timeline: [
        {
          title: 'Claim Package Submitted',
          date: new Date().toISOString().split('T')[0],
          note: `Automated filing with verified proof documents and cited ${target.brand} guarantee clauses.`
        }
      ]
    };

    setClaims(prev => [newClaim, ...prev]);
    setWizardOpen(false);
    setWizardStep(1);
    onTriggerToast('success', 'Claim Filed', `Claim ${newClaim.id.toUpperCase()} generated for ${target.name}.`);
    setSelectedClaim(newClaim);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Autonomous Claims &amp; Dispute Arbiter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Warranty Claims Engine</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pre-flight evidence compilation, policy exclusion auditing, and verified repair claim dossiers
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center gap-1.5 ${
              activeTab === 'auditor'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-500" />
            <span>Readiness Auditor</span>
          </button>
          
          <button
            onClick={() => {
              setWizardStep(1);
              setWizardOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs hover:shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>File New Claim</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Claims Active</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              {claims.filter(c => c.status === 'Submitted' || c.status === 'Preparing').length}
            </p>
            <span className="text-xs text-slate-400 font-medium">of {claims.length} total</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">1 In Progress, 2 Approved, 1 Rejected</p>
        </div>

        <div className="bg-white rounded-2xl border border-indigo-200/80 p-4 sm:p-5 shadow-2xs bg-indigo-50/20">
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Avg. Readiness Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl sm:text-3xl font-bold text-indigo-700">89%</p>
            <span className="text-xs text-indigo-600 font-medium">+14% vs unindexed</span>
          </div>
          <p className="text-xs text-indigo-600/80 mt-1">High-evidence dossier confidence</p>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 sm:p-5 shadow-2xs bg-emerald-50/20">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Estimated Recovery</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700">$1,850</p>
            <span className="text-xs text-emerald-600 font-medium">USD</span>
          </div>
          <p className="text-xs text-emerald-600/80 mt-1">Covered hardware parts &amp; labor</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolution Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">80%</p>
            <span className="text-xs text-teal-600 font-medium">Favorable</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">4 of 5 disputes accepted</p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dossiers')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'dossiers'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Claim Dossiers &amp; Disputes ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'auditor'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Claim Readiness Auditor
          </button>
        </div>

        {activeTab === 'dossiers' && (
          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search claims..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: CLAIM DOSSIERS */}
      {activeTab === 'dossiers' && (
        <div className="space-y-4">
          
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-medium pb-1">
            {(['All', 'Submitted', 'Approved', 'Rejected', 'Preparing'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white font-bold shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st} ({st === 'All' ? claims.length : claims.filter(c => c.status === st).length})
              </button>
            ))}
          </div>

          {/* Claims Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClaims.map((claim) => {
              const statusColor = 
                claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                claim.status === 'Submitted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                claim.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                'bg-amber-50 text-amber-700 border-amber-200';

              return (
                <div
                  key={claim.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Top Row: Claim ID & Status */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {claim.id.toUpperCase()}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusColor}`}>
                        {claim.status}
                      </span>
                    </div>

                    {/* Product & Issue Title */}
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-600 block">{claim.productBrand}</span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{claim.productName}</h3>
                      <p className="text-xs font-semibold text-slate-600 mt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {claim.issueCategory}
                        </span>
                        <span>{claim.issueTitle}</span>
                      </p>
                    </div>

                    {/* Evidence Completeness Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium">Evidence Dossier</span>
                        <span className="font-bold text-slate-900">{claim.evidenceCompleteness}% Complete</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            claim.evidenceCompleteness >= 90 ? 'bg-emerald-500' :
                            claim.evidenceCompleteness >= 70 ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${claim.evidenceCompleteness}%` }}
                        />
                      </div>
                    </div>

                    {/* Next Action Callout */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <span className="font-bold text-slate-700 block text-[10px] uppercase tracking-wider">Next Step</span>
                      <p className="text-slate-600 mt-0.5">{claim.nextAction}</p>
                    </div>

                    {claim.claimAmount && (
                      <p className="text-xs text-slate-500">
                        Estimated Claim Value: <strong className="text-slate-900">{claim.claimAmount}</strong>
                      </p>
                    )}

                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Filed {claim.createdAt}</span>
                    <button
                      onClick={() => setSelectedClaim(claim)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                    >
                      <span>View Full Dossier</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: CLAIM READINESS AUDITOR */}
      {activeTab === 'auditor' && (
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mb-1">
              Select Product for Pre-Claim Audit
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Our autonomous engine checks invoice validity, warranty coverage terms, serial authenticity, and diagnostic proof before submission.
            </p>

            {/* Product Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {durableProducts.map((p) => {
                const isSelected = p.id === auditorProduct.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setAuditorProductId(p.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-indigo-50/70 border-indigo-600 ring-1 ring-indigo-500 text-slate-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">{p.brand}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.claimReadinessScore >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {p.claimReadinessScore}% Ready
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate mt-1">{p.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">SN: {p.serialNumber}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audit Results for Selected Product */}
          {auditorProduct && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-xs font-semibold text-indigo-600">{auditorProduct.brand}</span>
                  <h3 className="text-xl font-bold text-slate-900">{auditorProduct.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Warranty Status: <strong className="text-slate-800 uppercase text-[11px]">{auditorProduct.warrantyStatus}</strong> • Expiring {auditorProduct.warrantyExpiryDate}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Readiness Score</span>
                    <span className="text-3xl font-extrabold text-indigo-600">{auditorProduct.claimReadinessScore}%</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 flex items-center justify-center font-bold text-xs text-indigo-700">
                    {auditorProduct.claimReadinessScore >= 80 ? 'READY' : 'WARN'}
                  </div>
                </div>
              </div>

              {/* 4 Core Pillars Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  4-Point Claim Verification Checklist
                </h4>

                {/* 1. Invoice */}
                <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">1. Itemized Proof of Purchase</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Retail tax invoice verified showing purchase date ({auditorProduct.purchaseDate}), retailer ({auditorProduct.seller}), and line item price.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                    Verified
                  </span>
                </div>

                {/* 2. Warranty Registration */}
                <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">2. Warranty Terms &amp; Policy Document</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Coverage summary indexed: {auditorProduct.warrantyCoverageSummary || 'Standard 12-Month Hardware Guarantee'}.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                    Active
                  </span>
                </div>

                {/* 3. Serial / Hardware Verification */}
                <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">3. Hardware Serial Authenticity</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Hardware serial <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{auditorProduct.serialNumber}</code> validated against document evidence.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                    Attested
                  </span>
                </div>

                {/* 4. Conflict Warning if Present */}
                {auditorProduct.hasConflict ? (
                  <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-900">4. Pending Document Discrepancy Flag</p>
                        <p className="text-xs text-amber-700 mt-0.5">
                          {auditorProduct.conflictDescription || 'Date mismatch detected between invoice and registration slip.'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('/attention')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shrink-0"
                    >
                      Resolve Conflict
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">4. Conflict Cleanliness</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          No contradictory field entries found across proof documents.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                      Clear
                    </span>
                  </div>
                )}
              </div>

              {/* Ready Action CTA */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold">Ready to Initiate Claim for {auditorProduct.name}?</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Generate an official claim dossier with auto-compiled evidence documents.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewClaimProductId(auditorProduct.id);
                    setWizardStep(1);
                    setWizardOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
                >
                  Generate Claim Package
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* FULL CLAIM DOSSIER MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 space-y-5 my-8">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-500 uppercase">
                    {selectedClaim.id.toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    selectedClaim.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    selectedClaim.status === 'Submitted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                    selectedClaim.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {selectedClaim.status}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedClaim.productName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selectedClaim.productBrand} • Category: {selectedClaim.issueCategory}</p>
              </div>

              <button 
                onClick={() => setSelectedClaim(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reported Issue Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider mb-1">Reported Issue Summary</span>
              <p className="text-slate-900 font-semibold">{selectedClaim.issueTitle}</p>
              <p className="text-slate-600 mt-1">{selectedClaim.nextAction}</p>
            </div>

            {/* Evidence Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Indexed Evidence Dossier</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-800">Original Invoice Attached</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-800">Warranty Card Verified</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-800">Hardware Serial Matched</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-slate-800">Photographic Evidence Logged</span>
                </div>
              </div>
            </div>

            {/* If Rejected: Show Denial Analysis & Rebuttal Option */}
            {selectedClaim.status === 'Rejected' && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-rose-800">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Carrier Denial Reason Cited:</span>
                </div>
                <p className="text-rose-700 leading-relaxed font-mono bg-white p-2.5 rounded-lg border border-rose-100">
                  {selectedClaim.denialReason || 'Section 3.1: Hardware warranty expired 35 days prior to case filing timestamp.'}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-rose-600 font-medium">Consumer Rights Law allows dispute for pre-existing defects.</span>
                  <button
                    onClick={() => setRebuttalModalOpen(true)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors"
                  >
                    Draft Official Rebuttal Appeal
                  </button>
                </div>
              </div>
            )}

            {/* Chronological Audit Timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Claim Audit Trail</h4>
              <div className="space-y-2 text-xs">
                {(selectedClaim.timeline || []).map((ev, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-bold text-slate-900">{ev.title}</strong>
                        <span className="text-slate-400 text-[11px]">{ev.date}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{ev.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  onTriggerToast('success', 'Dossier Downloaded', `Claim dossier for ${selectedClaim.id} saved as PDF.`);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF Claim Dossier</span>
              </button>

              <button
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REBUTTAL MODAL */}
      {rebuttalModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">File Formal Warranty Dispute Rebuttal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              State evidence proving the issue was latent or reported during coverage, or cite statutory consumer warranty protections:
            </p>
            <textarea
              rows={4}
              value={rebuttalText}
              onChange={(e) => setRebuttalText(e.target.value)}
              placeholder="e.g. In accordance with Consumer Rights Act Section 9, the battery swelling was documented with timestamped system diagnostics prior to warranty expiration..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRebuttalModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRebuttalSubmit}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Submit Appeal to Arbiter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "FILE NEW CLAIM" WIZARD MODAL */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-5 my-8">
            
            {/* Wizard Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Step {wizardStep} of 3
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Autonomous Claim Filing</h3>
              </div>
              <button onClick={() => setWizardOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            {/* STEP 1: Product & Issue */}
            {wizardStep === 1 && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Durable Product</label>
                  <select
                    value={newClaimProductId}
                    onChange={(e) => setNewClaimProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    {durableProducts.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.brand}) — Score {p.claimReadinessScore}%
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
                  <select
                    value={newClaimCategory}
                    onChange={(e) => setNewClaimCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="Hardware">Hardware Malfunction</option>
                    <option value="Display">Display / Pixel Artifacts</option>
                    <option value="Audio / Speaker">Audio / Microphone / ANC</option>
                    <option value="Battery / Power">Battery Degraded / Charging Failure</option>
                    <option value="Connectivity">Wi-Fi / Bluetooth Connectivity</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specific Issue Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Display backlight flicker or Battery capacity below 75%"
                    value={newClaimIssueTitle}
                    onChange={(e) => setNewClaimIssueTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Repair / Replacement Value</label>
                  <input
                    type="text"
                    value={newClaimAmount}
                    onChange={(e) => setNewClaimAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Vault Evidence Verification */}
            {wizardStep === 2 && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  ProductVault AI has automatically gathered the following proof documents from your vault repository:
                </p>

                <div className="space-y-2">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-950">Proof of Purchase (Invoice)</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-800">Attached</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-950">Warranty Policy Registration</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-800">Active</span>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold text-emerald-950">Hardware Serial Number Matching</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-800">Verified</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 text-[11px] leading-relaxed">
                  <strong>AI Pre-Check:</strong> Evidence completeness is verified at 95%. No disqualifying exclusions found in policy terms.
                </div>
              </div>
            )}

            {/* STEP 3: Review & Submit */}
            {wizardStep === 3 && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <p className="font-bold text-slate-900 text-sm">{newClaimIssueTitle || 'Hardware Issue'}</p>
                  <p className="text-slate-600">Product: {durableProducts.find(p => p.id === newClaimProductId)?.name}</p>
                  <p className="text-slate-600">Category: {newClaimCategory}</p>
                  <p className="text-slate-600">Claim Amount: {newClaimAmount}</p>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Autonomous Submission Protocol Ready</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    By clicking submit, your certified dossier will be packaged with verified signatures, serial stamps, and purchase ledgers.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              {wizardStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Back
                </button>
              ) : <div />}

              {wizardStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => (prev + 1) as any)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateClaimSubmit}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  Submit Official Claim
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
