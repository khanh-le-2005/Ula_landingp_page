import React from 'react';
import robotMascotFallback from "../../assets/nhanvat1.png";
import { painpointsDefault, type PainpointsContent } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { resolveAssetUrl } from '../utils/assetUtil';

const PAINPOINT_LAYOUT = [
  // 1. TRUNG TÂM
  { positionClass: 'top-[2%] left-[56%] -translate-x-1/2 md:top-[20%] animate-float-slow', sizeClass: 'w-28 h-28 sm:w-36 sm:h-36 md:w-52 md:h-52' },

  // 2. BÊN TRÁI - TRÊN
  { positionClass: 'top-[18%] left-[10%] sm:top-[35%] sm:left-[25%] md:left-[35%] animate-float', sizeClass: 'w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32' },

  // 3. BÊN TRÁI - GIỮA
  { positionClass: 'top-[38%] -left-[2%] sm:left-[15%] md:top-[60%] md:left-[20%] animate-float-delayed', sizeClass: 'w-24 h-24 sm:w-30 sm:h-30 md:w-44 md:h-44' },

  // 4. BÊN TRÁI - DƯỚI
  { positionClass: 'top-[62%] left-[5%] sm:top-[68%] sm:left-[12%] md:top-[75%] md:left-[68%] animate-float-slow', sizeClass: 'w-22 h-22 sm:w-26 sm:h-26 md:w-34 md:h-34' },

  // 5. BÊN PHẢI - TRÊN
  { positionClass: 'top-[20%] right-[8%] sm:top-[15%] sm:right-[14%] md:top-[25%] md:left-[20%] animate-float-delayed', sizeClass: 'w-20 h-20 sm:w-26 sm:h-26 md:w-36 md:h-36' },

  // 6. BÊN PHẢI - GIỮA
  { positionClass: 'top-[42%] -right-[2%] sm:right-[4%] md:top-[30%] md:right-[20%] animate-float', sizeClass: 'w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44' },

  // 7. BÊN PHẢI - DƯỚI
  { positionClass: 'top-[68%] right-[8%] sm:top-[65%] sm:right-[10%] md:top-[60%] md:right-[32%] animate-float-slow', sizeClass: 'w-18 h-18 sm:w-22 sm:h-22 md:w-30 md:h-30' },
] as const;

// const PAINPOINT_LAYOUT = [
// // 1. CÁC BÀI VIẾT (Góc trên cùng bên trái - Ép vào trong)
// { positionClass: 'top-[-20px] left-[8%] md:top-[-40px] md:left-[20%] animate-float', sizeClass: 'w-20 h-20 md:w-24 md:h-24' },
// // 2. LÊN "TRÌNH" CÙNG AI (Dưới số 1 - Sát ngay cạnh bóng số 5)
// { positionClass: 'top-[50px] left-[25%] md:top-[60px] md:left-[32%] animate-float-delayed', sizeClass: 'w-24 h-24 md:w-[110px] md:h-[110px]' },
// // 3. NHỮNG "CÂU LỆNH VÀNG" (Vành đai ngoài bên trái - Kéo khỏi lề, ôm sát vào AI)
// { positionClass: 'top-[160px] left-[4%] md:top-[200px] md:left-[14%] animate-float-slow', sizeClass: 'w-28 h-28 md:w-36 md:h-36' },
// // 4. NHỮNG CASE STUDY THỰC TẾ (Góc dưới cùng bên trái - Rút sát vào ánh sáng xanh)
// { positionClass: 'top-[320px] left-[10%] md:top-[380px] md:left-[22%] animate-float', sizeClass: 'w-24 h-24 md:w-28 md:h-28' },
// // 5. CÁC CÔNG CỤ AI HIỆU QUẢ... (Trung tâm - Vẫn giữ nguyên ở tâm)
// { positionClass: 'top-[-60px] left-1/2 -translate-x-1/2 md:top-[-100px] animate-float-slow', sizeClass: 'w-36 h-36 md:w-44 md:h-44' },
// // 6. XÂY DỰNG TƯ DUY... (Góc trên cùng bên phải - Sát ngay cạnh bóng số 5)
// { positionClass: 'top-[10px] right-[20%] md:top-[20px] md:right-[28%] animate-float-delayed', sizeClass: 'w-24 h-24 md:w-[110px] md:h-[110px]' },
// // 7. NHỮNG MẸO NHỎ DÙNG AI (Vành đai ngoài bên phải - Kéo khỏi lề, ôm sát vào AI)
// { positionClass: 'top-[140px] right-[4%] md:top-[180px] md:right-[14%] animate-float', sizeClass: 'w-28 h-28 md:w-32 md:h-32' },
// // 8. CÁC VIDEO NGẮN (Góc dưới cùng bên phải - Rút sát vào ánh sáng xanh)
// { positionClass: 'top-[300px] right-[12%] md:top-[360px] md:right-[24%] animate-float-slow', sizeClass: 'w-20 h-20 md:w-28 md:h-28' },
// ] as const;

