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
      cards: prev.cards.map((c, i) => (i === index ? { ...c, ...updates } : c)),
    }));
  };

  const handleSave = async () => {
    const formData = flattenToFormData(content);
    await save(formData);
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
      <div className="space-y-8">
        {/* Main Card Editor */}
        <section className={adminCard}>
          <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Process Architecture
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">
                Methodology <span className={adminAccentText}>Designer</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
                Configure the learn-to-earn methodology process. Manage the main showcase card and the 4 process nodes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => void reload()} className={adminSecondaryButton}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Sync
              </button>
              <button onClick={handleSave} disabled={isSaving} className={adminPrimaryButton}>
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Commit Changes'}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-8">
              <div className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                <Layout className="h-4 w-4" />
                Primary Showcase Card
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className={adminLabel}>Process ID / Number</div>
                    <input className={adminInput} value={content.mainCard.number} onChange={(e) => updateMainCard({ number: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <div className={adminLabel}>Main Heading</div>
                    <input className={adminInput} value={content.mainCard.title} onChange={(e) => updateMainCard({ title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <div className={adminLabel}>Subheading (Meta)</div>
                    <input className={adminInput} value={content.mainCard.subTitle} onChange={(e) => updateMainCard({ subTitle: e.target.value })} />
                  </div>
                </div>
                <ImageUploadField 
                  label="Showcase Asset"
                  value={content.mainCard.imgSrc}
                  onChange={(val) => updateMainCard({ imgSrc: val as any })}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {content.cards.map((card, index) => (
                <div key={index} className="group relative rounded-3xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04]">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-slate-900 text-[10px] font-black font-mono text-indigo-500">
                      0{index + 1}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white">Process Node {index + 1}</div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <div className={adminLabel}>Node Title</div>
                       <input className={adminInput} value={card.title} onChange={(e) => updateCard(index, { title: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                       <div className={adminLabel}>Description</div>
                       <input className={adminInput} value={card.subTitle} onChange={(e) => updateCard(index, { subTitle: e.target.value })} />
                    </div>
                    <ImageUploadField 
                      label="Node Icon/Image"
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

      <aside className="space-y-8">
        <section className={adminCard}>
           <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">
                 <Box className="h-3 w-3" />
                 Spatial Preview
              </div>
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
           </div>

           <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-slate-950 p-6 shadow-2xl">
              <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 aspect-video">
                 <img src={resolveAssetUrl(content.mainCard.imgSrc)} className="h-full w-full object-cover opacity-70" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent flex items-end p-6">
                    <div>
                        <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">{content.mainCard.number}</div>
                        <h4 className="text-sm font-black text-white">{content.mainCard.title}</h4>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 {content.cards.map((card, i) => (
                    <div key={i} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                        <div className="h-12 w-full rounded-lg overflow-hidden bg-slate-900 border border-white/5 mb-2">
                           <img src={resolveAssetUrl(card.imgSrc)} className="h-full w-full object-cover" />
                        </div>
                        <div className="text-[9px] font-black text-white truncate">{card.title}</div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="mt-6 rounded-2xl bg-indigo-500/5 p-4 border border-indigo-500/10">
              <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
                 Changes here are synced via the <span className="text-indigo-400">Cyber-Sync Pipeline</span>. Ensure all media assets are accessible.
              </p>
           </div>
        </section>
      </aside>
    </div>
  );
}
