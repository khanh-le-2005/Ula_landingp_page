import React from 'react';
import { methodologyDefault } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { resolveAssetUrl } from '../utils/assetUtil';

// Component cho 4 ô nhỏ bên phải
const FeatureCard = ({ number, title, subTitle, imgSrc }: { number: string; title: string; subTitle: string; imgSrc: string }) => (
  <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 border border-white/60 flex flex-col items-center text-center group transition-all duration-500 shadow-sm">
    <span className="text-[10px] sm:text-[12px] font-black text-black uppercase tracking-widest transition-colors uppercase">{number}</span>
    <figure className="mt-3 sm:mt-4 w-full aspect-[4/3] bg-slate-200 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-100/50 group-hover:border-white/10 transition-all">
      <img src={resolveAssetUrl(imgSrc)} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt={title} />
    </figure>

    <div className="mt-3 sm:mt-4">
      <h3 className="text-sm sm:text-lg font-black text-slate-700 leading-tight transition-colors uppercase">{title}</h3>
      <p className="text-[10px] sm:text-xs text-slate-500 group-hover:text-slate-400 mt-1 font-medium transition-colors italic leading-relaxed">{subTitle}</p>
    </div>
  </div>
);

const Methodology = () => {
  const { content, isLoading } = useLandingSection(ADMIN_SECTION_KEYS.methodology, methodologyDefault);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#e2e8f0] p-6 lg:p-12 flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font- font-be-vietnam tracking-widest uppercase">Initializing Methodology...</div>
      </div>
    );
  }

  const { mainCard, cards } = content;

  return (
    <section className="p-4 sm:p-6 lg:p-12 font-extrabold font-be-vietnam text-slate-800 flex items-center justify-center rounded-xl reveal" id="methodology">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-4 sm:gap-6 items-stretch">

        {/* CỘT TRÁI: Ô LỚN */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] sm:rounded-[40px] py-8 sm:py-10 flex flex-col shadow-sm px-4">
          <span className="text-[15px] sm:text-[16px] font-black font-be-vietnam text-black uppercase tracking-widest px-5 text-center w-full">{mainCard.number}</span>

          <figure className="mt-6 sm:mt-8 bg-slate-800 overflow-hidden relative shadow-2xl aspect-video md:aspect-auto md:flex-grow md:h-0 rounded-xl">
            <img
              src={resolveAssetUrl(mainCard.imgSrc)}
              className="w-full h-full object-cover opacity-90  "
              alt={mainCard.title}
            />
          </figure>

          <div className="mt-6 sm:mt-8 px-5 text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold font-be-vietnam text-slate-700 leading-none uppercase">{mainCard.title}</h2>
            <p className="text-sm sm:text-base text-slate-500 italic mt-2">({mainCard.subTitle})</p>
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
