
// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useMemo,
//   useCallback,
// } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   PlayCircle,
//   PauseCircle,
//   Star,
//   ChevronLeft,
//   ChevronRight,
//   Mic,
//   Headphones,
//   BookOpen,
//   PenTool,
//   Play,
//   Volume2,
//   GraduationCap,
//   Check,
//   Heart,
//   CheckCircle2,
//   Crown,
//   HelpCircle,
//   Eye,
//   X,
//   FileText,
//   Quote,
//   TrendingUp,
//   AudioLines,
//   RotateCcw,
//   Clock,
//   CalendarCheck,
//   Diamond,
//   AlertCircle,
//   Loader2,
//   Search,
//   Monitor,
//   Award,
// } from "lucide-react";
// import api from "../services/api";
// import { Language, ProductPackage } from "../types";
// import ChineseWritingStrokePractice from "../components/ChineseWritingStrokePractice";
// import PronunciationResultCard from "../components/PronunciationResultCard";
// import FloatingContactMenu from "../components/FloatingContactMenu";
// import { getUserFacingErrorMessage } from "../utils/userFacingError";
// import SlimVimeoPlayer from "../components/SlimVimeoPlayer";
// import SuccessStatsPanel from "../components/SuccessStatsPanel";
// import CourseRoadmapShowcase, {
//   type CourseRoadmapAddOnSelection,
// } from "../components/CourseRoadmapShowcase";
// import HomePopupBannerModal from "../components/notifications/HomePopupBannerModal";
// import {
//   dismissNotification,
//   markNotificationAsRead,
//   type InAppNotification,
// } from "../services/api_notifications";
// import { getStoredToken } from "../services/authStorage";
// import {
//   dismissGuestPopupBannerNotification,
//   loadPopupBannerNotification,
//   openPopupBannerAction,
// } from "../services/homePopupBanner";
// import { findMatchingRoadmapPackage } from "../services/roadmapPackage";
// import {
//   buildVimeoEmbedUrl,
//   buildVimeoWatchUrl,
//   getHomeVideoConfig,
//   type HomeVideoConfig,
// } from "../services/homeVideo";
// import {
//   fetchTrialLessons,
//   type TrialLessonPreview,
// } from "../services/trialLessons";
// import judyHoppsImage from "../assets/Judy Hopps Unfiltered Icon.jpg";
// import {
//   getImageTextSectionConfig,
//   mergeImageTextSectionFallback,
// } from "../services/imageTextSection";

// import {
//   assessPronunciation,
//   type PronunciationErrorReport,
// } from "../services/api_pronunciation";
// import {
//   startWavRecordingSession,
//   stopWavRecordingSession,
//   type WavRecordingSession,
// } from "../services/audioWav";
// import { useConsultationModal } from "../context/ConsultationModalContext";

// const CHINESE_WATER_OPTION_IMAGE = "/mock-images/chinese-water-option.svg";
// const ROADMAP_LOADING_MESSAGE =
//   "Đang tải khóa học phù hợp từ hệ thống. Vui lòng thử lại sau vài giây.";
// const ROADMAP_UNAVAILABLE_MESSAGE =
//   "Khóa học hiện tại đang được phát triển.";

// // --- 1. KHAI BÁO TYPE / INTERFACE ---
// interface Review {
//   id: number;
//   user: string;
//   date: string;
//   rating: number;
//   text: string;
//   avatar: string;
// }

// interface Teacher {
//   id: number;
//   name: string;
//   role: string;
//   exp: string;
//   image: string;
//   quote: string;
//   education: string;
//   level: string;
//   specialties: string[];
//   students?: string;
//   stats: {
//     rating: string;
//     students: string;
//     exp?: string;
//   };
//   reviews: Review[];
// }

// const getSafeMediaUrl = (path?: string) => {
//   if (!path) return "";
//   if (path.startsWith("http") || path.startsWith("data:")) return path;
//   let url = `https://api.ulaedu.com/api/files/${path}`;
//   const token = localStorage.getItem("token")?.replace(/^"(.*)"$/, "$1");
//   if (token) {
//     url += `?token=${token}`;
//   }
//   return url;
// };

// // Hàm đọc phát âm tiếng Trung (Text to Speech)
// const playTTS = (text: string) => {
//   if ("speechSynthesis" in window) {
//     window.speechSynthesis.cancel();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = "zh-CN";
//     utterance.rate = 0.9;
//     window.speechSynthesis.speak(utterance);
//   }
// };

// // --- DỮ LIỆU 6 CÂU HỎI DEMO THEO YÊU CẦU ---
// const EXERCISES = [
//   {
//     type: "multiple_choice",
//     question: "你好",
//     audioText: "你好",
//     options: ["Xin chào", "Chào buổi sáng", "Tốt"],
//     correct: 0, // A. Xin chào
//     hint: "你好 (Nǐ hǎo) có nghĩa là Xin chào.",
//     image: judyHoppsImage,
//     audio: true,
//   },
//   {
//     type: "multiple_choice",
//     question: 'Chọn câu đúng với nghĩa "Xin chào Việt Nam"',
//     options: ["你们好。", "你好", "你好越南"],
//     correct: 2, // C. 你好越南
//     hint: "越南 (Yuènán) là Việt Nam.",
//     readOptions: true, // Cần đọc các đáp án khi click
//   },
//   {
//     type: "multiple_choice_image",
//     question: 'Chọn từ vựng tương ứng với "Cà phê"',
//     options: [
//       {
//         text: "咖啡",
//         img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&q=80",
//       },
//       {
//         text: "茶",
//         img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&q=80",
//       },
//       {
//         text: "水",
//         img: CHINESE_WATER_OPTION_IMAGE,
//       },
//     ],
//     correct: 0, // A. 咖啡
//     hint: "咖啡 (kāfēi) là cà phê.",
//   },
//   {
//     type: "multiple_choice_image",
//     question: 'Chọn từ vựng tương ứng với "Trà"',
//     options: [
//       {
//         text: "水",
//         img: CHINESE_WATER_OPTION_IMAGE,
//       },
//       {
//         text: "茶",
//         img: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&q=80",
//       },
//       {
//         text: "咖啡",
//         img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=300&q=80",
//       },
//     ],
//     correct: 1, // B. 茶
//     hint: "茶 (chá) là trà.",
//   },
//   {
//     type: "order",
//     question: "🎧 Nghe và sắp xếp các từ thành câu đúng",
//     audioText: "茶 和 咖啡",
//     target: "茶 和 咖啡",
//     words: ["咖啡", "茶", "和"],
//     hint: "👉 Nghĩa: Trà và cà phê.",
//     audio: true,
//   },
//   {
//     type: "match",
//     question: "Nối các cặp từ với nghĩa tương ứng",
//     pairs: [
//       { id: "p1", left: "人", right: "con người" },
//       { id: "p2", left: "茶", right: "trà" },
//       { id: "p3", left: "口", right: "cái miệng" },
//       { id: "p4", left: "咖啡", right: "cà phê" },
//     ],
//   },
// ];

// // --- 2. DỮ LIỆU LỘ TRÌNH VÀ GIÁO VIÊN ---
// const TEACHERS: Teacher[] = [
//   {
//     id: 1,
//     name: "Nguyễn Thu Hà",
//     role: "Cố vấn học tập",
//     exp: "8+ năm (phát triển học liệu)",
//     image: "https://i.ibb.co/rRzgZ8XW/gv2.webp",
//     quote: "Tiếng Trung không khó, khó là học sai nền tảng ngay từ đầu.",
//     education: "Thạc sĩ Hán ngữ – ĐH Ngôn ngữ Bắc Kinh",
//     level: "HSK 6 – HSKK Cao cấp",
//     specialties: ["Ngữ pháp", "Hệ thống hóa", "Lộ trình"],
//     stats: { rating: "4.9", students: "3000+" },
//     reviews: [],
//   },
//   {
//     id: 2,
//     name: "Trần Minh Quân",
//     role: "Cố vấn Học thuật - HSK6",
//     exp: "12+ năm (nghiên cứu & đào tạo)",
//     students: "5000+",
//     image: "https://i.ibb.co/fdb98h14/gv-7.webp",
//     quote:
//       "Học hiệu quả đến từ luyện tập đúng cách mỗi ngày, không phải học dồn theo cảm hứng.",
//     education: "Thạc sĩ Trung Quốc học – ĐH Sư phạm Hoa Đông",
//     level: "Chứng chỉ giáo viên quốc tế",
//     specialties: ["Phát âm", "Luyện thi HSK", "Giao tiếp"],
//     stats: { rating: "5.0", students: "5000+" },
//     reviews: [],
//   },
//   {
//     id: 3,
//     name: "Lê Hoài An",
//     role: "Cố vấn Học liệu - HSK6",
//     exp: "9+ năm (đào tạo tiếng Trung)",
//     students: "1500+",
//     image: "https://i.postimg.cc/XvmRz6Hd/lê_hoài_an.png",
//     quote:
//       "Xác định sai mục tiêu học tiếng Trung sẽ khiến người học mất vài năm đi đường vòng.",
//     education: "Thạc sĩ Ngôn ngữ Trung – ĐH Ngoại ngữ Thượng Hải",
//     level: "HSK 6",
//     specialties: ["Từ vựng", "Bài tập tương tác", "Nghe hiểu"],
//     stats: { rating: "4.9", students: "1500+" },
//     reviews: [],
//   },
// ];

// const TRUSTED_VIETNAMESE_AVATARS = [
//   "https://images.pexels.com/photos/29677093/pexels-photo-29677093.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
//   "https://images.pexels.com/photos/30436001/pexels-photo-30436001.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
//   "https://images.pexels.com/photos/4063971/pexels-photo-4063971.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
//   "https://images.pexels.com/photos/36064019/pexels-photo-36064019.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
//   "https://images.pexels.com/photos/12667510/pexels-photo-12667510.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
// ];

// const getPexelsPhoto = (id: number, width = 640, height?: number) =>
//   `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}${
//     height ? `&h=${height}&fit=crop` : ""
//   }`;

// const REVIEWS_DATA = [
//   {
//     id: 1,
//     name: "Ngọc Trâm",
//     level: "Mất gốc",
//     text: "Mình kiểu nhìn Hán tự là hoa mắt. Học chia nhỏ bài nên cuối cùng cũng không bỏ giữa chừng nữa.",
//     tags: ["Mất gốc", "Người đi làm"],
//     likes: 184,
//     avatar: getPexelsPhoto(29677093, 160, 160),
//   },
//   {
//     id: 2,
//     name: "Đức Anh",
//     level: "HSK 3",
//     text: "Trước phát âm nghe như đọc thần chú, AI chấm hơi phũ nhưng sửa đúng. Giờ nói đỡ quê hẳn.",
//     tags: ["Phát âm", "HSKK"],
//     likes: 233,
//     avatar: getPexelsPhoto(30436001, 160, 160),
//   },
//   {
//     id: 3,
//     name: "Khánh Linh",
//     level: "HSK 4",
//     text: "Mình não cá vàng mà app nhắc học đều nên vẫn lên được HSK4. Bất ngờ thiệt.",
//     tags: ["Ôn mỗi ngày", "HSK 4"],
//     likes: 147,
//     avatar: getPexelsPhoto(4063971, 160, 160),
//   },
//   {
//     id: 4,
//     name: "Quốc Huy",
//     level: "Đi làm",
//     text: "Đi làm về chỉ học nổi 15 phút, mà đúng kiểu 15 phút này cứu mình. Không bị ngợp như học dồn cuối tuần.",
//     tags: ["Người đi làm", "Micro learning"],
//     likes: 119,
//     avatar: getPexelsPhoto(25884724, 160, 160),
//   },
//   {
//     id: 5,
//     name: "Bảo Ngọc",
//     level: "HSK 2",
//     text: "Viết chữ trước đây như vẽ bùa. Học vài tuần xong ít nhất mình còn đọc lại được chữ mình viết.",
//     tags: ["Hán tự", "Mất gốc"],
//     likes: 91,
//     avatar: getPexelsPhoto(31035788, 160, 160),
//   },
//   {
//     id: 6,
//     name: "Thùy Dương",
//     level: "Du học",
//     text: "Qua bên kia rồi mới thấy phần nghe nói ở đây dạy rất thực dụng. Ra siêu thị không ú ớ nữa.",
//     tags: ["Du học", "Giao tiếp"],
//     likes: 276,
//     avatar: getPexelsPhoto(35628737, 160, 160),
//   },
//   {
//     id: 7,
//     name: "Hà My",
//     level: "HSK 3",
//     text: "Bài tập ngắn nhưng dí đều, lười mấy cũng bị kéo vào học. Cay mà hiệu quả.",
//     tags: ["Lười vẫn học", "HSK 3"],
//     likes: 201,
//     avatar: getPexelsPhoto(35628740, 160, 160),
//   },
//   {
//     id: 8,
//     name: "Mai Phương",
//     level: "HSKK",
//     text: "Ôn HSKK ở đây đỡ áp lực vì có mẫu nói sẵn. Lúc đầu mình nói bé như muỗi, giờ đỡ run hơn nhiều.",
//     tags: ["HSKK", "Nói"],
//     likes: 134,
//     avatar: getPexelsPhoto(31892580, 160, 160),
//   },
//   {
//     id: 9,
//     name: "Lan Chi",
//     level: "HSK 5",
//     text: "Cô sửa bài viết rất kỹ, gạch đỏ nhìn hơi đau tim nhưng nhờ vậy lên điểm thật.",
//     tags: ["Viết", "HSK 5"],
//     likes: 167,
//     avatar: getPexelsPhoto(31892582, 160, 160),
//   },
//   {
//     id: 10,
//     name: "Thanh Vy",
//     level: "Mẹ bỉm",
//     text: "Mỗi ngày tranh thủ lúc con ngủ học 1-2 bài. Không nhanh thần tốc nhưng chắc, vậy là đủ.",
//     tags: ["Mẹ bỉm", "Học linh hoạt"],
//     likes: 88,
//     avatar: getPexelsPhoto(15916247, 160, 160),
//   },
//   {
//     id: 11,
//     name: "Gia Hân",
//     level: "HSK 4",
//     text: "Mình từng học chỗ khác 6 tháng vẫn mù mờ. Qua đây mới thấy vấn đề là thiếu lộ trình chứ không phải mình dở.",
//     tags: ["Lộ trình", "HSK 4"],
//     likes: 309,
//     avatar: getPexelsPhoto(36064019, 160, 160),
//   },
//   {
//     id: 12,
//     name: "Minh Thư",
//     level: "Đi làm",
//     text: "Phần từ vựng theo chủ đề cứu mình mấy buổi họp với đối tác Trung Quốc. Đỡ phải cười trừ.",
//     tags: ["Công việc", "Từ vựng"],
//     likes: 156,
//     avatar: getPexelsPhoto(36060812, 160, 160),
//   },
//   {
//     id: 13,
//     name: "Kiều Oanh",
//     level: "HSK 2",
//     text: "Mình học hơi chậm nhưng bài nào cũng có ví dụ đời thường nên vào đầu hơn kiểu học vẹt.",
//     tags: ["Học chậm", "Ví dụ dễ hiểu"],
//     likes: 73,
//     avatar: getPexelsPhoto(4063968, 160, 160),
//   },
//   {
//     id: 14,
//     name: "Hoài An",
//     level: "HSK 3",
//     text: "Có hôm lười quá mở app lên chỉ để điểm danh, xong lại học luôn 20 phút. Bị thao túng nhẹ nhưng ổn.",
//     tags: ["Thói quen học", "HSK 3"],
//     likes: 142,
//     avatar: getPexelsPhoto(29502143, 160, 160),
//   },
//   {
//     id: 15,
//     name: "Bảo Hân",
//     level: "HSK 4",
//     text: "Nghe người bản xứ nói trước đây như máy bắn chữ. Giờ bắt được ý chính rồi, cảm giác đỡ toang.",
//     tags: ["Nghe hiểu", "HSK 4"],
//     likes: 128,
//     avatar: getPexelsPhoto(12667510, 160, 160),
//   },
//   {
//     id: 16,
//     name: "Nhật Nam",
//     level: "HSK 5",
//     text: "Mục tiêu của mình là xin việc công ty Trung. Sau 5 tháng học nghiêm túc thì pass vòng phỏng vấn thật.",
//     tags: ["Phỏng vấn", "HSK 5"],
//     likes: 265,
//     avatar: getPexelsPhoto(25884724, 160, 160),
//   },
//   {
//     id: 17,
//     name: "Phương Nhi",
//     level: "HSK 6",
//     text: "Không phải học ít đâu, vẫn cày sấp mặt, nhưng ít nhất cày đúng chỗ. Bộ đề và feedback khá sát.",
//     tags: ["Luyện thi", "HSK 6"],
//     likes: 192,
//     avatar: getPexelsPhoto(6791475, 160, 160),
//   },
//   {
//     id: 18,
//     name: "Tuấn Đạt",
//     level: "Xuất nhập khẩu",
//     text: "Học để làm việc chứ không phải thi nên mình thích phần mẫu câu thực tế. Vào chat với khách đỡ gõ Google dịch.",
//     tags: ["Đi làm", "Giao tiếp"],
//     likes: 111,
//     avatar: getPexelsPhoto(30436001, 160, 160),
//   },
// ];

// const REVIEWS_COLUMN_LEFT = REVIEWS_DATA.filter((_, index) => index % 2 === 0);
// const REVIEWS_COLUMN_RIGHT = REVIEWS_DATA.filter((_, index) => index % 2 !== 0);

