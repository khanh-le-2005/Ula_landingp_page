// export interface MarketingMetaOptions {
//   sites: { key: string; label: string }[];
//   campaigns: { value: string; label: string }[];
//   kocs: { value: string; label: string }[];
//   utmSources: string[];
//   utmMediums: string[];
// }

// export interface MarketingLink {
//   _id: string;
//   name: string;
//   siteKey: string;
//   tag?: string;
//   ref?: string;
//   utm_source?: string;
//   utm_medium?: string;
//   utm_campaign?: string;
//   isActive: boolean;
//   notes?: string;
//   fullUrl: string;
//   createdAt: string;
// }

// export type Campaign = {
//   _id: string;
//   tag: string;
//   name: string;
//   sections?: Record<string, any> | any[]; // Hỗ trợ cả Object và Array
//   prizes?: any[];
//   prizeTag?: string;
//   isActive: boolean;
//   siteKey?: string;
//   discountText?: string; // Trường mới
//   promoCode?: string;    // Trường mới
//   fullUrl?: string;     // URL hoàn chỉnh (trả về từ Backend)
//   createdAt?: string;
//   updatedAt?: string;
// };

// export type AdminUserInfo = {
//   id: string;
//   role: string;
// };

// export type AdminLoginResponse = {
//   accessToken: string;
//   refreshToken: string;
//   user_info: AdminUserInfo;
// };

// export type Affiliate = {
//   _id: string;
//   name: string;
//   code: string;
//   phone?: string;
//   email?: string;
//   source?: string;
//   status?: string;
//   createdAt?: string;
//   commissionRate?: number; // <--- Thêm cái này
//   notes?: string;
// };

// export type AffiliateStats = {
//   totalLeads: number;
//   totalSuspicious: number;
//   byAffiliate: {
//     _id: string | null;
//     total: number;
//     suspicious: number;
//     sources: string[];
//     lastLead: string;
//   }[];
// };

// export type LeadRecord = {
//   _id: string;
//   formData: Record<string, unknown>;
//   utm_source?: string;
//   utm_medium?: string;
//   utm_campaign?: string;
//   utm_content?: string;
//   referralId?: string;
//   referralCode?: string;         // Mã giới thiệu (vd: KOC_Yoncy)
//   campaignTag?: string;          // Mã chiến dịch (vd: dai_hoc_toan_bo)
//   status?: string;
//   click_timestamp?: string;       // Mới: Lúc khách nhấn link
//   conversion_timestamp?: string;  // Mới: Lúc khách gửi form
//   createdAt?: string;
//   updatedAt?: string;
//   prizeName?: string;
//   prizeCode?: string;
//   ip_address?: string;
//   user_agent?: string;
//   is_suspicious?: boolean;
// };

// const TOKEN_KEY = 'ula_admin_token';
// const USER_KEY = 'ula_admin_user';

// const getBaseUrl = () => {
//   const raw = import.meta.env.VITE_API_BASE_URL?.trim();
//   return raw ? raw.replace(/\/$/, '') : '';
// };

// const buildQuery = (params: Record<string, string | undefined>) => {
//   const searchParams = new URLSearchParams();

//   Object.entries(params).forEach(([key, value]) => {
//     if (value) {
//       searchParams.set(key, value);
//     }
//   });

//   const query = searchParams.toString();
//   return query ? `?${query}` : '';
// };

// const buildUrl = (path: string, params: Record<string, string | undefined> = {}) => {
//   const baseUrl = getBaseUrl();
//   return `${baseUrl}${path}${buildQuery(params)}`;
// };

// const requestJson = async <T>(path: string, init: RequestInit = {}, params: Record<string, string | undefined> = {}, token?: string) => {
//   const headers = new Headers(init.headers);

//   // Vô hiệu hóa Cache để luôn lấy dữ liệu CMS mới nhất
//   headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
//   headers.set('Pragma', 'no-cache');
//   headers.set('Expires', '0');

