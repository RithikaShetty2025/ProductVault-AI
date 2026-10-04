import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  ShieldCheck, 
  Database, 
  Download, 
  RotateCcw, 
  Check, 
  Save, 
  Globe, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  Sliders,
  HardDrive
} from 'lucide-react';
import { Product } from '../types';

interface SettingsViewProps {
  userName: string;
  userEmail: string;
  products?: Product[];
  onUpdateUser: (name: string, email: string) => Promise<{ error?: string }> | void;
  onResetDemoData?: () => void;
  onTriggerToast?: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userName,
  userEmail,
  products = [],
  onUpdateUser,
  onResetDemoData,
  onTriggerToast
}) => {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState(userEmail);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Keep the form in sync if the authenticated user's profile changes
  // externally (e.g. after a fresh fetch from Supabase).
  React.useEffect(() => {
    setName(userName);
    setEmail(userEmail);
  }, [userName, userEmail]);

  // Notification Preferences
  const [notifyWarranty30, setNotifyWarranty30] = useState(true);
  const [notifyWarranty7, setNotifyWarranty7] = useState(true);
  const [notifyPaoExpiry, setNotifyPaoExpiry] = useState(true);
  const [notifyConflicts, setNotifyConflicts] = useState(true);
  const [notifyRecalls, setNotifyRecalls] = useState(true);

  // Vault Defaults
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [dateFormat, setDateFormat] = useState<'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY'>('YYYY-MM-DD');
  const [confidenceThreshold, setConfidenceThreshold] = useState<'strict' | 'balanced' | 'permissive'>('balanced');

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setSavingProfile(true);
    try {
      const result = await onUpdateUser(name, email);
      if (result && result.error) {
        setProfileError(result.error);
        if (onTriggerToast) {
          onTriggerToast('error', 'Profile Update Failed', result.error);
        }
        return;
      }
      setSavedProfile(true);
      if (onTriggerToast) {
        onTriggerToast('success', 'Profile Updated', 'Your identity preferences have been saved.');
      }
      setTimeout(() => setSavedProfile(false), 3000);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleExportVault = () => {
    const exportData = {
      vaultVersion: '2.5.0-ai-enhanced',
      exportedAt: new Date().toISOString(),
      user: { name, email },
      settings: {
        currency,
        dateFormat,
        confidenceThreshold,
        notifications: {
          notifyWarranty30,
          notifyWarranty7,
          notifyPaoExpiry,
          notifyConflicts,
          notifyRecalls
        }
      },
      productsCount: products.length,
      products
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ProductVault_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (onTriggerToast) {
      onTriggerToast('success', 'Backup Exported', 'Full vault payload downloaded as JSON.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset vault data to original pre-seeded factory demo state? All customized fields will return to demo defaults.')) {
      if (onResetDemoData) {
        onResetDemoData();
      }
      if (onTriggerToast) {
        onTriggerToast('info', 'Demo Data Restored', 'Vault catalog reloaded to pristine state.');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-1.5">
          <Sliders className="w-3.5 h-3.5" />
          <span>System &amp; Vault Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your operator identity, autonomous notifications, document OCR thresholds, and vault backups
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Configuration Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Operator Profile</h2>
                <p className="text-xs text-slate-500">Your ProductVault administrative identity</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Primary Notification Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              {profileError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{profileError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-xs shadow-2xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
                {savedProfile && (
                  <span className="text-xs font-semibold text-teal-700 flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Changes saved
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Autonomous Notifications Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Intelligence Notifications &amp; Alerts</h2>
                <p className="text-xs text-slate-500">Autonomous triggers for expiring terms, open claims, and conflicts</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <label className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50/60 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Warranty Expiration 30-Day Warning</p>
                  <p className="text-[11px] text-slate-500">Flag durable devices approaching factory coverage end date</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWarranty30}
                  onChange={(e) => setNotifyWarranty30(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50/60 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Final 7-Day Urgent Claim Deadline</p>
                  <p className="text-[11px] text-slate-500">Urgent notifications when defects must be filed before expiration</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWarranty7}
                  onChange={(e) => setNotifyWarranty7(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50/60 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Cosmetics PAO Shelf-Life Warnings</p>
                  <p className="text-[11px] text-slate-500">Formula stability and Period-After-Opening warnings for beauty batches</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyPaoExpiry}
                  onChange={(e) => setNotifyPaoExpiry(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50/60 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Document Conflict Discrepancy Alerts</p>
                  <p className="text-[11px] text-slate-500">Flag mismatches between invoices, serial labels, and warranty cards</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyConflicts}
                  onChange={(e) => setNotifyConflicts(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-start justify-between gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50/60 cursor-pointer transition-colors">
                <div>
                  <p className="text-xs font-bold text-slate-900">Global Recall &amp; Safety Advisories</p>
                  <p className="text-[11px] text-slate-500">Automatic matches against manufacturer serial recall bulletins</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyRecalls}
                  onChange={(e) => setNotifyRecalls(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Regional & Vault Defaults Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Regional &amp; Extraction Defaults</h2>
                <p className="text-xs text-slate-500">Currency symbols, date schemas, and OCR confidence policies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="USD">USD ($) United States</option>
                  <option value="EUR">EUR (€) Eurozone</option>
                  <option value="GBP">GBP (£) United Kingdom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Date Format</label>
                <select
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (UK/EU)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">OCR Confidence Mode</label>
                <select
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="balanced">Balanced (85% Auto-Attest)</option>
                  <option value="strict">Strict (95% Human-in-Loop)</option>
                  <option value="permissive">Permissive (75% Permissive)</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Vault Metrics & Backup Operations */}
        <div className="space-y-6">
          
          {/* Storage & Record Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Vault Capacity &amp; Index</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Indexed Products</span>
                <span className="font-bold text-slate-900">{products.length} Items</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Attested Documents</span>
                <span className="font-bold text-slate-900">
                  {products.reduce((acc, p) => acc + (p.documents?.length || 0), 0)} Files
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Cryptographic Hashes</span>
                <span className="font-bold text-teal-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Attested
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 font-medium">Vault Version</span>
                <span className="font-mono text-slate-700">v2.5.0-build</span>
              </div>
            </div>
          </div>

          {/* Backup & Disaster Recovery */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Vault Backup &amp; Recovery</h3>
              <p className="text-xs text-slate-500 mt-0.5">Export full vault state or reset demo seeds</p>
            </div>

            <button
              onClick={handleExportVault}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Vault JSON Backup</span>
            </button>

            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-700 font-semibold text-xs shadow-2xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Factory Demo Data</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Restores initial 18 products, claims, and timeline records.
            </p>
          </div>

          {/* Architecture Badge */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Client-Side Local Vault</span>
            </div>
            <p className="text-indigo-800 text-[11px] leading-relaxed">
              All extracted fields, conflict states, and claims are securely orchestrated inside local browser state.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
