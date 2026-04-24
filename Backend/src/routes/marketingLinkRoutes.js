const express = require("express");
const router = express.Router();
const marketingLinkController = require("../controllers/marketingLinkController");
const { verifyToken, checkRole } = require("../utils/authUtil");

// Bắt buộc phải là Quản trị viên hoặc Admin mới được quản lý link
router.use(verifyToken);
router.use(checkRole(["ADMIN", "EDITOR"]));

// Lấy toàn bộ danh sách link
router.get("/", marketingLinkController.getLinks);

// Lấy danh sách tùy chọn cho Dropdown (Site, Campaign, KOC...)
router.get("/meta-options", marketingLinkController.getLinkOptions);

// Lấy 1 link chi tiết
router.get("/:id", marketingLinkController.getLinkById);

// Tạo 1 link mới
router.post("/", marketingLinkController.createLink);

// Cập nhật link (chỉnh sửa thông số UTM, Tag...)
router.put("/:id", marketingLinkController.updateLink);

// Xóa link
router.delete("/:id", marketingLinkController.deleteLink);

module.exports = router;
