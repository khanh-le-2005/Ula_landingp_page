import React from 'react';
import { methodologyDefault } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { resolveAssetUrl } from '../utils/assetUtil';

// Component cho 4 ô nhỏ bên phải
const FeatureCard = ({ number, title, subTitle, imgSrc }: { number: string; title: string; subTitle: string; imgSrc: string }) => (
  // 1. Thêm h-full vào thẻ cha ngoài cùng để nó căng tràn 100% chiều cao của ô Grid
  <div className="bg-gradient-to-br from-[#004e89] via-[#003b66] to-[#004e89] rounded-[24px] sm:rounded-[32px] p-4 sm:p-3 border border-white/60 flex flex-col items-center text-center group transition-all duration-500 shadow-sm h-full">

    {/* Nhãn trên cùng (BÀI GIẢNG / BÀI TẬP...) */}
    <span className="text-[10px] sm:text-[12px] font-black text-white tracking-widest uppercase mb-3 sm:mb-3 pt-2 shrink-0">
      {number}
    </span>

    {/* Hình ảnh */}
    <figure className="w-full aspect-[4/3] overflow-hidden rounded-xl sm:rounded-2xl transition-all shrink-0">
      <img
        src={resolveAssetUrl(imgSrc)}
        className="w-full h-full object-cover"
        alt={title}
      />
    </figure>

    {/* 2. Dùng flex-1 để div bọc text này chiếm TOÀN BỘ khoảng trống còn lại của thẻ */}
    <div className="mt-3 sm:mt-4 flex flex-col flex-1 w-full">
      <h3 className="text-sm sm:text-sm font-black text-white leading-tight uppercase">
        {title}
      </h3>

      {/* 3. Dùng mt-auto để đẩy dòng mô tả này xuống TẬN CÙNG dưới đáy của thẻ */}
      <p className="mt-auto pt-1 text-[10px] sm:text-xs text-white group-hover:text-white font-medium italic leading-relaxed">
        {subTitle}
      </p>
    </div>
  </div>
);

const Methodology = () => {
  const { content, isLoading } = useLandingSection(ADMIN_SECTION_KEYS.methodology, methodologyDefault);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#e2e8f0] p-6 lg:p-12 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-black tracking-widest uppercase">Initializing Methodology...</div>
      </div>
    );
  }

  const { mainCard, cards } = content;

  return (
    <section className="p-4 sm:p-6 lg:p-12 font-extrabold font-be-vietnam text-white flex items-center justify-center rounded-xl reveal bg-white/50 w-[95%] mx-auto" id="methodology">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-4 sm:gap-6 items-stretch">

        {/* CỘT TRÁI: Ô LỚN */}
        <div className=" col-span-12 lg:col-span-7 bg-gradient-to-br from-[#004e89] via-[#003b66] to-[#004e89] rounded-[32px] sm:rounded-[40px] py-8 sm:py-10 flex flex-col shadow-sm px-4 border border-white/60">
          <span className="text-[14px] sm:text-[14px] font-extrabold text-white uppercase tracking-widest px-5 text-center w-full">{mainCard.number}</span>

          <figure className="mt-6 sm:mt-8 bg-slate-800 overflow-hidden relative shadow-2xl aspect-video md:aspect-auto md:flex-grow md:h-0 rounded-xl">
            <img
              src={resolveAssetUrl(mainCard.imgSrc)}
              className="w-full h-full object-cover "
              alt={mainCard.title}
            />
          </figure>

          <div className="mt-6 sm:mt-8 px-5 text-center">
            <h2 className="text-sm sm:text-sm font-black text-white leading-none uppercase">{mainCard.title}</h2>
            <p className="text-sm sm:text-base text-white italic mt-2">({mainCard.subTitle})</p>
          </div>
        </div>

        {/* CỘT PHẢI: 4 Ô NHỎ */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-6">
          {cards.slice(0, 4).map((card, index) => (
            <div key={`${card.number}-${index}`} className={`reveal reveal-delay-${(index % 4) + 1}`}>
              <FeatureCard
                number={card.number}
                title={card.title}
                subTitle={card.subTitle}
                imgSrc={card.imgSrc}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Methodology;
