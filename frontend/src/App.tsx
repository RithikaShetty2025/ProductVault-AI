import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AppRoute, Product, AttentionItem, ActivityItem } from './types';
import { INITIAL_PRODUCTS, ATTENTION_ITEMS, ACTIVITY_FEED } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { ProductDetailView } from './views/ProductDetailView';
import { LandingPageView } from './views/LandingPageView';
import { LoginView, AuthenticatedUser } from './views/LoginView';
import { AddProductWizard } from './views/AddProductWizard';
import { GlobalDocumentsVaultView } from './views/GlobalDocumentsVaultView';
import { ActionsAttentionView } from './views/ActionsAttentionView';
import { WarrantyClaimsView } from './views/WarrantyClaimsView';
import { WarrantyAICopilotView } from './views/WarrantyAICopilotView';
import { ServiceCentersView } from './views/ServiceCentersView';
import { PostWarrantyView } from './views/PostWarrantyView';
import { SettingsView } from './views/SettingsView';
import { ProductDocument } from './types';
import { supabase, Profile } from './lib/supabaseClient';

// Local-only sandbox identity. This is NEVER written to Supabase and is
// kept clearly distinct from a real authenticated session.
const DEMO_USER_NAME = 'Demo User (Local Sandbox)';
const DEMO_USER_EMAIL = 'demo-sandbox@productvault.local';

