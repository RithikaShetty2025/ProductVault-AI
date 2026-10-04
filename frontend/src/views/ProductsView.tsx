import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MoreVertical, 
  Laptop, 
  Sparkles, 
  ArrowUpDown,
  X,
  ExternalLink,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { Product, ProductType, AppRoute, DurableProduct, BeautyProduct } from '../types';

interface ProductsViewProps {
  products: Product[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (productId: string) => void;
  initialTypeFilter?: 'all' | 'durable' | 'beauty' | 'attention';
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  initialTypeFilter = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'durable' | 'beauty'>(
    initialTypeFilter === 'durable' || initialTypeFilter === 'beauty' ? initialTypeFilter : 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(
    initialTypeFilter === 'attention' ? 'attention' : 'all'
  );
  const [warrantyFilter, setWarrantyFilter] = useState<string>('all');
  const [expiryFilter, setExpiryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date_new' | 'warranty_expiry'>('date_new');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Extract unique categories based on current products
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesBrand = prod.brand.toLowerCase().includes(query);
        const matchesCategory = prod.category.toLowerCase().includes(query);
        let matchesIdentifier = false;
        if (prod.type === 'durable') {
          matchesIdentifier = (prod as DurableProduct).serialNumber.toLowerCase().includes(query) ||
                              (prod as DurableProduct).model.toLowerCase().includes(query);
        } else {
          matchesIdentifier = (prod as BeautyProduct).batchNumber.toLowerCase().includes(query);
        }
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesIdentifier) {
          return false;
        }
      }

      // Type filter
      if (selectedType !== 'all' && prod.type !== selectedType) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && prod.status !== selectedStatus) {
        return false;
      }

      // Durable Warranty Status
      if (selectedType === 'durable' || selectedType === 'all') {
        if (warrantyFilter !== 'all' && prod.type === 'durable') {
          if ((prod as DurableProduct).warrantyStatus !== warrantyFilter) {
            return false;
          }
        }
      }

