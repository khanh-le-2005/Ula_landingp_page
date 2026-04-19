// import React from 'react';
// import { motion } from 'motion/react';
// import { Check } from 'lucide-react';

// const Methodology = () => {
//   return (
//     <section className="w-full py-6 md:py-10 bg-[#f8fafc] font-sans flex flex-col items-center justify-center min-h-[100px]" id="methodology">
//       <div className="w-[85%] max-w-[1500px] mx-auto flex flex-col items-center">

//         {/* Title */}
//         <div className="flex border-b border-blue-200 pb-2 mb-6 w-full justify-center">
//           <span className="text-lg font-black text-[#1e3a8a] tracking-tight flex items-center gap-2 italic">
//             <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z"></path>
//             </svg>
//             ULA EDU MENTORING
//           </span>
//         </div>

//         {/* Main Grid: Left Box 1 and Right 4 Boxes */}
//         <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-5 items-stretch justify-items-center h-auto lg:h-[380px] xl:h-[450px]">

//           {/* LEFT COLUMN: Box 1 AI CHẤM CHỮA */}
//           <div className="bg-white/90 rounded-2xl border-2 border-blue-500 p-4 flex flex-col relative overflow-hidden w-full h-[400px] lg:h-full justify-between group text-sm shadow-[0_20px_50px_-15px_rgba(30,58,138,0.25)]">
//             {/* Vùng 1: Text Top */}
//             <div className="mb-2 z-10 relative shrink-0">
//               <span className="text-[11px] font-extrabold text-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Ô 1: AI CHẤM CHỮA (Real-time Feedback)</span>
//             </div>

//             {/* Vùng 2: Image (Full width) */}
//             <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full min-h-0 overflow-hidden rounded-xl bg-slate-50 border border-slate-200">
//               {/* 3D Shadow underneath image effect */}
//               <div className="absolute -bottom-6 left-6 right-6 h-12 bg-slate-900/40 blur-2xl rounded-[100%] z-0 scale-95 group-hover:scale-100 transition-transform"></div>

//               <img
//                 alt="Laptop mockup"
//                 className="absolute inset-0 w-full h-full object-cover shadow-[0_20px_40px_rgba(0,0,0,0.2)] z-10"
//                 src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoYclI5fGBJ-Il1_bZQidSx47lG-xqXULDPGAh6YsMjGYK6MvJ11-UVSQQ8jagw28XciY0dXG0BaK04HM2LrM0sHyXmjG22lgC2KPczeU5p4lWbJOGjRrJMW7sPNeYR1ng_4KV1iwiHI5LcflDmV53MZeG3b_tYrruLScODhFiPwQuuc_ZQuDsuYygTAHITYvzyqVtVJ1NwHniwYlo75x0PHYF5KVxM_OUqPQkJlBVzZIE93WrIBFUuQkuY3QtY7l7Nf6eYEE2O0me"
//               />

//               {/* Floating 95% Badge */}
//               <div className="absolute -bottom-2 -right-2 bg-white rounded-xl p-2 shadow-[0_15px_30px_rgba(0,0,0,0.2)] border border-slate-100 flex items-center gap-1.5 animate-bounce z-20">
//                 <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
//                   <Check className="text-white w-3.5 h-3.5 font-bold" strokeWidth={3} />
//                 </div>
//                 <div className="text-left pr-1.5">
//                   <div className="text-[#10b981] font-black text-sm leading-none">95%</div>
//                   <div className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 tracking-wider">Phát âm chuẩn</div>
//                 </div>
//               </div>
//             </div>

//             {/* Vùng 3: Text Bottom */}
//             <div className="mt-3 pt-2 border-t border-blue-100 w-full flex flex-col z-10 relative shrink-0">
//               <h4 className="text-[18px] font-black text-slate-900 tracking-tight leading-tight">03. AI CHẤM CHỮA</h4>
//               <p className="text-slate-500 font-semibold text-xs">(Real-time Feedback)</p>
//             </div>
//           </div>

//           {/* RIGHT COLUMN: 2x2 Grid */}
//           <div className="w-full grid grid-cols-2 grid-rows-2 gap-3 md:gap-4 items-stretch justify-items-center h-[500px] lg:h-full min-h-0">

//             {/* Box 2 */}
//             <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col shadow-xl hover:shadow-2xl transition-shadow w-full h-full relative group min-h-0">
//               <div className="mb-1 shrink-0">
//                 <span className="text-[9px] font-bold text-black uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md">Ô 2: VIDEO</span>
//               </div>

