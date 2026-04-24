export type Campaign = {
  _id: string;
  tag: string;
  name: string;
  sections?: Record<string, any>;
  prizes?: any[];
  prizeTag?: string;
  isActive: boolean;
  siteKey?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUserInfo = {
  id: string;
  role: string;
};

export type AdminLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user_info: AdminUserInfo;
};

export type Affiliate = {
  _id: string;
  name: string;
  code: string;
  phone?: string;
  email?: string;
  source?: string;
  status?: string;
  createdAt?: string;
};

export type AffiliateStats = {
  totalLeads: number;
  totalSuspicious: number;
  byAffiliate: {
    _id: string | null;
    total: number;
    suspicious: number;
    sources: string[];
    lastLead: string;
  }[];
};

export type LeadRecord = {
  _id: string;
  formData: Record<string, unknown>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referralId?: string;
  referralCode?: string;         // Mã giới thiệu (vd: KOC_Yoncy)
  campaignTag?: string;          // Mã chiến dịch (vd: dai_hoc_toan_bo)
  status?: string;
  click_timestamp?: string;       // Mới: Lúc khách nhấn link
  conversion_timestamp?: string;  // Mới: Lúc khách gửi form
  createdAt?: string;
  updatedAt?: string;
};

const TOKEN_KEY = 'ula_admin_token';
const USER_KEY = 'ula_admin_user';

const getBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  return raw ? raw.replace(/\/$/, '') : '';
};

const buildQuery = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const buildUrl = (path: string, params: Record<string, string | undefined> = {}) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}${buildQuery(params)}`;
};

const requestJson = async <T>(path: string, init: RequestInit = {}, params: Record<string, string | undefined> = {}, token?: string) => {
  const headers = new Headers(init.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Inject Site Context Header
  const { site: finalSite } = getSiteContext(params.site || params.siteKey);
  headers.set('X-Site-Key', finalSite);

  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message?: unknown }).message || 'Request failed')
        : typeof payload === 'string' && payload.trim()
          ? payload
          : 'Request failed';

    throw new Error(message);
  }

  return payload as T;
};

export const getStoredAdminToken = () => localStorage.getItem(TOKEN_KEY) || '';

export const getStoredAdminUser = (): AdminUserInfo | null => {
  const raw = localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AdminUserInfo;
  } catch {
    return null;
  }
};

export const setStoredAdminSession = (token: string, user: AdminUserInfo) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAdminSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const loginAdmin = async (username: string, password: string) => {
  return requestJson<{ message: string; data: AdminLoginResponse }>(
    '/api/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    },
  );
};

export const getSiteContext = (siteOverride?: string, variantOverride?: string) => {
  if (typeof window === 'undefined') return { site: siteOverride || 'tieng-trung', variant: variantOverride || 'default', campaign: undefined };

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  // 0. Ưu tiên site/variant từ tham số truyền vào trực tiếp
  if (siteOverride) {
    return {
      site: siteOverride,
      variant: variantOverride || 'default',
      campaign: params.get('campaign') || undefined
    };
  }

  // 1. Ưu tiên siteKey từ localStorage (do ProjectContext trong Admin quản lý)
  const storedProject = localStorage.getItem('ula_admin_active_project');
  const storedCampaign = localStorage.getItem('ula_admin_active_campaign'); // Mã Tag đang edit trong Admin

  if (path.startsWith('/admin') && storedProject) {
    return {
      site: storedProject,
      variant: params.get('variant') || 'default',
      campaign: storedCampaign || undefined
    };
  }

  // 2. Kiểm tra đường dẫn URL (vd: /chinese, /german) cho trang khách hàng
  let site = 'tieng-trung';
  if (path.includes('/chinese')) site = 'tieng-trung';
  else if (path.includes('/german')) site = 'tieng-duc';
  else site = params.get('site') || 'tieng-trung';

  return {
    site,
    variant: params.get('variant') || 'default',
    campaign: params.get('campaign') || undefined
  };
};

export const fetchLandingPage = async (site?: string, variant?: string, campaign?: string) => {
  const { site: finalSite, variant: finalVariant, campaign: finalCampaign } = getSiteContext(site, variant);

  const params: Record<string, string | undefined> = {
    siteKey: finalSite,
    variant: finalVariant,
    campaign: campaign || finalCampaign
  };

  return requestJson<Record<string, unknown>>('/api/landing-page', {}, params);
};

export const updateLandingSection = async <T,>(sectionKey: string, content: T, site?: string, variant?: string) => {
  const token = getStoredAdminToken();
  const { site: finalSite, variant: finalVariant, campaign: activeCampaignTag } = getSiteContext(site, variant);

  // NẾU ĐANG Ở CHẾ ĐỘ EDIT CAMPAIGN TAG
  if (activeCampaignTag) {
    console.log(`[ADMIN] Đang lưu Overlay cho Campaign: ${activeCampaignTag} -> Section: ${sectionKey}`);

    // 1. Lấy thông tin campaign hiện tại để biết ID
    const campaigns = await fetchCampaigns(); // context site đã được requestJson tự chèn
    const targetCampaign = campaigns.find(c => c.tag === activeCampaignTag);

    if (!targetCampaign) {
      throw new Error(`Không tìm thấy thông tin Campaign Tag: ${activeCampaignTag}`);
    }

    // 2. Chuẩn bị dữ liệu update (chỉ đè vào field sections)
    // Lưu ý: Backend controller updateCampaign hiện tại nhận req.body và findOneAndUpdate
    // Chúng ta sẽ gửi cấu trúc { sections: { [sectionKey]: content } }
    let body: any;

    if (content instanceof FormData) {
      // Hiện tại backend chưa hỗ trợ multer cho updateCampaign. 
      // Tạm thời nếu là FormData, chúng ta sẽ báo lỗi hoặc yêu cầu backend hỗ trợ.
      // Tuy nhiên để FE "hoàn thành" nhiệm vụ, ta sẽ cố gắng gửi.
      body = content;
      // Dán thêm thông tin section vào FormData
      body.append('sectionUpdateKey', sectionKey);
    } else {
      body = {
        sections: {
          ...(targetCampaign.sections || {}),
          [sectionKey]: content
        }
      };
    }

    return updateCampaign(targetCampaign._id, body);
  }

  // CHẾ ĐỘ EDIT BẢN GỐC (NHƯ CŨ)
  const path = `/api/landing-page/${sectionKey}`;
  const params = { siteKey: finalSite, variant: finalVariant };

  if (content instanceof FormData) {
    const baseUrl = getBaseUrl();
    const searchParams = new URLSearchParams();
    searchParams.set('siteKey', finalSite);
    searchParams.set('variant', finalVariant);

    const url = `${baseUrl}${path}?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'X-Site-Key': finalSite
      },
      body: content,
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Update failed' }));
      throw new Error(err.message || 'Update failed');
    }

    return response.json() as Promise<{ message: string; data: T }>;
  }

  return requestJson<{ message: string; data: T }>(
    path,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    },
    params,
    token,
  );
};

