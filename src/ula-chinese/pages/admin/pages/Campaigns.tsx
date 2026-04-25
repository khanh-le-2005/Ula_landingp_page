import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; 
import {
  Plus,
  Hash,
  RefreshCw,
  CheckCircle2,
  Pencil,
  Trash2,
  Search as SearchIcon,
  Target,
  AlertCircle,
  Link,
  Check,
  ChevronLeft,
  Copy,
  Save,
  Zap,
  LayoutGrid,
  Box,
  Sparkles,
  Gift,
  Globe
} from 'lucide-react';
import { fetchCampaigns, createCampaign, updateCampaign, deleteCampaign, fetchLandingPage, fetchPrizes, type Campaign, type LuckyWheelPrize } from '../adminApi';
import { adminCard, adminInput, adminLabel, adminPrimaryButton, adminSecondaryButton, adminAccentText } from '../adminTheme';
import { useSiteContext, type SiteKey } from '../../../context/LandingSiteContext';
import ImageUploadField from '../components/ImageUploadField';
import { flattenToFormData } from '../utils/formDataUtil';

export default function Campaigns() {
  const { siteKey } = useSiteContext();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const isGerman = siteKey === 'tieng-duc';
  const siteName = isGerman ? 'Đức (DE)' : 'Trung (CN)';

  const [isEditing, setIsEditing] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    tag: '',
    name: '',
    isActive: true,
    discountText: '',
    promoCode: '',
    siteKey: siteKey
  });

  const [hero, setHero] = useState<any>({
    badge: '', headlineTop: '', headlineHighlight: '', headlineBottom: '', description: '', heroImageUrl: ''
  });

  const [painpoints, setPainpoints] = useState<any>({
    sectionTitle: '', sectionSubtitle: '', mainTitleTop: '', mainTitleHighlight: '', mascotImageUrl: '', bubbles: []
  });

  const [solution, setSolution] = useState<any>({
    titlePart1: '', titleHighlight: '', titlePart2: '', cards: []
  });

  const [methodology, setMethodology] = useState<any>({
    mainCard: { number: '', title: '', subTitle: '', imgSrc: '' }, cards: []
  });

  const [luckyWheel, setLuckyWheel] = useState<any>({
    headline: '', subHeadline: '', description: '', timerLabel: '', prizes: []
  });

  const [lastSavedUrl, setLastSavedUrl] = useState<string | null>(null);

  const loadCampaigns = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchCampaigns(siteKey);
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải danh sách chiến dịch');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCampaigns();
  }, [siteKey]);

  const getSectionContent = (sectionsData: any, primaryKey: string, fallbackKey: string) => {
    if (Array.isArray(sectionsData)) {
      const found = sectionsData.find(s => s.sectionKey === primaryKey || s.sectionKey === fallbackKey);
      return found ? found.content : {};
    }
    return sectionsData[primaryKey] || sectionsData[fallbackKey] || {};
  };

  const handleOpenEditor = async (campaign?: Campaign) => {
    setLastSavedUrl(null);
    setError('');
    setIsLoading(true);

    try {
      let currentSections: any = [];
      let currentPrizes: LuckyWheelPrize[] = [];

      if (campaign) {
        setEditingCampaign(campaign);
        setFormData({
          tag: campaign.tag || '',
          name: campaign.name || '',
          isActive: campaign.isActive !== false,
          discountText: campaign.discountText || '',
          promoCode: campaign.promoCode || '',
          siteKey: (campaign.siteKey || siteKey) as SiteKey
        });
        currentSections = campaign.sections || [];
        currentPrizes = campaign.prizes || [];
      } else {
        const baseData = await fetchLandingPage(siteKey);
        const basePrizes = await fetchPrizes(siteKey);
        setEditingCampaign(null);
        setFormData({ tag: '', name: '', isActive: true, discountText: '', promoCode: '', siteKey: siteKey });
        currentSections = baseData;
        currentPrizes = basePrizes;
      }

      const h = getSectionContent(currentSections, 'hero', 'section_1_hero');
      setHero({
        badge: h.badge || '',
        headlineTop: h.headlineTop || '',
        headlineHighlight: h.headlineHighlight || '',
        headlineBottom: h.headlineBottom || '',
        description: h.description || '',
        heroImageUrl: h.heroImageUrl || ''
      });

      const p = getSectionContent(currentSections, 'section_2_painpoints', 'painpoints');
      setPainpoints({
        sectionTitle: p.sectionTitle || '',
        sectionSubtitle: p.sectionSubtitle || '',
        mainTitleTop: p.mainTitleTop || '',
        mainTitleHighlight: p.mainTitleHighlight || '',
        mascotImageUrl: p.mascotImageUrl || '',
        bubbles: (Array.isArray(p.bubbles) ? p.bubbles : []).slice(0, 7)
      });

      const sol = getSectionContent(currentSections, 'section_3_solution', 'solution');
      const solArray = Array.isArray(sol) ? sol : (Array.isArray(sol.cards) ? sol.cards : []);
      setSolution({
        titlePart1: sol.titlePart1 || '', titleHighlight: sol.titleHighlight || '', titlePart2: sol.titlePart2 || '',
        cards: solArray.slice(0, 3).map((c: any) => ({
          category: c.category || '',
          title: c.title || '',
          bullets: Array.isArray(c.bullets) ? c.bullets : (Array.isArray(c.points) ? c.points : []),
          mediaUrl: c.mediaUrl || '',
          isVideo: !!c.isVideo,
          gradient: c.gradient || ''
        }))
      });

      const meth = getSectionContent(currentSections, 'section_4_methodology', 'methodology');
      setMethodology({
        mainCard: {
          number: meth.mainCard?.number || '',
          title: meth.mainCard?.title || '',
          subTitle: meth.mainCard?.subTitle || '',
          imgSrc: meth.mainCard?.imgSrc || ''
        },
        cards: (Array.isArray(meth.cards) ? meth.cards : []).slice(0, 4).map((c: any) => ({
          number: c.number || '',
          title: c.title || '',
          subTitle: c.subTitle || '',
          imgSrc: c.imgSrc || ''
        }))
      });

      const lw = getSectionContent(currentSections, 'luckyspin', 'section_5_lucky_wheel');
      setLuckyWheel({
        headline: lw.headline || '',
        subHeadline: lw.subHeadline || '',
        description: lw.description || '',
        timerLabel: lw.timerLabel || '',
        prizes: currentPrizes.length > 0 ? currentPrizes : (lw.prizes || [])
      });

      setIsEditing(true);
    } catch (err) {
      setError('Lỗi khi tải dữ liệu soạn thảo.');
    } finally {
      setIsLoading(false);
    }
  };

  const addPrize = () => {
    setLuckyWheel((prev: any) => ({
      ...prev,
      prizes: [...prev.prizes, { 
        option: 'Phần thưởng mới', 
        backgroundColor: '#2563eb', // Default blue
        textColor: '#ffffff',       // Default white
        code: 'NEW-CODE', 
        probability: 1 
      }]
    }));
  };

  const removePrize = (index: number) => {
    setLuckyWheel((prev: any) => ({
      ...prev,
      prizes: prev.prizes.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tag.trim() || !formData.name.trim()) {
      setError('Vui lòng nhập đầy đủ Mã Tag và Tên chiến dịch.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const cleanSolutionCards = (Array.isArray(solution.cards) ? solution.cards : []).map(card => {
        const newCard = { ...card };
        const isNewFile = newCard.mediaUrl instanceof File;
        const isOldValidUrl = typeof newCard.mediaUrl === 'string' &&
          newCard.mediaUrl.trim() !== '' &&
          newCard.mediaUrl !== 'null' &&
          !newCard.mediaUrl.includes('[object Object]');

        if (!isNewFile && !isOldValidUrl) {
          delete newCard.mediaUrl;
        }
        return newCard;
      });

      const sectionsObject = {
        hero: hero,
        painpoints: painpoints,
        solution: cleanSolutionCards, 
        methodology: methodology,
        luckyspin: luckyWheel
      };

      const finalData = {
        ...formData,
        sections: sectionsObject,
        prizes: luckyWheel.prizes
      };

      const formDataPayload = flattenToFormData(finalData);

      let response;
      if (editingCampaign) {
        response = await updateCampaign(editingCampaign._id, formDataPayload);
      } else {
        response = await createCampaign(formDataPayload);
      }

      setLastSavedUrl(response.data?.fullUrl || null);
      if (editingCampaign) setEditingCampaign(response.data);

      toast.success(editingCampaign ? 'Cập nhật chiến dịch thành công' : 'Tạo chiến dịch mới thành công');
      await loadCampaigns();

      setIsEditing(false); 

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi lưu chiến dịch');
      toast.error('Lỗi khi lưu chiến dịch');
    } finally {
      setIsSaving(false);
    }
  };  

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chiến dịch này?')) return;
    try {
      await deleteCampaign(id);
      toast.success('Đã xóa chiến dịch');
      await loadCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi xóa chiến dịch');
    }
  };

  const toggleStatus = async (campaign: Campaign) => {
    try {
      await updateCampaign(campaign._id, { isActive: !campaign.isActive });
      toast.success('Cập nhật trạng thái thành công');
      await loadCampaigns();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Lỗi khi cập nhật trạng thái');
    }
  };

  const filteredCampaigns = (Array.isArray(campaigns) ? campaigns : []).filter(c =>
    (c.tag || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const handleCopyLink = (url: string, id: string) => {
    const fixedUrl = url.replace('/china', '/chinese');
    navigator.clipboard.writeText(fixedUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Đã copy link!');
  };

  // --- RENDERING LIST MODE ---
  if (!isEditing) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <section className={adminCard}>
          <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-2">
                <Target className="w-3 h-3 text-rose-500" />
                Campaign Overlays ({siteName})
              </div>
              <h2 className="text-3xl font-black text-black tracking-tight">Quản lý <span className={adminAccentText}>Chiến dịch & Tag</span></h2>
              <p className="mt-2 text-slate-500 text-sm font-medium">Tạo link Landing Page riêng biệt cho quảng cáo, KOLs hoặc sự kiện.</p>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => void loadCampaigns()} className={adminSecondaryButton}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
              <button onClick={() => handleOpenEditor()} className={adminPrimaryButton + " shadow-lg shadow-rose-500/20"}>
                <Plus className="h-4 w-4" />
                Tạo Tag chiến dịch
              </button>
            </div>
          </div>

          <div className="mb-8 relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã tag hoặc tên chiến dịch..."
              className={`${adminInput} pl-12 h-12 shadow-sm border-slate-200 focus:border-rose-500 focus:ring-rose-500/20`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
            <div className="overflow-x-auto no-scrollbar">
              <table className="min-w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black tracking-[0.25em] text-slate-400">
                    <th className="px-8 py-5">Tag / Chiến dịch</th>
                    <th className="px-8 py-5 text-center">Trạng thái</th>
                    <th className="px-8 py-5">Ngày tạo</th>
                    <th className="px-8 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <RefreshCw className="h-8 w-8 text-rose-500/20 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : filteredCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="text-sm font-bold text-slate-400">Chưa có chiến dịch nào được tạo cho {siteName}</div>
                      </td>
                    </tr>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <tr key={campaign._id} className="group hover:bg-slate-50/80 transition-all duration-300">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Hash className="h-3 w-3 text-rose-500" />
                              <span className="font-black text-rose-600 font-mono tracking-wider text-base">{campaign.tag}</span>
                            </div>
                            <div className="text-xs font-bold text-slate-900 mt-1">{campaign.name}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => toggleStatus(campaign)}
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${campaign.isActive
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                              }`}
                          >
                            {campaign.isActive ? 'Đang chạy' : 'Đã tắt'}
                          </button>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-xs font-bold text-slate-400">
                            {new Date(campaign.createdAt || '').toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleCopyLink(campaign.fullUrl || '', campaign._id)}
                              className={`h-9 w-9 flex items-center justify-center rounded-xl border transition-all ${copiedId === campaign._id
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                  : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-100 hover:text-slate-900 shadow-sm'
                                }`}
                              title="Sao chép link chiến dịch"
                            >
                              {copiedId === campaign._id ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
                            </button>
                            <button onClick={() => handleOpenEditor(campaign)} className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => handleDelete(campaign._id)} className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 className="h-4 w-4" /></button>
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
      </div>
    );
  }

  // --- RENDERING EDITOR MODE ---
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-slate-500 hover:text-black transition-colors font-bold text-sm">
          <ChevronLeft className="w-4 h-4" />
          Hủy bỏ & Quay lại
        </button>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${formData.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
            {formData.isActive ? 'Trạng thái: Hoạt động' : 'Trạng thái: Đã tắt'}
          </div>
          {editingCampaign && (
            <button
              onClick={() => handleDelete(editingCampaign._id)}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all font-bold text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Xóa chiến dịch
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`${adminPrimaryButton} py-2 px-8 shadow-xl shadow-rose-500/20`}
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu chiến dịch
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 pb-20">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <section className={adminCard}>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-500 mb-6">
              <Zap className="w-3 h-3 text-amber-500" />
              Cấu hình Tag ({siteName})
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className={adminLabel}>Site Key (Mặc định)</div>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    readOnly
                    className={`${adminInput} pl-12 bg-slate-50 text-slate-500 cursor-not-allowed`}
                    value={formData.siteKey}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className={adminLabel}>Mã định danh (Tag Code)</div>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    required
                    className={`${adminInput} pl-12 font-mono text-rose-600 font-bold`}
                    placeholder="uu_dai_moi..."
                    value={formData.tag}
                    onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className={adminLabel}>Tên chiến dịch</div>
                <input
                  required
                  className={adminInput}
                  placeholder="Mega Sale tháng 5..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <div className={adminLabel}>Text Ưu đãi (Nổi bật góc trên)</div>
                <input
                  className={adminInput}
                  placeholder="Ưu đãi Khóa học 5.0 Giảm 80%..."
                  value={formData.discountText}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountText: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <div className={adminLabel}>Mã giảm giá (Promo Code)</div>
                <input
                  className={`${adminInput} font-mono font-bold text-amber-600 uppercase`}
                  placeholder="DUC-ULA-80"
                  value={formData.promoCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, promoCode: e.target.value.replace(/\s+/g, '') }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Kích hoạt</div>
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                  className={`relative flex h-6 w-12 items-center rounded-full transition-all ${formData.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                >
                  <div className={`h-4 w-4 rounded-full bg-white shadow-xl transition-all ${formData.isActive ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-sm font-bold text-rose-700">{error}</div>
            </div>
          )}

        </div>

        {/* MAIN EDITOR: 5 BLOCKS */}
        <div className="lg:col-span-3 space-y-10 pb-40">

          {/* Ô 1: HERO */}
          <section className={adminCard}>
            <div className="mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-2">
                <Sparkles className="h-3 w-3 text-indigo-500" />
                Ô 1: Hero Section
              </div>
              <h2 className="text-xl font-black text-slate-900">Trang đầu quảng bá</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className={adminLabel}>Nhãn nổi bật (Badge)</div>
                <input className={adminInput} value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} />
              </div>
              <div className="space-y-3">
                <div className={adminLabel}>Tiêu đề chính</div>
                <div className="grid md:grid-cols-3 gap-4">
                  <input className={adminInput} value={hero.headlineTop} onChange={(e) => setHero({ ...hero, headlineTop: e.target.value })} placeholder="Phần đầu" />
                  <input className={`${adminInput} !border-indigo-100 !bg-indigo-50/50`} value={hero.headlineHighlight} onChange={(e) => setHero({ ...hero, headlineHighlight: e.target.value })} placeholder="Phần nổi bật" />
                  <input className={adminInput} value={hero.headlineBottom} onChange={(e) => setHero({ ...hero, headlineBottom: e.target.value })} placeholder="Phần kết" />
                </div>
              </div>
              <div className="space-y-2">
                <div className={adminLabel}>Mô tả chính</div>
                <textarea className={`${adminInput} min-h-[100px] text-sm`} value={hero.description} onChange={(e) => setHero({ ...hero, description: e.target.value })} />
              </div>
              <ImageUploadField
                label="Ảnh Hero"
                value={hero.heroImageUrl}
                onChange={(val) => setHero({ ...hero, heroImageUrl: val })}
              />
            </div>
          </section>

          {/* Ô 2: NỖI ĐAU (Painpoints) */}
          <section className={adminCard}>
            <div className="mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-2">
                <AlertCircle className="h-3 w-3 text-rose-500" />
                Ô 2: Nỗi đau & Vấn đề
              </div>
              <h2 className="text-xl font-black text-slate-900">Xác định vấn đề</h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className={adminLabel}>Tiêu đề phần</div>
                  <textarea
                    className={`${adminInput} min-h-[80px] py-3`}
                    value={painpoints.sectionTitle}
                    onChange={(e) => setPainpoints((prev: any) => ({ ...prev, sectionTitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className={adminLabel}>Tiêu đề phụ (Subtitle)</div>
                  <textarea
                    className={`${adminInput} min-h-[80px] py-3`}
                    value={painpoints.sectionSubtitle}
                    onChange={(e) => setPainpoints((prev: any) => ({ ...prev, sectionSubtitle: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className={adminLabel}>Tiêu đề chính (Phần đầu)</div>
                  <input className={adminInput} value={painpoints.mainTitleTop} onChange={(e) => setPainpoints({ ...painpoints, mainTitleTop: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <div className={adminLabel}>Tiêu đề chính (Nổi bật)</div>
                  <input className={adminInput} value={painpoints.mainTitleHighlight} onChange={(e) => setPainpoints({ ...painpoints, mainTitleHighlight: e.target.value })} />
                </div>
              </div>

              <ImageUploadField
                label="Ảnh Mascot (Linh vật)"
                value={painpoints.mascotImageUrl}
                onChange={(val) => setPainpoints({ ...painpoints, mascotImageUrl: val })}
              />
              <div className="space-y-4">
                <div className={adminLabel}>Nội dung 7 bong bóng (Bubbles)</div>
                <div className="grid gap-3 md:grid-cols-2">
                  {painpoints.bubbles.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-6 w-6 shrink-0 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-rose-500">#{idx + 1}</div>
                      <input
                        className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 w-full"
                        value={typeof item === 'object' ? item.text : item}
                        onChange={(e) => {
                          const newBubbles = [...painpoints.bubbles];
                          if (typeof newBubbles[idx] === 'object') newBubbles[idx] = { ...newBubbles[idx], text: e.target.value };
                          else newBubbles[idx] = e.target.value;
                          setPainpoints((p: any) => ({ ...p, bubbles: newBubbles }));
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Ô 3: GIẢI PHÁP (Solution) */}
          <section className={adminCard}>
            <div className="mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-2">
                <LayoutGrid className="h-3 w-3 text-emerald-500" />
                Ô 3: Giải pháp tối ưu
              </div>
              <h2 className="text-xl font-black text-slate-900">Tính năng & Thẻ giải pháp</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className={adminLabel}>Tiêu đề phần (Headline)</div>
                <div className="grid md:grid-cols-3 gap-4">
                  <input className={adminInput} value={solution.titlePart1} onChange={(e) => setSolution({ ...solution, titlePart1: e.target.value })} placeholder="Phần 1" />
                  <input className={`${adminInput} !border-emerald-100 !bg-emerald-50/50`} value={solution.titleHighlight} onChange={(e) => setSolution({ ...solution, titleHighlight: e.target.value })} placeholder="Phần nổi bật" />
                  <input className={adminInput} value={solution.titlePart2} onChange={(e) => setSolution({ ...solution, titlePart2: e.target.value })} placeholder="Phần 2" />
                </div>
              </div>
            </div>

            <div className="space-y-8 mt-8">
              {solution.cards.map((card: any, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 tracking-widest">
                    Thẻ {idx + 1}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className={adminLabel}>Nhãn danh mục</div>
                      <input className={adminInput} value={card.category} onChange={(e) => {
                        const newCards = [...solution.cards];
                        newCards[idx].category = e.target.value;
                        setSolution({ ...solution, cards: newCards });
                      }} />
                    </div>
                    <div className="space-y-2">
                      <div className={adminLabel}>Tiêu đề thẻ</div>
                      <input className={adminInput} value={card.title} onChange={(e) => {
                        const newCards = [...solution.cards];
                        newCards[idx].title = e.target.value;
                        setSolution({ ...solution, cards: newCards });
                      }} />
                    </div>
                  </div>
                  <ImageUploadField
                    label="Ảnh/Video Thẻ"
                    value={card.mediaUrl}
                    onChange={(val) => {
                      const newCards = [...solution.cards];
                      newCards[idx].mediaUrl = val;
                      setSolution({ ...solution, cards: newCards });
                    }}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className={adminLabel}>Màu nền (Gradient CSS)</div>
                      <input className={adminInput} value={card.gradient} onChange={(e) => {
                        const newCards = [...solution.cards];
                        newCards[idx].gradient = e.target.value;
                        setSolution({ ...solution, cards: newCards });
                      }} placeholder="from-indigo-600/40 to-blue-500/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className={adminLabel}>Các điểm chính (Bullet points)</div>
                    <div className="space-y-2">
                      {card.bullets.map((bullet: string, bIdx: number) => (
                        <input key={bIdx} className={`${adminInput} !py-2 !text-xs`} value={bullet} onChange={(e) => {
                          const newCards = [...solution.cards];
                          newCards[idx].bullets[bIdx] = e.target.value;
                          setSolution({ ...solution, cards: newCards });
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ô 4: PHƯƠNG PHÁP (Methodology) */}
          <section className={adminCard}>
            <div className="mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-2">
                <Box className="h-3 w-3 text-indigo-500" />
                Ô 4: Phương pháp đào tạo
              </div>
              <h2 className="text-xl font-black text-slate-900">Quy trình & Kiến trúc</h2>
            </div>

            <div className="space-y-8">
              {/* Main Card */}
              <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-4">
                <div className={adminLabel}>Thẻ Trưng bày chính</div>
                <div className="grid md:grid-cols-3 gap-4">
                  <input className={adminInput} value={methodology.mainCard.number} onChange={(e) => setMethodology((prev: any) => ({ ...prev, mainCard: { ...prev.mainCard, number: e.target.value } }))} placeholder="ID/STT" />
                  <input className={adminInput} value={methodology.mainCard.title} onChange={(e) => setMethodology((prev: any) => ({ ...prev, mainCard: { ...prev.mainCard, title: e.target.value } }))} placeholder="Tiêu đề chính" />
                  <input className={adminInput} value={methodology.mainCard.subTitle} onChange={(e) => setMethodology((prev: any) => ({ ...prev, mainCard: { ...prev.mainCard, subTitle: e.target.value } }))} placeholder="Tiêu đề phụ" />
                </div>
                <ImageUploadField
                  label="Ảnh thẻ chính"
                  value={methodology.mainCard.imgSrc}
                  onChange={(val) => setMethodology((prev: any) => ({ ...prev, mainCard: { ...prev.mainCard, imgSrc: val } }))}
                />
              </div>

              {/* Cards 1-4 */}
              <div className="grid gap-4 md:grid-cols-2">
                {methodology.cards.map((card: any, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400">Card {idx + 1}</div>
                    <input className={`${adminInput} !py-2 !text-xs`} value={card.number} onChange={(e) => {
                      const newCards = [...methodology.cards];
                      newCards[idx].number = e.target.value;
                      setMethodology({ ...methodology, cards: newCards });
                    }} placeholder="ID / Số thứ tự" />
                    <input className={`${adminInput} !py-2 !text-xs`} value={card.title} onChange={(e) => {
                      const newCards = [...methodology.cards];
                      newCards[idx].title = e.target.value;
                      setMethodology({ ...methodology, cards: newCards });
                    }} placeholder="Tiêu đề chính" />
                    <input className={`${adminInput} !py-2 !text-xs`} value={card.subTitle} onChange={(e) => {
                      const newCards = [...methodology.cards];
                      newCards[idx].subTitle = e.target.value;
                      setMethodology({ ...methodology, cards: newCards });
                    }} placeholder="Tiêu đề phụ" />
                    <ImageUploadField
                      label={`Ảnh Card ${idx + 1}`}
                      value={card.imgSrc}
                      onChange={(val) => {
                        const newCards = [...methodology.cards];
                        newCards[idx].imgSrc = val;
                        setMethodology({ ...methodology, cards: newCards });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Ô 5: LUCKY SPIN */}
          <section className={adminCard}>
            <div className="mb-8 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-black text-slate-400 mb-2">
                <Gift className="h-3 w-3 text-amber-500" />
                Ô 5: Lucky Spin (Vòng quay)
              </div>
              <h2 className="text-xl font-black text-slate-900">Game hóa & Quà tặng</h2>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className={adminLabel}>Tiêu đề mục</div>
                  <input className={adminInput} value={luckyWheel.headline} onChange={(e) => setLuckyWheel((p: any) => ({ ...p, headline: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <div className={adminLabel}>Tiêu đề phụ</div>
                  <input className={adminInput} value={luckyWheel.subHeadline} onChange={(e) => setLuckyWheel((p: any) => ({ ...p, subHeadline: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <div className={adminLabel}>Nhãn đếm ngược (Timer)</div>
                  <input className={adminInput} value={luckyWheel.timerLabel} onChange={(e) => setLuckyWheel((p: any) => ({ ...p, timerLabel: e.target.value }))} placeholder="Ưu đãi kết thúc sau..." />
                </div>
              </div>
              <div className="space-y-2">
                <div className={adminLabel}>Mô tả game hóa</div>
                <textarea className={`${adminInput} min-h-[80px] text-sm`} value={luckyWheel.description} onChange={(e) => setLuckyWheel((p: any) => ({ ...p, description: e.target.value }))} />
              </div>

              <div className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={adminLabel}>Danh mục phần thưởng (Prizes)</div>
                  <button
                    type="button"
                    onClick={addPrize}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100 hover:bg-indigo-100 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm phần thưởng
                  </button>
                </div>
                <div className="grid gap-4 mt-4">
                  {luckyWheel.prizes.map((prize: any, idx: number) => (
                    <div key={idx} className="group relative p-5 rounded-[24px] bg-slate-50/50 border border-slate-200 hover:bg-slate-50 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Gift className="w-3 h-3 text-amber-500" />
                          Ô quà #{idx + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => removePrize(idx)}
                          className="h-7 w-7 flex items-center justify-center rounded-lg bg-rose-50 text-rose-500 border border-rose-100 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {/* CẬP NHẬT: Thêm form chọn 2 màu cho Vòng Quay */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="space-y-1 lg:col-span-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Tên phần quà</div>
                          <input
                            className={`${adminInput} !py-2 !text-xs`}
                            value={prize.option}
                            onChange={(e) => {
                              const newPrizes = [...luckyWheel.prizes];
                              newPrizes[idx].option = e.target.value;
                              setLuckyWheel({ ...luckyWheel, prizes: newPrizes });
                            }}
                          />
                        </div>
                        <div className="space-y-1 lg:col-span-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Mã trúng thưởng</div>
                          <input
                            className={`${adminInput} !py-2 !text-xs !font-mono`}
                            value={prize.code || ''}
                            onChange={(e) => {
                              const newPrizes = [...luckyWheel.prizes];
                              newPrizes[idx].code = e.target.value;
                              setLuckyWheel({ ...luckyWheel, prizes: newPrizes });
                            }}
                          />
                        </div>
                        <div className="space-y-1 lg:col-span-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Tỉ lệ (%)</div>
                          <input
                            className={`${adminInput} !py-2 !text-xs !font-mono`}
                            type="number"
                            value={prize.probability || 0}
                            onChange={(e) => {
                              const newPrizes = [...luckyWheel.prizes];
                              newPrizes[idx].probability = Number(e.target.value);
                              setLuckyWheel({ ...luckyWheel, prizes: newPrizes });
                            }}
                          />
                        </div>
                        
                        <div className="space-y-1 lg:col-span-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Màu Nền</div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              className="h-8 w-10 p-0 border-0 rounded cursor-pointer"
                              value={prize.backgroundColor || '#2563eb'}
                              onChange={(e) => {
                                const newPrizes = [...luckyWheel.prizes];
                                newPrizes[idx].backgroundColor = e.target.value;
                                setLuckyWheel({ ...luckyWheel, prizes: newPrizes });
                              }}
                            />
                            <input
                              className={`${adminInput} !py-2 !text-xs !font-mono`}
                              value={prize.backgroundColor || '#2563eb'}
                              onChange={(e) => {
                                const newPrizes = [...luckyWheel.prizes];
                                newPrizes[idx].backgroundColor = e.target.value;
                                setLuckyWheel({ ...luckyWheel, prizes: newPrizes });
                              }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1 lg:col-span-1">
                          <div className="text-[9px] font-black text-slate-400 uppercase">Màu Chữ</div>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              className="h-8 w-10 p-0 border-0 rounded cursor-pointer"
                              value={prize.textColor || '#ffffff'}
                              onChange={(e) => {
                                const newPrizes = [...luckyWheel.prizes];
                                newPrizes[idx].textColor = e.target.value;
                                setLuckyWheel({ ...luckyWheel, prizes: newPrizes });
                              }}
                            />
                            <input
                              className={`${adminInput} !py-2 !text-xs !font-mono`}
                              value={prize.textColor || '#ffffff'}
                              onChange={(e) => {
                                const newPrizes = [...luckyWheel.prizes];
                                newPrizes[idx].textColor = e.target.value;
                                setLuckyWheel({ ...luckyWheel, prizes: newPrizes });
                              }}
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}