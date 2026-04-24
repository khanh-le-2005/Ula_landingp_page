import React from 'react';
import { solutionDefault, type SolutionContent } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { resolveAssetUrl } from '../utils/assetUtil';

const GlassFeatureCard = ({ category, title, bulletPoints, mediaUrl, isVideo = false, gradient }: any) => (
  // h-full kết hợp với min-h giúp thẻ luôn cao đồng đều và không bị vỡ khi nội dung dài
  <div className="relative group overflow-hidden rounded-[35px] p-[1px] bg-gradient-to-b from-white/30 to-transparent shadow-xl min-h-[520px] h-full w-full flex flex-col max-w-[340px] mx-auto [transform:translateZ(0)]">
    <div className="bg-white/10 backdrop-blur-lg rounded-[34px] p-6 h-full flex flex-col border border-white/20 transition-all duration-500 hover:bg-white/25">

      <span className="text-[14px] text-center font-bold text-white uppercase tracking-[0.2em] mb-3 block">
        {category}
      </span>

      <h3 className="text-lg font-bold text-center text-white mb-4 leading-tight min-h-[2.5rem]">
        {title}
      </h3>

      {/* CHỈNH SỬA TẠI ĐÂY: Dùng aspect-square để kéo dài diện tích theo chiều dọc */}
      <figure className={`w-full aspect-square rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden bg-gradient-to-br ${gradient} shadow-inner border border-white/10`}>
        {mediaUrl ? (
          isVideo ? (
            <video src={resolveAssetUrl(mediaUrl)} autoPlay muted loop className="w-full h-full object-cover" />
          ) : (
            <img src={resolveAssetUrl(mediaUrl)} alt={title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
          )
        ) : (
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        )}
      </figure>

      {/* Bullet Points - Thu nhỏ font chữ để tiết kiệm diện tích chiều dọc */}
      <ul className="space-y-2 mb-6 flex-grow">
        {bulletPoints.map((point: string, index: number) => (
          <li key={index} className="flex items-center gap-2 text-[13px] text-white/80 leading-snug">
            <span className="text-blue-400 mt-1 text-[10px]">✦</span>
            {point}
          </li>
        ))}
      </ul>

      <div className="w-10 h-[1.5px] bg-blue-400/40 rounded-full" />
    </div>
  </div>
);

const UlaLandingSection = () => {
  const { content } = useLandingSection<SolutionContent>(ADMIN_SECTION_KEYS.solution, solutionDefault);
  const cards = Array.isArray(content.cards) ? content.cards : [];
  const visibleFeatures = cards.slice(0, 3);

  return (
    // Sử dụng min-h-screen để linh hoạt hơn trên mobile
    <section className="min-h-screen bg-[#7f1d1d] flex flex-col items-center justify-center py-16 md:py-10 mt-20 p-4 lg:p-10 font-sans relative reveal">

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

          {/* <span className="hidden md:inline">,</span> */}

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
    overflow-x-auto md:overflow-visible
    snap-x snap-mandatory
    pb-8
    items-stretch
    min-h-[580px] md:min-h-0
  ">

          {visibleFeatures.map((feature, index) => (
            <div
              key={`${feature.category}-${index}`}
              className={`
                min-w-[85%] sm:min-w-[70%] md:min-w-0
                snap-center
                shrink-0
                flex
                reveal reveal-delay-${(index % 3) + 1}
              `}
            >
              <GlassFeatureCard
                category={feature.category}
                title={feature.title}
                gradient={feature.gradient}
                mediaUrl={feature.mediaUrl}
                isVideo={feature.isVideo}
                bulletPoints={feature.bullets}
              />
            </div>
          ))}

        </div>

      </div>

      {/* CTA Button - Thu nhỏ một chút để dành diện tích cho thẻ */}
      <div className="mt-10 relative z-10">
        {/* <button onClick={() => window.location.href = "#lead-form"} className="bg-white text-[#1a2b48] px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95 uppercase tracking-wider hover:cursor-pointer">
          Bắt đầu trải nghiệm ngay
        </button> */}
      </div>
    </section>
  );
};

export default UlaLandingSection;
