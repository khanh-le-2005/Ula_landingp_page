import React, { useState } from 'react';
import { Mic, BookOpen, PlayCircle, Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import MatchingExercise from '../Auxiliary/MatchingExercise';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { experienceDefault } from '../pages/admin/adminData';
import { resolveAssetUrl } from '../utils/assetUtil';

const Experience = () => {
  const { content, isLoading } = useLandingSection(ADMIN_SECTION_KEYS.experience, experienceDefault);
  const [activeTab, setActiveTab] = useState<'pronounce' | 'quiz' | 'video'>('quiz');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isMatchingCorrect, setIsMatchingCorrect] = useState(false);

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-48 bg-slate-200 rounded-2xl"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-xl"></div>
        </div>
      </section>
    );
  }

  const { quizzes, sectionTitle, sectionSubtitle } = content;
  const currentQuiz = quizzes[currentIdx] || quizzes[0];
  const isLastQuestion = currentIdx === quizzes.length - 1;
  const totalQuestions = quizzes.length;

  const handleCheck = () => {
    if (!selectedOption) return;

    if (currentQuiz.type === 'matching') {
      if (isMatchingCorrect) setStatus('correct');
      else setStatus('wrong');
    } else {
      if (selectedOption === currentQuiz.correctAnswer) setStatus('correct');
      else setStatus('wrong');
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setCurrentIdx(0);
    } else {
      setCurrentIdx(prev => prev + 1);
    }
    resetState();
  };

  const resetState = () => {
    setSelectedOption(null);
    setStatus('idle');
  };

  const handleRetry = () => {
    resetState();
  };

  return (
    <section id="experience" className=" flex flex-col items-center py-12 px-4 font-sans relative overflow-hidden reveal">

      {/* 1. Header & Title */}
      <div className="text-center mb-10 relative z-10 animate-fade-in-up">
        <h2 className="text-xl md:text-[16px] font-black text-[#1a2b48] uppercase tracking-tight mt-10">{sectionTitle}</h2>
        <h3 className="text-xl md:text-4xl font-bold text-[#b59449] italic mt-1">{sectionSubtitle}</h3>
      </div>

      {/* 2. Tab Navigation */}
      <div className="grid grid-cols-2 gap-3 md:flex md:justify-center bg-white/30 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-white mb-8 md:mb-12">

        {/* Button 1 */}
        <button
          onClick={() => setActiveTab('pronounce')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === 'pronounce'
            ? 'bg-black text-white shadow-md'
            : 'text-slate-500'
            }`}
        >
          <Mic size={14} />
          AI sửa phát âm
        </button>

        {/* Button 2 */}
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === 'quiz'
            ? 'bg-[#005bb7] text-white shadow-md'
            : 'text-slate-500'
            }`}
        >
          <BookOpen size={14} />
          Demo bài tập
        </button>

        {/* Button 3 (center dưới) */}
        <button
          onClick={() => setActiveTab('video')}
          className={`col-span-2 mx-auto w-fit flex items-center justify-center gap-2 px-6 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === 'video'
            ? 'bg-[#005bb7] text-white shadow-md'
            : 'text-slate-500'
            }`}
        >
          <PlayCircle size={14} />
          Video học thử
        </button>

      </div>

      {/* 3. Main Card Container */}
      <div className="w-full max-w-5xl bg-white/60 backdrop-blur-2xl rounded-[32px] md:rounded-[40px] overflow-hidden min-h-[50px] md:min-h-[600px] flex flex-col relative z-10 reveal">

        {/* Progress & Content Wrapper */}
        <div className="flex-grow flex flex-col">

          {/* NỘI DUNG TAB: DEMO BÀI TẬP */}
          {activeTab === 'quiz' && (
            <>
              <div className="p-8 pb-0 flex justify-between items-start">
                <span className="text-slate-400 font-bold text-sm">Câu hỏi {currentIdx + 1}/{totalQuestions}</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#005bb7] transition-all duration-500" style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tiến trình học tập</span>
                </div>
              </div>

              <div className="p-6 md:p-14 flex-grow flex items-center text-center">
                <div className="w-full">
                  {currentQuiz.type === 'matching' ? (
                    <MatchingExercise
                      key={currentIdx}
                      data={currentQuiz as any}
                      isChecked={status !== 'idle'}
                      onResult={(isCorrect: boolean, currentConns: any) => {
                        setIsMatchingCorrect(isCorrect);
                        if (currentConns.length === (currentQuiz.pairs?.length || 0)) {
                          setSelectedOption("full");
                        } else {
                          setSelectedOption(null);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                      <div className="w-full bg-white rounded-[24px] md:rounded-[35px] p-4 md:p-6 shadow-xl border border-slate-100 relative group aspect-[4/3] flex items-center justify-center overflow-hidden">
                        <img src={resolveAssetUrl(currentQuiz.imageUrl)} className="w-full h-full object-cover rounded-2xl opacity-90" alt="Quiz" />
                        <button className="absolute w-16 h-16 bg-[#005bb7] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform">
                          <Volume2 size={28} />
                        </button>
                      </div>

                      <div className="w-full flex flex-col gap-3 md:gap-4 text-left">
                        <h4 className="text-2xl md:text-4xl font-black text-[#1a2b48] mb-4 md:mb-6">{currentQuiz.word}</h4>
                        {currentQuiz.options?.map((opt: any) => {
                          const isCorrectOption = opt.id === currentQuiz.correctAnswer;
                          let borderStyle = "border-slate-100 bg-white";
                          if (selectedOption === opt.id) borderStyle = "border-[#005bb7] bg-blue-50/50";
                          if (status === 'correct' && isCorrectOption) borderStyle = "border-green-500 bg-green-50/50";
                          if (status === 'wrong' && opt.id === selectedOption) borderStyle = "border-red-500 bg-red-50/50";

                          return (
                            <button
                              key={opt.id}
                              disabled={status === 'correct'}
                              onClick={() => { setSelectedOption(opt.id); setStatus('idle'); }}
                              className={`flex items-center p-3 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all text-left group ${borderStyle}`}
                            >
                              <span className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-bold mr-3 md:mr-4 transition-colors ${(status === 'correct' && isCorrectOption) ? 'bg-green-500 text-white' :
                                (status === 'wrong' && opt.id === selectedOption) ? 'bg-red-500 text-white' :
                                  selectedOption === opt.id ? 'bg-[#005bb7] text-white' : 'bg-slate-100 text-slate-400'
                                }`}>{opt.id}</span>
                              <span className="font-bold text-slate-700 text-base md:text-lg">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-10 py-10 bg-white/60 border-t border-white/60">
                {status === 'idle' && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleCheck}
                      disabled={!selectedOption}
                      className={`w-full sm:px-16 px-4 py-4 rounded-full font-black uppercase text-sm tracking-[0.1em] transition-all shadow-lg ${selectedOption ? 'bg-[#005bb7] text-white hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      Kiểm tra kết quả
                    </button>
                  </div>
                )}

                {status === 'correct' && (
                  <div className="w-full bg-white/30 border border-green-200 rounded-[2.5rem] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">

                    {/* Left content */}
                    <div className="flex items-center gap-4 sm:gap-5 text-left">
                      <div className="bg-white rounded-full p-2 text-green-500 shadow-sm border border-green-100 shrink-0">
                        <CheckCircle2 size={24} className="text-green-500" />
                      </div>

                      <div>
                        <h5 className="text-green-800 font-black text-base sm:text-lg">
                          Chính xác!
                        </h5>
                        <p className="text-green-700 font-medium opacity-80 text-sm sm:text-base">
                          {currentQuiz.explanation || 'Bạn đã nối đúng tất cả các cặp từ!'}
                        </p>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-green-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      Tiếp tục <ArrowRight size={18} />
                    </button>

                  </div>
                )}

                {status === 'wrong' && (
                  <div className="w-full bg-white/30 border border-red-200 rounded-[2.5rem] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">

                    {/* Left content */}
                    <div className="flex items-center gap-4 sm:gap-5 text-left">
                      <div className="bg-white rounded-full p-2 text-red-500 shadow-sm border border-red-100 shrink-0">
                        <XCircle size={24} className="text-red-500" />
                      </div>

                      <div>
                        <h5 className="text-red-800 font-black text-base sm:text-lg">
                          Chưa chính xác
                        </h5>
                        <p className="text-red-700 font-medium opacity-80 text-sm sm:text-base">
                          Hãy thử lại xem sao nhé.
                        </p>
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      onClick={handleRetry}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ef4444] hover:bg-red-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      Thử lại <RotateCcw size={18} />
                    </button>

                  </div>
                )}
              </div>
            </>
          )}

          {/* NỘI DUNG TAB: VIDEO HỌC THỬ */}
          {activeTab === 'video' && (
            <div className="p-8 md:p-14 flex-grow flex flex-col items-center justify-center">
              <div className="w-full max-w-4xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/20 relative group">
                <iframe
                  className="w-full h-full"   // 👈 QUAN TRỌNG NHẤT
                  src="https://vimeo.com/manage/videos/1176153399/09b018576d"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* NỘI DUNG TAB: AI SỬA PHÁT ÂM */}
          {activeTab === 'pronounce' && (
            <div className="p-8 md:p-14 flex-grow flex flex-col items-center justify-center">
              <div className="
    w-full max-w-3xl 
    rounded-[32px] overflow-hidden shadow-xl border-4 border-white mb-8 group relative bg-slate-50
    
    h-[220px] sm:h-[260px]   /* mobile thấp lại */
    md:aspect-video md:h-auto /* desktop giữ nguyên */
    
    flex items-center justify-center
  ">
                <img
                  src={resolveAssetUrl(content.aiPronunciationImageUrl)}
                  alt="AI Phát Âm"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
