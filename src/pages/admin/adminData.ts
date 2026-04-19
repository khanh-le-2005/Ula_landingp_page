export type EditorStatus = 'draft' | 'review' | 'published';

export interface HeroContent {
  badge: string;
  headlineTop: string;
  headlineHighlight: string;
  headlineBottom: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  heroImageUrl: string;
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
  mediaUrl: string;
  isVideo: boolean;
  gradient: string;
}

export interface MethodologyCard {
  number: string;
  title: string;
  subTitle: string;
  imgSrc: string;
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
  de: string;
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
  quizzes: ExperienceQuiz[];
}

export interface LuckyWheelPrize {
  option: string;
  backgroundColor: string;
  textColor: string;
  code: string;
}

export const heroDefault: HeroContent = {
  badge: 'GIẢI PHÁP HỌC TIẾNG ĐỨC 5.0',
  headlineTop: 'HỌC TIẾNG ĐỨC TỪ SỚM',
  headlineHighlight: 'KHÔNG CẦN GIỎI',
  headlineBottom: 'CHỈ CẦN ĐÚNG CÁCH',
  description:
    'Học tiếng Đức thông minh cùng AI. Chỉ 30p/ngày tại nhà với video bài giảng + AI sửa phát âm + lộ trình rõ từng ngày.',
  primaryCta: 'Học thử miễn phí',
  secondaryCta: 'Nhận tư vấn lộ trình',
  heroImageUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCoYclI5fGBJ-Il1_bZQidSx47lG-xqXULDPGAh6YsMjGYK6MvJ11-UVSQQ8jagw28XciY0dXG0BaK04HM2LrM0sHyXmjG22lgC2KPczeU5p4lWbJOGjRrJMW7sPNeYR1ng_4KV1iwiHI5LcflDmV53MZeG3b_tYrruLScODhFiPwQuuc_ZQuDsuYygTAHITYvzyqVtVJ1NwHniwYlo75x0PHYF5KVxM_OUqPQkJlBVzZIE93WrIBFUuQkuY3QtY7l7Nf6eYEE2O0me',
};

export const painpointsDefault: PainpointsContent = {
  sectionTitle: 'ULA GIẢI QUYẾT MỌI NỖI LO',
  sectionSubtitle: '',
  mainTitleTop: 'Các nỗi sợ',
  mainTitleHighlight: 'của bạn',
  mascotImageUrl: '',
  bubbles: [
    'Lớp học offline đông',
    'Không gần trung tâm tiếng',
    'Muốn học sớm, phải chờ hết THPT',
    'Rủi ro chi phí 50tr - 100tr',
    'Đã sang Đức nhưng không nói được',
    'Tiếng Đức khó',
    'Học xong lại quên',
  ],
};

export const solutionDefault: SolutionFeature[] = [
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
    bullets: ['Bài tập tương tác ngay trong video', 'AI luyện phát âm, phản xạ'],
    mediaUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600',
    isVideo: false,
    gradient: 'from-blue-400/20 to-white/5',
  },
  {
    category: 'Flexible',
    title: 'Học linh hoạt và tiết kiệm',
    bullets: ['Chỉ với 10k/ngày (giảm 80%)', 'Học mọi lúc với đa thiết bị'],
    mediaUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600',
    isVideo: false,
    gradient: 'from-blue-900/60 to-black/40',
  },
];

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
  sectionTitle: 'Trải nghiệm học tập',
  sectionSubtitle: 'Cùng AI chấm chữa',
  quizzes: [
    {
      id: 1,
      word: 'Hallo!',
      correctAnswer: 'B',
      explanation: 'Hallo có nghĩa là Xin chào trong tiếng Đức.',
      options: [
        { id: 'A', text: 'Tạm biệt' },
        { id: 'B', text: 'Xin chào' },
        { id: 'C', text: 'Cảm ơn' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=400',
    },
    {
      id: 2,
      word: "Nối từ: 'Danke' tương ứng với?",
      correctAnswer: 'C',
      explanation: "'Danke' trong tiếng Đức là lời cảm ơn lịch sự.",
      options: [
        { id: 'A', text: 'Chào buổi sáng' },
        { id: 'B', text: 'Chúc ngủ ngon' },
        { id: 'C', text: 'Cảm ơn bạn' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-1599422315624-8015e9718420?q=80&w=400',
    },
    {
      id: 3,
      word: "Điền nghĩa: 'Tschüss' có nghĩa là...",
      correctAnswer: 'A',
      explanation: "'Tschüss' là cách chào tạm biệt phổ biến nhất trong đời sống hàng ngày.",
      options: [
        { id: 'A', text: 'Tạm biệt' },
        { id: 'B', text: 'Hẹn gặp lại' },
        { id: 'C', text: 'Rất vui được gặp' },
      ],
      imageUrl: 'https://images.unsplash.com/photo-152666130d554-1b25d036ea47?q=80&w=400',
    },
    {
      id: 4,
      type: 'matching',
      pairs: [
        { de: 'Hallo', vi: 'Xin chào', color: '#3b82f6' },
        { de: 'Danke', vi: 'Cảm ơn', color: '#8b5cf6' },
        { de: 'Tschüss', vi: 'Tạm biệt', color: '#ec4899' },
        { de: 'Bier', vi: 'Bia', color: '#f59e0b' },
      ],
    },
  ],
};

export const luckyWheelDefault: LuckyWheelPrize[] = [
  { option: 'Voucher 10%', backgroundColor: '#2563eb', textColor: 'white', code: 'ULA-VOUCHER10' },
  { option: 'Khóa học FREE', backgroundColor: '#004ac6', textColor: 'white', code: 'ULA-FREECOURSE' },
  { option: 'Bút ký ULA', backgroundColor: '#ba0a0d', textColor: 'white', code: 'ULA-PEN' },
  { option: 'Sổ tay Đức', backgroundColor: '#e63329', textColor: 'white', code: 'ULA-NOTEBOOK' },
  { option: 'Chúc bạn may mắn', backgroundColor: '#f5a623', textColor: 'black', code: 'ULA-LUCK' },
  { option: 'Tài liệu A1', backgroundColor: '#ffddb4', textColor: 'black', code: 'ULA-DOCS' },
];
