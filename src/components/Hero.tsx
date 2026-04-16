import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full bg-[radial-gradient(circle_at_75%_50%,_#1e293b_0%,_#0f172a_100%)] min-h-[90vh] flex items-center overflow-hidden pt-16" id="home">
      <div className="flex flex-col md:flex-row w-full items-center justify-center">
        <div className="w-full md:w-1/2 px-6 md:pl-20 py-12 md:py-24 z-10 space-y-8">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/20 text-white text-[0.75rem] font-bold uppercase tracking-wider border border-white/10">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span> GIẢI PHÁP HỌC TIẾNG ĐỨC 5.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white">
            Học tiếng Đức từ sớm. <br />
            <span className="text-primary-container">Không cần giỏi, chỉ cần đúng cách.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
            Học tiếng Đức thông minh cùng AI. Chỉ 30p/ngày tại nhà với video bài giảng + AI sửa phát âm + lộ trình rõ từng ngày.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group" href="#lead-form">
              Học thử miễn phí <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Nhận tư vấn lộ trình
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative flex items-center justify-center p-6 md:p-12">
          <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-10 bg-slate-800/30 backdrop-blur-sm">
            <img alt="ULA Learning Interface Mockup" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoYclI5fGBJ-Il1_bZQidSx47lG-xqXULDPGAh6YsMjGYK6MvJ11-UVSQQ8jagw28XciY0dXG0BaK04HM2LrM0sHyXmjG22lgC2KPczeU5p4lWbJOGjRrJMW7sPNeYR1ng_4KV1iwiHI5LcflDmV53MZeG3b_tYrruLScODhFiPwQuuc_ZQuDsuYygTAHITYvzyqVtVJ1NwHniwYlo75x0PHYF5KVxM_OUqPQkJlBVzZIE93WrIBFUuQkuY3QtY7l7Nf6eYEE2O0me" />
          </div>
        </div>
      </div>
    </section>
  );
}
