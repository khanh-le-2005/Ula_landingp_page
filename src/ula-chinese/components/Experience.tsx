import React, { useState, useRef, useEffect } from 'react';
import { Mic, BookOpen, PlayCircle, Volume2, VolumeX, CheckCircle2, XCircle, ArrowRight, RotateCcw, Play } from 'lucide-react';
import MatchingExercise from '../Auxiliary/MatchingExercise';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { experienceDefault } from '../pages/admin/adminData';
import { resolveAssetUrl } from '../utils/assetUtil';
import { MOCK_QUIZ_DATA } from '../constants/solutionConstants';

type SlimVimeoPlayerProps = {
  videoUrl: string;
  title: string;
  onProgress?: (time: number) => void;
  onDuration?: (duration: number) => void;
  isPaused?: boolean;
  seekTo?: number | null;
};

const transformVimeoUrl = (url: string) => {
  if (!url) return '';
  let trimmed = url.trim();

  if (trimmed.includes('vimeo.com') && !trimmed.includes('player.vimeo.com')) {
    const parts = trimmed.split('vimeo.com/');
    if (parts[1]) {
      const pathParts = parts[1].split('?')[0].split('/');
      if (pathParts.includes('manage') && pathParts.includes('videos')) {
        const id = pathParts[pathParts.length - 2];
        const hash = pathParts[pathParts.length - 1];
        trimmed = `https://player.vimeo.com/video/${id}?h=${hash}`;
      } else {
        const id = pathParts[pathParts.length - 1];
        trimmed = `https://player.vimeo.com/video/${id}`;
      }
    }
  }

  const separator = trimmed.includes('?') ? '&' : '?';
  return `${trimmed}${separator}autoplay=1&muted=0&controls=0&badge=0&autopause=0&vimeo_logo=0&dnt=1`;
};