// const SUCCESS_IMAGES = [
//   {
//     src: getPexelsPhoto(32353257, 320, 420),
//     alt: "Teen Việt Nam mặc đồng phục ngoài sân trường",
//     rotate: "-7deg",
//     top: "3%",
//     left: "2%",
//     z: 12,
//     size: "w-20 h-28 md:w-24 md:h-32",
//   },
//   {
//     src: getPexelsPhoto(32377094, 360, 480),
//     alt: "Nhóm teen Việt Nam mặc đồng phục ngoài trời",
//     rotate: "4deg",
//     top: "1%",
//     right: "4%",
//     z: 8,
//     size: "w-24 h-32 md:w-32 md:h-40",
//   },
//   {
//     src: getPexelsPhoto(30355861, 420, 560),
//     alt: "Học viên teen Việt Nam trong lớp học",
//     rotate: "-2deg",
//     top: "11%",
//     left: "24%",
//     z: 18,
//     size: "w-32 h-44 md:w-40 md:h-56",
//     main: true,
//   },
//   {
//     src: getPexelsPhoto(32301413, 280, 360),
//     alt: "Teen Việt Nam cười trong hành lang trường",
//     rotate: "9deg",
//     top: "14%",
//     right: "20%",
//     z: 11,
//     size: "w-20 h-24 md:w-24 md:h-32",
//   },
//   {
//     src: getPexelsPhoto(32301416, 300, 380),
//     alt: "Teen Việt Nam trong đồng phục tại khuôn viên trường",
//     rotate: "-10deg",
//     top: "22%",
//     left: "4%",
//     z: 9,
//     size: "w-20 h-24 md:w-24 md:h-32",
//   },
//   {
//     src: getPexelsPhoto(32279020, 340, 440),
//     alt: "Hai học viên tuổi teen đang học cùng nhau trong lớp",
//     rotate: "7deg",
//     top: "30%",
//     right: "2%",
//     z: 14,
//     size: "w-24 h-32 md:w-28 md:h-36",
//   },
//   {
//     src: getPexelsPhoto(32434149, 280, 360),
//     alt: "Ba nữ sinh tuổi teen tại Việt Nam",
//     rotate: "-4deg",
//     top: "37%",
//     left: "28%",
//     z: 13,
//     size: "w-20 h-24 md:w-24 md:h-32",
//   },
//   {
//     src: getPexelsPhoto(32279010, 320, 420),
//     alt: "Nhóm học viên teen trong lớp học ngoại ngữ",
//     rotate: "11deg",
//     top: "44%",
//     left: "0%",
//     z: 10,
//     size: "w-24 h-32 md:w-32 md:h-40",
//   },
//   {
//     src: getPexelsPhoto(29242207, 340, 460),
//     alt: "Học viên tuổi teen trong lớp học ngoại ngữ phong cách Anh",
//     rotate: "-8deg",
//     top: "50%",
//     left: "18%",
//     z: 16,
//     size: "w-24 h-32 md:w-32 md:h-40",
//   },
//   {
//     src: getPexelsPhoto(32242334, 300, 380),
//     alt: "Teen châu Á trong lớp học với bảng trang trí sáng tạo",
//     rotate: "5deg",
//     top: "48%",
//     right: "18%",
//     z: 9,
//     size: "w-20 h-24 md:w-24 md:h-32",
//   },
//   {
//     src: getPexelsPhoto(32242324, 300, 380),
//     alt: "Nam học viên tuổi teen trong lớp học",
//     rotate: "-12deg",
//     bottom: "16%",
//     left: "6%",
//     z: 15,
//     size: "w-24 h-28 md:w-28 md:h-36",
//   },
//   {
//     src: getPexelsPhoto(32242329, 300, 380),
//     alt: "Học viên nam tuổi teen trong không gian lớp học",
//     rotate: "3deg",
//     bottom: "18%",
//     left: "34%",
//     z: 17,
//     size: "w-24 h-32 md:w-32 md:h-40",
//   },
//   {
//     src: getPexelsPhoto(29242204, 360, 480),
//     alt: "Lớp học tuổi teen với decor trung tâm ngoại ngữ",
//     rotate: "-5deg",
//     bottom: "9%",
//     left: "53%",
//     z: 20,
//     size: "w-28 h-36 md:w-36 md:h-48",
//   },
//   {
//     src: getPexelsPhoto(32242325, 280, 360),
//     alt: "Học viên tuổi teen tạo dáng trong lớp học",
//     rotate: "10deg",
//     bottom: "4%",
//     left: "30%",
//     z: 11,
//     size: "w-20 h-24 md:w-24 md:h-32",
//   },
//   {
//     src: getPexelsPhoto(34738081, 280, 360),
//     alt: "Nữ sinh tuổi teen Việt Nam ngoài trời",
//     rotate: "-9deg",
//     bottom: "12%",
//     right: "24%",
//     z: 12,
//     size: "w-20 h-24 md:w-24 md:h-32",
//   },
//   {
//     src: getPexelsPhoto(32205080, 280, 360),
//     alt: "Teen Việt Nam ngồi tại hành lang trường",
//     rotate: "7deg",
//     bottom: "0%",
//     right: "6%",
//     z: 18,
//     size: "w-24 h-28 md:w-28 md:h-36",
//   },
//   {
//     src: getPexelsPhoto(32301397, 280, 360),
//     alt: "Teen Việt Nam trong hành lang sáng của trường",
//     rotate: "-3deg",
//     top: "8%",
//     right: "33%",
//     z: 7,
//     size: "w-20 h-24 md:w-24 md:h-28",
//   },
// ];

// const SUCCESS_FLOATING_IMAGES = SUCCESS_IMAGES.map((image, index) => {
//   const layoutOverrides = [
//     { top: "2%", left: "0%" },
//     { top: "0%", right: "1%" },
//     { top: "8%", left: "22%" },
//     { top: "11%", right: "19%" },
//     { top: "23%", left: "8%" },
//     { top: "27%", right: "1%" },
//     { top: "36%", left: "31%" },
//     { top: "43%", left: "1%" },
//     { top: "48%", left: "16%" },
//     { top: "46%", right: "16%" },
//     { bottom: "18%", left: "4%" },
//     { bottom: "16%", left: "35%" },
//     { bottom: "8%", left: "55%" },
//     { bottom: "3%", left: "27%" },
//     { bottom: "11%", right: "22%" },
//     { bottom: "1%", right: "4%" },
//     { top: "7%", right: "36%" },
//   ][index];

//   return layoutOverrides ? { ...image, ...layoutOverrides } : image;
// });

// const AI_FEATURES_FALLBACK = [
//   {
//     title: "Học video siêu ngắn – nhớ lâu (Micro Learning)",
//     desc: "Bài giảng video được chia thành các phần nhỏ chỉ khoảng 15 phút, giúp bạn tiếp thu nhanh và dễ ghi nhớ. Phù hợp cho cả người bận rộn vẫn muốn học mỗi ngày.",
//     icon: <Monitor size={28} className="md:w-8 md:h-8" />,
//     bulletPoints: [
//       "Bài học 3–5 phút",
//       "Dễ học mỗi ngày",
//       "Ghi nhớ hiệu quả hơn",
//     ],
//     mediaUrl:
//       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "AI chấm điểm phát âm",
//     desc: "Công nghệ nhận diện giọng nói AI phân tích từng âm tiết, ngữ điệu và độ trôi chảy. Phản hồi ngay lập tức giúp bạn nói chuẩn như người bản xứ.",
//     icon: <Mic size={28} className="md:w-8 md:h-8" />,
//     bulletPoints: [
//       "Phát hiện lỗi phát âm",
//       "Chấm điểm chi tiết",
//       "Gợi ý cách sửa chuẩn",
//     ],
//     mediaUrl:
//       "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Flashcard & Từ điển thông minh",
//     desc: "Hệ thống flashcard thông minh giúp bạn ghi nhớ từ vựng lâu hơn. Từ điển tích hợp giúp tra nghĩa, ví dụ và cách dùng ngay trong bài học.",
//     icon: <BookOpen size={28} className="md:w-8 md:h-8" />,
//     bulletPoints: [
//       "Ôn tập theo thuật toán nhớ lâu",
//       "Ví dụ thực tế dễ hiểu",
//       "Tra cứu nhanh trong bài học",
//     ],
//     mediaUrl:
//       "https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Kho đề thi đa dạng",
//     desc: "Hệ thống đề thi được xây dựng theo cấu trúc chứng chỉ HSK (Goethe/OSD/TELC). Nội dung cập nhật liên tục để bám sát đề thi thực tế.",
//     icon: <FileText size={28} className="md:w-8 md:h-8" />,
//     bulletPoints: [
//       "Cấu trúc đề thi chuẩn",
//       "Cập nhật thường xuyên",
//       "Luyện thi hiệu quả",
//     ],
//     mediaUrl:
//       "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Dashboard học tập thông minh",
//     desc: "Nền tảng theo dõi tiến độ học tập, phân tích điểm mạnh – điểm yếu và gợi ý lộ trình học phù hợp với từng học viên.",
//     icon: <TrendingUp size={28} className="md:w-8 md:h-8" />,
//     bulletPoints: [
//       "Theo dõi tiến độ học",
//       "Gợi ý bài ôn tập",
//       "Cá nhân hoá lộ trình",
//     ],
//     mediaUrl:
//       "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
//   },
//   {
//     title: "Học như chơi game (Gamified Learning)",
//     desc: "Hệ thống bài tập tương tác sinh động giúp việc học trở nên thú vị và tạo động lực học mỗi ngày.",
//     icon: <Award size={28} className="md:w-8 md:h-8" />,
//     bulletPoints: [
//       "Bài tập tương tác với giáo viên",
//       "Học không nhàm chán",
//       "Tăng động lực học",
//     ],
//     mediaUrl:
//       "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
//   },
// ];

// type AiFeature = (typeof AI_FEATURES_FALLBACK)[number];

// const POPUP_DATA: any = {
//   hsk1: {
//     title: "HSK 1 - Nhập Môn",
//     subtitle: "15 bài tương đương 15 chủ đề cơ bản",
//     description: [
//       "Xây dựng nền tảng từ vựng ~150 từ và ngữ pháp đơn giản.",
//       "Luyện nghe, nói, đọc, viết với các tình huống hàng ngày.",
//     ],
//     stats: { input: "Không yêu cầu", lessons: 15, practices: 30, tests: 10 },
//     syllabus: [
//       {
//         title: "Ngữ pháp",
//         desc: "Các cấu trúc câu đơn giản",
//         icon: <BookOpen className="w-5 h-5 text-slate-600" />,
//       },
//       {
//         title: "Nói",
//         desc: "Chào hỏi, giới thiệu bản thân",
//         icon: <Mic className="w-5 h-5 text-slate-600" />,
//       },
//       {
//         title: "Từ vựng",
//         desc: "Tích luỹ 150 từ vựng cơ bản",
//         icon: <FileText className="w-5 h-5 text-slate-600" />,
//       },
//       {
//         title: "Chữ Hán",
//         desc: "Nhận biết bộ thủ và quy tắc viết",
//         icon: <PenTool className="w-5 h-5 text-slate-600" />,
//       },
//     ],
//   },
//   default: {
//     title: "Chi tiết khóa học",
//     subtitle: "Lộ trình học tập chuẩn HSK",
//     description: [
//       "Phát triển toàn diện 4 kỹ năng Nghe - Nói - Đọc - Viết.",
//       "Luyện thi chứng chỉ HSK với ngân hàng đề thi phong phú.",
//     ],
//     stats: { input: "Theo lộ trình", lessons: 20, practices: 40, tests: 15 },
//     syllabus: [
//       {
//         title: "Chuyên sâu",
//         desc: "Kiến thức nâng cao theo chuyên đề",
//         icon: <BookOpen className="w-5 h-5 text-slate-600" />,
//       },
//       {
//         title: "Thực hành",
//         desc: "Tương tác trực tiếp với giảng viên",
//         icon: <Mic className="w-5 h-5 text-slate-600" />,
//       },
//       {
//         title: "Từ vựng",
//         desc: "Từ vựng chuyên ngành",
//         icon: <FileText className="w-5 h-5 text-slate-600" />,
//       },
//       {
//         title: "Kỹ năng",
//         desc: "Hoàn thiện kỹ năng làm bài thi",
//         icon: <Eye className="w-5 h-5 text-slate-600" />,
//       },
//     ],
//   },
// };

// const STEP_LIBRARY = {
//   hsk1: {
//     id: "hsk1",
//     title: "HSK 1 - Nhập Môn",
//     desc: "Phát âm, Pinyin, 150 từ",
//     icon: "🌱",
//     color: "bg-green-100 text-green-600",
//     months: 2,
//     popup: POPUP_DATA.hsk1,
//     price: 2000000,
//   },
//   hsk2: {
//     id: "hsk2",
//     title: "HSK 2 - Sơ Cấp",
//     desc: "Ngữ pháp cơ bản, 300 từ",
//     icon: "🗣️",
//     color: "bg-blue-100 text-blue-600",
//     months: 2.5,
//     popup: POPUP_DATA.default,
//     price: 2500000,
//   },
//   hsk3: {
//     id: "hsk3",
//     title: "HSK 3 - Trung Cấp",
//     desc: "Giao tiếp thông thường, 600 từ",
//     icon: "📘",
//     color: "bg-indigo-100 text-indigo-600",
//     months: 3,
//     popup: POPUP_DATA.default,
//     price: 3000000,
//   },
//   hsk4: {
//     id: "hsk4",
//     title: "HSK 4 - Nâng Cao",
//     desc: "Thảo luận chủ đề, 1200 từ",
//     icon: "🚀",
//     color: "bg-purple-100 text-purple-600",
//     months: 4,
//     popup: POPUP_DATA.default,
//     price: 4000000,
//   },
//   hsk5: {
//     id: "hsk5",
//     title: "HSK 5 - Cao Cấp",
//     desc: "Đọc báo, xem phim, 2500 từ",
//     icon: "🎓",
//     color: "bg-orange-100 text-orange-600",
//     months: 5,
//     popup: POPUP_DATA.default,
//     price: 5000000,
//   },
//   hsk6: {
//     id: "hsk6",
//     title: "HSK 6 - Thượng Thừa",
//     desc: "Thành thạo như bản xứ",
//     icon: "👑",
//     color: "bg-red-100 text-red-600",
//     months: 6,
//     popup: POPUP_DATA.default,
//     price: 6000000,
//   },
//   goal: {
//     id: "goal",
//     title: "Đích đến: China",
//     desc: "Du học - Việc làm",
//     icon: "⛩️",
//     color: "bg-yellow-100 text-yellow-600",
//     months: 0,
//     popup: null,
//     price: 0,
//   },
// };

// const CURRENT_LEVELS = [
//   { id: "lost", label: "BẮT ĐẦU", sub: "Chưa biết gì" },
//   { id: "hsk1", label: "HSK 1", sub: "Sơ cấp cơ bản" },
//   { id: "hsk2", label: "HSK 2", sub: "Giao tiếp cơ bản" },
//   { id: "hsk3", label: "HSK 3", sub: "Trung cấp" },
//   { id: "hsk4", label: "HSK 4", sub: "Nâng cao" },
// ];

// const TARGET_LEVELS = [
//   { id: "hsk1", label: "HSK 1", sub: "Nhập môn" },
//   { id: "hsk2", label: "HSK 2", sub: "Sơ cấp" },
//   { id: "hsk3", label: "HSK 3", sub: "Trung cấp" },
//   { id: "hsk4", label: "HSK 4", sub: "Nâng cao" },
//   { id: "hsk5", label: "HSK 5", sub: "Cao cấp" },
// ];

// const StepIndicator = ({
//   labels,
//   activeIdx,
//   setActiveIdx,
//   isStepDisabled,
//   disabledMessage,
// }: {
//   labels: string[];
//   activeIdx: number;
//   setActiveIdx: (i: number) => void;
//   isStepDisabled?: (i: number) => boolean;
//   disabledMessage?: string;
// }) => (
//   <div className="hide-scrollbar relative flex items-center justify-between overflow-x-auto rounded-[2rem] border border-white/50 bg-white/40 px-3 py-6 shadow-inner backdrop-blur-sm sm:px-6">
//     <div className="absolute top-[40px] left-6 right-6 h-0.5 min-w-[280px] bg-slate-200/60 sm:left-8 sm:right-8 sm:min-w-[300px]"></div>
//     <div className="flex w-full min-w-[280px] justify-between sm:min-w-[300px]">
//       {labels.map((label, i) => (
//         (() => {
//           const isDisabled = isStepDisabled?.(i) ?? false;
//           const isActive = activeIdx === i;

//           return (
//             <div
//               key={i}
//               onClick={() => {
//                 if (isDisabled) return;
//                 setActiveIdx(i);
//               }}
//               title={isDisabled ? disabledMessage : label}
//               aria-disabled={isDisabled}
//               className={`relative z-10 flex flex-col items-center group px-2 transition-all duration-300 ${isDisabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
//             >
//               <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
//                 <div
//                   className={`relative w-6 h-6 sm:w-8 h-8 rounded-full border-2 transition-all duration-300 flex items-center justify-center shadow-md overflow-hidden ${
//                     isActive
//                       ? "bg-[#ef4444] border-[#c5a059] scale-125 -translate-y-1"
//                       : isDisabled
//                         ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(226,232,240,0.96)_42%,rgba(203,213,225,0.92))] border-slate-200/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_10px_24px_rgba(148,163,184,0.18)] saturate-0"
//                         : "bg-white/80 border-slate-200 group-hover:border-[#ef4444]/30"
//                   }`}
//                 >
//                   {!isActive && isDisabled && (
//                     <>
//                       <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),transparent_38%,rgba(255,255,255,0.4)_62%,transparent)]"></div>
//                       <div className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/70"></div>
//                     </>
//                   )}
//                   {isActive ? (
//                     <Check className="relative z-10 w-3 h-3 sm:w-4 sm:h-4 text-white stroke-[3px]" />
//                   ) : isDisabled ? (
//                     <span className="relative z-10 text-[10px] sm:text-xs text-slate-400">
//                       ❄
//                     </span>
//                   ) : (
//                     <div
//                       className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-colors ${
//                         activeIdx > i ? "bg-[#ef4444]" : "bg-slate-300"
//                       }`}
//                     ></div>
//                   )}
//                 </div>
//                 {isActive && (
//                   <div className="absolute -inset-2 bg-[#ef4444]/10 blur-lg rounded-full animate-pulse"></div>
//                 )}
//               </div>
//               <span
//                 className={`mt-2 sm:mt-3 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center transition-all duration-300 ${
//                   isActive
//                     ? "text-[#ef4444] opacity-100"
//                     : isDisabled
//                       ? "text-slate-300 opacity-100"
//                       : "text-slate-500 opacity-60"
//                 }`}
//               >
//                 {label}
//               </span>
//             </div>
//           );
//         })()
//       ))}
//     </div>
//   </div>
// );

// const StoreBadge = ({
//   platform,
// }: {
//   platform: "ios" | "android";
// }) => {
//   const isIos = platform === "ios";