export default function App() {
  // Real Supabase authentication state (survives refresh via Supabase's
  // own persisted session storage).
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Clearly-separate local sandbox/demo mode. Never implies a real
  // Supabase session exists.
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  // Sandbox-only profile edits. Never persisted to Supabase, lost on refresh.
  const [demoName, setDemoName] = useState<string>(DEMO_USER_NAME);
  const [demoEmail, setDemoEmail] = useState<string>(DEMO_USER_EMAIL);

  const isAuthenticated = !!session || isDemoMode;
  const userName = isDemoMode
    ? demoName
    : profile?.full_name || (session?.user.user_metadata?.full_name as string) || session?.user.email || '';
  const userEmail = isDemoMode ? demoEmail : (session?.user.email || '');

  // Fetch the profile row belonging to the signed-in user only.
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data as Profile);
    } else {
      setProfile(null);
    }
  };

  // On mount: check for an existing Supabase session, then subscribe to
  // auth state changes (sign in, sign out, token refresh) for the
  // lifetime of the app.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
      if (data.session) {
        fetchProfile(data.session.user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setIsDemoMode(false); // a real session always takes precedence over sandbox mode
        fetchProfile(newSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Routing state
  const appRoutes: AppRoute[] = [
    '/landing',
    '/dashboard',
    '/products',
    '/products/new',
    '/documents',
    '/attention',
    '/claims',
    '/ai',
    '/services',
    '/post-warranty',
    '/settings',
    '/login',
    '/signup'
  ];

  const getRouteFromLocation = (): AppRoute => {
    if (typeof window === 'undefined') {
      return '/dashboard';
    }

    const path = window.location.pathname || '/';
    const normalizedPath = path === '/' ? '/dashboard' : path;

    if (normalizedPath.startsWith('/products/')) {
      return normalizedPath as AppRoute;
    }

    return appRoutes.includes(normalizedPath as AppRoute)
      ? (normalizedPath as AppRoute)
      : '/dashboard';
  };

  const routeToUrl = (route: AppRoute) => (route === '/dashboard' ? '/' : route);

  const applyRoute = (nextRoute: AppRoute, mode: 'push' | 'replace' = 'push') => {
    const url = routeToUrl(nextRoute);

    if (mode === 'push') {
      window.history.pushState({ route: nextRoute }, '', url);
    } else {
      window.history.replaceState({ route: nextRoute }, '', url);
    }

    if (nextRoute.startsWith('/products/') && nextRoute !== '/products/new') {
      const id = nextRoute.replace('/products/', '');
      setSelectedProductId(id);
    }

    setCurrentRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => getRouteFromLocation());
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-dur-01');
  const [productsFilterCategory, setProductsFilterCategory] = useState<'all' | 'durable' | 'beauty' | 'attention'>('all');

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = getRouteFromLocation();
      setCurrentRoute(nextRoute);

      if (nextRoute.startsWith('/products/') && nextRoute !== '/products/new') {
        setSelectedProductId(nextRoute.replace('/products/', ''));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Layout UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Centralized Data state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>(ATTENTION_ITEMS);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(ACTIVITY_FEED);

  // Toasts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Navigation handler
  const handleNavigate = (route: AppRoute) => {
    applyRoute(route, 'push');
  };

  const handleSelectProduct = (productId: string) => {
    const nextRoute = `/products/${productId}` as AppRoute;
    applyRoute(nextRoute, 'push');
  };

  // Update product everywhere in local state
  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));

    // If conflict was resolved, remove corresponding conflict attention item
    if (updated.type === 'durable' && !updated.hasConflict) {
      setAttentionItems(prev => prev.filter(att => att.productId !== updated.id || att.id !== 'att-2'));
    }
  };

  // Add Product Handler from AddProductWizard
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
    setActivityFeed(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'product_added',
        title: 'Product Ingested',
        productName: newProduct.name,
        detail: `Cataloged into ${newProduct.type} vault with verified extraction.`,
        timestamp: 'Just now'
      },
      ...prev
    ]);
    addToast('success', 'Product Ingested', `${newProduct.name} is now tracked in your vault.`);
    handleSelectProduct(newProduct.id);
  };

  // Document Upload Handler (for Global Documents Vault)
  const handleUploadDocumentToProduct = (productId: string, doc: ProductDocument) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const updatedDocs = [doc, ...(p.documents || [])];
      if (p.type === 'durable') {
        return {
          ...p,
          documents: updatedDocs,
          documentsCount: updatedDocs.length,
          claimReadinessScore: Math.min(100, (p.claimReadinessScore || 70) + 10)
        };
      }
      return { ...p, documents: updatedDocs };
    }));

    setActivityFeed(prev => [
      {
        id: `act-${Date.now()}`,
        type: 'document_uploaded',
        title: 'Document Uploaded',
        productName: products.find(p => p.id === productId)?.name || 'Product',
        detail: `${doc.name} (${doc.type}) indexed with OCR extraction.`,
        timestamp: 'Just now'
      },
      ...prev
    ]);

    addToast('success', 'Document Indexed', `${doc.name} linked and attested.`);
  };

  // Document Delete Handler
  const handleDeleteDocument = (productId: string, docId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const filteredDocs = (p.documents || []).filter(d => d.id !== docId);
      if (p.type === 'durable') {
        return {
          ...p,
          documents: filteredDocs,
          documentsCount: filteredDocs.length
        };
      }
      return { ...p, documents: filteredDocs };
    }));
    addToast('info', 'Document Removed', 'File unlinked from product vault.');
  };

  // Resolve Attention Item Handler
  const handleResolveAttentionItem = (itemId: string, note?: string) => {
    setAttentionItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        category: 'completed' as const,
        completedAt: new Date().toISOString()
      };
    }));
  };

  // Reset Demo Data Handler
  const handleResetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setAttentionItems(ATTENTION_ITEMS);
    setActivityFeed(ACTIVITY_FEED);
    setSelectedProductId('prod-dur-01');
    addToast('info', 'Vault Reset', 'All products and intelligence feeds restored to initial demo state.');
  };

  // Authentication Handlers
  // Called after a REAL Supabase signUp/signInWithPassword succeeds.
  // The session itself is already set by the onAuthStateChange listener;
  // this just handles navigation/UX feedback.
  const handleLoginSuccess = (user: AuthenticatedUser) => {
    setIsDemoMode(false);
    applyRoute('/dashboard', 'push');
    addToast('success', 'Signed In', `Welcome back, ${user.fullName || user.email}!`);
  };

  const handleLogout = async () => {
    if (isDemoMode) {
      // Local sandbox exit — no Supabase session was ever created.
      setIsDemoMode(false);
      applyRoute('/landing', 'push');
      addToast('info', 'Logged Out', 'Exited local sandbox mode.');
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      addToast('error', 'Logout Failed', error.message);
      return;
    }
    applyRoute('/landing', 'push');
    addToast('info', 'Logged Out', 'Returned to ProductVault public site.');
  };

  // Enters the clearly-separate local sandbox mode (no Supabase account
  // is created or used). Shared by "Explore Demo" and "Instant Demo Login".
  const handleEnterDemoMode = () => {
    setIsDemoMode(true);
    applyRoute('/dashboard', 'push');
    addToast('info', 'Demo Mode Activated', 'Exploring pre-seeded ProductVault AI workspace (local sandbox, not a real account).');
  };

  // Persists profile edits from SettingsView. In local sandbox mode this is
  // kept entirely in-memory; for a real session it updates `public.profiles`
  // (full name) and, if the email changed, triggers a Supabase Auth email
  // change (which requires confirmation via the link Supabase emails out).
  const handleUpdateUser = async (name: string, email: string): Promise<{ error?: string }> => {
    if (isDemoMode) {
      setDemoName(name);
      setDemoEmail(email);
      return {};
    }

    if (!session) {
      return { error: 'No active session.' };
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', session.user.id);

    if (profileError) {
      return { error: profileError.message };
    }

    if (email.trim() !== session.user.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: email.trim() });
      if (emailError) {
        return { error: emailError.message };
      }
    }

    await fetchProfile(session.user.id);
    return {};
  };

  // While the initial Supabase session check is in flight, avoid flashing
  // the landing/login page for users who are actually already signed in.
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8]">
        <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
          <span className="w-4 h-4 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
          <span>Checking session...</span>
        </div>
      </div>
    );
  }

  // Public Landing Page view (accessible when unauthenticated, or on explicit /landing route)
  if (currentRoute === '/landing' || (!isAuthenticated && currentRoute !== '/login' && currentRoute !== '/signup')) {
    return (
      <div className="font-sans antialiased bg-[#0E1626] min-h-screen">
        <LandingPageView
          onNavigate={handleNavigate}
          onExploreDemo={handleEnterDemoMode}
          isAuthenticated={isAuthenticated}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // Authentication views (Sign In & Sign Up / Create Account)
  if (!isAuthenticated || currentRoute === '/login' || currentRoute === '/signup') {
    return (
      <div className="font-sans antialiased bg-[#0B1322] min-h-screen">
        <LoginView
          initialMode={currentRoute === '/signup' ? 'signup' : 'signin'}
          onLoginSuccess={handleLoginSuccess}
          onNavigate={handleNavigate}
          onDemoLogin={handleEnterDemoMode}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </div>
    );
  }

  // Active product lookup for detail route
  const currentProduct = selectedProductId 
    ? products.find(p => p.id === selectedProductId) || products[0]
    : products[0];

  return (
    <div className="min-h-screen font-sans antialiased text-slate-900 bg-[#F4F6F8] flex flex-col">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Responsive Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        attentionCount={attentionItems.length}
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      {/* Top Header Bar */}
      <TopBar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        products={products}
        attentionItems={attentionItems}
        collapsed={sidebarCollapsed}
        userName={userName}
      />

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8
          ${sidebarCollapsed ? 'lg:pl-24' : 'lg:pl-72'}
        `}
      >
        {/* Render View by Route */}
        {currentRoute === '/dashboard' && (
          <DashboardView
            userName={userName.split(' ')[0]}
            products={products}
            attentionItems={attentionItems}
            activityFeed={activityFeed}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onFilterCategory={(type) => {
              setProductsFilterCategory(type);
              applyRoute('/products', 'push');
            }}
          />
        )}

        {currentRoute === '/products' && (
          <ProductsView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            initialTypeFilter={productsFilterCategory}
          />
        )}

        {currentRoute.startsWith('/products/') && currentRoute !== '/products/new' && (
          <ProductDetailView
            product={currentProduct}
            onBack={() => handleNavigate('/products')}
            onNavigate={handleNavigate}
            onUpdateProduct={handleUpdateProduct}
            onTriggerToast={addToast}
          />
        )}

        {currentRoute === '/products/new' && (
          <AddProductWizard
            onAddProduct={handleAddProduct}
            onBack={() => handleNavigate('/products')}
          />
        )}

        {currentRoute === '/documents' && (
          <GlobalDocumentsVaultView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onUploadDocumentToProduct={handleUploadDocumentToProduct}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {currentRoute === '/attention' && (
          <ActionsAttentionView
            attentionItems={attentionItems}
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onResolveAttentionItem={handleResolveAttentionItem}
            onUpdateProduct={handleUpdateProduct}
            onTriggerToast={addToast}
          />
        )}

        {currentRoute === '/claims' && (
          <WarrantyClaimsView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onTriggerToast={addToast}
          />
        )}

        {currentRoute === '/ai' && (
          <WarrantyAICopilotView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute === '/services' && (
          <ServiceCentersView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onTriggerToast={addToast}
          />
        )}

        {currentRoute === '/post-warranty' && (
          <PostWarrantyView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onTriggerToast={addToast}
          />
        )}

        {currentRoute === '/settings' && (
          <SettingsView
            userName={userName}
            userEmail={userEmail}
            products={products}
            onUpdateUser={handleUpdateUser}
            onResetDemoData={handleResetDemoData}
            onTriggerToast={addToast}
          />
        )}
      </main>
    </div>
  );
}
