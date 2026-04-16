import React from 'react';
import { Headset, GraduationCap, Bot, BookOpen, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

export default function LeadForm({ wonPrize }: { wonPrize: { option: string } | null }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone')
    };

    try {
      // Giả lập gọi API (vì API /api/leads có thể chưa tồn tại hoặc chỉ là mock)
      // const response = await fetch('/api/leads', { ... });

      // Giả sử đăng ký thành công
      const isSuccess = true;

      if (isSuccess) {
        if (wonPrize) {
          // Hiện mã quà tặng nếu đã quay trúng
          Swal.fire({
            title: 'ĐĂNG KÝ THÀNH CÔNG!',
            html: `
              <div class="space-y-4">
                <p class="text-slate-600">Thông tin của bạn đã được ghi lại. Đây là món quà bạn đã giành được:</p>
                <div class="bg-blue-50 border-2 border-dashed border-blue-200 p-6 rounded-2xl">
                  <div class="text-blue-600 font-black text-2xl uppercase">${wonPrize.option}</div>
                  <div class="mt-2 text-slate-500 text-sm">Mã quà tặng của bạn:</div>
                  <div class="mt-1 text-slate-900 font-mono font-bold text-3xl tracking-widest bg-white py-2 rounded-lg shadow-sm border border-slate-100 uppercase">
                    ULA${Math.floor(1000 + Math.random() * 9000)}
                  </div>
                </div>
                <p class="text-xs text-slate-400 italic">Chụp ảnh màn hình mã này và gửi cho ULA khi được tư vấn nhé!</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Tuyệt vời!',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'rounded-3xl',
              title: 'text-2xl font-bold text-blue-600'
            }
          });
        } else {
          // Hiện thông báo bình thường nếu chưa quay
          Swal.fire({
            title: 'ĐĂNG KÝ THÀNH CÔNG!',
            text: 'ULA sẽ liên hệ với bạn trong vòng 30 phút để tư vấn lộ trình học phù hợp nhất.',
            icon: 'info',
            confirmButtonText: 'Đồng ý',
            confirmButtonColor: '#2563eb',
            customClass: {
              popup: 'rounded-3xl',
              title: 'text-2xl font-bold text-blue-600'
            }
          });
        }
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'CÓ LỖI XẢY RA',
        text: 'Vui lòng thử lại sau hoặc liên hệ hotline để được hỗ trợ.',
        icon: 'error',
        confirmButtonColor: '#2563eb'
      });
    }
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center" id="lead-form">
      <div className="space-y-8 relative">
        <h2 className="text-3xl md:text-4xl font-bold">Bắt đầu hành trình chinh phục tiếng Đức ngay hôm nay</h2>
        <p className="text-on-surface-variant text-lg">Để lại thông tin, đội ngũ cố vấn học tập của ULA sẽ liên hệ hỗ trợ bạn trong vòng 30 phút.</p>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Headset className="text-primary w-8 h-8" />
            <div>
              <div className="font-bold">Tư vấn 1:1 miễn phí</div>
              <div className="text-sm text-on-surface-variant">Thiết kế lộ trình riêng theo mục tiêu cá nhân</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <GraduationCap className="text-primary w-8 h-8" />
            <div>
              <div className="font-bold">Học thử 3 ngày</div>
              <div className="text-sm text-on-surface-variant">Trải nghiệm toàn bộ tính năng cao cấp của app</div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-16 -left-12 w-48 h-48 opacity-20 pointer-events-none hidden lg:block">
          <Bot className="w-[120px] h-[120px] text-primary" />
        </div>
      </div>
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-outline-variant/10">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold mb-2">Họ và tên *</label>
            <input name="name" className="w-full bg-surface-container-high border-none rounded-full focus:ring-2 focus:ring-primary p-4 outline-none" placeholder="Nhập tên của bạn" required type="text" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Số điện thoại *</label>
            <input name="phone" className="w-full bg-surface-container-high border-none rounded-full focus:ring-2 focus:ring-primary p-4 outline-none" placeholder="Ví dụ: 0912345678" required type="tel" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Email *</label>
            <input name="email" className="w-full bg-surface-container-high border-none rounded-full focus:ring-2 focus:ring-primary p-4 outline-none" placeholder="Ví dụ: [EMAIL_ADDRESS]" required type="email" />
          </div>

          <div className="group relative">
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-primary">
              Khóa học bạn quan tâm *
            </label>

            <div className="relative flex items-center">
              {/* Icon trang trí bên trái */}
              <div className="absolute left-4 text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none">
                <BookOpen size={20} />
              </div>

              <select
                name="course"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 pr-12 outline-none appearance-none cursor-pointer
                 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 
                 hover:border-slate-300 transition-all duration-300 text-slate-700 font-medium mb-3"
                required
              >
                <option value="" disabled selected>Chọn khóa học của bạn</option>
                <optgroup label="Tiếng Đức phổ thông">
                  <option value="A1">Trình độ A1 (Cơ bản)</option>
                  <option value="A2">Trình độ A2 (Sơ cấp)</option>
                  <option value="B1">Trình độ B1 (Trung cấp)</option>
                  <option value="B2">Trình độ B2 (Trên trung cấp)</option>
                </optgroup>
                <optgroup label="Tiếng Đức nâng cao">
                  <option value="C1">Trình độ C1 (Cao cấp)</option>
                  <option value="C2">Trình độ C2 (Thành thạo)</option>
                </optgroup>
              </select>

              {/* Custom Arrow Icon (thay cho mũi tên mặc định) */}
              <div className="absolute right-4 text-slate-400 pointer-events-none group-hover:translate-y-0.5 transition-transform">
                <ChevronDown size={20} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 m">Lời nhắn *</label>
              <input name="message" className="w-full h-20 bg-surface-container-high border-2 border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary p-4 outline-none mb-5" placeholder="" required type="message" />
            </div>

            <div>
              <button type="submit" className="w-full bg-primary text-white font-bold rounded-full p-4 hover:bg-primary/90 transition-colors">
                Đăng ký ngay
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
