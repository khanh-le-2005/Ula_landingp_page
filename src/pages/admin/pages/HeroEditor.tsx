import React from 'react';
import { heroDefault } from '../adminData';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { useLandingSection } from '../hooks/useLandingSection';
import { RefreshCw, Save, Layout, Type, MousePointer2, Sparkles, MonitorSmartphone } from 'lucide-react';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';
import { ImageUploadField } from '../components/ImageUploadField';
import { flattenToFormData } from '../utils/formDataUtil';
import { resolveAssetUrl } from '../../../utils/assetUtil';

export default function HeroEditor() {
  const { content: hero, setContent: setHero, isLoading, isSaving, error, lastSavedAt, reload, save } = useLandingSection(
    ADMIN_SECTION_KEYS.hero,
    heroDefault,
  );

  const handleSave = async () => {
    // Nếu có bất kỳ trường nào là File, chúng ta cần gửi FormData
    const hasFiles = Object.values(hero).some(val => val instanceof File);
    
    if (hasFiles) {
      const formData = flattenToFormData(hero);
      await save(formData);
    } else {
      await save(hero);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-8">
        <section className={adminCard}>
          <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
                <Layout className="w-3 h-3" />
                Section Configuration
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Hero <span className={adminAccentText}>Module</span></h2>
              <p className="mt-4 text-slate-400 leading-relaxed text-sm max-w-xl">
                Configure the primary entry point of your landing page. Headline, imagery, and initial call-to-actions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void reload()}
                className={adminSecondaryButton}
              >
                <RefreshCw className="w-4 h-4" />
                Sync
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className={adminPrimaryButton}
              >
                {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                    <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Commit Changes'}
              </button>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2 rounded-full px-3 py-1 bg-white/5 border border-white/5 text-slate-400">
                <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                {isLoading ? 'Fetching Data' : 'Live Sync active'}
             </div>
             <div className="text-slate-700 bg-slate-950 px-2 py-1 rounded-md">{ADMIN_SECTION_KEYS.hero}</div>
             {lastSavedAt && (
                <div className="text-indigo-400/60 lowercase font-medium">Last saved: {new Date(lastSavedAt).toLocaleTimeString()}</div>
             )}
          </div>

          {error && (
            <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-400">
              <Sparkles className="inline-block w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
              <div className="space-y-3">
                <div className={adminLabel}>
                   <Sparkles className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                   Visual Badge
                </div>
                <input className={adminInput} value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} placeholder="e.g. 2024 UPDATE" />
              </div>
              <ImageUploadField 
                label="Hero Image / Media"
                value={hero.heroImageUrl}
                onChange={(val) => setHero({ ...hero, heroImageUrl: val })}
              />
            </div>

            <div className="space-y-4">
               <div className={adminLabel}>
                  <Type className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                  Orchestrated Headline
               </div>
               <div className="grid md:grid-cols-3 gap-4">
                  <input className={adminInput} value={hero.headlineTop} onChange={(e) => setHero({ ...hero, headlineTop: e.target.value })} placeholder="Prefix" />
                  <div className="relative">
                    <input className={`${adminInput} !border-indigo-500/30 !bg-indigo-500/5`} value={hero.headlineHighlight} onChange={(e) => setHero({ ...hero, headlineHighlight: e.target.value })} placeholder="Highlight" />
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-indigo-500 rounded-full blur-[2px] opacity-50" />
                  </div>
                  <input className={adminInput} value={hero.headlineBottom} onChange={(e) => setHero({ ...hero, headlineBottom: e.target.value })} placeholder="Suffix" />
               </div>
            </div>

            <div className="space-y-3">
              <div className={adminLabel}>Main Description</div>
              <textarea className={`${adminInput} min-h-[120px] resize-y leading-relaxed text-sm`} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className={adminLabel}>
                   <MousePointer2 className="inline-block w-3 h-3 mr-2 text-indigo-500" />
                   Primary Action
                </div>
                <input className={adminInput} value={hero.primaryCta} onChange={(e) => setHero({ ...hero, primaryCta: e.target.value })} />
              </div>
              <div className="space-y-3">
                <div className={adminLabel}>Secondary Action</div>
                <input className={adminInput} value={hero.secondaryCta} onChange={(e) => setHero({ ...hero, secondaryCta: e.target.value })} />
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-8">
        <section className={adminCard}>
          <div className="flex items-center justify-between gap-4 mb-6">
             <div className="text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 flex items-center gap-2">
                <MonitorSmartphone className="w-3 h-3" />
                Live Snapshot
             </div>
             <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </div>
          
          <div className="rounded-[28px] border border-white/5 bg-slate-950 p-1.5 overflow-hidden shadow-2xl">
              <div className="rounded-[24px] bg-slate-900 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80 pointer-events-none z-10" />
                  <img src={resolveAssetUrl(hero.heroImageUrl instanceof File ? URL.createObjectURL(hero.heroImageUrl) : hero.heroImageUrl)} alt="Hero preview" className="h-[240px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  
                  <div className="absolute inset-x-0 bottom-0 p-6 z-20">
                      <div className="inline-flex px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[9px] font-black text-white uppercase tracking-widest mb-3">
                        {hero.badge}
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight leading-tight">
                        {hero.headlineTop} <span className={adminAccentText}>{hero.headlineHighlight}</span> {hero.headlineBottom}
                      </h3>
                  </div>
              </div>
              <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {hero.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="h-9 px-4 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                        {hero.primaryCta}
                    </div>
                    <div className="h-9 px-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {hero.secondaryCta}
                    </div>
                  </div>
              </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
