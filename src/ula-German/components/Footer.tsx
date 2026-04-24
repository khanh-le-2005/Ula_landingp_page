import React, { useState } from "react";
import { Facebook, MapPin, Phone, Mail, Building, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const TiktokIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer: React.FC = () => {
  const location = useLocation();
  const [registerEmail, setRegisterEmail] = useState("");

  const isChinesePage = location.pathname.includes("/chinese");
  const socialLinks = {
    facebook: isChinesePage
      ? "https://www.facebook.com/Ulachinesehoctiengtrung"
      : "https://www.facebook.com/profile.php?id=100091877482468",
    tiktok: isChinesePage
      ? "https://www.tiktok.com/@ulachineseofficial"
      : "https://www.tiktok.com/@ulagermanofficial",
    email: "mailto:Support@ulaedu.com",
  };
  const registerRouteState = {
    authVariant: isChinesePage ? "chinese" : "german",
    from: {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
    },
    prefillEmail: registerEmail.trim() || undefined,
  };

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#1a2b48] py-12 font-inter text-white lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="https://i.postimg.cc/28J9HBkJ/logo_01.png"
                alt="Ula Education Logo"
                className="h-10 w-auto object-contain brightness-110 md:h-12"
              />
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-300">
              Dẫn đầu công nghệ đào tạo ngoại ngữ 4.0. Đồng hành cùng bạn trên con đường
              chinh phục chứng chỉ quốc tế.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#7db7ff]/25 bg-[linear-gradient(145deg,rgba(59,130,246,0.26),rgba(15,23,42,0.6))] text-[#dbeafe] shadow-[0_14px_30px_rgba(37,99,235,0.24)] transition-all hover:-translate-y-1 hover:scale-[1.06] hover:border-[#93c5fd]/60 hover:bg-[#1877f2] hover:text-white"
                title="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(15,23,42,0.82))] text-white shadow-[0_14px_30px_rgba(15,23,42,0.3)] transition-all hover:-translate-y-1 hover:scale-[1.06] hover:border-[#f472b6]/45 hover:shadow-[0_18px_34px_rgba(244,114,182,0.22)]"
                title="TikTok"
              >
                <TiktokIcon size={20} />
              </a>
              <a
                href={socialLinks.email}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f7deb0]/30 bg-[linear-gradient(145deg,rgba(223,195,138,0.34),rgba(26,43,72,0.68))] text-[#fff3d6] shadow-[0_14px_30px_rgba(197,160,89,0.24)] transition-all hover:-translate-y-1 hover:scale-[1.06] hover:border-[#f8e6bf]/70 hover:bg-[#dfc38a] hover:text-[#1a2b48]"
                title="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#c5a059]">
              THÔNG TIN LIÊN HỆ
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-300">
              <li className="flex items-start gap-3">
                <Building size={18} className="mt-0.5 shrink-0 text-[#c5a059]" />
                <div>
                  <span className="mb-1 block font-bold uppercase text-white">
                    Công ty cổ phần giáo dục quốc tế ODIN
                  </span>
                  <span className="text-xs text-slate-400">Mã số thuế: 0110649823</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#c5a059]" />
                <span className="leading-relaxed">
                  Số 1 Đông Tác, Phường Kim Liên, Thành phố Hà Nội, Việt Nam
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-[#c5a059]" />
                <span className="font-bold text-white">0986 912 388</span>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#c5a059]">
              PHÁP LÝ & ĐIỀU KHOẢN
            </h4>
            <ul className="space-y-3 text-sm font-medium text-slate-300">
              <li>
                <Link
                  to="/privacy"
                  className="inline-block transition-all hover:translate-x-1 hover:text-white"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="inline-block transition-all hover:translate-x-1 hover:text-white"
                >
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/payment-policy"
                  className="inline-block transition-all hover:translate-x-1 hover:text-white"
                >
                  Chính sách thanh toán
                </Link>
              </li>
            </ul>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <FileText size={18} className="mt-0.5 shrink-0 text-[#c5a059]" />
                <p className="text-xs font-medium leading-relaxed text-slate-400">
                  Giấy chứng nhận hoạt động đào tạo số{" "}
                  <strong className="text-white">1079/QĐ-SGDĐT</strong> cấp ngày 04/05/2024 do
                  Sở Giáo dục và Đào tạo Hà Nội cấp.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col space-y-3">
              <Link
                to="https://www.ulaedu.com/#/german"
                target="_blank"
                className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#c5a059] to-[#dfc38a] py-3 text-sm font-black uppercase tracking-widest text-[#1a2b48] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]"
              >
                Khám phá web học ULA
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs font-medium text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} CÔNG TY CỔ PHẦN GIÁO DỤC QUỐC TẾ ODIN. All rights reserved.</p>
          <p>Proudly developed by Ula Language Team.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