//   return (
//     <button
//       type="button"
//       aria-label={isIos ? "Tải ứng dụng trên App Store" : "Tải ứng dụng trên Google Play"}
//       className="group relative w-full sm:w-auto sm:min-w-[220px] md:min-w-[236px] overflow-hidden rounded-[1.35rem] border border-white/15 bg-[linear-gradient(180deg,#171717_0%,#020202_100%)] px-4 py-3.5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_24px_48px_rgba(0,0,0,0.34)] active:scale-[0.98]"
//     >
//       <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_52%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100"></span>
//       <span className="absolute inset-[1px] rounded-[1.28rem] border border-white/6"></span>
//       <span className="relative flex items-center gap-3.5">
//         <span className="flex h-10 w-10 shrink-0 items-center justify-center text-white">
//           {isIos ? (
//             <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
//               <path d="M16.365 1.43c0 1.14-.466 2.23-1.204 2.995-.79.814-2.07 1.44-3.19 1.35-.142-1.102.402-2.274 1.135-3.04.805-.834 2.177-1.433 3.259-1.305zM20.94 17.02c-.52 1.18-.77 1.705-1.44 2.73-.93 1.42-2.24 3.19-3.87 3.2-1.45.02-1.82-.95-3.79-.94-1.97.01-2.38.96-3.83.94-1.63-.01-2.87-1.6-3.8-3.01-2.6-3.95-2.87-8.58-1.27-11.04 1.14-1.76 2.95-2.79 4.66-2.79 1.75 0 2.86.96 4.31.96 1.4 0 2.25-.96 4.29-.96 1.52 0 3.13.83 4.27 2.26-3.76 2.06-3.15 7.42.46 8.68z" />
//             </svg>
//           ) : (
//             <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
//               <path fill="#34A853" d="M3.9 2.2c-.3.31-.46.77-.44 1.35v16.9c-.02.58.14 1.04.44 1.35l.07.07 9.46-9.47v-.2L3.97 2.13z" />
//               <path fill="#4285F4" d="m16.58 15.56-3.15-3.16v-.2l3.15-3.16.07.04 3.74 2.13c1.07.61 1.07 1.6 0 2.21l-3.74 2.1z" />
//               <path fill="#FBBC04" d="m16.65 15.52-3.22-3.22-9.53 9.53c.47.5 1.24.56 2.1.07l10.65-6.08" />
//               <path fill="#EA4335" d="M16.65 8.88 6 2.8c-.87-.5-1.64-.43-2.1.07l9.53 9.53 3.22-3.22z" />
//             </svg>
//           )}
//         </span>
//         <span className="min-w-0 text-left leading-none">
//           <span className="block text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
//             {isIos ? "Download on the" : "GET IT ON"}
//           </span>
//           <span className="mt-1 block text-[1.08rem] md:text-[1.22rem] font-semibold tracking-[-0.02em] text-white">
//             {isIos ? "App Store" : "Google Play"}
//           </span>
//         </span>
//       </span>
//     </button>
//   );
// };

// const ReviewCard: React.FC<{ review: any }> = ({ review }) => (
//   <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
//     <div className="flex items-center gap-2 mb-2">
//       <img
//         src={review.avatar}
//         alt={review.name}
//         className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-100 object-cover"
//         loading="lazy"
//       />
//       <div>
//         <div className="flex items-center gap-2">
//           <h4 className="text-xs sm:text-sm font-bold text-[#1a2b48]">
//             {review.name}
//           </h4>
//           <span className="bg-green-50 text-green-600 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded">
//             {review.level}
//           </span>
//         </div>
//         <div className="flex gap-0.5 text-yellow-400">
//           <Star size={9} fill="currentColor" />
//           <Star size={9} fill="currentColor" />
//           <Star size={9} fill="currentColor" />
//           <Star size={9} fill="currentColor" />
//           <Star size={9} fill="currentColor" />
//         </div>
//       </div>
//     </div>
//     <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-snug mb-2 line-clamp-2">
//       {review.text}
//     </p>
//     <div className="flex justify-between items-center pt-1.5 border-t border-slate-50">
//       <div className="flex flex-wrap gap-1">
//         {review.tags.map((tag: string, i: number) => (
//           <span
//             key={i}
//             className="bg-slate-100 text-slate-500 text-[8px] font-bold px-1.5 py-0.5 rounded-md"
//           >
//             {tag}
//           </span>
//         ))}
//       </div>
//       <div className="flex items-center gap-1 text-slate-400 text-[11px]">
//         <Heart size={12} /> {review.likes}
//       </div>
//     </div>
//   </div>
// );

// // --- COMPONENT TUNG HOA CONFETTI ---
// const Confetti = () => {
//   return (
//     <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden rounded-[2rem]">
//       {[...Array(60)].map((_, i) => (
//         <div
//           key={i}
//           className="absolute"
//           style={{
//             left: `${Math.random() * 100}%`,
//             top: `-10%`,
//             width: `${Math.random() * 10 + 5}px`,
//             height: `${Math.random() * 10 + 5}px`,
//             backgroundColor: [
//               "#f59e0b",
//               "#10b981",
//               "#3b82f6",
//               "#ef4444",
//               "#c5a059",
//             ][Math.floor(Math.random() * 5)],
//             animation: `fall ${Math.random() * 2 + 2}s linear forwards`,
//             animationDelay: `${Math.random() * 1}s`,
//             borderRadius: Math.random() > 0.5 ? "50%" : "2px",
//           }}
//         />
//       ))}
//       <style>{`
//         @keyframes fall {
//           0% { transform: translateY(0) rotate(0deg); opacity: 1; }
//           100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// };

// // --- COMPONENT BÀI TẬP NỐI (MATCHING) - CHUẨN XÁC TỌA ĐỘ 100% ---
// const MatchingExercise = ({
//   ex,
//   userMatches,
//   isChecking,
//   matchRightItems,
//   selectedLeftId,
//   selectedRightId,
//   handleSelectLeft,
//   handleSelectRight,
// }: any) => {
//   // Lấy container chính để làm mốc tọa độ
//   const svgContainerRef = useRef<HTMLDivElement>(null);
//   const leftRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
//   const rightRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
//   const [lines, setLines] = useState<any[]>([]);

//   const updateLines = useCallback(() => {
//     if (!svgContainerRef.current) return;
//     // Bắt tọa độ của thẻ bao ngoài SVG (Mốc 0,0 của SVG)
//     const containerRect = svgContainerRef.current.getBoundingClientRect();

//     if (containerRect.width === 0 || containerRect.height === 0) return;

//     const newLines = userMatches
//       .map((match: any) => {
//         // Tham chiếu đúng vào div vòng tròn đánh dấu
//         const leftDot = leftRefs.current[match.left];
//         const rightDot = rightRefs.current[match.right];

//         if (leftDot && rightDot) {
//           const leftRect = leftDot.getBoundingClientRect();
//           const rightRect = rightDot.getBoundingClientRect();

//           let strokeColor = "#ef4444";
//           if (isChecking) {
//             strokeColor = match.left === match.right ? "#22c55e" : "#ef4444";
//           }

//           // Lấy chính xác Tâm của Dấu Chấm Tròn so với Container cha
//           const x1 = leftRect.left + leftRect.width / 2 - containerRect.left;
//           const y1 = leftRect.top + leftRect.height / 2 - containerRect.top;

//           const x2 = rightRect.left + rightRect.width / 2 - containerRect.left;
//           const y2 = rightRect.top + rightRect.height / 2 - containerRect.top;

//           // Tạo đường cong Bezier mềm mại (S-Curve)
//           const offset = Math.abs(x2 - x1) / 2;
//           const path = `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;

//           return { path, color: strokeColor };
//         }
//         return null;
//       })
//       .filter(Boolean);

//     setLines(newLines);
//   }, [userMatches, isChecking]);

//   useEffect(() => {
//     updateLines();
//     const t1 = setTimeout(updateLines, 50);
//     const t2 = setTimeout(updateLines, 200);

//     window.addEventListener("resize", updateLines);
//     window.addEventListener("scroll", updateLines, true);

//     return () => {
//       clearTimeout(t1);
//       clearTimeout(t2);
//       window.removeEventListener("resize", updateLines);
//       window.removeEventListener("scroll", updateLines, true);
//     };
//   }, [updateLines, ex]);

//   return (
//     <div className="w-full bg-white text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl select-none relative">
//       <h3 className="text-lg font-black uppercase mb-6 border-b pb-4 text-center">
//         {ex.question}
//       </h3>

//       {/* Vùng Container chính đặt ref để tính tọa độ */}
//       <div
//         ref={svgContainerRef}
//         className="grid grid-cols-2 gap-12 md:gap-32 relative min-h-[300px]"
//       >
//         <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
//           {lines.map((line, idx) => (
//             <path
//               key={idx}
//               d={line.path}
//               stroke={line.color}
//               strokeWidth="4"
//               fill="none"
//               strokeLinecap="round"
//               className="animate-in fade-in duration-300 drop-shadow-sm"
//             />
//           ))}
//         </svg>

//         {/* Cột trái */}
//         <div className="space-y-4 relative z-20 flex flex-col justify-center">
//           {ex.pairs?.map((item: any) => {
//             const isSelected = selectedLeftId === item.id;
//             const match = userMatches.find((m: any) => m.left === item.id);
//             let statusClass = "border-slate-200 bg-white hover:border-red-200";

//             if (isChecking) {
//               if (match && match.left === match.right)
//                 statusClass = "border-green-500 bg-green-50 text-green-700";
//               else statusClass = "border-red-400 bg-red-50 text-red-700";
//             } else if (isSelected)
//               statusClass = "border-[#ef4444] ring-2 ring-[#ef4444] bg-red-50";
//             else if (match)
//               statusClass = "border-[#ef4444] bg-slate-50 opacity-90";

//             return (
//               <button
//                 type="button"
//                 key={item.id}
//                 onClick={() => handleSelectLeft(item.id)}
//                 disabled={isChecking}
//                 className={`w-full min-h-[60px] p-3 rounded-xl border-2 text-center font-bold text-sm md:text-lg transition-all overflow-visible relative shadow-sm ${statusClass}`}
//               >
//                 {item.left}
//                 <div
//                   ref={(el) => (leftRefs.current[item.id] = el)}
//                   className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-200 rounded-full translate-x-1/2 border-2 border-white shadow-sm z-30 flex items-center justify-center"
//                 >
//                   <div
//                     className={`w-1.5 h-1.5 rounded-full ${isSelected || match ? "bg-[#ef4444]" : "bg-transparent"}`}
//                   ></div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>

//         {/* Cột phải */}
//         <div className="space-y-4 relative z-20 flex flex-col justify-center">
//           {matchRightItems?.map((item: any) => {
//             const isSelected = selectedRightId === item.id;
//             const match = userMatches.find((m: any) => m.right === item.id);
//             let statusClass =
//               "border-slate-200 border-dashed bg-white hover:border-red-200";

//             if (isChecking) {
//               if (match && match.left === match.right)
//                 statusClass =
//                   "border-green-500 border-solid bg-green-50 text-green-700";
//               else
//                 statusClass =
//                   "border-red-400 border-solid bg-red-50 text-red-700";
//             } else if (isSelected)
//               statusClass =
//                 "border-[#ef4444] border-solid ring-2 ring-[#ef4444] bg-red-50";
//             else if (match)
//               statusClass =
//                 "border-[#ef4444] border-solid bg-slate-50 opacity-90";

//             return (
//               <button
//                 type="button"
//                 key={item.id}
//                 onClick={() => handleSelectRight(item.id)}
//                 disabled={isChecking}
//                 className={`w-full min-h-[60px] p-3 rounded-xl border-2 text-center font-bold text-sm transition-all overflow-visible relative shadow-sm ${statusClass}`}
//               >
//                 <div
//                   ref={(el) => (rightRefs.current[item.id] = el)}
//                   className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-200 rounded-full -translate-x-1/2 border-2 border-white shadow-sm z-30 flex items-center justify-center"
//                 >
//                   <div
//                     className={`w-1.5 h-1.5 rounded-full ${isSelected || match ? "bg-[#ef4444]" : "bg-transparent"}`}
//                   ></div>
//                 </div>
//                 {item.right}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- COMPONENT CHÍNH ---
// const ChineseHome: React.FC = () => {
//   const navigate = useNavigate();
//   const { openConsultation } = useConsultationModal();
//   const [isPlayingHeroVideo, setIsPlayingHeroVideo] = useState(false);
//   const [heroVideoConfig, setHeroVideoConfig] =
//     useState<HomeVideoConfig | null>(null);
//   const hasAutoStartedHeroVideoRef = useRef(false);
//   const heroVideoStartModeRef = useRef<"auto" | "manual" | null>(null);

//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [targetLevel, setTargetLevel] = useState(1);
//   const [selectedStep, setSelectedStep] = useState<any>(null);
//   const [promoPackages, setPromoPackages] = useState<ProductPackage[]>([]);
//   const [isLoadingPromoPackages, setIsLoadingPromoPackages] = useState(true);
//   const [trialLessons, setTrialLessons] = useState<TrialLessonPreview[]>([]);
//   const [loadingTrials, setLoadingTrials] = useState(false);
//   const [isPlayingTrialVideo, setIsPlayingTrialVideo] = useState(false);
//   const [showRoadmap, setShowRoadmap] = useState(true);
//   const [selectedRoadmapAddOns, setSelectedRoadmapAddOns] = useState<
//     CourseRoadmapAddOnSelection[]
//   >([]);
//   const [roadmapQuoteError, setRoadmapQuoteError] = useState<string | null>(
//     null,
//   );
//   const [popupBannerNotification, setPopupBannerNotification] =
//     useState<InAppNotification | null>(null);

//   // AI feature slider
//   const heroSectionRef = useRef<HTMLElement>(null);
//   const roadmapSectionRef = useRef<HTMLElement>(null);
//   const [isHeroBannerInView, setIsHeroBannerInView] = useState(true);
//   const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);
//   const [touchStartX, setTouchStartX] = useState(0);
//   const [aiFeatures, setAiFeatures] = useState<AiFeature[]>(
//     AI_FEATURES_FALLBACK,
//   );
//   const featureCount = aiFeatures.length;

//   // Refs cuộn TEACHER
//   const teacherSectionRef = useRef<HTMLDivElement>(null);
//   const [activeTeacherIdx, setActiveTeacherIdx] = useState(0);
//   const activeTeacherIdxRef = useRef(0);
//   const isTeacherScrollingRef = useRef(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [startY, setStartY] = useState(0);
//   const [touchTeacherStartX, setTouchTeacherStartX] = useState(0);

//   // --- STATE DEMO HỌC TẬP TƯƠNG TÁC ---
//   const [activeDemoTab, setActiveDemoTab] = useState<
//     "pronunciation" | "writing" | "exercise" | "trial-video"
//   >("pronunciation");
//   const [currentEx, setCurrentEx] = useState(0);

//   // AI Pronunciation State
//   const targetText = "你好"; // Xin chào (Trung)
//   const [isRecording, setIsRecording] = useState(false);
//   const [hasRecorded, setHasRecorded] = useState(false);
//   const [isEvaluating, setIsEvaluating] = useState(false);
//   const [evaluationResult, setEvaluationResult] =
//     useState<PronunciationErrorReport | null>(null);
//   const [pronunciationError, setPronunciationError] = useState<string | null>(
//     null,
//   );
//   const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
//   const [isPlayingRecordedAudio, setIsPlayingRecordedAudio] = useState(false);
//   const wavRecordingRef = useRef<WavRecordingSession | null>(null);
//   const recordedAudioRef = useRef<HTMLAudioElement | null>(null);

//   // State Exercise
//   const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
//   const [orderedWords, setOrderedWords] = useState<
//     { id: string; text: string }[]
//   >([]);
//   const [availableWords, setAvailableWords] = useState<
//     { id: string; text: string }[]
//   >([]);
//   const [fillAnswer, setFillAnswer] = useState("");

//   // State Matching
//   const [userMatches, setUserMatches] = useState<
//     { left: string; right: string }[]
//   >([]);
//   const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
//   const [selectedRightId, setSelectedRightId] = useState<string | null>(null);

//   const [isChecking, setIsChecking] = useState(false);
//   const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
//   const [isCompleted, setIsCompleted] = useState(false);

//   useEffect(() => {
//     return () => {
//       if (recordedAudioUrl) {
//         URL.revokeObjectURL(recordedAudioUrl);
//       }
//     };
//   }, [recordedAudioUrl]);

//   // State Vẽ Hán Tự
//   useEffect(() => {
//     const fetchPromoPackages = async () => {
//       try {
//         setIsLoadingPromoPackages(true);
//         const res = await api.get<ProductPackage[]>("/api/product-packages");
//         setPromoPackages(res.data.filter((pkg) => pkg.language === "CHINESE"));
//       } catch (err) {
//       } finally {
//         setIsLoadingPromoPackages(false);
//       }
//     };
//     fetchPromoPackages();
//   }, []);

//   useEffect(() => {
//     const fetchHeroVideoConfig = async () => {
//       try {
//         const config = await getHomeVideoConfig("CHINESE");
//         setHeroVideoConfig(config);
//       } catch (error) {}
//     };
//     fetchHeroVideoConfig();
//   }, []);

//   useEffect(() => {
//     const heroSection = heroSectionRef.current;

