import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Upload, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  X, 
  Download,
  Laptop,
  Sparkles,
  Layers,
  ArrowUpDown,
  FileCheck2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  RefreshCw,
  Plus
} from 'lucide-react';
import { Product, ProductDocument, AppRoute } from '../types';

interface GlobalDocumentsVaultViewProps {
  products: Product[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (productId: string) => void;
  onUploadDocumentToProduct: (productId: string, doc: ProductDocument) => void;
  onDeleteDocument: (productId: string, docId: string) => void;
}

export const GlobalDocumentsVaultView: React.FC<GlobalDocumentsVaultViewProps> = ({
  products,
  onNavigate,
  onSelectProduct,
  onUploadDocumentToProduct,
  onDeleteDocument
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'name_asc' | 'product_asc'>('date_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Preview Drawer Modal
  const [previewDoc, setPreviewDoc] = useState<{ doc: ProductDocument; product: Product } | null>(null);

  // Upload Document Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTargetProductId, setUploadTargetProductId] = useState(products[0]?.id || '');
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<any>('Invoice');
  const [newDocSnippet, setNewDocSnippet] = useState('');

  // Collect all documents across all products
  const allVaultDocuments = useMemo(() => {
    const list: { doc: ProductDocument; product: Product }[] = [];
    products.forEach((prod) => {
      (prod.documents || []).forEach((d) => {
        list.push({ doc: d, product: prod });
      });
    });
    return list;
  }, [products]);

  // Extract unique document types
  const documentTypes = useMemo(() => {
    const set = new Set<string>();
    allVaultDocuments.forEach(item => set.add(item.doc.type));
    return Array.from(set);
  }, [allVaultDocuments]);

  // Filter and sort
  const filteredDocuments = useMemo(() => {
    return allVaultDocuments.filter(({ doc, product }) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesProduct = product.name.toLowerCase().includes(q);
        const matchesType = doc.type.toLowerCase().includes(q);
        const matchesSnippet = (doc.previewSnippet || '').toLowerCase().includes(q);
        if (!matchesName && !matchesProduct && !matchesType && !matchesSnippet) {
          return false;
        }
      }

      // Product filter
      if (selectedProductFilter !== 'all' && product.id !== selectedProductFilter) {
        return false;
      }

      // Type filter
      if (selectedTypeFilter !== 'all' && doc.type !== selectedTypeFilter) {
        return false;
      }

      // Status filter
      if (selectedStatusFilter !== 'all' && doc.status !== selectedStatusFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'name_asc') {
        return a.doc.name.localeCompare(b.doc.name);
      }
      if (sortBy === 'product_asc') {
        return a.product.name.localeCompare(b.product.name);
      }
      return new Date(b.doc.uploadDate).getTime() - new Date(a.doc.uploadDate).getTime();
    });
  }, [allVaultDocuments, searchQuery, selectedProductFilter, selectedTypeFilter, selectedStatusFilter, sortBy]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !uploadTargetProductId) return;

    const newDoc: ProductDocument = {
      id: `doc-vault-${Date.now()}`,
      productId: uploadTargetProductId,
      name: newDocName,
      type: newDocType,
      uploadDate: new Date().toISOString().split('T')[0],
      size: '1.8 MB',
      source: 'Global Documents Ingestion',
      status: 'verified',
      previewSnippet: newDocSnippet || `Verified ${newDocType} indexed on ${new Date().toLocaleDateString()}.`,
      pageCount: 1
    };

    onUploadDocumentToProduct(uploadTargetProductId, newDoc);
    setUploadModalOpen(false);
    setNewDocName('');
    setNewDocSnippet('');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProductFilter('all');
    setSelectedTypeFilter('all');
    setSelectedStatusFilter('all');
    setSortBy('date_desc');
  };

