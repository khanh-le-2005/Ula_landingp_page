import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, LayoutDashboard, Sparkles, Target, Waypoints, Gift, PanelsTopLeft, Eye, LogOut, LogIn, FileText, ChevronRight, Activity, ChevronDown, Globe } from 'lucide-react';
import { useAdminAuth } from './hooks/useAdminAuth';
import { ADMIN_SECTION_KEYS } from './adminSections';
import { adminShell, adminSecondaryButton, adminPrimaryButton, adminAccentText } from './adminTheme';
import { ProjectProvider, useProject } from './context/ProjectContext';

// Import sub-pages for consolidation
// Import China editors
import ChinaOverview from './pages/Overview';
import ChinaLeads from './pages/Leads';
import ChinaHeroEditor from './pages/HeroEditor';
import ChinaPainpointsEditor from './pages/PainpointsEditor';
import ChinaSolutionEditor from './pages/SolutionEditor';
import ChinaMethodologyEditor from './pages/MethodologyEditor';
import ChinaLuckyWheelEditor from './pages/LuckyWheelEditor';
import ChinaExperienceEditor from './pages/ExperienceEditor';
import ChinaAffiliates from './pages/Affiliates';

// Import German editors
import GermanOverview from '../../../ula-German/pages/admin/pages/Overview';
import GermanLeads from '../../../ula-German/pages/admin/pages/Leads';
import GermanHeroEditor from '../../../ula-German/pages/admin/pages/HeroEditor';
import GermanPainpointsEditor from '../../../ula-German/pages/admin/pages/PainpointsEditor';
import GermanSolutionEditor from '../../../ula-German/pages/admin/pages/SolutionEditor';
import GermanMethodologyEditor from '../../../ula-German/pages/admin/pages/MethodologyEditor';
import GermanLuckyWheelEditor from '../../../ula-German/pages/admin/pages/LuckyWheelEditor';
import GermanExperienceEditor from '../../../ula-German/pages/admin/pages/ExperienceEditor';
import GermanAffiliates from '../../../ula-German/pages/admin/pages/Affiliates';

const navItems = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'leads', label: 'Quản lý Lead', icon: FileText },
  { id: 'hero', label: 'Trang đầu', icon: PanelsTopLeft },
  { id: 'painpoints', label: 'Nỗi đau', icon: Target },
  { id: 'solution', label: 'Giải pháp', icon: Sparkles },
  { id: 'methodology', label: 'Phương pháp', icon: Waypoints },
  { id: 'experience', label: 'Trải nghiệm', icon: BadgeCheck },
  { id: 'lucky-wheel', label: 'Vòng quay', icon: Gift },
  { id: 'affiliates', label: 'Affiliate', icon: BadgeCheck },
];

