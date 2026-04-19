const { Image } = require("../models/imageModel");
const imageService = require("../services/imageService");
const path = require("path");
const fs = require("fs");

// API lấy file ảnh để browser hiển thị (GET /api/images/:id)
const getImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Không tìm thấy ảnh" });
    }

    const absolutePath = path.resolve(image.path);
    if (fs.existsSync(absolutePath)) {
      res.sendFile(absolutePath);
    } else {
      res.status(404).json({ message: "File ảnh không tồn tại trên máy chủ" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// API xóa ảnh hoàn toàn (DELETE /api/images/:id)
const deleteImage = async (req, res) => {
  try {
    const success = await imageService.handleDeleteImage(req.params.id);
    if (!success) {
      return res.status(404).json({ message: "Không tìm thấy ảnh hoặc xảy ra lỗi khi xóa" });
    }
    res.status(200).json({ message: "Xóa ảnh thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getImage,
  deleteImage,
};

module.exports = {
  getImage,
  deleteImage,
};
