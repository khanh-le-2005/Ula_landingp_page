import React from 'react';
import { RefreshCw, Save, Layout, Sparkles, Box, Type, MousePointer2 } from 'lucide-react';
import { methodologyDefault, type MethodologyContent } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';
import { ImageUploadField } from '../components/ImageUploadField';
import { flattenToFormData } from '../utils/formDataUtil';
import { resolveAssetUrl } from '../../../utils/assetUtil';

export default function MethodologyEditor() {
  const { content, setContent, isLoading, isSaving, lastSavedAt, reload, save } = useLandingSection<MethodologyContent>(
    ADMIN_SECTION_KEYS.methodology,
    methodologyDefault,
  );

  const updateMainCard = (updates: Partial<MethodologyContent['mainCard']>) => {
    setContent(prev => ({ ...prev, mainCard: { ...prev.mainCard, ...updates } }));
  };

  const updateCard = (index: number, updates: Partial<MethodologyContent['cards'][0]>) => {
    setContent(prev => ({
      ...prev,
      cards: (Array.isArray(prev.cards) ? prev.cards : []).map((c, i) => (i === index ? { ...c, ...updates } : c)),
    }));
  };

  const handleSave = async () => {
    const formData = flattenToFormData(content);
    await save(formData);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* Main Card Editor */}
        <section className={adminCard}>
          <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Kiến trúc Quy trình
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Thiết kế <span className={adminAccentText}>Phương pháp</span>
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

          <div className="space-y-8">
            <div className="rounded-3xl border border-indigo-200 bg-indigo-50/50 p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600">
                <Layout className="h-4 w-4" />
                Thẻ Trưng bày chính
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className={adminLabel}>ID / Số thứ tự quy trình</div>
                    <input className={adminInput} value={content.mainCard.number} onChange={(e) => updateMainCard({ number: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <div className={adminLabel}>Tiêu đề chính</div>
                    <input className={adminInput} value={content.mainCard.title} onChange={(e) => updateMainCard({ title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <div className={adminLabel}>Tiêu đề phụ (Meta)</div>
                    <input className={adminInput} value={content.mainCard.subTitle} onChange={(e) => updateMainCard({ subTitle: e.target.value })} />
                  </div>
                </div>
                <ImageUploadField
                  label="Tài sản Trưng bày"
                  value={content.mainCard.imgSrc}
                  onChange={(val) => updateMainCard({ imgSrc: val as any })}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {(Array.isArray(content.cards) ? content.cards : []).map((card, index) => (
                <div key={index} className="group relative rounded-3xl border border-slate-200 bg-white p-6 transition-all hover:bg-slate-50 shadow-sm">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-[10px] font-black font-mono text-indigo-600">
                      0{index + 1}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-800">Nút quy trình {index + 1}</div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className={adminLabel}>ID / Số thứ tự</div>
                      <input className={adminInput} value={card.number || ''} onChange={(e) => updateCard(index, { number: e.target.value })} placeholder="Vd: Ô 2: VIDEO" />
                    </div>
                    <div className="space-y-2">
                      <div className={adminLabel}>Tiêu đề Nút</div>
                      <input className={adminInput} value={card.title} onChange={(e) => updateCard(index, { title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <div className={adminLabel}>Mô tả</div>
                      <input className={adminInput} value={card.subTitle} onChange={(e) => updateCard(index, { subTitle: e.target.value })} />
                    </div>
                    <ImageUploadField
                      label="Biểu tượng/Ảnh Nút"
                      value={card.imgSrc}
                      onChange={(val) => updateCard(index, { imgSrc: val as any })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