//   if (token) {
//     headers.set('Authorization', `Bearer ${token}`);
//   }

//   // Inject Site Context Header
//   const { site: finalSite } = getSiteContext(params.site || params.siteKey);
//   headers.set('X-Site-Key', finalSite);

//   const response = await fetch(buildUrl(path, params), {
//     ...init,
//     headers,
//     credentials: 'include',
//   });

//   const contentType = response.headers.get('content-type') || '';
//   const isJson = contentType.includes('application/json');
//   const payload = isJson ? await response.json() : await response.text();

//   if (!response.ok) {
//     const message =
//       typeof payload === 'object' && payload && 'message' in payload
//         ? String((payload as { message?: unknown }).message || 'Request failed')
//         : typeof payload === 'string' && payload.trim()
//           ? payload
//           : 'Request failed';

//     throw new Error(message);
//   }

//   return payload as T;
// };

// export const getStoredAdminToken = () => localStorage.getItem(TOKEN_KEY) || '';

// export const getStoredAdminUser = (): AdminUserInfo | null => {
//   const raw = localStorage.getItem(USER_KEY);

//   if (!raw) {
//     return null;
//   }

//   try {
//     return JSON.parse(raw) as AdminUserInfo;
//   } catch {
//     return null;
//   }
// };

// export const setStoredAdminSession = (token: string, user: AdminUserInfo) => {
//   localStorage.setItem(TOKEN_KEY, token);
//   localStorage.setItem(USER_KEY, JSON.stringify(user));
// };

// export const clearStoredAdminSession = () => {
//   localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(USER_KEY);
// };

// export const loginAdmin = async (username: string, password: string) => {
//   return requestJson<{ message: string; data: AdminLoginResponse }>(
//     '/api/auth/login',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, password }),
//     },
//   );
// };

// export const getSiteContext = (siteOverride?: string, variantOverride?: string) => {
//   if (typeof window === 'undefined') return { site: siteOverride || 'tieng-trung', variant: variantOverride || 'default', campaign: undefined };

//   const path = window.location.pathname;
//   const params = new URLSearchParams(window.location.search);

//   // 0. Ưu tiên site/variant từ tham số truyền vào trực tiếp
//   if (siteOverride) {
//     return {
//       site: siteOverride,
//       variant: variantOverride || 'default',
//       campaign: params.get('campaign') || undefined
//     };
//   }

//   // 1. Ưu tiên siteKey từ localStorage (do ProjectContext trong Admin quản lý)
//   const storedProject = localStorage.getItem('ula_admin_active_project');
//   const storedCampaign = localStorage.getItem('ula_admin_active_campaign'); // Mã Tag đang edit trong Admin

//   if (path.startsWith('/admin') && storedProject) {
//     return {
//       site: storedProject,
//       variant: params.get('variant') || 'default',
//       campaign: storedCampaign || undefined
//     };
//   }

//   // 2. Kiểm tra đường dẫn URL (vd: /chinese, /german) cho trang khách hàng
//   let site = 'tieng-trung';
//   if (path.includes('/chinese')) site = 'tieng-trung';
//   else if (path.includes('/german')) site = 'tieng-duc';
//   else site = params.get('site') || 'tieng-trung';

//   return {
//     site,
//     variant: params.get('variant') || 'default',
//     campaign: params.get('campaign') || undefined
//   };
// };

// export const fetchLandingPage = async (site?: string, variant?: string, campaign?: string) => {
//   export const fetchLandingPage = async (siteKey: string, variant?: string, campaignTag?: string) => {
//     const token = getStoredAdminToken();

//     // Nối chuỗi ?siteKey=... vào cuối URL để lấy đúng dữ liệu
//     let url = `/api/landing-page?siteKey=${siteKey}`;

//     if (variant) url += `&variant=${variant}`;
//     if (campaignTag) url += `&campaign=${campaignTag}`;

//     return requestJson<any>(url, { method: "GET" }, undefined, token);
//   };

