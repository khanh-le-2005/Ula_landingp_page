const authService = require("../services/authService");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    console.log(`[AUTH] ✅ Đăng nhập thành công: User "${username}"`);
    res.status(200).json({ message: "Thành công", data: result });
  } catch (error) {
    console.warn(`[AUTH] ❌ Đăng nhập thất bại: User "${req.body.username}" - Lý do: ${error.message}`);
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    console.log(`[AUTH] ✅ Refresh Token thành công`);
    res.status(200).json({ message: "Thành công", data: result });
  } catch (error) {
    console.warn(`[AUTH] ❌ Refresh Token thất bại - Lý do: ${error.message}`);
    next(error);
  }
};

module.exports = { login, refreshToken };
