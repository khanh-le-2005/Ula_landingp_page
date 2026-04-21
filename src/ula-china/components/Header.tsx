import React from 'react';
import logoUla from '../../assets/2 LOGO ULA-05.png'

export default function Header() {
  return (
    <header className="flex h-16 bg-[#7f1d1d] items-center justify-between sticky top-0 z-50 px-4 sm:px-20">
      <div className="flex items-center py-4">
        <div className="flex items-center gap-2">
          <img className='w-auto h-10' src={logoUla} alt="ULA Logo" />
        </div>
      </div>
      <div className='flex'>
        <a 
          className="bg-[#dfc38a] text-[#8c1c13] px-5 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95 duration-200 ease-in-out inline-block" 
          href="#lead-form"
        >
          Học thử ngay
        </a>
      </div>
    </header>
  );
}
