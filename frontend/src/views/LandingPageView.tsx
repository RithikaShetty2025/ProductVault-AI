import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Laptop, 
  Droplet, 
  Layers, 
  Lock, 
  Check, 
  Building2, 
  FileCheck2, 
  Zap, 
  ChevronRight, 
  Scale, 
  History, 
  Menu, 
  X,
  FileSearch,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { AppRoute } from '../types';

interface LandingPageViewProps {
  onNavigate: (route: AppRoute) => void;
  onExploreDemo: () => void;
  isAuthenticated?: boolean;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onNavigate,
  onExploreDemo,
  isAuthenticated = false
}) => {
  const [activeDomainTab, setActiveDomainTab] = useState<'durable' | 'beauty'>('durable');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLifecycleStep, setActiveLifecycleStep] = useState<number>(0);

  // 8 Connected Lifecycle Steps
  const lifecycleSteps = [
    {
      step: '01',
      title: 'Physical Product',
      badge: 'Acquisition',
      description: 'The real-world device or cosmetic item you bring home.',
      icon: Laptop,
      highlight: 'Hardware or Beauty batch'
    },
    {
      step: '02',
      title: 'Documents',
      badge: 'Raw Evidence',
      description: 'Invoices, warranty certificates, receipt slips, box scans.',
      icon: FileText,
      highlight: 'PDFs & high-res images'
    },
    {
      step: '03',
      title: 'Information Extraction',
      badge: 'OCR & Parsing',
      description: 'Autonomous extraction of purchase dates, serials, and models.',
      icon: FileSearch,
      highlight: 'Field-level confidence'
    },
    {
      step: '04',
      title: 'Human Verification',
      badge: 'Trust Layer',
      description: 'You confirm or adjust extracted details with 1-click audit trail.',
      icon: CheckCircle2,
      highlight: 'Zero unverified data'
    },
    {
      step: '05',
      title: 'Conflict Detection',
      badge: 'Discrepancy Audit',
      description: 'Flags date mismatches between invoices and retail registrations.',
      icon: AlertTriangle,
      highlight: '1-Click reconciliation'
    },
    {
      step: '06',
      title: 'Digital Product Record',
      badge: 'Single Source',
      description: 'A unified dossier holding attested documents and warranty terms.',
      icon: Shield,
      highlight: 'Persistent lifetime record'
    },
    {
      step: '07',
      title: 'Lifecycle Intelligence',
      badge: 'Proactive Monitoring',
      description: 'Tracks warranty expiration windows, active PAO timers, and recalls.',
      icon: Sparkles,
      highlight: 'Timely notifications'
    },
    {
      step: '08',
      title: 'Relevant Next Action',
      badge: 'Action Center',
      description: 'Generate dispute claims, book authorized service, or restock formulas.',
      icon: ArrowRight,
      highlight: 'Standardized dossiers'
    }
  ];

  // 12 Capabilities Cards
  const capabilities = [
    {
      icon: FileCheck2,
      title: 'Intelligent Document Vault',
      description: 'Centralize invoices, proof-of-purchase, certificates, and packaging photos with full OCR search.'
    },
    {
      icon: FileSearch,
      title: 'Information Extraction',
      description: 'Structured parsing of purchase dates, prices, serial numbers, retailers, and cosmetic batch numbers.'
    },
    {
      icon: CheckCircle,
      title: 'Human Verification',
      description: 'Human-in-the-loop review. High, medium, and low confidence badges empower you to attest critical facts.'
    },
    {
      icon: AlertTriangle,
      title: 'Document Conflict Detection',
      description: 'Autonomous detection of purchase date or serial discrepancies between documents, preventing rejected claims.'
    },
    {
      icon: ShieldCheck,
      title: 'Warranty Intelligence',
      description: 'Instant visibility into active guarantees, remaining coverage days, labor limits, and clause terms.'
    },
    {
      icon: Scale,
      title: 'Claim Readiness Auditor',
      description: 'Evaluates documentation completeness and calculates a dispute readiness score (e.g. 94%) before filing.'
    },
    {
      icon: FileText,
      title: 'Claim Denial Analysis',
      description: 'Analyzes manufacturer rejection letters, highlights specific dispute rebuttal clauses, and generates appeals.'
    },
    {
      icon: History,
      title: 'Product Lifecycle Timeline',
      description: 'Chronological activity ledger recording every purchase, upload, verification, repair event, and claim milestone.'
    },
    {
      icon: AlertTriangle,
      title: 'Attention & Action Center',
      description: 'Proactively surfaces impending warranty expirations, unresolved conflicts, and required verifications in one queue.'
    },
    {
      icon: Sparkles,
      title: 'Warranty AI Copilot',
      description: 'Ask specific coverage questions (e.g. battery, screen burn-in) and receive cited clause excerpts.'
    },
    {
      icon: Droplet,
      title: 'Beauty Expiry & PAO Tracking',
      description: 'Dedicated cosmetic lifecycle tracking batch codes, factory expiration dates, opened dates, and PAO timers.'
    },
    {
      icon: Building2,
      title: 'Post-Warranty & Service Network',
      description: 'Connect with verified authorized manufacturer service centers, compare repair costs, and explore verified upgrades.'
    }
  ];

  // 7 How It Works Steps
  const howItWorksSteps = [
    { num: '1', title: 'Add your product', desc: 'Select Durable Physical Product or Beauty & Cosmetic Batch.' },
    { num: '2', title: 'Upload documents', desc: 'Invoices, warranty PDFs, receipts, or batch packaging photos.' },
    { num: '3', title: 'ProductVault extracts information', desc: 'Simulated OCR parses serial numbers, purchase dates, and retailer metadata.' },
    { num: '4', title: 'Verify important details', desc: 'Review confidence scores and attest accurate fields with 1-click verification.' },
    { num: '5', title: 'Resolve conflicts', desc: 'Reconcile date or serial mismatches between documents before filing disputes.' },
    { num: '6', title: 'Understand warranty / lifecycle', desc: 'Monitor active guarantees, countdowns, and cited coverage terms in real-time.' },
    { num: '7', title: 'Take the right action when needed', desc: 'Generate standardized claim packets, book authorized service, or restock formulas.' }
  ];

  // 5 Proactive Attention Examples
  const attentionExamples = [
    {
      type: 'Warranty Expiring Soon',
      product: 'MacBook Air 15" M3',
      domain: 'Durable',
      whatHappened: 'Apple Limited Warranty enters final 18-day countdown.',
      whyItMatters: 'After expiration, logic board and display repairs transition entirely to out-of-pocket costs.',
      recommendedAction: 'Review diagnostic battery health and book authorized service inspection if needed.'
    },
    {
      type: 'Document Conflict Detected',
      product: 'Sony Bravia XR 65" OLED TV',
      domain: 'Durable',
      whatHappened: 'Purchase invoice date (Nov 15) conflicts with retailer warranty certificate date (Nov 24).',
      whyItMatters: 'Date mismatches give warranty adjudicators grounds to delay or reject valid repair claims.',
      recommendedAction: 'Reconcile to invoice purchase date with 1-click attestation to preserve coverage.'
    },
    {
      type: 'Missing Claim Evidence',
      product: 'Dyson Airwrap Multi-Styler',
      domain: 'Durable',
      whatHappened: 'Motor failure claim drafted, but original proof-of-purchase receipt is missing from vault.',
      whyItMatters: 'Dyson manufacturer dispute protocols strictly require proof of authorized retail purchase.',
      recommendedAction: 'Upload retail invoice or receipt slip before dispatching dispute package.'
    },
    {
      type: 'Beauty Formula Expiring',
      product: 'Drunk Elephant C-Firma Serum',
      domain: 'Beauty',
      whatHappened: '6-Month Period-After-Opening (PAO) expires in 14 days (Opened: July 15).',
      whyItMatters: 'Active L-Ascorbic Acid oxidizes, losing efficacy and potentially causing facial irritation.',
      recommendedAction: 'Finish active serum treatment or recycle bottle and restock fresh batch.'
    },
    {
      type: 'Verification Required',
      product: 'LG C3 Series 55" OLED TV',
      domain: 'Durable',
      whatHappened: 'OCR extracted serial number with medium confidence (68%) due to curved packaging reflection.',
      whyItMatters: 'An inaccurate serial number prevents automated warranty registration with LG support.',
      recommendedAction: 'Confirm extracted serial characters against the rear panel sticker.'
    }
  ];

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-indigo-500/15 selection:text-indigo-950 flex flex-col">
      
      {/* ==================================================
          1. TOP NAVIGATION (Refined Mineral Slate & Fine Contrast)
      ================================================== */}
      <header className="sticky top-0 z-50 bg-[#EFF3F8]/95 backdrop-blur-md border-b border-slate-300/80 shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">ProductVault</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200/60">AI</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <a href="#digital-vault" className="hover:text-indigo-600 transition-colors">Product</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#durable-domain" className="hover:text-indigo-600 transition-colors">Durable Products</a>
            <a href="#beauty-domain" className="hover:text-teal-700 transition-colors">Beauty Products</a>
            <a href="#capabilities" className="hover:text-indigo-600 transition-colors">Intelligence &amp; Features</a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => onNavigate('/dashboard')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5"
              >
                <span>Enter Your Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('/signup')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all"
                >
                  Create Account
                </button>
                <button
                  onClick={onExploreDemo}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-indigo-700 hover:bg-indigo-50/70 text-xs font-semibold shadow-2xs transition-colors"
                >
                  <span>Explore Demo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
            >
              Join
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white/80"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-2.5 pb-4 space-y-2 shadow-lg">
            <nav className="flex flex-col space-y-1 text-xs font-semibold text-slate-700">
              <a href="#digital-vault" onClick={() => setMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50">Product</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50">How It Works</a>
              <a href="#durable-domain" onClick={() => setMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50">Durable Products</a>
              <a href="#beauty-domain" onClick={() => setMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-teal-700">Beauty Products</a>
              <a href="#capabilities" onClick={() => setMobileMenuOpen(false)} className="px-2.5 py-1.5 rounded-lg hover:bg-slate-50">Intelligence &amp; Features</a>
            </nav>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/signup'); }}
                className="w-full py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs text-center"
              >
                Create Account
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('/login'); }}
                className="w-full py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs text-center"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ==================================================
          2. HERO SECTION (Soft Warm Ivory + Subtle Aqua/Sage Blend)
      ================================================== */}
      <section className="pt-8 pb-10 sm:pt-12 sm:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#F3F6F9] via-[#FAF9F5] to-[#EEF5F6] rounded-b-3xl border-b border-slate-200/90 shadow-2xs">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-200/80 text-[11px] font-semibold text-indigo-800 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Intelligent Product Lifecycle &amp; Information Management</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Your products. Their documents. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 bg-clip-text text-transparent">
              One intelligent lifecycle.
            </span>
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            ProductVault turns scattered invoices and batch codes into persistent digital product records. 
            Understand warranty coverage, reconcile document conflicts, prepare dispute claims, and monitor cosmetic stability.
          </p>

          {/* Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="#how-it-works"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm shadow-2xs transition-colors"
            >
              See How It Works
            </a>

            <button
              onClick={onExploreDemo}
              className="px-4 py-2.5 rounded-xl bg-teal-50/90 hover:bg-teal-100 border border-teal-200/80 text-teal-800 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-teal-600" />
              <span>Explore Live Demo</span>
            </button>
          </div>

          {/* Trust Anchors */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              Two Distinct Domains
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              Human-Verified Facts
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              100% Client-Side Privacy
            </span>
          </div>

        </div>

        {/* Hero Interactive Showcase Mockup (Compact & Balanced) */}
        <div id="preview" className="mt-8 sm:mt-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-300/80 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.08),0_4px_12px_-2px_rgba(15,23,42,0.03)] ring-1 ring-slate-900/5 overflow-hidden">
            
            {/* Mock Header Bar */}
            <div className="bg-[#E2E8F0] px-4 py-2.5 border-b border-slate-300/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 font-mono text-slate-600 text-[10px] font-semibold truncate">vault://records/macbook-air-m3</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-white border border-indigo-200/60 px-2 py-0.5 rounded shadow-2xs">
                Verified Digital Record
              </span>
            </div>

            {/* Record Body */}
            <div className="p-4 sm:p-6 space-y-4">
              
              {/* Product Identity */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80" 
                    alt="MacBook Air M3" 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.2 rounded">
                        Durable Hardware
                      </span>
                      <span className="text-[9px] font-bold text-teal-800 bg-teal-50 border border-teal-200/70 px-1.5 py-0.2 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-teal-600" />
                        Human Verified
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">MacBook Air 15" M3 (Midnight, 512GB)</h3>
                    <p className="text-[11px] text-slate-500 font-mono">SN: C02GK993MD6R • Model: A3114 • Apple Regent St</p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end gap-1.5 shrink-0">
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                    Warranty: 18 Days Left
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-800 font-semibold text-[11px] border border-teal-200">
                    Claim Readiness: 94%
                  </span>
                </div>
              </div>

              {/* 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                    <FileText className="w-3 h-3 text-indigo-600" />
                    Attested Proofs (3)
                  </span>
                  <div className="space-y-1 text-[11px]">
                    <div className="p-1.5 rounded bg-white border border-slate-200 flex justify-between">
                      <span className="truncate text-slate-700">Apple_Invoice_Oct18.pdf</span>
                      <span className="text-[9px] text-slate-400 font-mono">Verified</span>
                    </div>
                    <div className="p-1.5 rounded bg-white border border-slate-200 flex justify-between">
                      <span className="truncate text-slate-700">Limited_Warranty_Cert.pdf</span>
                      <span className="text-[9px] text-slate-400 font-mono">Verified</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    Discrepancy Audit
                  </span>
                  <p className="text-[11px] text-slate-600 leading-snug bg-teal-50/70 p-1.5 rounded border border-teal-200/80">
                    <strong>Reconciled:</strong> Retail registration date matched to verified invoice purchase date (2025-10-18).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-200/70 space-y-1 text-xs">
                  <span className="font-bold text-indigo-900 text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Warranty AI Citation
                  </span>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    "Clause 3.2.1: Battery capacity drop below 80% is covered without fee."
                  </p>
                  <p className="text-[9px] text-indigo-700 font-semibold font-mono">AppleCare_Terms.pdf • p.4</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* ==================================================
          3. HOW IT WORKS (Pale Aqua/Teal Tinted Section)
      ================================================== */}
      <section id="how-it-works" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#EBF4F6] via-[#EEF6F7] to-[#E5F1F3] border-y border-teal-200/70">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-teal-800 bg-white px-3 py-0.5 rounded-full border border-teal-200/80 shadow-2xs">
            Disciplined Workflow
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            How ProductVault Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            A clear 7-step sequence designed for confidence and accountability.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-2">
          {howItWorksSteps.map((step) => (
            <div 
              key={step.num}
              className="bg-white/95 p-3 sm:p-3.5 rounded-xl border border-teal-200/70 shadow-2xs flex items-center gap-3.5 hover:border-teal-400 hover:shadow-xs transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-100">
                {step.num}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="text-[11px] text-slate-500 truncate sm:whitespace-normal">{step.desc}</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 hidden sm:block opacity-60" />
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          4. THE TWO PRODUCT DOMAINS (Two Complementary Tinted Panels)
      ================================================== */}
      <section id="domains" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#F3F6F9] via-[#F0F4F8] to-[#EBF0F6] border-y border-slate-200/90">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700 bg-white px-3 py-0.5 rounded-full border border-slate-200 shadow-2xs">
            Dedicated Domain Models
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-2">
            Two Distinct Product Domains. Never Mixed.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Electronics require warranty clauses and dispute claims. Cosmetics require batch codes and PAO stability timers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-6">
          <div className="bg-[#E2EBF2] p-1 rounded-xl border border-slate-300/80 shadow-2xs inline-flex">
            <button
              id="durable-domain"
              onClick={() => setActiveDomainTab('durable')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeDomainTab === 'durable'
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Durable Physical Products</span>
            </button>
            <button
              id="beauty-domain"
              onClick={() => setActiveDomainTab('beauty')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeDomainTab === 'beauty'
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>Beauty &amp; Cosmetic Products</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Durable (Indigo-tinted card) */}
        {activeDomainTab === 'durable' && (
          <div className="bg-gradient-to-br from-white via-[#F5F8FD] to-[#EDF2FA] rounded-2xl sm:rounded-3xl border border-indigo-200/90 p-5 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
                <Laptop className="w-3.5 h-3.5" />
                <span>Electronics, Laptops, Phones, TVs &amp; Appliances</span>
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Warranty intelligence, conflict resolution, and claim readiness.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Durable devices require formal proof-of-purchase. ProductVault reads invoices and serial tags, reconciles conflicting terms, and prepares dispute dossiers when hardware fails.
              </p>

              <div className="pt-1 space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Durable Lifecycle Sequence:</p>
                <div className="flex flex-wrap gap-1 text-[10px] font-semibold">
                  {[
                    'Product', 'Documents', 'Extraction', 'Verification', 'Conflict Detection', 
                    'Warranty', 'Issue', 'Claim', 'Service', 'Repair/Replacement'
                  ].map((step, idx) => (
                    <span key={step} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/90 text-slate-700 border border-slate-200">
                      <span className="text-[9px] font-mono text-indigo-600 font-bold">{idx + 1}.</span>
                      {step}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/signup')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Track Your Durable Hardware</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Graphic card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-indigo-600" />
                  Dispute Claim Packet
                </span>
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  94% Readiness
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 bg-slate-50 rounded-lg flex justify-between">
                  <span className="text-slate-500">Proof of Purchase:</span>
                  <strong className="text-slate-800 truncate">Apple_Invoice_RegentSt.pdf</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg flex justify-between">
                  <span className="text-slate-500">Hardware Serial:</span>
                  <strong className="font-mono text-slate-800">C02GK993MD6R (Verified)</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg flex justify-between">
                  <span className="text-slate-500">Rebuttal Clause:</span>
                  <strong className="text-indigo-700">Clause 3.2.1 Battery Health</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Beauty (Teal-tinted card) */}
        {activeDomainTab === 'beauty' && (
          <div className="bg-gradient-to-br from-white via-[#F5FBF8] to-[#ECF7F2] rounded-2xl sm:rounded-3xl border border-teal-200/90 p-5 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider">
                <Droplet className="w-3.5 h-3.5" />
                <span>Skincare, Serums, SPF, Makeup &amp; Personal Care</span>
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Batch code decoding, PAO shelf-life, and formula stability.
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cosmetics degrade once opened. ProductVault parses batch numbers from box stickers, logs opened dates, and tracks Period-After-Opening (PAO) limits to prevent skin irritation.
              </p>

              <div className="pt-1 space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Beauty Lifecycle Sequence:</p>
                <div className="flex flex-wrap gap-1 text-[10px] font-semibold">
                  {[
                    'Product', 'Label/Batch Information', 'Manufacturing/Expiry/PAO', 
                    'Opened Date', 'Usage Lifecycle', 'Expiry Reminder'
                  ].map((step, idx) => (
                    <span key={step} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/90 text-teal-800 border border-teal-200/70">
                      <span className="text-[9px] font-mono text-teal-700 font-bold">{idx + 1}.</span>
                      {step}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-teal-50/80 border border-teal-200/80 rounded-xl text-[11px] text-teal-900">
                <strong>Strict Domain Separation:</strong> Beauty records are never mixed with warranty claims, repairs, or dispute workflows.
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/signup')}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Track Your Beauty Shelf</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Graphic card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  Period-After-Opening (PAO)
                </span>
                <span className="text-[9px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  Active Countdown
                </span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 bg-slate-50 rounded-lg flex justify-between">
                  <span className="text-slate-500">Product:</span>
                  <strong className="text-slate-800 truncate">C-Firma Fresh 15% Vitamin C</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg flex justify-between">
                  <span className="text-slate-500">Batch Code:</span>
                  <strong className="font-mono text-slate-800">DE-8812A (Mfg: May 2026)</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg flex justify-between">
                  <span className="text-slate-500">Stability Window:</span>
                  <strong className="text-teal-700">14 Days Remaining (6M Limit)</strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </section>

      {/* ==================================================
          5. PRODUCT LIFECYCLE (Soft Lavender/Indigo Accent Treatment)
      ================================================== */}
      <section id="lifecycle" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#ECEAF6] via-[#F2F0FA] to-[#E7E5F5] border-y border-indigo-200/70">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 bg-white px-3 py-0.5 rounded-full border border-indigo-200/60 shadow-2xs">
            System Architecture
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            The ProductVault Intelligent Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            From physical purchase to an attested digital record that powers proactive decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {lifecycleSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step}
                onClick={() => setActiveLifecycleStep(idx)}
                className={`p-4 rounded-xl bg-white/95 border transition-all cursor-pointer relative group ${
                  activeLifecycleStep === idx 
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm' 
                    : 'border-indigo-200/70 hover:border-indigo-400 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                    STEP {item.step}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                    {item.badge}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug mb-2">
                  {item.description}
                </p>

                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-indigo-600">
                  <span>{item.highlight}</span>
                  <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          6. FEATURES & CAPABILITIES (Clean White Cards on Subtle Mist Background)
      ================================================== */}
      <section id="capabilities" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#EEF2F6] via-[#F3F6FA] to-[#EBF0F5] border-y border-slate-300/70">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 bg-white px-3 py-0.5 rounded-full border border-slate-200 shadow-2xs">
            Complete Feature Suite
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Engineered for Real-World Product Ownership
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Every tool required to maintain durable equipment and cosmetics throughout their entire lifecycle.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-w-6xl mx-auto">
          {capabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div 
                key={cap.title}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-2 hover:border-indigo-300 hover:shadow-xs transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 text-indigo-600 flex items-center justify-center border border-slate-200/70">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">{cap.title}</h3>
                <p className="text-[11px] text-slate-600 leading-snug">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          7. WARRANTY AI SECTION (Subtle Lavender/Indigo Intelligence Background)
      ================================================== */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#EBEFF8] via-[#F2F4FB] to-[#E8ECF7] border-y border-indigo-200/70">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700 bg-white px-3 py-0.5 rounded-full border border-indigo-200/70 shadow-2xs">
            Document Grounded AI
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Warranty AI: Answers Grounded in Policy Clauses
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Not a generic chatbot. Warranty AI cites exact clauses and source documents for every answer.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-indigo-200/80 p-5 sm:p-7 shadow-[0_8px_24px_-4px_rgba(99,102,241,0.06)] space-y-4">
          <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              Q
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">User Query:</p>
              <p className="text-xs sm:text-sm font-bold text-slate-900">"Is battery replacement covered under warranty for my MacBook Air?"</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80 text-xs space-y-1">
              <div className="flex items-center justify-between text-indigo-900 font-bold text-[11px]">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Cited Clause 3.2.1 (Battery Health Service)
                </span>
                <span className="text-[9px] text-indigo-700 font-mono">AppleCare_Terms.pdf • p.4</span>
              </div>
              <p className="text-slate-700 italic bg-white/70 p-2 rounded-lg border border-indigo-100 text-[11px] leading-relaxed">
                "If the battery holds less than 80% of original capacity within the Limited Warranty period, Apple will repair or replace the battery at no charge."
              </p>
            </div>

            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-teal-900 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Verified Evaluation: ELIGIBLE FOR COMPLIMENTARY SERVICE
                </span>
                <span className="text-[9px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                  98% Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-700 leading-snug">
                Your purchase was made 11 months ago (within the 12-month limit) and diagnostic capacity is measured at 77%.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          8. ATTENTION & PROACTIVE ACTIONS (Soft Sage/Teal Treatment)
      ================================================== */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#E6F2EB] via-[#ECF6EF] to-[#E2EFE8] border-y border-emerald-200/70">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-white px-3 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
            Proactive Queue
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Real Examples of Proactive Attention
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Surfaces immediate recommendations before claim and expiry deadlines elapse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 max-w-6xl mx-auto">
          {attentionExamples.slice(0, 3).map((item) => (
            <div 
              key={item.type + item.product}
              className="bg-white rounded-xl border border-emerald-200/80 p-4 shadow-2xs space-y-2 flex flex-col justify-between hover:border-emerald-400 hover:shadow-xs transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase tracking-wider ${
                    item.domain === 'Beauty' ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{item.domain}</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{item.product}</h3>
                <p className="text-[11px] text-slate-600 leading-snug">
                  <strong>What happened:</strong> {item.whatHappened}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-[10px] font-semibold text-indigo-700 bg-indigo-50/70 p-1.5 rounded-lg border border-indigo-100">
                  <strong className="text-indigo-900">Action:</strong> {item.recommendedAction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          9. DIGITAL VAULT SINGLE SOURCE (Soft Warm Ivory/Cream)
      ================================================== */}
      <section id="digital-vault" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#FAF5EC] via-[#FBF8F2] to-[#F5EFE4] border-y border-amber-200/60">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800 bg-white px-3 py-0.5 rounded-full border border-amber-200/60 shadow-2xs">
            Single Source of Truth
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            One Intelligent Record per Product
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Instead of lost receipts in drawers, each item maintains a complete digital record.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 max-w-5xl mx-auto text-center">
          {[
            { label: 'Product & Brand', desc: 'Model name & category' },
            { label: 'Serial & Batch', desc: 'Hardware SN or cosmetic code' },
            { label: 'Purchase Metadata', desc: 'Dates, prices & stores' },
            { label: 'Attested Proofs', desc: 'Invoices, receipts & PDFs' },
            { label: 'Warranty & PAO', desc: 'Active windows & limits' },
            { label: 'Action History', desc: 'Repairs, claims & notes' }
          ].map((facet) => (
            <div key={facet.label} className="p-3 rounded-xl bg-white/95 border border-amber-200/70 shadow-2xs space-y-0.5">
              <h3 className="text-xs font-bold text-slate-900">{facet.label}</h3>
              <p className="text-[10px] text-slate-500 leading-tight">{facet.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ==================================================
          10. ARCHITECTURAL INTEGRITY (Soft Mineral Mist)
      ================================================== */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gradient-to-b from-[#EAF0F6] via-[#EFF4F8] to-[#E5EDF4] border-y border-slate-300/70">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700 bg-white px-3 py-0.5 rounded-full border border-slate-200 shadow-2xs">
            Architectural Integrity
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Built on Transparency
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Zero fabricated statistics or fake testimonials. Trust is earned through sound software design.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-xs">
          <div className="p-4 rounded-xl bg-white/95 border border-slate-300/70 shadow-2xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">100% Client-Side Privacy</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              All records and uploaded documents stay in your browser session. Zero tracking cookies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/95 border border-slate-300/70 shadow-2xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Human-in-the-Loop</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              You retain explicit confirmation over every extracted purchase date and serial number.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/95 border border-slate-300/70 shadow-2xs space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Traceable Citations</h3>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Every warranty answer cites the specific document name, section number, and page.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          11. FINAL CALL TO ACTION (Deeper Indigo-Slate Gradient)
      ================================================== */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
            Begin Your Digital Vault
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Bring every product into one intelligent lifecycle.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Stop losing warranty rights, missing dispute windows, and guessing cosmetic expiration dates. Create your free vault in seconds.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('/login')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <span>Sign In</span>
            </button>
            <button
              onClick={onExploreDemo}
              className="px-5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-xs border border-teal-400/30 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-teal-300" />
              <span>Explore Live Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* ==================================================
          12. FOOTER (Coordinated Mineral Slate)
      ================================================== */}
      <footer className="mt-auto bg-[#E4EAEF] border-t border-slate-300/80 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Shield className="w-3 h-3" />
              </div>
              <span className="font-bold text-slate-900 text-xs">ProductVault AI</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Intelligent Product Lifecycle and Product Information Management platform for durable equipment and cosmetics.
            </p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Product</p>
            <p><a href="#digital-vault" className="hover:text-indigo-600">Digital Product Vault</a></p>
            <p><a href="#how-it-works" className="hover:text-indigo-600">How It Works</a></p>
            <p><a href="#lifecycle" className="hover:text-indigo-600">Intelligent Lifecycle</a></p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Domains</p>
            <p><a href="#durable-domain" className="hover:text-indigo-600">Durable Hardware</a></p>
            <p><a href="#beauty-domain" className="hover:text-teal-700">Beauty &amp; Cosmetics</a></p>
            <p><a href="#capabilities" className="hover:text-indigo-600">Warranty AI Copilot</a></p>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wider">Account</p>
            <p><button onClick={() => onNavigate('/login')} className="hover:text-indigo-600">Sign In</button></p>
            <p><button onClick={() => onNavigate('/signup')} className="hover:text-indigo-600">Create Account</button></p>
            <p><button onClick={onExploreDemo} className="hover:text-teal-700 font-semibold">Live Demo</button></p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-4 border-t border-slate-300/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px]">
          <p>© {new Date().getFullYear()} ProductVault AI. Client-side local architecture. All rights reserved.</p>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Durable &amp; Beauty Separation Enforced</span>
            <span>•</span>
            <span>Privacy-First</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
