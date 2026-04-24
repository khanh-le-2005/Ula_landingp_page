import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, 
  Link as LinkIcon, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Edit2, 
  Trash2, 
  Activity, 
  BarChart3, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  X,
  Mail,
  Phone,
  Share2
} from 'lucide-react';
import { 
  fetchAffiliates, 
  createAffiliate, 
  updateAffiliate, 
  deleteAffiliate, 
  fetchAffiliateStats,
  fetchAffiliateLinks,
  type Affiliate,
  type AffiliateStats,
  type AffiliateLinksResponse
} from '../adminApi';
import { 
  adminCard, 
  adminAccentText, 
  adminPrimaryButton, 
  adminSecondaryButton, 
  adminInput, 
  adminLabel,
  adminCardSoft
} from '../adminTheme';
import { useProject } from '../context/ProjectContext';

export default function Affiliates() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { activeProject, activeCampaign } = useProject();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [formData, setFormData] = useState<Partial<Affiliate>>({
    name: '',
    code: '',
    phone: '',
    email: '',
    source: 'Influencer'
  });

  // UTM Links Modal State
  const [isUtmModalOpen, setIsUtmModalOpen] = useState(false);
  const [utmLinksData, setUtmLinksData] = useState<AffiliateLinksResponse | null>(null);
  const [isLoadingUtm, setIsLoadingUtm] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [affData, statsData] = await Promise.all([
        fetchAffiliates(),
        fetchAffiliateStats()
      ]);
      setAffiliates(Array.isArray(affData) ? affData : []);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu KOC');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAffiliates = useMemo(() => {
    if (!Array.isArray(affiliates)) return [];
    return affiliates.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [affiliates, searchQuery]);

  const getActiveSitePath = () => {
    if (activeProject === 'tieng-duc') return '/german';
    return '/chinese'; // Mặc định là Chinese
  };

  const handleCopyLink = (code: string) => {
    const baseUrl = window.location.origin;
    const path = getActiveSitePath();
    // Nếu đang chọn một campaign trong Admin, thì link tạo ra cũng phải chứa campaign đó
    const campaignSuffix = activeCampaign ? `&campaign=${activeCampaign}` : '';
    const link = `${baseUrl}${path}?ref=${code}${campaignSuffix}`;
    
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenModal = (aff?: Affiliate) => {
    if (aff) {
      setEditingAffiliate(aff);
      setFormData({
        name: aff.name,
        code: aff.code,
        phone: aff.phone || '',
        email: aff.email || '',
        source: aff.source || 'Influencer'
      });
    } else {
      setEditingAffiliate(null);
      setFormData({
        name: '',
        code: '',
        phone: '',
        email: '',
        source: 'Influencer'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingAffiliate) {
        await updateAffiliate(editingAffiliate._id, formData);
      } else {
        await createAffiliate(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu thông tin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa KOC này?')) return;
    setIsLoading(true);
    try {
      await deleteAffiliate(id);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get stats for a specific code
  const getKocStats = (code: string) => {
    return stats?.byAffiliate.find(s => s._id === code) || { total: 0, suspicious: 0 };
  };

  const handleOpenUtmModal = async (aff: Affiliate) => {
    setIsUtmModalOpen(true);
    setIsLoadingUtm(true);
    setUtmLinksData(null);
    try {
      const data = await fetchAffiliateLinks(aff._id, activeProject);
      setUtmLinksData(data);
    } catch (err: any) {
      setError(err.message || 'Lỗi lấy link UTM');
    } finally {
      setIsLoadingUtm(false);
    }
  };

  const handleCopyAnyLink = (url: string, index: number | string) => {
    navigator.clipboard.writeText(url);
    setCopiedCode('link-' + index);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={adminCard}>
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <div className={adminLabel}>Tổng số đối tác</div>
                 <div className="text-2xl font-black text-slate-900">{(affiliates || []).length} <span className="text-sm font-bold text-slate-400 font-sans tracking-normal">KOC</span></div>
              </div>
           </div>
        </div>

        <div className={adminCard}>
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                 <Activity className="w-6 h-6" />
              </div>
              <div>
                 <div className={adminLabel}>Tổng Leads mang về</div>
                 <div className="text-2xl font-black text-slate-900">{stats?.totalLeads || 0} <span className="text-sm font-bold text-slate-400 font-sans tracking-normal">Đăng ký</span></div>
              </div>
           </div>
        </div>

        <div className={adminCard}>
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
                 <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                 <div className={adminLabel}>Tỷ lệ chuyển đổi</div>
                 <div className="text-2xl font-black text-slate-900">12.5% <span className="text-sm font-bold text-slate-400 font-sans tracking-normal">Trung bình</span></div>
              </div>
           </div>
        </div>
      </div>

      <section className={adminCard}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
              <LinkIcon className="w-3 h-3" />
              Tiếp thị liên kết
            </div>
            <h2 className="text-3xl font-black text-black tracking-tight">Đối tác <span className={adminAccentText}>KOC / Affiliates</span></h2>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm KOC hoặc mã..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${adminInput} !pl-11 !py-2.5 max-w-[240px] text-xs`}
                />
             </div>
             <button
              type="button"
              onClick={() => handleOpenModal()}
              className={adminPrimaryButton}
            >
              <Plus className="h-4 w-4" />
              Thêm KOC
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 flex items-center gap-4 text-rose-400 font-bold text-sm">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {/* Table */}
        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-[0.25em] text-slate-400">
                  <th className="px-6 py-5">Đối tác / KOC</th>
                  <th className="px-6 py-5">Mã giới thiệu (Code)</th>
                  <th className="px-6 py-5">Link Tracking</th>
                  <th className="px-6 py-5 text-center">Hiệu suất</th>
                  <th className="px-6 py-5 text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && affiliates.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={5}>
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Đang tải danh sách...</span>
                        </div>
                    </td>
                  </tr>
                ) : filteredAffiliates.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={5}>
                        <div className="flex flex-col items-center gap-4 text-slate-400 font-bold italic">
                            <Users className="h-10 w-10 opacity-20" />
                            <span>Không tìm thấy đối tác nào phù hợp.</span>
                        </div>
                    </td>
                  </tr>
                ) : (
                  filteredAffiliates.map((aff) => {
                    const kocStats = getKocStats(aff.code);
                    return (
                      <tr key={aff._id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0">
                        <td className="px-6 py-6">
                            <div className="space-y-1.5">
                                <div className="font-black text-slate-900 text-base tracking-tight">{aff.name}</div>
                                <div className="flex items-center gap-4">
                                   {aff.phone && (
                                     <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        <Phone className="w-2.5 h-2.5" />
                                        {aff.phone}
                                     </div>
                                   )}
                                   <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                      {aff.source || 'Influencer'}
                                   </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="inline-flex px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 font-mono font-black text-xs tracking-widest">
                              {aff.code}
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex items-center gap-2 group/link">
                              <div className="h-10 px-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 max-w-[200px] overflow-hidden">
                                 <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                                 <span className="text-[10px] font-medium text-slate-500 truncate lowercase">
                                    {window.location.origin}{getActiveSitePath()}?ref={aff.code}
                                 </span>
                              </div>
                              <button 
                                onClick={() => handleCopyLink(aff.code)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm shrink-0"
                                title="Sao chép link tracking"
                              >
                                {copiedCode === aff.code ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => handleOpenUtmModal(aff)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-indigo-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm shrink-0"
                                title="Tạo link UTM"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex flex-col items-center gap-1">
                              <div className="text-sm font-black text-slate-900">{kocStats.total}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Leads</div>
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex justify-end gap-2 text-end">
                              <button 
                                onClick={() => handleOpenModal(aff)}
                                className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(aff._id)}
                                className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="relative w-full max-w-lg overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                       <Plus className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">{editingAffiliate ? 'Chỉnh sửa' : 'Tạo mới'} <span className={adminAccentText}>KOC</span></h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Thông tin đối tác tiếp thị</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-rose-500 transition-all border border-slate-200 shadow-sm">
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                       <label className={adminLabel}>Tên hiển thị (KOC Name)</label>
                       <input 
                        required
                        className={adminInput}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="v.d. Yoncy Nguyễn"
                       />
                    </div>
                    
                    <div className="space-y-2">
                       <label className={adminLabel}>Mã giới thiệu (Code)</label>
                       <input 
                        required
                        className={`${adminInput} font-mono`}
                        value={formData.code}
                        onChange={e => setFormData({...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '')})}
                        placeholder="v.d. KOC_01"
                        disabled={!!editingAffiliate}
                       />
                       <p className="text-[9px] text-slate-400 italic">Không được trùng, không chứa dấu cách.</p>
                    </div>

                    <div className="space-y-2">
                       <label className={adminLabel}>Nguồn khách (Source)</label>
                       <select 
                        className={adminInput}
                        value={formData.source}
                        onChange={e => setFormData({...formData, source: e.target.value})}
                       >
                          <option value="Influencer">Influencer</option>
                          <option value="Facebook">Facebook Ads</option>
                          <option value="Tiktok">Tiktok Ads</option>
                          <option value="Youtube">Youtube</option>
                          <option value="Partner">Đối tác giáo dục</option>
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className={adminLabel}>Số điện thoại</label>
                       <input 
                        className={adminInput}
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="09xx..."
                       />
                    </div>

                    <div className="space-y-2">
                       <label className={adminLabel}>Email</label>
                       <input 
                        type="email"
                        className={adminInput}
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="koc@ula.edu.vn"
                       />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsModalOpen(false)} className={adminSecondaryButton}>Hủy bỏ</button>
                    <button type="submit" disabled={isLoading} className={adminPrimaryButton}>
                       {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : editingAffiliate ? 'Cập nhật ngay' : 'Tạo KOC'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
      {/* UTM Links Modal */}
      {isUtmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="relative w-full max-w-2xl overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-900 flex items-center justify-center text-white shadow-lg shadow-indigo-900/20">
                       <Share2 className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight">UTM Tracking Links</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Các liên kết có sẵn cho Campaign</p>
                    </div>
                 </div>
                 <button onClick={() => setIsUtmModalOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-rose-500 transition-all border border-slate-200 shadow-sm">
                    <X size={20} />
                 </button>
              </div>

              <div className="p-8 space-y-6">
                 {isLoadingUtm ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                       <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
                       <span className="text-xs font-black uppercase tracking-widest text-slate-400">Đang khởi tạo links...</span>
                    </div>
                 ) : utmLinksData ? (
                    <div className="space-y-4">
                       <div className="mb-6 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-4 items-center">
                          <div className="flex-1">
                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Đối tác</div>
                            <div className="font-bold text-slate-900">{utmLinksData.affiliateName}</div>
                          </div>
                          <div className="flex-1">
                            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Mã tham chiếu</div>
                            <div className="font-mono font-bold text-slate-900">{utmLinksData.referralCode}</div>
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          {utmLinksData.links.map((link, idx) => (
                             <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-colors">
                                <div className="w-24 shrink-0 font-black text-xs uppercase tracking-wider text-slate-700">
                                   {link.platform}
                                </div>
                                <div className="flex-1 w-full bg-slate-100 px-4 py-2 rounded-xl text-xs font-medium text-slate-500 truncate lowercase border border-slate-200">
                                   {link.url}
                                </div>
                                <button 
                                  onClick={() => handleCopyAnyLink(link.url, idx)}
                                  className={copiedCode === 'link-' + idx ? adminSecondaryButton + " !bg-emerald-50 !text-emerald-600 !border-emerald-200" : adminSecondaryButton}
                                >
                                  {copiedCode === 'link-' + idx ? (
                                    <><Check className="w-4 h-4" /> Đã chép</>
                                  ) : (
                                    <><Copy className="w-4 h-4" /> Copy</>
                                  )}
                                </button>
                             </div>
                          ))}
                       </div>
                    </div>
                 ) : null}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
