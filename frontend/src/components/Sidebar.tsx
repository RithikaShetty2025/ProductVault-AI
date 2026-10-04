import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Layers, 
  Building2, 
  TrendingUp,
  Globe
} from 'lucide-react';
import { AppRoute } from '../types';

interface SidebarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  attentionCount: number;
  userName: string;
  userEmail: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  attentionCount,
  userName,
  userEmail,
  onLogout
}) => {
  const navItems = [
    { label: 'Dashboard', route: '/dashboard' as AppRoute, icon: LayoutDashboard },
    { label: 'My Products', route: '/products' as AppRoute, icon: Package },
    { label: 'Documents', route: '/documents' as AppRoute, icon: FileText },
    { 
      label: 'Actions / Attention', 
      route: '/attention' as AppRoute, 
      icon: AlertTriangle,
      badge: attentionCount > 0 ? attentionCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    { label: 'Claims', route: '/claims' as AppRoute, icon: ShieldCheck },
    { label: 'Warranty AI', route: '/ai' as AppRoute, icon: Sparkles, highlight: true },
    { label: 'Service Centers', route: '/services' as AppRoute, icon: Building2 },
    { label: 'Post-Warranty', route: '/post-warranty' as AppRoute, icon: TrendingUp },
    { label: 'Settings', route: '/settings' as AppRoute, icon: Settings },
  ];

  const handleNavClick = (route: AppRoute) => {
    onNavigate(route);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar: Deeper coordinated mineral slate surface with crisp vertical divider */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#EAEFF4] border-r border-slate-300/80 shadow-[1px_0_4px_rgba(0,0,0,0.02)] flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-300/70 bg-[#E2E8F0]/40">
          <div 
            onClick={() => handleNavClick('/dashboard')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 tracking-tight text-base">ProductVault</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200/60">AI</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">Lifecycle Intelligence</p>
              </div>
            )}
          </div>

          {/* Desktop Collapse toggle button */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Product Type Categorization Indicator */}
        {!collapsed && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-white/70 border border-slate-200/80 flex items-center justify-between text-xs text-slate-600 shadow-2xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Vault Domains
            </span>
            <span className="text-[11px] font-semibold text-slate-600 bg-[#E2E8F0]/70 px-2 py-0.5 rounded border border-slate-300/60">
              Durable &amp; Beauty
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route || (item.route === '/products' && currentRoute.startsWith('/products/'));

            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold' 
                    : item.highlight
                      ? 'text-indigo-900 bg-indigo-50/80 hover:bg-indigo-100/90 border border-indigo-200/60'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 hover:shadow-2xs'
                  }
                `}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-500 group-hover:text-slate-800'}`} />
                
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!collapsed && item.badge && (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {item.badge}
                  </span>
                )}

                {/* Collapsed Badge Dot */}
                {collapsed && item.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Public Site Quick Trigger */}
        {!collapsed && (
          <div className="px-3 pb-2">
            <button
              onClick={() => handleNavClick('/landing')}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-white/60 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>Public Landing Page</span>
            </button>
          </div>
        )}

        {/* User Profile & Footer */}
        <div className="p-3 border-t border-slate-300/70 bg-white/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/80 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
              {userName.charAt(0)}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{userName}</p>
                <p className="text-xs text-slate-500 truncate">{userEmail}</p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={onLogout}
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