//     if (!heroSection || typeof IntersectionObserver === "undefined") {
//       return;
//     }

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         setIsHeroBannerInView(
//           entry.isIntersecting && entry.intersectionRatio >= 0.35,
//         );
//       },
//       {
//         threshold: [0, 0.2, 0.35, 0.6],
//         rootMargin: "0px 0px -10% 0px",
//       },
//     );

//     observer.observe(heroSection);

//     return () => observer.disconnect();
//   }, []);

//   useEffect(() => {
//     if (
//       !heroVideoConfig?.vimeoId ||
//       heroVideoConfig.autoPlay === false ||
//       hasAutoStartedHeroVideoRef.current
//     ) {
//       return;
//     }

//     const autoplayTimer = window.setTimeout(() => {
//       hasAutoStartedHeroVideoRef.current = true;
//       heroVideoStartModeRef.current = "auto";
//       setIsPlayingHeroVideo(true);
//     }, 1000);

//     return () => window.clearTimeout(autoplayTimer);
//   }, [heroVideoConfig]);

//   useEffect(() => {
//     let isActive = true;

//     const fetchHomeTrialLessons = async () => {
//       setLoadingTrials(true);
//       try {
//         const lessons = await fetchTrialLessons(Language.CHINESE);

//         if (!isActive) {
//           return;
//         }

//         setTrialLessons(lessons);
//         setIsPlayingTrialVideo(false);
//       } catch (error) {
//         console.error("Failed to fetch Chinese home trial lessons", error);

//         if (!isActive) {
//           return;
//         }

//         setTrialLessons([]);
//         setIsPlayingTrialVideo(false);
//       } finally {
//         if (isActive) {
//           setLoadingTrials(false);
//         }
//       }
//     };

//     void fetchHomeTrialLessons();

//     return () => {
//       isActive = false;
//     };
//   }, []);

//   // Update Available Words dynamically khi thay đổi câu "order"
//   useEffect(() => {
//     const ex = EXERCISES[currentEx];
//     if (ex?.type === "order" && ex.words) {
//       setAvailableWords(ex.words.map((w, i) => ({ id: String(i), text: w })));
//     } else {
//       setAvailableWords([]);
//     }
//   }, [currentEx]);

//   useEffect(() => {
//     let isActive = true;

//     const loadPopupBanner = async () => {
//       try {
//         const token = getStoredToken();
//         const { notification: nextNotification, source } =
//           await loadPopupBannerNotification({
//             audience: token ? "authenticated" : "guest",
//           });

//         if (!isActive || !nextNotification) {
//           return;
//         }

//         setPopupBannerNotification(nextNotification);

//         if (token && source === "api" && !nextNotification.read) {
//           void markNotificationAsRead(nextNotification.id).catch((error) => {
//             console.error("Failed to mark popup banner as read", error);
//           });
//         }
//       } catch (error) {
//         console.error("Failed to load popup banner notifications", error);
//       }
//     };

//     const popupBannerTimer = window.setTimeout(() => {
//       if (!isActive) {
//         return;
//       }

//       void loadPopupBanner();
//     }, 10000);

//     return () => {
//       isActive = false;
//       window.clearTimeout(popupBannerTimer);
//     };
//   }, []);

//   useEffect(() => {
//     let ignore = false;

//     const loadAiFeatures = async () => {
//       try {
//         const featureItems = await getImageTextSectionConfig("CHINESE");

//         if (ignore || featureItems.length === 0) {
//           return;
//         }

//         setAiFeatures(
//           mergeImageTextSectionFallback(
//             AI_FEATURES_FALLBACK,
//             featureItems,
//             getSafeMediaUrl,
//           ),
//         );
//       } catch (error) {
//         console.error("Failed to fetch AI feature section config", error);
//       }
//     };

//     void loadAiFeatures();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   // Sinh mảng Right ngẫu nhiên cho bài Matching
//   const matchRightItems = useMemo(() => {
//     if (EXERCISES[currentEx]?.type === "match") {
//       return [...EXERCISES[currentEx].pairs!].sort(() => Math.random() - 0.5);
//     }
//     return [];
//   }, [currentEx]);

//   const showPrevFeature = () => {
//     if (featureCount <= 1) {
//       return;
//     }

//     setActiveFeatureIdx((prev) => (prev - 1 + featureCount) % featureCount);
//   };

//   const showNextFeature = () => {
//     if (featureCount <= 1) {
//       return;
//     }

//     setActiveFeatureIdx((prev) => (prev + 1) % featureCount);
//   };

//   useEffect(() => {
//     if (featureCount <= 1) {
//       return;
//     }

//     const autoplayTimer = window.setTimeout(() => {
//       showNextFeature();
//     }, 3000);

//     return () => window.clearTimeout(autoplayTimer);
//   }, [activeFeatureIdx, featureCount]);

//   const handleFeatureTouchStart = (e: React.TouchEvent) =>
//     setTouchStartX(e.touches[0].clientX);
//   const handleFeatureTouchEnd = (e: React.TouchEvent) => {
//     const touchEndX = e.changedTouches[0].clientX;
//     const deltaX = touchStartX - touchEndX;
//     if (deltaX > 30) {
//       showNextFeature();
//     } else if (deltaX < -30) {
//       showPrevFeature();
//     }
//   };

//   // ==========================================
//   // SCROLL LOGIC: TEACHER CAROUSEL
//   // ==========================================
//   useEffect(() => {
//     activeTeacherIdxRef.current = activeTeacherIdx;
//   }, [activeTeacherIdx]);

//   useEffect(() => {
//     const container = teacherSectionRef.current;
//     if (!container) return;
//     const handleTeacherWheel = (e: WheelEvent) => {
//       if (window.innerWidth < 1024) return;
//       const isScrollingDown = e.deltaY > 0;
//       if (!isScrollingDown && activeTeacherIdxRef.current === 0) return;
//       if (
//         isScrollingDown &&
//         activeTeacherIdxRef.current === TEACHERS.length - 1
//       )
//         return;
//       e.preventDefault();
//       if (isTeacherScrollingRef.current) return;
//       isTeacherScrollingRef.current = true;
//       if (isScrollingDown) setActiveTeacherIdx((prev) => prev + 1);
//       else setActiveTeacherIdx((prev) => prev - 1);
//       setTimeout(() => {
//         isTeacherScrollingRef.current = false;
//       }, 800);
//     };
//     container.addEventListener("wheel", handleTeacherWheel, { passive: false });
//     return () => container.removeEventListener("wheel", handleTeacherWheel);
//   }, []);

//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDragging(true);
//     setStartY(e.clientX);
//   };
//   const handleMouseMoveDrag = (e: React.MouseEvent) => {
//     if (!isDragging) return;
//     const deltaX = startY - e.clientX;
//     if (deltaX > 50 && activeTeacherIdx < TEACHERS.length - 1) {
//       setActiveTeacherIdx((prev) => prev + 1);
//       setIsDragging(false);
//     } else if (deltaX < -50 && activeTeacherIdx > 0) {
//       setActiveTeacherIdx((prev) => prev - 1);
//       setIsDragging(false);
//     }
//   };
//   const handleMouseUp = () => setIsDragging(false);
//   const handleTeacherTouchStart = (e: React.TouchEvent) =>
//     setTouchTeacherStartX(e.touches[0].clientX);
//   const handleTeacherTouchEnd = (e: React.TouchEvent) => {
//     const deltaX = touchTeacherStartX - e.changedTouches[0].clientX;
//     if (deltaX > 30 && activeTeacherIdx < TEACHERS.length - 1)
//       setActiveTeacherIdx((prev) => prev + 1);
//     else if (deltaX < -30 && activeTeacherIdx > 0)
//       setActiveTeacherIdx((prev) => prev - 1);
//   };

//   const getCardStyle = (index: number) => {
//     const offset = index - activeTeacherIdx;
//     const isMobile = window.innerWidth < 1024;

//     if (offset === 0) {
//       return {
//         transform: "scale(1) translateX(0px)",
//         zIndex: 30,
//         opacity: 1,
//         filter: "none",
//       };
//     }

//     const translateX = isMobile ? 80 : 180;
//     const scale = 0.85;
//     const rotate = 4;

//     if (offset === -1) {
//       return {
//         transform: `translateX(-${translateX}px) scale(${scale}) rotate(-${rotate}deg)`,
//         zIndex: 10,
//         opacity: 0.5,
//         filter: "blur(2px)",
//         pointerEvents: "none" as any,
//       };
//     }
//     if (offset === 1) {
//       return {
//         transform: `translateX(${translateX}px) scale(${scale}) rotate(${rotate}deg)`,
//         zIndex: 10,
//         opacity: 0.5,
//         filter: "blur(2px)",
//         pointerEvents: "none" as any,
//       };
//     }

//     if (offset <= -2) {
//       return {
//         transform: `translateX(-${translateX * 1.5}px) scale(${scale - 0.1})`,
//         zIndex: 0,
//         opacity: 0,
//         pointerEvents: "none" as any,
//       };
//     }
//     if (offset >= 2) {
//       return {
//         transform: `translateX(${translateX * 1.5}px) scale(${scale - 0.1})`,
//         zIndex: 0,
//         opacity: 0,
//         pointerEvents: "none" as any,
//       };
//     }

//     return { opacity: 0, zIndex: 0, pointerEvents: "none" as any };
//   };

//   const playSound = (correct: boolean) => {
//     try {
//       const audio = new Audio(
//         correct
//           ? "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3"
//           : "https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3",
//       );
//       audio.volume = 0.5;
//       audio.play().catch((e) => console.log("Browser blocked audio play"));
//     } catch (e) {}
//   };

//   // --- LOGIC VẼ CHỮ HÁN ---
//   const handleTabChange = (
//     tab: "pronunciation" | "writing" | "exercise" | "trial-video",
//   ) => {
//     setActiveDemoTab(tab);
//     resetExState(0);
//     setCurrentEx(0);
//     setIsCompleted(false);
//     setIsPlayingHeroVideo(false);
//     setIsPlayingTrialVideo(false);
//   };

//   // --- LOGIC GHI ÂM (PRONUNCIATION VỚI API PHÒNG NÓI ẢO) ---
//   const startRecording = async () => {
//     if (isRecording) return;

//     try {
//       recordedAudioRef.current?.pause();
//       if (recordedAudioRef.current) {
//         recordedAudioRef.current.currentTime = 0;
//       }
//       setIsPlayingRecordedAudio(false);
//       setRecordedAudioUrl(null);
//       setPronunciationError(null);
//       setEvaluationResult(null);
//       wavRecordingRef.current = await startWavRecordingSession();
//       setIsRecording(true);
//       setHasRecorded(false);
//     } catch (err) {
//       console.error("Microphone error:", err);
//       setPronunciationError("Vui lòng cấp quyền truy cập microphone.");
//       alert("Vui lòng cấp quyền truy cập Microphone.");
//     }
//   };

//   const stopRecording = async () => {
//     const currentSession = wavRecordingRef.current;

//     if (!currentSession || !isRecording) {
//       return;
//     }

//     wavRecordingRef.current = null;
//     setIsEvaluating(true);
//     setIsRecording(false);
//     setHasRecorded(true);

//     try {
//       const audioFile = await stopWavRecordingSession(
//         currentSession,
//         "pronunciation-cn.wav",
//       );
//       setRecordedAudioUrl(URL.createObjectURL(audioFile));
//       await evaluatePronunciation(audioFile);
//     } catch (error) {
//       console.error("Recorder Error:", error);
//       setEvaluationResult(null);
//       setPronunciationError(
//         getUserFacingErrorMessage(
//           error,
//           "Không thể xử lý bản ghi âm lúc này. Vui lòng thử lại.",
//         ),
//       );
//       setIsEvaluating(false);
//     }
//   };

//   const evaluatePronunciation = async (audioFile: File) => {
//     try {
//       const result = await assessPronunciation({
//         audioFile,
//         referenceText: targetText,
//         language: "zh-CN",
//         recordingType: "WORD",
//       });
//       setPronunciationError(null);
//       setEvaluationResult(result);
//     } catch (error) {
//       console.error("API Error:", error);
//       setEvaluationResult(null);
//       setPronunciationError(
//         getUserFacingErrorMessage(
//           error,
//           "Không thể chấm phát âm lúc này. Vui lòng thử lại.",
//         ),
//       );
//       return;
//       /*
//       // MOCK DATA NẾU LỖI
//       setEvaluationResult({
//         overallScore: 92,
//         accuracyScore: 95,
//         fluencyScore: 88,
//         completenessScore: 100,
//         wordFeedbacks: [
//           { word: "你", score: 98, errorType: "None" },
//           { word: "好", score: 85, errorType: "None" },
//         ],
//       });
//       */
//     } finally {
//       setIsEvaluating(false);
//     }
//   };

//   const retryPronunciation = () => {
//     recordedAudioRef.current?.pause();
//     if (recordedAudioRef.current) {
//       recordedAudioRef.current.currentTime = 0;
//     }
//     setHasRecorded(false);
//     setIsPlayingRecordedAudio(false);
//     setRecordedAudioUrl(null);
//     setEvaluationResult(null);
//     setPronunciationError(null);
//     setIsRecording(false);
//   };

//   const toggleRecordedAudioPlayback = async () => {
//     const audio = recordedAudioRef.current;

//     if (!audio || !recordedAudioUrl) {
//       return;
//     }

//     if (audio.paused) {
//       try {
//         await audio.play();
//         setIsPlayingRecordedAudio(true);
//       } catch (error) {
//         console.error("Playback Error:", error);
//         setPronunciationError("Không thể phát lại bản ghi âm lúc này.");
//       }
//       return;
//     }

//     audio.pause();
//     setIsPlayingRecordedAudio(false);
//   };

//   // --- LOGIC BÀI TẬP DEMO ---
//   const resetExState = (nextIndex = currentEx) => {
//     setSelectedOpt(null);
//     setFillAnswer("");
//     setUserMatches([]);
//     setSelectedLeftId(null);
//     setSelectedRightId(null);
//     setOrderedWords([]);
//     setIsChecking(false);
//     setIsCorrect(null);

//     const ex = EXERCISES[nextIndex];
//     if (ex?.type === "order" && ex.words) {
//       setAvailableWords(ex.words.map((w, i) => ({ id: String(i), text: w })));
//     } else {
//       setAvailableWords([]);
//     }
//   };

//   const handleMatch = (leftId: string, rightId: string) => {
//     setUserMatches((prev) => {
//       const clean = prev.filter(
//         (m) => m.left !== leftId && m.right !== rightId,
//       );
//       return [...clean, { left: leftId, right: rightId }];
//     });
//     setSelectedLeftId(null);
//     setSelectedRightId(null);
//   };

//   const handleSelectLeft = (id: string) => {
//     if (isChecking) return;
//     if (userMatches.some((m) => m.left === id))
//       setUserMatches((prev) => prev.filter((m) => m.left !== id));
//     if (selectedRightId) handleMatch(id, selectedRightId);
//     else setSelectedLeftId(selectedLeftId === id ? null : id);
//   };

//   const handleSelectRight = (id: string) => {
//     if (isChecking) return;
//     if (userMatches.some((m) => m.right === id))
//       setUserMatches((prev) => prev.filter((m) => m.right !== id));
//     if (selectedLeftId) handleMatch(selectedLeftId, id);
//     else setSelectedRightId(selectedRightId === id ? null : id);
//   };

//   const handleCheckAnswer = () => {
//     setIsChecking(true);
//     const ex = EXERCISES[currentEx];
//     let correct = false;

//     if (
//       ex.type === "multiple_choice" ||
//       ex.type === "listen" ||
//       ex.type === "mcq_sentence" ||
//       ex.type === "multiple_choice_image"
//     ) {
//       correct = selectedOpt === ex.correct;
//     } else if (ex.type === "order") {
//       correct = orderedWords.map((w) => w.text).join(" ") === ex.target;
//     } else if (ex.type === "match") {
//       if (ex.pairs) {
//         correct =
//           userMatches.length === ex.pairs.length &&
//           userMatches.every((m) => m.left === m.right);
//       }
//     } else if (ex.type === "fill") {
//       correct =
//         fillAnswer.trim().toLowerCase() === String(ex.correct).toLowerCase();
//     }

//     setIsCorrect(correct);
//     playSound(correct);
//   };

//   const handleNextExercise = () => {
//     if (currentEx < EXERCISES.length - 1) {
//       const nextIdx = currentEx + 1;
//       setCurrentEx(nextIdx);
//       resetExState(nextIdx);
//     } else {
//       setIsCompleted(true);
//       playSound(true); // Nhạc chiến thắng khi xong bài
//     }
//   };

//   // --- LẤY TRẠNG THÁI NÚT CHECK CHO CHÍNH XÁC ---
//   const isBtnDisabled = useMemo(() => {
//     const ex = EXERCISES[currentEx];
//     if (!ex) return true;
//     if (
//       ex.type === "multiple_choice" ||
//       ex.type === "listen" ||
//       ex.type === "mcq_sentence" ||
//       ex.type === "multiple_choice_image" ||
//       ex.type === "mcq"
//     ) {
//       return selectedOpt === null;
//     }
//     if (ex.type === "order") return orderedWords.length === 0;
//     if (ex.type === "match")
//       return userMatches.length !== (ex.pairs?.length || 0);
//     if (ex.type === "fill") return fillAnswer.trim() === "";
//     return true;
//   }, [currentEx, selectedOpt, orderedWords, userMatches, fillAnswer]);

//   // --- RENDER BÀI TẬP ---
//   const renderExerciseContent = () => {
//     const ex = EXERCISES[currentEx];

//     // MCQ / LISTEN / MCQ_SENTENCE
//     if (
//       ex.type === "multiple_choice" ||
//       ex.type === "listen" ||
//       ex.type === "mcq_sentence"
//     ) {
//       return (
//         <div className="w-full flex flex-col md:flex-row gap-6 items-stretch bg-white/30 backdrop-blur-md text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl">
//           {/* Box Trái (Hình ảnh / Audio) */}
//           {(ex.image || ex.audio) && (
//             <div className="w-full md:w-5/12 flex-shrink-0 flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100 relative">
//               {ex.image && (
//                 <div className="relative w-full h-32 md:h-full max-h-[160px]">
//                   <img
//                     src={ex.image}
//                     alt="exercise hint"
//                     className="w-full h-full object-cover rounded-xl shadow-sm"
//                   />
//                   {ex.audio && (
//                     <button
//                       type="button"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         playTTS(ex.audioText || ex.question);
//                       }}
//                       className="absolute inset-0 m-auto w-12 h-12 bg-[#ef4444]/90 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform backdrop-blur-sm animate-pulse"
//                     >
//                       <Volume2 size={24} />
//                     </button>
//                   )}
//                 </div>
//               )}
//               {!ex.image && ex.audio && (
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     playTTS(ex.audioText || ex.question);
//                   }}
//                   className="w-20 h-20 bg-[#ef4444] text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg animate-pulse"
//                 >
//                   <Volume2 size={36} />
//                 </button>
//               )}
//             </div>
//           )}

//           {/* Box Phải (Câu hỏi + Đáp án) */}
//           <div className="w-full flex-1 flex flex-col justify-center">
//             <h4 className="font-black text-[#1a2b48] text-lg md:text-xl mb-4 whitespace-pre-line">
//               {ex.question}
//               {ex.options?.some((o) => o.includes("Vietnam")) && (
//                 <span className="block font-normal text-sm text-slate-500 mt-1">
//                   Chọn từ vào chỗ trống
//                 </span>
//               )}
//             </h4>

//             <div
//               className={`grid ${ex.options && ex.options.length > 2 ? "grid-cols-1" : "grid-cols-2"} gap-3`}
//             >
//               {ex.options?.map((opt, idx) => {
//                 const isSelected = selectedOpt === idx;
//                 let btnClass = "border-slate-200 bg-white hover:bg-slate-50";
//                 if (isChecking) {
//                   if (idx === ex.correct)
//                     btnClass = "border-green-500 bg-green-50 text-green-700";
//                   else if (isSelected)
//                     btnClass = "border-red-500 bg-red-50 text-red-700";
//                 } else if (isSelected)
//                   btnClass = "border-[#ef4444] bg-red-50 ring-1 ring-[#ef4444]";

//                 return (
//                   <button
//                     type="button"
//                     key={idx}
//                     onClick={() => {
//                       !isChecking && setSelectedOpt(idx);
//                       if (ex.readOptions) playTTS(opt);
//                     }}
//                     disabled={isChecking}
//                     className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all flex items-center gap-3 ${btnClass}`}
//                   >
//                     <span
//                       className={`w-7 h-7 rounded flex items-center justify-center text-xs shrink-0 ${isSelected && !isChecking ? "bg-[#ef4444] text-white" : "bg-slate-100 text-slate-500"}`}
//                     >
//                       {String.fromCharCode(65 + idx)}
//                     </span>
//                     {opt}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     // MULTIPLE CHOICE IMAGE (Cà phê / Trà)
//     if (ex.type === "multiple_choice_image") {
//       return (
//         <div className="w-full bg-white/30 backdrop-blur-md text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl">
//           <h4 className="font-black text-[#1a2b48] text-lg md:text-xl mb-6 text-center">
//             {ex.question}
//           </h4>
//           <div className="grid grid-cols-3 gap-4">
//             {ex.options?.map((opt: any, idx) => {
//               const isSelected = selectedOpt === idx;
//               let btnClass = "border-slate-200 bg-white/30 backdrop-blur-md hover:border-red-200";
//               if (isChecking) {
//                 if (idx === ex.correct)
//                   btnClass = "border-green-500 bg-green-50 text-green-700";
//                 else if (isSelected)
//                   btnClass = "border-red-500 bg-red-50 text-red-700";
//               } else if (isSelected)
//                 btnClass = "border-[#ef4444] bg-red-50 ring-2 ring-[#ef4444]";

//               return (
//                 <button
//                   type="button"
//                   key={idx}
//                   onClick={() => !isChecking && setSelectedOpt(idx)}
//                   disabled={isChecking}
//                   className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${btnClass}`}
//                 >
//                   <img
//                     src={opt.img}
//                     alt={opt.text}
//                     className="w-20 h-20 md:w-28 md:h-28 object-cover rounded-xl mb-3 shadow-sm"
//                   />
//                   <span className="font-black text-xl md:text-2xl">
//                     {opt.text}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       );
//     }

//     // --- GỌI TÁCH COMPONENT CHO PHẦN MATCHING (TRÁNH LỖI HOOKS) ---
//     if (ex.type === "match") {
//       return (
//         <MatchingExercise
//           ex={ex}
//           userMatches={userMatches}
//           isChecking={isChecking}
//           matchRightItems={matchRightItems}
//           selectedLeftId={selectedLeftId}
//           selectedRightId={selectedRightId}
//           handleSelectLeft={handleSelectLeft}
//           handleSelectRight={handleSelectRight}
//         />
//       );
//     }

//     if (ex.type === "order") {
//       return (
//         <div className="w-full bg-white/30 backdrop-blur-md text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl">
//           <h3 className="text-lg font-black uppercase mb-2 text-center flex items-center justify-center gap-3">
//             {ex.audio && (
//               <button
//                 type="button"
//                 onClick={() => playTTS(ex.audioText || "")}
//                 className="p-1.5 bg-[#ef4444] text-white rounded-full hover:scale-110 transition-transform"
//               >
//                 <Volume2 size={16} />
//               </button>
//             )}
//             {ex.question}
//           </h3>
//           <p className="text-slate-500 font-medium text-sm mb-6 border-b pb-4 text-center">
//             Bấm vào từ để sắp xếp
//           </p>
//           <div className="min-h-[80px] bg-slate-50 p-4 md:p-6 rounded-2xl flex flex-wrap gap-2 md:gap-3 mb-4 border-2 border-dashed border-slate-300 items-center justify-center shadow-inner">
//             {orderedWords.length === 0 && (
//               <span className="text-slate-400 text-sm font-medium">
//                 Chưa có từ nào...
//               </span>
//             )}
//             {orderedWords.map((w, idx) => (
//               <button
//                 type="button"
//                 key={idx}
//                 disabled={isChecking}
//                 onClick={() => {
//                   setOrderedWords(orderedWords.filter((_, i) => i !== idx));
//                   setAvailableWords([...availableWords, w]);
//                   setIsChecking(false);
//                   setIsCorrect(null);
//                 }}
//                 className="bg-[#ef4444] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-red-700 transition-colors animate-in zoom-in duration-200"
//               >
//                 {w.text}
//               </button>
//             ))}
//           </div>
//           <div className="flex flex-wrap gap-3 justify-center border-t border-slate-100 pt-6">
//             {availableWords.map((w, idx) => (
//               <button
//                 type="button"
//                 key={idx}
//                 disabled={isChecking}
//                 onClick={() => {
//                   setAvailableWords(availableWords.filter((_, i) => i !== idx));
//                   setOrderedWords([...orderedWords, w]);
//                   setIsChecking(false);
//                   setIsCorrect(null);
//                 }}
//                 className="bg-white border-2 border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:border-[#ef4444] hover:text-[#ef4444] transition-all hover:-translate-y-1"
//               >
//                 {w.text}
//               </button>
//             ))}
//           </div>
//         </div>
//       );
//     }

//     if (ex.type === "fill") {
//       const sentenceParts = (ex.sentence || "").split("___");
//       return (
//         <div className="w-full bg-white text-[#1a2b48] shadow-sm p-4 md:p-6 border border-slate-200 rounded-2xl">
//           <h3 className="text-lg font-black uppercase mb-6 border-b pb-4 whitespace-pre-line">
//             {ex.question}
//           </h3>

//           <div className="text-xl font-medium flex items-center flex-wrap gap-2 leading-loose text-center justify-center my-8">
//             {sentenceParts.map((part, i) => (
//               <React.Fragment key={i}>
//                 <span>{part}</span>
//                 {i < sentenceParts.length - 1 && (
//                   <input
//                     type="text"
//                     value={fillAnswer}
//                     onChange={(e) => {
//                       setFillAnswer(e.target.value);
//                       setIsChecking(false);
//                       setIsCorrect(null);
//                     }}
//                     disabled={isChecking}
//                     className={`mx-2 px-3 py-1 border-b-2 outline-none w-32 text-center transition-colors ${isChecking ? (isCorrect ? "border-green-500 text-green-600 bg-green-50 rounded-lg" : "border-red-500 text-red-600 bg-red-50 rounded-lg") : "border-[#dfc38a] focus:border-[#1a2b48]"}`}
//                   />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>

//           {ex.hint && (
//             <p className="text-sm text-slate-500 mt-6 italic text-center">
//               {ex.hint}
//             </p>
//           )}
//         </div>
//       );
//     }
//     return null;
//   };

//   const getRoadmap = () => {
//     const start = currentLevel;
//     const end = targetLevel + 1;
//     if (start >= end) {
//       return {
//         steps: [],
//         totalMonths: 0,
//         error: "Mục tiêu phải cao hơn trình độ hiện tại của bạn.",
//         totalPrice: 0,
//         requiredTags: [],
//       };
//     }
//     const steps = [];
//     const requiredTags: string[] = [];
//     let totalMonths = 0;
//     if (start < 1 && end >= 1) {
//       steps.push(STEP_LIBRARY.hsk1);
//       requiredTags.push("HSK1");
//       totalMonths += STEP_LIBRARY.hsk1.months;
//     }
//     if (start < 2 && end >= 2) {
//       steps.push(STEP_LIBRARY.hsk2);
//       requiredTags.push("HSK2");
//       totalMonths += STEP_LIBRARY.hsk2.months;
//     }
//     if (start < 3 && end >= 3) {
//       steps.push(STEP_LIBRARY.hsk3);
//       requiredTags.push("HSK3");
//       totalMonths += STEP_LIBRARY.hsk3.months;
//     }
//     if (start < 4 && end >= 4) {
//       steps.push(STEP_LIBRARY.hsk4);
//       requiredTags.push("HSK4");
//       totalMonths += STEP_LIBRARY.hsk4.months;
//     }
//     if (start < 5 && end >= 5) {
//       steps.push(STEP_LIBRARY.hsk5);
//       requiredTags.push("HSK5");
//       totalMonths += STEP_LIBRARY.hsk5.months;
//     }
//     if (steps.length > 0) steps.push(STEP_LIBRARY.goal);
//     const totalPrice = steps.reduce((sum, step) => sum + (step.price || 0), 0);
//     return { steps, totalMonths, error: null, totalPrice, requiredTags };
//   };

//   const currentLevelLabels = CURRENT_LEVELS.map((level) => level.label);
//   const targetLevelLabels = TARGET_LEVELS.map((level) => level.label);
//   const canSelectTargetLevel = (idx: number) => idx >= currentLevel;

//   const handleCurrentLevelChange = (idx: number) => {
//     setCurrentLevel(idx);

//     if (targetLevel < idx) {
//       setTargetLevel(Math.min(idx, targetLevelLabels.length - 1));
//     }
//   };

//   const handleTargetLevelChange = (idx: number) => {
//     if (!canSelectTargetLevel(idx)) return;
//     setTargetLevel(idx);
//   };

//   const {
//     steps: roadmapSteps,
//     totalMonths,
//     error: roadmapError,
//     totalPrice,
//     requiredTags,
//   } = getRoadmap();

//   useEffect(() => {
//     if (targetLevel < currentLevel) {
//       setTargetLevel(Math.min(currentLevel, targetLevelLabels.length - 1));
//     }
//   }, [currentLevel, targetLevel]);

//   const matchedPackage = useMemo(
//     () =>
//       findMatchingRoadmapPackage({
//         packages: promoPackages,
//         language: "CHINESE",
//         currentLevelLabel: currentLevelLabels[currentLevel],
//         targetLevelLabel: targetLevelLabels[targetLevel],
//         requiredTags,
//       }),
//     [currentLevel, promoPackages, requiredTags, targetLevel],
//   );

//   const formatCurrency = (value: number) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(value);

//   useEffect(() => {
//     setRoadmapQuoteError(null);
//   }, [currentLevel, matchedPackage?.id, roadmapSteps.length, targetLevel]);

//   const handleGetQuote = () => {
//     const addOnItems = selectedRoadmapAddOns.map((addOn) => ({
//       id: addOn.id,
//       title: `${addOn.title} (Gói thêm)`,
//       price: addOn.price,
//     }));
//     const addOnTotal = addOnItems.reduce((sum, addOn) => sum + addOn.price, 0);
//     const navigateToCourseQuote = (quote: {
//       packageId: string | null;
//       title: string;
//       duration: string;
//       originalPrice: number;
//       discount: number;
//       discountPercentage?: number;
//       total: number;
//       language?: Language | null;
//       coverImageUrl?: string | null;
//       items: Array<{ title: string; price: number; coverImageUrl?: string | null }>;
//     }) => {
//       navigate("/chinese/courses", {
//         state: {
//           selectedRoadmap: {
//             currentLevelIdx: currentLevel,
//             targetLevelIdx: targetLevel,
//             showPayment: true,
//             showRoadmap: true,
//             selectedAddOns: selectedRoadmapAddOns,
//             quote,
//           },
//         },
//       });
//     };
//     if (roadmapSteps.length === 0) {
//       setRoadmapQuoteError(
//         "Mục tiêu phải cao hơn trình độ hiện tại để tạo lộ trình.",
//       );
//       return;
//     }

//     if (matchedPackage) {
//       setRoadmapQuoteError(null);

//       // Build trực tiếp state thay vì dùng hàm
//       const sellingPrice = matchedPackage.price;
//       const fakeOriginalPrice =
//         matchedPackage.price * (1 + matchedPackage.discountPercentage / 100);

//       // SỬ DỤNG getSafeMediaUrl ĐÃ CÓ SẴN TRONG FILE
//       const coverImageUrl = getSafeMediaUrl(matchedPackage.coverImageUrl);

//       navigateToCourseQuote({
//           packageId: matchedPackage.id,
//           title: matchedPackage.name,
//           duration: matchedPackage.durationMonths
//             ? `${matchedPackage.durationMonths} tháng`
//             : "Trọn đời",
//           originalPrice: fakeOriginalPrice + addOnTotal,
//           discount: fakeOriginalPrice - sellingPrice,
//           discountPercentage: matchedPackage.discountPercentage,
//           total: sellingPrice + addOnTotal,
//           language: matchedPackage.language ?? Language.CHINESE,
//           coverImageUrl,
//           items: [
//             { title: matchedPackage.name, price: sellingPrice, coverImageUrl },
//             ...addOnItems,
//           ],
//       });
//       return;
//     }

//     setRoadmapQuoteError(null);
//     setRoadmapQuoteError(
//       isLoadingPromoPackages
//         ? ROADMAP_LOADING_MESSAGE
//         : ROADMAP_UNAVAILABLE_MESSAGE,
//     );
//     return;
//     const roadmapBasePrice = totalPrice;
//     const roadmapDiscount = roadmapBasePrice * 0.3;
//     navigateToCourseQuote({
//       packageId: null,
//         title: `Lộ trình ${currentLevelLabels[currentLevel]} - ${targetLevelLabels[targetLevel]}`,
//         duration: `${totalMonths} tháng`,
//         originalPrice: roadmapBasePrice + addOnTotal,
//         discount: roadmapDiscount,
//         discountPercentage: 30,
//         total: roadmapBasePrice - roadmapDiscount + addOnTotal,
//         language: Language.CHINESE,
//         items: [
//           ...roadmapSteps
//           .filter((step) => step.price > 0)
//           .map((step) => ({ title: step.title, price: step.price })),
//           ...addOnItems,
//         ],
//     });
//   };

//   const scrollToRoadmapSection = () => {
//     const roadmapSection = roadmapSectionRef.current;
//     if (!roadmapSection) {
//       return;
//     }

//     const offsetTop =
//       roadmapSection.getBoundingClientRect().top + window.scrollY - 80;
//     window.scrollTo({ top: offsetTop, behavior: "smooth" });
//   };

//   const handleClosePopupBanner = () => {
//     const currentNotification = popupBannerNotification;
//     setPopupBannerNotification(null);

//     if (!currentNotification) {
//       return;
//     }

//     if (!getStoredToken()) {
//       dismissGuestPopupBannerNotification(currentNotification);
//       return;
//     }

//     void dismissNotification(currentNotification.id).catch((error) => {
//       console.error("Failed to dismiss popup banner notification", error);
//     });
//   };

//   const handlePopupBannerAction = (notification: InAppNotification) => {
//     setPopupBannerNotification(null);

//     if (getStoredToken()) {
//       void Promise.allSettled([
//         markNotificationAsRead(notification.id),
//         dismissNotification(notification.id),
//       ]).then((results) => {
//         if (results.some((result) => result.status === "rejected")) {
//           console.error("Failed to update popup banner notification state");
//         }
//       });
//     } else {
//       dismissGuestPopupBannerNotification(notification);
//     }

//     openPopupBannerAction(notification.actionUrl, navigate, "chinese");
//   };

//   const activeTeacher = TEACHERS[activeTeacherIdx] || TEACHERS[0];
//   const heroVideoTitle = heroVideoConfig?.title || "Giới thiệu";
//   const heroVideoWatchUrl = buildVimeoWatchUrl(heroVideoConfig?.vimeoId);
//   const demoTrialLesson = trialLessons[0] || null;
//   const demoTrialLessonWatchUrl = buildVimeoWatchUrl(demoTrialLesson?.videoUrl);
//   const heroVideoThumbnail = heroVideoConfig?.thumbnail
//     ? getSafeMediaUrl(heroVideoConfig.thumbnail)
//     : "https://images.unsplash.com/photo-1548622159-866895eb488b?q=80&w=2070&auto=format&fit=crop";

//   return (
//     <div
//       className="bg-cover bg-center bg-fixed overflow-hidden text-[#1a2b48]"
//       style={{
//         backgroundImage: "url('https://i.ibb.co/HDRx0byP/cover3.png')",
//       }}
//     >
//       {/* 1. HERO SECTION */}
//       <section
//         ref={heroSectionRef}
//         className="relative flex min-h-[72svh] items-start bg-cover bg-center overflow-hidden border-b border-slate-100 pb-0 md:min-h-[90svh] md:pb-10 lg:min-h-screen"
//         // style={{
//         //   backgroundImage: "url('https://i.ibb.co/HDRx0byP/cover3.png')",
//         // }}
//       >
//         {/* <div className="absolute inset-0 bg-white/80 md:bg-white/70"></div> */}
//         <div className="w-full mx-auto px-4 sm:px-10 lg:px-16 py-4 md:py-10 relative z-10">
//           <div className="grid lg:grid-cols-2 gap-4 sm:gap-10 lg:gap-18 items-center">
//             <div className="space-y-5 md:space-y-8 animate-in fade-in slide-in-from-left duration-700 text-center lg:text-left mt-2 md:mt-0 order-2 lg:order-1">
//               <div className="hidden md:inline-flex items-center justify-center gap-2.5 bg-red-50/90 px-4 py-2 rounded-full border border-red-100 shadow-sm backdrop-blur-sm leading-none">
//                 <span className="h-2.5 w-2.5 shrink-0 self-center rounded-full bg-[#f05a5a] animate-pulse"></span>
//                 <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[9px] md:text-[11px] font-black uppercase tracking-wider leading-none text-[#f05a5a]">
//                   <span className="block leading-none translate-y-[0.5px]">Học tiếng Trung thông minh cùng</span>
//                   <span className="inline-flex items-center self-center text-[11px] md:text-[13px] leading-none">
//                     AI
//                   </span>
//                 </span>
//               </div>
//               <h1 className="font-be-vietnam text-[27px] sm:text-[32px] lg:text-[54px] font-extrabold text-[#1a2b48] leading-[1.08] tracking-[-0.01em] drop-shadow-xl">
//                 <span className="block">HỌC TIẾNG TRUNG</span>
//                 <span className="block mt-0 sm:mt-1 pt-1 lg:pt-2">
//                   <span className="inline-block whitespace-nowrap text-[1em] tracking-[-0.03em] text-[#ef4444] drop-shadow-[0_6px_16px_rgba(239,68,68,0.16)] [-webkit-text-stroke:0.5px_#ffe5e5]">
//                     TỪ GIAO TIẾP ĐẾN HSK
//                   </span>
//                 </span>
//               </h1>
//               <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
//                 AI sửa phát âm, bài học video ngắn và lộ trình cá nhân hóa giúp bạn linh hoạt, tiến bộ mỗi ngày.
//               </p>
//               <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4 md:pt-5">
//                 <Link
//                   to="/chinese/placement-test"
//                   className="w-full sm:w-auto justify-center bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:shadow-[0_20px_40px_rgba(239,68,68,0.4)] transition-all flex items-center group shadow-md active:scale-95"
//                 >
//                   Bắt đầu ngay{" "}
//                   <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
//                 </Link>
//                 <button
//                   type="button"
//                   onClick={scrollToRoadmapSection}
//                   className="hidden sm:flex sm:w-auto justify-center bg-white/80 text-[#1a2b48] border-2 border-slate-100 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-base md:text-lg hover:bg-white transition-all shadow-sm active:scale-95 backdrop-blur-sm"
//                 >
//                   Khám phá nền tảng
//                 </button>
//               </div>
//               <div className="flex items-center justify-center gap-3 sm:gap-5 lg:justify-start pt-0 md:pt-4">
//                 <div className="flex shrink-0 -space-x-3 sm:-space-x-4">
//                   {TRUSTED_VIETNAMESE_AVATARS.map((avatar, index) => (
//                     <img
//                       key={avatar}
//                       src={avatar}
//                       className="h-8 w-8 rounded-full border-2 border-white shadow-lg sm:h-10 sm:w-10 md:h-14 md:w-14 md:border-4"
//                       alt={`Vietnamese learner ${index + 1}`}
//                     />
//                   ))}
//                 </div>
//                 <div className="flex min-w-0 items-center gap-2 border-slate-400/30 sm:border-l-2 sm:pl-2">
//                   <div className="flex shrink-0 text-[#ef4444]">
//                     <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
//                     <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
//                     <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
//                     <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
//                     <Star className="h-3.5 w-3.5 fill-current sm:h-4 sm:w-4 md:h-5 md:w-5" />
//                   </div>
//                   <span className="whitespace-nowrap text-[9px] font-black uppercase tracking-[0.03em] text-[#1a2b48] sm:text-[10px] md:text-xs md:tracking-[0.04em]">
//                     10.000 học viên tin dùng
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Vùng Video - Thu nhỏ trên mobile */}
//             <div className="relative mt-2 lg:mt-0 px-4 md:px-0 order-1 lg:order-2">
//               <div className="group relative aspect-video w-full rounded-[1.5rem] md:rounded-[3rem] border-4 border-white bg-white shadow-2xl md:border-[12px] md:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)]">
//                 <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#1a2b48] isolate shadow-[inset_0_0_0_1px_rgba(255,255,255,0.72)] [backface-visibility:hidden] [transform:translateZ(0)] md:rounded-[36px]">
//                   {isPlayingHeroVideo && heroVideoWatchUrl ? (
//                   <SlimVimeoPlayer
//                     videoUrl={heroVideoWatchUrl}
//                     title={heroVideoTitle}
//                     accentColor="rgba(15,23,42,0.88)"
//                     startMuted={false}
//                     shouldPlay={isHeroBannerInView}
//                     controlBarVariant="compact-light"
//                   />
//                 ) : (
//                   <>
//                     <img
//                       src={heroVideoThumbnail}
//                       className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
//                       alt={heroVideoTitle}
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           if (heroVideoWatchUrl) {
//                             hasAutoStartedHeroVideoRef.current = true;
//                             heroVideoStartModeRef.current = "manual";
//                             setIsPlayingHeroVideo(true);
//                           }
//                         }}
//                         disabled={!heroVideoWatchUrl}
//                         className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#ef4444] to-[#b91c1c] text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer border-2 md:border-4 border-white/20 disabled:cursor-not-allowed disabled:opacity-60"
//                       >
//                         <Play className="w-8 h-8 md:w-12 md:h-12 fill-current ml-1" />
//                       </button>
//                     </div>
//                     <div className="absolute bottom-4 md:bottom-8 left-4 right-4 md:left-8 md:right-8 bg-white/10 backdrop-blur-2xl p-3 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/20">
//                       <div className="flex items-center justify-between">
//                         <div className="space-y-0 md:space-y-1">
//                           <p className="text-white text-[8px] md:text-[11px] font-black uppercase tracking-[0.3em] opacity-80">
//                             Demo Trải Nghiệm
//                           </p>
//                           <p className="text-white text-sm md:text-lg font-bold">
//                             Học tiếng Trung cùng AI Coach
//                           </p>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           {heroVideoWatchUrl && (
//                             <a
//                               href={heroVideoWatchUrl}
//                               target="_blank"
//                               rel="noreferrer"
//                               onClick={(event) => event.stopPropagation()}
//                               className="hidden md:inline-flex text-[10px] font-black uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
//                             >
//                               Vimeo
//                             </a>
//                           )}
//                           <div className="w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-full flex items-center justify-center">
//                             <PlayCircle className="text-white w-5 h-5 md:w-7 md:h-7" />
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 2. AI Feature Highlight */}
//       <div
//         id="ai-feature-section"
//         onTouchStart={handleFeatureTouchStart}
//         onTouchEnd={handleFeatureTouchEnd}
//         className="w-full relative z-10 flex flex-col justify-center pt-0 pb-8 md:py-16 lg:min-h-[100vh]"
//       >
//         <div className="relative w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12">
//           <div className="w-full relative z-10">
//             <div className="text-center mb-8 md:mb-14 space-y-3 md:space-y-4">
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1a2b48] tracking-tight leading-tight">
//                 Nền tảng học tập toàn diện <br className="hidden sm:block" />
//                 <span className="text-[#ef4444]"> tích hợp AI</span>
//               </h2>
//             </div>

