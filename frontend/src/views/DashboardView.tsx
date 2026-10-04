import React, { useState } from 'react';
import { 
  Package, 
  Laptop, 
  Sparkles, 
  AlertTriangle, 
  PlusCircle, 
  Upload, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Activity,
  Calendar,
  Layers
} from 'lucide-react';
import { Product, AttentionItem, ActivityItem, AppRoute } from '../types';

interface DashboardViewProps {
  userName: string;
  products: Product[];
  attentionItems: AttentionItem[];
  activityFeed: ActivityItem[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (productId: string) => void;
  onFilterCategory?: (type: 'all' | 'durable' | 'beauty' | 'attention') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userName,
  products,
  attentionItems,
  activityFeed,
  onNavigate,
  onSelectProduct,
  onFilterCategory
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'durable' | 'beauty'>('all');

  const durableCount = products.filter(p => p.type === 'durable').length;
  const beautyCount = products.filter(p => p.type === 'beauty').length;
  const attentionCount = attentionItems.length;
  const recentAddedCount = 3;

  // Recent 4 products
  const recentProducts = products
    .filter(p => activeTab === 'all' ? true : p.type === activeTab)
    .slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
            ProductVault Intelligent Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Good morning, {userName}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Here&apos;s what needs your attention across your durable gear &amp; beauty essentials.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/products/new')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => onNavigate('/ai')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm shadow-2xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Total Products */}
        <div
          onClick={() => {
            if (onFilterCategory) onFilterCategory('all');
            onNavigate('/products');
          }}
          className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">{products.length}</div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Unified Vault</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Durable Products */}
        <div
          onClick={() => {
            if (onFilterCategory) onFilterCategory('durable');
            onNavigate('/products');
          }}
          className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Durable Products</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">{durableCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Electronics &amp; Appliances</p>
        </div>

        {/* Beauty Products */}
        <div
          onClick={() => {
            if (onFilterCategory) onFilterCategory('beauty');
            onNavigate('/products');
          }}
          className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Beauty Products</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">{beautyCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Batch &amp; PAO Tracked</p>
        </div>

        {/* Needs Attention */}
        <div
          onClick={() => onNavigate('/attention')}
          className="group p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-white border border-amber-200/80 hover:border-amber-400 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Needs Attention</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700 tabular-nums tracking-tight">{attentionCount}</div>
          <p className="text-[11px] text-amber-700/80 mt-1 flex items-center gap-1 font-medium">
            <span>Action Required</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Recently Added */}
        <div
          onClick={() => onNavigate('/products')}
          className="col-span-2 sm:col-span-1 group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200"
        >
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Recently Added</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">{recentAddedCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Indexed this week</p>
        </div>

      </div>

      {/* INTELLIGENT ATTENTION SECTION */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Intelligence Attention Center</h2>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800">
                  {attentionItems.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-500">Autonomous conflict detection, expiring warranties &amp; cosmetic PAO lifecycles</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('/attention')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Attention Items</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attentionItems.map((item) => {
            const isHigh = item.severity === 'high';
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-white transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Item Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.severity} Priority
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.timeRemaining}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="text-xs font-normal text-slate-500">• {item.productName}</span>
                  </h3>

                  {/* What Happened */}
                  <div className="mt-2.5 text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-200/70">
                    <span className="font-semibold text-slate-900 block mb-0.5">What happened:</span>
                    <p className="text-slate-600 leading-relaxed">{item.whatHappened}</p>
                  </div>

                  {/* Why it Matters */}
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Why it matters: </span>
                    <span>{item.whyItMatters}</span>
                  </div>

