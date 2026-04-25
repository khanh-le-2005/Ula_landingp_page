import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchLandingPage, updateLandingSection, getSiteContext } from '../adminApi';
import { ADMIN_SECTION_KEYS } from '../adminSections';
import { PAINPOINTS_DEFAULT_COUNT, type PainpointsContent } from '../adminData';
import { useSiteContext } from '@/src/ula-chinese/context/LandingSiteContext';
import { useLocation } from 'react-router-dom';

const LANDING_PAGE_SYNC_CHANNEL = 'ula-landing-page-sync';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const tryConvertToArray = (value: unknown): any => {
  if (Array.isArray(value)) return value;
  if (!isPlainObject(value)) return value;

  const keys = Object.keys(value);
  if (keys.length === 0) return [];

  // Kiểm tra nếu tất cả các phím đều là số (hoặc chuỗi số)
  const isNumericKeys = keys.every(key => /^\d+$/.test(key));
  if (isNumericKeys) {
    const arr: any[] = [];
    keys.forEach(k => {
      arr[parseInt(k, 10)] = value[k];
    });
    // Loại bỏ các phần tử empty nếu có (hole)
    return arr.filter(() => true);
  }

  return value;
};

const mergeWithFallback = <T,>(fallback: T, remote: unknown): T => {
  if (Array.isArray(fallback)) {
    if (!Array.isArray(remote)) return fallback as T;

    // Nếu fallback có phần tử mẫu, ta dùng nó để merge từng phần tử của remote
    if (fallback.length > 0) {
      const template = fallback[0];
      return remote.map((item) => mergeWithFallback(template, item)) as unknown as T;
    }

    return remote as unknown as T;
  }

  if (!isPlainObject(fallback)) {
    return (remote === undefined ? fallback : remote) as T;
  }

  if (!isPlainObject(remote)) {
    return fallback;
  }

  const merged: Record<string, unknown> = { ...fallback };

  Object.keys(remote).forEach((key) => {
    const fallbackValue = merged[key];
    const remoteValue = remote[key];

    if (Array.isArray(fallbackValue) || Array.isArray(remoteValue)) {
      // FIX: Nếu remote trả về mảng rỗng nhưng fallback có dữ liệu, giữ lại fallback
      if (Array.isArray(remoteValue) && remoteValue.length === 0 && Array.isArray(fallbackValue) && fallbackValue.length > 0) {
        merged[key] = fallbackValue;
      } else {
        merged[key] = Array.isArray(remoteValue) ? remoteValue : fallbackValue;
      }
      return;
    }

    if (isPlainObject(fallbackValue) && isPlainObject(remoteValue)) {
      merged[key] = mergeWithFallback(fallbackValue, remoteValue);
      return;
    }

    // --- FIX: Normalize boolean strings from FormData ---
    if (typeof fallbackValue === 'boolean') {
      if (remoteValue === 'true') {
        merged[key] = true;
        return;
      }
      if (remoteValue === 'false') {
        merged[key] = false;
        return;
      }
    }

    merged[key] = remoteValue;
  });

  return merged as T;
};

const normalizePainpointsSection = (remote: unknown, fallback: PainpointsContent): PainpointsContent => {
  if (Array.isArray(remote)) {
    const values = remote
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'text' in item) {
          return String((item as { text?: unknown }).text ?? '');
        }
        return '';
      })
      .filter(Boolean);

    return {
      ...fallback,
      bubbles: values.length > 0 ? values.slice(0, PAINPOINTS_DEFAULT_COUNT) : fallback.bubbles,
    };
  }

  if (!isPlainObject(remote)) {
    return fallback;
  }

  const bubbles = Array.isArray(remote.bubbles)
    ? remote.bubbles
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'text' in item) {
          return String((item as { text?: unknown }).text ?? '');
        }
        return '';
      })
      .filter(Boolean)
      .slice(0, PAINPOINTS_DEFAULT_COUNT)
    : fallback.bubbles;

  return {
    sectionTitle: typeof remote.sectionTitle === 'string' ? remote.sectionTitle : fallback.sectionTitle,
    mascotImageUrl: typeof remote.mascotImageUrl === 'string' ? remote.mascotImageUrl : fallback.mascotImageUrl,
    bubbles: bubbles.length > 0 ? bubbles : fallback.bubbles,
  };
};

export function useLandingSection<T>(sectionKey: string, fallback: T) {
  const { siteKey, campaignTag } = useSiteContext();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  const [content, setContent] = useState<T>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const broadcastSectionUpdate = useCallback((updatedSectionKey: string) => {
    const message = JSON.stringify({
      type: 'landing-section-updated',
      sectionKey: updatedSectionKey,
      at: Date.now(),
    });

    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(LANDING_PAGE_SYNC_CHANNEL);
      channel.postMessage(message);
      channel.close();
      return;
    }

    try {
      localStorage.setItem(LANDING_PAGE_SYNC_CHANNEL, message);
      localStorage.removeItem(LANDING_PAGE_SYNC_CHANNEL);
    } catch {
      // Ignore sync failures; fetch-on-mount still works.
    }
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const landingPage = await fetchLandingPage(siteKey, undefined, isAdmin ? undefined : campaignTag);
      const section = landingPage[sectionKey];
      if (sectionKey === ADMIN_SECTION_KEYS.painpoints && !Array.isArray(fallbackRef.current)) {
        setContent(normalizePainpointsSection(section, fallbackRef.current as PainpointsContent) as T);
        return;
      }

      setContent(mergeWithFallback(fallbackRef.current, section));
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Không thể tải dữ liệu section';
      setError(message);
      setContent(fallbackRef.current);
    } finally {
      setIsLoading(false);
    }
  }, [sectionKey, siteKey, isAdmin, campaignTag]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleUpdate = (incomingSectionKey: string) => {
      if (incomingSectionKey === sectionKey) {
        void load();
      }
    };

    const onBroadcastMessage = (event: MessageEvent) => {
      try {
        const payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (payload?.type === 'landing-section-updated' && typeof payload.sectionKey === 'string') {
          handleUpdate(payload.sectionKey);
        }
      } catch {
        // Ignore malformed sync messages.
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== LANDING_PAGE_SYNC_CHANNEL || !event.newValue) {
        return;
      }

      try {
        const payload = JSON.parse(event.newValue);
        if (payload?.type === 'landing-section-updated' && typeof payload.sectionKey === 'string') {
          handleUpdate(payload.sectionKey);
        }
      } catch {
        // Ignore malformed sync messages.
      }
    };

    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      channel = new BroadcastChannel(LANDING_PAGE_SYNC_CHANNEL);
      channel.addEventListener('message', onBroadcastMessage);
    }

    window.addEventListener('storage', onStorage);

    return () => {
      channel?.removeEventListener('message', onBroadcastMessage);
      channel?.close();
      window.removeEventListener('storage', onStorage);
    };
  }, [load, sectionKey]);

  const save = async (nextContent?: T | FormData) => {
    const value = nextContent ?? content;
    setIsSaving(true);
    setError(null);

    try {
      const response = await updateLandingSection(sectionKey, value, siteKey);
      const normalizedData = mergeWithFallback(fallbackRef.current, response.data);
      setContent(normalizedData);
      setLastSavedAt(new Date().toISOString());
      broadcastSectionUpdate(sectionKey);
      return normalizedData;
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : 'Không thể lưu nội dung';
      setError(message);
      throw saveError;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    content,
    setContent,
    isLoading,
    isSaving,
    error,
    lastSavedAt,
    reload: load,
    save,
  };
}
