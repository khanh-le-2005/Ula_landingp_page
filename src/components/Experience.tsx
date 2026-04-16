import React from 'react';
import { CheckCircle2, PlayCircle } from 'lucide-react';

export default function Experience() {
  return (
    <section className="py-20 bg-on-background text-white rounded-t-xl overflow-hidden" id="teachers">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button className="px-6 py-3 rounded-full bg-primary font-bold text-sm">Video bài giảng</button>
          <button className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 font-bold text-sm transition-all">Bài tập tương tác</button>
          <button className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 font-bold text-sm transition-all">AI chấm chữa</button>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold">Trải nghiệm học tập tương tác thực tế</h3>
            <p className="text-slate-400 leading-relaxed">Không chỉ là xem video, bạn sẽ tham gia trực tiếp vào bài giảng, trả lời câu hỏi và nhận phản hồi ngay lập tức từ AI.</p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary w-6 h-6" />
                <span>Phụ đề song ngữ thông minh</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="text-primary w-6 h-6" />
                <span>AI chỉnh lỗi phát âm từng từ</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl overflow-hidden shadow-2xl aspect-video relative group border border-white/10">
            <img alt="Learning Experience" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2tSjRs5Cx3UzXbcXMyQTmgovZppDJ1BP399RHNviop7_b1TSze4vOx9oe_tLW3DyE_eH1cQ8o8dyir1r9fk7jHk3Jha4ZtQRj8oCrEc69xIRWlo9s1a-nviMg2QbyBVeX0ympQe7gtYZ98OvnM-NcqknDq3SA1OCxcOwRPlj236lJs1keSlwQ0-xr9ezojoExKUA7GZYqfbytFk6Ft_FNjT0l2bJVYl_wyZvg1ObQf6oIiPHUtfArrr5i57NOue46cB_s-8lVfZsS" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all cursor-pointer">
              <PlayCircle className="w-20 h-20 text-white opacity-80" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
