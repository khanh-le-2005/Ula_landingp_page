const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// 1. Hàm bóc tách Token lấy user_id
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Không có Token!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Token không hợp lệ/hết hạn!" });

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
