import React, { useState } from 'react';
import { AppRoute, Product, AttentionItem, ActivityItem } from './types';
import { INITIAL_PRODUCTS, ATTENTION_ITEMS, ACTIVITY_FEED } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DashboardView } from './views/DashboardView';
import { ProductsView } from './views/ProductsView';
import { ProductDetailView } from './views/ProductDetailView';
import { LandingPageView } from './views/LandingPageView';
import { LoginView } from './views/LoginView';
import { AddProductWizard } from './views/AddProductWizard';
import { GlobalDocumentsVaultView } from './views/GlobalDocumentsVaultView';
import { ActionsAttentionView } from './views/ActionsAttentionView';
import { WarrantyClaimsView } from './views/WarrantyClaimsView';
import { WarrantyAICopilotView } from './views/WarrantyAICopilotView';
import { ServiceCentersView } from './views/ServiceCentersView';
import { PostWarrantyView } from './views/PostWarrantyView';
import { SettingsView } from './views/SettingsView';
import { ProductDocument } from './types';

export default function App() {
  // Authentication local session state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>('Sushma Gouda');
  const [userEmail, setUserEmail] = useState<string>('sushma.gouda@gmail.com');

  // Routing state
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('/dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-dur-01');
  const [productsFilterCategory, setProductsFilterCategory] = useState<'all' | 'durable' | 'beauty' | 'attention'>('all');

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
    if (route.startsWith('/products/') && route !== '/products/new') {
      const id = route.replace('/products/', '');
      setSelectedProductId(id);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentRoute(`/products/${productId}` as AppRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const handleLoginSuccess = (email: string, name: string) => {
    setUserEmail(email);
    setUserName(name || 'Sushma');
    setIsAuthenticated(true);
    setCurrentRoute('/dashboard');
    addToast('success', 'Signed In', `Welcome back, ${name || 'Sushma'}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentRoute('/landing');
    addToast('info', 'Logged Out', 'Returned to ProductVault public site.');
  };

  const handleExploreDemo = () => {
    setIsAuthenticated(true);
    setCurrentRoute('/dashboard');
    addToast('info', 'Demo Mode Activated', 'Exploring pre-seeded ProductVault AI workspace.');
  };

  // Public Landing Page view (accessible when unauthenticated, or on explicit /landing route)
  if (currentRoute === '/landing' || (!isAuthenticated && currentRoute !== '/login' && currentRoute !== '/signup')) {
    return (
      <div className="font-sans antialiased bg-[#0E1626] min-h-screen">
        <LandingPageView 
          onNavigate={handleNavigate} 
          onExploreDemo={handleExploreDemo} 
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
              setCurrentRoute('/products');
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
            onUpdateUser={(name, email) => {
              setUserName(name);
              setUserEmail(email);
              addToast('success', 'Profile Updated', 'Vault preferences saved.');
            }}
            onResetDemoData={handleResetDemoData}
            onTriggerToast={addToast}
          />
        )}
      </main>
    </div>
  );
}
