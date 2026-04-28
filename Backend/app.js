const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const lpRoutes = require("./src/routes/lpRoutes");
const leadRoutes = require("./src/routes/leadRoutes");
const imageRoutes = require("./src/routes/imageRoutes");
const trackRoutes = require("./src/routes/trackRoutes");
const prizeRoutes = require("./src/routes/prizeRoutes");
const affiliateRoutes = require("./src/routes/affiliateRoutes");

const campaignRoutes = require("./src/routes/campaignRoutes");
const marketingLinkRoutes = require("./src/routes/marketingLinkRoutes");

const app = express();
app.use(cors({ origin: true, credentials: true })); // credentials: true để gửi Cookie
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser()); // Đọc Cookie từ request

// Site Middleware: Nhận diện /german, /china...
const siteMiddleware = require("./src/middlewares/siteMiddleware");
app.use(siteMiddleware);

// Kết nối database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authRoutes); // Alias cho frontend cũ
app.use("/api/landing-page", lpRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/track", trackRoutes);     // Endpoint đặt Cookie tracking
app.use("/api/prizes", prizeRoutes);    // CRUD vòng quay may mắn
app.use("/api/affiliates", affiliateRoutes); // CRUD KOC/Affiliate
app.use("/api/campaigns", campaignRoutes);   // Quản lý Chiến dịch/Tag
app.use("/api/marketing-links", marketingLinkRoutes); // Quản lý Link UTM

// Alias for legacy Admin Lucky Wheel
const prizeController = require("./src/controllers/prizeController");
const { verifyToken, checkRole } = require("./src/utils/authUtil");
app.get("/admin/lucky-wheel", verifyToken, checkRole(["ADMIN", "EDITOR"]), prizeController.getAllPrizes);
app.get("/api/admin/lucky-wheel", verifyToken, checkRole(["ADMIN", "EDITOR"]), prizeController.getAllPrizes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", env: "production" });
});

// 404 Handler for API routes
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: `API Endpoint ${req.originalUrl} không tồn tại.` });
});

// Global Error Middleware (Phải đặt ở cuối)
const errorMiddleware = require("./src/middlewares/errorMiddleware");
app.use(errorMiddleware);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on port ${PORT}`);
});
