const { Prize } = require("../models/prizeModel");

// Lấy toàn bộ danh sách giải thưởng (public, dùng cho vòng quay)
const getPrizes = async (req, res) => {
  try {
    const prizes = await Prize.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(prizes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Lấy tất cả kể cả ẩn
const getAllPrizes = async (req, res) => {
  try {
    const prizes = await Prize.find().sort({ order: 1 });
    res.status(200).json(prizes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm giải thưởng mới
const createPrize = async (req, res) => {
  try {
    const prize = new Prize(req.body);
    await prize.save();
    res.status(201).json({ message: "Đã thêm giải thưởng", data: prize });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Sửa giải thưởng
const updatePrize = async (req, res) => {
  try {
    const prize = await Prize.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!prize) return res.status(404).json({ message: "Không tìm thấy giải thưởng" });
    res.status(200).json({ message: "Đã cập nhật", data: prize });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa giải thưởng
const deletePrize = async (req, res) => {
  try {
    const prize = await Prize.findByIdAndDelete(req.params.id);
    if (!prize) return res.status(404).json({ message: "Không tìm thấy giải thưởng" });
    res.status(200).json({ message: "Đã xóa giải thưởng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getPrizes, getAllPrizes, createPrize, updatePrize, deletePrize };
