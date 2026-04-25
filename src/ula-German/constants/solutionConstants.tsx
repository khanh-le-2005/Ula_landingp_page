export const MOCK_QUIZ_DATA = [
  {
    id: 1,
    word: "Hallo!",
    correctAnswer: 'B',
    explanation: "Hallo có nghĩa là Xin chào trong tiếng Đức.",
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
    word: "Nối từ: 'Danke' tương ứng với?",
    correctAnswer: 'C',
    explanation: "'Danke' trong tiếng Đức là lời cảm ơn lịch sự.",
    options: [
      { id: 'A', text: 'Chào buổi sáng' },
      { id: 'B', text: 'Chúc ngủ ngon' },
      { id: 'C', text: 'Cảm ơn bạn' }
    ],
    imageUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=800"
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
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800" // Ảnh minh họa tạm biệt
  },
  {
    id: 4,
    type: "matching",
    pairs: [
      { de: "Hallo", vi: "Xin chào", color: "#3b82f6" }, // Xanh dương
      { de: "Danke", vi: "Cảm ơn", color: "#8b5cf6" },    // Tím
      { de: "Tschüss", vi: "Tạm biệt", color: "#ec4899" }, // Hồng
      { de: "Bier", vi: "Bia", color: "#f59e0b" },        // Vàng cam
    ],
  },

  {
    id: 5,
    word: "Guten Morgen!",
    correctAnswer: 'A',
    explanation: "'Guten Morgen' có nghĩa là Chào buổi sáng trong tiếng Đức.",
    options: [
      { id: 'A', text: 'Chào buổi sáng' },
      { id: 'B', text: 'Chào buổi tối' },
      { id: 'C', text: 'Chúc ngủ ngon' }
    ],
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800"
  },
  {
    id: 6,
    type: "matching",
    pairs: [
      { de: "Ja", vi: "Có", color: "#10b981" },      // Xanh lá
      { de: "Nein", vi: "Không", color: "#ef4444" }, // Đỏ
      { de: "Bitte", vi: "Làm ơn", color: "#6366f1" }, // Indigo
      { de: "Entschuldigung", vi: "Xin lỗi", color: "#f97316" }, // Cam
    ],
  }
];