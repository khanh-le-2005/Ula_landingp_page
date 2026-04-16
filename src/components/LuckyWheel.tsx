import React from 'react';
import { Wheel } from 'react-custom-roulette';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';

export default function LuckyWheel({ onWin }: { onWin: (prize: { option: string }) => void }) {
  const data = [
    { option: 'Voucher 10%', style: { backgroundColor: '#2563eb', textColor: 'white' } },
    { option: 'Khóa học FREE', style: { backgroundColor: '#004ac6', textColor: 'white' } },
    { option: 'Bút ký ULA', style: { backgroundColor: '#ba0a0d', textColor: 'white' } },
    { option: 'Sổ tay Đức', style: { backgroundColor: '#e63329', textColor: 'white' } },
    { option: 'Chúc bạn may mắn', style: { backgroundColor: '#f5a623', textColor: 'black' } },
    { option: 'Tài liệu A1', style: { backgroundColor: '#ffddb4', textColor: 'black' } },
  ];

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
    <section className="py-24 bg-on-background text-white rounded-[3rem] mx-6 mb-24 overflow-hidden relative" id="luckywheel">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_50%)] opacity-20"></div>
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-block bg-secondary px-4 py-1 rounded-full text-sm font-bold animate-pulse">
            Ưu đãi kết thúc sau: 00:59:59
          </div>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">Vòng quay may mắn - <span className="text-tertiary-fixed">Nhận quà cực khủng!</span></h2>
          <p className="text-slate-400 text-lg">Chỉ cần đăng ký thông tin để nhận 01 lượt quay miễn phí với cơ hội trúng học bổng lên đến 50%.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a className="bg-secondary text-white px-8 py-4 rounded-full font-bold text-center hover:opacity-90 transition-all" href="#lead-form">Giữ ưu đãi ngay</a>
            <button className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all">Mua ngay với ưu đãi</button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative border-[10px] border-slate-800 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.3)]">
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
              fontSize={16}
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
