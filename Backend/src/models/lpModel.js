const mongoose = require("mongoose");

// 1. Định nghĩa bảng LandingPage
const lpSchema = new mongoose.Schema(
  {
    sectionKey: { type: String, required: true, index: true }, // vd: 'section_1_hero'
    siteKey: { type: String, default: "main", index: true }, // vd: 'koc-an', 'default'
    variant: { type: String, default: "default", index: true }, // vd: 'hanoi', 'hcm'
    content: { type: Object, required: true }, // Chứa headline, cta...
  },
  { timestamps: true },
);

// Hợp nhất Index để tìm nhanh theo Site và Section
lpSchema.index({ siteKey: 1, sectionKey: 1, variant: 1 }, { unique: true });

lpSchema.index({ createdAt: 1 });
lpSchema.index({ updatedAt: 1 });

const LandingPage = mongoose.model("LandingPage", lpSchema);

// 2. Các hàm giao tiếp DB
const getAllData = async (siteKey = "main", variant = "default") => {
  const data = await LandingPage.find({ siteKey, variant }).sort({ sectionKey: 1 });
  // Biến đổi array thành object cho giống chuẩn cũ trả về
  const result = {};
  data.forEach((item) => {
    result[item.sectionKey] = item.content;
  });
  return result;
};

const updateSection = async (sectionName, newData, siteKey = "main", variant = "default") => {
  // Tìm section và cập nhật, nếu chưa có thì upsert (tạo mới)
  const updated = await LandingPage.findOneAndUpdate(
    { sectionKey: sectionName, siteKey, variant },
    { $set: { content: newData } },
    { new: true, upsert: true }, // upsert: true giúp tạo mới nếu DB chưa có
  );
  return updated.content;
};

module.exports = { LandingPage, getAllData, updateSection };