//             {/* Mobile Stack Layout vs Desktop Grid */}
//             <div className="grid lg:grid-cols-12 gap-6 items-center h-auto lg:h-[60vh] lg:min-h-[480px] lg:max-h-[700px]">
//               {/* CỘT TRÁI (TEXT) */}
//               <div className="lg:col-span-5 h-[320px] sm:h-[380px] lg:h-full w-full bg-white/30 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col border border-slate-100 order-2 lg:order-1">
//                 <div
//                   className="absolute top-0 left-0 w-full h-full flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
//                   style={{
//                     transform: `translateY(-${activeFeatureIdx * 100}%)`,
//                   }}
//                 >
//                   {aiFeatures.map((feature, idx) => (
//                     <div
//                       key={idx}
//                       className="h-full w-full flex-shrink-0 flex flex-col justify-center p-6 sm:p-8 lg:p-12"
//                     >
//                       <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1a2b48] text-[#ef4444] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg mb-4 md:mb-6 shrink-0">
//                         {feature.icon}
//                       </div>
//                       <div>
//                         <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1a2b48] mb-2 md:mb-3 leading-tight">
//                           {feature.title}
//                         </h3>
//                         <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium mb-4 md:mb-6 line-clamp-3 md:line-clamp-4">
//                           {feature.desc}
//                         </p>

