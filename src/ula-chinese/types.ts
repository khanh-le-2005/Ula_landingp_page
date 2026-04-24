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

export enum Level {
  A1 = "A1",
  A2 = "A2",
  B1 = "B1",
  B2 = "B2",
  C1 = "C1",
  C2 = "C2",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  currentLevel?: Level;
}

export type AuthStatus = "loading" | "authenticated" | "anonymous";
