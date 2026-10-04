import React, { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Zap, 
  ShieldCheck,
  Layers,
  FileCheck2,
  Clock
} from 'lucide-react';
import { AppRoute } from '../types';

interface LoginViewProps {
  initialMode?: 'signin' | 'signup';
  onLoginSuccess: (email: string, name: string) => void;
  onNavigate: (route: AppRoute) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ 
  initialMode = 'signin',
  onLoginSuccess,
  onNavigate 
}) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('sushma@productvault.ai');
  const [password, setPassword] = useState('Password123!');
  const [confirmPassword, setConfirmPassword] = useState('Password123!');
  const [fullName, setFullName] = useState('Sushma Gouda');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Sync mode if prop changes
  React.useEffect(() => {
    setIsSignUp(initialMode === 'signup');
    setErrorMessage('');
  }, [initialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Field validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password confirmation.');
        return;
      }
      if (!termsAgreed) {
        setErrorMessage('Please confirm agreement to ProductVault Terms of Service.');
        return;
      }
    }

    // Mock loading transition into authenticated vault
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email, isSignUp ? (fullName || 'Sushma Gouda') : (fullName || 'Sushma Gouda'));
    }, 600);
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('sushma@productvault.ai', 'Sushma Gouda');
    }, 400);
  };

  const handleForgotPassword = () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address above to receive reset instructions.');
      return;
    }
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF2F7] via-[#F4F7F6] to-[#E9EFF7] flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/15 selection:text-indigo-950 relative overflow-hidden">
      
      {/* Subtle Atmospheric Decorative Color Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-amber-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Bar Navigation back to Public site */}
      <div className="max-w-4xl mx-auto w-full mb-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/landing')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-300/80 shadow-2xs hover:border-indigo-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to ProductVault Public Site</span>
        </button>

        <button
          onClick={handleDemoSignIn}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-50/90 border border-teal-300/80 px-3.5 py-1.5 rounded-xl hover:bg-teal-100 transition-colors shadow-2xs"
        >
          <Zap className="w-3.5 h-3.5 text-teal-600" />
          <span>Instant Demo Login</span>
        </button>
      </div>

      {/* Main Balanced Wide Container (Desktop 2-Column Showcase) */}
      <div className="max-w-4xl mx-auto w-full bg-white rounded-3xl border border-slate-300/80 shadow-[0_16px_40px_-8px_rgba(15,23,42,0.09),0_4px_12px_-2px_rgba(15,23,42,0.03)] ring-1 ring-slate-900/5 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Product Context & Value Highlights */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#EFF3F9] via-[#EBF1F6] to-[#E6EEF5] p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-300/70 flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* Brand Header */}
              <div 
                onClick={() => onNavigate('/landing')}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 tracking-tight text-lg">ProductVault</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200/60">AI</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Lifecycle &amp; Information Management</p>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="text-lg font-bold text-slate-900 leading-snug">
                  {isSignUp ? 'Create your persistent digital product vault.' : 'Welcome back to your ProductVault.'}
                </h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Turn scattered receipts, warranties, and batch codes into attested digital records.
                </p>
              </div>

              {/* Architectural Highlights */}
              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100 mt-0.5">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-800 block text-xs">Two Dedicated Domains</strong>
                    <span className="text-slate-500 text-[11px]">Durable hardware and beauty cosmetics never mix lifecycles.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100 mt-0.5">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-800 block text-xs">Attested OCR Evidence</strong>
                    <span className="text-slate-500 text-[11px]">Human-in-the-loop review ensures 100% verified facts.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-800 block text-xs">Proactive Attention Queue</strong>
                    <span className="text-slate-500 text-[11px]">Surfaces expiring warranties and formula oxidation warnings.</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Micro Record Preview Pill */}
            <div className="mt-6 pt-4 border-t border-slate-200/70 hidden sm:block">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800 truncate">MacBook Air 15" M3</span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-100">
                    94% Ready
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">SN: C02GK993MD6R • Verified Invoice</p>
              </div>
            </div>

          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-center">
            
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-slate-200 pb-3 mb-5">
              <button
                type="button"
                onClick={() => { setIsSignUp(false); setErrorMessage(''); onNavigate('/login'); }}
                className={`flex-1 pb-2.5 text-center text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                  !isSignUp ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsSignUp(true); setErrorMessage(''); onNavigate('/signup'); }}
                className={`flex-1 pb-2.5 text-center text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                  isSignUp ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name for Sign Up */}
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. Sushma Gouda"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              {/* Password Field (or 2-column grid when Sign Up) */}
              <div className={isSignUp ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-1"}>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">Password</label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-semibold text-indigo-600 hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Password Requirement checklist for Sign Up */}
              {isSignUp && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1">
                    <Check className={`w-3.5 h-3.5 ${password.length >= 6 ? 'text-teal-600 font-bold' : 'text-slate-300'}`} />
                    <span className={password.length >= 6 ? 'text-slate-700 font-medium' : ''}>6+ chars</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Check className={`w-3.5 h-3.5 ${password === confirmPassword && confirmPassword.length > 0 ? 'text-teal-600 font-bold' : 'text-slate-300'}`} />
                    <span className={password === confirmPassword && confirmPassword.length > 0 ? 'text-slate-700 font-medium' : ''}>Passwords match</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Check className={`w-3.5 h-3.5 ${email.includes('@') && email.includes('.') ? 'text-teal-600 font-bold' : 'text-slate-300'}`} />
                    <span className={email.includes('@') && email.includes('.') ? 'text-slate-700 font-medium' : ''}>Valid email</span>
                  </p>
                </div>
              )}

              {/* Checkboxes */}
              <div className="pt-0.5">
                {!isSignUp ? (
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Remember this browser session</span>
                  </label>
                ) : (
                  <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5"
                    />
                    <span>I agree to ProductVault Terms of Service and local data storage policy.</span>
                  </label>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Forgot Email Confirmation */}
              {forgotSent && (
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
                  <span>Password reset instructions sent to {email}.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isSignUp ? 'Creating Your Vault...' : 'Signing In...'}
                  </span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Free Account' : 'Sign In to ProductVault'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Alternate Link */}
            <div className="mt-4 text-center text-xs text-slate-500">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setErrorMessage(''); onNavigate('/login'); }}
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setErrorMessage(''); onNavigate('/signup'); }}
                    className="font-bold text-indigo-600 hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>

            {/* Test drive / demo banner */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                onClick={handleDemoSignIn}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <span>Instant Test Drive with Pre-Seeded Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
