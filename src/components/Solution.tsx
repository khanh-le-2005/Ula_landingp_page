import React from 'react';

export default function Solution() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto bg-[#f0f3ff]" id="about">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">3 Trụ cột giải pháp từ ULA</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">Kết hợp giữa trí tuệ nhân tạo và phương pháp sư phạm hiện đại.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="bg-[#eff2ff] p-10 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-300 shadow-[0_35px_60px_-15px_rgba(0,74,198,0.3)] hover:shadow-[0_45px_70px_-10px_rgba(0,74,198,0.4)] border border-blue-50/50 hover:-translate-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">HIỆU QUẢ</span>
          <div className="w-24 h-24 rounded-2xl overflow-hidden mb-8 shadow-md">
            <img alt="Efficiency" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeOsTnyH_ii6BwjWXY96wtplXLwx5TexU4UE15MCL5YxDXh8njUipA_BO42VY4uM2dVgjIsH5nTfRvHsktxRsjgMl0onMsymmgrsBW-bvBNUW_fwfSOIiLb6CGHODrD99h2ndGCG-eALjVvY_ra0XIO4JlXXdfrf1_2Fo9yhvVFFUr4n5gpFSDlae75J3KdEQm_YnS9YyYzGgQsgKs7M9r4CMWFKPvtG3f2LRwpUrOTqJDSlIsaSxLrbpcJKQLQYx21Pi9obMKZS0l" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Hiệu quả</h3>
          <p className="text-on-surface-variant leading-relaxed">Video bài giảng từ chuyên gia, hỗ trợ giải đáp 24/7. Lộ trình bắt đầu sớm từ lớp 10-11 để tối ưu thời gian.</p>
        </div>
        <div className="bg-[#eff2ff] p-10 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-300 shadow-[0_35px_60px_-15px_rgba(0,74,198,0.3)] hover:shadow-[0_45px_70px_-10px_rgba(0,74,198,0.4)] border border-blue-50/50 hover:-translate-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">LUYỆN TẬP</span>
          <div className="w-24 h-24 rounded-2xl overflow-hidden mb-8 shadow-md">
            <img alt="Practice" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdzkENU7LQrp4SnNyoCLAucIHLIn0rmO6AEK21hDJP1irR2OKxl51wRLtKthaWP1fjm5nPLmsdAqsGj5W9DAaIGT-1OYWUuTR2M4BVTIUhIbRCohxDbc3JTEFBJM_NkT7q0GUw_64Hkc46AJqrgRk71bYQo2QWafAKUyYKlsCW7q4s8CGRAfGv_eOjLsjzxz7ZDOEwIqvyoEk6dc5O6xZlWv7qT8V4hZVM7K-pCspuASOL-Oyl28TWWbjA1rMV0aTccmvjJDtFJKkI" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Luyện tập</h3>
          <p className="text-on-surface-variant leading-relaxed">Tương tác trực tiếp ngay trong video. AI thông minh hỗ trợ chỉnh sửa phát âm và rèn luyện phản xạ giao tiếp.</p>
        </div>
        <div className="bg-[#eff2ff] p-10 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-300 shadow-[0_35px_60px_-15px_rgba(0,74,198,0.3)] hover:shadow-[0_45px_70px_-10px_rgba(0,74,198,0.4)] border border-blue-50/50 hover:-translate-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">LINH HOẠT &amp; TIẾT KIỆM</span>
          <div className="w-24 h-24 rounded-2xl overflow-hidden mb-8 shadow-md">
            <img alt="Savings" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE5_Dw34jnsax7DErMWwWhxR_G6EuagU3_CvvRsMTzeDnFavAYgKxTHbza8ddCU21aeQLFkwJ_WoG1hPcsdFfz2skCLRx1CslgvCEs4qOZW3NEkLpAZG9fd4tyAwPROS9BDtYA3MVH4BRZ48daVVT77z--pkR1Sq7PimF4QuHFgHywU36vX7uucEXjjxesNK-ETCcARN9g3zPWWauJFVshS4fT7QMnNW1o6nOxG9sFc16YDuQUgcnMSNVkNPQu4gOtZNBu9lpc9Z7f" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Linh hoạt &amp; Tiết kiệm</h3>
          <p className="text-on-surface-variant leading-relaxed">Chỉ từ 10k/ngày (tiết kiệm 80% chi phí). Học mọi lúc, mọi nơi trên mọi thiết bị.</p>
        </div>
      </div>
    </section>
  );
}
