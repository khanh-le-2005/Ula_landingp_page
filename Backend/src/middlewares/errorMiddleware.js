/**
 * Global Error Handling Middleware
 * Tự động bắt mọi lỗi trong hệ thống và trả về JSON chuẩn, tránh làm sập Server
 */
const errorMiddleware = (err, req, res, next) => {
  // Log lỗi chi tiết để Admin kiểm tra log server
  console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack || err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Đã có lỗi xảy ra trên hệ thống.";

  // Xử lý lỗi Mongoose trùng lặp dữ liệu (Unique constraint)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `Dữ liệu ${field} đã tồn tại trên hệ thống.`;
  }

  // Xử lý lỗi Mongoose Validation
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(", ");
  }

  // Xử lý lỗi JWT (Tham khảo thêm nếu cần)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token không hợp lệ hoặc đã hết hạn.";
  }
  
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Chỉ hiện stack khi ở dev
  });
};

module.exports = errorMiddleware;
