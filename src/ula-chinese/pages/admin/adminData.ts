export type EditorStatus = 'draft' | 'review' | 'published';

export interface HeroContent {
  badge: string;
  headlineTop: string;
  headlineHighlight: string;
  headlineBottom: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  heroVideoWatchUrl: string;
  heroImageUrl: string | File;
}

export const PAINPOINTS_DEFAULT_COUNT = 7;

export interface PainpointsContent {
  sectionTitle: string;
  sectionSubtitle: string;
  mainTitleTop: string;
  mainTitleHighlight: string;
  mascotImageUrl: string;
  bubbles: string[];
}

export interface SolutionFeature {
  category: string;
  title: string;
  bullets: string[];
  mediaUrl: string | File;
  isVideo: boolean;
  gradient: string;
}

export interface SolutionContent {
  titlePart1: string;
  titleHighlight: string;
  titlePart2: string;
  cards: SolutionFeature[];
}

export interface MethodologyCard {
  number: string;
  title: string;
  subTitle: string;
  imgSrc: string | File;
}

export interface MethodologyContent {
  mainCard: MethodologyCard;
  cards: MethodologyCard[];
}

export interface ExperienceQuizOption {
  id: string;
  text: string;
}

export interface ExperienceQuizPair {
  zh: string;
  vi: string;
  color?: string;
}

export interface ExperienceQuiz {
  id: number;
  word?: string;
  correctAnswer?: string;
  explanation?: string;
  options?: ExperienceQuizOption[];
  imageUrl?: string;
  type?: 'matching';
  pairs?: ExperienceQuizPair[];
}

export interface ExperienceContent {
  sectionTitle: string;
  sectionSubtitle: string;
  aiPronunciationImageUrl: string | File;
  videoUrl: string;
  quizzes: ExperienceQuiz[];
}

export interface LuckyWheelPrize {
  option: string;
  backgroundColor: string;
  textColor: string;
  code: string;
  probability?: number;
}

export const heroDefault: HeroContent = {
  badge: 'GIẢI PHÁP HỌC TIẾNG TRUNG 5.0',
  headlineTop: 'XU HƯỚNG ',
  headlineHighlight: 'HỌC TIẾNG TRUNG SỚM',
  headlineBottom: 'VÀ LỢI THẾ CHO TƯƠNG LAI',
  description:
    'Chỉ 30p/ngày tại nhà. Dễ dàng với video bài giảng + AI sửa phát âm + cá nhân hoá lộ trình',
  primaryCta: 'Học thử miễn phí',
  secondaryCta: 'Nhận tư vấn lộ trình',
  heroVideoWatchUrl: 'https://player.vimeo.com/video/1176153399?h=09b018576d',
  heroImageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCoYclI5fGBJ-Il1_bZQidSx47lG-xqXULDPGAh6YsMjGYK6MvJ11-UVSQQ8jagw28XciY0dXG0BaK04HM2LrM0sHyXmjG22lgC2KPczeU5p4lWbJOGjRrJMW7sPNeYR1ng_4KV1iwiHI5LcflDmV53MZeG3b_tYrruLScODhFiPwQuuc_ZQuDsuYygTAHITYvzyqVtVJ1NwHniwYlo75x0PHYF5KVxM_OUqPQkJlBVzZIE93WrIBFUuQkuY3QtY7l7Nf6eYEE2O0me',
};

export const painpointsDefault: PainpointsContent = {
  sectionTitle: 'ULA HIỂU NỖI LO CỦA PHỤ HUYNH VÀ HỌC SINH',
  sectionSubtitle: '',
  mainTitleTop: '',
  mainTitleHighlight: '',
  mascotImageUrl: '',
  bubbles: [
    'Bận đi làm',
    'Bận đi học',
    'Tiếng Trung khó???',
    'Trung tâm xa nhà',
    'Không hiệu quả vì lớp đông',
    'Sợ không có năng khiếu',
    'Cạnh tranh tiếng Anh quá đông',
  ],
};

export const solutionDefault: SolutionContent = {
  titlePart1: 'Chỉ',
  titleHighlight: '30 phút/ngày',
  titlePart2: 'dễ dàng bắt đầu',
  cards: [
    {
      category: 'Coaching',
      title: 'Hiệu quả như gia sư 1 kèm 1',
      bullets: ['Video bài giảng cùng chuyên gia', 'Bắt đầu sớm từ lớp 10–11', 'Đội ngũ hỗ trợ 24/7'],
      mediaUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600',
      isVideo: false,
      gradient: 'from-indigo-600/40 to-blue-500/10',
    },
    {
      category: 'Practice',
      title: 'Luyện tập không giới hạn',
      bullets: ['Bài tập tương tác ngay trong video bài giảng', 'AI luyện phát âm, phản xạ giao tiếp'],
      mediaUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600',
      isVideo: false,
      gradient: 'from-blue-400/20 to-white/5',
    },
    {
      category: 'Flexible',
      title: 'Học linh hoạt và tiết kiệm',
      bullets: ['Chỉ với 10k/ngày (giảm 80%)', 'Học mọi lúc, mọi nơi với đa thiết bị'],
      mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600',
      isVideo: false,
      gradient: 'from-blue-900/60 to-black/40',
    },
  ],
};

