export enum Language {
  CHINESE = "CHINESE",
  ENGLISH = "ENGLISH",
  VIETNAMESE = "VIETNAMESE",
}

export interface ProductPackage {
  id: string;
  name: string;
  price: number;
  language: Language;
  description?: string;
}

export interface HomeVideoConfig {
  vimeoId?: string;
  title?: string;
  thumbnail?: string;
  autoPlay?: boolean;
}

export interface TrialLessonPreview {
  id: string;
  title: string;
  videoUrl: string;
  level: string;
  duration: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  content: string;
  read: boolean;
}

export interface PronunciationErrorReport {
  overallScore: number;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  wordFeedbacks: any[];
}