function AdminLayoutInner() {
  const { isAuthenticated, user, clearSession } = useAdminAuth();
  const { activeProject, setActiveProject } = useProject();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedModule, setExpandedModule] = useState<'tieng-trung' | 'tieng-duc' | null>(activeProject);

  // Sync expanded module with active project on load
  useEffect(() => {
    setExpandedModule(activeProject);
  }, [activeProject]);

  const handleLogout = () => {
    clearSession();
    navigate('/admin/login');
  };

  const selectModuleAndSection = (module: 'tieng-trung' | 'tieng-duc', section: string) => {
    if (activeProject !== module) {
      setActiveProject(module);
    }
    setActiveSection(section);
    // Reload data is handled by the useEffect in editors watching site context
  };

  const renderContent = () => {
    // We add a key={activeProject} to force a fresh mount of sub-pages when switching projects
    const contentKey = `${activeProject}-${activeSection}`;
    const isGerman = activeProject === 'tieng-duc';
    
    switch (activeSection) {
      case 'overview': 
        return isGerman 
          ? <GermanOverview key={contentKey} onNavigate={(s) => selectModuleAndSection(activeProject, s)} />
          : <ChinaOverview key={contentKey} onNavigate={(s) => selectModuleAndSection(activeProject, s)} />;
      case 'leads': 
        return isGerman ? <GermanLeads key={contentKey} /> : <ChinaLeads key={contentKey} />;
      case 'hero': 
        return isGerman ? <GermanHeroEditor key={contentKey} /> : <ChinaHeroEditor key={contentKey} />;
      case 'painpoints': 
        return isGerman ? <GermanPainpointsEditor key={contentKey} /> : <ChinaPainpointsEditor key={contentKey} />;
      case 'solution': 
        return isGerman ? <GermanSolutionEditor key={contentKey} /> : <ChinaSolutionEditor key={contentKey} />;
      case 'methodology': 
        return isGerman ? <GermanMethodologyEditor key={contentKey} /> : <ChinaMethodologyEditor key={contentKey} />;
      case 'experience': 
        return isGerman ? <GermanExperienceEditor key={contentKey} /> : <ChinaExperienceEditor key={contentKey} />;
      case 'lucky-wheel': 
        return isGerman ? <GermanLuckyWheelEditor key={contentKey} /> : <ChinaLuckyWheelEditor key={contentKey} />;
      case 'affiliates': 
        return isGerman ? <GermanAffiliates key={contentKey} /> : <ChinaAffiliates key={contentKey} />;
      default: 
        return isGerman 
          ? <GermanOverview key={contentKey} onNavigate={(s) => selectModuleAndSection(activeProject, s)} />
          : <ChinaOverview key={contentKey} onNavigate={(s) => selectModuleAndSection(activeProject, s)} />;
    }
  };

  const renderModuleMenu = (moduleId: 'tieng-trung' | 'tieng-duc', label: string, accentColor: string) => {
    const isExpanded = expandedModule === moduleId;
    const isWorkingOnThis = activeProject === moduleId;

    return (
      <div className="space-y-1 mb-4">
        <button
          onClick={() => setExpandedModule(isExpanded ? null : moduleId)}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 ${
            isWorkingOnThis 
              ? 'bg-slate-100 border border-slate-200 text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-8 w-8 rounded-lg ${isWorkingOnThis ? accentColor : 'bg-slate-100'} flex items-center justify-center transition-colors`}>
               <Globe className={`w-4 h-4 ${isWorkingOnThis ? 'text-white' : 'text-slate-400'}`} />
            </div>
            <span className="font-black text-xs uppercase tracking-widest">{label}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {isExpanded && (
          <div className="pl-4 space-y-1 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
             {navItems.map((item) => {
               const Icon = item.icon;
               const isActive = activeProject === moduleId && activeSection === item.id;
               return (
                 <button
                   key={item.id}
                   onClick={() => selectModuleAndSection(moduleId, item.id)}
                   className={`w-full group flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 transition-all ${
                     isActive
                       ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-[1.02]'
                       : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                   }`}
                 >
                   <div className="flex items-center gap-3">
                     <Icon className="w-4 h-4" />
                     <span className="font-bold text-[13px] tracking-wide">{item.label}</span>
                   </div>
                   <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all ${isActive ? 'opacity-100' : ''}`} />
                 </button>
               );
             })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${adminShell} relative overflow-hidden`}>
      {/* Subtle Light Background Grain / Gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.4]">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-indigo-200/40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-violet-200/40 blur-[120px]" />
      </div>

      <div className="relative z-10 grid lg:grid-cols-[300px_1fr] min-h-screen">
        {/* Sidebar */}
        <aside className="border-r border-slate-200 bg-white p-6 flex flex-col h-screen sticky top-0 overflow-y-auto no-scrollbar">
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

          <div className="flex-1">
             <div className="mb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Điều phối dự án</div>
             {renderModuleMenu('tieng-trung', 'Quản lý Tiếng Trung', 'bg-rose-500')}
             {renderModuleMenu('tieng-duc', 'Quản lý Tiếng Đức', 'bg-amber-500')}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <button
               onClick={handleLogout}
               className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-rose-500 hover:bg-rose-50 transition-all duration-300 w-full font-bold text-sm"
            >
               <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
               <span>Đăng xuất tài khoản</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex flex-col bg-slate-50/50">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-6 px-8 py-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-1">
                  <div className="h-3 w-[2px] bg-indigo-500" />
                  Dự án: <span className="text-slate-900">{activeProject === 'tieng-trung' ? 'Trung Quốc' : 'Đức'}</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {navItems.find(n => n.id === activeSection)?.label || 'Bảng điều khiển'}
                </h1>
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
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 transition-all hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-sm"
                      title="Đăng xuất"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>
          <main className="p-8 flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <ProjectProvider>
       <AdminLayoutInner />
    </ProjectProvider>
  );
}
