import React, { useEffect, useState } from 'react';
import { Settings, Save, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, Tag, Info } from 'lucide-react';
import { fetchSiteConfig, updateSiteConfig, type SiteConfig } from '../adminApi';
import { useSiteContext } from '../../../../ula-chinese/context/LandingSiteContext';
import { 
  adminCard, 
  adminInput, 
  adminLabel, 
  adminPrimaryButton, 
  adminSecondaryButton, 
  adminAccentText 
} from '../adminTheme';

export default function SiteConfig() {
  const { siteKey } = useSiteContext();
  const [config, setConfig] = useState<SiteConfig>({
    discountText: '',
    sitePromoCode: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadConfig = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSiteConfig(siteKey);
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải cấu hình');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadConfig();
  }, [siteKey]);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateSiteConfig(config, siteKey);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu cấu hình');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Đang tải cấu hình hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <section className={adminCard}>
        <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-2">
              <Settings className="w-3 h-3 text-indigo-500" />
              Hệ thống (DE)
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Cấu hình <span className={adminAccentText}>Chung</span>
            </h2>
            <p className="mt-2 text-slate-500 text-sm font-medium">
              Quản lý các thông số cốt lõi áp dụng cho toàn bộ trang web (Tiếng {siteKey === 'tieng-duc' ? 'Đức' : 'Trung'}).
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => void loadConfig()} 
              disabled={isSaving}
              className={adminSecondaryButton}
            >
              <RefreshCw className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className={adminPrimaryButton}
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in shake-in duration-300">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-rose-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 animate-in zoom-in-95 duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-emerald-700">Đã cập nhật cấu hình hệ thống thành công!</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Discount Text Field */}
          <div className="space-y-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-indigo-500/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-indigo-500">
                  <Tag className="w-4 h-4" />
                </div>
                <label className={adminLabel}>Thông điệp Ưu đãi</label>
              </div>
              <div className="px-2 py-1 rounded-lg bg-indigo-50 text-[8px] font-black text-indigo-600 uppercase tracking-wider">
                Global Display
              </div>
            </div>
            
            <textarea
              className={`${adminInput} min-h-[100px] resize-none leading-relaxed`}
              placeholder="Ví dụ: Ưu đãi mừng khai trương 40%"
              value={config.discountText}
              onChange={(e) => setConfig({ ...config, discountText: e.target.value })}
            />
            
            <div className="flex items-start gap-2 pt-2 text-slate-400">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium leading-normal italic">
                Dòng chữ này sẽ xuất hiện ở các vị trí quan trọng như Badge đầu trang hoặc các banner khuyến mãi chính.
              </p>
            </div>
          </div>

          {/* Promo Code Field */}
          <div className="space-y-4 p-6 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-amber-500/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-amber-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <label className={adminLabel}>Mã giảm giá mặc định</label>
              </div>
              <div className="px-2 py-1 rounded-lg bg-amber-50 text-[8px] font-black text-amber-600 uppercase tracking-wider">
                Universal Code
              </div>
            </div>
            
            <input
              type="text"
              className={`${adminInput} font-mono font-bold text-amber-600 uppercase tracking-widest text-center text-lg`}
              placeholder="Ví dụ: ULA-OPEN-50"
              value={config.sitePromoCode}
              onChange={(e) => setConfig({ ...config, sitePromoCode: e.target.value.toUpperCase().replace(/\s+/g, '') })}
            />
            
            <div className="flex items-start gap-2 pt-2 text-slate-400">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <p className="text-[10px] font-medium leading-normal italic">
                Mã này sẽ tự động được áp dụng khi khách hàng nhấn vào các nút đăng ký trên Landing Page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Info */}
      <div className="rounded-[2.5rem] bg-indigo-900 p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
        <div className="relative z-10">
          <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-300 mb-6 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-indigo-500"></span>
            Hướng dẫn sử dụng
          </h4>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-lg font-bold">Cấu hình Gốc (Site Config) là gì?</p>
              <p className="text-sm text-indigo-100/70 leading-relaxed">
                Đây là các thông số "mặc định" của trang web. Nếu một khách hàng truy cập vào trang web thông thường (không qua link Tag chiến dịch), họ sẽ thấy các thông tin này.
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-lg font-bold">Quan trọng:</p>
              <p className="text-sm text-indigo-100/70 leading-relaxed">
                Khi bạn tạo một <strong>Tag Chiến dịch</strong>, bạn có thể ghi đè (Override) các thông số này để dành riêng cho KOL hoặc sự kiện đó. Cấu hình ở đây đóng vai trò là "điểm tựa" khi không có Tag nào được áp dụng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
