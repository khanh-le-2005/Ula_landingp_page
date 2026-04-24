const express = require("express");
const router = express.Router();
const { trackClick } = require("../controllers/trackController");

// Public: Đặt Cookie khi user click link KOC
// Frontend gọi GET: fetch('/api/track?' + window.location.search, { credentials: 'include' })
// Frontend gọi POST: fetch('/api/track', { method: 'POST', body: JSON.stringify({...params}) })
router.get("/", trackClick);
router.post("/", trackClick);  // Hỗ trợ cả POST cho Frontend

module.exports = router;
