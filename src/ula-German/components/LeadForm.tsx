import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Copy, Gift } from "lucide-react";
import consultationBackdrop from "../../assets/69e1e7411e24b12446a443da.jpg";
import { submitLeadRegistration } from "../pages/admin/adminApi";
import { resolveTrackingData } from "../utils/tracking";

export type ConsultationVariant = "german" | "chinese";

export type ConsultationModalOptions = {
  variant?: ConsultationVariant;
  programName?: string;
  source?: string;
};

type ConsultationModalProps = {
  isOpen?: boolean;
  options?: ConsultationModalOptions;
  onClose?: () => void;
  wonPrize?: { option: string; code: string } | null;
};

type ConsultationFormState = {
  fullName: string;
  phone: string;
  email: string;
  courseInterest: string;
  note: string;
};

type ConsultationField = keyof ConsultationFormState;

type ConsultationTheme = {
  focus: string;
  focusWithin: string;
  submitButton: string;
  shellGlow: string;
  shellGradient: string;
  courseOptions: string[];
};

const INITIAL_FORM: ConsultationFormState = {
  fullName: "",
  phone: "",
  email: "",
  courseInterest: "",
  note: "",
};

const GERMAN_THEME: ConsultationTheme = {
  focus: "focus:border-[#d7b86f] focus:ring-[#d7b86f]/20",
  focusWithin: "focus-within:border-[#d7b86f] focus-within:ring-[#d7b86f]/20",
  submitButton:
    "bg-[#e5c986] text-[#1a2b48] hover:bg-[#dbbd73] shadow-[0_18px_36px_rgba(228,199,132,0.28)]",
  shellGlow: "shadow-[0_36px_90px_rgba(124,111,197,0.28)]",
  shellGradient: "bg-[linear-gradient(135deg,#d9dcff_0%,#efedff_48%,#d4cbff_100%)]",
  courseOptions: [
    "Lộ trình mất gốc đến B1",
    "Khóa tiếng Đức A1",
    "Khóa tiếng Đức A2",
    "Khóa tiếng Đức B1",
    "Khóa tiếng Đức B2",
    "Khóa tiếng Đức C1",
  ],
};

const CHINESE_THEME: ConsultationTheme = {
  focus: "focus:border-[#e3b46d] focus:ring-[#e3b46d]/20",
  focusWithin: "focus-within:border-[#e3b46d] focus-within:ring-[#e3b46d]/20",
  submitButton:
    "bg-[#e5c986] text-[#1a2b48] hover:bg-[#dbbd73] shadow-[0_18px_36px_rgba(228,199,132,0.28)]",
  shellGlow: "shadow-[0_36px_90px_rgba(124,111,197,0.28)]",
  shellGradient: "bg-[linear-gradient(135deg,#d9dcff_0%,#efedff_48%,#d4cbff_100%)]",
  courseOptions: [
    "Lộ trình mất gốc đến HSK 1",
    "Khóa tiếng Trung HSK 1",
    "Khóa tiếng Trung HSK 2",
    "Khóa tiếng Trung HSK 3",
    "Luyện thi HSK / HSKK",
  ],
};

const labelClassName = "mb-1 block text-[0.96rem] font-black text-[#1a2b48] tracking-[-0.01em]";
const inputClassName = "h-[2.7rem] w-full rounded-[1.05rem] border border-[#d9dbe7] bg-[#f7f7fb] px-4 text-[0.96rem] font-medium text-[#1a2b48] outline-none transition-all";
const fieldErrorClassName = "mt-1.5 text-[13px] font-medium text-red-500";

const DEFAULT_OPTIONS: ConsultationModalOptions = { variant: "german" };
const DEFAULT_ONCLOSE = () => { };

