const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },                    // Tên KOC: "Yoncy Nguyen"
    code: { type: String, required: true, unique: true, index: true }, // Mã ref: "KOC_Yoncy"
    email: { type: String },
    phone: { type: String },
    commissionRate: { type: Number, default: 0.1 },            // Hoa hồng: 10%
    isActive: { type: Boolean, default: true, index: true },   // Có đang hoạt động không
    notes: { type: String },
  },
  { timestamps: true }
);

const Affiliate = mongoose.model("Affiliate", affiliateSchema);

// Tìm KOC theo mã ref
const findByCode = async (code) => {
  return await Affiliate.findOne({ code, isActive: true });
};

module.exports = { Affiliate, findByCode };
