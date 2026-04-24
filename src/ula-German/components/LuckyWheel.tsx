import React from 'react';
import { Wheel } from 'react-custom-roulette';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';
import { luckyWheelDefault } from '../pages/admin/adminData';
import { ADMIN_SECTION_KEYS } from '../pages/admin/adminSections';
import { useLandingSection } from '../pages/admin/hooks/useLandingSection';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';

type LuckyWheelSection = {
  timerLabel: string;
  headline: string;
  subHeadline?: string;
  description: string;
  prizes: typeof luckyWheelDefault;
};

export default function LuckyWheel({ onWin }: { onWin: (prize: { option: string; code: string }) => void }) {
  const { content } = useLandingSection<LuckyWheelSection>(
    ADMIN_SECTION_KEYS.luckyWheel,
    {
      timerLabel: 'Ưu đãi kết thúc sau: 24:00:00',
      headline: 'Ưu đãi cực sốc',
      subHeadline: 'Giảm 40% học phí',
      description: 'Nhập mã ULA40GER để nhận ưu đãi 40% cho khoá lộ trình từ A1 - B1 và thêm quà tặng từ vòng quay may mắn.',
      prizes: luckyWheelDefault,
    },
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  const safePrizes = React.useMemo(
    () => (Array.isArray(content.prizes) && content.prizes.length > 0 ? content.prizes : luckyWheelDefault),
    [content.prizes],
  );

  const data = React.useMemo(() => safePrizes.map((prize) => ({
    option: prize.option,
    code: prize.code,
    probability: prize.probability && prize.probability > 0 ? prize.probability : 1,
    style: { backgroundColor: prize.backgroundColor, textColor: prize.textColor },
  })), [safePrizes]);

  const [mustStartSpinning, setMustStartSpinning] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const endTime = React.useMemo(() => {
    const now = new Date();
    const duration =
      (3 * 24 * 60 * 60 +   // 3 ngày
        18 * 60 * 60 +       // 18 giờ
        36 * 60 +            // 36 phút
        35) * 1000;          // 35 giây

    return new Date(now.getTime() + duration);
  }, []);

  React.useEffect(() => {
    if (prizeNumber >= data.length) {
      setPrizeNumber(0);
    }
  }, [data.length, prizeNumber]);

  const handleSpinClick = () => {
    if (data.length === 0) {
      return;
    }

    if (!mustStartSpinning) {
      // 1. Tính tổng trọng số
      const totalWeight = data.reduce((sum, item) => sum + item.probability, 0);

      // 2. Chọn một số ngẫu nhiên trong khoảng [0, totalWeight)
      let random = Math.random() * totalWeight;

      // 3. Tìm giải thưởng tương ứng
      let newPrizeNumber = 0;
      for (let i = 0; i < data.length; i++) {
        if (random < data[i].probability) {
          newPrizeNumber = i;
          break;
        }
        random -= data[i].probability;
      }

      setPrizeNumber(newPrizeNumber);
      setMustStartSpinning(true);
    }
  };

  const handleStopSpinning = () => {
    setMustStartSpinning(false);
    const winPrize = safePrizes[prizeNumber] ?? safePrizes[0];
    if (!winPrize) {
      return;
    }

    // 1. Notify parent (đảm bảo có code)
    onWin({
      option: winPrize.option,
      code: winPrize.code || `ULA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    });

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
      html: `
        <div class="flex flex-col items-center gap-4 py-4">
          <div class="text-lg text-slate-600 font-medium">
            Bạn đã may mắn quay trúng:
          </div>
          <div class="text-3xl md:text-4xl font-black text-[#b59449] uppercase tracking-tight">
            ${winPrize.option}
          </div>
          <div class="text-sm text-slate-400 mt-2">
            Đừng bỏ lỡ! Hãy để lại thông tin để nhận mã quà tặng ngay.
          </div>
        </div>
      `,
      imageUrl: 'https://i.postimg.cc/CKcPnFZZ/con-ula-(1).png',
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: 'Gift Icon',
      confirmButtonText: 'NHẬN QUÀ NGAY',
      confirmButtonColor: '#1a2b48',
      background: '#ffffff',
      returnFocus: false,
      padding: '2rem',
      customClass: {
        popup: 'rounded-[2.5rem] border-0 shadow-[0_20px_50px_rgba(0,0,0,0.2)]',
        title: 'text-3xl font-black text-[#1a2b48] tracking-tighter pt-4',
        confirmButton: 'px-8 py-4 rounded-full text-sm font-bold tracking-widest hover:scale-105 transition-transform'
      },
      buttonsStyling: true,
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut animate__faster'
      }
    }).then(() => {
      // Cuộn xuống LeadForm
      document.getElementById('lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <section className="py-4 md:py-8 text-white rounded-[2rem] md:rounded-[3rem] bg-white mx-4 md:mx-6 mb-20 md:mb-24 overflow-hidden relative reveal [transform:translateZ(0)]" id="luckywheel">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_50%)] opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
        <div className="space-y-6 md:space-y-8 text-center md:text-left">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-red-600">Ưu đãi có hạn</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-[1.1] text-slate-900 tracking-tight">
            {content.headline}
          </h2>
          {content.subHeadline && (
            <div className="inline-block mt-2 text-4xl sm:text-5xl md:text-5xl font-extrabold bg-clip-text text-[#e0a31d] drop-shadow-[0_6px_16px_rgba(197,160,89,0.14)] [-webkit-text-stroke:0.5px_#ffffcc] drop-shadow-sm filter brightness-110 ">
              {content.subHeadline}
            </div>
          )}
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a className="bg-secondary text-white px-8 py-3.5 md:py-4 rounded-full font-extrabold text-center hover:opacity-90 transition-all hover:cursor-pointer text-[24px] md:text-base" href="#lead-form" style={{ fontSize: '24px' }}>Giữ ưu đãi ngay</a>
            {/* <button className="bg-white/60 border border-white/20 text-black px-8 py-3.5 md:py-4 rounded-full font-bold hover:bg-white/20 transition-all hover:cursor-pointer text-sm md:text-base">Mua ngay với ưu đãi</button> */}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-6 md:py-10 overflow-hidden">
          <div className="flex flex-col items-center mb-8 p-4 md:p-6 rounded-2xl shadow-sm backdrop-blur-sm">
            <p className="text-red-600 font-extrabold mb-4 uppercase tracking-wide text-xs md:text-xl">
              {content.timerLabel.split(':')[0] || 'ƯU ĐÃI KẾT THÚC SAU'}
            </p>
            <FlipClockCountdown
              to={endTime}
              labels={['DAYS', 'HRS', 'MINS', 'SECS']}
              labelStyle={{
                fontSize: isMobile ? 8 : 11,
                marginTop: isMobile ? '6px' : '12px',
                fontWeight: 700,
                color: '#334155',
                textTransform: 'uppercase',
              }}
              digitBlockStyle={{
                width: isMobile ? 32 : 50,
                height: isMobile ? 45 : 70,
                fontSize: isMobile ? 18 : 36,
                backgroundColor: '#ffffff',
                color: '#1e293b',
              }}
              separatorStyle={{
                color: '#1e293b',
                size: isMobile ? '2px' : '5px',
              }}
              duration={0.5}
            />
          </div>
          <div className="relative border-[6px] md:border-[10px] border-slate-800 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.3)] md:shadow-[0_0_50px_rgba(37,99,235,0.3)] scale-[0.8] sm:scale-80 origin-center transition-transform [transform:translateZ(0)]">
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
                     flex items-center justify-center font-extrabold shadow-2xl 
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
