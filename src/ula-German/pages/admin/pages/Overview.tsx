import React, { useEffect, useState } from 'react';
import { RefreshCw, Filter, MousePointerClick, Users, Percent, AlertCircle, Globe, TrendingUp } from 'lucide-react';
import { toast } from 'react-toastify';

// 👉 Import thư viện Chart.js mới
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

import { fetchMarketingReport, fetchMarketingMetaOptions, fetchChartStats, type MarketingReportResponse, type MarketingMetaOptions, type ChartStatsResponse } from '../adminApi';
import { useSiteContext } from '../../../../ula-chinese/context/LandingSiteContext';
import { adminCard, adminAccentText, adminSecondaryButton } from '../adminTheme';

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, ChartTooltip, ChartLegend, Filler
);

// Custom Hook chặn Spam API
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Overview() {
  const { siteKey } = useSiteContext();

  const [report, setReport] = useState<MarketingReportResponse | null>(null);
  const [metaOptions, setMetaOptions] = useState<MarketingMetaOptions | null>(null);
  const [chartDataAPI, setChartDataAPI] = useState<ChartStatsResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isGerman = siteKey === 'tieng-duc';
  const siteName = isGerman ? 'Tiếng Đức (DE)' : 'Tiếng Trung (CN)';

  const [filters, setFilters] = useState({
    from: '', to: '', utm_source: '', utm_medium: '', tag: ''
  });

  const debouncedFilters = useDebounce(filters, 500);

  const fetchDashboardData = async (activeFilters: Record<string, string>, isCancelled: boolean = false) => {
    setIsLoading(true);
    setError('');

    try {
      const results = await Promise.allSettled([
        fetchMarketingReport(siteKey, activeFilters),
        fetchMarketingMetaOptions(siteKey),
        fetchChartStats(siteKey, activeFilters)
      ]);

      if (isCancelled) return;

      if (results[0].status === 'fulfilled') setReport(results[0].value);
      else setError('Không tải được bảng báo cáo. ');

      if (results[1].status === 'fulfilled') setMetaOptions(results[1].value);

      if (results[2].status === 'fulfilled') setChartDataAPI(results[2].value);
      else setChartDataAPI(null);

    } catch (err: any) {
      if (!isCancelled) setError('Đã có lỗi hệ thống xảy ra.');
    } finally {
      if (!isCancelled) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    const activeFilters: Record<string, string> = {};
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value) activeFilters[key] = value;
    });

    void fetchDashboardData(activeFilters, isCancelled);
    return () => { isCancelled = true; };
  }, [siteKey, JSON.stringify(debouncedFilters)]);

  const handleManualRefresh = () => {
    const activeFilters: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) activeFilters[key] = value;
    });
    void fetchDashboardData(activeFilters, false);
  };

  const clearFilters = () => {
    setFilters({ from: '', to: '', utm_source: '', utm_medium: '', tag: '' });
  };

  // =========================================================
  // 👉 CẤU HÌNH GIAO DIỆN CHUNG CHO CHART.JS (ĐẸP & CHUYÊN NGHIỆP)
  // =========================================================
  // =========================================================
  // 👉 CẤU HÌNH GIAO DIỆN CHUNG CHO CHART.JS
  // =========================================================
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    // Chừa khoảng trống bên dưới để chữ nghiêng không bị cắt
    layout: {
      padding: { bottom: 10 }
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { family: "'Be Vietnam Pro', sans-serif", weight: 600, size: 12 },
          color: '#475569'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#0f172a',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: { family: "'Be Vietnam Pro', sans-serif", size: 13, weight: 'bold' },
        bodyFont: { family: "'Be Vietnam Pro', sans-serif", size: 12, weight: '500' },
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y + (context.dataset.yAxisID === 'y-percentage' ? '%' : '');
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: {
          font: { family: "'Be Vietnam Pro', sans-serif", size: 10, weight: 600 },
          color: '#64748b',
          // Cho phép Chart.js tự quyết định góc nghiêng dựa vào số lượng cột
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          // Đảm bảo chữ dù nghiêng hay thẳng đều cách đều mép
          padding: 8
        }
      },
      y: {
        border: { display: false },
        grid: { color: '#f1f5f9', borderDash: [4, 4] },
        ticks: { font: { family: "'Be Vietnam Pro', sans-serif", size: 11 }, color: '#94a3b8', padding: 10 },
        // Đảm bảo các cột có xuất phát điểm mượt mà từ 0
        beginAtZero: true
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">

      {/* --- HEADER --- */}
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
            <Globe className="w-3 h-3 text-indigo-500" />
            Báo Cáo Tổng Hợp ({siteName})
          </div>
          <h2 className="text-3xl font-black text-black tracking-tight">Báo cáo <span className={adminAccentText}>Marketing</span></h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Phân tích hiệu suất quảng cáo & Tỉ lệ chuyển đổi (CR).</p>
        </div>
        <button onClick={handleManualRefresh} className={adminSecondaryButton}>
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
            <select value={filters.utm_source} onChange={(e) => setFilters(p => ({ ...p, utm_source: e.target.value }))} className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none">
              <option value="">Tất cả</option>
              {metaOptions?.utmSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phương thức</label>
            <select value={filters.utm_medium} onChange={(e) => setFilters(p => ({ ...p, utm_medium: e.target.value }))} className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none">
              <option value="">Tất cả</option>
              {metaOptions?.utmMediums.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Chiến dịch</label>
            <select value={filters.tag} onChange={(e) => setFilters(p => ({ ...p, tag: e.target.value }))} className="w-full px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 truncate appearance-none">
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

      {/* ============================================================================== */}
      {/* CÁC BIỂU ĐỒ TRỰC QUAN BẰNG CHART.JS */}
      {/* ============================================================================== */}

      {chartDataAPI && chartDataAPI.labels.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* 👉 BIỂU ĐỒ 1: Clicks (Bar Chart) */}
          <section className={`${adminCard} flex flex-col`}>
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-blue-500" /> Số lượng truy cập (Clicks)
              </h3>
            </div>
            <div className="h-[300px] w-full relative">
              <Bar
                options={commonOptions}
                data={{
                  labels: chartDataAPI.labels,
                  datasets: [{
                    label: 'Lượt Click',
                    data: chartDataAPI.datasets.clicks,
                    backgroundColor: '#3b82f6',
                    borderRadius: 6, // Bo góc cho cột nhìn hiện đại hơn
                    barPercentage: 0.6,
                    hoverBackgroundColor: '#2563eb'
                  }]
                }}
              />
            </div>
          </section>

          {/* 👉 BIỂU ĐỒ 2: Leads (Bar Chart) */}
          <section className={`${adminCard} flex flex-col`}>
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> Số lượng đăng ký (Leads)
              </h3>
            </div>
            <div className="h-[300px] w-full relative">
              <Bar
                options={commonOptions}
                data={{
                  labels: chartDataAPI.labels,
                  datasets: [{
                    label: 'Số Lead',
                    data: chartDataAPI.datasets.leads,
                    backgroundColor: '#10b981',
                    borderRadius: 6,
                    barPercentage: 0.6,
                    hoverBackgroundColor: '#059669'
                  }]
                }}
              />
            </div>
          </section>

          {/* 👉 BIỂU ĐỒ 3: CR (Line / Area Chart có đường cong mượt) */}
          <section className={`${adminCard} lg:col-span-2`}>
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" /> Tỷ lệ chuyển đổi (CR %)
              </h3>
            </div>
            <div className="h-[320px] w-full relative">
              <Line
                options={{
                  ...commonOptions,
                  scales: {
                    ...commonOptions.scales,
                    y: { ...commonOptions.scales.y, min: 0 } // Ép trục Y bắt đầu từ 0
                  }
                }}
                data={{
                  labels: chartDataAPI.labels,
                  datasets: [{
                    label: 'Tỷ lệ CR',
                    data: chartDataAPI.datasets.cr,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)', // Màu nền cho Area
                    borderWidth: 3,
                    fill: true, // Biến Line chart thành Area Chart
                    tension: 0.4, // Tạo độ cong mượt mà cho đường line (Không bị gãy khúc như Recharts)
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#f59e0b',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'y-percentage' // Báo cho tooltip biết đây là %
                  }]
                }}
              />
            </div>
          </section>

        </div>
      )}

      {/* --- BẢNG CHI TIẾT --- */}
      <section className={adminCard}>
        <div className="mb-6">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Chi Tiết Từng Chiến Dịch</h3>
        </div>
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