const LeadForm: React.FC<ConsultationModalProps> = ({
  isOpen = true,
  options = DEFAULT_OPTIONS,
  onClose = DEFAULT_ONCLOSE,
  wonPrize,
}) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState<ConsultationFormState>(INITIAL_FORM);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("Đăng ký nhận ưu đãi Thành Công");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ConsultationField, string>>>({});

  const theme = useMemo(
    () => (options?.variant === "chinese" ? CHINESE_THEME : GERMAN_THEME),
    [options?.variant],
  );

  const courseOptions = useMemo(() => {
    if (options?.programName && !theme.courseOptions.includes(options.programName)) {
      return [options.programName, ...theme.courseOptions];
    }
    return theme.courseOptions;
  }, [options?.programName, theme.courseOptions]);

  const giftCode = useMemo(() => {
    return wonPrize?.code || "";
  }, [wonPrize]);

  useEffect(() => {
    resolveTrackingData();
  }, []);

  useEffect(() => {
    const prizeNote = `Phần quà may mắn: ${wonPrize?.option}`;
    if (wonPrize && step === "form" && form.note !== prizeNote) {
      setForm((prev) => ({
        ...prev,
        note: prizeNote,
      }));
    }
  }, [wonPrize, step, form.note]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      const resetTimer = window.setTimeout(() => {
        setStep("form");
        setSuccessMessage("Đăng ký nhận ưu đãi Thành Công");
        setForm((prev) => ({
          ...INITIAL_FORM,
          courseInterest: options?.programName || "",
          note: prev.note,
        }));
        setError("");
        setFieldErrors({});
        setIsSubmitting(false);
      }, 140);
      return () => window.clearTimeout(resetTimer);
    }

    const targetCourse = options?.programName || "";
    if (form.courseInterest !== targetCourse) {
      setForm((prev) => ({
        ...prev,
        courseInterest: targetCourse,
      }));
    }

    setError("");
    setFieldErrors({});

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, options?.programName]);

  const updateForm = <K extends keyof ConsultationFormState>(key: K) =>
    (value: ConsultationFormState[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setError("");
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    };

  const validateForm = () => {
    const nextFieldErrors: Partial<Record<ConsultationField, string>> = {};

    if (!form.fullName.trim()) {
      nextFieldErrors.fullName = "Vui lòng nhập họ và tên";
    } else if (form.fullName.length < 2) {
      nextFieldErrors.fullName = "Họ và tên phải có ít nhất 2 ký tự";
    }

    if (!form.phone.trim()) {
      nextFieldErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9+\s]+$/.test(form.phone)) {
      nextFieldErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!form.email.trim()) {
      nextFieldErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextFieldErrors.email = "Email không hợp lệ";
    }

    if (!form.courseInterest) {
      nextFieldErrors.courseInterest = "Vui lòng chọn khóa học bạn quan tâm";
    }

    if (form.note && form.note.length > 500) {
      nextFieldErrors.note = "Lời nhắn không được vượt quá 500 ký tự";
    }

    return nextFieldErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextFieldErrors = validateForm();
    setFieldErrors(nextFieldErrors);

    const firstErrorKey = Object.keys(nextFieldErrors)[0] as ConsultationField | undefined;
    if (firstErrorKey) {
      setError(nextFieldErrors[firstErrorKey] || "Vui lòng kiểm tra lại thông tin");
      return;
    }

    setIsSubmitting(true);

    const trackingData = resolveTrackingData();
    const siteKey = options?.variant === "chinese" ? "tieng-trung" : "tieng-duc";

    const payload = {
      siteKey: siteKey, // Bắt buộc gửi siteKey để Backend lưu đúng chỗ
      campaignTag: trackingData.campaignTag || options?.source || undefined,
      formData: {
        fullname: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        course: form.courseInterest.trim(),
        note: form.note.trim(),
      },
      prizeName: wonPrize?.option || undefined,
      prizeCode: wonPrize?.code || undefined,
      ...trackingData, 
    };

    void submitLeadRegistration(payload as any)
      .then((response) => {
        setSuccessMessage(response.message || "Đăng ký thành công!");
        setStep("success");
      })
      .catch((submitError) => {
        const message = submitError instanceof Error ? submitError.message : "Đăng ký thất bại, vui lòng thử lại";
        setError(message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!isOpen) return null;

  const successTitle = wonPrize ? "Nhận Quà Thành Công!" : successMessage;

  return (
    <div id="lead-form" className="relative flex items-center justify-center overflow-y-visible py-12 px-3 md:p-5 reveal">
      <div role="dialog" className={`relative z-10 w-full max-w-[1140px] overflow-hidden rounded-[1.65rem] border border-white/85 bg-white/96 p-3 shadow-[0_28px_80px_rgba(148,163,184,0.24)] backdrop-blur-xl md:p-3.5 lg:mr-3 lg:p-4 animate-zoom-in ${theme.shellGlow}`}>
        {step === "form" ? (
          <div className="relative min-h-[410px] overflow-hidden">
            <img src={consultationBackdrop} alt="Tư vấn khóa học" className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-[18%_center]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.06)_40%,rgba(255,255,255,0.18)_60%,rgba(255,255,255,0.34)_100%)]" />

            <div className="relative z-10 flex min-h-[410px] items-center justify-center px-3 py-2.5 sm:px-4 md:px-5 lg:justify-end lg:px-8 lg:py-4">
              <div className="w-full max-w-[470px] rounded-[1.65rem] border border-white/85 bg-white/96 p-3 shadow-[0_28px_80px_rgba(148,163,184,0.24)] backdrop-blur-xl md:p-3.5 lg:mr-3 lg:p-4">
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <h2 id="consultation-modal-title" className="sr-only">Đăng ký tư vấn</h2>

                  <label className="block">
                    <span className={labelClassName}>Họ và tên <span className="text-red-500">(*)</span></span>
                    <input type="text" value={form.fullName} onChange={(event) => updateForm("fullName")(event.target.value)} placeholder="Nhập họ và tên của bạn" className={`${inputClassName} ${theme.focus}`} />
                    {fieldErrors.fullName && <p className={fieldErrorClassName}>{fieldErrors.fullName}</p>}
                  </label>

                  <label className="block">
                    <span className={labelClassName}>Số điện thoại <span className="text-red-500">(*)</span></span>
                    <div className={`flex items-center overflow-hidden rounded-[1.05rem] border border-[#d9dbe7] bg-[#f7f7fb] transition-all focus-within:ring-4 ${theme.focusWithin}`}>
                      <div className="flex h-[2.7rem] items-center gap-2 border-r border-[#d9dbe7] px-4 text-[0.96rem] font-medium text-slate-600">
                        <span>+84</span>
                        <ChevronDown size={16} />
                      </div>
                      <input type="tel" value={form.phone} onChange={(event) => updateForm("phone")(event.target.value)} placeholder="969 848 948" className="min-w-0 flex-1 bg-transparent px-4 text-[1rem] font-medium text-[#1a2b48] outline-none" />
                    </div>
                    {fieldErrors.phone && <p className={fieldErrorClassName}>{fieldErrors.phone}</p>}
                  </label>

                  <label className="block">
                    <span className={labelClassName}>Email <span className="text-red-500">(*)</span></span>
                    <input type="email" value={form.email} onChange={(event) => updateForm("email")(event.target.value)} placeholder="Nhập email của bạn" className={`${inputClassName} ${theme.focus}`} />
                    {fieldErrors.email && <p className={fieldErrorClassName}>{fieldErrors.email}</p>}
                  </label>

                  <label className="block">
                    <span className={labelClassName}>Khóa học bạn quan tâm <span className="text-red-500">(*)</span></span>
                    <div className="relative">
                      <select value={form.courseInterest} onChange={(event) => updateForm("courseInterest")(event.target.value)} className={`${inputClassName} appearance-none pr-12 ${theme.focus}`}>
                        <option value="">Lựa chọn khóa học</option>
                        {courseOptions.map((course) => (<option key={course} value={course}>{course}</option>))}
                      </select>
                      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    {fieldErrors.courseInterest && <p className={fieldErrorClassName}>{fieldErrors.courseInterest}</p>}
                  </label>

                  <label className="block">
                    <span className={labelClassName}>Lời nhắn</span>
                    <textarea value={form.note} onChange={(event) => updateForm("note")(event.target.value)} rows={1} className={`min-h-[58px] w-full resize-none rounded-[1.05rem] border border-[#d9dbe7] bg-[#f7f7fb] px-4 py-2 text-[0.96rem] font-medium text-[#1a2b48] outline-none transition-all focus:ring-4 ${theme.focus}`} />
                    {fieldErrors.note && <p className={fieldErrorClassName}>{fieldErrors.note}</p>}
                  </label>

                  <p className="px-1 text-center text-[11px] italic leading-4 text-slate-400">
                    Bằng việc đăng ký, bạn đã đồng ý với <span className="font-semibold text-[#5f88c6]">Chính sách bảo mật</span> của Ula Education
                  </p>

                  {error && <div className="rounded-[1rem] border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</div>}

                  <button type="submit" disabled={isSubmitting} className={`inline-flex h-[3rem] w-full items-center justify-center gap-2 rounded-full px-6 text-[0.98rem] font-black transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 ${theme.submitButton}`}>
                    {isSubmitting ? "Đang gửi..." : "Đăng ký nhận ưu đãi"}
                    {!isSubmitting && <ArrowRight size={18} />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-[330px] overflow-hidden">
            <img src={consultationBackdrop} alt="Thành công" className="absolute inset-0 h-full w-full scale-[1.08] object-cover object-[18%_center]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.06)_40%,rgba(255,255,255,0.18)_60%,rgba(255,255,255,0.34)_100%)]" />

            <div className="relative z-10 flex min-h-[330px] items-center justify-center px-3 py-2.5 sm:px-4 md:px-5 lg:justify-end lg:px-8 lg:py-4">
              <div className="w-full max-w-[470px] rounded-[1.65rem] border border-white/85 bg-white/96 p-3.5 text-center shadow-[0_28px_80px_rgba(148,163,184,0.24)] backdrop-blur-xl lg:mr-3 lg:p-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-600 shadow-inner ring-8 ring-emerald-50">
                  <CheckCircle2 size={32} />
                </div>

                <h2 className="mt-5 text-[1.95rem] font-black tracking-tight text-[#1a2b48]">
                  {successTitle}
                </h2>

                {wonPrize ? (
                  <div className="mt-4 w-full space-y-4">
                    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <div className="mb-2 flex items-center justify-center gap-2 text-blue-600">
                        <Gift size={20} className="animate-bounce" />
                        <span className="text-sm font-bold uppercase tracking-wider">Phần quà của bạn</span>
                      </div>
                      <div className="text-xl font-black text-slate-800">{wonPrize.option}</div>
                      <span className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Truy cập <a className="text-blue-600 hover:underline" href="https://ulaedu.com">ulaedu.vn</a> để nhận.
                      </span>
                    </div>

                    <div className="relative group">
                      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">Mã nhận quà</div>
                      <div onClick={() => { if (!giftCode) return; void navigator.clipboard.writeText(giftCode); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }} className="flex cursor-pointer items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900 p-4 text-white hover:bg-slate-800 transition-colors">
                        <span className="text-lg font-mono font-black tracking-[0.2em]">{giftCode}</span>
                        <div className="text-blue-400">{copied ? <span className="text-xs font-bold text-emerald-400">ĐÃ CHÉP</span> : <Copy size={18} />}</div>
                      </div>
                    </div>

                    <p className="text-[0.85rem] font-medium leading-relaxed text-slate-500">
                      Vui lòng chụp màn hình hoặc sao chép mã này. <br />Đội ngũ sẽ liên hệ qua <span className="font-bold text-[#1a2b48]">{form.phone}</span>
                    </p>
                  </div>
                ) : (
                  <p className="mx-auto mt-3 max-w-md text-[0.98rem] font-medium leading-7 text-slate-500">
                    Đội ngũ sẽ liên hệ lại qua số <span className="font-bold text-[#1a2b48]">{form.phone}</span> trong thời gian sớm nhất.
                  </p>
                )}

                <button type="button" onClick={() => window.open("https://ulaedu.com", "_blank")} className={`mt-6 inline-flex h-[3.2rem] w-full items-center justify-center gap-2 rounded-full px-6 text-[0.98rem] font-black transition-all hover:-translate-y-0.5 ${theme.submitButton}`}>
                  Trải nghiệm web học tập
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadForm;