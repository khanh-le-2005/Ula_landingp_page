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
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=400"
  },
  // --- CÂU HỎI DẠNG NỐI (MATCHING) ---
  {
    id: 2,
    word: "Nối từ: 'Danke' tương ứng với?",
    correctAnswer: 'C',
    explanation: "'Danke' trong tiếng Đức là lời cảm ơn lịch sự.",
    options: [
      { id: 'A', text: 'Chào buổi sáng' },
      { id: 'B', text: 'Chúc ngủ ngon' },
      { id: 'C', text: 'Cảm ơn bạn' }
    ],
    imageUrl: "https://images.unsplash.com/photo-1599422315624-8015e9718420?q=80&w=400" // Ảnh minh họa lời cảm ơn
  },
  // --- CÂU HỎI DẠNG ĐIỀN NGHĨA (FILL IN THE BLANK) ---
  {
    id: 3,
    word: "Điền nghĩa: 'Tschüss' có nghĩa là...",
    correctAnswer: 'A',
    explanation: "'Tschüss' là cách chào tạm biệt phổ biến nhất trong đời sống hàng ngày.",
    options: [
      { id: 'A', text: 'Tạm biệt' },
      { id: 'B', text: 'Hẹn gặp lại' },
      { id: 'C', text: 'Rất vui được gặp' }
    ],
    imageUrl: "https://images.unsplash.com/photo-152666130d554-1b25d036ea47?q=80&w=400" // Ảnh minh họa tạm biệt
  },
  // ... các câu hỏi cũ
  {
    id: 4,
    type: "matching",
    pairs: [
      { de: "Hallo", vi: "Xin chào", color: "#3b82f6" }, // Xanh dương
      { de: "Danke", vi: "Cảm ơn", color: "#8b5cf6" },    // Tím
      { de: "Tschüss", vi: "Tạm biệt", color: "#ec4899" }, // Hồng
      { de: "Bier", vi: "Bia", color: "#f59e0b" },        // Vàng cam
    ],
  }
];