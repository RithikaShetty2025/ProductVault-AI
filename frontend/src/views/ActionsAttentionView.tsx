import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Filter, 
  Laptop, 
  Sparkles, 
  ShieldAlert, 
  RefreshCw, 
  ArrowRight, 
  Check, 
  X, 
  ExternalLink,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import { Product, AttentionItem, AppRoute, ProductType } from '../types';

interface ActionsAttentionViewProps {
  attentionItems: AttentionItem[];
  products: Product[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (productId: string) => void;
  onResolveAttentionItem: (itemId: string, note?: string) => void;
  onUpdateProduct: (product: Product) => void;
  onTriggerToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ActionsAttentionView: React.FC<ActionsAttentionViewProps> = ({
  attentionItems,
  products,
  onNavigate,
  onSelectProduct,
  onResolveAttentionItem,
  onUpdateProduct,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'needs_attention' | 'upcoming' | 'completed'>('all');
  const [productTypeFilter, setProductTypeFilter] = useState<'all' | 'durable' | 'beauty'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Conflict resolution modal
  const [conflictModalItem, setConflictModalItem] = useState<AttentionItem | null>(null);
  const [selectedConflictValue, setSelectedConflictValue] = useState<'invoice' | 'warranty' | 'custom'>('invoice');
  const [customConflictValue, setCustomConflictValue] = useState('');

  // Calculate metrics
  const totalCount = attentionItems.length;
  const criticalCount = attentionItems.filter(i => i.severity === 'high' && i.category !== 'completed').length;
  const upcomingCount = attentionItems.filter(i => i.category === 'upcoming').length;
  const completedCount = attentionItems.filter(i => i.category === 'completed').length;

  // Filtered items
  const filteredItems = useMemo(() => {
    return attentionItems.filter(item => {
      // Tab filter
      if (activeTab === 'needs_attention' && item.category !== 'needs_attention') return false;
      if (activeTab === 'upcoming' && item.category !== 'upcoming') return false;
      if (activeTab === 'completed' && item.category !== 'completed') return false;
      if (activeTab === 'all' && item.category === 'completed') return false; // In 'all', show active items

      // Product type filter
      if (productTypeFilter !== 'all' && item.productType !== productTypeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesProd = item.productName.toLowerCase().includes(q);
        const matchesDesc = item.whatHappened.toLowerCase().includes(q);
        if (!matchesTitle && !matchesProd && !matchesDesc) return false;
      }

      return true;
    });
  }, [attentionItems, activeTab, productTypeFilter, searchQuery]);

  // Handle resolving conflict directly
  const handleResolveConflictSubmit = () => {
    if (!conflictModalItem) return;
    const targetProduct = products.find(p => p.id === conflictModalItem.productId);
    if (!targetProduct || targetProduct.type !== 'durable') return;

    let chosenVal = '2026-02-14'; // Invoice date
    if (selectedConflictValue === 'warranty') chosenVal = '2026-02-10';
    if (selectedConflictValue === 'custom' && customConflictValue.trim()) {
      chosenVal = customConflictValue.trim();
    }

    // Update product conflicts state
    const updatedConflicts = (targetProduct.conflicts || []).map(c => ({
      ...c,
      status: 'resolved' as const,
      resolvedValue: chosenVal,
      resolvedAt: new Date().toISOString()
    }));

    const updatedExtracted = (targetProduct.extractedFields || []).map(f => {
      if (f.key === 'purchaseDate') {
        return { ...f, value: chosenVal, status: 'verified' as const, confidence: 'high' as const };
      }
      return f;
    });

    const updatedProduct = {
      ...targetProduct,
      hasConflict: false,
      conflictDescription: undefined,
      purchaseDate: chosenVal,
      warrantyStartDate: chosenVal,
      conflicts: updatedConflicts,
      extractedFields: updatedExtracted,
      claimReadinessScore: Math.min(100, targetProduct.claimReadinessScore + 20),
      timeline: [
        {
          id: `t-res-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          title: 'Purchase Date Discrepancy Resolved',
          description: `Discrepancy reconciled to ${chosenVal} based on verified proof of sale.`,
          category: 'conflict' as const
        },
        ...targetProduct.timeline
      ]
    };

    onUpdateProduct(updatedProduct);
    onResolveAttentionItem(conflictModalItem.id, `Resolved to ${chosenVal}`);
    setConflictModalItem(null);
    onTriggerToast('success', 'Conflict Reconciled', `${targetProduct.name} purchase date synchronized to ${chosenVal}.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Intelligent Action Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Actions &amp; Attention Center</h1>
          <p className="text-sm text-slate-500 mt-1">
            Prioritized issues, document discrepancies, expiring warranties, and cosmetic batch lifecycle thresholds
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/documents')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition-colors"
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Documents Vault</span>
          </button>
          <button
            onClick={() => onNavigate('/claims')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Claims Engine</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Items</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{attentionItems.filter(i => i.category !== 'completed').length}</p>
          <p className="text-xs text-slate-400 mt-1">Requiring user review</p>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200/80 p-4 sm:p-5 shadow-2xs bg-rose-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">High Priority</span>
            <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-700">{criticalCount}</p>
          <p className="text-xs text-rose-600/80 mt-1">Document conflict &amp; claims</p>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200/80 p-4 sm:p-5 shadow-2xs bg-amber-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Upcoming &lt;30d</span>
            <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-amber-700">{upcomingCount}</p>
          <p className="text-xs text-amber-600/80 mt-1">Warranty &amp; PAO expiries</p>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 sm:p-5 shadow-2xs bg-emerald-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved</span>
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{completedCount}</p>
          <p className="text-xs text-emerald-600/80 mt-1">Safely reconciled</p>
        </div>
      </div>

      {/* Filter and Tab Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Active ({attentionItems.filter(i => i.category !== 'completed').length})
            </button>
            <button
              onClick={() => setActiveTab('needs_attention')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'needs_attention'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Attention ({criticalCount})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                activeTab === 'completed'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Domain & Search Filters */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search issues, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setProductTypeFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  productTypeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setProductTypeFilter('durable')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  productTypeFilter === 'durable' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                <Laptop className="w-3 h-3" />
                <span>Durable</span>
              </button>
              <button
                onClick={() => setProductTypeFilter('beauty')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  productTypeFilter === 'beauty' ? 'bg-white text-teal-700 shadow-2xs' : 'text-slate-600'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Beauty</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">All Clear!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              There are no pending actions matching your current filter criteria. All documents, warranties, and product lifecycles are up to date.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const targetProd = products.find(p => p.id === item.productId);
            const isCompleted = item.category === 'completed';

            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-2xs hover:shadow-xs ${
                  isCompleted 
                    ? 'border-slate-200/60 opacity-75' 
                    : item.severity === 'high'
                      ? 'border-rose-200/90 ring-1 ring-rose-100'
                      : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  
                  {/* Left Content Area */}
                  <div className="space-y-3 flex-1 min-w-0">
                    
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.severity === 'high'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {isCompleted ? 'Resolved' : `${item.severity} Priority`}
                      </span>

                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                        item.productType === 'durable'
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-teal-50 text-teal-700'
                      }`}>
                        {item.productType === 'durable' ? <Laptop className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                        {item.productType === 'durable' ? 'Durable Good' : 'Beauty & Care'}
                      </span>

                      {item.timeRemaining && (
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.timeRemaining}
                        </span>
                      )}
                    </div>

                    {/* Title & Product Name */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => {
                          onSelectProduct(item.productId);
                          onNavigate(`/products/${item.productId}` as AppRoute);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline mt-0.5 inline-flex items-center gap-1"
                      >
                        <span>Linked Product: {item.productName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Detailed Analysis Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                      
                      {/* What Happened */}
                      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                          What Happened
                        </span>
                        <p className="text-slate-600 leading-relaxed">{item.whatHappened}</p>
                      </div>

                      {/* Why It Matters */}
                      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block mb-1">
                          Why It Matters
                        </span>
                        <p className="text-slate-600 leading-relaxed">{item.whyItMatters}</p>
                      </div>

                    </div>

                    {/* Recommended Action Box */}
                    <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-200/70 flex items-start gap-2.5 text-xs text-teal-900">
                      <span className="w-5 h-5 rounded-md bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold">
                        AI
                      </span>
                      <div>
                        <strong className="font-bold text-teal-950">Recommended Next Step: </strong>
                        <span>{item.recommendedAction}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Action Column */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    
                    {/* Primary Action Button */}
                    {!isCompleted ? (
                      <>
                        {item.id === 'att-2' ? (
                          <button
                            onClick={() => setConflictModalItem(item)}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Resolve Inconsistency</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onSelectProduct(item.productId);
                              onNavigate(item.targetRoute as AppRoute);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5"
                          >
                            <span>{item.ctaText}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onResolveAttentionItem(item.id);
                            onTriggerToast('info', 'Action Dismissed', `${item.title} marked as completed.`);
                          }}
                          className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
                        >
                          Mark as Completed
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>Reconciled</span>
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Conflict Resolution Modal for Galaxy S24 / Date Mismatches */}
      {conflictModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  Document Conflict Reconciliation
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Reconcile Purchase Date</h3>
              </div>
              <button 
                onClick={() => setConflictModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Automated claims intake requires a single verified purchase date. Choose which document value to establish as the ground truth:
            </p>

            {/* Options */}
            <div className="space-y-2.5 text-xs">
              <label 
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedConflictValue === 'invoice'
                    ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <input 
                  type="radio" 
                  name="conflictVal" 
                  checked={selectedConflictValue === 'invoice'} 
                  onChange={() => setSelectedConflictValue('invoice')}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="font-bold">Feb 14, 2026</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">Recommended</span>
                  </div>
                  <p className="text-[11px] opacity-80 mt-0.5">Source: BestBuy Register Bill of Sale (Official tax receipt supersedes registration card)</p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedConflictValue === 'warranty'
                    ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <input 
                  type="radio" 
                  name="conflictVal" 
                  checked={selectedConflictValue === 'warranty'} 
                  onChange={() => setSelectedConflictValue('warranty')}
                  className="mt-0.5"
                />
                <div>
                  <strong className="font-bold">Feb 10, 2026</strong>
                  <p className="text-[11px] opacity-80 mt-0.5">Source: Warranty Slip / Serial Registration Card (Pre-order dispatch date)</p>
                </div>
              </label>

              <label 
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedConflictValue === 'custom'
                    ? 'bg-indigo-50/70 border-indigo-600 text-indigo-950 font-medium'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <input 
                  type="radio" 
                  name="conflictVal" 
                  checked={selectedConflictValue === 'custom'} 
                  onChange={() => setSelectedConflictValue('custom')}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <strong className="font-bold">Manual / Custom Date</strong>
                  {selectedConflictValue === 'custom' && (
                    <input
                      type="date"
                      value={customConflictValue}
                      onChange={(e) => setCustomConflictValue(e.target.value)}
                      className="mt-2 w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  )}
                </div>
              </label>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
              <strong>Impact:</strong> Harmonizing this field unlocks automated claim submission and increases Claim Readiness to 100%.
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setConflictModalItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveConflictSubmit}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
              >
                Save &amp; Update Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
