export type AdminUserInfo = {
  id: string;
  role: string;
};

export type AdminLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user_info: AdminUserInfo;
};

export type LeadRecord = {
  _id: string;
  formData: Record<string, unknown>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  referralId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
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

const getSiteContext = (siteOverride?: string, variantOverride?: string) => {
  if (typeof window === 'undefined') return { site: siteOverride || 'tieng-duc', variant: variantOverride || 'default' };
  
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  
  // 0. Ưu tiên site/variant từ tham số truyền vào trực tiếp
  if (siteOverride) {
    return { site: siteOverride, variant: variantOverride || 'default' };
  }

  // 1. Kiểm tra đường dẫn URL (vd: /china, /german) cho trang khách hàng
  if (path.includes('/china')) return { site: 'tieng-trung', variant: params.get('variant') || 'default' };
  if (path.includes('/german')) return { site: 'tieng-duc', variant: params.get('variant') || 'default' };
  
  // 2. Fallback về query params hoặc mặc định cho folder này là tieng-duc
  const querySite = params.get('site');
  const queryVariant = params.get('variant');
  
  return {
    site: querySite || 'tieng-duc',
    variant: queryVariant || 'default'
  };
};

export const fetchLandingPage = async (site?: string, variant?: string) => {
  const { site: finalSite, variant: finalVariant } = getSiteContext(site, variant);
  return requestJson<Record<string, unknown>>('/api/landing-page', {}, { site: finalSite, variant: finalVariant });
};

export const updateLandingSection = async <T,>(sectionKey: string, content: T, site?: string, variant?: string) => {
  const token = getStoredAdminToken();
  const { site: finalSite, variant: finalVariant } = getSiteContext(site, variant);
  const path = `/api/landing-page/${sectionKey}`;
  const params = { site: finalSite, variant: finalVariant };

  if (content instanceof FormData) {
    const baseUrl = getBaseUrl();
    const searchParams = new URLSearchParams();
    searchParams.set('site', site);
    searchParams.set('variant', variant);
    
    const url = `${baseUrl}${path}?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
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
  return requestJson<LeadSubmissionResponse>('/api/leads/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
};

export const fetchLeads = async () => {
  const token = getStoredAdminToken();

  return requestJson<LeadRecord[]>(
    '/api/leads',
    {
      method: 'GET',
    },
    {},
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
    token,
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
    token,
  );
};

export const deleteAffiliate = async (id: string) => {
  const token = getStoredAdminToken();
  return requestJson<{ message: string }>(`/api/affiliates/${id}`, { method: 'DELETE' }, {}, token);
};

export const fetchAffiliateStats = async (from?: string, to?: string) => {
  const token = getStoredAdminToken();
  return requestJson<AffiliateStats>('/api/leads/stats', { method: 'GET' }, { from, to }, token);
};
