import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  RefreshCw,
  Users,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  ShieldAlert,
  Database,
  X,
  Info,
  Gift,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Check,
  Search,
  Filter,
} from "lucide-react";
import { fetchLeads, updateLeadStatus, deleteLead, fetchMarketingMetaOptions, type LeadRecord, type MarketingMetaOptions } from "../adminApi";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { useSiteContext } from "../../../context/LandingSiteContext";
import {
  adminCard,
  adminAccentText,
  adminSecondaryButton,
} from "../adminTheme";

const formatValue = (value: unknown): string => {
  if (value == null || value === "") return "—";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const getStatusConfig = (status?: string) => {
  const s = status?.toUpperCase();
  switch (s) {
    case 'CONTACTED': 
      return { label: 'ĐÃ LIÊN HỆ', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500' };
    case 'ENROLLED': 
      return { label: 'ĐÃ NHẬP HỌC', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' };
    case 'CANCELLED': 
      return { label: 'HỦY / RÁC', color: 'text-rose-600 bg-rose-50 border-rose-200', dot: 'bg-rose-500' };
    default: 
      return { label: 'MỚI', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500' };
  }
};

export default function Leads() {
  const { isAuthenticated } = useAdminAuth();
  const { siteKey } = useSiteContext();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  // SỬA CHUẨN THEO API DOCUMENTS: Thay startDate/endDate bằng from/to
  const [filters, setFilters] = useState({ 
    ref: '', 
    tag: '', 
    status: '',
    utm_source: '',
    utm_medium: '',
    from: '',
    to: ''
  });
  
  const [metaOptions, setMetaOptions] = useState<MarketingMetaOptions | null>(null);

  useEffect(() => {
    const loadMetaOptions = async () => {
      try {
        const data = await fetchMarketingMetaOptions(siteKey);
        setMetaOptions(data);
      } catch (err) {
        console.error('Lỗi khi tải meta options:', err);
      }
    };
    void loadMetaOptions();
  }, [siteKey]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (isActionLoading) return;
    setIsActionLoading(true);
    try {
      await updateLeadStatus(id, newStatus);
      setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
      if (selectedLead?._id === id) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi cập nhật trạng thái');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Lead này?')) return;
    if (isActionLoading) return;
    
    setIsActionLoading(true);
    try {
      await deleteLead(id);
      setLeads(prev => prev.filter(l => l._id !== id));
      setSelectedLead(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi khi xóa Lead');
    } finally {
      setIsActionLoading(false);
    }
  };

  const loadLeads = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Build query object
      const activeFilters: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) activeFilters[key] = value;
      });

      const data = await fetchLeads(siteKey, activeFilters);
      setLeads(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách leads");
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, [siteKey, filters]);

  const clearFilters = () => {
    setFilters({ ref: '', tag: '', status: '', utm_source: '', utm_medium: '', from: '', to: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className={adminCard}>
        <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
              <Database className="w-3 h-3" />
              Thông tin Lead
            </div>
            <h2 className="text-3xl font-black text-black tracking-tight">
              Danh sách <span className={adminAccentText}>Đăng ký</span>
            </h2>
          </div>
          <button type="button" onClick={() => void loadLeads()} className={adminSecondaryButton}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} /> Đồng bộ ngay
          </button>
        </div>

        {/* --- BỘ LỌC ĐA NĂNG MỚI (GRID LAYOUT) --- */}
        <div className="mb-8 p-6 bg-slate-50/80 rounded-[24px] border border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 mb-4">
            <Filter className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-800">Bộ lọc tìm kiếm</span>
            {Object.values(filters).some(Boolean) && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-[9px] font-bold">ĐANG LỌC</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
            <div className="col-span-2 md:col-span-2 lg:col-span-2 flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Từ ngày</label>
                <input 
                  type="date" 
                  value={filters.from}
                  onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Đến ngày</label>
                <input 
                  type="date" 
                  value={filters.to}
                  onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nguồn (Source)</label>
              <select
                value={filters.utm_source}
                onChange={(e) => setFilters(prev => ({ ...prev, utm_source: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Tất cả</option>
                {metaOptions?.utmSources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phương thức</label>
              <select
                value={filters.utm_medium}
                onChange={(e) => setFilters(prev => ({ ...prev, utm_medium: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
              >
                <option value="">Tất cả</option>
                {metaOptions?.utmMediums.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Đối tác (Ref)</label>
              <select
                value={filters.ref}
                onChange={(e) => setFilters(prev => ({ ...prev, ref: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer truncate"
              >
                <option value="">Tất cả</option>
                {metaOptions?.kocs.map(koc => <option key={koc.value} value={koc.value}>{koc.label}</option>)}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Chiến dịch (Tag)</label>
              <select
                value={filters.tag}
                onChange={(e) => setFilters(prev => ({ ...prev, tag: e.target.value }))}
                className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer truncate"
              >
                <option value="">Tất cả</option>
                {metaOptions?.campaigns.map(camp => <option key={camp.value} value={camp.value}>{camp.label}</option>)}
              </select>
            </div>

            <div className="col-span-1 flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Trạng thái</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer"
                >
                  <option value="">Tất cả</option>
                  <option value="NEW">MỚI</option>
                  <option value="CONTACTED">ĐÃ LIÊN HỆ</option>
                  <option value="ENROLLED">ĐÃ NHẬP HỌC</option>
                  <option value="CANCELLED">HỦY / RÁC</option>
                </select>
              </div>
              <button
                title="Xóa bộ lọc"
                onClick={clearFilters}
                className="h-[34px] px-3 flex items-center justify-center rounded-xl bg-slate-200/50 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 flex items-center gap-4">
            <ShieldAlert className="h-6 w-6 text-rose-400" />
            <div className="text-sm font-bold text-rose-400">Truy cập chưa xác thực!</div>
          </div>
        )}

        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-[0.25em] text-slate-400">
                  <th className="px-6 py-5">Thời gian</th>
                  <th className="px-6 py-5">Khách hàng</th>
                  <th className="px-6 py-5">Nhu cầu quan tâm</th>
                  <th className="px-6 py-5">Chiến dịch / KOC</th>
                  <th className="px-6 py-5">Link Tracking</th>
                  <th className="px-6 py-5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td className="px-6 py-12 text-center" colSpan={6}><RefreshCw className="h-6 w-6 text-indigo-500 animate-spin mx-auto" /></td></tr>
                ) : leads.length === 0 ? (
                  <tr><td className="px-6 py-12 text-center" colSpan={6}><Users className="h-10 w-10 opacity-20 mx-auto" /><p className="text-slate-400 font-bold mt-4">Không tìm thấy lead nào phù hợp bộ lọc.</p></td></tr>
                ) : (
                  (Array.isArray(leads) ? leads : []).map((lead) => {
                    const formData = lead.formData || {};
                    const contactName = formatValue(formData.fullname ?? formData.name ?? formData.fullName);
                    const contactPhone = formatValue(formData.phone ?? formData.sdt ?? formData.phoneNumber);
                    const interest = formatValue(formData.course ?? formData.course_name ?? formData.courseInterest ?? 'Chưa xác định');
                    const source = [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ") || "Tự nhiên";

                    return (
                      <tr key={lead._id} onClick={() => setSelectedLead(lead)} className={`group hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-100 last:border-0 ${lead.is_suspicious ? "bg-rose-50/50" : ""}`}>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-black text-slate-600 mb-1"><Calendar className="w-3 h-3 text-indigo-500" />{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('vi-VN') : "—"}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString('vi-VN', { hour: "2-digit", minute: "2-digit" }) : "—"}</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2 mb-1.5">{contactName} {lead.is_suspicious && <AlertTriangle className="w-4 h-4 text-rose-500" />}</div>
                          <div className="flex items-center flex-wrap gap-x-4 gap-y-1"><div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-widest"><Phone className="w-3 h-3 text-indigo-500/60" />{contactPhone}</div><div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-widest"><Mail className="w-3 h-3 text-violet-500/60" />{formatValue(formData.email)}</div></div>
                        </td>
                        <td className="px-6 py-6"><span className="inline-flex px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-black text-indigo-600 uppercase tracking-widest">{interest}</span></td>
                        <td className="px-6 py-6"><div className="text-[11px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 inline-block mb-1">{lead.campaignTag || "—"}</div><div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{lead.referralCode || lead.referralId || lead.affiliateId || "Tự nhiên"}</div></td>
                        <td className="px-6 py-6 max-w-[200px]"><div className="flex items-start gap-2"><ExternalLink className="w-3 h-3 text-slate-400 mt-1 shrink-0" /><div className="text-xs font-medium text-slate-500 leading-relaxed truncate group-hover:block group-hover:whitespace-normal transition-all" title={source}>{source}</div></div></td>
                        <td className="px-6 py-6 text-center">
                          {(() => {
                            const config = getStatusConfig(lead.status);
                            return <span className={`inline-flex items-center gap-2 rounded-full border ${config.color} px-4 py-1.5 text-[10px] font-black uppercase tracking-widest`}><div className={`h-1.5 w-1.5 rounded-full ${config.dot} animate-pulse`} />{config.label}</span>;
                          })()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đang hiển thị {leads.length} bản ghi</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bảo mật [TLS 1.3]</div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white"><Users className="w-6 h-6" /></div>
                <div><h3 className="text-xl font-black text-slate-900 tracking-tight">Chi tiết <span className={adminAccentText}>Khách hàng</span></h3><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ID Bản ghi: {selectedLead._id}</div></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDeleteLead(selectedLead._id)} disabled={isActionLoading} className="h-10 px-4 flex items-center gap-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 text-[10px] font-black uppercase tracking-widest"><Trash2 className="w-3.5 h-3.5" /> Xóa</button>
                <button onClick={() => setSelectedLead(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200"><X className="w-5 h-5" /></button>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-8 space-y-8 no-scrollbar">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600">Hồ sơ khách hàng</div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Họ và tên</div>
                      <div className="text-lg font-black text-slate-900 flex items-center gap-2">
                        {formatValue(selectedLead.formData?.fullname ?? selectedLead.formData?.name ?? selectedLead.formData?.fullName)}
                        {selectedLead.is_suspicious && <span className="bg-rose-100 text-rose-600 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">Spam/Trùng lặp</span>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Số điện thoại</div><div className="text-sm font-bold text-slate-800 font-mono tracking-wider">{formatValue(selectedLead.formData?.phone ?? selectedLead.formData?.sdt ?? selectedLead.formData?.phoneNumber)}</div></div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Trạng thái</div>
                        <select value={selectedLead.status || 'NEW'} disabled={isActionLoading} onChange={(e) => handleUpdateStatus(selectedLead._id, e.target.value)} className={`w-full text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border appearance-none cursor-pointer focus:outline-none ${getStatusConfig(selectedLead.status).color}`}>
                          <option value="NEW">MỚI</option><option value="CONTACTED">ĐÃ LIÊN HỆ</option><option value="ENROLLED">ĐÃ NHẬP HỌC</option><option value="CANCELLED">HỦY / RÁC</option>
                        </select>
                      </div>
                    </div>
                    <div><div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email</div><div className="text-sm font-medium text-slate-700">{formatValue(selectedLead.formData?.email)}</div></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600">Bối cảnh chiến dịch</div>
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Khóa học quan tâm</div>
                      <div className="text-xs font-black text-indigo-600 uppercase tracking-widest">{formatValue(selectedLead.formData?.course ?? selectedLead.formData?.course_name ?? selectedLead.formData?.courseInterest ?? "Landing Tự nhiên")}</div>
                    </div>
                    {(selectedLead.prizeName || selectedLead.prizeCode || selectedLead.formData?.prize_option) && (
                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Quà tặng / Voucher</div>
                        <div className="flex flex-col gap-1 text-xs font-black text-amber-600 uppercase tracking-widest">
                          <div className="inline-flex items-center gap-2"><Gift className="w-3 h-3" /> {formatValue(selectedLead.prizeName ?? selectedLead.formData?.prize_option)}</div>
                          {(selectedLead.prizeCode || selectedLead.formData?.prize_code) && <div className="text-[10px] text-amber-500/80 tracking-widest">Code: <span className="font-mono">{selectedLead.prizeCode ?? selectedLead.formData?.prize_code}</span></div>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(selectedLead.formData?.note || selectedLead.formData?.loi_nhan) && (
                <div className="space-y-3">
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2"><Mail className="w-3 h-3" />Lời nhắn từ khách hàng</div>
                  <div className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl p-5 italic">"{formatValue(selectedLead.formData.note ?? selectedLead.formData.loi_nhan)}"</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2"><ExternalLink className="w-3 h-3" />Dữ liệu nguồn truy cập</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Nguồn (Source)", value: selectedLead.utm_source },
                    { label: "Phương thức (Medium)", value: selectedLead.utm_medium },
                    { label: "Chiến dịch (Campaign)", value: selectedLead.utm_campaign },
                    { label: "Nội dung (Content)", value: selectedLead.utm_content },
                    { label: "Mã chiến dịch (Tag)", value: selectedLead.campaignTag },
                    { label: "Mã giới thiệu (Ref)", value: selectedLead.referralCode || selectedLead.referralId || selectedLead.affiliateId },
                    { label: "Ngày tạo", value: selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString('vi-VN') : null },
                    { label: "Thời điểm Click", value: selectedLead.click_timestamp ? new Date(selectedLead.click_timestamp).toLocaleString('vi-VN') : null },
                    { label: "Thời điểm Gửi form", value: selectedLead.conversion_timestamp ? new Date(selectedLead.conversion_timestamp).toLocaleString('vi-VN') : null },
                  ].map((attr, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">{attr.label}</div>
                      <div className="text-[11px] font-black text-slate-600 break-words font-mono uppercase tracking-tighter">{attr.value || "N/A"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2"><Info className="w-3 h-3" />Thông tin kỹ thuật (Log)</div>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-500">
                  <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">ID: {selectedLead._id}</span>
                  {selectedLead.ip_address && <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md border border-indigo-100">IP: {selectedLead.ip_address}</span>}
                  {(selectedLead as any).fbp && <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">FBP: {(selectedLead as any).fbp}</span>}
                  {(selectedLead as any).fbc && <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">FBC: {(selectedLead as any).fbc}</span>}
                  {selectedLead.user_agent && <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200 truncate max-w-full block mt-1" title={selectedLead.user_agent}>UA: {selectedLead.user_agent}</span>}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button onClick={() => setSelectedLead(null)} className={adminSecondaryButton}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}