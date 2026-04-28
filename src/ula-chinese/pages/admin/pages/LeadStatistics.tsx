import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  RefreshCw,
  Globe,
  Target,
  ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Import Context để tự động biết bạn đang ở Tiếng Đức hay Tiếng Trung
import { useSiteContext } from '../../../context/LandingSiteContext';

// --- 1. ĐỊNH NGHĨA TYPES ---
interface TrendData {
  _id: string; 
  leads: number;
  suspicious: number;
}

interface ConversionData {
  totalLeads: number;
  breakdown: {
    status: string;
    count: number;
    percentage: string;
  }[];
}

interface KocPerformance {
  koc: string;
  totalLeads: number;
  conversionRate: number;
  enrolled?: number;
  suspicious?: number; 
}

const COLORS = {
  'NEW': '#3b82f6',       
  'CONTACTED': '#f59e0b', 
  'ENROLLED': '#10b981',  
  'CANCELLED': '#ef4444', 
  'DEFAULT': '#94a3b8'    
};

const STATUS_LABELS: Record<string, string> = {
  'NEW': 'Lead Mới',
  'CONTACTED': 'Đã Liên Hệ',
  'ENROLLED': 'Thành Công',
  'CANCELLED': 'Hủy Bỏ'
};

export default function LeadStatistics() {
  // BƯỚC QUAN TRỌNG: Lấy siteKey tự động từ Context (Thay vì fix cứng 'tieng-duc')
  // Khi bạn chuyển Menu sang Tiếng Trung, siteKey này sẽ tự đổi thành 'tieng-trung'
  const { siteKey } = useSiteContext(); 
  
  // State quản lý dữ liệu
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [conversion, setConversion] = useState<ConversionData | null>(null);
  const [kocs, setKocs] = useState<KocPerformance[]>([]);
  
  // State trạng thái UI
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- 2. HÀM FETCH DỮ LIỆU TỰ ĐỘNG ĐỔI THEO SITEKEY ---
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    
    const token = localStorage.getItem('ula_admin_token') || ''; 
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      // API SẼ TỰ ĐỘNG GẮN ?site=tieng-duc HOẶC ?site=tieng-trung TÙY THUỘC VÀO TRANG BẠN ĐANG MỞ
      const [trendsRes, conversionRes, kocsRes] = await Promise.all([
        fetch(`/api/leads/stats/trends?site=${siteKey}`, { headers }),
        fetch(`/api/leads/stats/conversion?site=${siteKey}`, { headers }),
        fetch(`/api/leads/stats/kocs?site=${siteKey}`, { headers })
      ]);

      if (!trendsRes.ok || !conversionRes.ok || !kocsRes.ok) {
        throw new Error(`Lỗi tải dữ liệu cho ${siteKey.toUpperCase()}. Vui lòng kiểm tra lại.`);
      }

      const trendsData = await trendsRes.json();
      const conversionData = await conversionRes.json();
      const kocsData = await kocsRes.json();

      setTrends(trendsData.trends || []);
      setConversion(conversionData || null);
      setKocs(kocsData.performance || []);

    } catch (err) {
      console.error('Lỗi tải dữ liệu dashboard:', err);
      setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động load lại biểu đồ nếu bạn click chuyển đổi ngôn ngữ
  useEffect(() => {
    void fetchDashboardData();
  }, [siteKey]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const totalSuspicious = trends.reduce((sum, item) => sum + (item.suspicious || 0), 0);
  const validBreakdown = conversion?.breakdown?.filter(item => item.count > 0) || [];

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
        <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
        <div className="text-slate-500 font-bold animate-pulse">Đang lấy dữ liệu {siteKey}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-black text-lg">Lỗi tải dữ liệu</h3>
          <p className="font-medium mt-1">{error}</p>
          <button onClick={fetchDashboardData} className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-bold text-sm transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* HEADER TỰ ĐỘNG ĐỔI TÊN THEO SITE */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            Dashboard ({siteKey === 'tieng-duc' ? 'Đức - DE' : 'Trung Quốc - CN'})
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Thống Kê Khách Hàng</h2>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-900/20"
        >
          <RefreshCw className="w-4 h-4" /> Cập nhật {siteKey === 'tieng-duc' ? 'DE' : 'CN'}
        </button>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors"></div>
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/30">
            <Users className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tổng Leads</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{conversion?.totalLeads || 0}</h3>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors"></div>
          <div className="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-500/30">
            <Target className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Lead Thành Công</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">
              {conversion?.breakdown.find(b => b.status === 'ENROLLED')?.count || 0}
            </h3>
          </div>
        </div>

        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-red-50 rounded-full blur-3xl group-hover:bg-red-100 transition-colors"></div>
          <div className="p-4 bg-gradient-to-br from-rose-400 to-red-600 text-white rounded-2xl shadow-lg shadow-red-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Lead rác / Đáng ngờ</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalSuspicious}</h3>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: TRENDS */}
        <div className="lg:col-span-2 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
              <h3 className="text-xl font-black text-slate-800">Biểu đồ tăng trưởng</h3>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSuspicious" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="_id" tickFormatter={formatDate} fontSize={12} tickLine={false} axisLine={false} dy={10} stroke="#94a3b8" />
                <YAxis fontSize={12} tickLine={false} axisLine={false} stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                <Tooltip 
                  labelFormatter={(label) => `Ngày: ${new Date(label).toLocaleDateString('vi-VN')}`}
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={40} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }}/>
                <Area type="monotone" dataKey="leads" name="Tổng số Lead" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="suspicious" name="Lead Đáng ngờ" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorSuspicious)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: CONVERSION */}
        <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600"><PieChartIcon className="w-5 h-5" /></div>
            <h3 className="text-xl font-black text-slate-800">Tỷ lệ Trạng thái</h3>
          </div>
          <div className="flex-1 min-h-[320px]">
            {validBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={validBreakdown}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                    stroke="none"
                  >
                    {validBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || COLORS.DEFAULT} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [`${value} Leads (${props.payload.percentage})`, STATUS_LABELS[name] || name]}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    formatter={(value) => <span className="text-slate-700 font-bold ml-2">{STATUS_LABELS[value] || value}</span>}
                    verticalAlign="bottom" height={60} iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center pb-10">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <PieChartIcon className="w-8 h-8 text-slate-300" />
                </div>
                <div className="text-slate-500 font-bold text-lg">Chưa có dữ liệu</div>
                <div className="text-sm text-slate-400 mt-1">Dữ liệu phân bổ sẽ xuất hiện khi có Lead.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE: KOC PERFORMANCE */}
      <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600"><BarChart3 className="w-5 h-5" /></div>
            <h3 className="text-xl font-black text-slate-800">Hiệu suất KOC / Đối tác</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-100">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">
                <th className="px-6 py-5">Mã KOC</th>
                <th className="px-6 py-5">Số Lead mang về</th>
                <th className="px-6 py-5">Tỉ lệ chuyển đổi (CVR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kocs.length > 0 ? kocs.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-mono text-base font-black text-indigo-600 bg-indigo-50/50 border border-indigo-100 px-3 py-1.5 rounded-lg">
                      {item.koc}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-700 text-lg">
                    {item.totalLeads}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-1.5 font-black rounded-full text-xs tracking-wider ${
                      item.conversionRate >= 15 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      item.conversionRate > 0 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {item.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-3">
                      <BarChart3 className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="text-slate-500 font-bold text-base">Chưa có dữ liệu thống kê Affiliate cho {siteKey.toUpperCase()}</div>
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
