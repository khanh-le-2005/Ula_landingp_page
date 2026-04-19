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

module.exports = { login };
