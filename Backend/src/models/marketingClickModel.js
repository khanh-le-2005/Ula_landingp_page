const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema(
  {
    siteKey: { type: String, required: true, index: true },
    referralCode: { type: String, index: true },
    utm_source: { type: String, index: true },
    utm_medium: { type: String },
    utm_campaign: { type: String },
    utm_content: { type: String },
    fbc: { type: String },
    fbp: { type: String },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Index để hỗ trợ thống kê theo thời gian và UTM nhanh chóng
clickSchema.index({ createdAt: 1, siteKey: 1 });
clickSchema.index({ utm_source: 1, utm_medium: 1, utm_campaign: 1 });

const MarketingClick = mongoose.model("MarketingClick", clickSchema);

module.exports = { MarketingClick };