//   export type SiteConfig = {
//     discountText: string;
//     sitePromoCode: string;
//   };

//   export const fetchSiteConfig = async (site?: string) => {
//     const { site: finalSite } = getSiteContext(site);
//     return requestJson<SiteConfig>('/api/landing-page/site-config', { method: 'GET' }, { siteKey: finalSite });
//   };

//   export const updateSiteConfig = async (data: SiteConfig, site?: string) => {
//     const token = getStoredAdminToken();
//     const { site: finalSite } = getSiteContext(site);
//     return requestJson<{ message: string; content: SiteConfig }>(
//       '/api/landing-page/site-config',
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       },
//       { siteKey: finalSite },
//       token
//     );
//   };

//   export const updateLandingSection = async <T,>(sectionKey: string, content: T, site?: string, variant?: string) => {
//     const token = getStoredAdminToken();
//     const { site: finalSite, variant: finalVariant, campaign: activeCampaignTag } = getSiteContext(site, variant);

//     // NẾU ĐANG Ở CHẾ ĐỘ EDIT CAMPAIGN TAG
//     if (activeCampaignTag) {
//       console.log(`[ADMIN] Đang lưu Overlay cho Campaign: ${activeCampaignTag} -> Section: ${sectionKey}`);

//       // 1. Lấy thông tin campaign hiện tại để biết ID
//       const campaigns = await fetchCampaigns(); // context site đã được requestJson tự chèn
//       const targetCampaign = campaigns.find(c => c.tag === activeCampaignTag);

//       if (!targetCampaign) {
//         throw new Error(`Không tìm thấy thông tin Campaign Tag: ${activeCampaignTag}`);
//       }

//       // 2. Chuẩn bị dữ liệu update (chỉ đè vào field sections)
//       // Lưu ý: Backend controller updateCampaign hiện tại nhận req.body và findOneAndUpdate
//       // Chúng ta sẽ gửi cấu trúc { sections: { [sectionKey]: content } }
//       let body: any;

//       if (content instanceof FormData) {
//         // FIX: Khi gửi FormData cho campaign, các key phải được prefix bằng sections[sectionKey]
//         // để Backend unflatten() vào đúng vị trí overlay.
//         const campaignFormData = new FormData();

//         // Duyệt qua các entries của content cũ và prefix lại
//         for (const [key, value] of (content as any).entries()) {
//           const prefixedKey = `sections[${sectionKey}][${key}]`;
//           campaignFormData.append(prefixedKey, value);
//         }

//         body = campaignFormData;
//       } else {
//         body = {
//           sections: {
//             ...(targetCampaign.sections || {}),
//             [sectionKey]: content
//           }
//         };
//       }

//       return updateCampaign(targetCampaign._id, body);
//     }

//     // CHẾ ĐỘ EDIT BẢN GỐC (NHƯ CŨ)
//     const path = `/api/landing-page/${sectionKey}`;
//     const params = { siteKey: finalSite, variant: finalVariant };

//     if (content instanceof FormData) {
//       const baseUrl = getBaseUrl();
//       const searchParams = new URLSearchParams();
//       searchParams.set('siteKey', finalSite);
//       searchParams.set('variant', finalVariant);

//       const url = `${baseUrl}${path}?${searchParams.toString()}`;

//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': token ? `Bearer ${token}` : '',
//           'X-Site-Key': finalSite
//         },
//         body: content,
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         const err = await response.json().catch(() => ({ message: 'Update failed' }));
//         throw new Error(err.message || 'Update failed');
//       }

//       return response.json() as Promise<{ message: string; data: T }>;
//     }

//     return requestJson<{ message: string; data: T }>(
//       path,
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(content),
//       },
//       params,
//       token,
//     );
//   };

//   export type LeadSubmissionPayload = {
//     formData: Record<string, unknown>;
//     utm_source?: string;
//     utm_medium?: string;
//     utm_campaign?: string;
//     utm_content?: string;
//     referralId?: string;
//     fbp?: string;
//     fbc?: string;
//   };