function SlimVimeoPlayer({ videoUrl, title, onProgress, onDuration, isPaused, seekTo }: SlimVimeoPlayerProps & {
  onProgress?: (time: number) => void;
  onDuration?: (duration: number) => void;
  isPaused?: boolean;
  seekTo?: number | null;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (iframeRef.current && (window as any).Vimeo) {
        const player = new (window as any).Vimeo.Player(iframeRef.current);
        playerRef.current = player;

        player.on("timeupdate", (data: any) => {
          onProgress?.(data.seconds);
        });

        player.on("loaded", () => {
          player.getDuration().then((duration: number) => {
            onDuration?.(duration);
          });
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [onProgress, onDuration]);

  useEffect(() => {
    if (playerRef.current) {
      if (isPaused) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  }, [isPaused]);

  useEffect(() => {
    if (playerRef.current && seekTo !== null && seekTo !== undefined) {
      playerRef.current.setCurrentTime(seekTo);
    }
  }, [seekTo]);

  const enhancedUrl = transformVimeoUrl(videoUrl);

  return (
    <iframe
      ref={iframeRef}
      src={enhancedUrl}
      title={title}
      className="absolute inset-0 h-full w-full scale-[1.05]"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}

const Experience = () => {
  const { content, isLoading } = useLandingSection(ADMIN_SECTION_KEYS.experience, experienceDefault);
  const [activeTab, setActiveTab] = useState<'pronounce' | 'quiz' | 'video'>('quiz');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isMatchingCorrect, setIsMatchingCorrect] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Video State
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<any>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = Math.max(0, Math.min(duration, (clickX / width) * duration));
      setSeekTo(newTime);
      setTimeout(() => setSeekTo(null), 100);
    }
  };

  const handleSeek = (clientX: number) => {
    if (progressBarRef.current && duration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const width = rect.width;
      const newTime = Math.max(0, Math.min(duration, (x / width) * duration));
      setCurrentTime(newTime);
      setSeekTo(newTime);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleSeek(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleSeek(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleSeek(e.touches[0].clientX);
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setTimeout(() => setSeekTo(null), 100);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, duration]);

  // Auto-hide controls logic
  useEffect(() => {
    if (isPlayingVideo && !isPaused && showControls && !isDragging) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlayingVideo, isPaused, showControls, isDragging]);

  const toggleControls = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControls(!showControls);
  };

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

  const { sectionTitle, sectionSubtitle } = content;
  const quizzes = MOCK_QUIZ_DATA;
  const currentQuiz = quizzes[currentIdx] || quizzes[0];
  const isLastQuestion = currentIdx === quizzes.length - 1;
  const totalQuestions = quizzes.length;

  const playSound = (isCorrect: boolean) => {
    if (!isSoundEnabled) return;
    const correctAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    const wrongAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3');
    if (isCorrect) {
      correctAudio.volume = 0.5;
      correctAudio.play().catch(e => console.log('Audio play blocked:', e));
    } else {
      wrongAudio.volume = 0.4;
      wrongAudio.play().catch(e => console.log('Audio play blocked:', e));
    }
  };

  const handleCheck = () => {
    if (!selectedOption) return;

    if (currentQuiz.type === 'matching') {
      if (isMatchingCorrect) {
        setStatus('correct');
        playSound(true);
      } else {
        setStatus('wrong');
        playSound(false);
      }
    } else {
      if (selectedOption === currentQuiz.correctAnswer) {
        setStatus('correct');
        playSound(true);
      } else {
        setStatus('wrong');
        playSound(false);
      }
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
        <h2 className="text-xl md:text-[16px] font-extrabold text-[#1a2b48] uppercase tracking-[0.2em] mt-10 whitespace-pre-line">{sectionTitle}</h2>
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
          onClick={() => { setActiveTab('video'); setIsPlayingVideo(false); }}
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
                    <div className={`w-full flex flex-col ${currentQuiz.imageUrl ? 'lg:grid lg:grid-cols-2' : 'max-w-2xl mx-auto'} gap-8 md:gap-12 items-center`}>
                      {typeof currentQuiz.imageUrl === 'string' && currentQuiz.imageUrl.trim() && (
                        <div className="w-full bg-white rounded-[24px] md:rounded-[35px] p-4 md:p-6 shadow-xl border border-slate-100 relative group aspect-[4/3] flex items-center justify-center overflow-hidden">
                          <img src={resolveAssetUrl(currentQuiz.imageUrl)} className="w-full h-full object-cover rounded-2xl opacity-90" alt="Quiz" />
                          <button
                            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                            className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform ${isSoundEnabled ? 'bg-[#005bb7]' : 'bg-slate-400'}`}
                          >
                            {isSoundEnabled ? <Volume2 size={28} /> : <VolumeX size={28} />}
                          </button>
                        </div>
                      )}

                      <div className="w-full flex flex-col gap-2.5 md:gap-3 text-left">
                        <h4 className="text-2xl md:text-4xl font-extrabold font-be-vietnam text-[#1a2b48] mb-4 md:mb-6">{currentQuiz.word}</h4>
                        {currentQuiz.options?.map((opt: any) => {
                          const isCorrectOption = opt.id === currentQuiz.correctAnswer;
                          let borderStyle = "border-[#005bb7]/30 bg-white";
                          if (selectedOption === opt.id) borderStyle = "border-[#005bb7] bg-blue-50/50";
                          if (status === 'correct' && isCorrectOption) borderStyle = "border-green-500 bg-green-50/50";
                          if (status === 'wrong' && opt.id === selectedOption) borderStyle = "border-red-500 bg-red-50/50";

                          return (
                            <button
                              key={opt.id}
                              disabled={status === 'correct'}
                              onClick={() => { setSelectedOption(opt.id); setStatus('idle'); }}
                              className={`flex items-center p-2.5 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all text-left group ${borderStyle}`}
                            >
                              <span className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-bold mr-3 md:mr-4 transition-colors ${(status === 'correct' && isCorrectOption) ? 'bg-green-500 text-white' :
                                (status === 'wrong' && opt.id === selectedOption) ? 'bg-red-500 text-white' :
                                  selectedOption === opt.id ? 'bg-[#005bb7] text-white' : 'bg-slate-100 text-slate-400'
                                }`}>{opt.id}</span>
                              <span className="font-bold font-be-vietnam text-slate-700 text-base md:text-lg">{opt.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-8 md:px-10 md:py-10 bg-white/60 border-t border-white/60">
                {status === 'idle' && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleCheck}
                      disabled={!selectedOption}
                      className={`w-fit sm:px-16 px-4 py-3.5 rounded-full font-black uppercase text-sm tracking-[0.1em] transition-all shadow-lg ${selectedOption ? 'bg-[#005bb7] text-white hover:scale-105 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                      Kiểm tra kết quả
                    </button>
                  </div>
                )}

                {status === 'correct' && (
                  <div className="w-full bg-white/30 border border-green-200 rounded-[2.5rem] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 sm:gap-4 text-left ml-2 sm:ml-4">
                      <div className="bg-white rounded-full p-1.5 text-green-500 shadow-sm border border-green-100 shrink-0">
                        <CheckCircle2 size={20} className="text-green-500" />
                      </div>
                      <div>
                        <h5 className="text-green-800 font-black text-sm sm:text-base">
                          Chính xác!
                        </h5>
                        <p className="text-green-700 font-medium opacity-80 text-xs sm:text-sm">
                          {currentQuiz.explanation || 'Bạn đã nối đúng tất cả các cặp từ!'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-green-600 text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      Tiếp tục <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {status === 'wrong' && (
                  <div className="w-full bg-white/30 border border-red-200 rounded-[2.5rem] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-3 sm:gap-4 text-left ml-2 sm:ml-4">
                      <div className="bg-white rounded-full p-1.5 text-red-500 shadow-sm border border-red-100 shrink-0">
                        <XCircle size={20} className="text-red-500" />
                      </div>
                      <div>
                        <h5 className="text-red-800 font-black text-sm sm:text-base">
                          Chưa chính xác
                        </h5>
                        <p className="text-red-700 font-medium opacity-80 text-xs sm:text-sm">
                          Hãy thử lại xem sao nhé.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ef4444] hover:bg-red-600 text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-black text-[11px] sm:text-xs uppercase tracking-widest shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      Thử lại <RotateCcw size={16} />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* NỘI DUNG TAB: VIDEO HỌC THỬ */}
          {activeTab === 'video' && (
            <div className="p-2 md:p-14 flex-grow flex flex-col items-center justify-center">
              <div className="w-full max-w-4xl aspect-video relative group animate-zoom-in">
                <div className="relative h-full w-full rounded-[1.5rem] md:rounded-[3rem] border-4 md:border-[12px] border-white bg-white shadow-2xl md:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] overflow-visible">
                  <div className="relative h-full w-full overflow-hidden rounded-[calc(1.5rem-4px)] md:rounded-[calc(3rem-12px)] isolate shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72)] [backface-visibility:hidden] [transform:translateZ(0)]">
                    {isPlayingVideo ? (
                      <>
                        <SlimVimeoPlayer
                          videoUrl={"https://player.vimeo.com/video/1176153399?h=09b018576d"}
                          title="Video học thử"
                          onProgress={setCurrentTime}
                          onDuration={setDuration}
                          isPaused={isPaused}
                          seekTo={seekTo}
                        />

                        {/* Click Overlay to toggle controls */}
                        <div
                          className="absolute inset-0 z-10 cursor-pointer"
                          onClick={toggleControls}
                        />

                        {/* White Pill Control Bar */}
                        <div className={`absolute inset-x-4 bottom-2.5 md:inset-x-8 md:bottom-4 z-20 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                          <div className="mx-auto bg-white/95 rounded-full px-4 py-1.5 md:px-6 md:py-2.5 flex items-center gap-3 md:gap-5 shadow-xl backdrop-blur-sm h-8" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setIsPaused(!isPaused)}
                              className="flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-full bg-slate-100/80 text-slate-800 hover:bg-slate-200 transition-colors"
                            >
                              {isPaused ? (
                                <Play className="h-3.5 w-3.5 md:h-4 md:w-4 fill-current ml-0.5" />
                              ) : (
                                <div className="flex gap-1">
                                  <div className="h-3 w-0.5 bg-current rounded-full" />
                                  <div className="h-3 w-0.5 bg-current rounded-full" />
                                </div>
                              )}
                            </button>

                            <div className="hidden md:flex shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-600 tabular-nums min-w-[80px]">
                              <span>{formatTime(currentTime)}</span>
                              <span className="text-slate-300">/</span>
                              <span>{formatTime(duration)}</span>
                            </div>

                            <div
                              ref={progressBarRef}
                              onMouseDown={handleMouseDown}
                              onTouchStart={handleTouchStart}
                              className="relative flex-grow h-1 bg-slate-300 rounded-full cursor-pointer group/progress touch-none"
                            >
                              <div
                                className="absolute inset-y-0 left-0 bg-slate-900 rounded-full transition-all duration-100"
                                style={{ width: `${progressPercent}%` }}
                              />
                              <div
                                className="absolute top-1/2 h-5 w-5 md:h-5 md:w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a2b48] shadow-lg border-2 border-white transition-all group-hover/progress:scale-125"
                                style={{ left: `${progressPercent}%` }}
                              />
                            </div>

                            <button className="flex shrink-0 items-center justify-center h-7 w-7 md:h-9 md:w-9 rounded-full hover:bg-slate-50 transition-colors text-slate-500">
                              <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="relative w-full h-full cursor-pointer overflow-hidden" onClick={() => setIsPlayingVideo(true)}>
                        <img
                          src="/src/assets/video_experience_thumbnail.png"
                          className="w-full h-full object-cover opacity-80 scale-105 group-hover:scale-100 transition-transform duration-1000"
                          alt="Video preview"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-40 animate-pulse" />
                            <button className="relative w-20 h-20 md:w-28 md:h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 shadow-2xl transition-transform group-hover:scale-110 active:scale-95">
                              <PlayCircle size={64} className="fill-white/20" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                {typeof content.aiPronunciationImageUrl === 'string' && content.aiPronunciationImageUrl.trim() ? (
                  <img
                    src={resolveAssetUrl(content.aiPronunciationImageUrl)}
                    alt="AI Phát Âm"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">
                    Chưa có ảnh mô phỏng AI
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
