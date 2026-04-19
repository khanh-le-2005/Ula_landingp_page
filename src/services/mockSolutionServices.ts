import { Language } from "../types";

export const getHomeVideoConfig = async (lang: string) => {
  return {
    vimeoId: "123456789",
    title: "Demo Học Tiếng Trung",
    thumbnail: "https://images.unsplash.com/photo-1548622159-866895eb488b?q=80&w=2070&auto=format&fit=crop",
    autoPlay: true,
  };
};

export const fetchTrialLessons = async (lang: Language) => {
  return [
    {
      id: "1",
      title: "Học thử bài 1: Chào hỏi",
      videoUrl: "https://vimeo.com/123456789",
      level: "HSK 1",
      duration: "15:00",
    },
  ];
};

export const getImageTextSectionConfig = async (lang: string) => {
  return []; // Uses fallback in Solution.tsx
};

export const loadPopupBannerNotification = async (params: any) => {
  return { notification: null, source: "mock" };
};

export const assessPronunciation = async (params: any) => {
  return {
    overallScore: 95,
    accuracyScore: 98,
    fluencyScore: 92,
    completenessScore: 100,
    wordFeedbacks: [
      { word: "你", score: 98, errorType: "None" },
      { word: "好", score: 92, errorType: "None" },
    ],
  };
};

export const findMatchingRoadmapPackage = (params: any) => {
  return null; // Mocking as null to use fallback logic in Solution.tsx
};

export const getStoredToken = () => "mock-token";

export const dismissNotification = async (id: string) => {};
export const markNotificationAsRead = async (id: string) => {};
export const dismissGuestPopupBannerNotification = (n: any) => {};
export const openPopupBannerAction = (url: string, navigate: any, lang: string) => {};

export const mergeImageTextSectionFallback = (fallback: any, items: any, getSafeMediaUrl: any) => {
  return fallback;
};

export const getSafeMediaUrl = (path?: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `https://api.ulaedu.com/api/files/${path}`;
};

export const buildVimeoWatchUrl = (id?: string) => (id ? `https://vimeo.com/${id}` : "");
export const buildVimeoEmbedUrl = (id?: string) => (id ? `https://player.vimeo.com/video/${id}` : "");

const apiMock = {
  get: async (url: string) => ({ data: [] }),
  post: async (url: string, data: any) => ({ data: {} }),
};

export default apiMock;
