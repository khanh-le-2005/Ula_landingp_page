import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { BadgeCheck, LayoutDashboard, Sparkles, Target, Waypoints, Gift, PanelsTopLeft, Eye, LogOut, LogIn, FileText, ChevronRight, Activity } from 'lucide-react';
import { useAdminAuth } from './hooks/useAdminAuth';
import { ADMIN_SECTION_KEYS } from './adminSections';
import { adminShell, adminSecondaryButton, adminPrimaryButton, adminAccentText } from './adminTheme';

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads Manager', icon: FileText },
  { to: '/admin/hero', label: 'Hero Section', icon: PanelsTopLeft },
  { to: '/admin/painpoints', label: 'Painpoints', icon: Target },
  { to: '/admin/solution', label: 'Solution Hub', icon: Sparkles },
  { to: '/admin/methodology', label: 'Methodology', icon: Waypoints },
  { to: '/admin/experience', label: 'Experience Desk', icon: BadgeCheck },
  { to: '/admin/lucky-wheel', label: 'Lucky Wheel', icon: Gift },
];

export default function AdminLayout() {
  const { isAuthenticated, user, clearSession } = useAdminAuth();

  return (
    <div className={`${adminShell} relative overflow-hidden`}>
      {/* Aurora Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 grid lg:grid-cols-[280px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="border-r border-white/5 bg-slate-950/40 backdrop-blur-2xl p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-10 px-2">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-slate-950 bg-emerald-500 items-center justify-center flex">
                 <div className="h-1.5 w-1.5 rounded-full bg-white opacity-75" />
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-0.5">Studio</div>
              <div className="font-black text-xl text-white tracking-tight">ULA <span className={adminAccentText}>Admin</span></div>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 border ${
                      isActive
                        ? 'bg-white/10 border-white/10 text-white shadow-[0_10px_30px_rgba(99,102,241,0.1)]'
                        : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/5'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5" />
                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 transform rounded-full p-0.5 border border-white/0 group-hover:border-white/10 group-hover:translate-x-0.5`} />
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/5 bg-white/5 p-5">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
               <div className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-400">Live Status</div>
            </div>
            <p className="text-xs text-slate-400 leading-5">
              Syncing with production API. All changes are immutable until committed.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex flex-col bg-slate-950/20">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-6 px-8 py-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-1">
                  <div className="h-3 w-[2px] bg-indigo-500" />
                  Content Orchestrator
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">Management Console</h1>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/" target="_blank" className={adminSecondaryButton}>
                  <Eye className="w-4 h-4" />
                  <span>Preview Site</span>
                </Link>
                <div className="h-8 w-px bg-white/10" />
                {isAuthenticated ? (
                  <div className="flex items-center gap-4 pl-2">
                    <div className="text-right hidden sm:block">
                       <div className="text-sm font-bold text-white">{user?.role === 'admin' ? 'Root Admin' : user?.role}</div>
                       <div className="text-[10px] text-slate-500 font-medium">Session Active</div>
                    </div>
                    <button
                      onClick={clearSession}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link to="/admin/login" className={adminPrimaryButton}>
                    <LogIn className="w-4 h-4" />
                    <span>Authorize</span>
                  </Link>
                )}
              </div>
            </div>
            
            <div className="px-8 pb-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/5">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">API Online</span>
                </div>
                {[ADMIN_SECTION_KEYS.hero, ADMIN_SECTION_KEYS.painpoints, ADMIN_SECTION_KEYS.solution].map(key => (
                  <div key={key} className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] whitespace-nowrap">{key}</div>
                ))}
            </div>
          </header>

          <main className="p-8 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