      // Beauty Expiry Status
      if (selectedType === 'beauty' || selectedType === 'all') {
        if (expiryFilter !== 'all' && prod.type === 'beauty') {
          if ((prod as BeautyProduct).openedStatus !== expiryFilter) {
            return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'date_new') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'warranty_expiry') {
        const dateA = a.type === 'durable' ? (a as DurableProduct).warrantyExpiryDate : (a as BeautyProduct).expiryDate;
        const dateB = b.type === 'durable' ? (b as DurableProduct).warrantyExpiryDate : (b as BeautyProduct).expiryDate;
        return new Date(dateA).getTime() - new Date(dateB).getTime();
      }
      return 0;
    });
  }, [products, searchQuery, selectedType, selectedCategory, selectedStatus, warrantyFilter, expiryFilter, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setWarrantyFilter('all');
    setExpiryFilter('all');
    setSortBy('date_new');
  };

  const hasActiveFilters = searchQuery !== '' || selectedType !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all' || warrantyFilter !== 'all' || expiryFilter !== 'all';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Header with Title and Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Products Vault</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Complete synchronized inventory of verified durable hardware and cosmetic lifecycles ({products.length} total)
          </p>
        </div>

        <button
          onClick={() => onNavigate('/products/new')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Primary Domain Type Selector (Durable vs Beauty) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedType === 'all' 
                ? 'bg-white text-slate-900 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setSelectedType('durable')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedType === 'durable' 
                ? 'bg-white text-indigo-700 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5 text-indigo-600" />
            Durable Goods ({products.filter(p => p.type === 'durable').length})
          </button>
          <button
            onClick={() => setSelectedType('beauty')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedType === 'beauty' 
                ? 'bg-white text-teal-700 shadow-2xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Beauty &amp; Cosmetics ({products.filter(p => p.type === 'beauty').length})
          </button>
        </div>

        {/* View mode toggle (Grid / List) */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">View:</span>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, brand, model, serial or batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
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

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Verified</option>
              <option value="attention">Needs Attention</option>
              <option value="archived">Archived / Expired</option>
            </select>

            {/* Durable Warranty Filter */}
            {selectedType === 'durable' && (
              <select
                value={warrantyFilter}
                onChange={(e) => setWarrantyFilter(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-700"
              >
                <option value="all">All Warranty States</option>
                <option value="active">Active Warranty</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            )}

            {/* Beauty Expiry Filter */}
            {selectedType === 'beauty' && (
              <select
                value={expiryFilter}
                onChange={(e) => setExpiryFilter(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-700"
              >
                <option value="all">All Expiry States</option>
                <option value="fresh">Fresh (Within PAO)</option>
                <option value="expiring_soon">PAO Expiring Soon</option>
                <option value="unopened">Unopened Sealed</option>
              </select>
            )}

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80 rounded-xl focus:outline-hidden"
            >
              <option value="date_new">Sort: Newly Added</option>
              <option value="warranty_expiry">Sort: Expiry / Warranty</option>
              <option value="name">Sort: Name (A-Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredProducts.length}</strong> of {products.length} products
          </span>
          {selectedStatus === 'attention' && (
            <span className="text-amber-700 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Filtered to items requiring attention
            </span>
          )}
        </div>
      </div>

      {/* NO RESULTS / EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No products match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Try adjusting your search keywords, clear active status filters, or browse by product domain.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              onClick={resetFilters}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => onNavigate('/products/new')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
            >
              Add New Product
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS DISPLAY: GRID VIEW */}
      {viewMode === 'grid' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const isDurable = product.type === 'durable';
            const durableProd = product as DurableProduct;
            const beautyProd = product as BeautyProduct;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col group overflow-hidden"
              >
                {/* Product Image & Badges */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md backdrop-blur-md shadow-2xs ${
                      isDurable ? 'bg-indigo-900/80 text-white' : 'bg-teal-900/80 text-teal-100'
                    }`}>
                      {product.type}
                    </span>

                    {product.status === 'attention' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 text-white backdrop-blur-md flex items-center gap-1 shadow-2xs">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Attention
                      </span>
                    )}

                    {isDurable && durableProd.hasConflict && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-600/90 text-white backdrop-blur-md flex items-center gap-1 shadow-2xs">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        Conflict
                      </span>
                    )}
                  </div>

                  <span className="absolute bottom-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-white/95 text-slate-700 shadow-2xs backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                {/* Product Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mb-1">
                      <span>{product.brand}</span>
                      <span className="text-slate-400 font-normal normal-case">
                        {isDurable ? durableProd.seller : (beautyProd.volumeSize || 'Standard')}
                      </span>
                    </div>

                    <h3 
                      onClick={() => {
                        onSelectProduct(product.id);
                        onNavigate(`/products/${product.id}`);
                      }}
                      className="text-base font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>

                    {/* Technical details */}
                    <div className="mt-2 text-xs text-slate-500 space-y-1">
                      {isDurable ? (
                        <>
                          <div className="truncate"><span className="text-slate-400">Model:</span> {durableProd.model}</div>
                          <div className="truncate font-mono text-[11px]"><span className="text-slate-400 font-sans">Serial:</span> {durableProd.serialNumber}</div>
                        </>
                      ) : (
                        <>
                          <div className="truncate font-mono text-[11px]"><span className="text-slate-400 font-sans">Batch:</span> {beautyProd.batchNumber}</div>
                          <div className="truncate"><span className="text-slate-400">PAO:</span> {beautyProd.paoMonths} period after opening</div>
                        </>
                      )}
                    </div>

                    {/* Status & Lifecycle Strip */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100">
                      {isDurable ? (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Warranty:</span>
                          <span className={`font-semibold px-2 py-0.5 rounded-md ${
                            durableProd.warrantyStatus === 'expiring_soon' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            durableProd.warrantyStatus === 'expired' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-teal-50 text-teal-700 border border-teal-200'
                          }`}>
                            {durableProd.warrantyStatus === 'expiring_soon' ? `Expiring (${durableProd.warrantyExpiryDate})` :
                             durableProd.warrantyStatus === 'expired' ? 'Expired' : `Active until ${durableProd.warrantyExpiryDate}`}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">PAO / Expiry:</span>
                          <span className={`font-semibold px-2 py-0.5 rounded-md ${
                            beautyProd.openedStatus === 'expiring_soon' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            beautyProd.openedStatus === 'unopened' ? 'bg-slate-100 text-slate-700' :
                            'bg-teal-50 text-teal-700 border border-teal-200'
                          }`}>
                            {beautyProd.openedStatus === 'expiring_soon' ? 'PAO Expiring' :
                             beautyProd.openedStatus === 'unopened' ? 'Sealed (Exp ' + beautyProd.expiryDate + ')' :
                             'Fresh in use'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectProduct(product.id);
                        onNavigate(`/products/${product.id}`);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 text-xs font-semibold transition-all text-center"
                    >
                      View Product
                    </button>
                    <button
                      onClick={() => onNavigate('/documents')}
                      title="Documents on file"
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onNavigate('/ai')}
                      title="Ask Warranty AI"
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRODUCTS DISPLAY: LIST VIEW */}
      {viewMode === 'list' && filteredProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Identifier</th>
                  <th className="py-3 px-4">Lifecycle / Coverage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((prod) => {
                  const isDurable = prod.type === 'durable';
                  const durableProd = prod as DurableProduct;
                  const beautyProd = prod as BeautyProduct;

                  return (
                    <tr 
                      key={prod.id} 
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Product image & title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span 
                              onClick={() => {
                                onSelectProduct(prod.id);
                                onNavigate(`/products/${prod.id}`);
                              }}
                              className="font-bold text-slate-900 hover:text-indigo-600 cursor-pointer block truncate"
                            >
                              {prod.name}
                            </span>
                            <span className="text-[11px] text-slate-500">{prod.brand} • {prod.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isDurable ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-teal-50 text-teal-700 border border-teal-200'
                        }`}>
                          {prod.type}
                        </span>
                      </td>

                      {/* Identifier */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                        {isDurable ? (
                          <div>
                            <div>SN: {durableProd.serialNumber}</div>
                            <div className="text-[10px] font-sans text-slate-400">Model: {durableProd.model}</div>
                          </div>
                        ) : (
                          <div>
                            <div>Batch: {beautyProd.batchNumber}</div>
                            <div className="text-[10px] font-sans text-slate-400">PAO: {beautyProd.paoMonths}</div>
                          </div>
                        )}
                      </td>

                      {/* Coverage / Lifecycle */}
                      <td className="py-3 px-4 text-slate-600">
                        {isDurable ? (
                          <div>
                            <span className={`font-semibold ${
                              durableProd.warrantyStatus === 'expiring_soon' ? 'text-amber-600' :
                              durableProd.warrantyStatus === 'expired' ? 'text-rose-600' : 'text-teal-700'
                            }`}>
                              {durableProd.warrantyExpiryDate}
                            </span>
                            <span className="text-[11px] text-slate-400 block">({durableProd.warrantyPeriodMonths}M warranty)</span>
                          </div>
                        ) : (
                          <div>
                            <span className={`font-semibold ${
                              beautyProd.openedStatus === 'expiring_soon' ? 'text-amber-600' : 'text-teal-700'
                            }`}>
                              Exp: {beautyProd.expiryDate}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              {beautyProd.openedDate ? `Opened ${beautyProd.openedDate}` : 'Sealed'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {prod.status === 'attention' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Needs Attention
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Record
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            onSelectProduct(prod.id);
                            onNavigate(`/products/${prod.id}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 font-semibold text-xs transition-colors"
                        >
                          View Record
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