//               <div className="flex-1 w-full relative min-h-0">
//                 <div className="absolute -bottom-3 left-4 right-4 h-8 bg-slate-800/15 blur-xl rounded-[100%] z-0 scale-95 group-hover:scale-100 transition-transform"></div>
//                 <div className="absolute inset-0 bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center z-10 rounded-lg">
//                   <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoYclI5fGBJ-Il1_bZQidSx47lG-xqXULDPGAh6YsMjGYK6MvJ11-UVSQQ8jagw28XciY0dXG0BaK04HM2LrM0sHyXmjG22lgC2KPczeU5p4lWbJOGjRrJMW7sPNeYR1ng_4KV1iwiHI5LcflDmV53MZeG3b_tYrruLScODhFiPwQuuc_ZQuDsuYygTAHITYvzyqVtVJ1NwHniwYlo75x0PHYF5KVxM_OUqPQkJlBVzZIE93WrIBFUuQkuY3QtY7l7Nf6eYEE2O0me" alt="" />
//                 </div>
//               </div>

//               <div className="mt-2 pt-1 border-t border-slate-100 w-full flex flex-col shrink-0">
//                 <h4 className="text-[12px] font-black text-slate-900 uppercase leading-none">01. Video bài giảng</h4>
//                 <p className="text-slate-500 text-[10px] font-bold mt-1">(Kiến thức cô đọng)</p>
//               </div>
//             </div>

//             {/* Box 3 */}
//             <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col shadow-xl hover:shadow-2xl transition-shadow w-full h-full relative group min-h-0">
//               <div className="mb-1 shrink-0">
//                 <span className="text-[9px] font-bold text-black uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md">Ô 3: TRÒ CHƠI</span>
//               </div>
//               <div className="flex-1 w-full relative min-h-0">
//                 <div className="absolute -bottom-3 left-4 right-4 h-8 bg-slate-800/15 blur-xl rounded-[100%] z-0 scale-95 group-hover:scale-100 transition-transform"></div>
//                 <div className="absolute inset-0 bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center z-10 rounded-lg">
//                   <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoYclI5fGBJ-Il1_bZQidSx47lG-xqXULDPGAh6YsMjGYK6MvJ11-UVSQQ8jagw28XciY0dXG0BaK04HM2LrM0sHyXmjG22lgC2KPczeU5p4lWbJOGjRrJMW7sPNeYR1ng_4KV1iwiHI5LcflDmV53MZeG3b_tYrruLScODhFiPwQuuc_ZQuDsuYygTAHITYvzyqVtVJ1NwHniwYlo75x0PHYF5KVxM_OUqPQkJlBVzZIE93WrIBFUuQkuY3QtY7l7Nf6eYEE2O0me" alt="" />
//                 </div>
//               </div>
//               <div className="mt-2 pt-1 border-t border-slate-100 w-full flex flex-col shrink-0">
//                 <h4 className="text-[12px] font-black text-slate-900 uppercase leading-none">02. Trò chơi thiết kế</h4>
//                 <p className="text-slate-500 text-[10px] font-bold mt-1">(Gia tăng hứng thú)</p>
//               </div>
//             </div>

//             {/* Box 4 */}
//             <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col shadow-xl hover:shadow-2xl transition-shadow w-full h-full relative group min-h-0">
//               <div className="mb-1 shrink-0">
//                 <span className="text-[9px] font-bold text-black uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md">Ô 4: FLASHCARD</span>
//               </div>
//               <div className="flex-1 w-full relative min-h-0">
//                 <div className="absolute -bottom-3 left-4 right-4 h-8 bg-slate-800/15 blur-xl rounded-[100%] z-0 scale-95 group-hover:scale-100 transition-transform"></div>
//                 <div className="absolute inset-0 bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center z-10 rounded-lg">
//                   <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoYclI5fGBJ-Il1_bZQidSx47lG-xqXULDPGAh6YsMjGYK6MvJ11-UVSQQ8jagw28XciY0dXG0BaK04HM2LrM0sHyXmjG22lgC2KPczeU5p4lWbJOGjRrJMW7sPNeYR1ng_4KV1iwiHI5LcflDmV53MZeG3b_tYrruLScODhFiPwQuuc_ZQuDsuYygTAHITYvzyqVtVJ1NwHniwYlo75x0PHYF5KVxM_OUqPQkJlBVzZIE93WrIBFUuQkuY3QtY7l7Nf6eYEE2O0me" alt="" />
//                 </div>
//               </div>
//               <div className="mt-2 pt-1 border-t border-slate-100 w-full flex flex-col shrink-0">
//                 <h4 className="text-[12px] font-black text-slate-900 uppercase leading-none">04. Học từ vựng</h4>
//                 <p className="text-slate-500 text-[10px] font-bold mt-1">(Theo Flashcard)</p>
//               </div>
//             </div>

