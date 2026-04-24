export const MOCK_QUIZ_DATA = [
  {
    id: 1,
    word: "你好!",
    correctAnswer: 'B',
    explanation: "你好 có nghĩa là Xin chào trong tiếng Trung.",
    options: [
      { id: 'A', text: 'Tạm biệt' },
      { id: 'B', text: 'Xin chào' },
      { id: 'C', text: 'Cảm ơn' }
    ],
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800"
  },
  // --- CÂU HỎI DẠNG NỐI (MATCHING) ---
  {
    id: 2,
    word: ": '谢谢' tương ứng với?",
    correctAnswer: 'C',
    explanation: "'谢谢' trong tiếng Trung là lời cảm ơn lịch sự.",
    options: [
      { id: 'A', text: 'Chào buổi sáng' },
      { id: 'B', text: 'Chúc ngủ ngon' },
      { id: 'C', text: 'Cảm ơn bạn' }
    ],
    imageUrl: "https://images.unsplash.com/photo-1454165833767-1390e72611da?q=80&w=800" // Ảnh minh họa lời cảm ơn
  },
  // --- CÂU HỎI DẠNG ĐIỀN NGHĨA (FILL IN THE BLANK) ---
  {
    id: 3,
    word: "Điền nghĩa: '再见' có nghĩa là...",
    correctAnswer: 'A',
    explanation: "'再见' là cách chào tạm biệt phổ biến nhất trong đời sống hàng ngày.",
    options: [
      { id: 'A', text: 'Tạm biệt' },
      { id: 'B', text: 'Hẹn gặp lại' },
      { id: 'C', text: 'Rất vui được gặp' }
    ],
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800" // Ảnh minh họa tạm biệt
  },
  // ... các câu hỏi cũ
  {
    id: 4,
    type: "matching",
    pairs: [
      { zh: "你好", vi: "Xin chào", color: "#3b82f6" }, // Xanh dương
      { zh: "谢谢", vi: "Cảm ơn", color: "#8b5cf6" },    // Tím
      { zh: "再见", vi: "Tạm biệt", color: "#ec4899" }, // Hồng
      { zh: "啤酒", vi: "Bia", color: "#f59e0b" },        // Vàng cam
    ],
  }
];


