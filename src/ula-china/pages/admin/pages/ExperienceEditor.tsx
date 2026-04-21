import React from 'react';
import { RefreshCw, Save, Brain, Layout, Image as ImageIcon, Sparkles } from 'lucide-react';
import { experienceDefault, type ExperienceContent } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';
import { ImageUploadField } from '../components/ImageUploadField';
import { flattenToFormData } from '../utils/formDataUtil';
import { resolveAssetUrl } from '../../../utils/assetUtil';

export default function ExperienceEditor() {
  const { content, setContent, isLoading, isSaving, lastSavedAt, reload, save } = useLandingSection<ExperienceContent>(
    ADMIN_SECTION_KEYS.experience,
    experienceDefault,
  );

  const handleSave = async () => {
    const formData = flattenToFormData(content);
    await save(formData);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
      <section className={adminCard}>
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              <Sparkles className="h-3 w-3 text-indigo-500" />
              Góc Học tập Công nghệ
            </div>
            <h2 className="text-3xl font-black tracking-tight text-black">
              Soạn thảo <span className={adminAccentText}>Trải nghiệm</span>
            </h2>

          </div>
          <div className="flex flex-wrap gap-2">
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

        <div className="space-y-8">
           <div className="grid gap-8 md:grid-cols-1">
              <div className="space-y-6">
                <div className="space-y-2">
                   <div className={adminLabel}>Tiêu đề chính</div>
                   <input 
                     className={adminInput}
                     value={content.sectionTitle}
                     onChange={(e) => setContent(prev => ({ ...prev, sectionTitle: e.target.value }))}
                   />
                </div>
                <div className="space-y-2">
                   <div className={adminLabel}>Tiêu đề phụ (In nghiêng)</div>
                   <input 
                     className={adminInput}
                     value={content.sectionSubtitle}
                     onChange={(e) => setContent(prev => ({ ...prev, sectionSubtitle: e.target.value }))}
                   />
                </div>
              </div>

              <div className="rounded-[2rem] bg-indigo-500/5 p-8 border border-indigo-500/10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Phương tiện Phát âm AI</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hình ảnh hiển thị trong Tab AI Sửa Phát Âm</p>
                  </div>
                </div>

                <ImageUploadField 
                   label="Hình ảnh hiển thị"
                  value={content.aiPronunciationImageUrl || ''}
                  onChange={(val) => setContent(prev => ({ ...prev, aiPronunciationImageUrl: val as string }))}
                />
              </div>
           </div>
        </div>
      </section>

      <aside className="space-y-8">
        <section className={adminCard}>
           <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400">
                 <Layout className="h-3 w-3" />
                 XEM TRƯỚC TRỰC TIẾP
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
           </div>

           <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="text-center mb-8">
                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">{content.sectionTitle}</h4>
                <h5 className="text-lg font-bold text-slate-900 italic">{content.sectionSubtitle}</h5>
              </div>

              <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-white shadow-xl">
                 {content.aiPronunciationImageUrl ? (
                   <img 
                    src={resolveAssetUrl(content.aiPronunciationImageUrl)} 
                    className="h-full w-full object-cover"
                    alt="Xem trước AI"
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                      Chưa chọn ảnh
                   </div>
                 )}
              </div>
              <div className="mt-6 flex justify-center">
                 <div className="h-10 w-32 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                    Nút AI Beta
                 </div>
              </div>
           </div>
        </section>
      </aside>
    </div>
  );
}
