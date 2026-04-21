import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Play, PlayCircle, Star } from "lucide-react";
import { heroDefault } from "../pages/admin/adminData";
import { ADMIN_SECTION_KEYS } from "../pages/admin/adminSections";
import { useLandingSection } from "../pages/admin/hooks/useLandingSection";

const TRUSTED_VIETNAMESE_AVATARS = [
  "https://i.pravatar.cc/120?img=12",
  "https://i.pravatar.cc/120?img=32",
  "https://i.pravatar.cc/120?img=47",
  "https://i.pravatar.cc/120?img=56",
  "https://i.pravatar.cc/120?img=68",
];

const heroStartPath = "/#lead-form";
const heroStartState = undefined;

type SlimVimeoPlayerProps = {
  videoUrl: string;
  title: string;
  accentColor?: string;
  startMuted?: boolean;
  shouldPlay?: boolean;
  controlBarVariant?: string;
};

function SlimVimeoPlayer({ videoUrl, title }: SlimVimeoPlayerProps) {
  return (
    <iframe
      src={videoUrl}
      title={title}
      className="absolute inset-0 h-full w-full"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  );
}

export default function Hero() {
  const { content: hero } = useLandingSection(ADMIN_SECTION_KEYS.hero, heroDefault);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const [isPlayingHeroVideo, setIsPlayingHeroVideo] = useState(false);
  const [isHeroBannerInView] = useState(true);
  const hasAutoStartedHeroVideoRef = useRef(false);
  const heroVideoStartModeRef = useRef<"auto" | "manual" | null>(null);
  const heroVideoTitle = hero.headlineTop || "Học tiếng Đức cùng AI Coach";
  const heroVideoWatchUrl = hero.heroVideoWatchUrl;
  const heroVideoThumbnail =
    "https://images.unsplash.com/photo-1548622159-866895eb488b?q=80&w=2070&auto=format&fit=crop";

  const scrollToRoadmapSection = () => {
    document.getElementById("roadmap")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={heroSectionRef}
      className="relative flex min-h-[72svh] items-start bg-cover bg-center overflow-hidden pb-0 md:min-h-[90svh] md:pb-10 lg:min-h-screen reveal"
    // style={{
    //   backgroundImage: "url('https://i.postimg.cc/nr3gVRts/cover5.jpg')",
    // }}
    >
      {/* <div className="absolute inset-0 bg-white/80 md:bg-white/70"></div> */}
      <div className="w-full mx-auto px-4 sm:px-10 lg:px-16 py-4 md:py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-10 lg:gap-18 items-center">
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
            <h1 className="font-be-vietnam text-[22px] sm:text-[3px] lg:text-[45px] font-extrabold text-[#1a2b48] leading-tight tracking-tight space-y-2 animate-fade-in-up [animation-delay:200ms]">

              <span className="block whitespace-nowrap">
                {hero.headlineTop}
              </span>

              <span className="block">
                <span className="text-[#d4b36d]">
                  {hero.headlineHighlight}
                </span>
                {/* <span className="ml-2">
                  {hero.headline}
                </span> */}
              </span>

              <span className="block">
                {hero.headlineBottom}
              </span>

            </h1>

            <p className="block mt-3 md:mt-6 text-sm sm:text-base lg:text-xl text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed text-center lg:text-left animate-fade-in-up [animation-delay:400ms]">
              {hero.description}
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4 md:pt-5 animate-fade-in-up [animation-delay:600ms]">
              <Link
                to={heroStartPath}
                state={heroStartState}
                className="w-full text-center sm:w-auto justify-center bg-gradient-to-r from-[#c5a059] to-[#dfc38a] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:shadow-[0_20px_40px_rgba(197,160,89,0.4)] transition-all flex items-center group shadow-md active:scale-95"
              >
                {hero.primaryCta}{" "}
                <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
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
          <div className="relative mt-2 lg:mt-0 px-4 md:px-0 order-1 lg:order-2 animate-zoom-in [animation-delay:600ms]">
            <div className="group relative aspect-video w-full rounded-[1.5rem] md:rounded-[3rem] border-4 border-white bg-white shadow-2xl md:border-[12px] md:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)]">
              <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#1a2b48] isolate shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72)] [backface-visibility:hidden] [transform:translateZ(0)] md:rounded-[36px]">
                {isPlayingHeroVideo && heroVideoWatchUrl ? (
                  <SlimVimeoPlayer
                    videoUrl={heroVideoWatchUrl}
                    title={heroVideoTitle}
                    accentColor="rgba(15,23,42,0.88)"
                    startMuted={false}
                    shouldPlay={isHeroBannerInView}
                    controlBarVariant="compact-light"
                  />
                ) : (
                  <>
                    <img
                      src={heroVideoThumbnail}
                      className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
                      alt={heroVideoTitle}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (heroVideoWatchUrl) {
                            hasAutoStartedHeroVideoRef.current = true;
                            heroVideoStartModeRef.current = "manual";
                            setIsPlayingHeroVideo(true);
                          }
                        }}
                        disabled={!heroVideoWatchUrl}
                        className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#c5a059] to-[#dfc38a] text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer border-2 md:border-4 border-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Play className="w-8 h-8 md:w-12 md:h-12 fill-current ml-1" />
                      </button>
                    </div>
                    {/* <div className="absolute bottom-4 md:bottom-8 left-4 right-4 md:left-8 md:right-8 bg-white/10 backdrop-blur-2xl p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/20">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0 md:space-y-1">
                          <p className="text-white text-[8px] md:text-[11px] font-black uppercase tracking-[0.3em] opacity-80">
                            Demo Trải Nghiệm
                          </p>
                          <p className="text-white text-sm md:text-lg font-bold">
                            Học tiếng Đức cùng AI Coach
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {heroVideoWatchUrl && (
                            <a
                              href={heroVideoWatchUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="hidden md:inline-flex text-[10px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
                            >
                              Vimeo
                            </a>
                          )}
                          <div className="w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center">
                            <PlayCircle className="text-white w-5 h-5 md:w-7 md:h-7" />
                          </div>
                        </div>
                      </div>
                    </div> */}
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
