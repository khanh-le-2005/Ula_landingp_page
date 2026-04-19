const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const lpModel = require("./src/models/lpModel");
const { Prize } = require("./src/models/prizeModel");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Kết nối MongoDB...");

    // 1. Seed section pronounce (chỉ chứa ảnh)
    await lpModel.updateSection("pronounce", {
      imageUrl: "https://media.istockphoto.com/id/1370433251/photo/black-woman-sitting-at-desk-using-computer-writing-in-notebook.jpg?s=612x612&w=0&k=20&c=rHpy3cX4LVFtzLI4gyy0T-fNYdTeAcdNQgTmy9maAIA="
    }, "main", "default");
    console.log("✅ Seeded: pronounce section");

    // 2. Seed giải thưởng vòng quay (xóa cũ làm lại từ đầu để có trường code)
    await Prize.deleteMany({});
    
    const prizes = [
      { option: "Voucher 10%", backgroundColor: "#2563eb", textColor: "white", code: "ULA-VOUCHER10", order: 0 },
      { option: "Khóa học FREE", backgroundColor: "#004ac6", textColor: "white", code: "ULA-FREECOURSE", order: 1 },
      { option: "Bút ký ULA", backgroundColor: "#ba0a0d", textColor: "white", code: "ULA-PEN", order: 2 },
      { option: "Sổ tay Đức", backgroundColor: "#e63329", textColor: "white", code: "ULA-NOTEBOOK", order: 3 },
      { option: "Chúc bạn may mắn", backgroundColor: "#f5a623", textColor: "black", code: "ULA-LUCK", order: 4 },
      { option: "Tài liệu A1", backgroundColor: "#ffddb4", textColor: "black", code: "ULA-DOCS", order: 5 },
    ];
    await Prize.insertMany(prizes);
    console.log(`✅ Seeded: ${prizes.length} prizes`);

    console.log("✅ Seed xong!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  }
};

seed();
