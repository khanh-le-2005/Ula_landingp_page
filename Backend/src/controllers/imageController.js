const { Image } = require("../models/imageModel");
const imageService = require("../services/imageService");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// API lấy file ảnh để browser hiển thị (GET /api/images/:id)
const getImage = async (req, res, next) => {
  try {
    console.log(`[DEBUG] Fetching image with ID: ${req.params.id}`);
    const image = await Image.findById(req.params.id);
    if (!image) {
      console.log(`[DEBUG] Image ID not found in DB`);
      return res.status(404).json({ message: "Không tìm thấy ảnh" });
    }

    if (image.gridfsId) {
      // ẢNH MỚI: Truy xuất từ MongoDB GridFS
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
      });
      res.set("Content-Type", image.mimetype);
      const downloadStream = bucket.openDownloadStream(image.gridfsId);
      downloadStream.on("error", (err) => {
        console.error("[DEBUG] GridFS Error:", err);
        res.status(404).json({ message: "Lỗi khi tải ảnh từ cơ sở dữ liệu" });
      });
      return downloadStream.pipe(res);
    } else {
      // ẢNH CŨ: Fallback đọc từ thư mục vật lý (uploads/)
      const absolutePath = path.resolve(image.path);
      console.log(`[DEBUG] Resolving legacy image path: ${image.path} -> ${absolutePath}`);
      if (fs.existsSync(absolutePath)) {
        return res.sendFile(absolutePath);
      } else {
        console.log(`[DEBUG] File does not exist on disk: ${absolutePath}`);
        return res.status(404).json({ message: "File ảnh không tồn tại trên máy chủ" });
      }
    }
  } catch (error) {
    console.log(`[DEBUG] Error in getImage:`, error.message);
    next(error);
  }
};

// API xóa ảnh hoàn toàn (DELETE /api/images/:id)
const deleteImage = async (req, res, next) => {
  try {
    const success = await imageService.handleDeleteImage(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Không tìm thấy ảnh hoặc xảy ra lỗi khi xóa" });
    }
    res.status(200).json({ message: "Xóa ảnh thành công" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getImage,
  deleteImage,
};
