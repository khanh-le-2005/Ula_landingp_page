export const ADMIN_SECTION_KEYS = {
  hero: 'section_1_hero',
  painpoints: 'section_2_painpoints',
  solution: 'section_3_solution',
  methodology: 'section_4_methodology',
  luckyWheel: 'section_5_lucky_wheel',
  experience: 'section_6_experience',
} as const;

export const ADMIN_SECTION_LIST = [
  {
    key: ADMIN_SECTION_KEYS.hero,
    title: 'Trang đầu',
    description: 'Headline, CTA, ảnh và điểm nhấn đầu trang.',
  },
  {
    key: ADMIN_SECTION_KEYS.painpoints,
    title: 'Nỗi đau',
    description: 'Bubble nỗi đau và vị trí layout.',
  },
  {
    key: ADMIN_SECTION_KEYS.solution,
    title: 'Giải pháp',
    description: '3 thẻ giải pháp, media và bullet points.',
  },
  {
    key: ADMIN_SECTION_KEYS.methodology,
    title: 'Phương pháp',
    description: 'Ô lớn + 4 ô nhỏ trong phần phương pháp.',
  },
  {
    key: ADMIN_SECTION_KEYS.luckyWheel,
    title: 'Vòng quay',
    description: 'Danh sách quà, CTA và màu từng ô.',
  },
  {
    key: ADMIN_SECTION_KEYS.experience,
    title: 'Trải nghiệm',
    description: 'Nội dung quiz, video bài tập và AI phát âm.',
  },
] as const;

