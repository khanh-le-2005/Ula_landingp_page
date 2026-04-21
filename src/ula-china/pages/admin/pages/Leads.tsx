import React, { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Users, Mail, Phone, Calendar, ExternalLink, ShieldAlert, Database, X, Info, Gift } from 'lucide-react';
import { fetchLeads, type LeadRecord } from '../adminApi';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { adminCard, adminAccentText, adminSecondaryButton } from '../adminTheme';

const formatValue = (value: unknown) => {
  if (value == null || value === '') {
    return '—';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

export default function Leads() {
  const { isAuthenticated } = useAdminAuth();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);

  const loadLeads = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Không thể tải danh sách leads';
      setError(message);
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className={adminCard}>
        <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
              <Database className="w-3 h-3" />
              Thông tin Lead
            </div>
            <h2 className="text-3xl font-black text-black tracking-tight">Danh sách <span className={adminAccentText}>Đăng ký</span></h2>

          </div>
          <button
            type="button"
            onClick={() => void loadLeads()}
            className={adminSecondaryButton}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Đồng bộ ngay
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 flex items-center gap-4">
            <ShieldAlert className="h-6 w-6 text-rose-400" />
            <div className="text-sm font-bold text-rose-400">
                Truy cập chưa xác thực: Cần có mã phiên làm việc để giải mã dữ liệu Lead.
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 flex items-center gap-4 text-rose-400 font-bold text-sm">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        ) : null}

        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-[0.25em] text-slate-400">
                  <th className="px-6 py-5">Thời gian</th>
                  <th className="px-6 py-5">Khách hàng</th>
                  <th className="px-6 py-5">Nhu cầu quan tâm</th>
                  <th className="px-6 py-5">Nguồn dữ liệu</th>
                  <th className="px-6 py-5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={5}>
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Đang lấy dữ liệu...</span>
                        </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={5}>
                        <div className="flex flex-col items-center gap-4 text-slate-400 font-bold italic">
                            <Users className="h-10 w-10 opacity-20" />
                            <span>Danh sách trống: Không tìm thấy lead nào.</span>
                        </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const formData = lead.formData || {};
                    const contactName = formatValue(formData.fullname ?? formData.name);
                    const contactPhone = formatValue(formData.phone ?? formData.sdt);
                    const interest = formatValue(formData.course_name ?? formData.courseInterest);
                    const source = [
                      lead.utm_source,
                      lead.utm_medium,
                      lead.utm_campaign,
                    ]
                      .filter(Boolean)
                      .join(' / ') || 'Tự nhiên';

                    return (
                      <tr 
                        key={lead._id} 
                        onClick={() => setSelectedLead(lead)}
                        className="group hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-100 last:border-0"
                      >
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-1.5 text-xs font-black text-slate-600">
                                <Calendar className="w-3 h-3 text-indigo-500" />
                                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                             </div>
                             <div className="text-[10px] text-slate-400 font-mono">
                                {lead.createdAt ? new Date(lead.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '—'}
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                            <div className="space-y-1.5">
                                <div className="font-black text-slate-900 text-base tracking-tight">{contactName}</div>
                                <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                                        <Phone className="w-3 h-3 text-indigo-500/60" />
                                        {contactPhone}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                                        <Mail className="w-3 h-3 text-violet-500/60" />
                                        {formatValue(formData.email)}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] font-black text-indigo-600 uppercase tracking-widest">
                               {interest}
                           </div>
                        </td>
                        <td className="px-6 py-6 max-w-[200px]">
                           <div className="flex items-start gap-2">
                              <ExternalLink className="w-3 h-3 text-slate-400 mt-1 shrink-0" />
                              <div className="text-xs font-medium text-slate-500 leading-relaxed truncate group-hover:block group-hover:whitespace-normal transition-all" title={source}>
                                 {source}
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex justify-center">
                              <span className="relative flex items-center gap-2 overflow-hidden rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                {lead.status || 'MỚI'}
                              </span>
                           </div>
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

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Chi tiết <span className={adminAccentText}>Khách hàng</span></h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    ID Bản ghi: {selectedLead._id}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8 no-scrollbar">
              {/* Core Identity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600">Hồ sơ khách hàng</div>
                   <div className="space-y-3">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Họ và tên</div>
                        <div className="text-lg font-black text-slate-900">{formatValue(selectedLead.formData?.fullname ?? selectedLead.formData?.name)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Số điện thoại</div>
                          <div className="text-sm font-bold text-slate-800 font-mono tracking-wider">{formatValue(selectedLead.formData?.phone ?? selectedLead.formData?.sdt)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Trạng thái</div>
                          <div className="text-xs font-black text-emerald-600 uppercase tracking-widest">{selectedLead.status || 'MỚI'}</div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Địa chỉ Email</div>
                        <div className="text-sm font-medium text-slate-700">{formatValue(selectedLead.formData?.email)}</div>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600">Bối cảnh chiến dịch</div>
                   <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-4">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Khóa học bạn quan tâm </div>
                        <div className="text-xs font-black text-indigo-600 uppercase tracking-widest leading-relaxed">
                          {formatValue(selectedLead.formData?.course_name ?? selectedLead.formData?.courseInterest ?? 'Landing Tự nhiên')}
                        </div>
                      </div>
                      {selectedLead.formData?.prize_option && (
                         <div className="pt-2 border-t border-slate-200">
                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Quà tặng đã trúng</div>
                            <div className="inline-flex items-center gap-2 text-xs font-black text-amber-600 uppercase tracking-widest">
                               <Gift className="w-3 h-3" />
                               {formatValue(selectedLead.formData.prize_option)}
                            </div>
                         </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Note / Message */}
              {(selectedLead.formData?.note || selectedLead.formData?.loi_nhan) && (
                <div className="space-y-3">
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    Lời nhắn từ khách hàng
                  </div>
                  <div className="text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl p-5 italic">
                    "{formatValue(selectedLead.formData.note ?? selectedLead.formData.loi_nhan)}"
                  </div>
                </div>
              )}

              {/* Attribution Data */}
              <div className="space-y-4">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Dữ liệu nguồn truy cập
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Nguồn (Source)', value: selectedLead.utm_source },
                    { label: 'Phương thức', value: selectedLead.utm_medium },
                    { label: 'Chiến dịch', value: selectedLead.utm_campaign },
                    { label: 'Nội dung', value: selectedLead.utm_content },
                    { label: 'Chiến dịch (Tag)', value: (selectedLead.formData as any)?.campaign_tag }, 
                    { label: 'Mã giới thiệu', value: selectedLead.referralId || (selectedLead as any).referralCode },
                    { label: 'Thời gian Click', value: selectedLead.click_timestamp ? new Date(selectedLead.click_timestamp).toLocaleString() : null },
                    { label: 'Thời gian Gửi Form', value: selectedLead.conversion_timestamp ? new Date(selectedLead.conversion_timestamp).toLocaleString() : null },
                    { label: 'Ngày tạo hệ thống', value: selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleString() : null },
                  ].map((attr, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">{attr.label}</div>
                      <div className="text-[11px] font-black text-slate-600 break-words font-mono uppercase tracking-tighter">
                        {attr.value || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Footprint */}
              <div className="space-y-3">
                 <div className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Thông tin kỹ thuật (Header)
                 </div>
                 <div className="flex flex-wrap gap-2 text-[10px] font-mono text-slate-500">
                    {(selectedLead as any).fbp && <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">FBP: {(selectedLead as any).fbp}</span>}
                    {(selectedLead as any).fbc && <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">FBC: {(selectedLead as any).fbc}</span>}
                    <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">ID: {selectedLead._id}</span>
                 </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setSelectedLead(null)}
                className={adminSecondaryButton}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>  
  );
}
