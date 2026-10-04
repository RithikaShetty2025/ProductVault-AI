import React, { useState } from 'react';
import { 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Settings as SettingsIcon, 
  Plus, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowLeft,
  Send,
  Bot,
  User,
  ShieldAlert,
  FileCheck2,
  Trash2,
  Download
} from 'lucide-react';
import { Product, AttentionItem, AppRoute, ProductType } from '../types';

/* =========================================================================
   DOCUMENTS VIEW
   ========================================================================= */
export const DocumentsView: React.FC<{
  products: Product[];
  onNavigate: (route: AppRoute) => void;
}> = ({ products, onNavigate }) => {
  const [filterType, setFilterType] = useState<'all' | 'invoices' | 'warranties' | 'manuals'>('all');

  const mockDocuments = [
    { id: 'doc-1', name: 'Apple_Store_Invoice_C02GK993MD6R.pdf', type: 'Invoice', product: 'MacBook Air M3', size: '1.2 MB', date: 'Oct 18, 2025', status: 'verified' },
    { id: 'doc-2', name: 'Samsung_BestBuy_Receipt_RF8W301XZ9K.pdf', type: 'Receipt', product: 'Galaxy S24 Ultra', size: '890 KB', date: 'Feb 14, 2026', status: 'conflict' },
    { id: 'doc-3', name: 'Sony_Order_Confirmation_Amazon.pdf', type: 'Receipt', product: 'Sony WH-1000XM5', size: '420 KB', date: 'Dec 05, 2025', status: 'incomplete' },
    { id: 'doc-4', name: 'LG_OLED_5Year_Panel_Guarantee.pdf', type: 'Warranty Card', product: 'LG OLED C3 65" TV', size: '2.4 MB', date: 'Jun 20, 2025', status: 'verified' },
    { id: 'doc-5', name: 'Dyson_HP09_Registration_Certificate.pdf', type: 'Warranty Card', product: 'Dyson Purifier Hot+Cool', size: '1.1 MB', date: 'Nov 01, 2025', status: 'verified' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents &amp; Proof Vault</h1>
          <p className="text-sm text-slate-500">Invoices, serial certificates, receipt scans, and warranty agreements</p>
        </div>
        <button 
          onClick={() => alert('Document upload modal will open in the next phase.')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors self-start"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Repository Files</span>
          <span className="text-xs text-slate-400">{mockDocuments.length} files indexed</span>
        </div>
        <div className="divide-y divide-slate-100">
          {mockDocuments.map((doc) => (
            <div key={doc.id} className="p-4 hover:bg-slate-50/80 flex items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.product} • {doc.type} • {doc.size}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  doc.status === 'verified' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                  doc.status === 'conflict' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {doc.status}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">{doc.date}</span>
                <button 
                  onClick={() => alert(`Downloading ${doc.name}`)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   ATTENTION VIEW
   ========================================================================= */
export const AttentionView: React.FC<{
  attentionItems: AttentionItem[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (id: string) => void;
}> = ({ attentionItems, onNavigate, onSelectProduct }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Actions &amp; Attention Center</h1>
        <p className="text-sm text-slate-500">Intelligent system alerts, detected document conflicts, and expiring lifecycles</p>
      </div>

      <div className="space-y-4">
        {attentionItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  item.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.severity} Priority
                </span>
                <span className="text-xs font-semibold text-slate-500">{item.timeRemaining}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.title} — {item.productName}</h3>
              <p className="text-xs text-slate-600 leading-relaxed"><strong className="text-slate-800">Issue:</strong> {item.whatHappened}</p>
              <p className="text-xs text-teal-800 bg-teal-50/60 p-2 rounded-lg border border-teal-100">
                <strong>Recommended:</strong> {item.recommendedAction}
              </p>
            </div>

            <button
              onClick={() => {
                onSelectProduct(item.productId);
                onNavigate(item.targetRoute as AppRoute);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors self-start md:self-center shrink-0 flex items-center gap-1.5"
            >
              <span>{item.ctaText}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   CLAIMS VIEW
   ========================================================================= */
export const ClaimsView: React.FC<{
  products: Product[];
  onNavigate: (route: AppRoute) => void;
}> = ({ products, onNavigate }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warranty Claims Engine</h1>
          <p className="text-sm text-slate-500">Autonomous evidence compilation, readiness auditing, and repair filing</p>
        </div>
        <button 
          onClick={() => alert('New claim wizard will be expanded in subsequent prompt.')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs self-start"
        >
          File New Claim
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Claims Filed</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">2</p>
          <p className="text-xs text-slate-400 mt-1">1 In Progress, 1 Resolved</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Average Claim Readiness</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">87%</p>
          <p className="text-xs text-slate-400 mt-1">Based on indexed proof documents</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase">Estimated Recovery</p>
          <p className="text-2xl font-bold text-teal-700 mt-1">$1,450</p>
          <p className="text-xs text-slate-400 mt-1">Hardware replacement value</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Active Claim File: Sony WH-1000XM5</h3>
        <p className="text-xs text-slate-600 mb-4">
          Reported issue: Headphone right ear-cup acoustic artifact. Claim readiness currently blocked by missing VAT receipt.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('/documents')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
          >
            Upload Missing Proof
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   WARRANTY AI VIEW
   ========================================================================= */
export const WarrantyAIView: React.FC<{
  products: Product[];
}> = ({ products }) => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello Sushma! I am your ProductVault AI Lifecycle Copilot. You can ask me questions about warranty coverage periods, fine-print exclusions, cosmetic batch freshness, or claim filing preparation.' }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userMsg = inputVal;
    setInputVal('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: `Based on your ProductVault records: For ${products[0]?.name || 'your hardware'}, the manufacturer limited warranty expires in 18 days. The standard policy covers manufacturing defects in materials and workmanship, excluding accidental liquid damage unless extended via premium protection.` 
        }
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-1">
          <Sparkles className="w-3.5 h-3.5" /> Intelligent Clause Analysis
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Warranty &amp; Lifecycle AI Assistant</h1>
        <p className="text-sm text-slate-500">Ask any question regarding your durable warranty policies, consumer rights, or skincare PAO limits</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 h-[480px] flex flex-col overflow-hidden shadow-xs">
        {/* Chat Messages */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                m.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-xs' 
                  : 'bg-slate-100 text-slate-800 rounded-bl-xs'
              }`}>
                {m.text}
              </div>
              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-bold text-xs">
                  S
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about MacBook warranty, sunscreen expiration, or claim requirements..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            onClick={handleSend}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SETTINGS VIEW
   ========================================================================= */
export const SettingsView: React.FC<{
  userName: string;
  userEmail: string;
  onUpdateUser: (name: string, email: string) => void;
}> = ({ userName, userEmail, onUpdateUser }) => {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(name, email);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings &amp; Vault Preferences</h1>
        <p className="text-sm text-slate-500">Configure profile, intelligence alert triggers, and vault domains</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notification Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors"
            >
              Save Preferences
            </button>
            {saved && (
              <span className="ml-3 text-xs font-semibold text-teal-700">Settings saved successfully!</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================================
   ADD PRODUCT VIEW (/products/new)
   ========================================================================= */
export const AddProductView: React.FC<{
  onAddProduct: (product: Product) => void;
  onBack: () => void;
}> = ({ onAddProduct, onBack }) => {
  const [productType, setProductType] = useState<ProductType>('durable');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [modelOrBatch, setModelOrBatch] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseOrMfgDate, setPurchaseOrMfgDate] = useState('2026-09-01');
  const [paoMonths, setPaoMonths] = useState('12M');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) {
      alert('Please fill in product name and brand.');
      return;
    }

    const id = `prod-new-${Date.now()}`;
    const base = {
      id,
      name,
      brand,
      category: category || (productType === 'durable' ? 'Electronics' : 'Skincare'),
      type: productType,
      image: productType === 'durable'
        ? 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      notes: 'Newly cataloged into ProductVault.'
    };

    if (productType === 'durable') {
      onAddProduct({
        ...base,
        type: 'durable',
        model: modelOrBatch || 'Standard Model',
        serialNumber: serialNumber || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
        purchaseDate: purchaseOrMfgDate,
        purchasePrice: '$999.00',
        seller: 'Official Retailer',
        warrantyStatus: 'active',
        warrantyStartDate: purchaseOrMfgDate,
        warrantyExpiryDate: '2028-09-01',
        warrantyPeriodMonths: 24,
        warrantyCoverageSummary: '24-Month Manufacturer Guarantee',
        documentsCount: 1,
        verifiedFieldsCount: 6,
        totalFieldsCount: 8,
        claimReadinessScore: 80,
        documents: [],
        extractedFields: [],
        conflicts: [],
        issues: [],
        plannerItems: [],
        renewalPlans: [],
        timeline: []
      });
    } else {
      onAddProduct({
        ...base,
        type: 'beauty',
        batchNumber: modelOrBatch || 'BTH-2026-X',
        manufacturingDate: purchaseOrMfgDate,
        expiryDate: '2028-09-01',
        paoMonths: paoMonths || '12M',
        openedStatus: 'fresh',
        openedDate: '2026-09-15',
        usagePeriodDays: 14,
        documents: [],
        extractedFields: [],
        timeline: []
      });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add Product to Vault</h1>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Catalog a durable physical device or a cosmetic beauty batch with separate lifecycle intelligence
        </p>

        {/* Domain Toggle */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setProductType('durable')}
            className={`p-3 rounded-xl border text-center transition-all ${
              productType === 'durable'
                ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <p className="text-sm">Durable Product</p>
            <p className="text-[11px] font-normal opacity-75">Laptop, Phone, Appliance</p>
          </button>
          <button
            type="button"
            onClick={() => setProductType('beauty')}
            className={`p-3 rounded-xl border text-center transition-all ${
              productType === 'beauty'
                ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}
          >
            <p className="text-sm">Beauty Product</p>
            <p className="text-[11px] font-normal opacity-75">Serum, Cream, Cosmetics</p>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
            <input
              type="text"
              placeholder="e.g. MacBook Pro 16 or Hyaluronic Acid Serum"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand</label>
              <input
                type="text"
                placeholder="e.g. Apple, Sony, The Ordinary"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Laptops, Sunscreen"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {productType === 'durable' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Model / Hardware Version</label>
                <input
                  type="text"
                  placeholder="e.g. A2986"
                  value={modelOrBatch}
                  onChange={(e) => setModelOrBatch(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
                <input
                  type="text"
                  placeholder="e.g. C02GK993MD6R"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Batch Code</label>
                <input
                  type="text"
                  placeholder="e.g. 3H04B"
                  value={modelOrBatch}
                  onChange={(e) => setModelOrBatch(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">PAO (Period After Opening)</label>
                <select
                  value={paoMonths}
                  onChange={(e) => setPaoMonths(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="6M">6 Months (6M)</option>
                  <option value="12M">12 Months (12M)</option>
                  <option value="24M">24 Months (24M)</option>
                </select>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
            >
              Save Product Record to Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