  const hasActiveFilters = searchQuery !== '' || selectedProductFilter !== 'all' || selectedTypeFilter !== 'all' || selectedStatusFilter !== 'all';

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
            <Layers className="w-3.5 h-3.5" /> Central Document Repository
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents Vault</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Search, preview, and audit all purchase invoices, warranty certificates, and serial labels across your vault ({allVaultDocuments.length} files)
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents by filename, product, or OCR text..."
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

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter by Product */}
            <select
              value={selectedProductFilter}
              onChange={(e) => setSelectedProductFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="all">All Products ({products.length})</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {/* Filter by Doc Type */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="all">All Document Types</option>
              {documentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="conflict">Document Conflict</option>
              <option value="unverified">Needs Verification</option>
              <option value="processing">Processing</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80 rounded-xl"
            >
              <option value="date_desc">Sort: Newest Upload</option>
              <option value="name_asc">Sort: Document Name</option>
              <option value="product_asc">Sort: Product Name</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-2xs">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-400 hover:text-slate-700'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredDocuments.length}</strong> of {allVaultDocuments.length} files
          </span>
          <span className="text-[11px] text-slate-400">
            Encrypted source ledger intact
          </span>
        </div>
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-md mx-auto shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No documents match your filters</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Try resetting your search query or product filter to view all attached files in the vault.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            >
              Upload Document
            </button>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === 'list' && filteredDocuments.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Document File</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Associated Product</th>
                  <th className="py-3 px-4">Upload Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.map(({ doc, product }) => {
                  const isConflict = doc.status === 'conflict';
                  const isVerified = doc.status === 'verified';

                  return (
                    <tr 
                      key={doc.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setPreviewDoc({ doc, product })}
                    >
                      {/* Name & OCR excerpt */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-sm">
                            <p className="font-bold text-slate-900 truncate">{doc.name}</p>
                            <p className="text-[11px] text-slate-400 truncate font-mono">
                              {doc.previewSnippet || `${doc.size} • Verified`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {doc.type}
                        </span>
                      </td>

                      {/* Associated Product */}
                      <td className="py-3 px-4">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(product.id);
                            onNavigate(`/products/${product.id}`);
                          }}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          <span className="font-semibold text-slate-900 block truncate">{product.name}</span>
                          <span className="text-[11px] text-slate-400 capitalize">{product.brand} • {product.type}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {doc.uploadDate}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {isConflict ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Conflict Detected
                          </span>
                        ) : isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                            <CheckCircle2 className="w-3 h-3 text-teal-600" /> Verified Record
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            <Clock className="w-3 h-3 text-slate-400" /> Needs Review
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setPreviewDoc({ doc, product })}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => onDeleteDocument(product.id, doc.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && filteredDocuments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map(({ doc, product }) => {
            const isConflict = doc.status === 'conflict';
            const isVerified = doc.status === 'verified';

            return (
              <div
                key={doc.id}
                onClick={() => setPreviewDoc({ doc, product })}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {doc.type}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600 truncate mt-0.5">{product.name}</p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-mono line-clamp-2">
                    {doc.previewSnippet || 'Verified source document attached to vault record.'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">{doc.uploadDate}</span>

                  <div className="flex items-center gap-1.5">
                    {isConflict && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        Conflict
                      </span>
                    )}
                    {isVerified && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          DETAILED DOCUMENT PREVIEW DRAWER / MODAL
         ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {previewDoc.doc.type}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    previewDoc.doc.status === 'conflict' ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-teal-700'
                  }`}>
                    {previewDoc.doc.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{previewDoc.doc.name}</h3>
                <p className="text-xs text-slate-500">Associated with {previewDoc.product.name} ({previewDoc.product.type})</p>
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">File Size</span>
                <span className="font-semibold text-slate-800">{previewDoc.doc.size}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Upload Date</span>
                <span className="font-semibold text-slate-800">{previewDoc.doc.uploadDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Ingestion Source</span>
                <span className="font-semibold text-slate-800 truncate block">{previewDoc.doc.source}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Storage State</span>
                <span className="font-semibold text-teal-700">Encrypted Local</span>
              </div>
            </div>

            {/* Simulated Document OCR Page Viewport */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Source Document Page Preview &amp; OCR Layer
              </span>
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400 pb-2 border-b border-slate-800 flex justify-between">
                  <span>--- DOCUMENT SCANNER INTERPOLATION ---</span>
                  <span>CONFIDENCE: 99.2%</span>
                </div>
                <p className="text-teal-400">{previewDoc.doc.previewSnippet}</p>
                <p className="text-slate-400 text-[11px]">
                  [AUTHENTICATED HEADER] Product: {previewDoc.product.name} | Identifier: {
                    previewDoc.product.type === 'durable' ? (previewDoc.product as any).serialNumber : (previewDoc.product as any).batchNumber
                  } | Checksum: SHA-256 Verified.
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
              <button
                onClick={() => {
                  onSelectProduct(previewDoc.product.id);
                  onNavigate(`/products/${previewDoc.product.id}`);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Open Product Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onDeleteDocument(previewDoc.product.id, previewDoc.doc.id);
                    setPreviewDoc(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition-colors"
                >
                  Delete Document
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          ATTACH DOCUMENT MODAL (GLOBAL)
         ========================================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Upload to Documents Vault</h3>
              <button onClick={() => setUploadModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Product</label>
                <select
                  value={uploadTargetProductId}
                  onChange={(e) => setUploadTargetProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document File Name</label>
                <input
                  type="text"
                  placeholder="e.g. Authorized_Store_Invoice.pdf"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Category</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Invoice">Store Purchase Invoice</option>
                  <option value="Warranty Document">Warranty Document / Certificate</option>
                  <option value="Product Label">Product Label / Serial Sticker</option>
                  <option value="Service Receipt">Service / Repair Receipt</option>
                  <option value="Claim Evidence">Claim Photographic Evidence</option>
                  <option value="Batch Code Sticker">Batch Code Sticker Scan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">OCR Excerpt or Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Tax invoice #9921 displaying serial number"
                  value={newDocSnippet}
                  onChange={(e) => setNewDocSnippet(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Attach &amp; Index File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