//             {/* Box 5 */}
//             <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col shadow-xl hover:shadow-2xl transition-shadow w-full h-full relative group min-h-0">
//               <div className="mb-1 shrink-0">
//                 <span className="text-[9px] font-bold text-black uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded-md">Ô 5: LỘ TRÌNH</span>
//               </div>
//               <div className="flex-1 w-full relative min-h-0">
//                 <div className="absolute -bottom-3 left-4 right-4 h-8 bg-slate-800/15 blur-xl rounded-[100%] z-0 scale-95 group-hover:scale-100 transition-transform"></div>
//                 <div className="absolute inset-0 bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center z-10 rounded-lg">
//                   <img className="absolute inset-0 w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoYclI5fGBJ-Il1_bZQidSx47lG-xqXULDPGAh6YsMjGYK6MvJ11-UVSQQ8jagw28XciY0dXG0BaK04HM2LrM0sHyXmjG22lgC2KPczeU5p4lWbJOGjRrJMW7sPNeYR1ng_4KV1iwiHI5LcflDmV53MZeG3b_tYrruLScODhFiPwQuuc_ZQuDsuYygTAHITYvzyqVtVJ1NwHniwYlo75x0PHYF5KVxM_OUqPQkJlBVzZIE93WrIBFUuQkuY3QtY7l7Nf6eYEE2O0me" alt="" />
//                 </div>
//               </div>
//               <div className="mt-2 pt-1 border-t border-slate-100 w-full flex flex-col shrink-0">
//                 <h4 className="text-[12px] font-black text-slate-900 uppercase leading-none">05. Tiến độ</h4>
//                 <p className="text-slate-500 text-[10px] font-bold mt-1">(Cá nhân hóa)</p>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* Call to action button */}
//         <motion.div
//           initial={{ opacity: 0, y: 15 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="mt-6 md:mt-8 w-full flex justify-center z-20"
//         >
//           <button
//             onClick={() => window.open('https://www.ulaedu.com/#/german')}
//             className="relative group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-2.5 rounded-full font-black text-[13px] shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(37,99,235,0.6)] overflow-hidden transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-2"
//           >
//             <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//             <span className="relative z-10 font-extrabold uppercase tracking-wide">
//               Bắt đầu học thử ngay
//             </span>
//             <motion.div
//               animate={{ x: [0, 4, 0] }}
//               transition={{ repeat: Infinity, duration: 1.5 }}
//               className="relative z-10"
//             >
//               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-[-90deg]">
import React from 'react';
import { methodologyDefault } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import { resolveAssetUrl } from '../utils/assetUtil';

// Component cho 4 ô nhỏ bên phải
const FeatureCard = ({ number, title, subTitle, imgSrc }: { number: string; title: string; subTitle: string; imgSrc: string }) => (
  <div className="bg-white/50 rounded-[32px] p-6 border border-white/60 flex flex-col group  transition-all duration-500 shadow-sm">
    <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest group-hover:text-amber-400 transition-colors">{number}</span>

    <figure className="mt-4 aspect-[4/3] bg-slate-200 overflow-hidden rounded-2xl border border-slate-100/50 group-hover:border-white/10 transition-all">
      <img src={resolveAssetUrl(imgSrc)} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700" alt={title} />
    </figure>

    <div className="mt-4">
      <h3 className="text-lg font-black text-slate-700 group-hover:text-white leading-tight transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 group-hover:text-slate-400 mt-1 font-medium transition-colors italic">{subTitle}</p>
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
    <section className="bg-white/30 p-6 lg:p-12 font-sans text-slate-800 flex items-center justify-center" id="methodology">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-12 gap-6 items-stretch">

        {/* CỘT TRÁI: Ô LỚN */}
        <div className="col-span-12 lg:col-span-7 bg-white/50 rounded-[40px] py-10 border border-blue-500 flex flex-col shadow-sm">
          <span className="text-[14px] font-bold text-black uppercase tracking-widest px-5 text-center lg:text-left">{mainCard.number}</span>

          <figure className="mt-8 bg-slate-800 overflow-hidden border border-slate-700 flex-grow h-0 relative shadow-2xl">
            <img
              src={resolveAssetUrl(mainCard.imgSrc)}
              className="w-full h-full object-cover opacity-90"
              alt={mainCard.title}
            />
          </figure>

          <div className="mt-8 px-5 text-center lg:text-left">
            <h2 className="text-2xl font-black text-slate-700 leading-none">{mainCard.title}</h2>
            <p className="text-base text-slate-500 italic mt-2">({mainCard.subTitle})</p>
          </div>
        </div>

        {/* CỘT PHẢI: 4 Ô NHỎ */}
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-6">
          {cards.slice(0, 4).map((card, index) => (
            <FeatureCard
              key={`${card.number}-${index}`}
              number={card.number}
              title={card.title}
              subTitle={card.subTitle}
              imgSrc={card.imgSrc}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Methodology;
