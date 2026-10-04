import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Menu, 
  Plus, 
  ChevronRight, 
  X,
  AlertCircle,
  FileCheck2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { AppRoute, Product, AttentionItem } from '../types';

interface TopBarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenMobileMenu: () => void;
  products: Product[];
  attentionItems: AttentionItem[];
  collapsed: boolean;
  userName: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentRoute,
  onNavigate,
  onOpenMobileMenu,
  products,
  attentionItems,
  collapsed,
  userName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Derive title & breadcrumb based on route
  const getRouteInfo = () => {
    if (currentRoute === '/dashboard') return { title: 'Dashboard', breadcrumbs: ['Vault', 'Overview'] };
    if (currentRoute === '/products') return { title: 'My Products', breadcrumbs: ['Vault', 'Catalog'] };
    if (currentRoute === '/products/new') return { title: 'Add Product', breadcrumbs: ['Vault', 'Catalog', 'New'] };
    if (currentRoute.startsWith('/products/')) return { title: 'Product Details', breadcrumbs: ['Vault', 'Catalog', 'Record'] };
    if (currentRoute === '/documents') return { title: 'Documents & Proof', breadcrumbs: ['Vault', 'Documents'] };
    if (currentRoute === '/attention') return { title: 'Actions & Attention', breadcrumbs: ['Vault', 'Attention'] };
    if (currentRoute === '/claims') return { title: 'Warranty Claims', breadcrumbs: ['Vault', 'Claims'] };
    if (currentRoute === '/ai') return { title: 'Warranty AI Assistant', breadcrumbs: ['Intelligence', 'Advisory'] };
    if (currentRoute === '/services') return { title: 'Authorized Service Centers', breadcrumbs: ['Network', 'Service Centers'] };
    if (currentRoute === '/post-warranty') return { title: 'Post-Warranty & Upgrades', breadcrumbs: ['Intelligence', 'Post-Warranty'] };
    if (currentRoute === '/landing') return { title: 'ProductVault AI', breadcrumbs: ['Public', 'Overview'] };
    if (currentRoute === '/signup') return { title: 'Create Account', breadcrumbs: ['Portal', 'Sign Up'] };
    if (currentRoute === '/settings') return { title: 'Settings', breadcrumbs: ['Preferences'] };
    return { title: 'ProductVault AI', breadcrumbs: ['Vault'] };
  };

  const { title, breadcrumbs } = getRouteInfo();

  // Filter search results
  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  return (
    <header 
      className={`sticky top-0 z-30 h-16 bg-[#EFF3F7]/95 backdrop-blur-md border-b border-slate-300/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300
        ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}
      `}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger + Titles & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                  <span className={idx === breadcrumbs.length - 1 ? 'text-indigo-600 font-semibold' : ''}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Search bar, Notifications, Quick Actions, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Global Search Bar */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, serials, batches..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                className="w-40 sm:w-64 md:w-72 pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown Modal */}
            {searchOpen && searchQuery.trim() !== '' && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setSearchOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-150">
                  <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">Matching Vault Records</span>
                    <span>{searchResults.length} found</span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onNavigate(`/products/${item.id}`);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-3 hover:bg-indigo-50/50 cursor-pointer flex items-center gap-3 transition-colors"
                        >
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{item.name}</p>
                            <p className="text-xs text-slate-500 truncate">{item.brand} • {item.category}</p>
                          </div>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            item.type === 'durable' ? 'bg-indigo-50 text-indigo-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No product records match &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>

                  <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        onNavigate('/products');
                        setSearchOpen(false);
                      }}
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      View all products in catalog
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {attentionItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {notificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setNotificationsOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Intelligence Alerts</h4>
                      <p className="text-xs text-slate-500">{attentionItems.length} require review</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('/attention');
                        setNotificationsOpen(false);
                      }}
                      className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      View All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {attentionItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.targetRoute as AppRoute);
                          setNotificationsOpen(false);
                        }}
                        className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-2.5">
                          <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${
                            item.severity === 'high' ? 'text-rose-500' : 'text-amber-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-900 truncate">{item.title}</span>
                              <span className="text-[10px] text-slate-400">{item.timeRemaining}</span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-0.5 truncate">{item.productName}</p>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.whatHappened}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        onNavigate('/attention');
                        setNotificationsOpen(false);
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-indigo-600"
                    >
                      Manage Attention Center
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Action Button: + Add Product */}
          <button
            onClick={() => onNavigate('/products/new')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => onNavigate('/settings')}
            className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-2xs group-hover:ring-indigo-300 transition-all">
              {userName.charAt(0)}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
