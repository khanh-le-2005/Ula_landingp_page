const axios = require("axios");

/**
 * Xác thực Google reCAPTCHA v3
 * @param {string} token - Token nhận từ Frontend
 * @returns {Promise<Object>} - Kết quả ({ success: boolean, score: number })
 */
const verifyRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey || secretKey.includes("PLACEHOLDER")) {
      console.warn("⚠️ RECAPTCHA_SECRET_KEY chưa được cấu hình. Đang bỏ qua kiểm tra.");
      return { success: true, score: 1.0 };
    }

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi xác thực reCAPTCHA:", error.message);
    return { success: false, score: 0 };
  }
};

module.exports = { verifyRecaptcha };
