const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String }, // Giữ lại cho ảnh cũ (backward compatibility)
    gridfsId: { type: mongoose.Schema.Types.ObjectId, default: null } // Lưu ObjectId từ GridFS cho ảnh mới
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = { Image };
