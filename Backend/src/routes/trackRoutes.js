const express = require("express");
const router = express.Router();
const { trackClick } = require("../controllers/trackController");

// Public: Đặt Cookie khi user click link KOC
// Frontend gọi: fetch('/api/track?' + window.location.search, { credentials: 'include' })
router.get("/", trackClick);

module.exports = router;
