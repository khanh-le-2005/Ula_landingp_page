import React from 'react';
import logoUla from '../assets/2 LOGO ULA-05.png';
import heroBadge from '../assets/nhanvat1.png';

export default function Header() {
  return (
    <header className="flex h-16 bg-[#004e89] items-center justify-between sticky top-0 z-50">
      <div className="flex items-center py-4 px-20">
        <div className="flex items-center gap-2">
          <img className='w-auto h-10 text-white' src={logoUla} alt="ULA Logo" />
        </div>
      </div>
      <div className='mr-24 flex'>
        <a className="bg-gradient-to-r from-[#c5a059] to-[#dfc38a] text-[#1a2b48] px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95 duration-200 ease-in-out inline-block" href="#lead-form">
          Học thử miễn phí
        </a>
        {/* <div>
          <img className='w-auto h-10 text-white ml-3 rounded-full object-cover' src={heroBadge} alt="ULA badge" />
        </div> */}
      </div>
    </header>
  );
}
