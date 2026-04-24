export type TrackingData = {
  referralId?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  campaignTag?: string; // Mới: Nhãn chiến dịch
  created_at?: string;  // Mới: Thời điểm click (dùng cho click_timestamp)
  fbp?: string;
  fbc?: string;
};

const TRACKING_COOKIE_PREFIX = 'ula_';
const TRACKING_COOKIE_MAX_AGE = 60 * 24 * 60 * 60;

const TRACKING_KEYS: (keyof Omit<TrackingData, 'fbp' | 'fbc'>)[] = [
  'referralId',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'campaignTag',
  'created_at'
];

const getTrackingCookieName = (key: string) => `${TRACKING_COOKIE_PREFIX}${key}`;

const isBrowser = () => typeof document !== 'undefined' && typeof window !== 'undefined';

const readQueryValue = (name: string) => {
  if (!isBrowser()) {
    return '';
  }

  return new URLSearchParams(window.location.search).get(name) || '';
};

const setCookie = (name: string, value: string) => {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${TRACKING_COOKIE_MAX_AGE}; samesite=lax`;
};

const getCookie = (name: string) => {
  if (!isBrowser()) {
    return '';
  }

  const cookieMatch = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookieMatch) {
    return '';
  }

  return decodeURIComponent(cookieMatch.slice(name.length + 1));
};

export const readTrackingFromUrl = (): Omit<TrackingData, 'fbp' | 'fbc'> => ({
  referralId: readQueryValue('ref') || undefined,
  utm_source: readQueryValue('utm_source') || undefined,
  utm_medium: readQueryValue('utm_medium') || undefined,
  utm_campaign: readQueryValue('utm_campaign') || undefined,
  utm_content: readQueryValue('utm_content') || undefined,
  campaignTag: readQueryValue('campaignTag') || undefined,
});

export const persistTrackingData = (trackingData: Partial<TrackingData>) => {
  TRACKING_KEYS.forEach((key) => {
    const value = trackingData[key];
    if (value) {
      setCookie(getTrackingCookieName(key), value);
    }
  });
};

export const readTrackingDataFromCookies = (): Omit<TrackingData, 'fbp' | 'fbc'> => {
  return TRACKING_KEYS.reduce<Omit<TrackingData, 'fbp' | 'fbc'>>((accumulator, key) => {
    const value = getCookie(getTrackingCookieName(key));
    if (value) {
      accumulator[key] = value;
    }
    return accumulator;
  }, {});
};

export const resolveTrackingData = (): TrackingData => {
  const fromCookies = readTrackingDataFromCookies();
  const fromUrl = readTrackingFromUrl();
  const merged: TrackingData = { ...fromCookies, ...fromUrl };

  // Nếu khách chưa có thời điểm click, tạo mới ngay bây giờ
  if (!merged.created_at) {
    merged.created_at = new Date().toISOString();
  }

  // FB Click IDs / Browser IDs
  const fbp = getCookie('_fbp') || readQueryValue('fbp');
  const fbc = getCookie('_fbc') || readQueryValue('fbc');

  if (fbp) merged.fbp = fbp;
  if (fbc) merged.fbc = fbc;

  persistTrackingData(merged);

  return merged;
};
