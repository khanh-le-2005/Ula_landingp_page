import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
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
  adminLabel
} from '../adminTheme';
import { useProject } from '@/src/ula-chinese/pages/admin/context/ProjectContext';

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
    isActive: true,
    commissionRate: 0.15,
    notes: ''
  });

  // UTM Links Modal State
  const [isUtmModalOpen, setIsUtmModalOpen] = useState(false);
  const [utmLinksData, setUtmLinksData] = useState<AffiliateLinksResponse | null>(null);
  const [isLoadingUtm, setIsLoadingUtm] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const affData = await fetchAffiliates(activeProject);
      setAffiliates(Array.isArray(affData) ? affData : []);

      setStats({
        totalLeads: 0,
        totalSuspicious: 0,
        byAffiliate: []
      });

    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu KOC');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeProject]);

  const filteredAffiliates = useMemo(() => {
    if (!Array.isArray(affiliates)) return [];
    return affiliates.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [affiliates, searchQuery]);

  const getActiveSitePath = () => {
    if (activeProject === 'tieng-trung') return '/chinese';
    return '/chinese';
  };

  const getTrackingLink = (aff: Affiliate) => {
    const baseUrl = window.location.origin;
    const path = getActiveSitePath();
    const url = new URL(`${baseUrl}${path}`);

    url.searchParams.set('utm_source', 'koc');
    url.searchParams.set('utm_medium', 'affiliate');
    if (activeCampaign) {
      url.searchParams.set('utm_campaign', activeCampaign);
    }
    url.searchParams.set('ref', aff.code); // Gắn đúng mã KOC vào biến ref

    return decodeURIComponent(url.toString());
  };

  const handleCopyLink = (aff: Affiliate) => {
    const link = getTrackingLink(aff);
    navigator.clipboard.writeText(link);
    setCopiedCode(aff.code);
    toast.success('Đã copy link tracking!');
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
        isActive: aff.isActive !== false,
        commissionRate: aff.commissionRate || 0.15,
        notes: aff.notes || ''
      });
    } else {
      setEditingAffiliate(null);
      setFormData({
        name: '',
        code: '',
        phone: '',
        email: '',
        isActive: true,
        commissionRate: 0.15,
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        siteKey: activeProject,
        name: formData.name?.trim(),
        code: formData.code?.trim().toUpperCase().replace(/\s+/g, ''),
        email: formData.email?.trim(),
        phone: formData.phone?.trim(),
        isActive: formData.isActive,
        commissionRate: Number(formData.commissionRate),
        notes: formData.notes?.trim()
      };

      if (editingAffiliate) {
        await updateAffiliate(editingAffiliate._id, payload);
        toast.success('Cập nhật thông tin đối tác thành công!');
      } else {
        await createAffiliate(payload);
        toast.success('Thêm đối tác thành công!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu thông tin');
      toast.error('Lỗi khi lưu thông tin!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đối tác này? Toàn bộ link của họ sẽ ngưng hoạt động!')) return;
    setIsLoading(true);
    try {
      await deleteAffiliate(id);
      toast.success('Đã xóa đối tác thành công!');
      loadData();
    } catch (err: any) {
      setError(err.message || 'Lỗi khi xóa');
      toast.error('Xóa đối tác thất bại!');
    } finally {
      setIsLoading(false);
    }
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
      toast.error('Lỗi lấy link UTM');
    } finally {
      setIsLoadingUtm(false);
    }
  };

  const handleCopyAnyLink = (url: string, index: number | string) => {
    navigator.clipboard.writeText(url);
    setCopiedCode('link-' + index);
    toast.success('Đã chép link!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getKocStats = (code: string) => {
    return stats?.byAffiliate.find(s => s._id === code) || { total: 0, suspicious: 0 };
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
                      <tr key={aff._id} className={`group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0 ${aff.isActive === false ? 'opacity-60' : ''}`}>
                        <td className="px-6 py-6">
                          <div className="space-y-1.5">
                            <div className="font-black text-slate-900 text-base tracking-tight flex items-center gap-2">
                              {aff.name}
                              {aff.isActive === false && (
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-[9px] text-slate-500 uppercase tracking-widest">Ngừng HĐ</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              {aff.phone && (
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                  <Phone className="w-2.5 h-2.5" />
                                  {aff.phone}
                                </div>
                              )}
                              {aff.email && (
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                  <Mail className="w-2.5 h-2.5" />
                                  {aff.email}
                                </div>
                              )}
                            </div>
                            {/* Hiển thị Rate nhỏ dưới tên */}
                            {aff.commissionRate && (
                              <div className="text-[10px] text-emerald-600 font-bold font-mono tracking-widest mt-1">
                                RATE: {(aff.commissionRate * 100).toFixed(0)}%
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="inline-flex px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600 font-mono font-black text-xs tracking-widest">
                            {aff.code}
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
      {/* Management Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-300">

            {/* Header (Ghim cố định) */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{editingAffiliate ? 'Chỉnh sửa' : 'Tạo mới'} <span className={adminAccentText}>KOC</span></h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Thông tin đối tác tiếp thị</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-9 w-9 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-rose-500 transition-all border border-slate-200 shadow-sm">
                <X size={18} />
              </button>
            </div>

            {/* Body (Phần cuộn được) */}
            <div className="overflow-y-auto p-5 sm:p-6 no-scrollbar">
              <form id="affiliate-form" onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className={adminLabel}>Tên hiển thị (KOC Name)</label>
                    <input
                      required
                      className={adminInput}
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="v.d. Nguyễn Văn A"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={adminLabel}>Mã giới thiệu (Code)</label>
                    <input
                      required
                      className={`${adminInput} font-mono`}
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '') })}
                      placeholder="v.d. KOC_01"
                      disabled={!!editingAffiliate}
                    />
                    <p className="text-[9px] text-slate-400 italic">Viết liền, không dấu.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className={adminLabel}>Số điện thoại</label>
                    <input
                      className={adminInput}
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="09xx..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={adminLabel}>Email</label>
                    <input
                      type="email"
                      className={adminInput}
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="koc@example.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={adminLabel}>Tỷ lệ hoa hồng</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      className={adminInput}
                      value={formData.commissionRate}
                      onChange={e => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 0 })}
                      placeholder="0.15"
                    />
                    <p className="text-[9px] text-slate-400 italic">Dạng thập phân (0.15 = 15%)</p>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className={adminLabel}>Trạng thái hoạt động</label>
                    <select
                      className={adminInput}
                      value={formData.isActive ? "true" : "false"}
                      onChange={e => setFormData({ ...formData, isActive: e.target.value === "true" })}
                    >
                      <option value="true">Đang hoạt động</option>
                      <option value="false">Ngừng hoạt động</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className={adminLabel}>Ghi chú</label>
                    <textarea
                      className={`${adminInput} resize-none min-h-[80px] py-3`}
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Thông tin thêm về KOC..."
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer (Ghim cố định ở dưới cùng) */}
            <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className={adminSecondaryButton}>
                Hủy bỏ
              </button>
              {/* Dùng thuộc tính form="affiliate-form" để gọi submit từ bên ngoài thẻ form */}
              <button type="submit" form="affiliate-form" disabled={isLoading} className={adminPrimaryButton}>
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : editingAffiliate ? 'Cập nhật ngay' : 'Tạo KOC'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* UTM Links Modal - Tự động sinh link phân loại nền tảng */}
      {isUtmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-300">

            {/* Header (Cố định) */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                  <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Cấp phát Link tự động</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Các liên kết được thiết kế riêng cho KOC này</p>
                </div>
              </div>
              <button onClick={() => setIsUtmModalOpen(false)} className="h-9 w-9 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-rose-500 transition-all border border-slate-200 shadow-sm">
                <X size={18} />
              </button>
            </div>

            {/* Body (Phần có thể cuộn) */}
            <div className="overflow-y-auto p-5 sm:p-6 no-scrollbar flex-grow">
              {isLoadingUtm ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Đang khởi tạo links...</span>
                </div>
              ) : utmLinksData ? (
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex gap-4 items-center">
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Đối tác (KOC)</div>
                      <div className="font-bold text-slate-900 text-base sm:text-lg truncate">{utmLinksData.affiliateName}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">Mã Tracking (Ref)</div>
                      <div className="font-mono font-bold text-slate-900 text-base sm:text-lg">{utmLinksData.referralCode}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {utmLinksData.links.map((link, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 sm:p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-slate-50 transition-colors">
                        <div className="w-full sm:w-28 shrink-0 font-black text-xs uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-2 sm:py-1.5 rounded-lg text-center">
                          {link.platform}
                        </div>
                        <div className="flex-1 w-full bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-medium text-slate-500 truncate lowercase border border-slate-200 shadow-sm">
                          {link.url}
                        </div>
                        <button
                          onClick={() => handleCopyAnyLink(link.url, idx)}
                          className={`w-full sm:w-auto h-9 sm:h-10 px-5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${copiedCode === 'link-' + idx
                              ? "bg-emerald-500 text-white shadow-lg"
                              : "bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white"
                            }`}
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
              ) : (
                <div className="text-center py-10 text-sm text-slate-400 font-medium">Không có dữ liệu Link.</div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}