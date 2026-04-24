export const SUCCESS_FLOATING_IMAGES = [
  // --- BẮT ĐẦU TỪ GÓC TRÊN BÊN TRÁI, ĐI THEO CHIỀU KIM ĐỒNG HỒ ---
  {
    src: "https://images.pexels.com/photos/32353257/pexels-photo-32353257.jpeg?auto=compress&cs=tinysrgb&w=320&h=420&fit=crop",
    top: "10%",
    left: "0%", // Lệch trái
    z: 10,
    rotate: "-8deg",
    size: "w-28 h-36",
    alt: "Graduation",
    main: false,
  },
  {
    src: "https://images.pexels.com/photos/30355861/pexels-photo-30355861.jpeg?auto=compress&cs=tinysrgb&w=420&h=560&fit=crop",
    top: "5%",
    left: "55%", // Gần giữa hơn
    z: 12,
    rotate: "5deg",
    size: "w-24 h-32",
    alt: "Success Smile",
    main: false,
  },
  {
    src: "https://images.pexels.com/photos/32301413/pexels-photo-32301413.jpeg?auto=compress&cs=tinysrgb&w=280&h=360&fit=crop",
    top: "5%",
    right: "55%", // Bắt đầu sang phải
    z: 25,
    rotate: "3deg",
    size: "w-24 h-32",
    alt: "Workshop",
    main: false,
  },
  {
    src:"https://images.pexels.com/photos/32279020/pexels-photo-32279020.jpeg?auto=compress&cs=tinysrgb&w=340&h=440&fit=crop",
    top: "10%",
    right: "5%", // Lệch phải
    z: 20,
    rotate: "10deg",
    size: "w-40 h-52",
    alt: "Study Group",
    main: true,
  },

  // --- VIỀN BÊN PHẢI (CHẠY XUỐNG) ---
  {
    src: "https://images.pexels.com/photos/29242207/pexels-photo-29242207.jpeg?auto=compress&cs=tinysrgb&w=340&h=460&fit=crop",
    top: "50%",
    right: "1%", // Sát rìa phải
    z: 9,
    rotate: "-6deg",
    size: "w-28 h-28",
    alt: "Library",
    main: false,
  },
  {
    src: "https://images.pexels.com/photos/32434149/pexels-photo-32434149.jpeg?auto=compress&cs=tinysrgb&w=280&h=360&fit=crop",
    top: "90%",
    right: "25%", // Thấp hơn
    z: 11,
    rotate: "-10deg",
    size: "w-32 h-24",
    alt: "Online Learning",
    main: false,
  },
  {
    src: "https://images.pexels.com/photos/32242329/pexels-photo-32242329.jpeg?auto=compress&cs=tinysrgb&w=300&h=380&fit=crop",
    bottom: "35%",
    right: "0%", // Thấp hơn nữa
    z: 18,
    rotate: "4deg",
    size: "w-28 h-28",
    alt: "Happy",
    main: false,
  },

  // --- GÓC DƯỚI BÊN PHẢI, ĐI SANG TRÁI THEO VIỀN DƯỚI ---
  {
    src: "https://images.pexels.com/photos/32242325/pexels-photo-32242325.jpeg?auto=compress&cs=tinysrgb&w=280&h=360&fit=crop",
    bottom: "5%",
    right: "5%", // Gần giữa dưới
    z: 5,
    rotate: "-12deg",
    size: "w-36 h-28",
    alt: "Classroom",
    main: false,
  },
  {
    src: "https://images.pexels.com/photos/32205080/pexels-photo-32205080.jpeg?auto=compress&cs=tinysrgb&w=280&h=360&fit=crop",
    bottom: "30%",
    right: "25%", // Sang trái hơn
    z: 16,
    rotate: "5deg",
    size: "w-28 h-36",
    alt: "Teaching",
    main: false,
  },
  {
    src:"https://images.pexels.com/photos/29242204/pexels-photo-29242204.jpeg?auto=compress&cs=tinysrgb&w=360&h=480&fit=crop",
    bottom: "0%",
    left: "5%", // Sang trái nữa
    z: 21,
    rotate: "-4deg",
    size: "w-28 h-36",
    alt: "Campus",
    main: false,
  },
  {
    src: "https://images.pexels.com/photos/32279010/pexels-photo-32279010.jpeg?auto=compress&cs=tinysrgb&w=320&h=420&fit=crop",
    bottom: "5%",
    left: "15%", // Góc dưới trái
    z: 8,
    rotate: "-7deg",
    size: "w-36 h-28",
    alt: "Discussion",
    main: false,
  },

  // --- VIỀN BÊN TRÁI (CHẠY LÊN) ---
  {
    src: "https://images.pexels.com/photos/32301416/pexels-photo-32301416.jpeg?auto=compress&cs=tinysrgb&w=300&h=380&fit=crop",
    bottom: "30%",
    left: "10%", // Rìa trái
    z: 10,
    rotate: "8deg",
    size: "w-24 h-32",
    alt: "Presentation",
    main: false,
  },
  {
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=400&fit=crop",
    top: "50%",
    left: "5%", // Cao hơn
    z: 15,
    rotate: "-4deg",
    size: "w-32 h-32",
    alt: "Student Life",
    main: false,
  },
  {
    src: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=400&h=400&fit=crop",
    top: "30%",
    left: "10%", // Cao nữa
    z: 14,
    rotate: "12deg",
    size: "w-20 h-20",
    alt: "Small Moment",
    main: false,
  },

  // --- 2 ẢNH ĐIỂM NHẤN (HƠI LỆCH TÂM) ---
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&h=700&fit=crop",
    top: "35%",
    left: "25%",
    z: 30,
    rotate: "2deg",
    size: "w-40 h-52", // Giảm kích thước một chút để thoáng giữa
    alt: "Hero 1",
    main: true,
  },
  {
    src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=500&fit=crop",
    bottom: "40%",
    right: "25%",
    z: 22,
    rotate: "-6deg",
    size: "w-30 h-40", // Giảm kích thước một chút
    alt: "Hero 2",
    main: true,
  }
];