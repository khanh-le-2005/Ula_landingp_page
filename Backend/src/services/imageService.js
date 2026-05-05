const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { Image } = require("../models/imageModel");

/**
 * Hàm trung tâm để xóa ảnh (cả file từ ổ cứng/GridFS và record DB)
 * @param {string} imageId - ID của ảnh cần xóa
 * @returns {Promise<boolean>} - Trả về true nếu xóa thành công
 */
const handleDeleteImage = async (imageId) => {
  try {
    if (!imageId) return false;

    // Trích xuất ID nếu đầu vào là đường dẫn URL (vd: http://.../api/images/69e...)
    let extractedId = imageId;
    if (imageId.includes("/api/images/")) {
      extractedId = imageId.split("/api/images/").pop();
    }

    const image = await Image.findById(extractedId);
    if (!image) return false;

    if (image.gridfsId) {
      // ẢNH MỚI: Xóa trực tiếp từ MongoDB GridFS
      try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: "uploads"
        });
        await bucket.delete(image.gridfsId);
        console.log(`[CLEANUP] Deleted image from GridFS: ${image.gridfsId}`);
      } catch (err) {
        console.error(`[CLEANUP] Error deleting from GridFS:`, err.message);
      }
    } else {
      // ẢNH CŨ: Xóa file vật lý
      if (image.path) {
        const absolutePath = path.resolve(image.path);
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
          console.log(`[CLEANUP] Deleted legacy image file: ${absolutePath}`);
        }
      }
    }

    // Xóa metadata trong Database
    await Image.findByIdAndDelete(extractedId);

    return true;
  } catch (error) {
    console.error("Lỗi khi xóa ảnh:", error.message);
    return false;
  }
};

/**
 * Xử lý upload file (buffer) lên GridFS
 * @param {Object} file - File object từ multer.memoryStorage
 * @returns {Promise<mongoose.Types.ObjectId>}
 */
const uploadToGridFS = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
      });

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;

      const uploadStream = bucket.openUploadStream(filename, {
        contentType: file.mimetype
      });

      uploadStream.on('error', (err) => reject(err));
      uploadStream.on('finish', () => resolve(uploadStream.id));

      uploadStream.end(file.buffer);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  handleDeleteImage,
  uploadToGridFS,
};
