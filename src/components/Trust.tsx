import React from 'react';
import { SUCCESS_FLOATING_IMAGES } from '../constants/success-stories';
import ReviewCard from '../Auxiliary/ReviewCard';
import { REVIEWS_DATA, REVIEWS_COLUMN_LEFT, REVIEWS_COLUMN_RIGHT } from '../constants/reviews';
import SuccessStatsPanel from '../SuccessStatsPanel';


export default function Trust() {
  return (
    <section className="py-24 px-6 mx-auto" id="trust">
      <div className="w-full md:w-[116%] md:-ml-[8%] lg:w-[118%] lg:-ml-[9%] xl:w-[114%] xl:-ml-[7%] md:scale-[0.8] md:origin-top">

        <div className="w-full px-2 md:px-8 lg:px-10 text-center mb-10 md:mb-16 relative z-10">

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#004e89] drop-shadow-sm font-serif italic px-2">

            Hàng ngàn câu chuyện thành công

          </h2>

        </div>

        <div className="w-full px-2 md:px-6 lg:px-10 xl:px-14 relative z-10">

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">

            <div className="hidden sm:block lg:col-span-5 relative min-h-[380px] lg:min-h-[560px] xl:min-h-[600px]">

              <style>{`@keyframes float-vertical-1 { 0% { transform: translateY(0); opacity: 0.92; } 50% { transform: translateY(-108px); opacity: 0.4; } 100% { transform: translateY(0); opacity: 0.92; } } @keyframes float-vertical-2 { 0% { transform: translateY(0); opacity: 0.45; } 50% { transform: translateY(92px); opacity: 1; } 100% { transform: translateY(0); opacity: 0.45; } } @keyframes float-vertical-3 { 0% { transform: translateY(0); opacity: 0.82; } 25% { transform: translateY(-56px); opacity: 0.45; } 75% { transform: translateY(56px); opacity: 0.94; } 100% { transform: translateY(0); opacity: 0.82; } }`}</style>

              {SUCCESS_FLOATING_IMAGES.map((img, i) => (

                <div

                  key={i}

                  className="absolute z-10 transition-all duration-300"

                  style={{

                    top: img.top,

                    left: img.left,

                    right: img.right,

                    bottom: img.bottom,

                    zIndex: img.z,

                    transform: `rotate(${img.rotate})`,

                  }}

                >

                  <div

                    className={`rounded-xl overflow-hidden border-2 md:border-4 border-white transition-all duration-300 ${img.main ? "shadow-2xl" : "shadow-lg"}`}

                    style={{

                      animation: `float-vertical-${(i % 3) + 1} ${6 + (i % 3) * 2}s infinite ease-in-out`,

                      animationDelay: `${i * 0.35}s`,

                    }}

                  >

                    <div className={`${img.size} bg-gray-200 relative`}>

                      <img

                        src={img.src}

                        alt={img.alt ?? "Success Story"}

                        loading="lazy"

                        className="w-full h-full object-cover"

                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    </div>

                  </div>

                </div>

              ))}

            </div>



            <div className="lg:col-span-7 col-span-12">

              <div className="h-[480px] md:h-[620px] overflow-hidden relative mask-image-gradient">

                <style>{`.mask-image-gradient { mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); } @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } } @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } } .animate-scroll-up { animation: scrollUp 68s linear infinite; } .animate-scroll-down { animation: scrollDown 68s linear infinite; }`}</style>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 h-full px-2">

                  <div className="flex flex-col gap-3 md:hidden animate-scroll-up">

                    {[...REVIEWS_DATA, ...REVIEWS_DATA].map((review, i) => (

                      <ReviewCard key={`mobile-${i}`} review={review} />

                    ))}

                  </div>

                  <div className="hidden md:flex flex-col gap-4 animate-scroll-up">

                    {[...REVIEWS_COLUMN_LEFT, ...REVIEWS_COLUMN_LEFT].map(

                      (review, i) => (

                        <ReviewCard key={`up-${i}`} review={review} />

                      ),

                    )}

                  </div>

                  <div className="hidden md:flex flex-col gap-4 animate-scroll-down">

                    {[...REVIEWS_COLUMN_RIGHT, ...REVIEWS_COLUMN_RIGHT]

                      .reverse()

                      .map((review, i) => (

                        <ReviewCard key={`down-${i}`} review={review} />

                      ))}

                  </div>

                </div>

              </div>

              <SuccessStatsPanel variant="chinese" />

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
