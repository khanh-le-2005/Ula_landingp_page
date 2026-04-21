import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lock, User, LayoutDashboard, Terminal, Activity, LogOut, ShieldCheck, Fingerprint } from 'lucide-react';
import { loginAdmin } from '../adminApi';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminInput, adminLabel, adminPrimaryButton, adminCardMuted, adminShell, adminAccentText } from '../adminTheme';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, setSession, clearSession, isAuthenticated } = useAdminAuth();

  // LOGIC GIỮ NGUYÊN 100%
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/admin';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await loginAdmin(username.trim(), password);
      setSession(response.data.accessToken, response.data.user_info);
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Đăng nhập thất bại';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className={`${adminShell} relative overflow-hidden min-h-screen flex items-center justify-center p-6 bg-slate-50`}>
      {/* Aurora Background Effects - Giữ nguyên hiệu ứng nền */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] h-[70%] w-[70%] rounded-full bg-indigo-100/50 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[70%] w-[70%] rounded-full bg-violet-100/50 blur-[130px]" />
        <div className="absolute top-[30%] right-[20%] h-[40%] w-[40%] rounded-full bg-cyan-50/50 blur-[110px]" />
      </div>

      {/* Main Card - Thu nhỏ max-w xuống 480px và bỏ grid */}
      <div className="relative z-10 w-full max-w-[480px] rounded-[40px] border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Bỏ các class border phân cách cột */}
        <main className="flex flex-col items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-[360px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* Header - Căn giữa toàn bộ text */}
            <div className="mb-10 text-center">
              <div className="relative inline-flex mb-8">
                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10" />
                <div className="relative h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl flex">
                  <Fingerprint className="h-9 w-9" />
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-3">
                Cổng <span className={adminAccentText}>Truy cập</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
                Nhập thông tin để quản lý ULA Content Studio.
              </p>
            </div>

            {/* Form đăng nhập */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className={adminLabel}>Tên đăng nhập</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`${adminInput} pl-12 h-14 w-full`}
                    placeholder="Nhập tài khoản"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className={adminLabel}>Mã bảo mật</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${adminInput} pl-12 h-14 w-full`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-bold text-rose-600 animate-shake">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${adminPrimaryButton} w-full h-14 !text-base !tracking-wider flex justify-center items-center group`}
              >
                {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
                {!isSubmitting && <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />}
              </button>
            </form>

            {/* Thông tin tài khoản Test (Đẩy xuống một chút với mt-8) */}
            <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-left">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">
                <ShieldCheck className="h-4 w-4" />
                Tài khoản thử nghiệm
              </div>
              <div className="flex justify-between items-center font-mono text-xs text-slate-500">
                <div>ID: <span className="text-slate-900 font-bold">admin</span></div>
                <div>PK: <span className="text-slate-900 font-bold">123</span></div>
              </div>
            </div>

            {/* Copyright dời từ Aside qua */}
            <div className="mt-8 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">ULA Studio &copy; 2026</p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
