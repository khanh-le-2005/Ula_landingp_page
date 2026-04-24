import { useEffect } from 'react';

// Hàm lấy cookie (dành cho fbp, fbc của Facebook)
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

export const useTracking = (siteKey: string) => {
  useEffect(() => {
    // 1. Chỉ chạy khi đang ở trình duyệt (Client-side)
    if (typeof window === 'undefined') return;

    // 2. Lấy các tham số từ thanh URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    const campaign = urlParams.get('campaign') || urlParams.get('tag') || urlParams.get('campaignTag');
    
    const utm_source = urlParams.get('utm_source');
    const utm_medium = urlParams.get('utm_medium');
    const utm_campaign = urlParams.get('utm_campaign');
    const utm_content = urlParams.get('utm_content');

    // 3. Lấy Facebook Cookies
    const fbc = getCookie('_fbc');
    const fbp = getCookie('_fbp');

    // 4. Kiểm tra xem có dữ liệu tracking nào không
    if (!ref && !campaign && !utm_source && !fbc && !fbp) {
      return; 
    }

    // Lấy API Base URL từ biến môi trường
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    
    // Xây dựng URL với siteKey để Backend nhận diện đúng module
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('siteKey', siteKey);
    
    const trackUrl = `${baseUrl}/api/track?${searchParams.toString()}`;

    // Gọi API Tracking (GET) kèm theo toàn bộ params
    fetch(trackUrl, {
      method: 'GET',
      credentials: 'include',
    })
    .then(res => res.json())
    .then(data => console.log('[TRACK] Success:', data))
    .catch(err => console.error('[TRACK] Error:', err));

  }, [siteKey]);
};
