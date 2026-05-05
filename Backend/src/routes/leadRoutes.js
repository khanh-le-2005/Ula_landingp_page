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

// Admin/Editor: Thống kê xu hướng (Trends)
router.get("/stats/trends", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getTrendsStats);

// Admin/Editor: Thống kê tỷ lệ chuyển đổi (Conversion)
router.get("/stats/conversion", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getConversionStats);

// Admin/Editor: Thống kê hiệu suất KOC
router.get("/stats/kocs", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getKocPerformanceStats);

// Admin/Editor: Thống kê hiệu suất marketing (Clicks, Leads, CR)
router.get("/stats/marketing", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getMarketingStats);

// Admin/Editor: Dữ liệu cho BIỂU ĐỒ (Charts)
router.get("/stats/charts", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.getChartStats);

// Admin/Editor: Cập nhật Lead (CRM: Status, Notes, Assigned)
router.put("/:id", verifyToken, checkRole(["ADMIN", "EDITOR"]), leadController.updateLead);

// Admin: Xóa Lead rác
router.delete("/:id", verifyToken, checkRole(["ADMIN"]), leadController.deleteLead);

module.exports = router;
