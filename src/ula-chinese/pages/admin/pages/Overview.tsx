import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Globe
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Import context để tự động biết đang ở site Tiếng Trung hay Tiếng Đức
import { useSiteContext } from '../../../context/LandingSiteContext';

// --- 1. ĐỊNH NGHĨA TYPES ---
interface TrendData {
  _id: string; 
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

// Dịch trạng thái sang Tiếng Việt cho đẹp
const STATUS_LABELS: Record<string, string> = {
  'NEW': 'Mới',
  'CONTACTED': 'Đã liên hệ',
  'ENROLLED': 'Thành công',
  'CANCELLED': 'Đã hủy'
};

export default function LeadStatistics() {
  // Lấy siteKey tự động (tieng-duc hoặc tieng-trung)
  const { siteKey } = useSiteContext(); 
  const siteName = siteKey === 'tieng-duc' ? 'Đức (DE)' : 'Trung (CN)';
  
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [conversion, setConversion] = useState<ConversionData | null>(null);
  const [kocs, setKocs] = useState<KocPerformance[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 2. HÀM GỌI API ĐỘNG THEO SITEKEY ---
  const fetchStatistics = async () => {
    setIsLoading(true);
    setError('');
    
    const token = localStorage.getItem('ula_admin_token'); 
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      // API TỰ ĐỘNG THAY ĐỔI THEO TỪNG SITE
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

  // Gọi lại API mỗi khi chuyển đổi giữa Tiếng Đức và Tiếng Trung
  useEffect(() => {
    void fetchStatistics();
  }, [siteKey]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : `${d.getDate()}/${d.getMonth() + 1}`;
  };

  // Lọc biểu đồ tròn: Chuyên lọc bỏ các trạng thái có 0 lead (Tiếng Trung đang bị)
  const validConversions = conversion?.breakdown?.filter(item => item.count > 0) || [];

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
      
      {/* HEADER TỰ ĐỘNG ĐỔI TÊN */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
            <Globe className="w-3 h-3 text-blue-500" />
            Dashboard ({siteName})
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Thống Kê Khách Hàng</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Tổng quan dữ liệu thu thập được từ Landing Page {siteName}</p>
        </div>
        <button 
          onClick={fetchStatistics}
          className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 font-bold text-sm text-slate-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Cập nhật Data
        </button>
      </div>

      {/* TỔNG QUAN TỔNG SỐ */}
      {conversion && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center gap-5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl"></div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
              <Users className="w-7 h-7" />
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng Leads Thu Được</p>
              <h3 className="text-4xl font-black text-slate-800">{conversion.totalLeads}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: TRENDS */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-black text-slate-800">Xu Hướng Thu Thập Theo Ngày</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="_id" tickFormatter={formatDate} fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  labelFormatter={(label) => `Ngày: ${new Date(label).toLocaleDateString('vi-VN')}`}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Area type="monotone" dataKey="leads" name="Tổng Leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="suspicious" name="Đáng ngờ (Spam)" stroke="#ef4444" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: CONVERSION (Lọc mượt mà) */}
        <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xl font-black text-slate-800">Tỷ Lệ Chuyển Đổi</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            {validConversions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={validConversions}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                    stroke="none"
                  >
                    {validConversions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [`${value} Leads (${props.payload.percentage})`, STATUS_LABELS[name] || name]}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    formatter={(value) => <span className="text-slate-700 font-bold ml-1">{STATUS_LABELS[value] || value}</span>}
                    verticalAlign="bottom" height={36} 
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                  <PieChartIcon className="w-8 h-8 text-slate-300" />
                </div>
                <div className="text-slate-400 font-bold">Chưa có đủ dữ liệu</div>
                <div className="text-xs text-slate-400 mt-1">Hãy chờ có Lead đầu tiên nhé</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE: KOC PERFORMANCE */}
      <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-black text-slate-800">Hiệu Suất KOC / Affiliate</h3>
        </div>
        
        <div className="overflow-x-auto no-scrollbar">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-400 tracking-[0.25em]">
                <th className="px-6 py-5 rounded-tl-2xl">Mã KOC</th>
                <th className="px-6 py-5">Tổng Lead</th>
                <th className="px-6 py-5 text-emerald-500">Đăng ký (Success)</th>
                <th className="px-6 py-5 text-red-400">Spam / Đáng ngờ</th>
                <th className="px-6 py-5">Chuyển đổi</th>
                <th className="px-6 py-5 rounded-tr-2xl text-right">Lead gần nhất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kocs.length > 0 ? kocs.map((koc) => (
                <tr key={koc._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-base font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                      {koc.koc}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-700 text-base">{koc.totalLeads}</td>
                  <td className="px-6 py-4 font-black text-emerald-500 text-base">{koc.enrolled}</td>
                  <td className="px-6 py-4 font-black text-red-500 text-base">{koc.suspicious}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 font-bold rounded-full text-xs ${
                      koc.conversionRate > 20 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      koc.conversionRate > 0 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {koc.conversionRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 text-xs font-bold">
                    {koc.lastLeadAt ? new Date(koc.lastLeadAt).toLocaleString('vi-VN') : '---'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                      <BarChart3 className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="text-slate-500 font-bold">Chưa có hoạt động Affiliate nào cho chiến dịch {siteName}</div>
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