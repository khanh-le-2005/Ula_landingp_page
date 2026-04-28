import React from 'react';
import { RefreshCw, Save, Layout, Sparkles, Box, Type, MousePointer2, Plus, Trash2 } from 'lucide-react';
import { solutionDefault, type SolutionFeature, type SolutionContent } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';
import { ImageUploadField } from '../components/ImageUploadField';
import { flattenToFormData } from '../utils/formDataUtil';
import { resolveAssetUrl } from '../../../utils/assetUtil';

export default function SolutionEditor() {
  const { content, setContent, isLoading, isSaving, error, save, reload } = useLandingSection<SolutionContent>(
    ADMIN_SECTION_KEYS.solution,
    solutionDefault,
  );

  const updateTitle = (patch: Partial<SolutionContent>) => {
    setContent(prev => ({ ...prev, ...patch }));
  };

  const updateFeature = (index: number, updates: Partial<SolutionFeature>) => {
    setContent((prev) => ({
      ...prev,
      cards: (Array.isArray(prev.cards) ? prev.cards : []).map((f, i) =>
        i === index ? { ...f, ...updates } : f
      )
    }));
  };

  const updateBullet = (fIndex: number, bIndex: number, value: string) => {
    setContent((prev) => ({
      ...prev,
      cards: (Array.isArray(prev.cards) ? prev.cards : []).map((f, i) =>
        i === fIndex
          ? {
            ...f,
            bullets: (Array.isArray(f.bullets) ? f.bullets : []).map((b, j) =>
              j === bIndex ? value : b
            ),
          }
          : f
      )
    }));
  };

  const addBullet = (fIndex: number) => {
    setContent((prev) => ({
      ...prev,
      cards: (Array.isArray(prev.cards) ? prev.cards : []).map((f, i) =>
        i === fIndex
          ? {
            ...f,
            bullets: [...(Array.isArray(f.bullets) ? f.bullets : []), '']
          }
          : f
      )
    }));
  };

  const removeBullet = (fIndex: number, bIndex: number) => {
    setContent((prev) => ({
      ...prev,
      cards: (Array.isArray(prev.cards) ? prev.cards : []).map((f, i) =>
        i === fIndex
          ? {
            ...f,
            bullets: (Array.isArray(f.bullets) ? f.bullets : []).filter((_, j) => j !== bIndex)
          }
          : f
      )
    }));
  };

  const handleSave = async () => {
    try {
      const cleanContent = { ...content };

      if (Array.isArray(cleanContent.cards)) {
        cleanContent.cards = cleanContent.cards.map(card => {
          const newCard = { ...card };

          // BỘ LỌC THÔNG MINH:
          const isNewFile = newCard.mediaUrl instanceof File;
          const isOldValidUrl = typeof newCard.mediaUrl === 'string' &&
            newCard.mediaUrl.trim() !== '' &&
            newCard.mediaUrl !== 'null' &&
            !newCard.mediaUrl.includes('[object Object]');

          // NẾU KHÔNG PHẢI FILE MỚI, CŨNG KHÔNG PHẢI LINK CŨ HỢP LỆ -> MỚI XÓA ĐỂ TRÁNH LƯU RÁC
          if (!isNewFile && !isOldValidUrl) {
            delete newCard.mediaUrl;
          }

          return newCard;
        });
      }

      const formData = flattenToFormData(cleanContent);
      const result = await save(formData);

      console.log('[SolutionEditor] Lưu thành công!', result);
      alert('Đã lưu thay đổi thành công!');
    } catch (err) {
      console.error('[SolutionEditor] Lỗi khi lưu:', err);
      alert('Có lỗi xảy ra khi lưu: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'));
    }
  };

  return (
    <div className="space-y-8">
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
          {/* Cấu hình tiêu đề chính */}
          <div className="p-8 rounded-[32px] bg-indigo-50/30 border border-indigo-100">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-6">
              <Type className="w-3 h-3" /> Tiêu đề phần (Headline)
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className={adminLabel}>Phần 1 (Chỉ)</div>
                <input className={adminInput} value={content.titlePart1} onChange={(e) => updateTitle({ titlePart1: e.target.value })} />
              </div>
              <div className="space-y-1">
                <div className={adminLabel}>Phần nổi bật (30 phút/ngày)</div>
                <input className={adminInput} value={content.titleHighlight} onChange={(e) => updateTitle({ titleHighlight: e.target.value })} />
              </div>
              <div className="space-y-1">
                <div className={adminLabel}>Phần 2 (dễ dàng bắt đầu)</div>
                <input className={adminInput} value={content.titlePart2} onChange={(e) => updateTitle({ titlePart2: e.target.value })} />
              </div>
            </div>
          </div>

          {(Array.isArray(content.cards) ? content.cards : []).map((feature, fIndex) => (
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
                      {(Array.isArray(feature.bullets) ? feature.bullets : []).map((bullet, bIndex) => (
                        <div key={bIndex} className="relative group/bullet flex items-center gap-2">
                          <input className={adminInput} value={bullet} onChange={(e) => updateBullet(fIndex, bIndex, e.target.value)} />
                          <button onClick={() => removeBullet(fIndex, bIndex)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Xóa">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => addBullet(fIndex)} className="mt-2 flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
                        <Plus className="w-3 h-3" /> Thêm điểm chính
                      </button>
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

    </div>
  );
}
