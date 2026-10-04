import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Laptop, 
  RefreshCw, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Check, 
  ShieldAlert, 
  AlertTriangle,
  Clock,
  Layers,
  Zap,
  Tag
} from 'lucide-react';
import { Product, DurableProduct, AppRoute, PriceComparisonItem } from '../types';
import { PRICE_COMPARISONS } from '../data/mockData';

interface PostWarrantyViewProps {
  products: Product[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (productId: string) => void;
  onTriggerToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const PostWarrantyView: React.FC<PostWarrantyViewProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onTriggerToast
}) => {
  const durableProducts = useMemo(() => {
    return products.filter((p): p is DurableProduct => p.type === 'durable');
  }, [products]);

  // Selected Product for Advisory
  const [selectedProductId, setSelectedProductId] = useState<string>(
    durableProducts.find(p => p.warrantyStatus === 'expiring_soon' || p.warrantyStatus === 'expired')?.id || durableProducts[0]?.id || ''
  );

  const activeProduct = durableProducts.find(p => p.id === selectedProductId) || durableProducts[0];

  // Renewal plans for the active product
  const plans = [
    {
      id: 'plan-1',
      provider: activeProduct.brand === 'Apple' ? 'AppleCare+ Extension' : `${activeProduct.brand} Extended Care`,
      price: '$9.99 / mo or $99 / yr',
      coverage: 'Comprehensive accidental liquid & drops, unlimited repairs, $29 screen excess, priority phone tech support.',
      term: 'Annual renewable',
      recommended: true
    },
    {
      id: 'plan-2',
      provider: 'Asurion Home+ Multi-Device',
      price: '$24.99 / mo',
      coverage: 'Covers up to 10 household devices against mechanical failure, surges, and drops after original manufacturer expiration.',
      term: 'Monthly subscription',
      recommended: false
    },
    {
      id: 'plan-3',
      provider: 'SquareTrade / Allstate Protection',
      price: '$79.00 / 2 Years',
      coverage: '100% parts and labor, 5-day guarantee turnaround, zero deductible on electrical failures.',
      term: 'Fixed 24-Month Term',
      recommended: false
    }
  ];

  // Upgrades list from mock data
  const comparisons: PriceComparisonItem[] = activeProduct && (PRICE_COMPARISONS[activeProduct.id] || [
    {
      id: 'pc-gen-1',
      currentProductId: activeProduct.id,
      modelName: `${activeProduct.brand} Next-Gen Flagship Series`,
      brand: activeProduct.brand,
      price: '$1,399.00',
      keySpecs: 'Next-Gen Silicon Architecture, 32GB Unified Memory, High Efficiency Battery',
      similarityPercentage: 94,
      availability: 'In Stock',
      recommendedFor: 'Natural modern evolution with double compute throughput.'
    }
  ]);

  const handleEnrollPlan = (provider: string) => {
    onTriggerToast('success', 'Plan Selected', `Enrolled ${activeProduct.name} in ${provider}. Renewal certificate logged.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            <span>Post-Warranty &amp; Fleet Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Post-Warranty &amp; Upgrade Advisory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Extended protection plans, accidental damage renewal, and modern hardware market upgrade valuations
          </p>
        </div>

        {/* Product Focus Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Focus Hardware:</span>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl shadow-2xs text-slate-900 focus:outline-hidden"
          >
            {durableProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.warrantyStatus.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Device Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-600">{activeProduct.brand}</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{activeProduct.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Model: {activeProduct.model} • Purchased {activeProduct.purchaseDate} ({activeProduct.seller})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Warranty Status</span>
              <span className={`font-bold uppercase ${
                activeProduct.warrantyStatus === 'active' ? 'text-emerald-700' :
                activeProduct.warrantyStatus === 'expiring_soon' ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {activeProduct.warrantyStatus.replace('_', ' ')}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Expires</span>
              <span className="font-semibold text-slate-800">{activeProduct.warrantyExpiryDate}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Trade-In</span>
              <span className="font-bold text-teal-700">$580 - $720</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: EXTENDED WARRANTY RENEWAL PLANS */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Recommended Extended Protection Plans</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Preserve coverage against drops, liquid ingress, and hardware breakdown after manufacturer warranty sunset
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${
                p.recommended ? 'border-indigo-600 ring-1 ring-indigo-500 bg-indigo-50/10' : 'border-slate-200/90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{p.provider}</span>
                  {p.recommended && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      Best Value
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xl font-extrabold text-slate-900">{p.price}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{p.term}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                  {p.coverage}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <button
                  onClick={() => handleEnrollPlan(p.provider)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    p.recommended
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Enroll in Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MARKET UPGRADE & REPLACEMENT INTELLIGENCE */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span>Smart Upgrade &amp; Replacement Intelligence</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Market pricing, spec parity comparison, and direct retailer availability when retiring this hardware
          </p>
        </div>

        <div className="space-y-3">
          {comparisons.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {item.similarityPercentage}% Spec Parity
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    item.availability === 'In Stock' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.availability}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900">{item.modelName}</h4>
                  <p className="text-xs font-mono text-slate-600 mt-0.5">{item.keySpecs}</p>
                </div>

                <p className="text-xs text-teal-900 bg-teal-50/60 p-2 rounded-lg border border-teal-100">
                  <strong>Advisory Note:</strong> {item.recommendedFor}
                </p>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Retail</span>
                  <span className="text-xl font-bold text-slate-900">{item.price}</span>
                </div>

                <button
                  onClick={() => {
                    onTriggerToast('info', 'Market Query', `Checking live retail availability for ${item.modelName}...`);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Compare Deals</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
