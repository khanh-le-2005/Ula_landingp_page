const mongoose = require("mongoose");

const marketingLinkSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },          // Tên gợi nhớ (vd: Link chạy FB tháng 5)
    siteKey: { type: String, required: true },       // tieng-duc hoặc tieng-trung
    tag: { type: String },                           // Campaign Tag
    ref: { type: String },                           // KOC / Affiliate ID
    utm_source: { type: String },
    utm_medium: { type: String },
    utm_campaign: { type: String },
    utm_content: { type: String },
    utm_term: { type: String },
    fullUrl: { type: String, required: true },       // Đường link đầy đủ đã render
    isActive: { type: Boolean, default: true },
    notes: { type: String }
  },
  { timestamps: true }
);

const MarketingLink = mongoose.model("MarketingLink", marketingLinkSchema);
module.exports = { MarketingLink };
