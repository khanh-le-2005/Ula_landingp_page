import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";


const FLAG_SOURCES = {
  de: "https://flagcdn.com/w80/de.png",
  cn: "https://flagcdn.com/w80/cn.png",
};



type FlagIconProps = {
  src: string;
  alt: string;
  className?: string;
};

const FlagIcon: React.FC<FlagIconProps> = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    className={`rounded-full object-cover ring-1 ring-white/20 ${className}`.trim()}
  />
);

type HeroFlagBadgeProps = {
  src: string;
  alt: string;
  rotateClassName: string;
  imageClassName?: string;
  shineClassName?: string;
};

const HeroFlagBadge: React.FC<HeroFlagBadgeProps> = ({
  src,
  alt,
  rotateClassName,
  imageClassName = "",
  shineClassName = "bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.5),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.14),transparent_55%)]",
}) => (
  <div className="relative mb-2 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
    <div className="pointer-events-none absolute inset-x-2 -bottom-2 h-3 rounded-full bg-slate-950/35 blur-md opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-90 md:inset-x-3 md:h-4" />
    <div className="relative overflow-hidden rounded-full">
      <FlagIcon
        src={src}
        alt={alt}
        className={`relative h-12 w-12 shadow-[0_14px_28px_rgba(15,23,42,0.35)] transition-all duration-500 group-hover:-translate-y-1 md:h-16 md:w-16 ${rotateClassName} ${imageClassName}`}
      />
      <div className={`pointer-events-none absolute inset-0 rounded-full ${shineClassName}`} />
    </div>
  </div>
);

const LandingPortal: React.FC = () => {

  return (
    <div className="min-h-screen flex flex-col font-inter bg-white overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-slate-100 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-full w-full flex-row items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex items-center gap-8 lg:gap-12">
            <Link to="/" className="w-20 shrink-0 sm:w-24 md:w-28">
              <img
                className="w-full"
                src="https://i.ibb.co/5xKHdVhf/logo-02.png"
                alt="Ula Edu"
              />
            </Link>
          </div>
        </div>
      </header>

      <div className="relative flex min-h-[calc(100svh-5rem)] flex-grow flex-col pt-20 lg:flex-row">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 w-full max-w-[92vw] -translate-x-1/2 -translate-y-1/2 px-2 text-center md:px-4 lg:top-[25%]">
          <div className="flex flex-col items-center">
            <div className="inline-block rounded-full border border-white/20 bg-white/15 px-2 py-0.5 shadow-2xl backdrop-blur-md md:px-5 md:py-1">
              <h1 className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white drop-shadow-lg sm:text-xs md:gap-2.5 md:text-xl md:tracking-[0.18em] lg:text-[1.7rem]">
                <span>Học & luyện thi ngoại ngữ cùng</span>
                <span className="text-lg font-extrabold leading-none text-[#dfc38a] drop-shadow-lg sm:text-xl md:text-3xl lg:text-4xl">
                  AI
                </span>
              </h1>
            </div>
            <p className="mt-4 text-xs italic tracking-[0.16em] text-white/90 drop-shadow-lg sm:text-sm md:text-xl md:tracking-[0.2em] lg:text-2xl">
              Nhanh hơn - Thông minh hơn
            </p>
          </div>
        </div>

        <div className="group relative min-h-[50vh] flex-1 overflow-hidden border-b border-white/10 lg:min-h-0 lg:border-b-0 lg:border-r">
          <div className="absolute inset-0 z-10 bg-[#1a2b48]/90 transition-colors duration-700 group-hover:bg-[#1a2b48]/80" />
          <img
            src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop"
            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
            alt="German Background"
          />

          <div className="relative z-20 flex h-full flex-col items-center justify-center space-y-6 p-6 pb-14 text-center sm:p-8 md:space-y-8 md:p-12 lg:mt-16 lg:pb-12">
            <HeroFlagBadge
              src={FLAG_SOURCES.de}
              alt="Cờ Đức"
              rotateClassName="group-hover:rotate-[8deg]"
            />

            <div className="space-y-2">
              <h2 className="font-lexend text-4xl font-black leading-tight tracking-tighter text-white drop-shadow-xl sm:text-5xl lg:text-7xl">
                Ula <br /> German
              </h2>
              <p className="text-sm font-medium tracking-wide text-blue-100 drop-shadow-md sm:text-base md:text-lg">
                Chinh phục giấc mơ Đức
              </p>
            </div>

            <Link
              to="/german"
              className="group/btn pointer-events-auto mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-[#dfc38a] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-[#1a2b48] shadow-[0_0_40px_rgba(197,160,89,0.3)] transition-all hover:bg-white hover:shadow-[#c5a059]/60 sm:w-auto md:px-12 md:py-5 md:text-sm"
            >
              Bắt đầu học
              <ArrowRight
                size={18}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <div className="group relative min-h-[50vh] flex-1 overflow-hidden lg:min-h-0">
          <div className="absolute inset-0 z-10 bg-[#8c1c13]/90 transition-colors duration-700 group-hover:bg-[#8c1c13]/80" />
          <img
            src="https://images.unsplash.com/photo-1548622159-866895eb488b?q=80&w=2070&auto=format&fit=crop"
            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
            alt="Chinese Background"
          />

          <div className="relative z-20 flex h-full flex-col items-center justify-center space-y-6 p-6 pt-14 text-center sm:p-8 md:space-y-8 md:p-12 lg:mt-16 lg:pt-12">
            <HeroFlagBadge
              src={FLAG_SOURCES.cn}
              alt="Cờ Trung Quốc"
              rotateClassName="group-hover:-rotate-[8deg]"
              imageClassName="object-[42%_50%]"
              shineClassName="bg-[radial-gradient(circle_at_72%_28%,rgba(255,255,255,0.45),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.1),transparent_58%)]"
            />

            <div className="space-y-2">
              <h2 className="font-lexend text-4xl font-black leading-tight tracking-tighter text-white drop-shadow-xl sm:text-5xl lg:text-7xl">
                Ula <br /> Chinese
              </h2>
              <p className="text-sm font-medium tracking-wide text-red-100 drop-shadow-md sm:text-base md:text-lg">
                Tinh hoa Hán ngữ
              </p>
            </div>

            <Link
              to="/chinese"
              className="group/btn pointer-events-auto mt-4 flex w-full items-center justify-center gap-3 rounded-full bg-[#dfc38a] px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-[#8c1c13] shadow-[0_0_40px_rgba(197,160,89,0.3)] transition-all hover:bg-white hover:shadow-[#c5a059]/60 sm:w-auto md:px-12 md:py-5 md:text-sm"
            >
              Bắt đầu học
              <ArrowRight
                size={18}
                className="transition-transform group-hover/btn:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPortal;
