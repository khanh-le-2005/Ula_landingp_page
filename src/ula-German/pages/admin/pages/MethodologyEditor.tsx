import React from 'react';
import { toast } from 'react-toastify'; // 👉 Thêm Toastify
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

  // Kỹ thuật rửa ảnh (Image Protection)
  const cleanImageField = (imageUrl: any) => {
    const isNewFile = imageUrl instanceof File;
    const isOldValidUrl = typeof imageUrl === 'string' &&
                          imageUrl.trim() !== '' &&
                          imageUrl !== 'null' &&
                          !imageUrl.includes('[object Object]');
    
    // Nếu là file mới hoặc chuỗi url xịn -> Giữ lại gửi đi
    if (isNewFile || isOldValidUrl) return imageUrl;
    
    // Nếu rỗng, null -> Trả về undefined để lát nữa dùng lệnh xóa (delete)
    return undefined;
  };

  const handleSave = async () => {
    // Validation
    if (!content.mainCard?.title?.trim() && content.mainCard?.title !== '\u200B') {
      toast.warning('⚠️ Vui lòng nhập Tiêu đề chính cho thẻ trưng bày!');
      return;
    }

    try {
      // 1. Tạo bản sao để "rửa" dữ liệu
      const cleanContent = { ...content };

      // 2. KỸ THUẬT KÝ TỰ TÀNG HÌNH (\u200B) CHO MAIN CARD
      if (cleanContent.mainCard) {
        cleanContent.mainCard.number = cleanContent.mainCard.number?.trim() === '' ? '\u200B' : cleanContent.mainCard.number;
        cleanContent.mainCard.title = cleanContent.mainCard.title?.trim() === '' ? '\u200B' : cleanContent.mainCard.title;
        cleanContent.mainCard.subTitle = cleanContent.mainCard.subTitle?.trim() === '' ? '\u200B' : cleanContent.mainCard.subTitle;
        
        // Rửa ảnh Main Card
        const cleanMainImg = cleanImageField(cleanContent.mainCard.imgSrc);
        if (cleanMainImg === undefined) {
          delete cleanContent.mainCard.imgSrc;
        } else {
          cleanContent.mainCard.imgSrc = cleanMainImg;
        }
      }

      // 3. KỸ THUẬT KÝ TỰ TÀNG HÌNH & RỬA ẢNH CHO CÁC CARDS NHỎ
      if (Array.isArray(cleanContent.cards)) {
        cleanContent.cards = cleanContent.cards.map(card => {
          const newCard = { ...card };
          newCard.number = newCard.number?.trim() === '' ? '\u200B' : newCard.number;
          newCard.title = newCard.title?.trim() === '' ? '\u200B' : newCard.title;
          newCard.subTitle = newCard.subTitle?.trim() === '' ? '\u200B' : newCard.subTitle;

          // Rửa ảnh từng Card nhỏ
          const cleanSubImg = cleanImageField(newCard.imgSrc);
          if (cleanSubImg === undefined) {
            delete newCard.imgSrc;
          } else {
            newCard.imgSrc = cleanSubImg;
          }

          return newCard;
        });
      }

      // 4. Gửi dữ liệu
      const formData = flattenToFormData(cleanContent);
      await save(formData);

      toast.success('Đã lưu thay đổi Phương pháp đào tạo thành công!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi lưu phương pháp đào tạo!');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
              {lastSavedAt && (
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Tự động đồng bộ: {new Date(lastSavedAt).toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => {
                  void reload();
                  toast.info('Đang làm mới dữ liệu...');
                }} 
                className={adminSecondaryButton}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Đồng bộ
              </button>
              <button onClick={handleSave} disabled={isSaving} className={adminPrimaryButton}>
                <Save className={`h-4 w-4 ${isSaving ? 'animate-bounce' : ''}`} />
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* THẺ CHÍNH LỚN BÊN TRÁI */}
            <div className="rounded-3xl border border-indigo-200 bg-indigo-50/50 p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600">
                <Layout className="h-4 w-4" />
                Thẻ Trưng bày chính
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className={adminLabel}>ID / Số thứ tự quy trình</div>
                    <input 
                      className={adminInput} 
                      value={content.mainCard?.number === '\u200B' ? '' : (content.mainCard?.number || '')} 
                      onChange={(e) => updateMainCard({ number: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className={adminLabel}>Tiêu đề chính <span className="text-rose-500">*</span></div>
                    <input 
                      className={`${adminInput} ${!content.mainCard?.title?.trim() && content.mainCard?.title !== '\u200B' ? 'border-rose-100 bg-rose-50/30' : ''}`} 
                      value={content.mainCard?.title === '\u200B' ? '' : (content.mainCard?.title || '')} 
                      onChange={(e) => updateMainCard({ title: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <div className={adminLabel}>Tiêu đề phụ (Meta)</div>
                    <input 
                      className={adminInput} 
                      value={content.mainCard?.subTitle === '\u200B' ? '' : (content.mainCard?.subTitle || '')} 
                      onChange={(e) => updateMainCard({ subTitle: e.target.value })} 
                    />
                  </div>
                </div>
                <ImageUploadField
                  label="Ảnh Trưng bày - 1280 x 720 px tỷ lệ 16:9"
                  value={content.mainCard?.imgSrc}
                  onChange={(val) => updateMainCard({ imgSrc: val as any })}
                />
              </div>
            </div>

            {/* CÁC THẺ NHỎ (4 Ô BÊN PHẢI) */}
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
                      <input 
                        className={adminInput} 
                        value={card.number === '\u200B' ? '' : (card.number || '')} 
                        onChange={(e) => updateCard(index, { number: e.target.value })} 
                        placeholder="Vd: Ô 2: VIDEO" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className={adminLabel}>Tiêu đề Nút</div>
                      <input 
                        className={adminInput} 
                        value={card.title === '\u200B' ? '' : (card.title || '')} 
                        onChange={(e) => updateCard(index, { title: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className={adminLabel}>Mô tả</div>
                      <input 
                        className={adminInput} 
                        value={card.subTitle === '\u200B' ? '' : (card.subTitle || '')} 
                        onChange={(e) => updateCard(index, { subTitle: e.target.value })} 
                      />
                    </div>
                    <ImageUploadField
                      label="Biểu tượng/Ảnh Nút - 1200 x 900 px tỷ lệ 4:3"
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