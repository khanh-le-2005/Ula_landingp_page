const path = require("path");
const fs = require("fs");
const { Image } = require("../models/imageModel");

/**
 * Hàm trung tâm để xóa ảnh (cả file vật lý và record DB)
 * @param {string} imageId - ID của ảnh cần xóa
 * @returns {Promise<boolean>} - Trả về true nếu xóa thành công
 */
const handleDeleteImage = async (imageId) => {
  try {
    if (!imageId) return false;

    const image = await Image.findById(imageId);
    if (!image) return false;

    // 1. Xóa file vật lý
    const absolutePath = path.resolve(image.path);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    // 2. Xóa trong Database
    await Image.findByIdAndDelete(imageId);

    return true;
  } catch (error) {
    console.error("Lỗi khi xóa ảnh:", error.message);
    return false;
  }
};

module.exports = {
  handleDeleteImage,
};