//   export type LeadSubmissionResponse = {
//     message: string;
//     data: {
//       _id: string;
//       formData: Record<string, unknown>;
//       utm_source?: string;
//       utm_medium?: string;
//       utm_campaign?: string;
//       utm_content?: string;
//       referralId?: string;
//       status?: string;
//       createdAt?: string;
//     };
//   };

//   export const submitLeadRegistration = async (payload: LeadSubmissionPayload) => {
//     const { site } = getSiteContext();
//     return requestJson<LeadSubmissionResponse>('/api/leads/submit', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Site-Key': site, // Quan trọng để Backend biết Lead thuộc trang nào
//       },
//       body: JSON.stringify(payload),
//     });
//   };

//   export const fetchLeads = async (siteOverride?: string, filters: { ref?: string; tag?: string; status?: string } = {}) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);

//     return requestJson<LeadRecord[]>(
//       '/api/leads',
//       {
//         method: 'GET',
//       },
//       {
//         siteKey: site,
//         ...filters
//       },
//       token,
//     );
//   };

//   export const updateLeadStatus = async (id: string, status: string) => {
//     const token = getStoredAdminToken();
//     return requestJson<{ message: string; data: LeadRecord }>(
//       `/api/leads/${id}/status`,
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status }),
//       },
//       {},
//       token
//     );
//   };

//   export const deleteLead = async (id: string) => {
//     const token = getStoredAdminToken();
//     return requestJson<{ message: string }>(
//       `/api/leads/${id}`,
//       {
//         method: 'DELETE',
//       },
//       {},
//       token
//     );
//   };

//   export const trackVisitor = async (queryString: string) => {
//     return fetch(buildUrl('/api/track' + queryString), {
//       method: 'GET',
//       credentials: 'include',
//     }).catch(err => console.error('Tracking failed:', err));
//   };

//   export const fetchAffiliates = async () => {
//     const token = getStoredAdminToken();
//     return requestJson<Affiliate[]>('/api/affiliates', { method: 'GET' }, {}, token);
//   };

//   export const createAffiliate = async (data: Partial<Affiliate>) => {
//     const token = getStoredAdminToken();
//     return requestJson<{ message: string; data: Affiliate }>(
//       '/api/affiliates',
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       },
//       {},
//       token
//     );
//   };

//   export const updateAffiliate = async (id: string, data: Partial<Affiliate>) => {
//     const token = getStoredAdminToken();
//     return requestJson<{ message: string; data: Affiliate }>(
//       `/api/affiliates/${id}`,
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       },
//       {},
//       token
//     );
//   };

//   export const deleteAffiliate = async (id: string) => {
//     const token = getStoredAdminToken();
//     return requestJson<{ message: string }>(
//       `/api/affiliates/${id}`,
//       { method: 'DELETE' },
//       {},
//       token
//     );
//   };

//   export const fetchAffiliateStats = async () => {
//     const token = getStoredAdminToken();
//     return requestJson<AffiliateStats>('/api/leads/stats', { method: 'GET' }, {}, token);
//   };

//   export type AffiliateLinksResponse = {
//     affiliateName: string;
//     referralCode: string;
//     links: { platform: string; url: string; }[];
//   };

//   export const fetchAffiliateLinks = async (id: string, site?: string) => {
//     const token = getStoredAdminToken();
//     return requestJson<AffiliateLinksResponse>(`/api/affiliates/${id}/links`, { method: 'GET' }, { siteKey: site }, token);
//   };

//   export const fetchCampaigns = async (siteOverride?: string) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);
//     return requestJson<Campaign[]>('/api/campaigns', { method: 'GET' }, { siteKey: site }, token);
//   };

//   export const createCampaign = async (data: Partial<Campaign> | FormData, siteOverride?: string) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);
//     const isFormData = data instanceof FormData;

