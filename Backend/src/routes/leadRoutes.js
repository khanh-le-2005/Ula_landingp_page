const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { verifyToken, checkRole } = require("../utils/authUtil");

// Public: Gửi form đăng ký
router.post("/submit", leadController.submitForward);

// Admin/Editor: Xem danh sách leads
router.get("/", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getLeads);

// Admin/Editor: Xem thống kê theo KOC
router.get("/stats", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getStats);

// Admin/Editor: Cập nhật trạng thái Lead (CRM)
router.put("/:id/status", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.updateLeadStatus);

// Admin: Xóa Lead rác
router.delete("/:id", verifyToken, checkRole(["ADMIN"]), leadController.deleteLead);

module.exports = router;
