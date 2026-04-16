import React from 'react';
import { Facebook, Youtube, Instagram, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white tracking-tighter">ULA EDU</span>
          </div>
          <p className="text-sm leading-relaxed">
            Giải pháp học tiếng Đức 5.0 thông minh cùng AI. Lộ trình rõ ràng, tiết kiệm thời gian và chi phí, giúp bạn chinh phục giấc mơ Đức dễ dàng hơn.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Khám phá</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#home" className="hover:text-primary transition-colors">Trang chủ</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">Giải pháp 3 trụ cột</a></li>
            <li><a href="#methodology" className="hover:text-primary transition-colors">Phương pháp học</a></li>
            <li><a href="#roadmap" className="hover:text-primary transition-colors">Lộ trình học tập</a></li>
            <li><a href="#trust" className="hover:text-primary transition-colors">Học viên tiêu biểu</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hỗ trợ</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-primary transition-colors">Câu hỏi thường gặp</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Hướng dẫn thanh toán</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Liên hệ</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>Tầng 3, Tòa nhà ULA, Quận Cầu Giấy, Hà Nội</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span>1900 1234</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span>contact@ula.edu.vn</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} ULA EDU. All rights reserved.</p>
      </div>
    </footer>
  );
}
