import React from 'react';
import { Wheel } from 'react-custom-roulette';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { luckyWheelDefault } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';

type LuckyWheelSection = {
  timerLabel: string;
  headline: string;
  description: string;
  prizes: typeof luckyWheelDefault;
};

export default function LuckyWheel({ onWin }: { onWin: (prize: { option: string }) => void }) {
  const { content } = useLandingSection<LuckyWheelSection>(
    ADMIN_SECTION_KEYS.luckyWheel,
    {
      timerLabel: 'Ưu đãi kết thúc sau: 00:59:59',
      headline: 'Vòng quay may mắn - Nhận quà cực khủng!',
      description: 'Chỉ cần đăng ký thông tin để nhận 01 lượt quay miễn phí với cơ hội trúng học bổng lên đến 50%.',
      prizes: luckyWheelDefault,
    },
  );

  const data = (content.prizes || []).map((prize) => ({
    option: prize.option,
    code: prize.code,
    style: { backgroundColor: prize.backgroundColor, textColor: prize.textColor },
  }));

  const [mustStartSpinning, setMustStartSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustStartSpinning) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustStartSpinning(true);
    }
  };

  const handleStopSpinning = () => {
    setMustStartSpinning(false);
    const winPrize = data[prizeNumber];

    // 1. Notify parent
    onWin(winPrize);

    // 2. Bắn pháo hoa giấy
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2563eb', '#ba0a0d', '#f5a623']
    });

    // 3. Hiện thông báo hướng dẫn đăng ký
    Swal.fire({
      title: 'CHÚC MỪNG BẠN!',
      html: `Bạn đã quay trúng: <b>${winPrize.option}</b>.<br/>Vui lòng để lại thông tin ở biểu mẫu bên dưới để nhận mã quà tặng!`,
      icon: 'success',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3112/3112946.png',
      imageWidth: 100,
      confirmButtonText: 'Đăng ký nhận quà ngay',
      confirmButtonColor: '#2563eb',
      returnFocus: false,
      background: '#ffffff',
      customClass: {
        title: 'text-2xl font-bold text-slate-800',
        popup: 'rounded-3xl'
      }
    }).then(() => {
      // Cuộn xuống LeadForm như các nút khác trên trang
      document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <section className="py-12 md:py-16 text-white rounded-[2rem] md:rounded-[3rem] bg-white/50 mx-4 md:mx-6 mb-20 md:mb-24 overflow-hidden relative" id="luckywheel">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_50%)] opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
        <div className="space-y-6 md:space-y-8 text-center md:text-left">

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight text-blue-950 ">
            {content.headline.split(' - ')[0]}  <span className="inline-block text-[1.08em] sm:text-[1.1em] lg:text-[1.08em] text-[#d4b36d] drop-shadow-[0_6px_16px_rgba(197,160,89,0.14)] [-webkit-text-stroke:0.5px_#ffffcc]">{content.headline.split(' - ')[1] || ''}</span>
          </h2>
          <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0">{content.description}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a className="bg-secondary text-white px-8 py-3.5 md:py-4 rounded-full font-bold text-center hover:opacity-90 transition-all hover:cursor-pointer text-sm md:text-base" href="#lead-form">Giữ ưu đãi ngay</a>
            <button className="bg-white/60 border border-white/20 text-black px-8 py-3.5 md:py-4 rounded-full font-bold hover:bg-white/20 transition-all hover:cursor-pointer text-sm md:text-base">Mua ngay với ưu đãi</button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-6 md:py-10 overflow-hidden">
          <div className="inline-block bg-secondary px-4 py-1 rounded-full text-[10px] md:text-sm font-bold animate-pulse mb-6">
            {content.timerLabel}
          </div>
          <div className="relative border-[6px] md:border-[10px] border-slate-800 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.3)] md:shadow-[0_0_50px_rgba(37,99,235,0.3)] scale-[0.8] sm:scale-100 origin-center transition-transform">
            <Wheel
              mustStartSpinning={mustStartSpinning}
              prizeNumber={prizeNumber}
              data={data}
              onStopSpinning={handleStopSpinning}
              outerBorderColor="#1e293b"
              outerBorderWidth={5}
              innerBorderColor="#ffffff"
              radiusLineColor="#ffffff"
              radiusLineWidth={1}
              textDistance={60}
              fontSize={14}
            />

            {/* Nút Quay trung tâm được trang trí lại */}
            <button
              onClick={handleSpinClick}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     bg-white text-blue-600 w-20 h-20 rounded-full 
                     flex items-center justify-center font-black shadow-2xl 
                     hover:bg-blue-50 transition-all z-20 border-4 border-blue-600
                     active:scale-90 select-none"
            >
              QUAY
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 
