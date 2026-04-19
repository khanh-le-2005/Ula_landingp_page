const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const { verifyToken, checkRole } = require("../utils/authUtil");

// Public API để lấy ảnh lên web
router.get("/:id", imageController.getImage);

// Admin API để dọn dẹp rác (xóa ảnh)
router.delete("/:id", verifyToken, checkRole(["ADMIN", "EDITOR"]), imageController.deleteImage);

module.exports = router;
