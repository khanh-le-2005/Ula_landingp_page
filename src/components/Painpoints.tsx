import React from 'react';
import { Bot } from 'lucide-react';

export default function Painpoints() {
  return (
    <section className="bg-[radial-gradient(circle_at_center,_#00174b_0%,_#00081a_100%)] py-24 px-6 relative overflow-hidden min-h-[800px] flex items-center justify-center" id="painpoints">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[linear-gradient(0deg,_rgba(0,210,255,0.4)_0%,_transparent_100%)] [clip-path:polygon(45%_0%,_55%_0%,_100%_100%,_0%_100%)] opacity-30"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[800px] bg-[linear-gradient(0deg,_rgba(0,210,255,0.4)_0%,_transparent_100%)] [clip-path:polygon(45%_0%,_55%_0%,_100%_100%,_0%_100%)] opacity-20 rotate-12"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[800px] bg-[linear-gradient(0deg,_rgba(0,210,255,0.4)_0%,_transparent_100%)] [clip-path:polygon(45%_0%,_55%_0%,_100%_100%,_0%_100%)] opacity-20 -rotate-12"></div>
      </div>
      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-32 text-center tracking-tight drop-shadow-lg">
          ULA hiểu nỗi lo của phụ huynh và học sinh
        </h2>
        <div className="relative w-full max-w-4xl h-[500px] flex items-center justify-center">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_0%,_rgba(0,210,255,0.5)_40%,_transparent_70%)] opacity-90 rounded-full blur-3xl"></div>
              <div className="relative z-20 w-48 md:w-64 transform translate-y-10">
                <div className="flex flex-col items-center">
                  <div className="bg-white rounded-full p-2 shadow-[0_0_50px_rgba(255,255,255,0.8)] relative">
                    <Bot className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] text-slate-800" strokeWidth={1.5} />
                    <div className="absolute top-[40%] left-[30%] w-3 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-[40%] right-[30%] w-3 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="mt-[-20px] bg-slate-700 w-32 h-16 rounded-t-lg border-t-4 border-slate-500 flex items-center justify-center shadow-xl">
                    <div className="w-12 h-1 bg-blue-400/50 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-16 border-2 border-blue-400/30 rounded-[100%] shadow-[0_0_30px_rgba(0,210,255,0.4)]"></div>
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 h-12 border border-blue-400/20 rounded-[100%]"></div>
            </div>
          </div>
          
          {/* Bubbles */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-44 h-44 rounded-full bg-[#0095ff1a] border-4 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.6),inset_0_0_15px_rgba(0,210,255,0.3)] backdrop-blur-md flex items-center justify-center p-6 text-center animate-float z-30">
            <p className="text-white font-bold text-sm leading-tight">CÁC CÔNG CỤ AI HIỆU QUẢ, MIỄN PHÍ</p>
          </div>
          <div className="absolute top-0 left-[5%] md:left-[10%] w-36 h-36 rounded-full bg-[#0095ff1a] border-4 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.6),inset_0_0_15px_rgba(0,210,255,0.3)] backdrop-blur-md flex items-center justify-center p-4 text-center animate-float-delayed z-30">
            <p className="text-white font-bold text-xs leading-tight">TIẾNG ĐỨC QUÁ KHÓ - NGỮ PHÁP PHỨC TẠP</p>
          </div>
          <div className="absolute top-[40%] -left-4 md:left-0 w-40 h-40 rounded-full bg-[#0095ff1a] border-4 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.6),inset_0_0_15px_rgba(0,210,255,0.3)] backdrop-blur-md flex items-center justify-center p-5 text-center animate-float-slow z-30">
            <p className="text-white font-bold text-sm leading-tight">CHI PHÍ RỦI RO LỚN - ĐẦU TƯ TRĂM TRIỆU</p>
          </div>
          <div className="absolute bottom-10 left-[5%] md:left-[10%] w-32 h-32 rounded-full bg-[#0095ff1a] border-4 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.6),inset_0_0_15px_rgba(0,210,255,0.3)] backdrop-blur-md flex items-center justify-center p-4 text-center animate-float z-30">
            <p className="text-white font-bold text-xs leading-tight">NHỮNG CASE STUDY THỰC TẾ</p>
          </div>
          <div className="absolute top-0 right-[5%] md:right-[10%] w-36 h-36 rounded-full bg-[#0095ff1a] border-4 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.6),inset_0_0_15px_rgba(0,210,255,0.3)] backdrop-blur-md flex items-center justify-center p-4 text-center animate-float-delayed z-30">
            <p className="text-white font-bold text-xs leading-tight">LỚP OFFLINE ĐÔNG - THIẾU TƯƠNG TÁC</p>
          </div>
          <div className="absolute top-[40%] -right-4 md:right-0 w-40 h-40 rounded-full bg-[#0095ff1a] border-4 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.6),inset_0_0_15px_rgba(0,210,255,0.3)] backdrop-blur-md flex items-center justify-center p-5 text-center animate-float-slow z-30">
            <p className="text-white font-bold text-sm leading-tight">HỌC XONG LẠI QUÊN - THIẾU MÔI TRƯỜNG</p>
          </div>
          <div className="absolute bottom-10 right-[5%] md:right-[10%] w-32 h-32 rounded-full bg-[#0095ff1a] border-4 border-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.6),inset_0_0_15px_rgba(0,210,255,0.3)] backdrop-blur-md flex items-center justify-center p-4 text-center animate-float z-30">
            <p className="text-white font-bold text-xs leading-tight">CÁC VIDEO BÀI GIẢNG NGẮN</p>
          </div>
        </div>
      </div>
    </section>
  );
}
