import React, { useEffect, useState } from 'react';
import { RefreshCw, Filter, MousePointerClick, Users, Percent, AlertCircle, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchMarketingReport, fetchMarketingMetaOptions, type MarketingReportResponse, type MarketingMetaOptions } from '../adminApi';
import { useSiteContext, type SiteKey } from '../../../../ula-chinese/context/LandingSiteContext';;
import { adminCard, adminAccentText, adminSecondaryButton } from '../adminTheme';

export default function Overview() {
  const { siteKey } = useSiteContext();
  const [report, setReport] = useState<MarketingReportResponse | null>(null);
  const [metaOptions, setMetaOptions] = useState<MarketingMetaOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // UI Hiển thị rõ ràng đang ở trang nào
  const isGerman = siteKey === 'tieng-duc';
  const siteName = isGerman ? 'Tiếng Đức (DE)' : 'Tiếng Trung (CN)';

  const [filters, setFilters] = useState({
    from: '',
    to: '',
    utm_source: '',
    utm_medium: '',
    tag: ''
  });

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const activeFilters: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) activeFilters[key] = value;
      });

      const [reportData, metaData] = await Promise.all([
        fetchMarketingReport(siteKey, activeFilters),
        fetchMarketingMetaOptions(siteKey)
      ]);
      
      setReport(reportData);
      setMetaOptions(metaData);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải báo cáo Marketing');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [siteKey, filters]);

  const clearFilters = () => {
    setFilters({ from: '', to: '', utm_source: '', utm_medium: '', tag: '' });
  };

  const chartData = report?.data?.map(row => {
    let name = "";
    if (row.ref) name += `${row.ref}`;
    else if (row.campaign) name += `${row.campaign}`;
    else name = `${row.source || 'Organic'} / ${row.medium || 'None'}`;
    
    return {
      name: name,
      Clicks: row.clicks,
      Leads: row.leads,
    };
  }) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          {/* CẬP NHẬT: Thêm cục báo hiệu Site đang xem */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
            <Globe className="w-3 h-3 text-indigo-500" />
            Báo Cáo Tổng Hợp ({siteName})
          </div>
          
          <h2 className="text-3xl font-black text-black tracking-tight">Báo cáo <span className={adminAccentText}>Marketing</span></h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Phân tích hiệu suất quảng cáo & Tỉ lệ chuyển đổi (CR).</p>
        </div>
        <button onClick={() => void loadData()} className={adminSecondaryButton}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Đồng bộ
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 flex items-center gap-4 text-rose-400 font-bold text-sm">
          <AlertCircle className="h-5 w-5" /> {error}
        </div>
      )}

      {/* --- BỘ LỌC ĐA NĂNG --- */}
      <div className="p-6 bg-slate-50/80 rounded-[24px] border border-slate-100">
        <div className="flex items-center gap-2 text-slate-500 mb-4">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-800">Lọc Báo Cáo</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
          <div className="col-span-2 lg:col-span-2 flex gap-2">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Từ ngày</label>
              <input type="date" value={filters.from} onChange={(e) => setFilters(p => ({ ...p, from: e.target.value }))} className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Đến ngày</label>
              <input type="date" value={filters.to} onChange={(e) => setFilters(p => ({ ...p, to: e.target.value }))} className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nguồn (Source)</label>
            <select value={filters.utm_source} onChange={(e) => setFilters(p => ({ ...p, utm_source: e.target.value }))} className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="">Tất cả</option>
              {metaOptions?.utmSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phương thức</label>
            <select value={filters.utm_medium} onChange={(e) => setFilters(p => ({ ...p, utm_medium: e.target.value }))} className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option value="">Tất cả</option>
              {metaOptions?.utmMediums.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Chiến dịch</label>
            <select value={filters.tag} onChange={(e) => setFilters(p => ({ ...p, tag: e.target.value }))} className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 truncate">
              <option value="">Tất cả</option>
              {metaOptions?.campaigns.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="col-span-1">
             <button onClick={clearFilters} className="h-[34px] w-full flex items-center justify-center rounded-xl bg-slate-200/50 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors text-xs font-bold">Xóa lọc</button>
          </div>
        </div>
      </div>

      {/* --- THẺ SUMMARY TỔNG QUAN --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={adminCard}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm"><MousePointerClick className="w-6 h-6" /></div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-1">Tổng truy cập (Clicks)</div>
              <div className="text-3xl font-black text-slate-900">{report?.summary?.totalVisits || 0}</div>
            </div>
          </div>
        </div>

        <div className={adminCard}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm"><Users className="w-6 h-6" /></div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-1">Tổng đăng ký (Leads)</div>
              <div className="text-3xl font-black text-slate-900">{report?.summary?.totalLeads || 0}</div>
            </div>
          </div>
        </div>

        <div className={adminCard}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm"><Percent className="w-6 h-6" /></div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mb-1">Tỉ lệ chuyển đổi (CR)</div>
              <div className="text-3xl font-black text-amber-500">{report?.summary?.totalCR || "0%"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BIỂU ĐỒ TRỰC QUAN --- */}
      {chartData.length > 0 && (
        <section className={adminCard}>
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-800 tracking-tight">Hiệu suất theo Nguồn / KOC</h3>
            <p className="text-xs font-medium text-slate-500">Tương quan giữa số lượt truy cập (Clicks) và số đăng ký (Leads)</p>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                  labelStyle={{ fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '20px' }} />
                <Bar dataKey="Clicks" name="Lượt truy cập" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                <Bar dataKey="Leads" name="Đăng ký" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* --- BẢNG CHI TIẾT --- */}
      <section className={adminCard}>
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-[0.25em] text-slate-400">
                  <th className="px-6 py-5">Nguồn / Kênh (Source & Medium)</th>
                  <th className="px-6 py-5">Chiến dịch / Mã KOC</th>
                  <th className="px-6 py-5 text-center">Lượt bấm (Clicks)</th>
                  <th className="px-6 py-5 text-center">Đăng ký (Leads)</th>
                  <th className="px-6 py-5 text-right">Tỉ lệ CR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center"><RefreshCw className="w-6 h-6 text-indigo-500 animate-spin mx-auto" /></td></tr>
                ) : !report?.data || report.data.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-bold italic">Không có dữ liệu báo cáo nào.</td></tr>
                ) : (
                  report.data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-black uppercase text-indigo-600">{row.source || "Tự nhiên"}</span>
                          <span className="text-[10px] font-bold text-slate-500">{row.medium || "Không xác định"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-black text-slate-800">{row.campaign || "Mặc định"}</span>
                          <span className="text-[10px] font-bold text-slate-500">Ref: {row.ref || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center font-bold text-slate-700">{row.clicks}</td>
                      <td className="px-6 py-6 text-center font-bold text-emerald-600">{row.leads}</td>
                      <td className="px-6 py-6 text-right font-black text-amber-500">{row.cr}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      
    </div>
  );
}