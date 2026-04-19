import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, WandSparkles, Target, Waypoints, Gift, ShieldCheck, FileText, Zap, Box, Layers, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_SECTION_LIST } from '../adminSections';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminCard, adminCardMuted, adminAccentText } from '../adminTheme';

const cards = [
  { to: '/admin/hero', title: 'Hero Section', desc: 'Headline, CTA, and visual hooks.', icon: WandSparkles, color: 'text-indigo-400' },
  { to: '/admin/painpoints', title: 'Painpoints', desc: 'Manage psychological triggers.', icon: Target, color: 'text-rose-400' },
  { to: '/admin/solution', title: 'Solution Hub', desc: 'Core product features & media.', icon: ClipboardList, color: 'text-emerald-400' },
  { to: '/admin/methodology', title: 'Methodology', desc: 'Process and strategy blocks.', icon: Waypoints, color: 'text-amber-400' },
  { to: '/admin/lucky-wheel', title: 'Lucky Wheel', desc: 'Gamified rewards & incentives.', icon: Gift, color: 'text-violet-400' },
  { to: '/admin/leads', title: 'Leads Manager', icon: FileText, desc: 'View and export lead data.', color: 'text-cyan-400' },
];

export default function Overview() {
  const { isAuthenticated, user } = useAdminAuth();

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_350px]">
      <div className="space-y-8">
        <section className={adminCard}>
          <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
                <Box className="w-3 h-3" />
                System Overview
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Content <span className={adminAccentText}>Command Center</span></h2>
              <p className="mt-4 max-w-2xl text-slate-400 leading-relaxed text-sm">
                Orchestrate your landing page sections with pixel-perfect precision. Each module below is directly mapped to the production API.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-emerald-400">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Production Linked
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.to}
                  to={card.to}
                  className="group relative overflow-hidden rounded-[28px] border border-white/5 bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/10 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Icon className="w-16 h-16" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`h-12 w-12 rounded-2xl bg-slate-900/50 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">{card.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">Manage Data</span>
                       <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                          <ArrowRight className="w-4 h-4" />
                       </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/5 bg-slate-950/50 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">Total Syncs</div>
                </div>
                <div className="text-3xl font-black text-white">1,284</div>
                <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">+12% from last week</div>
            </div>
            <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-6 backdrop-blur-3xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-rose-400" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">Active Sections</div>
                </div>
                <div className="text-3xl font-black text-white">05/05</div>
                <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fully Operational</div>
            </div>
            <div className="rounded-[32px] border border-white/5 bg-slate-900/40 p-6 backdrop-blur-3xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">API Latency</div>
                </div>
                <div className="text-3xl font-black text-white">42ms</div>
                <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Optimal Performance</div>
            </div>
        </div>
      </div>

      <aside className="space-y-6">
        <section className={`${adminCardMuted} space-y-6`}>
            <div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-3 flex items-center gap-2">
                   <ShieldCheck className="w-3 h-3" />
                   Security Protocol
                </div>
                <div className="rounded-2xl border border-white/5 bg-slate-950 p-4">
                   <div className="flex items-center gap-3 mb-2 font-bold text-sm text-white">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      Session Status
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed">
                      {isAuthenticated
                        ? `Authenticated as ${user?.role}. TLS 1.3 encryption active.`
                        : 'Secure session required. Redirecting to authorization portal...'}
                   </p>
                </div>
            </div>

            <div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-4">Section Registry</div>
                <div className="space-y-2">
                    {ADMIN_SECTION_LIST.map((section) => (
                    <div key={section.key} className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-white/0 hover:border-white/5 hover:bg-white/[0.02] transition-all">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{section.title}</span>
                        <code className="text-[9px] font-black text-slate-600 bg-slate-950 px-2 py-1 rounded-md uppercase tracking-widest">{section.key}</code>
                    </div>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-white/5">
                <div className="text-xs font-black text-white mb-2">Automated Backups</div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-bold uppercase tracking-widest">Every saved change is version controlled. Rollback available via console.</p>
            </div>
        </section>
      </aside>
    </div>
  );
}
