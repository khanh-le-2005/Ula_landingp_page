const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel"); // Import Model User vào đây

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Kết nối MongoDB thành công!");

    // --- CHẠY HÀM AUTO-SETUP TÀI KHOẢN ADMIN ---
    await setupDefaultAdmin();
  } catch (error) {
    console.error("❌ Lỗi kết nối MongoDB:", error.message);
    process.exit(1); // Dừng server nếu lỗi DB
  }
};

// Hàm tự động tạo tài khoản nếu DB trống
const setupDefaultAdmin = async () => {
  try {
    // Đếm xem trong DB có bao nhiêu User
    const userCount = await User.countDocuments();

    // Nếu chưa có user nào (DB mới tạo)
    if (userCount === 0) {
      console.log(
        "⚠️ Database đang trống. Đang tiến hành tạo tài khoản Admin...",
      );

      const hashedPassword = await bcrypt.hash("123", 10);
      const adminUser = new User({
        username: "admin",
        password: hashedPassword, // Lưu mật khẩu đã mã hóa
        role: "ADMIN", // Cấp quyền cao nhất
      });

      await adminUser.save(); // Lưu vào MongoDB

      console.log("✅ Đã tạo tài khoản mặc định thành công!");
      console.log("👉 Username: admin");
      console.log("👉 Password: 123");
    } else {
      const admin = await User.findOne({ username: "admin" });
      if (admin && admin.password === "123") {
        console.log("⚠️ Phát hiện Admin chưa mã hóa mật khẩu. Đang tiến hành mã hóa...");
        const hashedPassword = await bcrypt.hash("123", 10);
        admin.password = hashedPassword;
        await admin.save();
        console.log("✅ Đã cập nhật mật khẩu mã hóa cho Admin!");
      }
    }
  } catch (error) {
    console.error("❌ Lỗi khi tự động tạo Admin:", error.message);
  }
};

module.exports = connectDB;
