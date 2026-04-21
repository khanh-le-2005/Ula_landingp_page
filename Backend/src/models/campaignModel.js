const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true, unique: true }, // Dùng trên URL: ?campaign=dai_hoc_toan_bo
    name: { type: String, required: true },
    siteKey: { type: String, default: "main" },           // Gắn với subdomain nếu có
    variant: { type: String, default: "default" },

    // --- PHẦN NỘI DUNG THEO SECTION (chuẩn format Frontend) ---
    // JSON có cấu trúc: { "section_1_hero": {...}, "section_3_solution": [...], ... }
    // Chỉ cần điền những section muốn đổi. Section ko có sẽ giữ nguyên bản gốc.
    sections: { type: Map, of: mongoose.Schema.Types.Mixed },

    // --- PHẦN QUÀ NHÚNG TRỰC TIẾP (ưu tiên hơn prizeTag) ---
    prizes: [{
      option: { type: String, required: true },
      code: { type: String, required: true },
      backgroundColor: { type: String, default: "#2563eb" },
      textColor: { type: String, default: "white" },
      probability: { type: Number, default: 1 },
      order: { type: Number, default: 0 },
    }],

    // --- LỌC QUÀ THEO TAG (nếu ko dùng inline prizes) ---
    prizeTag: { type: String },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = { Campaign };
