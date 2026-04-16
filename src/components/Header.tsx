import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50  bg-[#004e89] backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-white tracking-tighter">ULA</span>
        </div>
        <div className="hidden lg:flex gap-6 items-center text-sm">
          <a className="text-white hover:text-red-400 font-medium transition-colors" href="#home">Trang chủ</a>
          <a className="text-white hover:text-red-400 font-medium transition-colors" href="#painpoints">Nỗi lo</a>
          <a className="text-white hover:text-red-400 font-medium transition-colors" href="#about">Giải pháp</a>
          <a className="text-white hover:text-red-400 font-medium transition-colors" href="#teachers">Trải nghiệm</a>
          <a className="text-white hover:text-red-400 font-medium transition-colors" href="#methodology">Phương pháp</a>
          <a className="text-white hover:text-red-400 font-medium transition-colors" href="#roadmap">Lộ trình</a>
          <a className="text-white hover:text-red-400 font-medium transition-colors" href="#trust">Học viên</a>
          <a className="text-white hover:text-red-400 font-medium transition-colors" href="#luckywheel">Ưu đãi</a>
        </div>
        <a className="bg-secondary text-white px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95 duration-200 ease-in-out inline-block" href="#lead-form">
          Học thử miễn phí
        </a>
      </div>
    </header>
  );
}
