import React from 'react';
import { RefreshCw, Save, Layout, Sparkles, Box, Type, MousePointer2 } from 'lucide-react';
import { solutionDefault, type SolutionFeature } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';
import { ImageUploadField } from '../components/ImageUploadField';
import { flattenToFormData } from '../utils/formDataUtil';
import { resolveAssetUrl } from '../../../utils/assetUtil';

export default function SolutionEditor() {
  const { content: features, setContent: setFeatures, isLoading, isSaving, error, lastSavedAt, reload, save } = useLandingSection<SolutionFeature[]>(
    ADMIN_SECTION_KEYS.solution,
    solutionDefault,
  );

  const updateFeature = (index: number, updates: Partial<SolutionFeature>) => {
    setFeatures((prev) => prev.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  };

  const updateBullet = (fIndex: number, bIndex: number, value: string) => {
    setFeatures((prev) =>
      prev.map((f, i) =>
        i === fIndex
          ? { ...f, bullets: f.bullets.map((b, j) => (j === bIndex ? value : b)) }
          : f,
      ),
    );
  };

  const handleSave = async () => {
    const formData = flattenToFormData(features);
    await save(formData);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
      <section className={adminCard}>
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Cấu hình Bộ tính năng
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Thiết kế <span className={adminAccentText}>Giải pháp</span>
            </h2>

          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void reload()} className={adminSecondaryButton}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Đồng bộ
            </button>
            <button onClick={handleSave} disabled={isSaving} className={adminPrimaryButton}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {error && <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-400">{error}</div>}

        <div className="space-y-12">
          {features.map((feature, fIndex) => (
            <div key={fIndex} className="group relative rounded-[32px] border border-slate-200 bg-slate-50/30 p-8 transition-all hover:bg-slate-50">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200`}>
                    <Box className="h-6 w-6 text-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Thẻ giải pháp #{fIndex + 1}</h3>
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">{feature.category}</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className={adminLabel}>Nhãn danh mục</div>
                    <input className={adminInput} value={feature.category} onChange={(e) => updateFeature(fIndex, { category: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <div className={adminLabel}>Tiêu đề thẻ</div>
                    <input className={adminInput} value={feature.title} onChange={(e) => updateFeature(fIndex, { title: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <div className={adminLabel}>Các điểm chính (Bullet points)</div>
                    <div className="space-y-3">
                      {feature.bullets.map((bullet, bIndex) => (
                        <div key={bIndex} className="relative group/bullet">
                           <input className={adminInput} value={bullet} onChange={(e) => updateBullet(fIndex, bIndex, e.target.value)} />
                           <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-indigo-500 opacity-0 group-hover/bullet:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <ImageUploadField 
                    label="Phương tiện (Ảnh/Video)"
                    value={feature.mediaUrl}
                    onChange={(val) => updateFeature(fIndex, { mediaUrl: val as any })}
                    type={feature.isVideo ? 'video' : 'image'}
                  />
                  <div className="flex items-center gap-4 group cursor-pointer" onClick={() => updateFeature(fIndex, { isVideo: !feature.isVideo })}>
                    <div className={`flex h-5 w-10 items-center rounded-full transition-all ${feature.isVideo ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                       <div className={`h-4 w-4 rounded-full bg-white shadow-md transition-all ${feature.isVideo ? 'translate-x-5' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-slate-900 transition-colors">Xử lý dưới dạng Video</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="space-y-8">
        <section className={adminCard}>
           <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
                 <Box className="h-3 w-3" />
                 Xem trước mô phỏng
              </div>
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
           </div>

           <div className="space-y-6">
              {features.map((feature, i) => (
                <div key={i} className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-1.5 shadow-xl">
                   <div className="relative h-[200px] w-full overflow-hidden rounded-[22px] bg-slate-50 shadow-inner">
                      <img src={resolveAssetUrl(feature.mediaUrl instanceof File ? URL.createObjectURL(feature.mediaUrl) : feature.mediaUrl)} className="h-full w-full object-cover transition-all duration-700 hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                         <div className="inline-block rounded-full bg-slate-900 px-2.5 py-1 text-[8px] font-black text-white uppercase tracking-widest shadow-sm">{feature.category}</div>
                         <h4 className="mt-2 text-sm font-black text-slate-900">{feature.title}</h4>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <section className="rounded-[32px] border border-slate-100 bg-slate-50 p-6">
           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Type className="h-3 w-3 text-indigo-500" />
              Thông tin cấu trúc
           </div>
           <div className="mt-4 font-mono text-[9px] text-slate-400 leading-relaxed">
              Mã phân mục: {ADMIN_SECTION_KEYS.solution}<br/>
              Kiểm tra lần cuối: {new Date().toLocaleTimeString()}
           </div>
        </section>
      </aside>
    </div>
  );
}
