import React from 'react';
import { RefreshCw, Save, Layout, Type, Sparkles, Box, Image as ImageIcon } from 'lucide-react';
import { painpointsDefault, type PainpointsContent, PAINPOINTS_DEFAULT_COUNT } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';

import robotMascotFallback from '../../../assets/nhanvat1.png';
import { resolveAssetUrl } from '../../../utils/assetUtil';

export default function PainpointsEditor() {
  const { content, setContent, isLoading, isSaving, error, lastSavedAt, reload, save } = useLandingSection<PainpointsContent>(
    ADMIN_SECTION_KEYS.painpoints,
    painpointsDefault,
  );

  const fixedBubbles = React.useMemo(() => {
    const normalized = [...content.bubbles].slice(0, PAINPOINTS_DEFAULT_COUNT);
    while (normalized.length < PAINPOINTS_DEFAULT_COUNT) {
      normalized.push(painpointsDefault.bubbles[normalized.length] || 'Nỗi lo mới');
    }
    return normalized;
  }, [content.bubbles]);

  const updateBubble = (index: number, value: string) => {
    setContent((prev) => ({
      ...prev,
      bubbles: prev.bubbles.map((item, i) => (i === index ? value : item)),
    }));
  };

  return (
    <div className="flex flex-col-reverse gap-8 ">
      <section className={adminCard}>
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              <Sparkles className="h-3 w-3" />
              Fixed Bubble Editor
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Pain <span className={adminAccentText}>Points</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
              Sửa tiêu đề, ảnh mascot và đúng 7 bong bóng text. Vị trí và kích thước được cố định theo giao diện.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => void reload()} className={adminSecondaryButton}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button onClick={() => void save({ ...content, bubbles: fixedBubbles })} disabled={isSaving} className={adminPrimaryButton}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Commit'}
            </button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
          <div className="rounded-md bg-slate-950 px-3 py-1">{ADMIN_SECTION_KEYS.painpoints}</div>
          {lastSavedAt ? (
            <div className="font-medium lowercase text-indigo-400/60">
              Session Snapshot: {new Date(lastSavedAt).toLocaleTimeString()}
            </div>
          ) : null}
        </div>

        {error ? <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-400">{error}</div> : null}

        <div className="grid gap-5">
          <div className="space-y-2">
            <div className={adminLabel}>Section Title</div>
            <input
              className={adminInput}
              value={content.sectionTitle}
              onChange={(e) => setContent((prev) => ({ ...prev, sectionTitle: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <div className={adminLabel}>Section Subtitle</div>
            <input
              className={adminInput}
              value={content.sectionSubtitle}
              onChange={(e) => setContent((prev) => ({ ...prev, sectionSubtitle: e.target.value }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className={adminLabel}>Main Title Top</div>
              <input
                className={adminInput}
                value={content.mainTitleTop}
                onChange={(e) => setContent((prev) => ({ ...prev, mainTitleTop: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <div className={adminLabel}>Main Title Highlight</div>
              <input
                className={adminInput}
                value={content.mainTitleHighlight}
                onChange={(e) => setContent((prev) => ({ ...prev, mainTitleHighlight: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className={adminLabel}>
              <ImageIcon className="mr-2 inline-block h-3 w-3 text-indigo-500" />
              Mascot Image URL
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
            <div key={`${index}-${item}`} className="group relative rounded-[28px] border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.05]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-900 text-xs font-black font-mono text-indigo-400">
                  #{index + 1}
                </div>
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <Type className="h-4 w-4 text-indigo-500" />
                  Bubble {index + 1}
                </div>
              </div>

              <div className="space-y-2">
                <div className={adminLabel}>
                  <Type className="mr-2 inline-block h-3 w-3 text-indigo-500" />
                  Content
                </div>
                <input className={adminInput} value={item} onChange={(e) => updateBubble(index, e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="space-y-8">
        <section className={adminCard}>
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              <Layout className="h-3 w-3" />
              Spatial Preview Engine
            </div>
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-slate-950 p-6 shadow-2xl">
            <div className="space-y-4 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.45em] text-slate-500">{content.sectionTitle}</div>
              <div className="text-[9px] font-black uppercase tracking-[0.35em] text-indigo-400/60">{content.sectionSubtitle}</div>
            </div>

            <div className="relative min-h-[500px] overflow-hidden rounded-[26px] bg-slate-900 border border-white/5 shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

              {fixedBubbles.map((item, index) => (
                <div
                  key={index}
                  className={`absolute flex items-center justify-center rounded-full bg-white/[0.03] px-4 text-center backdrop-blur-3xl transition-transform duration-1000 group-hover:scale-105 ${
                    [
                      'top-[5%] left-[18%] md:left-[22%] animate-float',
                      'top-[25%] left-[5%] md:left-[8%] animate-float-delayed',
                      'top-[5%] right-[18%] md:right-[22%] animate-float-slow',
                      'top-[30%] right-[5%] md:right-[8%] animate-float',
                      'top-[60%] left-[10%] md:left-[15%] animate-float-slow',
                      'top-[65%] right-[10%] md:right-[15%] animate-float-delayed',
                      '-top-[15%] left-1/2 -translate-x-1/2 animate-float-slow',
                    ][index]
                  } ${
                    [
                      'w-32 h-32 md:w-36 md:h-36',
                      'w-36 h-36 md:w-44 md:h-44',
                      'w-32 h-32 md:w-36 md:h-36',
                      'w-36 h-36 md:w-42 md:h-42',
                      'w-28 h-28 md:w-32 md:h-32',
                      'w-28 h-28 md:w-32 md:h-32',
                      'w-40 h-40 md:w-48 md:h-48',
                    ][index]
                  } border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.05)]`}
                >
                  <span className="text-[9px] font-black leading-tight tracking-tight text-white opacity-70 transition-opacity group-hover:opacity-100 md:text-xs">
                    {item}
                  </span>
                  <div className="absolute inset-0 rounded-full border border-indigo-500/10 transition-colors group-hover:border-indigo-500/30" />
                </div>
              ))}

              <div className="absolute bottom-[-50px] left-1/2 h-[180px] w-[240px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[80px]" />
              
              <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2">
                <div className="relative transform scale-[1.1]">
                  <img
                    src={resolveAssetUrl(content.mascotImageUrl || robotMascotFallback)}
                    alt="Mascot Preview"
                    className="w-[180px] rounded-full object-cover drop-shadow-[0_10px_30px_rgba(59,130,246,0.3)] opacity-80"
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 h-[200px] w-[180px] -translate-x-1/2 rounded-[100%_100%_0_0] border-t border-white/10 bg-white/[0.02]" />
            </div>

            <div className="relative z-10 mt-4 space-y-1 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600">
                <Box className="h-3 w-3 text-indigo-500" />
                Entity Registry
              </div>
              <div className="font-mono text-[9px] text-slate-500">Active Bubbles: 7 | Rendering: Hardware Accelerated</div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
