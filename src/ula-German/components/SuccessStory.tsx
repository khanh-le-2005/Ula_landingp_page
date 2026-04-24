import { Award, BookOpen, FileText, Mic, Monitor, TrendingUp } from 'lucide-react';
import React from 'react'
import ReviewCard from '../Auxiliary/ReviewCard';
import SuccessStatsPanel from '../SuccessStatsPanel';


const SuccessStory = () => {

    const getPexelsPhoto = (id: number, width = 640, height?: number) =>
        `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}${height ? `&h=${height}&fit=crop` : ""
        }`;
    const SUCCESS_IMAGES = [
        {
            src: getPexelsPhoto(32353257, 320, 420),
            alt: "Teen Việt Nam mặc đồng phục ngoài sân trường",
            rotate: "-7deg",
            top: "3%",
            left: "2%",
            z: 12,
            size: "w-20 h-28 md:w-24 md:h-32",
        },
        {
            src: getPexelsPhoto(32377094, 360, 480),
            alt: "Nhóm teen Việt Nam mặc đồng phục ngoài trời",
            rotate: "4deg",
            top: "1%",
            right: "4%",
            z: 8,
            size: "w-24 h-32 md:w-32 md:h-40",
        },
        {
            src: getPexelsPhoto(30355861, 420, 560),
            alt: "Học viên teen Việt Nam trong lớp học",
            rotate: "-2deg",
            top: "11%",
            left: "24%",
            z: 18,
            size: "w-32 h-44 md:w-40 md:h-56",
            main: true,
        },
        {
            src: getPexelsPhoto(32301413, 280, 360),
            alt: "Teen Việt Nam cười trong hành lang trường",
            rotate: "9deg",
            top: "14%",
            right: "20%",
            z: 11,
            size: "w-20 h-24 md:w-24 md:h-32",
        },
        {
            src: getPexelsPhoto(32301416, 300, 380),
            alt: "Teen Việt Nam trong đồng phục tại khuôn viên trường",
            rotate: "-10deg",
            top: "22%",
            left: "4%",
            z: 9,
            size: "w-20 h-24 md:w-24 md:h-32",
        },
        {
            src: getPexelsPhoto(32279020, 340, 440),
            alt: "Hai học viên tuổi teen đang học cùng nhau trong lớp",
            rotate: "7deg",
            top: "30%",
            right: "2%",
            z: 14,
            size: "w-24 h-32 md:w-28 md:h-36",
        },
        {
            src: getPexelsPhoto(32434149, 280, 360),
            alt: "Ba nữ sinh tuổi teen tại Việt Nam",
            rotate: "-4deg",
            top: "37%",
            left: "28%",
            z: 13,
            size: "w-20 h-24 md:w-24 md:h-32",
        },
        {
            src: getPexelsPhoto(32279010, 320, 420),
            alt: "Nhóm học viên teen trong lớp học ngoại ngữ",
            rotate: "11deg",
            top: "44%",
            left: "0%",
            z: 10,
            size: "w-24 h-32 md:w-32 md:h-40",
        },
        {
            src: getPexelsPhoto(29242207, 340, 460),
            alt: "Học viên tuổi teen trong lớp học ngoại ngữ phong cách Anh",
            rotate: "-8deg",
            top: "50%",
            left: "18%",
            z: 16,
            size: "w-24 h-32 md:w-32 md:h-40",
        },
        {
            src: getPexelsPhoto(32242334, 300, 380),
            alt: "Teen châu Á trong lớp học với bảng trang trí sáng tạo",
            rotate: "5deg",
            top: "48%",
            right: "18%",
            z: 9,
            size: "w-20 h-24 md:w-24 md:h-32",
        },
        {
            src: getPexelsPhoto(32242324, 300, 380),
            alt: "Nam học viên tuổi teen trong lớp học",
            rotate: "-12deg",
            bottom: "16%",
            left: "6%",
            z: 15,
            size: "w-24 h-28 md:w-28 md:h-36",
        },
        {
            src: getPexelsPhoto(32242329, 300, 380),
            alt: "Học viên nam tuổi teen trong không gian lớp học",
            rotate: "3deg",
            bottom: "18%",
            left: "34%",
            z: 17,
            size: "w-24 h-32 md:w-32 md:h-40",
        },
        {
            src: getPexelsPhoto(29242204, 360, 480),
            alt: "Lớp học tuổi teen với decor trung tâm ngoại ngữ",
            rotate: "-5deg",
            bottom: "9%",
            left: "53%",
            z: 20,
            size: "w-28 h-36 md:w-36 md:h-48",
        },
        {
            src: getPexelsPhoto(32242325, 280, 360),
            alt: "Học viên tuổi teen tạo dáng trong lớp học",
            rotate: "10deg",
            bottom: "4%",
            left: "30%",
            z: 11,
            size: "w-20 h-24 md:w-24 md:h-32",
        },
        {
            src: getPexelsPhoto(34738081, 280, 360),
            alt: "Nữ sinh tuổi teen Việt Nam ngoài trời",
            rotate: "-9deg",
            bottom: "12%",
            right: "24%",
            z: 12,
            size: "w-20 h-24 md:w-24 md:h-32",
        },
        {
            src: getPexelsPhoto(32205080, 280, 360),
            alt: "Teen Việt Nam ngồi tại hành lang trường",
            rotate: "7deg",
            bottom: "0%",
            right: "6%",
            z: 18,
            size: "w-24 h-28 md:w-28 md:h-36",
        },
        {
            src: getPexelsPhoto(32301397, 280, 360),
            alt: "Teen Việt Nam trong hành lang sáng của trường",
            rotate: "-3deg",
            top: "8%",
            right: "33%",
            z: 7,
            size: "w-20 h-24 md:w-24 md:h-28",
        },
    ];

    const SUCCESS_FLOATING_IMAGES = SUCCESS_IMAGES.map((image, index) => {
        const layoutOverrides = [
            { top: "2%", left: "0%" },
            { top: "0%", right: "1%" },
            { top: "8%", left: "22%" },
            { top: "11%", right: "19%" },
            { top: "23%", left: "8%" },
            { top: "27%", right: "1%" },
            { top: "36%", left: "31%" },
            { top: "43%", left: "1%" },
            { top: "48%", left: "16%" },
            { top: "46%", right: "16%" },
            { bottom: "18%", left: "4%" },
            { bottom: "16%", left: "35%" },
            { bottom: "8%", left: "55%" },
            { bottom: "3%", left: "27%" },
            { bottom: "11%", right: "22%" },
            { bottom: "1%", right: "4%" },
            { top: "7%", right: "36%" },
        ][index];

        return layoutOverrides ? { ...image, ...layoutOverrides } : image;
    });


    const TRUSTED_VIETNAMESE_AVATARS = [
        "https://images.pexels.com/photos/29677093/pexels-photo-29677093.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
        "https://images.pexels.com/photos/30436001/pexels-photo-30436001.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
        "https://images.pexels.com/photos/4063971/pexels-photo-4063971.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
        "https://images.pexels.com/photos/36064019/pexels-photo-36064019.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
        "https://images.pexels.com/photos/12667510/pexels-photo-12667510.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop",
    ];



    const REVIEWS_DATA = [
        {
            id: 1,
            name: "Ngọc Trâm",
            level: "Mất gốc",
            text: "Mình kiểu nhìn Hán tự là hoa mắt. Học chia nhỏ bài nên cuối cùng cũng không bỏ giữa chừng nữa.",
            tags: ["Mất gốc", "Người đi làm"],
            likes: 184,
            avatar: getPexelsPhoto(29677093, 160, 160),
        },
        {
            id: 2,
            name: "Đức Anh",
            level: "HSK 3",
            text: "Trước phát âm nghe như đọc thần chú, AI chấm hơi phũ nhưng sửa đúng. Giờ nói đỡ quê hẳn.",
            tags: ["Phát âm", "HSKK"],
            likes: 233,
            avatar: getPexelsPhoto(30436001, 160, 160),
        },
        {
            id: 3,
            name: "Khánh Linh",
            level: "HSK 4",
            text: "Mình não cá vàng mà app nhắc học đều nên vẫn lên được HSK4. Bất ngờ thiệt.",
            tags: ["Ôn mỗi ngày", "HSK 4"],
            likes: 147,
            avatar: getPexelsPhoto(4063971, 160, 160),
        },
        {
            id: 4,
            name: "Quốc Huy",
            level: "Đi làm",
            text: "Đi làm về chỉ học nổi 15 phút, mà đúng kiểu 15 phút này cứu mình. Không bị ngợp như học dồn cuối tuần.",
            tags: ["Người đi làm", "Micro learning"],
            likes: 119,
            avatar: getPexelsPhoto(25884724, 160, 160),
        },
        {
            id: 5,
            name: "Bảo Ngọc",
            level: "HSK 2",
            text: "Viết chữ trước đây như vẽ bùa. Học vài tuần xong ít nhất mình còn đọc lại được chữ mình viết.",
            tags: ["Hán tự", "Mất gốc"],
            likes: 91,
            avatar: getPexelsPhoto(31035788, 160, 160),
        },
        {
            id: 6,
            name: "Thùy Dương",
            level: "Du học",
            text: "Qua bên kia rồi mới thấy phần nghe nói ở đây dạy rất thực dụng. Ra siêu thị không ú ớ nữa.",
            tags: ["Du học", "Giao tiếp"],
            likes: 276,
            avatar: getPexelsPhoto(35628737, 160, 160),
        },
        {
            id: 7,
            name: "Hà My",
            level: "HSK 3",
            text: "Bài tập ngắn nhưng dí đều, lười mấy cũng bị kéo vào học. Cay mà hiệu quả.",
            tags: ["Lười vẫn học", "HSK 3"],
            likes: 201,
            avatar: getPexelsPhoto(35628740, 160, 160),
        },
        {
            id: 8,
            name: "Mai Phương",
            level: "HSKK",
            text: "Ôn HSKK ở đây đỡ áp lực vì có mẫu nói sẵn. Lúc đầu mình nói bé như muỗi, giờ đỡ run hơn nhiều.",
            tags: ["HSKK", "Nói"],
            likes: 134,
            avatar: getPexelsPhoto(31892580, 160, 160),
        },
        {
            id: 9,
            name: "Lan Chi",
            level: "HSK 5",
            text: "Cô sửa bài viết rất kỹ, gạch đỏ nhìn hơi đau tim nhưng nhờ vậy lên điểm thật.",
            tags: ["Viết", "HSK 5"],
            likes: 167,
            avatar: getPexelsPhoto(31892582, 160, 160),
        },
        {
            id: 10,
            name: "Thanh Vy",
            level: "Mẹ bỉm",
            text: "Mỗi ngày tranh thủ lúc con ngủ học 1-2 bài. Không nhanh thần tốc nhưng chắc, vậy là đủ.",
            tags: ["Mẹ bỉm", "Học linh hoạt"],
            likes: 88,
            avatar: getPexelsPhoto(15916247, 160, 160),
        },
        {
            id: 11,
            name: "Gia Hân",
            level: "HSK 4",
            text: "Mình từng học chỗ khác 6 tháng vẫn mù mờ. Qua đây mới thấy vấn đề là thiếu lộ trình chứ không phải mình dở.",
            tags: ["Lộ trình", "HSK 4"],
            likes: 309,
            avatar: getPexelsPhoto(36064019, 160, 160),
        },
        {
            id: 12,
            name: "Minh Thư",
            level: "Đi làm",
            text: "Phần từ vựng theo chủ đề cứu mình mấy buổi họp với đối tác Trung Quốc. Đỡ phải cười trừ.",
            tags: ["Công việc", "Từ vựng"],
            likes: 156,
            avatar: getPexelsPhoto(36060812, 160, 160),
        },
        {
            id: 13,
            name: "Kiều Oanh",
            level: "HSK 2",
            text: "Mình học hơi chậm nhưng bài nào cũng có ví dụ đời thường nên vào đầu hơn kiểu học vẹt.",
            tags: ["Học chậm", "Ví dụ dễ hiểu"],
            likes: 73,
            avatar: getPexelsPhoto(4063968, 160, 160),
        },
        {
            id: 14,
            name: "Hoài An",
            level: "HSK 3",
            text: "Có hôm lười quá mở app lên chỉ để điểm danh, xong lại học luôn 20 phút. Bị thao túng nhẹ nhưng ổn.",
            tags: ["Thói quen học", "HSK 3"],
            likes: 142,
            avatar: getPexelsPhoto(29502143, 160, 160),
        },
        {
            id: 15,
            name: "Bảo Hân",
            level: "HSK 4",
            text: "Nghe người bản xứ nói trước đây như máy bắn chữ. Giờ bắt được ý chính rồi, cảm giác đỡ toang.",
            tags: ["Nghe hiểu", "HSK 4"],
            likes: 128,
            avatar: getPexelsPhoto(12667510, 160, 160),
        },
        {
            id: 16,
            name: "Nhật Nam",
            level: "HSK 5",
            text: "Mục tiêu của mình là xin việc công ty Trung. Sau 5 tháng học nghiêm túc thì pass vòng phỏng vấn thật.",
            tags: ["Phỏng vấn", "HSK 5"],
            likes: 265,
            avatar: getPexelsPhoto(25884724, 160, 160),
        },
        {
            id: 17,
            name: "Phương Nhi",
            level: "HSK 6",
            text: "Không phải học ít đâu, vẫn cày sấp mặt, nhưng ít nhất cày đúng chỗ. Bộ đề và feedback khá sát.",
            tags: ["Luyện thi", "HSK 6"],
            likes: 192,
            avatar: getPexelsPhoto(6791475, 160, 160),
        },
        {
            id: 18,
            name: "Tuấn Đạt",
            level: "Xuất nhập khẩu",
            text: "Học để làm việc chứ không phải thi nên mình thích phần mẫu câu thực tế. Vào chat với khách đỡ gõ Google dịch.",
            tags: ["Đi làm", "Giao tiếp"],
            likes: 111,
            avatar: getPexelsPhoto(30436001, 160, 160),
        },
    ];

    const REVIEWS_COLUMN_LEFT = REVIEWS_DATA.filter((_, index) => index % 2 === 0);
    const REVIEWS_COLUMN_RIGHT = REVIEWS_DATA.filter((_, index) => index % 2 !== 0);




    const AI_FEATURES_FALLBACK = [
        {
            title: "Học video siêu ngắn – nhớ lâu (Micro Learning)",
            desc: "Bài giảng video được chia thành các phần nhỏ chỉ khoảng 15 phút, giúp bạn tiếp thu nhanh và dễ ghi nhớ. Phù hợp cho cả người bận rộn vẫn muốn học mỗi ngày.",
            icon: <Monitor size={28} className="md:w-8 md:h-8" />,
            bulletPoints: [
                "Bài học 3–5 phút",
                "Dễ học mỗi ngày",
                "Ghi nhớ hiệu quả hơn",
            ],
            mediaUrl:
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "AI chấm điểm phát âm",
            desc: "Công nghệ nhận diện giọng nói AI phân tích từng âm tiết, ngữ điệu và độ trôi chảy. Phản hồi ngay lập tức giúp bạn nói chuẩn như người bản xứ.",
            icon: <Mic size={28} className="md:w-8 md:h-8" />,
            bulletPoints: [
                "Phát hiện lỗi phát âm",
                "Chấm điểm chi tiết",
                "Gợi ý cách sửa chuẩn",
            ],
            mediaUrl:
                "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "Flashcard & Từ điển thông minh",
            desc: "Hệ thống flashcard thông minh giúp bạn ghi nhớ từ vựng lâu hơn. Từ điển tích hợp giúp tra nghĩa, ví dụ và cách dùng ngay trong bài học.",
            icon: <BookOpen size={28} className="md:w-8 md:h-8" />,
            bulletPoints: [
                "Ôn tập theo thuật toán nhớ lâu",
                "Ví dụ thực tế dễ hiểu",
                "Tra cứu nhanh trong bài học",
            ],
            mediaUrl:
                "https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "Kho đề thi đa dạng",
            desc: "Hệ thống đề thi được xây dựng theo cấu trúc chứng chỉ HSK (Goethe/OSD/TELC). Nội dung cập nhật liên tục để bám sát đề thi thực tế.",
            icon: <FileText size={28} className="md:w-8 md:h-8" />,
            bulletPoints: [
                "Cấu trúc đề thi chuẩn",
                "Cập nhật thường xuyên",
                "Luyện thi hiệu quả",
            ],
            mediaUrl:
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "Dashboard học tập thông minh",
            desc: "Nền tảng theo dõi tiến độ học tập, phân tích điểm mạnh – điểm yếu và gợi ý lộ trình học phù hợp với từng học viên.",
            icon: <TrendingUp size={28} className="md:w-8 md:h-8" />,
            bulletPoints: [
                "Theo dõi tiến độ học",
                "Gợi ý bài ôn tập",
                "Cá nhân hoá lộ trình",
            ],
            mediaUrl:
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        },
        {
            title: "Học như chơi game (Gamified Learning)",
            desc: "Hệ thống bài tập tương tác sinh động giúp việc học trở nên thú vị và tạo động lực học mỗi ngày.",
            icon: <Award size={28} className="md:w-8 md:h-8" />,
            bulletPoints: [
                "Bài tập tương tác với giáo viên",
                "Học không nhàm chán",
                "Tăng động lực học",
            ],
            mediaUrl:
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800",
        },
    ];

    return (
        <div>


            <section className="py-16 md:py-24 relative overflow-hidden font-inter">
                <div className="w-full md:w-[116%] md:-ml-[8%] lg:w-[118%] lg:-ml-[9%] xl:w-[114%] xl:-ml-[7%] md:scale-[0.8] md:origin-top">
                    <div className="w-full px-2 md:px-8 lg:px-10 text-center mb-10 md:mb-16 relative z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#004e89] drop-shadow-sm font-serif italic px-2">
                            Hàng ngàn câu chuyện thành công
                        </h2>
                    </div>
                    <div className="w-full px-2 md:px-6 lg:px-10 xl:px-14 relative z-10">
                        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                            <div className="hidden sm:block lg:col-span-5 relative min-h-[380px] lg:min-h-[560px] xl:min-h-[600px]">
                                <style>{`@keyframes float-vertical-1 { 0% { transform: translateY(0); opacity: 0.92; } 50% { transform: translateY(-108px); opacity: 0.4; } 100% { transform: translateY(0); opacity: 0.92; } } @keyframes float-vertical-2 { 0% { transform: translateY(0); opacity: 0.45; } 50% { transform: translateY(92px); opacity: 1; } 100% { transform: translateY(0); opacity: 0.45; } } @keyframes float-vertical-3 { 0% { transform: translateY(0); opacity: 0.82; } 25% { transform: translateY(-56px); opacity: 0.45; } 75% { transform: translateY(56px); opacity: 0.94; } 100% { transform: translateY(0); opacity: 0.82; } }`}</style>
                                {SUCCESS_FLOATING_IMAGES.map((img, i) => (
                                    <div
                                        key={i}
                                        className="absolute z-10 transition-all duration-300"
                                        style={{
                                            top: img.top,
                                            left: img.left,
                                            right: img.right,
                                            bottom: img.bottom,
                                            zIndex: img.z,
                                            transform: `rotate(${img.rotate})`,
                                        }}
                                    >
                                        <div
                                            className={`rounded-[10px] overflow-hidden border-2 md:border-4 border-white transition-all duration-300 ${img.main ? "shadow-2xl" : "shadow-lg"}`}
                                            style={{
                                                animation: `float-vertical-${(i % 3) + 1} ${6 + (i % 3) * 2}s infinite ease-in-out`,
                                                animationDelay: `${i * 0.35}s`,
                                            }}
                                        >
                                            <div className={`${img.size} bg-gray-200 relative`}>
                                                <img
                                                    src={img.src}
                                                    alt={img.alt ?? "Success Story"}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-7 col-span-12">
                                <div className="h-[480px] md:h-[620px] overflow-hidden relative mask-image-gradient">
                                    <style>{`.mask-image-gradient { mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent); } @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } } @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } } .animate-scroll-up { animation: scrollUp 68s linear infinite; } .animate-scroll-down { animation: scrollDown 68s linear infinite; }`}</style>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 h-full px-2">
                                        <div className="flex flex-col gap-3 md:hidden animate-scroll-up">
                                            {[...REVIEWS_DATA, ...REVIEWS_DATA].map((review, i) => (
                                                <ReviewCard key={`mobile-${i}`} review={review} />
                                            ))}
                                        </div>
                                        <div className="hidden md:flex flex-col gap-4 animate-scroll-up">
                                            {[...REVIEWS_COLUMN_LEFT, ...REVIEWS_COLUMN_LEFT].map(
                                                (review, i) => (
                                                    <ReviewCard key={`up-${i}`} review={review} />
                                                ),
                                            )}
                                        </div>
                                        <div className="hidden md:flex flex-col gap-4 animate-scroll-down">
                                            {[...REVIEWS_COLUMN_RIGHT, ...REVIEWS_COLUMN_RIGHT]
                                                .reverse()
                                                .map((review, i) => (
                                                    <ReviewCard key={`down-${i}`} review={review} />
                                                ))}
                                        </div>
                                    </div>
                                </div>
                                <SuccessStatsPanel variant="chinese" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default SuccessStory