const mongoose = require("mongoose");

// 1. Định nghĩa cấu trúc bảng User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "EDITOR", "USER"], default: "USER", index: true },
});

const User = mongoose.model("User", userSchema);

// 2. Viết các hàm giao tiếp DB (để Service gọi)
const findByUsername = async (username) => {
  return await User.findOne({ username }); // Lệnh của Mongoose
};

const findById = async (id) => {
  return await User.findById(id); // Lệnh của Mongoose
};

module.exports = { User, findByUsername, findById };
