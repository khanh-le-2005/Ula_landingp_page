import React from 'react';
import { solutionDefault } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { resolveAssetUrl } from '../utils/assetUtil';

const GlassFeatureCard = ({ category, title, bulletPoints, mediaUrl, isVideo = false, gradient }: any) => (
  // h-full kết hợp với max-w nhỏ giúp thẻ trông cao và gầy
  <div className="relative group overflow-hidden rounded-[35px] p-[1px] bg-gradient-to-b from-white/30 to-transparent shadow-xl h-[500px] flex flex-col max-w-[340px] mx-auto">
    <div className="bg-white/10 backdrop-blur-2xl rounded-[34px] p-6 h-full flex flex-col border border-white/20 transition-all duration-500 hover:bg-white/25 w-">

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
  const { content: features } = useLandingSection(ADMIN_SECTION_KEYS.solution, solutionDefault);
  const visibleFeatures = features.slice(0, 3);

  return (
    // Sử dụng min-h-screen để linh hoạt hơn trên mobile
    <section className="min-h-screen bg-[#004e89] flex flex-col items-center justify-center py-16 md:py-20 mt-20 p-4 lg:p-10 font-sans relative">

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Headline - Thu gọn margin để không chiếm diện tích dọc */}
      <div className="text-center mb-10 md:mb-12 shrink-0 px-4">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 leading-none">
          Chỉ <span className="text-red-500 italic bg-white/10 px-4 py-1 rounded-2xl md:bg-transparent md:p-0">30p/ngày</span>
          <span className="md:inline-block hidden">,</span>
          <span className="text-white mt-2 md:mt-0">dễ dàng bắt đầu</span>
        </h1>
        <p className="text-white/50 text-base font-light">
          Giải pháp học tập tối ưu cho học sinh hiện đại
        </p>
      </div>

      {/* Grid Container - items-stretch giúp các thẻ cao bằng nhau */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10 items-stretch">


        {visibleFeatures.map((feature, index) => (
          <GlassFeatureCard
            key={`${feature.category}-${index}`}
            category={feature.category}
            title={feature.title}
            gradient={feature.gradient}
            mediaUrl={feature.mediaUrl}
            isVideo={feature.isVideo}
            bulletPoints={feature.bullets}
          />
        ))}

      </div>

      {/* CTA Button - Thu nhỏ một chút để dành diện tích cho thẻ */}
      <div className="mt-10 relative z-10">
        <button onClick={() => window.location.href = "#lead-form"} className="bg-[#89cff0] text-[#1a2b48] px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95 uppercase tracking-wider">
          Bắt đầu trải nghiệm ngay
        </button>
      </div>
    </section>
  );
};

export default UlaLandingSection;
