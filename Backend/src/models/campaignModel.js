const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    name: { type: String, required: true },
    sections: { type: Object, default: {} }, // Dữ liệu ghi đè nội dung LP
    prizes: [
      {
        option: String,
        code: String,
        probability: Number,
        backgroundColor: String,
        textColor: String,
        order: { type: Number, default: 0 }
      }
    ],
    prizeTag: { type: String },              // Nhãn bộ giải thưởng (nếu muốn dùng chung)
    discountText: { type: String },          // Nội dung giảm giá cho Email (VD: Giảm 40%)
    promoCode: { type: String },             // Mã khuyến mãi cho Email (VD: ULA-OFFER-40)
    isActive: { type: Boolean, default: true },
    siteKey: { type: String, default: "main" }
  },
  { timestamps: true }
);

// Hợp nhất Index: Cho phép trùng tag ở các Site khác nhau
campaignSchema.index({ tag: 1, siteKey: 1 }, { unique: true });

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = { Campaign };
