import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Users,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// --- 1. ĐỊNH NGHĨA TYPES (Dựa trên JSON bạn cung cấp) ---
interface TrendData {
  _id: string; // Ngày tháng (VD: "2026-04-21")
  leads: number;
  suspicious: number;
}

interface ConversionData {
  siteKey: string;
  totalLeads: number;
  breakdown: {
    status: string;
    count: number;
    percentage: string;
  }[];
}

interface KocPerformance {
  _id: string;
  koc: string;
  totalLeads: number;
  enrolled: number;
  suspicious: number;
  lastLeadAt: string;
  conversionRate: number;
}

// Bảng màu cho Biểu đồ tròn (Trạng thái Lead)
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

export default function LeadStatistics() {
  // Thay 'tieng-duc' bằng state hoặc context tùy dự án của bạn
  const siteKey = 'tieng-duc';

  const [trends, setTrends] = useState<TrendData[]>([]);
  const [conversion, setConversion] = useState<ConversionData | null>(null);
  const [kocs, setKocs] = useState<KocPerformance[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 2. HÀM GỌI API ---
  const fetchStatistics = async () => {
    setIsLoading(true);
    setError('');

    // Lấy token từ localStorage (Giả sử bạn đang lưu token ở đây)
    const token = localStorage.getItem('ula_admin_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      // Gọi cả 3 API cùng lúc cho nhanh
      const [trendsRes, conversionRes, kocsRes] = await Promise.all([
        fetch(`http://localhost:3002/api/leads/stats/trends?site=${siteKey}`, { headers }),
        fetch(`http://localhost:3002/api/leads/stats/conversion?site=${siteKey}`, { headers }),
        fetch(`http://localhost:3002/api/leads/stats/kocs?site=${siteKey}`, { headers })
      ]);

      if (!trendsRes.ok || !conversionRes.ok || !kocsRes.ok) {
        throw new Error('Lỗi khi tải dữ liệu thống kê');
      }

      const trendsData = await trendsRes.json();
      const conversionData = await conversionRes.json();
      const kocsData = await kocsRes.json();

      setTrends(trendsData.trends || []);
      setConversion(conversionData);
      setKocs(kocsData.performance || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchStatistics();
  }, [siteKey]);

  // Format ngày tháng hiển thị đẹp hơn
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('vi-VN');
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" /> {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Thống Kê Khách Hàng (Leads)</h2>
          <p className="text-sm text-slate-500 font-medium">Tổng quan dữ liệu thu thập được từ {siteKey.toUpperCase()}</p>
        </div>
        <button
          onClick={fetchStatistics}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 font-bold text-sm text-slate-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* TỔNG QUAN TỔNG SỐ (Quick Stats) */}
      {conversion && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Tổng Leads</p>
              <h3 className="text-3xl font-black text-slate-800">{conversion.totalLeads}</h3>
            </div>
          </div>
        </div>
      )}

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* CHART 1: TRENDS (Biểu đồ đường) */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-black text-slate-800">Xu Hướng Thu Thập Theo Ngày</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="_id" tickFormatter={formatDate} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip
                  labelFormatter={formatDate}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area type="monotone" dataKey="leads" name="Tổng Leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="suspicious" name="Đáng ngờ (Spam)" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSuspicious)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: CONVERSION (Biểu đồ tròn) */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-black text-slate-800">Tỷ Lệ Chuyển Đổi</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            {conversion?.breakdown && conversion.breakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversion.breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                  >
                    {conversion.breakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [`${value} Leads (${props.payload.percentage})`, name]}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">Chưa có dữ liệu trạng thái</div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE: KOC PERFORMANCE */}
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-black text-slate-800">Hiệu Suất KOC / Affiliate</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-500 tracking-wider">
                <th className="p-4 rounded-tl-xl">Mã KOC</th>
                <th className="p-4">Tổng số Lead</th>
                <th className="p-4 text-emerald-600">Đăng ký thành công</th>
                <th className="p-4 text-red-500">Spam / Đáng ngờ</th>
                <th className="p-4">Tỉ lệ chuyển đổi</th>
                <th className="p-4 rounded-tr-xl">Lead gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kocs.length > 0 ? kocs.map((koc) => (
                <tr key={koc._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{koc.koc}</td>
                  <td className="p-4 font-bold">{koc.totalLeads}</td>
                  <td className="p-4 font-bold text-emerald-600">{koc.enrolled}</td>
                  <td className="p-4 font-bold text-red-500">{koc.suspicious}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 font-bold rounded-full text-xs">
                      {koc.conversionRate}%
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-xs font-medium">
                    {koc.lastLeadAt ? new Date(koc.lastLeadAt).toLocaleString('vi-VN') : '---'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    Chưa có dữ liệu KOC nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}