const express = require("express");
const router = express.Router();
const lpController = require("../controllers/lpController");
const { verifyToken, checkRole } = require("../utils/authUtil"); // Import từ utils
const upload = require("../utils/multerConfig");

router.get("/", lpController.getLP);

// API Sửa Content: Đi qua 2 chốt chặn ở utils trước khi vào controller
router.put(
  "/:section",
  verifyToken,
  checkRole(["ADMIN", "EDITOR"]),
  upload.any(),
  lpController.updateLP,
);

module.exports = router;