//     return requestJson<{ message: string; data: Campaign }>(
//       '/api/campaigns',
//       {
//         method: 'POST',
//         headers: isFormData ? {} : { 'Content-Type': 'application/json' },
//         body: isFormData ? data : JSON.stringify(data),
//       },
//       { siteKey: site },
//       token
//     );
//   };

//   export const updateCampaign = async (id: string, data: Partial<Campaign> | FormData, siteOverride?: string) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);
//     const isFormData = data instanceof FormData;

//     return requestJson<{ message: string; data: Campaign }>(
//       `/api/campaigns/${id}`,
//       {
//         method: 'PUT',
//         headers: isFormData ? {} : { 'Content-Type': 'application/json' },
//         body: isFormData ? data : JSON.stringify(data),
//       },
//       { siteKey: site },
//       token
//     );
//   };

//   export const deleteCampaign = async (id: string, siteOverride?: string) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);
//     return requestJson<{ message: string }>(
//       `/api/campaigns/${id}`,
//       { method: 'DELETE' },
//       { siteKey: site },
//       token
//     );
//   };

//   // --- PRIZE MANAGEMENT (Lucky Wheel) ---
//   export type LuckyWheelPrize = {
//     _id?: string;
//     option: string;
//     backgroundColor: string;
//     textColor: string;
//     probability: number;
//     code: string;
//     isActive?: boolean;
//     order?: number;
//   };

//   export const fetchPrizes = async (siteOverride?: string) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);
//     return requestJson<LuckyWheelPrize[]>('/api/prizes', { method: 'GET' }, { siteKey: site }, token);
//   };

//   export const createPrize = async (data: Partial<LuckyWheelPrize>, siteOverride?: string) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);
//     return requestJson<{ message: string; data: LuckyWheelPrize }>(
//       '/api/prizes',
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...data, siteKey: site }),
//       },
//       { siteKey: site },
//       token
//     );
//   };

//   export const updatePrizeApi = async (id: string, data: Partial<LuckyWheelPrize>, siteOverride?: string) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);
//     return requestJson<{ message: string; data: LuckyWheelPrize }>(
//       `/api/prizes/${id}`,
//       {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       },
//       { siteKey: site },
//       token
//     );
//   };

//   export const deletePrizeApi = async (id: string, siteOverride?: string) => {
//     const token = getStoredAdminToken();
//     const { site } = getSiteContext(siteOverride);
//     return requestJson<{ message: string }>(
//       `/api/prizes/${id}`,
//       { method: 'DELETE' },
//       { siteKey: site },
//       token
//     );
//   };

//   // --- MARKETING LINKS ---
//   export const fetchMarketingMetaOptions = async (siteKey: string) => {
//     const token = getStoredAdminToken();
//     return requestJson<MarketingMetaOptions>(
//       `/api/marketing-links/meta-options`,
//       { method: "GET" },
//       { siteKey },
//       token
//     );
//   };

//   export const fetchMarketingLinks = async (siteKey: string) => {
//     const token = getStoredAdminToken();
//     return requestJson<MarketingLink[]>(
//       `/api/marketing-links`,
//       { method: "GET" },
//       { siteKey },
//       token
//     );
//   };

//   export const createMarketingLink = async (data: Partial<MarketingLink>) => {
//     const token = getStoredAdminToken();
//     return requestJson<{ message: string; data: MarketingLink }>(
//       "/api/marketing-links",
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//       },
//       { siteKey: data.siteKey },
//       token
//     );
//   };

//   export const updateMarketingLink = async (id: string, data: Partial<MarketingLink>) => {
//     const token = getStoredAdminToken();
//     return requestJson<{ message: string; data: MarketingLink }>(
//       `/api/marketing-links/${id}`,
//       {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//       },
//       { siteKey: data.siteKey },
//       token
//     );
//   };

//   export const deleteMarketingLink = async (id: string) => {
//     const token = getStoredAdminToken();
//     return requestJson<{ message: string }>(
//       `/api/marketing-links/${id}`,
//       { method: "DELETE" },
//       {},
//       token
//     );
//   };


