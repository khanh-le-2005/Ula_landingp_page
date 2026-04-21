import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, WandSparkles, Target, Waypoints, Gift, ShieldCheck, FileText, Zap, Box, Layers, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ADMIN_SECTION_LIST } from '../adminSections';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminCard, adminCardMuted, adminAccentText } from '../adminTheme';

const cards = [
  { to: '/admin/hero', title: 'Trang đầu', desc: 'Tiêu đề, CTA và các điểm nhấn thị giác.', icon: WandSparkles, color: 'text-indigo-400' },
  { to: '/admin/painpoints', title: 'Nỗi đau', desc: 'Quản lý các điểm chạm tâm lý.', icon: Target, color: 'text-rose-400' },
  { to: '/admin/solution', title: 'Giải pháp', desc: 'Các tính năng cốt lõi & truyền thông.', icon: ClipboardList, color: 'text-emerald-400' },
  { to: '/admin/methodology', title: 'Phương pháp', desc: 'Các khối quy trình và chiến lược.', icon: Waypoints, color: 'text-amber-400' },
  { to: '/admin/lucky-wheel', title: 'Vòng quay', desc: 'Phần thưởng game hóa & ưu đãi.', icon: Gift, color: 'text-violet-400' },
  { to: '/admin/leads', title: 'Quản lý Lead', icon: FileText, desc: 'Xem và xuất dữ liệu khách hàng.', color: 'text-cyan-400' },
];

export default function Overview() {
  const { isAuthenticated, user } = useAdminAuth();

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_350px]">
      <div className="space-y-8">
        <section className={adminCard}>
          <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-2">
                <Box className="w-3 h-3" />
                Tổng quan hệ thống
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Trung tâm <span className={adminAccentText}>Điều khiển</span></h2>
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-emerald-600">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Đã kết nối Production
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.to}
                  to={card.to}
                  className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 transition-all duration-300 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-1 shadow-sm"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Icon className="w-16 h-16" />
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`h-12 w-12 rounded-2xl bg-white flex items-center justify-center mb-6 border border-slate-200 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div className="flex-1">
                       <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{card.title}</h3>
                       <p className="text-xs text-slate-500 leading-relaxed font-medium">{card.desc}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">Quản lý dữ liệu</span>
                       <div className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
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
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">Tổng lượt đồng bộ</div>
                </div>
                <div className="text-3xl font-black text-slate-900">1,284</div>
                <div className="mt-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">+12% so với tuần trước</div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">Phần hoạt động</div>
                </div>
                <div className="text-3xl font-black text-slate-900">05/05</div>
                <div className="mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Đang vận hành tốt</div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">Độ trễ API</div>
                </div>
                <div className="text-3xl font-black text-slate-900">42ms</div>
                <div className="mt-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Hiệu suất tối ưu</div>
            </div>
        </div>
      </div>

      <aside className="space-y-6">
        <section className={`${adminCardMuted} space-y-6 bg-slate-50/50`}>
            <div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-3 flex items-center gap-2">
                   <ShieldCheck className="w-3 h-3" />
                   Giao thức bảo mật
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                   <div className="flex items-center gap-3 mb-2 font-bold text-sm text-slate-900">
                      <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                      Trạng thái phiên
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed">
                      {isAuthenticated
                        ? `Đã xác thực là ${user?.role}. Mã hóa TLS 1.3 đang hoạt động.`
                        : 'Yêu cầu phiên làm việc an toàn. Đang chuyển hướng...'}
                   </p>
                </div>
            </div>

            <div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-4">Danh mục các phần</div>
                <div className="space-y-2">
                    {ADMIN_SECTION_LIST.map((section) => (
                    <div key={section.key} className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                        <span className="text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{section.title}</span>
                        <code className="text-[9px] font-black text-slate-400 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md uppercase tracking-widest">{section.key}</code>
                    </div>
                    ))}
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
                <div className="text-xs font-black text-slate-900 mb-2">Sao lưu tự động</div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">Mọi thay đổi đều được kiểm soát phiên bản. Có thể khôi phục qua console.</p>
            </div>
        </section>
      </aside>
    </div>
  );
}