//                         {/* BULLET POINTS */}
//                         {feature.bulletPoints && (
//                           <ul className="space-y-2 md:space-y-3">
//                             {feature.bulletPoints.map(
//                               (point: string, i: number) => (
//                                 <li
//                                   key={i}
//                                   className="flex items-center gap-2 md:gap-3 text-[#1a2b48] font-bold text-xs sm:text-sm md:text-base"
//                                 >
//                                   <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-red-50 text-[#ef4444] flex items-center justify-center shrink-0">
//                                     <Check size={12} strokeWidth={3} />
//                                   </div>
//                                   {point}
//                                 </li>
//                               ),
//                             )}
//                           </ul>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* CỘT PHẢI (MEDIA) */}
//               <div className="lg:col-span-7 h-[220px] sm:h-[300px] lg:h-full w-full relative overflow-visible order-1 lg:order-2">
//                 <div className="h-full w-full bg-white/30 backdrop-blur-md rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center justify-center relative overflow-hidden">
//                   <div className="absolute top-1/2 right-0 w-32 h-32 md:w-64 md:h-64 bg-red-100/50 blur-[40px] md:blur-[80px] -translate-y-1/2 pointer-events-none z-0"></div>
//                   <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-[#c5a059]/10 blur-[40px] md:blur-[80px] pointer-events-none z-0"></div>

//                   {aiFeatures.map((feature, idx) => (
//                     <div
//                       key={idx}
//                       className={`absolute inset-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] transform flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none ${activeFeatureIdx === idx ? "opacity-100 translate-y-0 scale-100 z-10" : activeFeatureIdx > idx ? "opacity-0 -translate-y-10 scale-95 z-0" : "opacity-0 translate-y-10 scale-95 z-0"}`}
//                     >
//                       <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border border-slate-100 relative bg-slate-50 flex items-center justify-center pointer-events-none">
//                         <img
//                           src={getSafeMediaUrl(feature.mediaUrl)}
//                           alt={feature.title}
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.src =
//                               "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop";
//                           }}
//                         />
//                       </div>
//                     </div>
//                   ))}

//                   {/* Dots Pagination */}
//                   <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 md:gap-3 bg-white/80 backdrop-blur-md px-3 md:px-5 py-2 md:py-3 rounded-full shadow-sm border border-white/50">
//                     {aiFeatures.map((_, idx) => (
//                       <button
//                         type="button"
//                         key={idx}
//                         onClick={() => setActiveFeatureIdx(idx)}
//                         className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${activeFeatureIdx === idx ? "w-6 md:w-8 bg-[#1a2b48]" : "w-2 md:w-2.5 bg-slate-300 hover:bg-slate-400"}`}
//                         aria-label={`Go to feature ${idx + 1}`}
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={showPrevFeature}
//                   className="absolute left-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#1a2b48] shadow-lg transition-all hover:scale-110 hover:text-[#0f172a] sm:left-4 md:h-12 md:w-12 lg:left-[-10px] lg:bg-transparent lg:shadow-none"
//                   aria-label="Feature trước"
//                 >
//                   <ChevronLeft size={28} strokeWidth={3} />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={showNextFeature}
//                   className="absolute right-3 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-[#1a2b48] shadow-lg transition-all hover:scale-110 hover:text-[#0f172a] sm:right-4 md:h-12 md:w-12 lg:right-[-10px] lg:bg-transparent lg:shadow-none"
//                   aria-label="Feature tiếp theo"
//                 >
//                   <ChevronRight size={28} strokeWidth={3} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 3. AI INTERACTIVE SECTION (CHINESE) */}
//       <section className="py-10 md:py-16 relative overflow-hidden">
//         <div className="absolute inset-0 opacity-10 pointer-events-none">
//           <svg
//             className="w-full h-full"
//             viewBox="0 0 1440 800"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M-100 400C200 300 400 500 720 400C1040 300 1240 500 1540 400"
//               stroke="url(#paint0_linear)"
//               strokeWidth="2"
//             />
//             <path
//               d="M-100 500C200 400 400 600 720 500C1040 400 1240 600 1540 500"
//               stroke="url(#paint0_linear)"
//               strokeWidth="1"
//             />
//             <defs>
//               <linearGradient
//                 id="paint0_linear"
//                 x1="-100"
//                 y1="400"
//                 x2="1540"
//                 y2="400"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#ef4444" stopOpacity="0" />
//                 <stop offset="0.5" stopColor="#ef4444" />
//                 <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>

//         <div className="max-w-5xl mx-auto px-4 relative z-10">
//           <div className="text-center mb-6 md:mb-10">
//             <h2 className="text-[#1a2b48] font-black text-lg md:text-2xl lg:text-3xl uppercase tracking-tighter mb-1">
//               TRẢI NGHIỆM HỌC TẬP
//             </h2>
//             <h3 className="text-[#ef4444] font-black text-xl md:text-2xl lg:text-3xl uppercase tracking-widest italic">
//               CÙNG AI CHẤM CHỮA
//             </h3>
//           </div>

//           <div className="w-full">
//             {/* Tabs Control */}
//             <div className="flex items-center justify-center mb-6 z-20 relative">
//               <div className="bg-white/30 backdrop-blur-md rounded-full shadow-md border border-slate-200 flex flex-wrap justify-center items-center px-1.5 py-1.5 gap-1 md:gap-2">
//                 <button
//                   type="button"
//                   onClick={() => handleTabChange("pronunciation")}
//                   className={`flex items-center space-x-1.5 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeDemoTab === "pronunciation" ? "bg-[#1a2b48] text-white shadow-md" : "text-slate-500 hover:text-[#1a2b48] hover:bg-slate-100"}`}
//                 >
//                   <Mic className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                   <span>AI sửa phát âm</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleTabChange("writing")}
//                   className={`flex items-center space-x-1.5 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeDemoTab === "writing" ? "bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white shadow-md" : "text-slate-500 hover:text-[#1a2b48] hover:bg-slate-100"}`}
//                 >
//                   <PenTool className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                   <span>Luyện viết chữ Hán</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleTabChange("exercise")}
//                   className={`flex items-center space-x-1.5 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeDemoTab === "exercise" ? "bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white shadow-md" : "text-slate-500 hover:text-[#1a2b48] hover:bg-slate-100"}`}
//                 >
//                   <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                   <span>Demo bài tập</span>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleTabChange("trial-video")}
//                   className={`flex items-center space-x-1.5 px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all ${activeDemoTab === "trial-video" ? "bg-gradient-to-r from-[#ef4444] to-[#b91c1c] text-white shadow-md" : "text-slate-500 hover:text-[#1a2b48] hover:bg-slate-100"}`}
//                 >
//                   <PlayCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
//                   <span>Video học thử</span>
//                 </button>
//               </div>
//             </div>

//             {/* TAB CONTENT */}
//             <div
//               className={`relative transition-all duration-300 ${
//                 activeDemoTab === "trial-video"
//                   ? "min-h-[300px] md:min-h-[350px]"
//                   : "min-h-[350px]"
//               } ${
//                 activeDemoTab === "pronunciation"
//                   ? ""
//                   : "bg-white/30 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 border border-slate-200 shadow-xl flex flex-col justify-between"
//               }`}
//             >
//               {/* TAB 1: PRONUNCIATION */}
//               {activeDemoTab === "pronunciation" && (
//                 <div className="animate-in fade-in flex flex-col items-center justify-center min-h-[300px] w-full bg-white/60 md:bg-white/30 backdrop-blur-xl p-5 md:p-8 rounded-[2rem] border border-white/50 shadow-lg transition-all duration-500 hover:shadow-2xl hover:bg-white/70 md:hover:bg-white/40">
//                   <div className="bg-red-50 text-[#ef4444] px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-red-100 flex items-center gap-2">
//                     Đọc to câu sau
//                     <button
//                       type="button"
//                       onClick={() => playTTS(targetText)}
//                       className="hover:text-red-800 transition-colors"
//                     >
//                       <Volume2 size={16} />
//                     </button>
//                   </div>
//                   <h4 className="text-3xl md:text-5xl font-black text-[#1a2b48] mb-2 tracking-tight">
//                     {targetText}!
//                   </h4>
//                   <p className="text-slate-400 font-medium mb-10">/Nǐ hǎo/</p>
//                   {recordedAudioUrl && (
//                     <audio
//                       ref={recordedAudioRef}
//                       src={recordedAudioUrl}
//                       className="hidden"
//                       onPause={() => setIsPlayingRecordedAudio(false)}
//                       onEnded={() => setIsPlayingRecordedAudio(false)}
//                     />
//                   )}

