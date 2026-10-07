import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  HelpCircle,
  Laptop,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Product, AppRoute } from '../types';

interface WarrantyAICopilotViewProps {
  products: Product[];
  onNavigate: (route: AppRoute) => void;
  onSelectProduct: (productId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  clauseCited?: string;
  sourceDoc?: string;
  confidence?: 'high' | 'medium';
  actionPrompt?: {
    label: string;
    route: AppRoute;
    productId?: string;
  };
}

export const WarrantyAICopilotView: React.FC<WarrantyAICopilotViewProps> = ({
  products,
  onNavigate,
  onSelectProduct
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Initial messages
  const [messages, setMessages] = useState<ChatMessage[]>(
    activeProduct
      ? [
          {
            id: 'm-1',
            sender: 'ai',
            text: `Hello! I am your ProductVault AI Lifecycle Copilot. I analyze manufacturer warranty terms, retail invoices, serial attestations, and cosmetics PAO shelf-life dates across your vault. Currently focused on: ${activeProduct.name}. How can I assist you with coverage, claim preparation, or exclusions?`,
            timestamp: 'Just now',
            confidence: 'high'
          }
        ]
      : []
  );

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Suggested questions based on selected product
  const suggestedQuestions = (() => {
    if (!activeProduct) return [];
    if (activeProduct.type === 'durable') {
      return [
        `What is covered under the ${activeProduct.brand} warranty?`,
        'Does the warranty cover accidental drops or liquid spills?',
        'What documents are needed to file a repair claim?',
        'When does my hardware guarantee expire?'
      ];
    } else {
      return [
        'How long is this beauty product safe to use after opening?',
        'What does the PAO rating indicate for formula stability?',
        'Are there any flagged allergen ingredients in this batch?',
        'When should I discard or replace this cosmetic product?'
      ];
    }
  })();

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || !activeProduct) return;

    const userMsgId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    // Formulate AI Answer from knowledge base or intelligent synthesis
    setTimeout(() => {
      let replyText = '';
      let clauseCited: string | undefined;
      let sourceDoc: string | undefined;
      let confidence: 'high' | 'medium' = 'high';
      let actionPrompt: ChatMessage['actionPrompt'] | undefined;

      if (activeProduct.type === 'durable') {
        const dur = activeProduct;
        if (query.toLowerCase().includes('drop') || query.toLowerCase().includes('liquid') || query.toLowerCase().includes('accident')) {
          replyText = `Under the standard ${dur.brand} Limited Warranty for ${dur.name}, accidental damage, chassis denting, drops, and liquid submersion are explicitly excluded from free repair coverage. An extended plan like AppleCare+ or Comprehensive Protection is required for accidental handling damage.`;
          clauseCited = 'Section 4.1: Exclusions from Standard Hardware Coverage (Liquid & Drop Impact)';
          sourceDoc = `${dur.brand}_Warranty_Policy_Terms.pdf, Page 3`;
          confidence = 'high';
          actionPrompt = {
            label: 'Explore Extended Protection Plans',
            route: '/post-warranty',
            productId: dur.id
          };
        } else if (query.toLowerCase().includes('when') || query.toLowerCase().includes('expire')) {
          replyText = `Your ${dur.name} warranty is active until ${dur.warrantyExpiryDate}. Coverage status is currently classified as "${dur.warrantyStatus.replace('_', ' ').toUpperCase()}".`;
          clauseCited = `Section 1.1: Standard Limited Warranty Period (${dur.warrantyPeriodMonths} Months from verified bill of sale)`;
          sourceDoc = 'Verified_Invoice_Record.pdf';
          confidence = 'high';
          actionPrompt = {
            label: 'View Hardware Record',
            route: `/products/${dur.id}` as AppRoute,
            productId: dur.id
          };
        } else if (query.toLowerCase().includes('claim') || query.toLowerCase().includes('document')) {
          replyText = `For a successful claim on your ${dur.name}, the authorized service center requires: (1) Official itemized invoice showing serial number ${dur.serialNumber}, (2) Active warranty policy verification, and (3) Diagnostic error description. Your vault claim readiness score is ${dur.claimReadinessScore}%.`;
          clauseCited = 'Section 6.2: Authorized Service Intake & Proof Attestation Guidelines';
          sourceDoc = 'Authorized_Service_Intake_Requirements.pdf';
          confidence = 'high';
          actionPrompt = {
            label: 'Run Claim Readiness Auditor',
            route: '/claims',
            productId: dur.id
          };
        } else {
          replyText = `Based on your verified records for ${dur.name} (${dur.brand}): Hardware defects in materials and manufacturing workmanship are protected through ${dur.warrantyExpiryDate}. Serial ${dur.serialNumber} is verified and matched across all vault documents.`;
          clauseCited = 'Section 2.0: Manufacturer Express Hardware Warranty Scope';
          sourceDoc = 'Official_Warranty_Agreement.pdf, Page 1';
          confidence = 'high';
        }
      } else {
        const bty = activeProduct;
        if (query.toLowerCase().includes('safe') || query.toLowerCase().includes('pao') || query.toLowerCase().includes('discard') || query.toLowerCase().includes('open')) {
          replyText = `For ${bty.name}, the designated Period After Opening (PAO) is ${bty.paoMonths}. Opened on ${bty.openedDate || 'recently'}, the formula remains in its peak cosmetic efficacy window. Store away from direct sunlight and humid environments to prevent active ingredient oxidation.`;
          clauseCited = `EU Cosmetics Regulation (EC) No 1223/2009: PAO ${bty.paoMonths} Guidelines`;
          sourceDoc = 'Product_Packaging_Label_Scan.pdf, Panel B';
          confidence = 'high';
          actionPrompt = {
            label: 'View Beauty Freshness Lifecycle',
            route: `/products/${bty.id}` as AppRoute,
            productId: bty.id
          };
        } else {
          replyText = `For ${bty.name} (Batch ${bty.batchNumber}): Manufactured on ${bty.manufacturingDate} with unopened expiry on ${bty.expiryDate}. Current status is "${bty.openedStatus.toUpperCase()}".`;
          clauseCited = 'Batch Verification & Ingredient Safety Declaration';
          sourceDoc = 'Batch_Sticker_Extraction.pdf';
          confidence = 'high';
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: 'Just now',
        clauseCited,
        sourceDoc,
        confidence,
        actionPrompt
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 550);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (!activeProduct) {
      setMessages([]);
      return;
    }
    setMessages([
      {
        id: `m-init-${Date.now()}`,
        sender: 'ai',
        text: `Conversation history cleared. Focused on: ${activeProduct.name}. Ask me anything regarding warranty clauses, fine-print exclusions, or claim filing requirements.`,
        timestamp: 'Just now',
        confidence: 'high'
      }
    ]);
  };

  if (!activeProduct) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 text-slate-500 text-sm">
        Add a product to your vault to start a conversation with the Warranty AI Copilot.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Autonomous Fine-Print Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Warranty &amp; Lifecycle AI Assistant</h1>
          <p className="text-sm text-slate-500 mt-1">
            Grounded reasoning against your verified invoices, manufacturer warranty terms, and cosmetic batch shelf life
          </p>
        </div>

        {/* Product Focus Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Product Focus:</span>
          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              const p = products.find(prod => prod.id === e.target.value);
              if (p) {
                setMessages(prev => [
                  ...prev,
                  {
                    id: `switch-${Date.now()}`,
                    sender: 'ai',
                    text: `Switched context to ${p.name} (${p.brand}). What would you like to verify regarding this product's warranty, exclusions, or lifecycle status?`,
                    timestamp: 'Just now',
                    confidence: 'high'
                  }
                ]);
              }
            }}
            className="px-3.5 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl shadow-2xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.brand})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Copilot Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar: Context & Quick Prompts */}
        <div className="space-y-4 lg:col-span-1">
          
          {/* Active Product Context Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Audited Context
            </span>
            <div>
              <span className="text-xs font-semibold text-indigo-600">{activeProduct.brand}</span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{activeProduct.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeProduct.type === 'durable' ? 'Hardware & Electronics' : 'Cosmetics & Skincare'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
              {activeProduct.type === 'durable' ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Warranty Status:</span>
                    <span className="font-bold text-slate-800 uppercase text-[10px]">
                      {activeProduct.warrantyStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expires:</span>
                    <span className="font-semibold text-slate-800">{activeProduct.warrantyExpiryDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Claim Readiness:</span>
                    <span className="font-bold text-indigo-600">{activeProduct.claimReadinessScore}%</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PAO Limit:</span>
                    <span className="font-bold text-slate-800">{activeProduct.paoMonths}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Opened:</span>
                    <span className="font-semibold text-slate-800">{activeProduct.openedDate || 'Recent'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Freshness:</span>
                    <span className="font-bold text-teal-600 uppercase text-[10px]">
                      {activeProduct.openedStatus}
                    </span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                onSelectProduct(activeProduct.id);
                onNavigate(`/products/${activeProduct.id}` as AppRoute);
              }}
              className="w-full py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-indigo-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>View Product Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Suggested Question Chips */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Suggested Clause Inquiries
            </span>
            <div className="space-y-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 text-slate-700 hover:text-indigo-900 text-xs transition-all flex items-start gap-2 group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Clear Action */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>

        </div>

        {/* Right Main Chat Container */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat Header Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">ProductVault Lifecycle Reasoning Engine</p>
                <p className="text-[11px] text-slate-500">Autonomous synthesis grounded in policy documents</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified Proof Active</span>
              </span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FCFCFB]/50">
            {messages.map((m) => {
              const isAI = m.sender === 'ai';
              return (
                <div key={m.id} className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
                  {isAI && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-2.5 max-w-xl ${isAI ? 'text-left' : 'text-right'}`}>
                    <div 
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs relative group ${
                        isAI 
                          ? 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs' 
                          : 'bg-indigo-600 text-white rounded-tr-xs'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>

                      {/* Cited Clause Box */}
                      {m.clauseCited && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[10px] text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>Cited Guarantee Clause</span>
                            </span>
                            {m.confidence && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {m.confidence === 'high' ? '98% High Confidence' : 'Document Inferred'}
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-[11px] text-slate-800 bg-white p-2 rounded-lg border border-slate-200">
                            {m.clauseCited}
                          </p>
                          {m.sourceDoc && (
                            <p className="text-[10px] text-slate-400">
                              Attested Source: <strong className="text-slate-600">{m.sourceDoc}</strong>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Prompt Button */}
                      {m.actionPrompt && (
                        <div className="mt-3 pt-2 border-t border-slate-100 flex justify-start">
                          <button
                            onClick={() => {
                              if (m.actionPrompt?.productId) {
                                onSelectProduct(m.actionPrompt.productId);
                              }
                              onNavigate(m.actionPrompt!.route);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
                          >
                            <span>{m.actionPrompt.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Copy Message Action */}
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        title="Copy answer"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600"
                      >
                        {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
                      <span>{m.timestamp}</span>
                    </div>
                  </div>

                  {!isAI && (
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs mt-0.5">
                      U
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-500 rounded-tl-xs flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] font-semibold text-slate-600">Cross-referencing vault policy documents...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200/90">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Ask about ${activeProduct.name} warranty clauses, burn-in, accidental liquid, or shelf-life...`}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Inquire</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