// --- BỘ TYPE / INTERFACE ĐẦY ĐỦ ---

export interface MarketingMetaOptions {
  sites: { key: string; label: string }[];
  campaigns: { value: string; label: string }[];
  kocs: { value: string; label: string }[];
  utmSources: string[];
  utmMediums: string[];
}

export interface MarketingLink {
  _id: string;
  name: string;
  siteKey: string;
  tag?: string;
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  isActive: boolean;
  notes?: string;
  fullUrl: string;
  createdAt: string;
}

export type Campaign = {
  _id: string;
  tag: string;
  name: string;
  isActive: boolean;
  sections?: Record<string, any> | any[];
  prizes?: any[];
  prizeTag?: string;
  siteKey?: string;
  discountText?: string;
  promoCode?: string;
  fullUrl?: string;
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
  isActive?: boolean;
  source?: string;
  status?: string;
  createdAt?: string;
  commissionRate?: number;
  notes?: string;
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
  referralCode?: string;
  campaignTag?: string;
  status?: string;
  click_timestamp?: string;
  conversion_timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
  prizeName?: string;
  prizeCode?: string;
  ip_address?: string;
  user_agent?: string;
  is_suspicious?: boolean;
};

// --- CORE UTILS ---

const TOKEN_KEY = "ula_admin_token";
const USER_KEY = "ula_admin_user";

const getBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  return raw ? raw.replace(/\/$/, "") : "";
};

