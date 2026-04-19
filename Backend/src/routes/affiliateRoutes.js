const express = require("express");
const router = express.Router();
const affiliateController = require("../controllers/affiliateController");
const { verifyToken, checkRole } = require("../utils/authUtil");

// Lấy danh sách KOC (Admin/Editor)
router.get("/", verifyToken, checkRole(["ADMIN", "EDITOR"]), affiliateController.getAffiliates);

// Lấy chi tiết 1 KOC (Admin/Editor)
router.get("/:id", verifyToken, checkRole(["ADMIN", "EDITOR"]), affiliateController.getAffiliateById);

// Thêm KOC mới (Admin)
router.post("/", verifyToken, checkRole(["ADMIN"]), affiliateController.createAffiliate);

// Sửa KOC (Admin)
router.put("/:id", verifyToken, checkRole(["ADMIN"]), affiliateController.updateAffiliate);

// Xóa KOC (Admin)
router.delete("/:id", verifyToken, checkRole(["ADMIN"]), affiliateController.deleteAffiliate);

module.exports = router;
