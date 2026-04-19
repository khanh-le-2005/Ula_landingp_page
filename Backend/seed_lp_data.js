const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const lpModel = require("./src/models/lpModel");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB để Seeding...");

    // Xóa dữ liệu cũ (Tùy chọn, ở đây ta cứ giữ lại và upsert bản mới)
    // await lpModel.LandingPage.deleteMany({});

    const sections = [
      {
        key: "hero",
        content: {
          badge: "GIẢI PHÁP HỌC TIẾNG ĐỨC 5.0",
          headlineTop: "Học tiếng Đức từ sớm.",
          headlineHighlight: "Không cần giỏi",
          headlineBottom: "chỉ cần đúng cách.",
          description: "Học tiếng Đức thông minh cùng AI. Chỉ 30p/ngày tại nhà với video bài giảng + AI sửa phát âm + lộ trình rõ từng ngày.",
          primaryCta: "Học thử miễn phí",
          secondaryCta: "Nhận tư vấn lộ trình",
          heroImageUrl: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=1200"
        }
      },
      {
        key: "section_2_painpoints",
        content: {
          sectionTitle: "ULA GIẢI QUYẾT MỌI NỖI LO",
          sectionSubtitle: "THÔNG MINH - HIỆU QUẢ - TIẾT KIỆM",
          mainTitleTop: "Các nỗi sợ",
          mainTitleHighlight: "của bạn",
          mascotImageUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=400",
          bubbles: [
            { text: "Đã sang Đức nhưng không nói được" },
            { text: "Muốn học sớm, phải chờ hết THPT" },
            { text: "Không gần trung tâm tiếng" },
            { text: "Rủi ro chi phí 50tr - 100tr" },
            { text: "Lớp học offline đông" },
            { text: "Tiếng Đức khó" },
            { text: "Học xong lại quên" }
          ]
        }
      },
      {
        key: "section_3_solution",
        content: [
          {
            category: "Coaching",
            title: "Hiệu quả như gia sư 1 kèm 1",
            bullets: [
              "Video bài giảng cùng chuyên gia",
              "Bắt đầu sớm từ lớp 10–11",
              "Đội ngũ hỗ trợ 24/7"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
            isVideo: false,
            gradient: "from-indigo-600/40 to-blue-500/10"
          },
          {
            category: "Practice",
            title: "Luyện tập không giới hạn",
            bullets: [
              "Bài tập tương tác ngay trong video",
              "AI luyện phát âm, phản xạ"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600",
            isVideo: false,
            gradient: "from-blue-400/20 to-white/5"
          },
          {
            category: "Flexible",
            title: "Học linh hoạt và tiết kiệm",
            bullets: [
              "Chỉ với 10k/ngày (giảm 80%)",
              "Học mọi lúc với đa thiết bị"
            ],
            mediaUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600",
            isVideo: false,
            gradient: "from-blue-900/60 to-black/40"
          }
        ]
      },
      {
        key: "section_4_methodology",
        content: {
          mainCard: {
            number: "Ô 1: AI CHẤM CHỮA",
            title: "03. AI CHẤM CHỮA",
            subTitle: "(Real-time Feedback)",
            imgSrc: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800"
          },
          cards: [
            {
              number: "Ô 2: VIDEO",
              title: "01. BÀI GIẢNG",
              subTitle: "Kiến thức cô đọng",
              imgSrc: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400"
            },
            {
              number: "Ô 3: BÀI TẬP",
              title: "02. TƯƠNG TÁC",
              subTitle: "Thực hành ngay",
              imgSrc: "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=400"
            },
            {
              number: "Ô 4: CÔNG CỤ",
              title: "04. FLASHCARDS",
              subTitle: "Thuật toán lặp lại",
              imgSrc: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400"
            },
            {
              number: "Ô 5: LỘ TRÌNH",
              title: "05. TIẾN ĐỘ",
              subTitle: "Theo dõi thông minh",
              imgSrc: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400"
            }
          ]
        }
      },
      {
        key: "luckyspin",
        content: {
          timerLabel: "Ưu đãi kết thúc sau: 00:59:59",
          headline: "Vòng quay may mắn - Nhận quà cực khủng!",
          description: "Chỉ cần đăng ký thông tin để nhận 01 lượt quay miễn phí với cơ hội trúng học bổng lên đến 50%.",
          prizes: [
            { option: "Voucher 10%", backgroundColor: "#2563eb", textColor: "white" },
            { option: "Khóa học FREE", backgroundColor: "#004ac6", textColor: "white" },
            { option: "Bút ký ULA", backgroundColor: "#ba0a0d", textColor: "white" },
            { option: "Sổ tay Đức", backgroundColor: "#e63329", textColor: "white" },
            { option: "Chúc bạn may mắn", backgroundColor: "#f5a623", textColor: "black" },
            { option: "Tài liệu A1", backgroundColor: "#ffddb4", textColor: "black" }
          ]
        }
      }
    ];

    for (const item of sections) {
      // Seed cho site mặc định (main)
      await lpModel.updateSection(item.key, item.content, "main", "default");
      // Seed ví dụ cho các ngôn ngữ khác (nếu cần)
      // await lpModel.updateSection(item.key, item.content, "tieng-truong", "default");
    }

    console.log("✅ Seed dữ liệu Landing Page mới thành công!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi Seeding:", error);
    process.exit(1);
  }
};

seed();
