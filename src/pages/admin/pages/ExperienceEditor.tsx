import React, { useState } from 'react';
import { RefreshCw, Save, Brain, Layout, Plus, Trash2, Type, Image as ImageIcon, CheckCircle2, ListFilter } from 'lucide-react';
import { experienceDefault, type ExperienceContent, type ExperienceQuiz } from '../adminData';
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

  const [activeQuizId, setActiveQuizId] = useState<number | null>(null);

  const addQuiz = () => {
    const newQuiz: ExperienceQuiz = {
      id: Date.now(),
      word: 'New Quiz Item',
      correctAnswer: 'A',
      explanation: '',
      options: [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
      ],
      imageUrl: '',
    };
    setContent(prev => ({ ...prev, quizzes: [...prev.quizzes, newQuiz] }));
    setActiveQuizId(newQuiz.id);
  };

  const removeQuiz = (id: number) => {
    setContent(prev => ({ ...prev, quizzes: prev.quizzes.filter(q => q.id !== id) }));
    if (activeQuizId === id) setActiveQuizId(null);
  };

  const handleSave = async () => {
    const formData = flattenToFormData(content);
    await save(formData);
  };

  const updateQuiz = (id: number, updates: Partial<ExperienceQuiz>) => {
    setContent(prev => ({
      ...prev,
      quizzes: prev.quizzes.map(q => q.id === id ? { ...q, ...updates } : q)
    }));
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
      <section className={adminCard}>
        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
              <Brain className="h-3 w-3 text-indigo-500" />
              Cyber-Learning Desk
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Experience <span className={adminAccentText}>Editor</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
              Quản lý các bài tập tương tác (MCQ và Matching). Hỗ trợ tải ảnh minh họa qua AI Pipeline.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => void reload()} className={adminSecondaryButton}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <button onClick={handleSave} disabled={isSaving} className={adminPrimaryButton}>
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Commit'}
            </button>
          </div>
        </div>

        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className={adminLabel}>Quizzes Count: {content.quizzes.length}</div>
          </div>
          <button onClick={addQuiz} className="flex items-center gap-2 rounded-xl bg-indigo-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500/20 transition-all">
            <Plus className="h-3 w-3" /> Add Question
          </button>
        </div>

        <div className="space-y-4">
          {content.quizzes.map((quiz, index) => (
            <div key={quiz.id} className={`group relative rounded-3xl border transition-all ${activeQuizId === quiz.id ? 'border-indigo-500/40 bg-indigo-500/5 shadow-2xl shadow-indigo-500/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] p-4'}`}>
              <div className="flex items-center justify-between gap-4 p-4 pr-12 cursor-pointer" onClick={() => setActiveQuizId(activeQuizId === quiz.id ? null : quiz.id)}>
                <div className="flex items-center gap-4">
                   <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 border border-white/5 text-xs font-black text-indigo-400">
                      {index + 1}
                   </div>
                   <div>
                      <div className="text-xs font-black text-white">{quiz.type === 'matching' ? '[MATCHING]' : '[MCQ]'}</div>
                      <div className="text-sm font-medium text-slate-400 truncate max-w-[300px]">{quiz.word || 'Untitled Quiz'}</div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   {quiz.imageUrl && <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10"><img src={resolveAssetUrl(quiz.imageUrl)} className="h-full w-full object-cover" /></div>}
                </div>
              </div>

              <button onClick={(e) => { e.stopPropagation(); removeQuiz(quiz.id); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="h-4 w-4" />
              </button>

              {activeQuizId === quiz.id && (
                <div className="space-y-6 border-t border-white/5 p-6 animate-fade-in">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <div className={adminLabel}>Quiz Type</div>
                          <select 
                            className={adminInput}
                            value={quiz.type || 'mcq'}
                            onChange={(e) => updateQuiz(quiz.id, { type: e.target.value as any })}
                          >
                            <option value="mcq">Multiple Choice</option>
                            <option value="matching">Matching Pairs</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <div className={adminLabel}>Main Description / Question</div>
                          <textarea 
                            className={`${adminInput} min-h-[100px]`} 
                            value={quiz.word} 
                            onChange={(e) => updateQuiz(quiz.id, { word: e.target.value })}
                          />
                       </div>
                    </div>
                    <ImageUploadField 
                      label="Quiz Pedagogy Media"
                      value={quiz.imageUrl || ''}
                      onChange={(val) => updateQuiz(quiz.id, { imageUrl: val as any })}
                    />
                  </div>

                  {quiz.type === 'matching' ? (
                     <div className="space-y-4 rounded-2xl bg-slate-950/50 p-6 border border-white/5">
                        <div className={adminLabel}>Pairs Configuration (German - Vietnamese)</div>
                        {quiz.pairs?.map((pair, pIdx) => (
                           <div key={pIdx} className="grid grid-cols-2 gap-3">
                              <input className={adminInput} value={pair.de} onChange={(e) => {
                                 const nextPairs = [...(quiz.pairs || [])];
                                 nextPairs[pIdx].de = e.target.value;
                                 updateQuiz(quiz.id, { pairs: nextPairs });
                              }} />
                              <input className={adminInput} value={pair.vi} onChange={(e) => {
                                 const nextPairs = [...(quiz.pairs || [])];
                                 nextPairs[pIdx].vi = e.target.value;
                                 updateQuiz(quiz.id, { pairs: nextPairs });
                              }} />
                           </div>
                        ))}
                     </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className={adminLabel}>Options & Correct Answer</div>
                        <div className="space-y-3">
                           {quiz.options?.map((opt, oIdx) => (
                              <div key={opt.id} className="flex items-center gap-3">
                                 <input 
                                   type="radio" 
                                   name={`correct-${quiz.id}`} 
                                   checked={quiz.correctAnswer === opt.id}
                                   onChange={() => updateQuiz(quiz.id, { correctAnswer: opt.id })}
                                 />
                                 <input 
                                   className={adminInput} 
                                   value={opt.text} 
                                   onChange={(e) => {
                                     const nextOpts = [...(quiz.options || [])];
                                     nextOpts[oIdx].text = e.target.value;
                                     updateQuiz(quiz.id, { options: nextOpts });
                                   }}
                                 />
                              </div>
                           ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                         <div className={adminLabel}>Correct Explanation</div>
                         <textarea 
                           className={`${adminInput} min-h-[140px]`}
                           value={quiz.explanation}
                           onChange={(e) => updateQuiz(quiz.id, { explanation: e.target.value })}
                         />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <aside className="space-y-8">
        <section className={adminCard}>
           <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500">
                 <ListFilter className="h-3 w-3" />
                 Simulation Engine
              </div>
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
           </div>

           <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-950 p-6">
              <div className="space-y-6">
                {content.quizzes.map((quiz, i) => (
                  <div key={quiz.id} className="rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                     <div className="flex items-center gap-3 mb-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-black text-white">Item #{i + 1} Preview</span>
                     </div>
                     <p className="text-[11px] text-slate-400 italic mb-4">"{quiz.word}"</p>
                     {quiz.imageUrl && (
                        <div className="h-32 w-full rounded-xl overflow-hidden border border-white/10 mb-4 shadow-inner">
                           <img src={resolveAssetUrl(quiz.imageUrl)} className="h-full w-full object-cover" />
                        </div>
                     )}
                  </div>
                ))}
              </div>
           </div>
        </section>
      </aside>
    </div>
  );
}