const buildQuery = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const buildUrl = (path: string, params: Record<string, string | undefined> = {}) => {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}${buildQuery(params)}`;
};

export const getSiteContext = (siteOverride?: string, variantOverride?: string) => {
  if (typeof window === "undefined")
    return {
      site: siteOverride || "tieng-duc",
      variant: variantOverride || "default",
      campaign: undefined,
    };

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  if (siteOverride) {
    return {
      site: siteOverride,
      variant: variantOverride || "default",
      campaign: params.get("campaign") || undefined,
    };
  }

  const storedProject = localStorage.getItem("ula_admin_active_project");
  const storedCampaign = localStorage.getItem("ula_admin_active_campaign");

  if (path.startsWith("/admin") && storedProject) {
    return {
      site: storedProject,
      variant: params.get("variant") || "default",
      campaign: storedCampaign || undefined,
    };
  }

  let site = "tieng-duc";
  if (path.includes("/chinese")) site = "tieng-trung";
  else if (path.includes("/german")) site = "tieng-duc";
  else site = params.get("site") || "tieng-duc";

  return {
    site,
    variant: params.get("variant") || "default",
    campaign: params.get("campaign") || undefined,
  };
};

const requestJson = async <T>(
  path: string,
  init: RequestInit = {},
  params: Record<string, string | undefined> = {},
  token?: string,
) => {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const { site: finalSite } = getSiteContext(params.site || params.siteKey);
  headers.set("X-Site-Key", finalSite);

  // Đảm bảo siteKey luôn được gắn vào tham số URL nếu chưa có
  const finalParams = { ...params };
  if (!finalParams.siteKey) {
    finalParams.siteKey = finalSite;
  }

  const response = await fetch(buildUrl(path, finalParams), {
    ...init,
    headers,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: unknown }).message || "Request failed")
        : typeof payload === "string" && payload.trim()
          ? payload
          : "Request failed";

    throw new Error(message);
  }

  return payload as T;
};

// --- AUTH ---

export const getStoredAdminToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const getStoredAdminUser = (): AdminUserInfo | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
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
    "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    },
  );
};

// --- LANDING PAGE ---

export const fetchLandingPage = async (siteKey?: string, variant?: string, campaignTag?: string) => {
  const token = getStoredAdminToken();
  const { site: finalSite, variant: finalVariant, campaign: finalCampaign } = getSiteContext(siteKey, variant);

  const params: Record<string, string | undefined> = {
    siteKey: finalSite,
    variant: finalVariant,
    campaign: campaignTag || finalCampaign,
  };

  return requestJson<any>("/api/landing-page", { method: "GET" }, params, token);
};

export type SiteConfig = {
  discountText: string;
  sitePromoCode: string;
};

export const fetchSiteConfig = async (siteKey?: string) => {
  const { site: finalSite } = getSiteContext(siteKey);
  return requestJson<SiteConfig>("/api/landing-page/site-config", { method: "GET" }, { siteKey: finalSite });
};

export const updateSiteConfig = async (data: SiteConfig, siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site: finalSite } = getSiteContext(siteKey);
  return requestJson<{ message: string; content: SiteConfig }>(
    "/api/landing-page/site-config",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    { siteKey: finalSite },
    token,
  );
};

export const updateLandingSection = async <T>(sectionKey: string, content: T, siteKey?: string, variant?: string) => {
  const token = getStoredAdminToken();
  const { site: finalSite, variant: finalVariant, campaign: activeCampaignTag } = getSiteContext(siteKey, variant);

  if (activeCampaignTag) {
    const campaigns = await fetchCampaigns(finalSite);
    const targetCampaign = campaigns.find((c) => c.tag === activeCampaignTag);

    if (!targetCampaign) {
      throw new Error(`Không tìm thấy thông tin Campaign Tag: ${activeCampaignTag}`);
    }

    let body: any;
    if (content instanceof FormData) {
      const campaignFormData = new FormData();
      for (const [key, value] of (content as any).entries()) {
        campaignFormData.append(`sections[${sectionKey}][${key}]`, value);
      }
      body = campaignFormData;
    } else {
      body = {
        sections: {
          ...(targetCampaign.sections || {}),
          [sectionKey]: content,
        },
      };
    }
    return updateCampaign(targetCampaign._id, body, finalSite);
  }

  const path = `/api/landing-page/${sectionKey}`;
  const params = { siteKey: finalSite, variant: finalVariant };

  if (content instanceof FormData) {
    const url = buildUrl(path, params);
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "X-Site-Key": finalSite,
      },
      body: content,
      credentials: "include",
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: "Update failed" }));
      throw new Error(err.message || "Update failed");
    }
    return response.json() as Promise<{ message: string; data: T }>;
  }

  return requestJson<{ message: string; data: T }>(
    path,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    },
    params,
    token,
  );
};

// --- LEADS ---

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
  data: LeadRecord;
};

export const submitLeadRegistration = async (payload: LeadSubmissionPayload) => {
  const { site } = getSiteContext();
  return requestJson<LeadSubmissionResponse>("/api/leads/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Site-Key": site,
    },
    body: JSON.stringify(payload),
  });
};

// export const fetchLeads = async (siteKey?: string, filters: { ref?: string; tag?: string; status?: string } = {}) => {
//   const token = getStoredAdminToken();
//   const { site } = getSiteContext(siteKey);
//   return requestJson<LeadRecord[]>("/api/leads", { method: "GET" }, { siteKey: site, ...filters }, token);
// };
export const fetchLeads = async (siteOverride?: string, filters: Record<string, string> = {}) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteOverride);

  return requestJson<LeadRecord[]>(
    "/api/leads",
    { method: "GET" },
    { siteKey: site, ...filters }, // Pass tất cả filter vào query params
    token,
  );
};


export const updateLeadStatus = async (id: string, status: string) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string; data: LeadRecord }>(
    `/api/leads/${id}/status`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    },
    {},
    token
  );
};

export const deleteLead = async (id: string) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string }>(`/api/leads/${id}`, { method: "DELETE" }, {}, token);
};

export const trackVisitor = async (queryString: string) => {
  return fetch(buildUrl("/api/track" + queryString), {
    method: "GET",
    credentials: "include",
  }).catch((err) => console.error("Tracking failed:", err));
};

// --- AFFILIATES (KOC) ---

export const fetchAffiliates = async (siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<Affiliate[]>("/api/affiliates", { method: "GET" }, { siteKey: site }, token);
};

export const createAffiliate = async (data: Partial<Affiliate>) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string; data: Affiliate }>(
    "/api/affiliates",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    { siteKey: data.siteKey },
    token,
  );
};

export const updateAffiliate = async (id: string, data: Partial<Affiliate>) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string; data: Affiliate }>(
    `/api/affiliates/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    { siteKey: data.siteKey },
    token,
  );
};

