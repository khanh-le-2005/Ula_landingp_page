const mongoose = require("mongoose");

const prizeSchema = new mongoose.Schema(
  {
    option: { type: String, required: true },        // Tên giải thưởng: "Voucher 10%"
    code: { type: String, required: true },          // Mã code trúng thưởng: "ULA-VOUCHER10"
    backgroundColor: { type: String, default: "#2563eb" }, // Màu nền ô quay
    textColor: { type: String, default: "white" },   // Màu chữ
    probability: { type: Number, default: 1 },        // Xác suất trúng (tương đối)
    isActive: { type: Boolean, default: true },       // Hiển thị hay ẩn ô này
    order: { type: Number, default: 0 },              // Thứ tự hiển thị trên vòng quay
    tags: [{ type: String }],                         // Gắn nhãn: ["VIP", "Học sinh giỏi", "Tháng 5"]
  },
  { timestamps: true }
);

const Prize = mongoose.model("Prize", prizeSchema);
module.exports = { Prize };
