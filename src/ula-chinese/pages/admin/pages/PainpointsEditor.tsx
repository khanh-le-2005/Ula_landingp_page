import React from 'react';
import { RefreshCw, Save, Layout, Type, Sparkles, Box, Image as ImageIcon } from 'lucide-react';
import { painpointsDefault, type PainpointsContent, PAINPOINTS_DEFAULT_COUNT } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';

import robotMascotFallback from '../../../../assets/nhanvat1.png';
import { resolveAssetUrl } from '../../../utils/assetUtil';
import { toast } from 'react-toastify';

export default function PainpointsEditor() {
  const { content, setContent, isLoading, isSaving, error, lastSavedAt, reload, save } = useLandingSection<PainpointsContent>(
    ADMIN_SECTION_KEYS.painpoints,
    painpointsDefault,
  );

  const fixedBubbles = React.useMemo(() => {
    const bubbles = Array.isArray(content.bubbles) ? content.bubbles : [];
    const normalized = [...bubbles].slice(0, PAINPOINTS_DEFAULT_COUNT);
    while (normalized.length < PAINPOINTS_DEFAULT_COUNT) {
      normalized.push(painpointsDefault.bubbles[normalized.length] || 'Nỗi lo mới');
    }
    return normalized;
  }, [content.bubbles]);

  const updateBubble = (index: number, value: string) => {
    setContent((prev) => ({
      ...prev,
      bubbles: (Array.isArray(prev.bubbles) ? prev.bubbles : []).map((item, i) => (i === index ? value : item)),
    }));
  };

  const handleSave = async () => {
    try {
      await save({ ...content, bubbles: fixedBubbles });
      toast.success('Đã lưu thay đổi thành công!');
    } catch (err) {
      toast.error('Có lỗi xảy ra khi lưu: ' + (err instanceof Error ? err.message : 'Lỗi không xác định'));
    }
  };

  return (
    <div className="space-y-8">
      <section className={adminCard}>
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              <Sparkles className="h-3 w-3" />
              Soạn thảo Bong bóng
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Các <span className={adminAccentText}>Nỗi lo</span>
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

        <div className="mb-8 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
          <div className="rounded-md bg-white border border-slate-200 px-3 py-1 shadow-sm">{ADMIN_SECTION_KEYS.painpoints}</div>
          {lastSavedAt ? (
            <div className="font-medium lowercase text-slate-400">
              Ghi lại lúc: {new Date(lastSavedAt).toLocaleTimeString()}
            </div>
          ) : null}
        </div>


        <div className="grid gap-5">
          <div className="space-y-2">
            <div className={adminLabel}>Tiêu đề phần</div>
            <textarea
              className={`${adminInput} min-h-[80px] py-2 resize-y`}
              value={content.sectionTitle}
              onChange={(e) => setContent((prev) => ({ ...prev, sectionTitle: e.target.value }))}
            />
          </div>
          {/* <div className="space-y-2">
            <div className={adminLabel}>Tiêu đề phụ phần</div>
            <input
              className={adminInput}
              value={content.sectionSubtitle}
              onChange={(e) => setContent((prev) => ({ ...prev, sectionSubtitle: e.target.value }))}
            />
          </div> */}
          {/* <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className={adminLabel}>Tiêu đề chính (Trên)</div>
              <input
                className={adminInput}
                value={content.mainTitleTop}
                onChange={(e) => setContent((prev) => ({ ...prev, mainTitleTop: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <div className={adminLabel}>Tiêu đề chính (Nổi bật)</div>
              <input
                className={adminInput}
                value={content.mainTitleHighlight}
                onChange={(e) => setContent((prev) => ({ ...prev, mainTitleHighlight: e.target.value }))}
              />
            </div>
          </div> */}
          <div className="space-y-2">
            <div className={adminLabel}>
              <ImageIcon className="mr-2 inline-block h-3 w-3 text-indigo-500" />
              Đường dẫn ảnh Mascot
            </div>
            <input
              className={adminInput}
              value={content.mascotImageUrl}
              onChange={(e) => setContent((prev) => ({ ...prev, mascotImageUrl: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {fixedBubbles.map((item, index) => (
            <div key={index} className="group relative rounded-[28px] border border-slate-100 bg-slate-50/30 p-6 transition-all hover:bg-slate-50">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-black font-mono text-indigo-600">
                  #{index + 1}
                </div>
                <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                  <Type className="h-4 w-4 text-indigo-500" />
                  Bong bóng {index + 1}
                </div>
              </div>

              <div className="space-y-2">
                <div className={adminLabel}>
                  <Type className="mr-2 inline-block h-3 w-3 text-indigo-500" />
                  Nội dung
                </div>
                <input className={adminInput} value={item} onChange={(e) => updateBubble(index, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