export const deleteAffiliate = async (id: string) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string }>(`/api/affiliates/${id}`, { method: "DELETE" }, {}, token);
};

export const fetchAffiliateStats = async (siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<AffiliateStats>("/api/affiliates/stats", { method: "GET" }, { siteKey: site }, token);
};

export type AffiliateLinksResponse = {
  affiliateName: string;
  referralCode: string;
  links: { platform: string; url: string }[];
};

export const fetchAffiliateLinks = async (id: string, siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<AffiliateLinksResponse>(`/api/affiliates/${id}/links`, { method: "GET" }, { siteKey: site }, token);
};

// --- CAMPAIGNS ---

export const fetchCampaigns = async (siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<Campaign[]>("/api/campaigns", { method: "GET" }, { siteKey: site }, token);
};

export const createCampaign = async (data: Partial<Campaign> | FormData, siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  const isFormData = data instanceof FormData;

  return requestJson<{ message: string; data: Campaign }>(
    "/api/campaigns",
    {
      method: "POST",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
    },
    { siteKey: site },
    token,
  );
};

export const updateCampaign = async (id: string, data: Partial<Campaign> | FormData, siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  const isFormData = data instanceof FormData;

  return requestJson<{ message: string; data: Campaign }>(
    `/api/campaigns/${id}`,
    {
      method: "PUT",
      headers: isFormData ? {} : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
    },
    { siteKey: site },
    token,
  );
};

export const deleteCampaign = async (id: string, siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<{ message: string }>(`/api/campaigns/${id}`, { method: "DELETE" }, { siteKey: site }, token);
};

// --- PRIZE MANAGEMENT (Lucky Wheel) ---

export const fetchPrizes = async (siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<LuckyWheelPrize[]>("/api/prizes", { method: "GET" }, { siteKey: site }, token);
};

export const createPrize = async (data: Partial<LuckyWheelPrize>, siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<{ message: string; data: LuckyWheelPrize }>(
    "/api/prizes",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, siteKey: site }),
    },
    { siteKey: site },
    token,
  );
};

export const updatePrizeApi = async (id: string, data: Partial<LuckyWheelPrize>, siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<{ message: string; data: LuckyWheelPrize }>(
    `/api/prizes/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    { siteKey: site },
    token,
  );
};

export const deletePrizeApi = async (id: string, siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<{ message: string }>(`/api/prizes/${id}`, { method: "DELETE" }, { siteKey: site }, token);
};

// --- MARKETING LINKS ---

export const fetchMarketingMetaOptions = async (siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<MarketingMetaOptions>(
    `/api/marketing-links/meta-options`,
    { method: "GET" },
    { siteKey: site },
    token
  );
};

export const fetchMarketingLinks = async (siteKey?: string) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);
  return requestJson<MarketingLink[]>(
    `/api/marketing-links`,
    { method: "GET" },
    { siteKey: site },
    token
  );
};

export const createMarketingLink = async (data: Partial<MarketingLink>) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(data.siteKey);
  return requestJson<{ message: string; data: MarketingLink }>(
    "/api/marketing-links",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data as any)
    },
    { siteKey: site },
    token
  );
};

export const updateMarketingLink = async (id: string, data: Partial<MarketingLink>) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(data.siteKey);
  return requestJson<{ message: string; data: MarketingLink }>(
    `/api/marketing-links/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data as any)
    },
    { siteKey: site },
    token
  );
};

export const deleteMarketingLink = async (id: string) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string }>(
    `/api/marketing-links/${id}`,
    { method: "DELETE" },
    {},
    token
  );
};