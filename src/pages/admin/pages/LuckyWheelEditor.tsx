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
      prizes: [...prev.prizes, { option: 'Quà mới', backgroundColor: '#6366f1', textColor: '#ffffff' }],
    }));

  const removePrize = (index: number) =>
    setContent((prev) => ({
      ...prev,
      prizes: prev.prizes.filter((_, i) => i !== index),
    }));

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.95fr]">
      <section className={adminCard}>
        <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
              <Gift className="w-3 h-3" />
              Incentive Engine
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Lucky <span className={adminAccentText}>Wheel</span></h2>
            <p className="mt-4 text-slate-400 leading-relaxed text-sm max-w-xl">
               Manage rewards, gamification triggers, and promotional headlines for the lucky wheel section.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void reload()} className={adminSecondaryButton}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button onClick={() => void save(content)} disabled={isSaving} className={adminPrimaryButton}>
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Commit'}
            </button>
            <button onClick={addPrize} className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-6 py-3 text-sm font-black text-indigo-400 hover:bg-indigo-500/20 transition-all">
              <Plus className="w-4 h-4" />
              New Prize
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
           <div className="bg-slate-950 px-3 py-1 rounded-md">{ADMIN_SECTION_KEYS.luckyWheel}</div>
           {lastSavedAt && (
             <div className="text-indigo-400/60 lowercase font-medium">Auto-sync: {new Date(lastSavedAt).toLocaleTimeString()}</div>
           )}
        </div>

        {error ? <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-400">{error}</div> : null}

        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className={adminLabel}>
                 <Timer className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                 Countdown Label
              </div>
              <input className={adminInput} value={content.timerLabel} onChange={(e) => setContent((prev) => ({ ...prev, timerLabel: e.target.value }))} />
            </div>
            <div className="space-y-3">
              <div className={adminLabel}>
                 <Type className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                 Section Headline
              </div>
              <input className={adminInput} value={content.headline} onChange={(e) => setContent((prev) => ({ ...prev, headline: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-3">
            <div className={adminLabel}>Gamification Description</div>
            <textarea className={`${adminInput} min-h-[120px] leading-relaxed text-sm`} value={content.description} onChange={(e) => setContent((prev) => ({ ...prev, description: e.target.value }))} />
          </div>

          <div className="space-y-4">
             <div className={adminLabel}>Prize Matrix</div>
             <div className="grid gap-4">
                {content.prizes.map((prize, index) => (
                    <div key={`${prize.option}-${index}`} className="group relative rounded-[28px] border border-white/5 bg-white/[0.02] p-5 hover:bg-white/[0.05] transition-all">
                        <div className="flex items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-xs font-black text-indigo-400 font-mono">
                                    #{index + 1}
                                </div>
                                <div className="text-sm font-black text-white">Reward Configuration</div>
                            </div>
                            <button onClick={() => removePrize(index)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/10">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase tracking-widest font-black text-slate-600">Label</div>
                                <input className={`${adminInput} !py-2.5 !text-xs`} value={prize.option} onChange={(e) => updatePrize(index, { option: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase tracking-widest font-black text-slate-600">Fill Color</div>
                                <div className="flex gap-2">
                                    <div className="h-10 w-10 shrink-0 rounded-xl border border-white/10" style={{ backgroundColor: prize.backgroundColor }} />
                                    <input className={`${adminInput} !py-2.5 !text-xs !font-mono`} value={prize.backgroundColor} onChange={(e) => updatePrize(index, { backgroundColor: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-[9px] uppercase tracking-widest font-black text-slate-600">Text Contrast</div>
                                <div className="flex gap-2">
                                    <div className="h-10 w-10 shrink-0 rounded-xl border border-white/10" style={{ backgroundColor: prize.textColor }} />
                                    <input className={`${adminInput} !py-2.5 !text-xs !font-mono`} value={prize.textColor} onChange={(e) => updatePrize(index, { textColor: e.target.value })} />
                                </div>
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
            <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 flex items-center gap-2">
                <Layout className="w-3 h-3" />
                Live Preview Frame
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                Active Rendering
            </div>
        </div>
        
        <div className="rounded-[32px] border border-white/5 bg-slate-950 p-6 shadow-2xl space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black tracking-[0.2em] text-amber-500">
            <Timer className="w-3 h-3" />
            {content.timerLabel}
          </div>
          
          <div className="space-y-4">
             <h3 className="text-3xl font-black text-white leading-tight tracking-tight">{content.headline}</h3>
             <p className="text-sm text-slate-400 leading-relaxed font-medium">{content.description}</p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="h-12 px-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-xs font-black text-white uppercase tracking-widest shadow-xl shadow-indigo-500/20">
                Claim Reward
            </div>
            <div className="h-12 px-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-slate-300 uppercase tracking-widest">
                View Policy
            </div>
          </div>

          <div className="pt-8 grid grid-cols-2 gap-4">
            {content.prizes.map((prize, index) => (
              <div 
                key={index} 
                className="group relative h-20 rounded-[24px] p-4 flex items-center justify-center text-center font-black text-xs uppercase tracking-widest shadow-lg transition-transform hover:scale-102" 
                style={{ backgroundColor: prize.backgroundColor, color: prize.textColor }}
              >
                <div className="absolute inset-x-2 top-2 h-1 bg-white/20 rounded-full blur-[1px]" />
                {prize.option}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
             <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Palette className="w-3 h-3 text-indigo-500" />
                Engine Metrics
             </div>
             <div className="text-[9px] font-mono text-slate-500">Total Prizes: {content.prizes.length} | RNG Seed: Active</div>
          </div>
        </div>
      </section>
    </div>
  );
}
