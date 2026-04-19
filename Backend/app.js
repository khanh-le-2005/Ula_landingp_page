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

const app = express();
app.use(cors({ origin: true, credentials: true })); // credentials: true để gửi Cookie
app.use(express.json());
app.use(cookieParser()); // Đọc Cookie từ request

// Kết nối database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/landing-page", lpRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/track", trackRoutes);     // Endpoint đặt Cookie tracking
app.use("/api/prizes", prizeRoutes);    // CRUD vòng quay may mắn
app.use("/api/affiliates", affiliateRoutes); // CRUD KOC/Affiliate

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on port ${PORT}`);
});
