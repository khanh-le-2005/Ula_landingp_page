import React, { useRef, useState, useEffect } from "react";
import { ChevronRight, Play, Star, Volume2 } from "lucide-react";
import { heroDefault } from "../pages/admin/adminData";
import { ADMIN_SECTION_KEYS } from "../pages/admin/adminSections";
import { useLandingSection } from "../pages/admin/hooks/useLandingSection";
import { resolveAssetUrl } from "../utils/assetUtil";

const TRUSTED_VIETNAMESE_AVATARS = [
  "https://i.pravatar.cc/120?img=12",
  "https://i.pravatar.cc/120?img=32",
  "https://i.pravatar.cc/120?img=47",
  "https://i.pravatar.cc/120?img=56",
  "https://i.pravatar.cc/120?img=68",
];

type SlimVimeoPlayerProps = {
  videoUrl: string;
  title: string;
  accentColor?: string;
  startMuted?: boolean;
  shouldPlay?: boolean;
  controlBarVariant?: string;
};

const transformVimeoUrl = (url: string) => {
  if (!url) return '';
  let trimmed = url.trim();

  if (trimmed.includes('vimeo.com') && !trimmed.includes('player.vimeo.com')) {
    const parts = trimmed.split('vimeo.com/');
    if (parts[1]) {
      const id = parts[1].split('?')[0];
      trimmed = `https://player.vimeo.com/video/${id}`;
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

export default function Hero() {
  const { content: hero } = useLandingSection(ADMIN_SECTION_KEYS.hero, heroDefault);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [isPlayingHeroVideo, setIsPlayingHeroVideo] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTo, setSeekTo] = useState<number | null>(null);
  const [isHeroBannerInView] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<any>(null);

  const heroVideoTitle = hero.headlineTop || "Học tiếng Đức cùng AI Coach";
  const heroVideoWatchUrl = hero.heroVideoWatchUrl;
  const heroVideoThumbnail =
    hero.heroImageUrl || "/assets/images/hero-thumbnail.png";

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
    if (isPlayingHeroVideo && !isPaused && showControls && !isDragging) {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlayingHeroVideo, isPaused, showControls, isDragging]);

  const toggleControls = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowControls(!showControls);
  };

  const scrollToRoadmapSection = () => {
    document.getElementById("roadmap")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const scrollToLeadForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section
      ref={heroSectionRef}
      className="relative flex min-h-[72svh] items-start bg-cover bg-center overflow-hidden pb-0 md:min-h-[90svh] md:pb-10 lg:min-h-screen reveal"
    >
      <div className="w-full mx-auto px-4 sm:px-10 lg:px-16 py-4 md:py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-10 lg:gap-18 items-center lg:items-start">
          <div className="space-y-5 md:space-y-8 animate-in fade-in slide-in-from-left duration-700 text-center lg:text-left mt-2 md:mt-0 order-2 lg:order-1">
            <div className="hidden md:inline-flex items-center justify-center gap-2.5 rounded-full border border-[#ead7a8] bg-[#fff7e8]/90 px-4 py-2 shadow-sm backdrop-blur-sm leading-none animate-fade-in-up">
              <span className="h-2.5 w-2.5 shrink-0 self-center rounded-full bg-[#c5a059] animate-pulse"></span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[9px] md:text-[11px] font-black uppercase tracking-wider leading-none text-[#c5a059]">
                <span className="block leading-none translate-y-[0.5px]">{hero.badge}</span>
                <span className="inline-flex items-center self-center text-[11px] md:text-[13px] leading-none">
                  AI
                </span>
              </span>
            </div>
            <h1 className="mt-5 font-be-vietnam sm:text-[28px] md:text-[36px] lg:text-[45px] font-extrabold text-[#1a2b48] leading-tight tracking-tight space-y-2 animate-fade-in-up [animation-delay:200ms]">
              <span className="block whitespace-nowrap">{hero.headlineTop}</span>
              <span className="block">
                <span className="inline-block text-[1.08em] sm:text-[1.1em] lg:text-[1.08em] text-[#d4b36d] drop-shadow-[0_6px_16px_rgba(197,160,89,0.14)] [-webkit-text-stroke:0.5px_#ffffcc]">{hero.headlineHighlight}</span>
              </span>
              <span className="block">{hero.headlineBottom}</span>
            </h1>

            <p className="block mt-3 md:mt-6 text-sm sm:text-base lg:text-xl text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed text-center lg:text-left animate-fade-in-up [animation-delay:400ms] whitespace-pre-line">
              {hero.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4 md:pt-5 animate-fade-in-up [animation-delay:600ms]">
              <button
                onClick={scrollToLeadForm}
                className="w-full text-center sm:w-auto justify-center bg-gradient-to-r from-[#c5a059] to-[#dfc38a] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:shadow-[0_20px_40px_rgba(197,160,89,0.4)] transition-all flex items-center group shadow-md active:scale-95"
              >
                {hero.primaryCta}{" "}
                <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToRoadmapSection}
                className="hidden sm:flex sm:w-auto justify-center bg-white/80 text-[#1a2b48] border-2 border-slate-100 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-white transition-all shadow-sm active:scale-95 backdrop-blur-sm"
              >
                {hero.secondaryCta}
              </button>
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-5 lg:justify-start pt-0 md:pt-4 animate-fade-in-up [animation-delay:800ms]">
              <div className="flex shrink-0 -space-x-3 sm:-space-x-4">
                {TRUSTED_VIETNAMESE_AVATARS.map((avatar, index) => (
                  <img
                    key={avatar}
                    src={avatar}
                    className="h-8 w-8 rounded-full border-2 border-white shadow-lg sm:h-10 sm:w-10 md:h-14 md:w-14 md:border-4"
                    alt={`Vietnamese learner ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex min-w-0 items-center gap-2 border-slate-400/30 sm:border-l-2 sm:pl-2">
                <div className="flex shrink-0 text-[#c5a059]">
                  <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
                </div>
                <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.03em] text-[#1a2b48] sm:text-[10px] md:text-xs md:tracking-[0.04em]">
                  11.365 học viên tin dùng
                </span>
              </div>
            </div>
          </div>

          {/* Vùng Video */}
          <div className="relative mt-2 lg:mt-20 px-4 md:px-0 order-1 lg:order-2 animate-zoom-in [animation-delay:600ms]">
            <div className="group relative aspect-video w-full rounded-[1.5rem] md:rounded-[3rem] border-4 md:border-[12px] border-white bg-white shadow-2xl md:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)]">
              <div className="relative h-full w-full overflow-hidden rounded-[calc(1.5rem-4px)] md:rounded-[calc(3rem-12px)] isolate shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72)] [backface-visibility:hidden] [transform:translateZ(0)]">
                {isPlayingHeroVideo && heroVideoWatchUrl ? (
                  <>
                    <SlimVimeoPlayer
                      videoUrl={"https://player.vimeo.com/video/1163868662?h=2e449d303e"}
                      title={heroVideoTitle}
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
                      <div className="mx-auto bg-white/80 rounded-full px-4 py-1.5 md:px-6 md:py-2.5 flex items-center gap-3 md:gap-5 shadow-xl backdrop-blur-sm h-8" onClick={(e) => e.stopPropagation()}>

                        {/* Play/Pause Button */}
                        <button
                          onClick={() => setIsPaused(!isPaused)}
                          className="flex h-8 w-8 md:h-6 md:w-6 shrink-0 items-center justify-center rounded-full bg-slate-100/80 text-slate-800 hover:bg-slate-200 transition-colors"
                        >
                          {isPaused ? (
                            <Play className="h-4 w-4 md:h-4 md:w-4 fill-current ml-0.5" />
                          ) : (
                            <div className="flex gap-1">
                              <div className="h-4 w-1 bg-current rounded-full" />
                              <div className="h-4 w-1 bg-current rounded-full" />
                            </div>
                          )}
                        </button>

                        {/* Time Display - Hidden on Mobile */}
                        <div className="hidden md:flex shrink-0 items-center gap-1.5 text-sm font-semibold text-slate-600 tabular-nums min-w-[80px]">
                          <span>{formatTime(currentTime)}</span>
                          <span className="text-slate-300">/</span>
                          <span>{formatTime(duration)}</span>
                        </div>

                        {/* Progress Bar Container */}
                        <div
                          ref={progressBarRef}
                          onMouseDown={handleMouseDown}
                          onTouchStart={handleTouchStart}
                          className="relative flex-grow h-1 bg-slate-300 rounded-full cursor-pointer group/progress touch-none"
                        >
                          {/* Inner bar */}
                          <div
                            className="absolute inset-y-0 left-0 bg-slate-900 rounded-full transition-all duration-100"
                            style={{ width: `${progressPercent}%` }}
                          />
                          {/* Handle (The Large Circle in Image) */}
                          <div
                            className="absolute top-1/2 h-5 w-5 md:h-5 md:w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a2b48] shadow-lg border-2 border-white transition-all group-hover/progress:scale-125"
                            style={{ left: `${progressPercent}%` }}
                          />
                        </div>

                        {/* Volume Icon */}
                        <button className="flex shrink-0 items-center justify-center h-7 w-7 md:h-9 md:w-9 rounded-full hover:bg-slate-50 transition-colors text-slate-500">
                          <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={resolveAssetUrl(heroVideoThumbnail)}
                      className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
                      alt={heroVideoTitle}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (heroVideoWatchUrl) {
                            setIsPlayingHeroVideo(true);
                          }
                        }}
                        disabled={!heroVideoWatchUrl}
                        className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#c5a059] to-[#dfc38a] text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer border-2 md:border-4 border-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Play className="w-8 h-8 md:w-12 md:h-12 fill-current ml-1" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
