const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                    // Tên KOC: "Yoncy Nguyen"
    code: { type: String, required: true, index: true },       // Mã ref: "KOC_Yoncy"
    email: { type: String },
    phone: { type: String },
    commissionRate: { type: Number, default: 0.1 },            // Hoa hồng: 10%
    isActive: { type: Boolean, default: true, index: true },   // Có đang hoạt động không
    notes: { type: String },
    siteKey: { type: String, required: true, default: "main" } // Trang hiển thị
  },
  { timestamps: true }
);

// Hợp nhất Index: Cho phép trùng mã KOC nếu khác siteKey
affiliateSchema.index({ code: 1, siteKey: 1 }, { unique: true });

const Affiliate = mongoose.model("Affiliate", affiliateSchema);

// Tìm KOC theo mã ref và siteKey
const findByCode = async (code, siteKey = null) => {
  const query = { code, isActive: true };
  if (siteKey) query.siteKey = siteKey;
  return await Affiliate.findOne(query);
};

module.exports = { Affiliate, findByCode };
