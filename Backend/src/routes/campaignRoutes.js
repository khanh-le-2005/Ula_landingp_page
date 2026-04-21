const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");
const { verifyToken, checkRole } = require("../utils/authUtil");

// --- Public ---
// Frontend dùng để kiểm tra chiến dịch có tồn tại không (tùy chọn)
router.get("/tag/:tag", campaignController.getCampaignByTag);

// --- Admin / Editor ---
router.get("/", verifyToken, checkRole(["ADMIN", "EDITOR"]), campaignController.getCampaigns);
router.post("/", verifyToken, checkRole(["ADMIN"]), campaignController.createCampaign);
router.put("/:id", verifyToken, checkRole(["ADMIN"]), campaignController.updateCampaign);
router.delete("/:id", verifyToken, checkRole(["ADMIN"]), campaignController.deleteCampaign);

module.exports = router;