export type LeadSubmissionPayload = {
  formData: Record<string, unknown>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referralId?: string;
  fbp?: string;
  fbc?: string;
};

export type LeadSubmissionResponse = {
  message: string;
  data: {
    _id: string;
    formData: Record<string, unknown>;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    referralId?: string;
    status?: string;
    createdAt?: string;
  };
};

export const submitLeadRegistration = async (payload: LeadSubmissionPayload) => {
  const { site } = getSiteContext();
  return requestJson<LeadSubmissionResponse>('/api/leads/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Site-Key': site, // Quan trọng để Backend biết Lead thuộc trang nào
    },
    body: JSON.stringify(payload),
  });
};

export const fetchLeads = async (siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);

  return requestJson<LeadRecord[]>(
    '/api/leads',
    {
      method: 'GET',
    },
    { siteKey: site },
    token,
  );
};

export const trackVisitor = async (queryString: string) => {
  return fetch(buildUrl('/api/track' + queryString), {
    method: 'GET',
    credentials: 'include',
  }).catch(err => console.error('Tracking failed:', err));
};

export const fetchAffiliates = async () => {
  const token = getStoredAdminToken();
  return requestJson<Affiliate[]>('/api/affiliates', { method: 'GET' }, {}, token);
};

export const createAffiliate = async (data: Partial<Affiliate>) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string; data: Affiliate }>(
    '/api/affiliates',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    {},
    token
  );
};

export const updateAffiliate = async (id: string, data: Partial<Affiliate>) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string; data: Affiliate }>(
    `/api/affiliates/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    {},
    token
  );
};

export const deleteAffiliate = async (id: string) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string }>(
    `/api/affiliates/${id}`,
    { method: 'DELETE' },
    {},
    token
  );
};

export const fetchAffiliateStats = async () => {
  const token = getStoredAdminToken();
  return requestJson<AffiliateStats>('/api/leads/stats', { method: 'GET' }, {}, token);
};

export type AffiliateLinksResponse = {
  affiliateName: string;
  referralCode: string;
  links: { platform: string; url: string; }[];
};

export const fetchAffiliateLinks = async (id: string, site?: string) => {
  const token = getStoredAdminToken();
  return requestJson<AffiliateLinksResponse>(`/api/affiliates/${id}/links`, { method: 'GET' }, { siteKey: site }, token);
};

export const fetchCampaigns = async (siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);
  return requestJson<Campaign[]>('/api/campaigns', { method: 'GET' }, { siteKey: site }, token);
};

export const createCampaign = async (data: Partial<Campaign>, siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);
  return requestJson<{ message: string; data: Campaign }>(
    '/api/campaigns',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    { siteKey: site },
    token
  );
};

export const updateCampaign = async (id: string, data: Partial<Campaign>, siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);
  return requestJson<{ message: string; data: Campaign }>(
    `/api/campaigns/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    { siteKey: site },
    token
  );
};

export const deleteCampaign = async (id: string, siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);
  return requestJson<{ message: string }>(
    `/api/campaigns/${id}`,
    { method: 'DELETE' },
    { siteKey: site },
    token
  );
};

// --- PRIZE MANAGEMENT (Lucky Wheel) ---
export type LuckyWheelPrize = {
  _id?: string;
  option: string;
  backgroundColor: string;
  textColor: string;
  probability: number;
  code: string;
  isActive?: boolean;
  order?: number;
};

export const fetchPrizes = async (siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);
  return requestJson<LuckyWheelPrize[]>('/api/prizes', { method: 'GET' }, { siteKey: site }, token);
};

export const createPrize = async (data: Partial<LuckyWheelPrize>, siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);
  return requestJson<{ message: string; data: LuckyWheelPrize }>(
    '/api/prizes',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, siteKey: site }),
    },
    { siteKey: site },
    token
  );
};

export const updatePrizeApi = async (id: string, data: Partial<LuckyWheelPrize>, siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);
  return requestJson<{ message: string; data: LuckyWheelPrize }>(
    `/api/prizes/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    { siteKey: site },
    token
  );
};

export const deletePrizeApi = async (id: string, siteOverride?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);
  return requestJson<{ message: string }>(
    `/api/prizes/${id}`,
    { method: 'DELETE' },
    { siteKey: site },
    token
  );
};
