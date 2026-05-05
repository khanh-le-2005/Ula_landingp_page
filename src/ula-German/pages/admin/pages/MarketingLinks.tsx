import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify'; // 👉 Thêm Toastify
import {
  Link as LinkIcon,
  Users,
  Plus,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  X,
  Tag,
  Share2,
  Globe,
  Pencil,
} from 'lucide-react';
import {
  fetchMarketingLinks,
  createMarketingLink,
  updateMarketingLink,
  deleteMarketingLink,
  fetchMarketingMetaOptions,
  type MarketingLink,
  type MarketingMetaOptions,
} from '../adminApi';
import {
  adminCard,
  adminAccentText,
  adminPrimaryButton,
  adminSecondaryButton,
  adminInput,
  adminLabel,
} from '../adminTheme';
import { useProject } from '@/src/ula-chinese/pages/admin/context/ProjectContext';

// 👉 BƯỚC 1: CUSTOM HOOK CHẶN SPAM TÌM KIẾM
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function MarketingLinks() {
  const { activeProject } = useProject();
  const [links, setLinks] = useState<MarketingLink[]>([]);
  const [metaOptions, setMetaOptions] = useState<MarketingMetaOptions | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300); // Trễ 300ms khi gõ tìm kiếm
  
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MarketingLink>>({
    name: '', tag: '', ref: '', utm_source: '', utm_medium: '', utm_campaign: '', notes: '',
  });

  // 👉 BƯỚC 2: HÀM GỌI API AN TOÀN (CỜ HỦY & PROMISE.ALLSETTLED)
  const loadData = async (isCancelled: boolean = false) => {
    setIsLoading(true);
    setError('');
    
    try {
      const results = await Promise.allSettled([
        fetchMarketingLinks(activeProject),
        fetchMarketingMetaOptions(activeProject),
      ]);

      if (isCancelled) return;

      if (results[0].status === 'fulfilled') {
        const linksData = results[0].value;
        setLinks(Array.isArray(linksData) ? linksData : []);
      } else {
        setError("Không thể tải danh sách Link Tracking");
      }

      if (results[1].status === 'fulfilled') {
        setMetaOptions(results[1].value);
      }

    } catch (err: any) {
      if (!isCancelled) setError(err.message || 'Không thể tải dữ liệu Links');
    } finally {
      if (!isCancelled) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    void loadData(isCancelled);
    return () => { isCancelled = true; };
  }, [activeProject]);

  const handleManualRefresh = () => {
    void loadData(false);
  };

  // Logic lọc Text chạy trên Frontend (Nhanh và mượt nhờ dùng debouncedSearch)
  const filteredLinks = useMemo(() => {
    if (!Array.isArray(links)) return [];
    if (!debouncedSearch.trim()) return links;
    
    const query = debouncedSearch.toLowerCase();
    return links.filter((l) =>
      (l.name && l.name.toLowerCase().includes(query)) ||
      (l.fullUrl && l.fullUrl.toLowerCase().includes(query)) ||
      (l.tag && l.tag.toLowerCase().includes(query)) ||
      (l.ref && l.ref.toLowerCase().includes(query))
    );
  }, [links, debouncedSearch]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Đã sao chép đường link!'); // 👉 Toastify Copy
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenModal = (link?: MarketingLink) => {
    if (link) {
      setEditingId(link._id);
      setFormData({
        name: link.name, tag: link.tag, ref: link.ref, utm_source: link.utm_source,
        utm_medium: link.utm_medium, utm_campaign: link.utm_campaign, notes: link.notes,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', tag: '', ref: '', utm_source: '', utm_medium: '', utm_campaign: '', notes: '',
      });
    }
    setIsModalOpen(true);
  };

  // 👉 BƯỚC 3: XỬ LÝ LƯU & XÓA BẰNG TOASTIFY
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      toast.warning("Vui lòng nhập Tên Link Tracking!");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        siteKey: activeProject,
        name: formData.name.trim(),
        tag: formData.tag || undefined,
        ref: formData.ref || undefined,
        utm_source: formData.utm_source || undefined,
        utm_medium: formData.utm_medium || undefined,
        utm_campaign: formData.utm_campaign?.trim() || undefined,
        notes: formData.notes?.trim(),
        isActive: true,
      };

      if (editingId) {
        await updateMarketingLink(editingId, payload);
        toast.success("Cập nhật Link Tracking thành công!");
      } else {
        await createMarketingLink(payload);
        toast.success("Tạo Link Tracking mới thành công!");
      }

      setIsModalOpen(false);
      await loadData(false);
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi lưu Link Tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Link Tracking này? (Dữ liệu cũ vẫn được giữ nhưng link sẽ không hoạt động)')) return;
    
    setIsLoading(true);
    try {
      await deleteMarketingLink(id);
      toast.success("Đã xóa Link Tracking thành công!");
      await loadData(false);
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa Link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <section className={adminCard}>
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
              <Globe className="w-3 h-3 text-indigo-500" />
              Công cụ Marketing
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-black tracking-tight">
                UTM Link <span className={adminAccentText}>Builder</span>
              </h2>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeProject === 'tieng-duc' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                {activeProject === 'tieng-duc' ? 'Trang Đức (DE)' : 'Trang Trung (CN)'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleManualRefresh} className={adminSecondaryButton} title="Đồng bộ">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm link, tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${adminInput} !pl-11 !py-2 max-w-[240px] text-xs h-[42px]`}
              />
            </div>
            <button type="button" onClick={() => handleOpenModal()} className={`${adminPrimaryButton} h-[42px]`}>
              <Plus className="h-4 w-4" />
              Tạo Link Mới
            </button>
          </div>
        </div>

        {/* Ô Tìm Kiếm dành riêng cho Mobile */}
        <div className="relative group sm:hidden mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, tag, utm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${adminInput} !pl-11 !py-3 w-full text-xs`}
          />
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5 flex items-center gap-4 text-rose-400 font-bold text-sm">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-[0.25em] text-slate-400">
                  <th className="px-6 py-5">Tên Link / Ghi chú</th>
                  <th className="px-6 py-5">Thông số Tracking</th>
                  <th className="px-6 py-5">Link Đích (Destination)</th>
                  <th className="px-6 py-5 text-center">Hiệu suất</th>
                  <th className="px-6 py-5 text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && links.length === 0 ? (
                  <tr>
                    <td className="px-6 py-16 text-center" colSpan={5}>
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Đang tải danh sách link...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLinks.length === 0 ? (
                  <tr>
                    <td className="px-6 py-16 text-center" colSpan={5}>
                      <div className="flex flex-col items-center gap-4 text-slate-400 font-bold italic">
                        <div className="p-4 bg-slate-50 rounded-full"><LinkIcon className="h-8 w-8 text-slate-300" /></div>
                        <span>Không tìm thấy Tracking Link nào phù hợp.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((link) => (
                    <tr key={link._id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0">
                      <td className="px-6 py-6 max-w-[250px]">
                        <div className="space-y-1.5">
                          <div className="font-black text-slate-900 text-base tracking-tight leading-snug">{link.name}</div>
                          {link.notes && (
                            <div className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed bg-slate-100/50 p-2 rounded-lg border border-slate-100">{link.notes}</div>
                          )}
                          <div className="text-[9px] font-mono text-slate-400 mt-2">
                            {new Date(link.createdAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 max-w-[300px]">
                        <div className="flex flex-wrap gap-2">
                          {link.tag && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                              <Tag className="w-3 h-3" /> Camp: {link.tag}
                            </span>
                          )}
                          {link.ref && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                              <Users className="w-3 h-3" /> Ref: {link.ref}
                            </span>
                          )}
                          {link.utm_source && (
                            <span className="inline-flex px-2.5 py-1.5 rounded-lg bg-slate-100 text-[10px] font-mono font-bold text-slate-600 border border-slate-200">
                              src: {link.utm_source}
                            </span>
                          )}
                          {link.utm_medium && (
                            <span className="inline-flex px-2.5 py-1.5 rounded-lg bg-slate-100 text-[10px] font-mono font-bold text-slate-600 border border-slate-200">
                              med: {link.utm_medium}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 group/link">
                            <div className="h-10 px-4 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 max-w-[250px] overflow-hidden">
                              <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="text-[10px] font-bold text-slate-500 truncate" title={link.fullUrl}>
                                {link.fullUrl}
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopy(link.fullUrl, link._id)}
                              className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm shrink-0"
                              title="Sao chép Link"
                            >
                              {copiedCode === link._id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                          {link.campaignInfo && (link.campaignInfo.promoCode || link.campaignInfo.discountText) && (
                            <div className="flex flex-col gap-1 mt-1 p-2 bg-rose-50/50 border border-rose-100 rounded-xl">
                              {link.campaignInfo.promoCode && (
                                <div className="text-[10px] font-black uppercase tracking-widest text-rose-600 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Mã: {link.campaignInfo.promoCode}
                                </div>
                              )}
                              {link.campaignInfo.discountText && (
                                <div className="text-xs font-bold text-slate-700 pl-3">
                                  {link.campaignInfo.discountText}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        {link.metrics ? (
                          <div className="flex items-center justify-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl py-2 px-4 w-max mx-auto">
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-slate-900">{link.metrics.clicks}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">Click</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-emerald-600">{link.metrics.leads}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">Lead</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-amber-500">{link.metrics.cr}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">CR</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">Chưa có data</span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-end gap-2 text-end">
                          <button
                            onClick={() => handleOpenModal(link)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(link._id)}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* --- MODAL FORM THÊM / SỬA LINK --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Header Modal */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{editingId ? 'Cập nhật' : 'Tạo mới'} <span className={adminAccentText}>Tracking Link</span></h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${activeProject === 'tieng-duc' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                      {activeProject === 'tieng-duc' ? 'DE' : 'CN'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{editingId ? 'Thiết lập lại các thông số tracking cho link này' : 'Tạo link gắn mã nguồn để theo dõi chuyển đổi'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all border border-slate-200 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body Form Cuộn (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <form id="link-form" onSubmit={handleSave} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="md:col-span-2 space-y-2">
                    <label className={adminLabel}>Tên nhận diện Link <span className="text-rose-500">*</span></label>
                    <input
                      required
                      className={`${adminInput} ${!formData.name?.trim() ? 'border-indigo-100 bg-indigo-50/30' : ''}`}
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ví dụ: Link chạy Ads Tiktok Tháng 5..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={adminLabel}>Mã Chiến dịch (Campaign Tag)</label>
                    <select
                      className={adminInput}
                      value={formData.tag || ''}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value || undefined })}
                    >
                      <option value="">-- Không đính kèm ưu đãi --</option>
                      {(metaOptions?.campaigns || []).map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className={adminLabel}>Mã Đối tác (Ref / KOC)</label>
                    <select
                      className={adminInput}
                      value={formData.ref || ''}
                      onChange={(e) => setFormData({ ...formData, ref: e.target.value || undefined })}
                    >
                      <option value="">-- Không tính hoa hồng KOC --</option>
                      {(metaOptions?.kocs || []).map((k) => (
                        <option key={k.value} value={k.value}>{k.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className={adminLabel}>UTM Source (Nguồn)</label>
                    <input
                      list="utm-sources-list"
                      className={adminInput}
                      value={formData.utm_source || ''}
                      onChange={(e) => setFormData({ ...formData, utm_source: e.target.value || undefined })}
                      placeholder="facebook, tiktok, zalo..."
                    />
                    <datalist id="utm-sources-list">
                      {(metaOptions?.utmSources || []).map((source) => (
                        <option key={source} value={source} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <label className={adminLabel}>UTM Medium (Phương thức)</label>
                    <input
                      list="utm-mediums-list"
                      className={adminInput}
                      value={formData.utm_medium || ''}
                      onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value || undefined })}
                      placeholder="ads, social, email, KOL..."
                    />
                    <datalist id="utm-mediums-list">
                      {(metaOptions?.utmMediums || []).map((medium) => (
                        <option key={medium} value={medium} />
                      ))}
                    </datalist>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className={adminLabel}>UTM Campaign (Tên gói Ads - Tuỳ chọn)</label>
                    <input
                      className={adminInput}
                      value={formData.utm_campaign || ''}
                      onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                      placeholder="Ví dụ: launch_q2_2026, retargeting_hsk3..."
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2 pt-2 border-t border-slate-100">
                    <label className={adminLabel}>Ghi chú nội bộ</label>
                    <textarea
                      className={`${adminInput} min-h-[96px] text-sm leading-relaxed`}
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Mục đích link, đối tượng hướng tới, người tạo, ngân sách..."
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Modal Cố Định */}
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0">
              <button type="button" onClick={() => setIsModalOpen(false)} className={adminSecondaryButton}>
                Hủy bỏ
              </button>
              <button type="submit" form="link-form" disabled={isLoading} className={`${adminPrimaryButton} px-8`}>
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (editingId ? 'Cập nhật thay đổi' : 'Tạo Link')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}