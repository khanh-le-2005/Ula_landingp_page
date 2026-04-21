import React from 'react';
import { heroDefault } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { RefreshCw, Save, Layout, Type, MousePointer2, Sparkles, MonitorSmartphone, PlayCircle } from 'lucide-react';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';
import { ImageUploadField } from '../components/ImageUploadField';
import { flattenToFormData } from '../utils/formDataUtil';
import { resolveAssetUrl } from '../../../utils/assetUtil';

export default function HeroEditor() {
  const { content: hero, setContent: setHero, isLoading, isSaving, error, lastSavedAt, reload, save } = useLandingSection(
    ADMIN_SECTION_KEYS.hero,
    heroDefault,
  );

  const handleSave = async () => {
    await save(hero);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <section className={adminCard}>
          <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Cấu hình phần
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trang đầu <span className={adminAccentText}>Module</span></h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void reload()}
                className={adminSecondaryButton}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Đồng bộ
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={adminPrimaryButton}
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2 rounded-full px-3 py-1 bg-slate-100 border border-slate-200 text-slate-500">
                <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                {isLoading ? 'Đang tải dữ liệu' : 'Đồng bộ trực tiếp'}
             </div>
             <div className="text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-md">{ADMIN_SECTION_KEYS.hero}</div>
             {lastSavedAt && (
                <div className="text-slate-400 lowercase font-medium">Lưu lần cuối: {new Date(lastSavedAt).toLocaleTimeString()}</div>
             )}
          </div>

          {error && (
            <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-400">
              <Sparkles className="inline-block w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-3">
                <div className={adminLabel}>
                   <Sparkles className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                   Nhãn nổi bật
                </div>
                <input className={adminInput} value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} placeholder="v.d. CẬP NHẬT 2024" />
              </div>
              <div className="space-y-3">
                <div className={adminLabel}>
                   <PlayCircle className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                   Đường dẫn Video (Vimeo/Youtube)
                </div>
                <input 
                  className={adminInput} 
                  value={hero.heroVideoWatchUrl} 
                  onChange={(e) => setHero({ ...hero, heroVideoWatchUrl: e.target.value })} 
                  placeholder="v.d. https://player.vimeo.com/video/..." 
                />
              </div>
            </div>

            <div className="space-y-4">
               <div className={adminLabel}>
                  <Type className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                  Tiêu đề chính
               </div>
               <div className="grid md:grid-cols-3 gap-4">
                  <input className={adminInput} value={hero.headlineTop} onChange={(e) => setHero({ ...hero, headlineTop: e.target.value })} placeholder="Phần đầu" />
                  <div className="relative">
                    <input className={`${adminInput} !border-indigo-200 !bg-indigo-50`} value={hero.headlineHighlight} onChange={(e) => setHero({ ...hero, headlineHighlight: e.target.value })} placeholder="Phần nổi bật" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-indigo-500 rounded-full blur-[2px] opacity-30" />
                  </div>
                  <input className={adminInput} value={hero.headlineBottom} onChange={(e) => setHero({ ...hero, headlineBottom: e.target.value })} placeholder="Phần kết" />
               </div>
            </div>

            <div className="space-y-3">
              <div className={adminLabel}>Mô tả chính</div>
              <textarea className={`${adminInput} min-h-[120px] resize-y leading-relaxed text-sm`} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className={adminLabel}>
                   <MousePointer2 className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                   Hành động chính
                </div>
                <input className={adminInput} value={hero.primaryCta} onChange={(e) => setHero({ ...hero, primaryCta: e.target.value })} />
              </div>
              <div className="space-y-3">
                <div className={adminLabel}>Hành động phụ</div>
                <input className={adminInput} value={hero.secondaryCta} onChange={(e) => setHero({ ...hero, secondaryCta: e.target.value })} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-8">
        <section className={adminCard}>
          <div className="flex items-center justify-between gap-4 mb-6">
             <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 flex items-center gap-2">
                <MonitorSmartphone className="w-3 h-3" />
                Xem nhanh trang chủ
             </div>
             <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-1.5 overflow-hidden shadow-xl">
              <div className="rounded-[24px] bg-white overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 pointer-events-none z-10" />
                  {/* <img src="https://images.unsplash.com/photo-1548622159-866895eb488b?q=80&w=2070&auto=format&fit=crop" alt="Hero preview" className="h-[240px] w-full object-cover transition-transform duration-700 group-hover:scale-105" /> */}
                  
                  <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                      <div className="inline-flex px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-[9px] font-black text-slate-600 uppercase tracking-widest mb-3">
                        {hero.badge}
                      </div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                        {hero.headlineTop} <span className={adminAccentText}>{hero.headlineHighlight}</span> {hero.headlineBottom}
                      </h3>
                  </div>
              </div>
              <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {hero.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="h-9 px-4 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-slate-900/10">
                        {hero.primaryCta}
                    </div>
                    <div className="h-9 px-4 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {hero.secondaryCta}
                    </div>
                  </div>
              </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
