const express = require("express");
const router = express.Router();
const leadController = require("../controllers/leadController");
const { verifyToken, checkRole } = require("../utils/authUtil");

// Public: Gửi form đăng ký (Tự nhận diện)
router.post("/submit", (req, res, next) => {
  console.log("[ROUTE HIT] POST /api/leads/submit - body.siteKey =", req.body?.siteKey);
  return leadController.submitForward(req, res, next);
});

// Public: Gửi form đăng ký RIÊNG cho từng Site (Chắc chắn 100%)
router.post("/submit/german", leadController.submitGerman);
router.post("/submit/chinese", leadController.submitChinese);

// Admin/Editor: Xem danh sách leads
router.get("/", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getLeads);

// Admin/Editor: Xem thống kê theo KOC
router.get("/stats", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getStats);

// Admin/Editor: Xem thống kê chuyên sâu (Tag, UTM, KOC)
router.get("/stats/summary", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getComprehensiveStats);

// Admin/Editor: Xem thống kê UTM chi tiết (Source > Medium > Campaign)
router.get("/stats/utm", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getUtmStats);

// Admin/Editor: Cập nhật trạng thái Lead (CRM)
router.put("/:id/status", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.updateLeadStatus);

// Admin: Xóa Lead rác
router.delete("/:id", verifyToken, checkRole(["ADMIN"]), leadController.deleteLead);

module.exports = router;
