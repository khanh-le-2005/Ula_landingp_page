  // --- BÁO CÁO MARKETING (OVERVIEW) ---
export interface MarketingReportRow {
  source: string;
  medium: string;
  campaign: string;
  ref: string;
  clicks: number;
  leads: number;
  cr: string;
}

export interface MarketingReportResponse {
  summary: {
    totalVisits: number;
    totalLeads: number;
    totalCR: string;
  };
  data: MarketingReportRow[];
}

export const fetchMarketingReport = async (siteKey?: string, filters: Record<string, string> = {}) => {
  const token = getStoredAdminToken();
  const { site } = getSiteContext(siteKey);

  return requestJson<MarketingReportResponse>(
    "/api/leads/stats/marketing",
    { method: "GET" },
    { siteKey: site, ...filters },
    token
  );
};

// export const fetchMarketingMetaOptions = async (siteKey?: string) => {
//   const token = getStoredAdminToken();
//   const { site } = getSiteContext(siteKey);

//   return requestJson<MarketingMetaOptions>(
//     "/api/marketing-links/meta-options",
//     { method: "GET" },
//     { siteKey: site },
//     token
//   );
// };

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
  metrics?: {
    clicks: number;
    leads: number;
    cr: string;
  };
  campaignInfo?: {
    promoCode?: string;
    discountText?: string;
  };
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

// SỬA LỖI 1: Thêm siteKey vào Affiliate
export type Affiliate = {
  _id: string;
  siteKey?: string; // Đã thêm
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
  affiliateId?: string;
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
  fraud_reason?: string;
};

// SỬA LỖI 2: Bổ sung khai báo LuckyWheelPrize
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
// --- CORE UTILS ---

const TOKEN_KEY = "ula_admin_token";
const REFRESH_TOKEN_KEY = "ula_admin_refresh_token";
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

export const handleAdminLogout = () => {
  clearStoredAdminSession();
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
};

export const checkAdminAuth = () => {
  const token = getStoredAdminToken();
  if (!token) {
    handleAdminLogout();
    return false;
  }
  return true;
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

  if (response.status === 401) {
    const refreshToken = getStoredAdminRefreshToken();
    if (refreshToken && path !== "/api/auth/refresh-token") {
      try {
        const refreshResponse = await fetch(buildUrl("/api/auth/refresh-token"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshData.data || refreshData;
          
          const currentUser = getStoredAdminUser();
          if (currentUser) {
            setStoredAdminSession(newAccessToken, newRefreshToken, currentUser);
            
            // Retry the original request with new token
            const retryHeaders = new Headers(headers);
            retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);
            
            const retryResponse = await fetch(buildUrl(path, finalParams), {
              ...init,
              headers: retryHeaders,
              credentials: "include",
            });
            
            if (retryResponse.ok) {
              const contentType = retryResponse.headers.get("content-type") || "";
              return contentType.includes("application/json") ? await retryResponse.json() : await retryResponse.text();
            }
          }
        }
      } catch (err) {
        console.error("Refresh token failed:", err);
      }
    }
    
    handleAdminLogout();
    throw new Error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
  }

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

export const getStoredAdminRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY) || "";

export const getStoredAdminUser = (): AdminUserInfo | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUserInfo;
  } catch {
    return null;
  }
};

export const setStoredAdminSession = (token: string, refreshToken: string, user: AdminUserInfo) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAdminSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const loginAdmin = async (username: string, password: string) => {
  const response = await requestJson<{ message: string; data: AdminLoginResponse }>(
    "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    },
  );
  
  if (response.data && response.data.accessToken) {
    setStoredAdminSession(response.data.accessToken, response.data.refreshToken, response.data.user_info);
  }
  
  return response;
};

// --- LANDING PAGE ---

// Thêm cache để các component con không phải gọi lại API nếu đã gọi ở LandingPage (tránh giật lag, flicker)
const landingPageCache: Record<string, Promise<any>> = {};
const landingPageDataCache: Record<string, any> = {};

export const getCachedLandingPage = (siteKey?: string, variant?: string, campaignTag?: string) => {
  const { site: finalSite, variant: finalVariant, campaign: finalCampaign } = getSiteContext(siteKey, variant);
  const params: Record<string, string | undefined> = {
    siteKey: finalSite,
    variant: finalVariant,
    campaign: campaignTag || finalCampaign,
  };
  return landingPageDataCache[JSON.stringify(params)];
};

export const fetchLandingPage = async (siteKey?: string, variant?: string, campaignTag?: string) => {
  const token = getStoredAdminToken();
  const { site: finalSite, variant: finalVariant, campaign: finalCampaign } = getSiteContext(siteKey, variant);

  const params: Record<string, string | undefined> = {
    siteKey: finalSite,
    variant: finalVariant,
    campaign: campaignTag || finalCampaign,
  };

  const cacheKey = JSON.stringify(params);

  // Nếu đang gọi dở hoặc vừa gọi xong (trong vòng 2s), trả về luôn kết quả cũ
  if (landingPageCache[cacheKey]) {
    return landingPageCache[cacheKey];
  }

  const promise = requestJson<any>("/api/landing-page", { method: "GET" }, params, token)
    .then((data) => {
      // Lưu lại kết quả thực tế để dùng đồng bộ (synchronous)
      landingPageDataCache[cacheKey] = data;
      return data;
    })
    .finally(() => {
       // Xóa cache sau 2 giây để Admin luôn kéo được dữ liệu mới khi nhấn F5
       setTimeout(() => {
         delete landingPageCache[cacheKey];
         delete landingPageDataCache[cacheKey];
       }, 2000);
    });

  landingPageCache[cacheKey] = promise;
  return promise;
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
    // Bắt buộc lấy siteKey từ Form truyền lên (hoặc lấy từ context hiện tại)
    const site = payload.siteKey || getSiteContext().site;

    return requestJson<LeadSubmissionResponse>('/api/leads/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Site-Key': site, // <--- ÉP BACKEND LƯU ĐÚNG KHO
      },
      body: JSON.stringify(payload),
    }, { siteKey: site }); // <--- ÉP REQUESTJSON KHÔNG ĐƯỢC GHI ĐÈ
  };

  export const fetchLeads = async (siteKey?: string, filters: { ref?: string; tag?: string; status?: string } = {}) => {
    const token = getStoredAdminToken();
    const { site } = getSiteContext(siteKey);
    const response = await requestJson<any>("/api/leads", { method: "GET" }, { siteKey: site, ...filters }, token);
    return Array.isArray(response) ? response : (response.data || []);
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