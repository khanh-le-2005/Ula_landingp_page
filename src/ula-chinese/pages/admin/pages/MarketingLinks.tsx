import React, { useEffect, useMemo, useState } from 'react';
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
import { toast } from 'react-toastify';

export default function MarketingLinks() {
  const { activeProject } = useProject();
  const [links, setLinks] = useState<MarketingLink[]>([]);
  const [metaOptions, setMetaOptions] = useState<MarketingMetaOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<MarketingLink>>({
    name: '',
    tag: '',
    ref: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    notes: '',
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [linksData, metaData] = await Promise.all([
        fetchMarketingLinks(activeProject).catch(() => []),
        fetchMarketingMetaOptions(activeProject),
      ]);
      setLinks(Array.isArray(linksData) ? linksData : []);
      setMetaOptions(metaData);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải dữ liệu Links');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [activeProject]);

  const filteredLinks = useMemo(() => {
    if (!Array.isArray(links)) return [];
    return links.filter((l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.fullUrl && l.fullUrl.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [links, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Đã copy đường dẫn!');
  };

  const handleOpenModal = (link?: MarketingLink) => {
    if (link) {
      setEditingId(link._id);
      setFormData({
        name: link.name,
        tag: link.tag,
        ref: link.ref,
        utm_source: link.utm_source,
        utm_medium: link.utm_medium,
        utm_campaign: link.utm_campaign,
        notes: link.notes,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        tag: '',
        ref: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        notes: '',
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
        toast.success('Đã cập nhật link tracking!');
      } else {
        await createMarketingLink(payload);
        toast.success('Đã tạo link tracking mới!');
      }

      setIsModalOpen(false);
      await loadData();
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
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className={adminCard}>
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
              <Globe className="w-3 h-3" />
              Công cụ Marketing
            </div>
            <h2 className="text-3xl font-black text-black tracking-tight">
              UTM Link <span className={adminAccentText}>Builder</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Tìm kiếm link..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${adminInput} !pl-11 !py-2.5 max-w-[240px] text-xs`}
              />
            </div>
            <button type="button" onClick={() => handleOpenModal()} className={adminPrimaryButton}>
              <Plus className="h-4 w-4" />
              Tạo Link Mới
            </button>
          </div>
        </div>



        <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-[0.25em] text-slate-400">
                  <th className="px-6 py-5">Tên Link / Ghi chú</th>
                  <th className="px-6 py-5">Thông số Tracking</th>
                  <th className="px-6 py-5">Link & Chiến dịch</th>
                  <th className="px-6 py-5 text-center">Hiệu suất</th>
                  <th className="px-6 py-5 text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && links.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={5}>
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="h-6 w-6 text-indigo-500 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Đang tải danh sách...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLinks.length === 0 ? (
                  <tr>
                    <td className="px-6 py-12 text-center" colSpan={5}>
                      <div className="flex flex-col items-center gap-4 text-slate-400 font-bold italic">
                        <LinkIcon className="h-10 w-10 opacity-20" />
                        <span>Chưa có Tracking Link nào được tạo.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map((link) => (
                    <tr key={link._id} className="group hover:bg-slate-50 transition-all border-b border-slate-100 last:border-0">
                      <td className="px-6 py-6 max-w-[250px]">
                        <div className="space-y-1.5">
                          <div className="font-black text-slate-900 text-base tracking-tight">{link.name}</div>
                          {link.notes && (
                            <div className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">{link.notes}</div>
                          )}
                          <div className="text-[9px] font-mono text-slate-400 mt-2">
                            {new Date(link.createdAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 max-w-[300px]">
                        <div className="flex flex-wrap gap-2">
                          {link.tag && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                              <Tag className="w-3 h-3" /> Campaign: {link.tag}
                            </span>
                          )}
                          {link.ref && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                              <Users className="w-3 h-3" /> Ref: {link.ref}
                            </span>
                          )}
                          {link.utm_source && (
                            <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-[10px] font-mono text-slate-600">
                              src: {link.utm_source}
                            </span>
                          )}
                          {link.utm_medium && (
                            <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-[10px] font-mono text-slate-600">
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
                              <span className="text-[10px] font-medium text-slate-500 truncate" title={link.fullUrl}>
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
                            <div className="flex flex-col gap-1 mt-1">
                              {link.campaignInfo.promoCode && (
                                <div className="text-[10px] font-black uppercase tracking-widest text-rose-500">
                                  Mã: {link.campaignInfo.promoCode}
                                </div>
                              )}
                              {link.campaignInfo.discountText && (
                                <div className="text-xs font-bold text-slate-700">
                                  {link.campaignInfo.discountText}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        {link.metrics ? (
                          <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-slate-900">{link.metrics.clicks}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Click</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-emerald-600">{link.metrics.leads}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Lead</span>
                            </div>
                            <div className="w-px h-6 bg-slate-200"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-black text-amber-500">{link.metrics.cr}</span>
                              <span className="text-[9px] uppercase tracking-widest font-bold text-slate-400">CR</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic font-medium">Chưa có data</span>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex justify-end gap-2 text-end">
                          <button
                            onClick={() => handleOpenModal(link)}
                            className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(link._id)}
                            className="h-9 w-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">{editingId ? 'Chỉnh sửa' : 'Tạo'} <span className={adminAccentText}>Tracking Link</span></h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{editingId ? 'Cập nhật lại các thông số tracking' : 'Thiết lập tag/ref/utm cho chiến dịch'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-rose-500 transition-all border border-slate-200 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <label className={adminLabel}>Tên Link</label>
                  <input
                    required
                    className={adminInput}
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Meta Ads - Đức - Kỳ 1"
                  />
                </div>

                <div className="space-y-2">
                  <label className={adminLabel}>Campaign Tag</label>
                  <select
                    className={adminInput}
                    value={formData.tag || ''}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value || undefined })}
                  >
                    <option value="">Chọn tag</option>
                    {(metaOptions?.campaigns || []).map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={adminLabel}>UTM Source</label>
                  <input
                    list="utm-sources-list"
                    className={adminInput}
                    value={formData.utm_source || ''}
                    onChange={(e) => setFormData({ ...formData, utm_source: e.target.value || undefined })}
                    placeholder="VD: facebook, tiktok, zalo..."
                  />
                  <datalist id="utm-sources-list">
                    {(metaOptions?.utmSources || []).map((source) => (
                      <option key={source} value={source} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <label className={adminLabel}>UTM Source</label>
                  <input
                    list="utm-sources-list"
                    className={adminInput}
                    value={formData.utm_source || ''}
                    onChange={(e) => setFormData({ ...formData, utm_source: e.target.value || undefined })}
                    placeholder="VD: facebook, tiktok, zalo..."
                  />
                  <datalist id="utm-sources-list">
                    {(metaOptions?.utmSources || []).map((source) => (
                      <option key={source} value={source} />
                    ))}
                  </datalist>
                </div>

                <div className="space-y-2">
                  <label className={adminLabel}>UTM Medium</label>
                  <input
                    list="utm-mediums-list"
                    className={adminInput}
                    value={formData.utm_medium || ''}
                    onChange={(e) => setFormData({ ...formData, utm_medium: e.target.value || undefined })}
                    placeholder="VD: ads, social, email..."
                  />
                  <datalist id="utm-mediums-list">
                    {(metaOptions?.utmMediums || []).map((medium) => (
                      <option key={medium} value={medium} />
                    ))}
                  </datalist>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className={adminLabel}>UTM Campaign (tuỳ chọn)</label>
                  <input
                    className={adminInput}
                    value={formData.utm_campaign || ''}
                    onChange={(e) => setFormData({ ...formData, utm_campaign: e.target.value })}
                    placeholder="Ví dụ: launch_q2_2026"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className={adminLabel}>Ghi chú nội bộ</label>
                  <textarea
                    className={`${adminInput} min-h-[96px]`}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Mục đích link, kênh chạy, người phụ trách..."
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className={adminSecondaryButton}>
                  Hủy
                </button>
                <button type="submit" disabled={isLoading} className={adminPrimaryButton}>
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (editingId ? 'Cập nhật link' : 'Tạo link')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

