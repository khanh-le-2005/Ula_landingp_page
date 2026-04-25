import React from 'react';
import { solutionDefault, type SolutionContent } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { resolveAssetUrl } from '../utils/assetUtil';

const GlassFeatureCard = ({ category, title, bulletPoints, mediaUrl, isVideo, gradient, index }: any) => {

  const fallbackUrl = (solutionDefault.cards[index]?.mediaUrl as string) || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600';

  const getSafeUrl = () => {
    if (!mediaUrl || mediaUrl === 'null' || String(mediaUrl).includes('[object')) return fallbackUrl;
    return mediaUrl;
  };

  // SỬA TẠI ĐÂY: Ép kiểu triệt để. Nếu là chữ 'true' hoặc true thì mới là Video
  const isActuallyVideo = isVideo === true || isVideo === 'true';

  return (
    <div className="relative group overflow-hidden rounded-[35px] p-[1px] bg-gradient-to-b from-white/30 to-transparent shadow-xl min-h-[520px] h-full w-full flex flex-col max-w-[340px] mx-auto [transform:translateZ(0)]">
      <div className="bg-white/10 backdrop-blur-lg rounded-[34px] p-6 h-full flex flex-col border border-white/20 transition-all duration-500 hover:bg-white/25">

        <span className="text-[14px] text-center font-bold text-white uppercase tracking-[0.2em] mb-3 block">
          {category}
        </span>

        <h3 className="text-lg font-bold text-center text-white mb-4 leading-tight min-h-[2.5rem]">
          {title}
        </h3>

        <figure className={`w-full aspect-square rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${gradient} shadow-inner border border-white/10`}>

          {/* DÙNG isActuallyVideo THAY VÌ isVideo */}
          {isActuallyVideo ? (
            <video src={resolveAssetUrl(getSafeUrl())} autoPlay muted loop className="w-full h-full object-cover" />
          ) : (
            <img
              src={resolveAssetUrl(getSafeUrl())}
              alt={title}
              onError={(e) => {
                e.currentTarget.src = fallbackUrl;
                e.currentTarget.onerror = null;
              }}
              className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
            />
          )}

        </figure>

        <ul className="space-y-2 mb-6 flex-grow">
          {(Array.isArray(bulletPoints) ? bulletPoints : []).map((point: string, idx: number) => (
            <li key={idx} className="flex items-center gap-2 text-[13px] text-white/80 leading-snug">
              <span className="text-blue-400 mt-1 text-[10px]">✦</span>
              {point}
            </li>
          ))}
        </ul>

        <div className="w-10 h-[1.5px] bg-blue-400/40 rounded-full" />
      </div>
    </div>
  );
};

const UlaLandingSection = () => {
  const { content } = useLandingSection<SolutionContent>(ADMIN_SECTION_KEYS.solution, solutionDefault);
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const visibleFeatures = cards.slice(0, 3);

  return (
    // Sử dụng min-h-screen để linh hoạt hơn trên mobile
    <section className="min-h-screen bg-gradient-to-br from-[#004e89] via-[#003b66] to-[#004e89] flex flex-col items-center justify-center py-16 md:py-20 mt-20 p-4 lg:p-10 font-sans relative reveal">

      {/* Background Decor - Giảm blur để tối ưu hiệu năng */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Headline - Thu gọn margin để không chiếm diện tích dọc */}
      <div className="text-center mb-10 md:mb-12 px-4 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold font-be-vietnam-pro text-white uppercase tracking-tight leading-tight ">
          <div className='inline-block'>
            <span className="md:inline font-be-vietnam-pro font-extrabold md:px-2">
              {content.titlePart1 || 'Chỉ'}
            </span>
            <span className="text-[#dfc38a] font-be-vietnam-pro px-1 sm:px-1 py-1 rounded-xl md:p-0">
              {content.titleHighlight || '30 phút/ngày'}
            </span>
          </div>

          <span className="block md:inline mt-2 md:mt-0 ml-2">
            {content.titlePart2 || 'dễ dàng bắt đầu'}
          </span>
        </h1>
      </div>

      {/* Grid Container - items-stretch giúp các thẻ cao bằng nhau */}
      <div className="max-w-6xl w-full relative z-10">

        <div className="
    flex md:grid 
    md:grid-cols-3 
    gap-4 md:gap-6 
    pb-10
    overflow-x-auto 
    md:overflow-x-visible
    snap-x snap-mandatory 
    scrollbar-hide
    -mx-4 px-4 md:mx-0 md:px-0
  ">
          {visibleFeatures.map((feature: any, index: number) => (
            <div key={index} className="w-[85vw] md:w-full shrink-0 snap-center">
              <GlassFeatureCard
                category={feature.category}
                title={feature.title}
                bulletPoints={feature.bullets}
                mediaUrl={feature.mediaUrl}
                isVideo={feature.isVideo}
                gradient={feature.gradient}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* Mobile-only scroll indicator */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
          {visibleFeatures.map((_: any, i: number) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/30" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UlaLandingSection;
