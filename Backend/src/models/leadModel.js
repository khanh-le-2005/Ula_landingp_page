const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    // Thông tin form linh hoạt: name, phone, email, course_name...
    formData: { type: Map, of: String, required: true },
    // Định danh Site/Topic
    siteKey: { type: String, default: "main", index: true },
    variant: { type: String, default: "default", index: true },
    // Affiliate / KOC
    affiliateId: { type: mongoose.Schema.Types.ObjectId, ref: "Affiliate", index: true },
    referralCode: { type: String, index: true }, // Lưu code gốc để tra cứu nhanh
    // Tracking UTM
    utm_source: { type: String, index: true },
    utm_medium: { type: String, index: true },
    utm_campaign: { type: String, index: true },
    utm_content: { type: String, index: true },
    // Timestamp tracking
    click_timestamp: { type: Date },              // Thời điểm click link KOC
    conversion_timestamp: { type: Date },         // Thời điểm submit form
    // Fraud Detection
    ip_address: { type: String, index: true },
    user_agent: { type: String },
    is_suspicious: { type: Boolean, default: false, index: true },
    fraud_reason: { type: String },
    // Trạng thái xử lý
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "ENROLLED", "CANCELLED"],
      default: "NEW",
      index: true,
    },
  },
  { timestamps: true }
);

leadSchema.index({ createdAt: -1 });
leadSchema.index({ affiliateId: 1, createdAt: -1 });
leadSchema.index({ ip_address: 1, createdAt: -1 });

const Lead = mongoose.model("Lead", leadSchema);
module.exports = { Lead };
