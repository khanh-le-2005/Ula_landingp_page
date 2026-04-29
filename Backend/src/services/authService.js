const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

const login = async (username, password) => {
  const user = await userModel.findByUsername(username);

  if (!user) {
    throw new Error("Sai tài khoản hoặc mật khẩu");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Sai tài khoản hoặc mật khẩu");
  }

  const payload = { user_id: user.id };
  
  // 1. Access Token (1 ngày)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });

  // 2. Refresh Token / Reset Token (7 ngày)
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });

  return { 
    accessToken, 
    refreshToken, 
    user_info: { id: user.id, role: user.role } 
  };
};

const refreshToken = async (incomingToken) => {
  if (!incomingToken) {
    throw new Error("Missing Refresh Token");
  }

  const secret = process.env.JWT_REFRESH_SECRET_KEY;
  if (!secret) {
    throw new Error("Server Error: Missing Refresh Secret");
  }

  // 1. Verify token
  let decoded;
  try {
    decoded = jwt.verify(incomingToken, secret);
  } catch (error) {
    throw new Error("Refresh Token không hợp lệ hoặc đã hết hạn");
  }

  // 2. Kiểm tra user trong DB
  const user = await userModel.findById(decoded.user_id);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  // 3. Tạo cặp token mới
  const payload = { user_id: user.id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  const newRefreshToken = jwt.sign(payload, secret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken: newRefreshToken };
};

module.exports = { login, refreshToken };
