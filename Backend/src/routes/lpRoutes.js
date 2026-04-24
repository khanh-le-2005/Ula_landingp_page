const express = require("express");
const router = express.Router();
const lpController = require("../controllers/lpController");
const { verifyToken, checkRole } = require("../utils/authUtil"); // Import từ utils
const upload = require("../utils/multerConfig");

router.get("/", lpController.getLP);

// API Lấy cấu hình gốc của Site (discountText, sitePromoCode)
router.get("/site-config", lpController.getSiteConfig);

// API Sửa cấu hình gốc của Site (Chỉ Admin/Editor)
router.put(
  "/site-config",
  verifyToken,
  checkRole(["ADMIN", "EDITOR"]),
  lpController.updateSiteConfig,
);

// API Sửa Content: Đi qua 2 chốt chặn ở utils trước khi vào controller
router.put(
  "/:section",
  verifyToken,
  checkRole(["ADMIN", "EDITOR"]),
  upload.any(),
  lpController.updateLP,
);

module.exports = router;