                  {/* Recommended Action */}
                  <div className="mt-2 text-xs text-teal-800 bg-teal-50/70 p-2 rounded-md border border-teal-100">
                    <span className="font-semibold">Recommended: </span>
                    <span>{item.recommendedAction}</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Type: <span className="capitalize font-semibold text-slate-700">{item.productType}</span>
                  </span>
                  <button
                    onClick={() => {
                      onSelectProduct(item.productId);
                      onNavigate(item.targetRoute as AppRoute);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TWO-COLUMN LAYOUT: Recent Products & Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Recent Products */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Products</h2>
              <p className="text-xs text-slate-500">Latest durable devices and skincare indexed into your vault</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('durable')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'durable' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Durable
              </button>
              <button
                onClick={() => setActiveTab('beauty')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeTab === 'beauty' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Beauty
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentProducts.map((product) => {
              const isDurable = product.type === 'durable';
              const durableProd = product as any;
              const beautyProd = product as any;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-36 bg-slate-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md shadow-2xs ${
                        isDurable ? 'bg-indigo-900/80 text-white' : 'bg-teal-900/80 text-teal-100'
                      }`}>
                        {product.type}
                      </span>
                      {product.status === 'attention' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Needs Attention
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-2.5 right-2.5 text-[11px] font-semibold px-2 py-0.5 rounded bg-white/90 text-slate-700 backdrop-blur-md shadow-2xs">
                      {product.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">{product.brand}</div>
                      <h3 className="text-sm font-bold text-slate-900 truncate mt-0.5">{product.name}</h3>

                      {isDurable && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">Model: {durableProd.model}</p>
                      )}
                      {!isDurable && (
                        <p className="text-xs text-slate-500 mt-0.5 truncate">Batch: {beautyProd.batchNumber} • Vol: {beautyProd.volumeSize || 'Standard'}</p>
                      )}

                      {/* Lifecycle indicator */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600">
                        {isDurable ? (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Warranty:</span>
                            <span className={`font-semibold ${
                              durableProd.warrantyStatus === 'expiring_soon' ? 'text-amber-600' :
                              durableProd.warrantyStatus === 'expired' ? 'text-rose-600' : 'text-teal-700'
                            }`}>
                              {durableProd.warrantyStatus === 'expiring_soon' ? 'Expiring Soon' : 
                               durableProd.warrantyStatus === 'expired' ? 'Expired' : 'Active'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">PAO Expiry:</span>
                            <span className={`font-semibold ${
                              beautyProd.openedStatus === 'expiring_soon' ? 'text-amber-600' : 'text-teal-700'
                            }`}>
                              {beautyProd.openedDate ? `${beautyProd.paoMonths} (Opened)` : 'Unopened'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectProduct(product.id);
                          onNavigate(`/products/${product.id}`);
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold transition-colors text-center"
                      >
                        View Product
                      </button>
                      <button
                        onClick={() => onNavigate('/documents')}
                        title="View Documents"
                        className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('/products')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
            >
              Browse all {products.length} products in catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 1 Column: Quick Actions & Recent Activity */}
        <div className="space-y-6">
          
          {/* QUICK ACTIONS CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">Quick Actions</h2>
            <p className="text-xs text-slate-500 mb-4">Execute high-frequency product lifecycle tasks</p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('/products/new')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Add Product</p>
                    <p className="text-[11px] text-slate-500">Catalog durable device or beauty batch</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/documents')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Upload Document</p>
                    <p className="text-[11px] text-slate-500">Invoice, receipt or warranty card</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/ai')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Ask Warranty AI</p>
                    <p className="text-[11px] text-slate-500">Check coverage clauses &amp; deadlines</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('/claims')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Check Claim Readiness</p>
                    <p className="text-[11px] text-slate-500">Audit required proof and documents</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* RECENT ACTIVITY FEED */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
              <span className="text-[11px] text-slate-400">Live feed</span>
            </div>

            <div className="relative border-l border-slate-200 ml-3 space-y-4">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="relative pl-6">
                  {/* Timeline bullet */}
                  <span className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                    activity.type === 'conflict_detected' ? 'bg-amber-500' :
                    activity.type === 'issue_reported' ? 'bg-rose-500' :
                    activity.type === 'field_verified' ? 'bg-teal-500' : 'bg-indigo-600'
                  }`} />
                  
                  <div className="flex items-baseline justify-between gap-1">
                    <p className="text-xs font-semibold text-slate-900">{activity.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{activity.timestamp}</span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 truncate">{activity.productName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{activity.detail}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
