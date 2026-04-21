import React from 'react';
import { Plus, Trash2, RefreshCw, Save, Gift, Timer, Type, Palette, Layout, MousePointer2 } from 'lucide-react';
import { luckyWheelDefault, type LuckyWheelPrize } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';

type LuckyWheelSection = {
  timerLabel: string;
  headline: string;
  description: string;
  prizes: LuckyWheelPrize[];
};

export default function LuckyWheelEditor() {
  const { content, setContent, isLoading, isSaving, error, lastSavedAt, reload, save } = useLandingSection<LuckyWheelSection>(
    ADMIN_SECTION_KEYS.luckyWheel,
    {
      timerLabel: 'Ưu đãi kết thúc sau: 00:59:59',
      headline: 'Vòng quay may mắn - Nhận quà cực khủng!',
      description: 'Chỉ cần đăng ký thông tin để nhận 01 lượt quay miễn phí với cơ hội trúng học bổng lên đến 50%.',
      prizes: luckyWheelDefault,
    },
  );

  const updatePrize = (index: number, patch: Partial<LuckyWheelPrize>) => {
    setContent((prev) => ({
      ...prev,
      prizes: prev.prizes.map((prize, i) => (i === index ? { ...prize, ...patch } : prize)),
    }));
  };

  const addPrize = () =>
    setContent((prev) => ({
      ...prev,
      prizes: [...prev.prizes, { option: 'Quà mới', backgroundColor: '#6366f1', textColor: '#ffffff', code: '' }],
    }));

  const removePrize = (index: number) =>
    setContent((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }));

  return (
    <div className="flex flex-col-reverse gap-8 ">
      <section className={adminCard}>
        <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
              <Gift className="w-3 h-3" />
              Công cụ Ưu đãi
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Vòng quay <span className={adminAccentText}>May mắn</span></h2>
            <p className="mt-4 text-slate-500 leading-relaxed text-sm max-w-xl">
               Quản lý phần thưởng, các biểu mẫu game hóa và tiêu đề quảng bá cho phần vòng quay may mắn.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void reload()} className={adminSecondaryButton}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Đồng bộ
            </button>
            <button onClick={() => void save(content)} disabled={isSaving} className={adminPrimaryButton}>
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button onClick={addPrize} className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-6 py-3 text-sm font-black text-indigo-600 hover:bg-indigo-500/20 transition-all">
              <Plus className="w-4 h-4" />
              Thêm phần thưởng
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
           <div className="bg-white border border-slate-200 px-3 py-1 rounded-md">{ADMIN_SECTION_KEYS.luckyWheel}</div>
           {lastSavedAt && (
             <div className="text-slate-400 lowercase font-medium">Tự động đồng bộ: {new Date(lastSavedAt).toLocaleTimeString()}</div>
           )}
        </div>

        {error ? <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-400">{error}</div> : null}

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* <div className="space-y-3">
              <div className={adminLabel}>
                 <Timer className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                 Nhãn đếm ngược
              </div>
              <input className={adminInput} value={content.timerLabel} onChange={(e) => setContent((prev) => ({ ...prev, timerLabel: e.target.value }))} />
            </div> */}
            <div className="space-y-3">
              <div className={adminLabel}>
                 <Type className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                 Tiêu đề mục
              </div>
              <input className={adminInput} value={content.headline} onChange={(e) => setContent((prev) => ({ ...prev, headline: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-3">
            <div className={adminLabel}>Mô tả game hóa</div>
            <textarea className={`${adminInput} min-h-[120px] leading-relaxed text-sm`} value={content.description} onChange={(e) => setContent((prev) => ({ ...prev, description: e.target.value }))} />
          </div>

          <div className="space-y-4">
             <div className={adminLabel}>Danh mục phần thưởng</div>
             <div className="grid gap-4">
                {content.prizes.map((prize, index) => (
                    <div key={index} className="group relative rounded-[28px] border border-slate-200 bg-slate-50/30 p-5 hover:bg-slate-50 transition-all">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-indigo-600 font-mono">
                                    #{index + 1}
                                </div>
                                <div className="text-sm font-black text-slate-900">Cấu hình Phần thưởng</div>
                            </div>
                            <button onClick={() => removePrize(index)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all border border-rose-200">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase tracking-widest font-black text-slate-400">Tên phần quà</div>
                                <input className={`${adminInput} !py-2.5 !text-xs`} value={prize.option} onChange={(e) => updatePrize(index, { option: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase tracking-widest font-black text-slate-400">Màu nền</div>
                                <div className="flex gap-2">
                                    <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: prize.backgroundColor }} />
                                    <input className={`${adminInput} !py-2.5 !text-xs !font-mono`} value={prize.backgroundColor} onChange={(e) => updatePrize(index, { backgroundColor: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase tracking-widest font-black text-slate-400">Màu chữ</div>
                                <div className="flex gap-2">
                                    <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: prize.textColor }} />
                                    <input className={`${adminInput} !py-2.5 !text-xs !font-mono`} value={prize.textColor} onChange={(e) => updatePrize(index, { textColor: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase tracking-widest font-black text-slate-400">Tỉ lệ trúng (Weight)</div>
                                <div className="relative group/prob">
                                  <input 
                                    type="text"
                                    className={`${adminInput} !py-2.5 !text-xs !font-mono pr-12`} 
                                    value={prize.probability || 0} 
                                    min = "0"
                                    onChange={(e) => updatePrize(index, { probability: Number(e.target.value) })} 
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-600">
                                    {Math.round(((prize.probability || 0) / (content.prizes.reduce((sum, p) => sum + (p.probability || 0), 0) || 1)) * 100)}%
                                  </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase tracking-widest font-black text-slate-400">Mã trúng thưởng (Code)</div>
                                <input className={`${adminInput} !py-2.5 !text-xs !font-mono`} value={prize.code} onChange={(e) => updatePrize(index, { code: e.target.value })} />
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      <section className={adminCard}>
        <div className="flex items-center justify-between gap-4 mb-8">
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 flex items-center gap-2">
                <Layout className="w-3 h-3" />
                Khung xem trước trực tiếp
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                Đang hiển thị
            </div>
        </div>
        
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black tracking-[0.2em] text-amber-600">
            <Timer className="w-3 h-3" />
            {content.timerLabel}
          </div>
          
          <div className="space-y-4">
             <h3 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">{content.headline}</h3>
             <p className="text-sm text-slate-500 leading-relaxed font-medium">{content.description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="h-12 px-6 rounded-full bg-slate-900 flex items-center justify-center text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-slate-900/10">
                Nhận quà ngay
            </div>
            <div className="h-12 px-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-600 uppercase tracking-widest">
                Xem chính sách
            </div>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-4">
            {content.prizes.map((prize, index) => (
              <div 
                key={index} 
                className="group relative h-20 rounded-[24px] p-4 flex items-center justify-center text-center font-black text-xs uppercase tracking-widest shadow-md transition-transform hover:scale-102" 
                style={{ backgroundColor: prize.backgroundColor, color: prize.textColor }}
              >
                <div className="absolute inset-x-2 top-2 h-1 bg-white/20 rounded-full blur-[1px]" />
                {prize.option}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
             <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3 text-indigo-500" />
                Thông số động cơ
             </div>
             <div className="text-[9px] font-mono text-slate-400">Tổng phần thưởng: {content.prizes.length} | RNG Seed: Đang hoạt động</div>
          </div>
        </div>
      </section>
    </div>
  );
}
