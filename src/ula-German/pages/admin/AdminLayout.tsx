import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, LayoutDashboard, Sparkles, Target, Waypoints, Gift, PanelsTopLeft, Eye, LogOut, LogIn, FileText, ChevronRight, Activity } from 'lucide-react';
import { useAdminAuth } from './hooks/useAdminAuth';
import { ADMIN_SECTION_KEYS } from './adminSections';
import { adminShell, adminSecondaryButton, adminPrimaryButton, adminAccentText } from './adminTheme';

const navItems = [
  { to: '/admin', label: 'Tổng quan', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Quản lý Lead', icon: FileText },
  { to: '/admin/hero', label: 'Trang đầu', icon: PanelsTopLeft },
  { to: '/admin/painpoints', label: 'Nỗi đau', icon: Target },
  { to: '/admin/solution', label: 'Giải pháp', icon: Sparkles },
  { to: '/admin/methodology', label: 'Phương pháp', icon: Waypoints },
  { to: '/admin/experience', label: 'Trải nghiệm', icon: BadgeCheck },
  { to: '/admin/lucky-wheel', label: 'Vòng quay', icon: Gift },
  { to: '/admin/affiliates', label: 'KOC / Tracking', icon: Waypoints },
];

export default function AdminLayout() {
  const { isAuthenticated, user, clearSession } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSession();
    navigate('/admin/login');
  };

  return (
    <div className={`${adminShell} relative overflow-hidden`}>
      {/* Subtle Light Background Grain / Gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.4]">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-200/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-violet-200/40 blur-[120px]" />
      </div>

      <div className="relative z-10 grid lg:grid-cols-[280px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="border-r border-slate-200 bg-white p-6 flex flex-col">
          <div className="flex items-center gap-4 mb-10 px-2">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10">
                <Activity className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 items-center justify-center flex">
                 <div className="h-1.5 w-1.5 rounded-full bg-white opacity-75" />
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-0.5">Studio</div>
              <div className="font-black text-xl text-slate-900 tracking-tight">ULA <span className={adminAccentText}>Admin</span></div>
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
                    `group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-[1.02]'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4.5 h-4.5" />
                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-300 transform rounded-full p-0.5 group-hover:translate-x-0.5`} />
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full group flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-500 transition-all duration-300 hover:text-rose-600 hover:bg-rose-50"
            >
              <LogOut className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
              <span className="font-bold text-sm tracking-wide">Đăng xuất</span>
            </button>
          </div>

          {/* <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-center gap-2 mb-2">
               <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
               <div className="text-[10px] uppercase tracking-[0.3em] font-black text-indigo-600">Trạng thái</div>
            </div>
            <p className="text-xs text-slate-500 leading-5">
              Đang đồng bộ với production API. Mọi thay đổi sẽ được áp dụng sau khi lưu.
            </p>
          </div> */}
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex flex-col bg-slate-50/50">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-6 px-8 py-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-1">
                  <div className="h-3 w-[2px] bg-indigo-500" />
                  Điều phối nội dung
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bảng điều khiển</h1>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/" target="_blank" className={adminSecondaryButton}>
                  <Eye className="w-4 h-4" />
                  <span>Xem trang chủ</span>
                </Link>
                <div className="h-8 w-px bg-slate-200" />
                {isAuthenticated ? (
                  <div className="flex items-center gap-4 pl-2">
                    <div className="text-right hidden sm:block">
                       <div className="text-sm font-bold text-slate-900">{user?.role === 'admin' ? 'Quản trị viên' : user?.role}</div>
                       <div className="text-[10px] text-slate-400 font-medium">Phiên làm việc hoạt động</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition-all hover:bg-rose-50 hover:text-white hover:border-rose-100"
                      title="Đăng xuất"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link to="/admin/login" className={adminPrimaryButton}>
                    <LogIn className="w-4 h-4" />
                    <span>Xác thực</span>
                  </Link>
                )}
              </div>
            </div>
            
            <div className="px-8 pb-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 py-1 px-3 rounded-full bg-slate-100 border border-slate-200">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">API Mực mạng</span>
                </div>
                {[ADMIN_SECTION_KEYS.hero, ADMIN_SECTION_KEYS.painpoints, ADMIN_SECTION_KEYS.solution].map(key => (
                  <div key={key} className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">{key}</div>
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
