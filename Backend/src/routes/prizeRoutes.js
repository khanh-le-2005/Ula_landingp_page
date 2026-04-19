const express = require("express");
const router = express.Router();
const { getPrizes, getAllPrizes, createPrize, updatePrize, deletePrize } = require("../controllers/prizeController");
const { verifyToken, checkRole } = require("../utils/authUtil");

// Public: Lấy giải thưởng đang active (dùng cho vòng quay hiển thị)
router.get("/", getPrizes);

// Admin: Lấy tất cả kể cả ẩn
router.get("/all", verifyToken, checkRole(["ADMIN", "EDITOR"]), getAllPrizes);

// Admin: Thêm giải thưởng mới
router.post("/", verifyToken, checkRole(["ADMIN"]), createPrize);

// Admin: Sửa giải thưởng
router.put("/:id", verifyToken, checkRole(["ADMIN"]), updatePrize);

// Admin: Xóa giải thưởng
router.delete("/:id", verifyToken, checkRole(["ADMIN"]), deletePrize);

module.exports = router;