//                   {isEvaluating ? (
//                     <div className="flex flex-col items-center gap-4">
//                       <Loader2 className="w-12 h-12 text-[#ef4444] animate-spin" />
//                       <p className="text-[#1a2b48] font-bold animate-pulse">
//                         AI đang phân tích giọng đọc...
//                       </p>
//                     </div>
//                   ) : !hasRecorded ? (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         if (isRecording) {
//                           void stopRecording();
//                         } else {
//                           void startRecording();
//                         }
//                       }}
//                       className={`select-none w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isRecording ? "bg-red-500 scale-110 animate-pulse shadow-red-500/30" : "bg-gradient-to-br from-[#ef4444] to-[#b91c1c] hover:scale-105 shadow-red-500/30"}`}
//                     >
//                       {isRecording ? (
//                         <AudioLines className="w-10 h-10 text-white animate-bounce" />
//                       ) : (
//                         <Mic className="w-10 h-10 text-white" />
//                       )}
//                     </button>
//                   ) : evaluationResult ? (
//                     <div className="w-full max-w-4xl animate-in zoom-in slide-in-from-bottom-4">
//                       <PronunciationResultCard
//                         result={evaluationResult}
//                         fallbackReferenceText={targetText}
//                         showPhonemes
//                       />
//                       <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
//                         {recordedAudioUrl && (
//                           <button
//                             type="button"
//                             onClick={() => void toggleRecordedAudioPlayback()}
//                             className="px-4 py-2.5 bg-white text-[#1a2b48] border border-slate-200 rounded-xl text-sm font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all"
//                           >
//                             {isPlayingRecordedAudio ? (
//                               <PauseCircle size={18} />
//                             ) : (
//                               <PlayCircle size={18} />
//                             )}
//                             {isPlayingRecordedAudio
//                               ? "Tạm dừng bản ghi"
//                               : "Nghe lại câu của tôi"}
//                           </button>
//                         )}
//                         <button
//                           type="button"
//                           onClick={retryPronunciation}
//                           className="px-5 py-2.5 bg-gradient-to-r from-[#1a2b48] to-[#0f172a] text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 transition-all"
//                         >
//                           <RotateCcw size={18} /> Thử lại câu này
//                         </button>
//                       </div>
//                     </div>
//                   ) : null}
//                   {!isEvaluating && hasRecorded && pronunciationError && (
//                     <div className="w-full max-w-3xl bg-red-50 border border-red-200 rounded-[1.25rem] p-4 animate-in zoom-in">
//                       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                         <div className="min-w-0">
//                           <div className="flex items-center justify-center md:justify-start gap-2 text-red-600 font-bold mb-1">
//                             <AlertCircle size={18} />
//                             <span>Không thể chấm phát âm</span>
//                           </div>
//                           <p className="text-sm text-red-600 text-center md:text-left">
//                             {pronunciationError}
//                           </p>
//                         </div>
//                         <div className="flex flex-wrap gap-2 justify-center md:justify-end">
//                         {recordedAudioUrl && (
//                           <button
//                             type="button"
//                             onClick={() => void toggleRecordedAudioPlayback()}
//                             className="px-4 py-2.5 bg-white text-[#1a2b48] border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
//                           >
//                             {isPlayingRecordedAudio ? (
//                               <PauseCircle size={18} />
//                             ) : (
//                               <PlayCircle size={18} />
//                             )}
//                             {isPlayingRecordedAudio
//                               ? "Tạm dừng bản ghi"
//                               : "Nghe lại câu của tôi"}
//                           </button>
//                         )}
//                         <button
//                           type="button"
//                           onClick={retryPronunciation}
//                           className="px-4 py-2.5 bg-white text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
//                         >
//                           Thu âm lại
//                         </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {!isEvaluating && (
//                     <p className="text-xs text-slate-400 mt-6">
//                       {isRecording
//                         ? "Đang lắng nghe... Thả nút ra để dừng"
//                         : hasRecorded
//                           ? ""
//                           : "Nhấn giữ để ghi âm"}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* TAB 2: VIET CHU HAN */}
//               {activeDemoTab === "writing" && <ChineseWritingStrokePractice />}

//               {/* TAB 3: TRIAL VIDEO */}
//               {activeDemoTab === "trial-video" && (
//                 <div className="animate-in fade-in slide-in-from-right-4 relative z-10">
//                   {loadingTrials ? (
//                     <div className="flex min-h-[320px] flex-col items-center justify-center gap-4">
//                       <Loader2 className="h-10 w-10 animate-spin text-[#ef4444]" />
//                       <p className="text-sm font-medium text-slate-500">
//                         Đang tải video học thử...
//                       </p>
//                     </div>
//                   ) : demoTrialLesson ? (
//                     <div className="mx-auto w-full max-w-4xl space-y-3">
//                       <div className="relative aspect-video overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950 shadow-2xl">
//                         {isPlayingTrialVideo && demoTrialLessonWatchUrl ? (
//                           <SlimVimeoPlayer
//                             videoUrl={demoTrialLessonWatchUrl}
//                             title={demoTrialLesson.title}
//                             accentColor="#f87171"
//                             startMuted={false}
//                           />
//                         ) : (
//                           <button
//                             type="button"
//                             onClick={() => {
//                               if (demoTrialLessonWatchUrl) {
//                                 setIsPlayingTrialVideo(true);
//                               }
//                             }}
//                             disabled={!demoTrialLessonWatchUrl}
//                             className="group relative h-full w-full overflow-hidden text-left disabled:cursor-not-allowed"
//                           >
//                             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.35),_transparent_45%),linear-gradient(135deg,_#111827_0%,_#b91c1c_50%,_#111827_100%)]" />
//                             <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />
//                             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/35 to-transparent" />

//                             <div className="absolute inset-0 flex items-center justify-center">
//                               <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/16 text-white shadow-2xl ring-1 ring-white/30 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
//                                 <Play className="ml-1 h-9 w-9 fill-current" />
//                               </span>
//                             </div>

//                             <div className="absolute bottom-0 left-0 right-0 p-4 md:p-7">
//                               <div className="flex flex-wrap items-center gap-2">
//                                 <span className="rounded-full bg-white/14 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
//                                   Học thử cùng Ula Education
//                                 </span>
//                                 <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
//                                   {demoTrialLesson.level}
//                                 </span>
//                                 <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
//                                   {demoTrialLesson.duration}
//                                 </span>
//                               </div>
//                               <h4 className="mt-2 max-w-2xl text-lg font-black text-white md:mt-3 md:text-2xl">
//                                 {demoTrialLesson.title}
//                               </h4>
//                             </div>
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-white/40 px-6 text-center">
//                       <PlayCircle className="mb-4 h-12 w-12 text-slate-300" />
//                       <h4 className="text-xl font-black text-[#1a2b48]">
//                         Chưa có video học thử
//                       </h4>
//                       <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
//                         Khi danh sách Học thử cùng Ula Education có video, phần
//                         này sẽ hiển thị tự động trên trang chủ.
//                       </p>
//                       <Link
//                         to="/chinese/courses"
//                         className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ef4444] to-[#b91c1c] px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:opacity-95"
//                       >
//                         Xem khóa học
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               )}
//               {/* TAB 4: EXERCISES */}
//               {activeDemoTab === "exercise" && (
//                 <>
//                   {isCompleted && <Confetti />}

//                   {isCompleted ? (
//                     <div className="animate-in zoom-in flex flex-col items-center justify-center min-h-[300px] text-center z-10 relative">
//                       <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
//                         <Check size={40} strokeWidth={4} />
//                       </div>
//                       <h3 className="text-2xl md:text-3xl font-black text-[#1a2b48] mb-2">
//                         Đã hoàn thành!
//                       </h3>
//                       <p className="text-slate-500 font-medium text-sm md:text-base mb-8">
//                         Thật dễ dàng đúng không? Học tiếng Trung không hề khó
//                         khi có lộ trình chuẩn.
//                       </p>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setIsCompleted(false);
//                           setCurrentEx(0);
//                           resetExState(0);
//                         }}
//                         className="bg-[#ef4444] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2"
//                       >
//                         <RotateCcw size={18} /> Làm lại từ đầu
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 relative z-10">
//                       <div className="flex justify-between items-center mb-6">
//                         <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
//                           Câu hỏi {currentEx + 1}/{EXERCISES.length}
//                         </span>
//                         <div className="flex gap-1">
//                           {EXERCISES.map((_, i) => (
//                             <div
//                               key={i}
//                               className={`w-6 h-1.5 rounded-full transition-colors ${i <= currentEx ? "bg-[#ef4444]" : "bg-slate-200"}`}
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       {/* RENDER EXERCISE CONTENT */}
//                       <div className="flex-grow mb-8 w-full">
//                         {renderExerciseContent()}
//                       </div>

//                       {/* FOOTER & CHECKING */}
//                       <div className="mt-auto border-t border-slate-100 pt-6 flex flex-col items-center w-full">
//                         {!isChecking ? (
//                           <button
//                             type="button"
//                             onClick={handleCheckAnswer}
//                             disabled={isBtnDisabled}
//                             className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs md:text-sm transition-all w-full md:w-auto flex justify-center items-center gap-2 
//                                 ${
//                                   !isBtnDisabled
//                                     ? "bg-[#1a2b48] text-white hover:bg-[#ef4444] shadow-lg hover:-translate-y-1"
//                                     : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
//                                 }`}
//                           >
//                             Kiểm tra kết quả
//                           </button>
//                         ) : (
//                           <div className="w-full animate-in slide-in-from-bottom-4">
//                             {isCorrect ? (
//                               <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
//                                 <div className="flex items-center gap-3 w-full">
//                                   <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
//                                     <Check size={20} strokeWidth={3} />
//                                   </div>
//                                   <div>
//                                     <p className="font-bold text-green-700 text-sm md:text-base">
//                                       Chính xác!
//                                     </p>
//                                     <p className="text-green-600 text-xs md:text-sm font-medium">
//                                       {EXERCISES[currentEx].hint ||
//                                         "Bạn đã trả lời đúng."}
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={handleNextExercise}
//                                   className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors whitespace-nowrap shadow-sm"
//                                 >
//                                   Tiếp tục
//                                 </button>
//                               </div>
//                             ) : (
//                               <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
//                                 <div className="flex items-center gap-3 w-full">
//                                   <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
//                                     <X size={20} strokeWidth={3} />
//                                   </div>
//                                   <div>
//                                     <p className="font-bold text-red-700 text-sm md:text-base">
//                                       Chưa chính xác
//                                     </p>
//                                     <p className="text-red-600 text-xs md:text-sm font-medium">
//                                       Hãy thử lại xem sao nhé.
//                                     </p>
//                                   </div>
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={() => setIsChecking(false)}
//                                   className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-sm transition-colors whitespace-nowrap shadow-sm"
//                                 >
//                                   Thử lại
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 4. OPTIMIZED ROADMAP SECTION */}
//       <section
//         ref={roadmapSectionRef}
//         className="py-16 md:py-24 relative overflow-hidden"
//       >
//         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
//           <CourseRoadmapShowcase
//             variant="chinese"
//             languageLabel="Tiếng Trung"
//             currentLevels={CURRENT_LEVELS}
//             targetLevels={TARGET_LEVELS}
//             currentLevelIdx={currentLevel}
//             targetLevelIdx={targetLevel}
//             roadmapSteps={roadmapSteps}
//             roadmapError={roadmapError}
//             totalMonths={totalMonths}
//             totalPrice={totalPrice}
//             formatCurrency={formatCurrency}
//             canSelectTargetLevel={canSelectTargetLevel}
//             onCurrentLevelChange={handleCurrentLevelChange}
//             onTargetLevelChange={handleTargetLevelChange}
//             onStepClick={(step) => {
//               if (step.popup) {
//                 setSelectedStep(step);
//               }
//             }}
//             onSuggestTarget={() =>
//               setTargetLevel(Math.min(TARGET_LEVELS.length - 1, currentLevel))
//             }
//             onRequestQuote={() => {
//               setShowRoadmap(true);
//               handleGetQuote();
//             }}
//             onSelectedAddOnsChange={setSelectedRoadmapAddOns}
//             expanded={showRoadmap}
//             onToggleExpanded={() => setShowRoadmap((prev) => !prev)}
//             commitmentLabel="Tổng chi phí lộ trình"
//           />
//           {roadmapQuoteError && (
//             <div className="mt-4 flex items-start justify-center">
//               <div className="flex max-w-xl items-start gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
//                 <AlertCircle size={18} className="mt-0.5 shrink-0" />
//                 <span>{roadmapQuoteError}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* 5. FULL SCREEN TEACHER SECTION */}
//       <section
//         className="relative w-full bg-[#7f1d1d] overflow-hidden min-h-[100svh] lg:min-h-[700px] flex flex-col justify-center"
//         ref={teacherSectionRef}
//         onTouchStart={handleTeacherTouchStart}
//         onTouchEnd={handleTeacherTouchEnd}
//       >
//         <div className="absolute inset-0 bg-gradient-to-br from-[#7f1d1d] via-[#450a0a] to-[#7f1d1d]"></div>
//         <style>{`.ula-animate-teacher-active { border-color: rgba(255, 255, 255, 0.4); box-shadow: 0 0 40px rgba(255, 255, 255, 0.2); }`}</style>

//         <div className="w-full max-w-[1700px] mx-auto px-4 md:px-12 xl:px-16 relative z-10 flex min-h-[100svh] flex-col items-center justify-center py-10 sm:py-12 lg:h-full">
//           <div className="text-center mb-6 md:mb-8 xl:mb-12 shrink-0">
//             <h2 className="text-3xl md:text-4xl xl:text-5xl font-black text-white uppercase tracking-tighter flex flex-row items-center justify-center">
//               ĐỘI NGŨ{" "}
//               <span className="text-[#dfc38a] italic ml-2">CHUYÊN GIA</span>
//             </h2>
//             <p className="text-red-100/60 text-[10px] md:text-xs xl:text-sm uppercase font-bold tracking-[0.2em] mt-2 md:mt-3 hidden md:block">
//               Lăn chuột hoặc kéo để thay đổi danh sách
//             </p>
//             <p className="text-red-100/60 text-[10px] md:text-xs uppercase font-bold tracking-[0.2em] mt-2 md:hidden">
//               Vuốt trái / phải để xem
//             </p>
//           </div>

//           <div className="relative grid grid-cols-1 lg:grid-cols-3 items-center justify-center lg:justify-between h-[320px] sm:h-[380px] md:h-[450px] lg:h-[540px] xl:h-[580px] w-full gap-4 lg:gap-8 xl:gap-12 flex-1">
//             {/* LEFT: Teacher Info (Desktop Only) */}
//             <div
//               className="hidden lg:flex flex-col justify-center h-full z-20 transition-all duration-500 animate-in slide-in-from-left"
//               key={`left-${activeTeacher.id}`}
//             >
//               <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] xl:rounded-[2.5rem] p-6 xl:p-10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 w-full h-full flex flex-col relative overflow-hidden">
//                 <div className="mb-6 xl:mb-8 border-b border-white/10 pb-6 xl:pb-8">
//                   <h3 className="text-3xl xl:text-5xl font-black text-white mb-3 xl:mb-4 tracking-tight line-clamp-1 drop-shadow-md">
//                     {activeTeacher.name}
//                   </h3>
//                   <div className="flex flex-wrap gap-2 xl:gap-3">
//                     <span className="bg-gradient-to-r from-[#c5a059]/20 to-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30 px-3 xl:px-4 py-1 xl:py-1.5 rounded-lg xl:rounded-xl text-xs xl:text-base font-bold shadow-sm">
//                       {activeTeacher.role}
//                     </span>
//                     <span className="bg-white/10 border border-white/20 text-white px-3 xl:px-4 py-1 xl:py-1.5 rounded-lg xl:rounded-xl text-xs xl:text-base font-bold shadow-sm flex items-center gap-2">
//                       {activeTeacher.level}
//                       <div className="w-5 h-3.5 bg-white/20 rounded-sm overflow-hidden flex flex-col justify-between p-[2px]">
//                         <div className="w-full h-[2px] bg-white/60"></div>
//                         <div className="w-full h-[2px] bg-white/60"></div>
//                         <div className="w-full h-[2px] bg-white/60"></div>
//                       </div>
//                     </span>
//                   </div>
//                 </div>
//                 <div className="space-y-6 xl:space-y-8 flex-grow flex flex-col justify-center">
//                   <div className="flex items-start gap-4 xl:gap-5 group">
//                     <GraduationCap
//                       className="w-6 h-6 xl:w-7 xl:h-7 text-[#C5A059] shrink-0"
//                       strokeWidth={2.5}
//                     />
//                     <div>
//                       <p className="text-[10px] xl:text-sm text-white/60 font-bold mb-1 xl:mb-1.5 uppercase tracking-widest">
//                         Chuyên ngành:
//                       </p>
//                       <p className="font-bold text-white text-sm xl:text-lg leading-snug">
//                         {activeTeacher.education}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-4 xl:gap-5 group">
//                     <Diamond
//                       className="w-5 h-5 xl:w-6 xl:h-6 text-[#C5A059] mt-1 shrink-0"
//                       strokeWidth={2.5}
//                     />
//                     <div className="w-full">
//                       <p className="text-[10px] xl:text-sm text-white/60 font-bold mb-2 xl:mb-3 uppercase tracking-widest">
//                         Mảng cố vấn:
//                       </p>
//                       <div className="flex flex-wrap gap-2 xl:gap-2.5">
//                         {activeTeacher.specialties.map((spec) => (
//                           <span
//                             key={spec}
//                             className="bg-white/5 border border-white/10 text-white/90 px-3 xl:px-4 py-1.5 xl:py-2 rounded-full text-xs xl:text-sm font-semibold hover:bg-white/10 transition-colors cursor-default"
//                           >
//                             {spec}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-4 xl:gap-5 group">
//                     <Clock
//                       className="w-6 h-6 xl:w-6 xl:h-6 text-[#C5A059] shrink-0"
//                       strokeWidth={2.5}
//                     />
//                     <p className="font-bold text-white text-sm xl:text-lg leading-snug pt-0.5">
//                       {activeTeacher.exp}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* CENTER: 3D Carousel */}
//             <div
//               className="h-full relative [perspective:1000px] [transform-style:preserve-3d] flex items-center justify-center cursor-ew-resize lg:cursor-ns-resize z-30 w-full"
//               onMouseDown={handleMouseDown}
//               onMouseMove={handleMouseMoveDrag}
//               onMouseUp={handleMouseUp}
//               onMouseLeave={handleMouseUp}
//             >
//               <div className="relative w-full h-full flex justify-center items-center pointer-events-none">
//                 {TEACHERS.map((teacher, index) => (
//                   <div
//                     key={teacher.id}
//                     className={`absolute h-[260px] w-[190px] sm:h-[340px] sm:w-[240px] md:w-[280px] md:h-[380px] xl:w-[320px] xl:h-[440px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] border-4 md:border-[6px] transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${index === activeTeacherIdx ? "border-white/30 ula-animate-teacher-active" : "border-transparent"}`}
//                     style={getCardStyle(index)}
//                   >
//                     <div className="w-full h-full relative bg-[#1a2b48]">
//                       <img
//                         src={teacher.image}
//                         alt={teacher.name}
//                         className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
//                         draggable={false}
//                       />
//                       <div className="absolute inset-0 bg-gradient-to-t from-[#450a0a] via-[#450a0a]/40 to-transparent opacity-90"></div>
//                       <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 text-white text-center">
//                         <h3 className="text-xl md:text-2xl xl:text-4xl font-black drop-shadow-xl mb-0 md:mb-1">
//                           {teacher.name}
//                         </h3>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* RIGHT: Combined Stats (Desktop Only) */}
//             <div
//               className="hidden lg:flex flex-col justify-between h-full gap-6 z-20 transition-all duration-500 animate-in slide-in-from-right"
//               key={`right-${activeTeacher.id}`}
//             >
//               <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 xl:p-10 rounded-[2rem] xl:rounded-[2.5rem] shadow-2xl flex flex-col w-full transform hover:scale-[1.02] transition-transform duration-500">
//                 <div className="flex items-center justify-between gap-4 xl:gap-6 mb-4 xl:mb-6 border-b border-white/10 pb-4 xl:pb-6">
//                   <div className="text-center">
//                     <span className="text-4xl xl:text-7xl font-black text-white leading-none drop-shadow-md">
//                       {activeTeacher.stats.rating}
//                     </span>
//                     <div className="flex justify-center text-yellow-400 text-[10px] xl:text-xs mt-1 xl:mt-2 space-x-0.5 xl:space-x-1">
//                       {[1, 2, 3, 4, 5].map((i) => (
//                         <Star
//                           key={i}
//                           className="w-3 h-3 xl:w-5 xl:h-5 fill-current text-yellow-400 drop-shadow-sm"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                   <div className="h-12 xl:h-16 w-px bg-white/20"></div>
//                   <div className="flex-1">
//                     <p className="font-black text-base xl:text-xl mb-1 text-[#c5a059]">
//                       Chất lượng xuất sắc
//                     </p>
//                     <p className="text-[9px] xl:text-xs text-red-100 uppercase font-bold tracking-widest">
//                       Từ {activeTeacher.stats.students} Học viên
//                     </p>
//                   </div>
//                 </div>
//                 <div className="space-y-3 xl:space-y-4">
//                   <div className="flex items-center gap-3 xl:gap-4">
//                     <CheckCircle2 className="w-4 h-4 xl:w-5 xl:h-5 text-[#c5a059] shrink-0" />
//                     <span className="font-bold text-white/90 text-xs xl:text-base">
//                       Nội dung chuẩn <span className="text-[#c5a059]">HSK</span>
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3 xl:gap-4">
//                     <Search className="w-4 h-4 xl:w-5 xl:h-5 text-[#c5a059] shrink-0" />
//                     <span className="font-bold text-white/90 text-xs xl:text-base">
//                       Kiểm duyệt bởi{" "}
//                       <span className="text-[#c5a059]">Hội đồng</span>
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-3 xl:gap-4">
//                     <CalendarCheck className="w-4 h-4 xl:w-5 xl:h-5 text-[#c5a059] shrink-0" />
//                     <span className="font-bold text-white/90 text-xs xl:text-base">
//                       Cập nhật định kỳ theo{" "}
//                       <span className="text-[#c5a059]">lộ trình</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] xl:rounded-[2.5rem] p-6 xl:p-10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 w-full flex-1 flex flex-col justify-center relative overflow-hidden group">
//                 <Quote className="absolute -top-4 -right-4 text-white/10 w-24 h-24 xl:w-32 xl:h-32 rotate-12 group-hover:scale-110 transition-transform duration-700" />
//                 <div className="relative z-10">
//                   <h4 className="text-[#dfc38a] text-[10px] xl:text-sm font-bold uppercase tracking-[0.2em] mb-2 xl:mb-4">
//                     Triết lý giảng dạy
//                   </h4>
//                   <p className="text-sm xl:text-xl text-white font-medium leading-relaxed italic">
//                     "{activeTeacher.quote}"
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* MOBILE INFO BOX */}
//           <div
//             className="lg:hidden mt-6 text-center bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl w-full max-w-sm shrink-0 shadow-xl"
//             key={`mobile-${activeTeacher.id}`}
//           >
//             <h3 className="text-xl font-black text-white mb-1">
//               {activeTeacher.name}
//             </h3>
//             <p className="text-[#c5a059] text-xs font-bold mb-3">
//               {activeTeacher.role}
//             </p>
//             <div className="flex flex-wrap justify-center gap-2 mb-3">
//               {activeTeacher.specialties.map((spec) => (
//                 <span
//                   key={spec}
//                   className="bg-white/10 text-white/80 px-2 py-1 rounded-md text-[10px] font-semibold"
//                 >
//                   {spec}
//                 </span>
//               ))}
//             </div>
//             <p className="text-[11px] text-white/70 italic line-clamp-2">
//               "{activeTeacher.quote}"
//             </p>
//           </div>