const PainpointBubble: React.FC<{ text: string; className: string; size?: string }> = ({
  text,
  className,
  size = 'w-40 h-40',
}) => (
  <div className={`absolute group transition-all duration-700 ${className} z-50`}>
    <div className={`relative ${size} rounded-full transition-all duration-500 group-hover:scale-110 flex items-center justify-center`}>
      {/* Subtle background glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl group-hover:bg-cyan-500/20 transition-colors" />

      {/* Main bubble body: Dark glass with cyan border and glow */}
      <div className="absolute inset-0 rounded-full border border-cyan-400/60 bg-[#0a192f]/40 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.3),inset_0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5),inset_0_0_25px_rgba(34,211,238,0.4)]" />

      {/* Top reflection highlight (Sphere effect) */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[5%] -left-[5%] w-[60%] h-[50%] bg-gradient-to-br from-white/20 via-white/5 to-transparent blur-[10px] rounded-[100%] rotate-[-15deg]" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 text-center">
        <p className="font-be-vietnam font-extrabold text-white text-[10px] md:text-[14px] leading-tight uppercase tracking-wider">
          {text}
        </p>
      </div>
    </div>
  </div>
);

export default function Painpoints() {
  const { content } = useLandingSection<PainpointsContent>(ADMIN_SECTION_KEYS.painpoints, painpointsDefault);
  const visiblePainpoints = [...content.bubbles].slice(0, PAINPOINT_LAYOUT.length);

  while (visiblePainpoints.length < PAINPOINT_LAYOUT.length) {
    visiblePainpoints.push(painpointsDefault.bubbles[visiblePainpoints.length] || 'Nỗi lo mới');
  }

  const rawMascotUrl = content.mascotImageUrl || '';
  const isDefaultLocalPath = rawMascotUrl === '/src/assets/nhanvat1.png' || rawMascotUrl === '';
  const mascotImageUrl = isDefaultLocalPath ? robotMascotFallback : rawMascotUrl;

  return (
    <section className="relative mb-8 flex items-center justify-center overflow-hidden px-4 md:px-6 reveal">
      {/* KHUNG NỀN MÀU ĐẬM */}
      <div className="relative min-h-[650px] sm:min-h-[750px] md:min-h-[820px] w-full max-w-[1300px] overflow-hidden rounded-[40px] md:rounded-[60px] border border-white/10 bg-[url(https://i.postimg.cc/3wB4Nz8Y/Generated.png)] bg-cover bg-center shadow-[0_40px_100px_rgba(0,0,0,0.5)]">

        {/* Glow effect */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.3)_0%,_transparent_70%)]" />

        <div className="relative z-20 flex flex-col items-center pt-12">
          {/* PHẦN TIÊU ĐỀ ĐÃ KHÔI PHỤC */}
          <div className="mb-5 text-center animate-fade-in-up px-1 sm:px-5">
            <h3 className=" font-be-vietnam font-extrabold text-lg  uppercase tracking-widest text-cyan-400 md:text-3xl">
              {content.sectionTitle}
            </h3>
          </div>

          <div className="relative h-[550px] w-full">
            {/* ĐẨY ROBOT XUỐNG DƯỚI ĐỂ BONG BÓNG Ở TRÊN ĐẦU */}
            <div className="absolute bottom-[150px] md:bottom-[-200px] left-1/2 z-10 -translate-x-1/2">
              <div className="relative transform scale-[1.1]">
                <img
                  src={resolveAssetUrl(mascotImageUrl)}
                  alt="ULA Robot"
                  className="w-[200px] md:w-[300px] object-cover drop-shadow-[0_20px_50px_rgba(59,130,246,0.4)] animate-float-slow"
                />
              </div>
            </div>

            {/* HIỂN THỊ CÁC BONG BÓNG */}
            {visiblePainpoints.map((text, index) => (
              <PainpointBubble
                key={`${text}-${index}`}
                text={text}
                className={PAINPOINT_LAYOUT[index].positionClass}
                size={PAINPOINT_LAYOUT[index].sizeClass}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
