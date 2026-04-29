const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// 1. Hàm bóc tách Token lấy user_id
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Không có Token!" });

  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    console.error("❌ [CRITICAL] JWT_SECRET_KEY chưa được cấu hình trong .env!");
    return res.status(500).json({ message: "Lỗi cấu hình server (Thiếu Secret Key)" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.warn(`⚠️ [AUTH] Token hết hạn lúc: ${err.expiredAt}`);
        return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
      }
      console.error(`❌ [AUTH] Token không hợp lệ: ${err.message}`);
      return res.status(403).json({ message: "Token không hợp lệ hoặc sai chữ ký!" });
    }

    req.user_id = decoded.user_id; // Nhét user_id vào request
    next();
  });
};

// 2. Hàm kiểm tra quyền từ Database
const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    const userId = req.user_id;

    // Gọi Model để tìm User thật trong DB
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Bạn không có quyền thao tác!" });
    }

    next();
  };
};

module.exports = { verifyToken, checkRole };