//           <div className="lg:hidden flex justify-center gap-2 mt-4 shrink-0">
//             {TEACHERS.map((_, idx) => (
//               <div
//                 key={idx}
//                 className={`h-1.5 rounded-full transition-all duration-300 ${activeTeacherIdx === idx ? "w-6 bg-[#c5a059]" : "w-1.5 bg-white/30"}`}
//               />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* 6. SUCCESS STORIES */}
//       <section className="py-16 md:py-24 relative overflow-hidden font-inter">
//         <div className="w-full md:w-[116%] md:-ml-[8%] lg:w-[118%] lg:-ml-[9%] xl:w-[114%] xl:-ml-[7%] md:scale-[0.8] md:origin-top">
//           <div className="w-full px-2 md:px-8 lg:px-10 text-center mb-10 md:mb-16 relative z-10">
//             <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#004e89] drop-shadow-sm font-serif italic px-2">
//               Hàng ngàn câu chuyện thành công
//             </h2>
//           </div>
//           <div className="w-full px-2 md:px-6 lg:px-10 xl:px-14 relative z-10">
//             <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
//               <div className="hidden sm:block lg:col-span-5 relative min-h-[380px] lg:min-h-[560px] xl:min-h-[600px]">
//                 <style>{`@keyframes float-vertical-1 { 0% { transform: translateY(0); opacity: 0.92; } 50% { transform: translateY(-108px); opacity: 0.4; } 100% { transform: translateY(0); opacity: 0.92; } } @keyframes float-vertical-2 { 0% { transform: translateY(0); opacity: 0.45; } 50% { transform: translateY(92px); opacity: 1; } 100% { transform: translateY(0); opacity: 0.45; } } @keyframes float-vertical-3 { 0% { transform: translateY(0); opacity: 0.82; } 25% { transform: translateY(-56px); opacity: 0.45; } 75% { transform: translateY(56px); opacity: 0.94; } 100% { transform: translateY(0); opacity: 0.82; } }`}</style>
//                 {SUCCESS_FLOATING_IMAGES.map((img, i) => (
//                   <div
//                     key={i}
//                     className="absolute z-10 transition-all duration-300"
//                     style={{
//                       top: img.top,
//                       left: img.left,
//                       right: img.right,
//                       bottom: img.bottom,
//                       zIndex: img.z,
//                       transform: `rotate(${img.rotate})`,
//                     }}
//                   >
//                     <div
//                       className={`rounded-xl overflow-hidden border-2 md:border-4 border-white transition-all duration-300 ${img.main ? "shadow-2xl" : "shadow-lg"}`}
//                       style={{
//                         animation: `float-vertical-${(i % 3) + 1} ${6 + (i % 3) * 2}s infinite ease-in-out`,
//                         animationDelay: `${i * 0.35}s`,
//                       }}
//                     >
//                       <div className={`${img.size} bg-gray-200 relative`}>
//                         <img
//                           src={img.src}
//                           alt={img.alt ?? "Success Story"}
//                           loading="lazy"
//                           className="w-full h-full object-cover"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="lg:col-span-7 col-span-12">
//                 <div className="h-[480px] md:h-[620px] overflow-hidden relative mask-image-gradient">
//                   <style>{`.mask-image-gradient { mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); } @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } } @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } } .animate-scroll-up { animation: scrollUp 68s linear infinite; } .animate-scroll-down { animation: scrollDown 68s linear infinite; }`}</style>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 h-full px-2">
//                     <div className="flex flex-col gap-3 md:hidden animate-scroll-up">
//                       {[...REVIEWS_DATA, ...REVIEWS_DATA].map((review, i) => (
//                         <ReviewCard key={`mobile-${i}`} review={review} />
//                       ))}
//                     </div>
//                     <div className="hidden md:flex flex-col gap-4 animate-scroll-up">
//                       {[...REVIEWS_COLUMN_LEFT, ...REVIEWS_COLUMN_LEFT].map(
//                         (review, i) => (
//                           <ReviewCard key={`up-${i}`} review={review} />
//                         ),
//                       )}
//                     </div>
//                     <div className="hidden md:flex flex-col gap-4 animate-scroll-down">
//                       {[...REVIEWS_COLUMN_RIGHT, ...REVIEWS_COLUMN_RIGHT]
//                         .reverse()
//                         .map((review, i) => (
//                           <ReviewCard key={`down-${i}`} review={review} />
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//                 <SuccessStatsPanel variant="chinese" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 7. APP DOWNLOAD */}
//       <section className="py-16 md:py-24">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center bg-gradient-to-br from-[#7f1d1d] to-[#450a0a] rounded-[3rem] md:rounded-[4rem] p-8 md:p-12 lg:p-24 text-white overflow-hidden shadow-[0_30px_60px_-15px_rgba(127,29,29,0.4)] md:shadow-[0_50px_100px_-20px_rgba(127,29,29,0.4)]">
//             <div className="space-y-6 md:space-y-8 text-center lg:text-left">
//               <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black leading-tight tracking-tighter text-white">
//                 Học tiếng Trung <br className="hidden sm:block" />{" "}
//                 <span className="text-[#dfc38a] sm:inline-block sm:mt-2 lg:mt-3">Bất cứ nơi nào</span>
//               </h2>
//               <p className="text-sm sm:text-base md:text-lg text-red-100 font-medium leading-relaxed max-w-sm mx-auto lg:mx-0 opacity-80">
//                 Tải Ula App để đồng bộ tiến độ học tập, nhận bài tập mỗi ngày và
//                 luyện nghe offline hoàn toàn miễn phí.
//               </p>
//               <div className="space-y-3">
//                 <span className="block text-[11px] font-black uppercase tracking-[0.28em] text-white/55">
//                   Tải ứng dụng
//                 </span>
//                 <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
//                   <StoreBadge platform="ios" />
//                   <StoreBadge platform="android" />
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-center relative mt-8 lg:mt-0 hidden sm:flex">
//               <div className="absolute inset-0 bg-red-400/20 rounded-full blur-[60px] md:blur-[100px] -z-10"></div>
//               <div className="relative w-[220px] h-[460px] md:w-[280px] md:h-[580px] bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border-[8px] md:border-[12px] border-slate-900 shadow-2xl overflow-hidden group">
//                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-28 h-5 md:h-7 bg-slate-900 rounded-b-2xl md:rounded-b-3xl z-20"></div>
//                 <div className="absolute inset-0 bg-gradient-to-b from-[#7f1d1d] to-[#b91c1c] p-5 md:p-6 pt-12 md:pt-16 space-y-6 md:space-y-8">
//                   <div className="flex items-center justify-between mb-2 md:mb-4">
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl md:rounded-2xl animate-pulse"></div>
//                     <div className="w-8 h-8 md:w-10 md:h-10 bg-[#dfc38a]/80 rounded-full shadow-lg"></div>
//                   </div>
//                   <div className="h-32 md:h-40 w-full bg-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-white/5 group-hover:bg-white/20 transition-all duration-500"></div>
//                   <div className="space-y-3 md:space-y-4">
//                     <div className="h-3 md:h-4 w-full bg-white/10 rounded-full"></div>
//                     <div className="h-3 md:h-4 w-3/4 bg-white/10 rounded-full"></div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-3 md:gap-4 pt-2 md:pt-4">
//                     <div className="h-16 md:h-24 bg-white/5 rounded-xl md:rounded-2xl border border-white/5"></div>
//                     <div className="h-16 md:h-24 bg-[#dfc38a]/20 rounded-xl md:rounded-2xl border border-[#dfc38a]/10"></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <HomePopupBannerModal
//         variant="chinese"
//         notification={popupBannerNotification}
//         onClose={handleClosePopupBanner}
//         onAction={handlePopupBannerAction}
//       />

//       {/* POPUP MODAL (Cho Roadmap) */}
//       {selectedStep && selectedStep.popup && (
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 backdrop-blur-md">
//           <div
//             className="bg-white rounded-[2rem] w-full max-w-5xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col"
//             style={{ maxHeight: "calc(100vh - 40px)" }}
//           >
//             <div className="flex items-start justify-between p-5 md:p-8 border-b border-slate-100 bg-white z-10 shrink-0">
//               <div className="pr-4 md:pr-8">
//                 <h2 className="text-xl md:text-3xl font-black text-[#1a2b48]">
//                   {selectedStep.popup.title}
//                 </h2>
//                 <h3 className="text-xs md:text-lg font-bold text-slate-500 mt-1">
//                   {selectedStep.popup.subtitle}
//                 </h3>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setSelectedStep(null)}
//                 className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
//               >
//                 <X size={18} className="md:w-5 md:h-5" />
//               </button>
//             </div>

//             <div className="overflow-y-auto p-5 md:p-8 custom-scrollbar">
//               <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
//                 <div className="lg:col-span-5 space-y-4 md:space-y-6">
//                   <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100">
//                     <h4 className="text-[10px] md:text-xs font-black uppercase text-slate-400 mb-2 md:mb-3 tracking-widest">
//                       Mục tiêu khóa học
//                     </h4>
//                     <div className="space-y-2 md:space-y-3">
//                       {selectedStep.popup.description.map(
//                         (line: string, idx: number) => (
//                           <div
//                             key={idx}
//                             className="flex items-start space-x-2 md:space-x-3 text-slate-700 text-xs md:text-sm font-medium"
//                           >
//                             <CheckCircle2
//                               size={14}
//                               className="text-[#c5a059] mt-0.5 flex-shrink-0 md:w-4 md:h-4"
//                             />
//                             <p className="leading-relaxed">{line}</p>
//                           </div>
//                         ),
//                       )}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-2 md:gap-3">
//                     <div className="bg-blue-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-blue-100">
//                       <div className="flex items-center space-x-1.5 md:space-x-2 text-blue-500 mb-1">
//                         <Crown size={12} className="md:w-3.5 md:h-3.5" />
//                         <span className="text-[8px] md:text-[10px] font-black uppercase">
//                           Đầu vào
//                         </span>
//                       </div>
//                       <p className="font-bold text-[#1a2b48] text-xs md:text-sm">
//                         {selectedStep.popup.stats.input}
//                       </p>
//                     </div>
//                     <div className="bg-indigo-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-indigo-100">
//                       <div className="flex items-center space-x-1.5 md:space-x-2 text-indigo-500 mb-1">
//                         <BookOpen size={12} className="md:w-3.5 md:h-3.5" />
//                         <span className="text-[8px] md:text-[10px] font-black uppercase">
//                           Bài học
//                         </span>
//                       </div>
//                       <p className="font-bold text-[#1a2b48] text-xs md:text-sm">
//                         {selectedStep.popup.stats.lessons} bài
//                       </p>
//                     </div>
//                     <div className="bg-orange-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-orange-100">
//                       <div className="flex items-center space-x-1.5 md:space-x-2 text-orange-500 mb-1">
//                         <PenTool size={12} className="md:w-3.5 md:h-3.5" />
//                         <span className="text-[8px] md:text-[10px] font-black uppercase">
//                           Thực hành
//                         </span>
//                       </div>
//                       <p className="font-bold text-[#1a2b48] text-xs md:text-sm">
//                         {selectedStep.popup.stats.practices} bài
//                       </p>
//                     </div>
//                     <div className="bg-green-50/50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-green-100">
//                       <div className="flex items-center space-x-1.5 md:space-x-2 text-green-500 mb-1">
//                         <HelpCircle size={12} className="md:w-3.5 md:h-3.5" />
//                         <span className="text-[8px] md:text-[10px] font-black uppercase">
//                           Kiểm tra
//                         </span>
//                       </div>
//                       <p className="font-bold text-[#1a2b48] text-xs md:text-sm">
//                         {selectedStep.popup.stats.tests} bài
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="lg:col-span-7">
//                   <div className="flex items-center justify-between mb-3 md:mb-4">
//                     <h4 className="text-xs md:text-sm font-black uppercase text-[#1a2b48] tracking-widest flex items-center gap-1.5 md:gap-2">
//                       <span className="w-1.5 h-1.5 bg-[#c5a059] rounded-full"></span>{" "}
//                       Chương trình đào tạo
//                     </h4>
//                     <span className="text-[8px] md:text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-lg border border-slate-100">
//                       Cập nhật 2024
//                     </span>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
//                     {selectedStep.popup.syllabus.map(
//                       (item: any, idx: number) => (
//                         <div
//                           key={idx}
//                           className="flex items-start space-x-2 md:space-x-3 p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white border border-slate-100 hover:border-[#c5a059]/50 hover:shadow-md transition-all group"
//                         >
//                           <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 text-slate-500 group-hover:bg-[#1a2b48] group-hover:text-white transition-colors">
//                             {React.cloneElement(item.icon, {
//                               className: "w-4 h-4 md:w-[18px] md:h-[18px]",
//                             })}
//                           </div>
//                           <div>
//                             <h4 className="font-bold text-[#1a2b48] text-xs md:text-sm mb-0.5 md:mb-1 group-hover:text-[#c5a059] transition-colors">
//                               {item.title}
//                             </h4>
//                             <p className="text-[10px] md:text-xs text-slate-500 leading-relaxed line-clamp-2">
//                               {item.desc}
//                             </p>
//                           </div>
//                         </div>
//                       ),
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 shrink-0">
//               <div className="text-[10px] md:text-xs font-medium text-slate-500 hidden sm:block">
//                 * Lộ trình cá nhân hóa bởi AI
//               </div>
//               <div className="flex w-full sm:w-auto gap-2 md:gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setSelectedStep(null)}
//                   className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 text-xs md:text-sm hover:bg-slate-50 transition-colors"
//                 >
//                   Đóng lại
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleGetQuote}
//                   className="flex-1 sm:flex-none px-6 md:px-8 py-2.5 md:py-3 bg-[#1a2b48] text-white rounded-xl font-bold text-xs md:text-sm hover:bg-[#0061ab] shadow-lg shadow-blue-900/10 transition-colors flex items-center justify-center gap-1.5 md:gap-2"
//                 >
//                   <span>Đăng ký</span>
//                   <ChevronRight size={14} className="md:w-4 md:h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <FloatingContactMenu
//         variant="chinese"
//         hotline="0986 912 388"
//         zaloHref="https://zalo.me/4303204524068889047"
//         zIndexClassName="z-20"
//         onConsultClick={() =>
//           openConsultation({
//             variant: "chinese",
//             source: "chinese-home-floating-contact-menu",
//           })
//         }
//       />

//     </div>
//   );
// };

// export default ChineseHome;