export const methodologyDefault: MethodologyContent = {
  mainCard: {
    number: 'Ô 1: AI CHẤM CHỮA',
    title: '03. AI CHẤM CHỮA',
    subTitle: '(Real-time Feedback)',
    imgSrc: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800',
  },
  cards: [
    {
      number: 'Ô 2: VIDEO',
      title: '01. BÀI GIẢNG',
      subTitle: 'Kiến thức cô đọng',
      imgSrc: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400',
    },
    {
      number: 'Ô 3: BÀI TẬP',
      title: '02. TƯƠNG TÁC',
      subTitle: 'Thực hành ngay',
      imgSrc: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=400',
    },
    {
      number: 'Ô 4: CÔNG CỤ',
      title: '04. FLASHCARDS',
      subTitle: 'Thuật toán lặp lại',
      imgSrc: 'https://images.unsplash.com/photo-1584697964400-2af6a2f6204c?q=80&w=400',
    },
    {
      number: 'Ô 5: LỘ TRÌNH',
      title: '05. TIẾN ĐỘ',
      subTitle: 'Theo dõi thông minh',
      imgSrc: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400',
    },
  ],
};

export const experienceDefault: ExperienceContent = {
  sectionTitle: 'HỌC TẬP KHÔNG GIỚI HẠN CÙNG ULA',
  sectionSubtitle: 'Demo bài tập tương tác ngay trên hệ thống',
  aiPronunciationImageUrl: 'https://media.istockphoto.com/id/1370433251/photo/black-woman-sitting-at-desk-using-computer-writing-in-notebook.jpg?s=612x612&w=0&k=20&c=rHpy3cX4LVFtzLI4gyy0T-fNYdTeAcdNQgTmy9maAIA=',
  videoUrl: 'https://player.vimeo.com/video/76979871?h=62c6f0f9d0',
  quizzes: [
    {
      id: 1,
      word: 'Khánh!',
      correctAnswer: 'B',
      explanation: '你好 có nghĩa là Xin chào trong tiếng Trung.',
      options: [
        { id: 'A', text: 'Tạm biệt' },
        { id: 'B', text: 'Xin chào' },
        { id: 'C', text: 'Cảm ơn' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800',
    },
    {
      id: 2,
      word: ": '谢谢' tương ứng với?",
      correctAnswer: 'C',
      explanation: "'谢谢' trong tiếng Trung là lời cảm ơn lịch sự.",
      options: [
        { id: 'A', text: 'Chào buổi sáng' },
        { id: 'B', text: 'Chúc ngủ ngon' },
        { id: 'C', text: 'Cảm ơn bạn' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1454165833767-1390e72611da?q=80&w=800',
    },
    {
      id: 3,
      word: "Điền nghĩa: '再见' có nghĩa là...",
      correctAnswer: 'A',
      explanation: "'再见' là cách chào tạm biệt phổ biến nhất trong đời sống hàng ngày.",
      options: [
        { id: 'A', text: 'Tạm biệt' },
        { id: 'B', text: 'Hẹn gặp lại' },
        { id: 'C', text: 'Rất vui được gặp' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800',
    },
    {
      id: 4,
      type: 'matching',
      pairs: [
        { zh: '你好', vi: 'Xin chào', color: '#3b82f6' },
        { zh: '谢谢', vi: 'Cảm ơn', color: '#8b5cf6' },
        { zh: '再见', vi: 'Tạm biệt', color: '#ec4899' },
        { zh: '啤酒', vi: 'Bia', color: '#f59e0b' },
      ],
    },
  ],
};

export const luckyWheelDefault: LuckyWheelPrize[] = [
  { option: 'Voucher 10%', backgroundColor: '#2563eb', textColor: 'white', code: 'ULA-VOUCHER10', probability: 1 },
  { option: 'Khóa học FREE', backgroundColor: '#004ac6', textColor: 'white', code: 'ULA-FREECOURSE', probability: 1 },
  { option: 'Bút ký ULA', backgroundColor: '#ba0a0d', textColor: 'white', code: 'ULA-PEN', probability: 1 },
  { option: 'Sổ tay Trung', backgroundColor: '#e63329', textColor: 'white', code: 'ULA-NOTEBOOK', probability: 1 },
  { option: 'Chúc bạn may mắn', backgroundColor: '#f5a623', textColor: 'black', code: 'ULA-LUCK', probability: 1 },
  { option: 'Tài liệu A1', backgroundColor: '#ffddb4', textColor: 'black', code: 'ULA-DOCS', probability: 1 },
];
