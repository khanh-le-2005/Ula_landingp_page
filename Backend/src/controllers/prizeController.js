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

// Vòng quay: Thuật toán chọn giải thưởng dựa trên tỷ lệ (probability)
const spinPrize = async (req, res) => {
  try {
    // Chỉ lấy các giải quay đang bật. Hỗ trợ lọc theo tag nếu gửi lên.
    const prizeFilter = { isActive: true };
    const prizeTag = req.body.prize_tag || req.query.prize_tag;
    if (prizeTag) {
      prizeFilter.tags = prizeTag;
    }
    const prizes = await Prize.find(prizeFilter);
    
    if (!prizes || prizes.length === 0) {
      return res.status(400).json({ message: "Vòng quay chưa có giảỉ thưởng" });
    }

    // Tổng tỷ lệ (Ví dụ: 10 + 50 + 40 = 100)
    const totalProbability = prizes.reduce((sum, prize) => sum + (prize.probability || 0), 0);
    
    // Nếu tất cả xác suất = 0, thì chia đều
    if (totalProbability <= 0) {
      const randomIndex = Math.floor(Math.random() * prizes.length);
      return res.status(200).json({ prizeId: prizes[randomIndex]._id });
    }

    // Thuật toán Random có trọng số
    let randomNum = Math.random() * totalProbability;
    let winningPrize = prizes[0];

    for (const prize of prizes) {
      if (randomNum < (prize.probability || 0)) {
        winningPrize = prize;
        break;
      }
      randomNum -= (prize.probability || 0);
    }

    // Backend chỉ trả về ID để Frontend thực hiện hiệu ứng quay
    console.log(`[SPIN] Người dùng quay trúng: ${winningPrize.option} (${winningPrize.code})`);
    res.status(200).json({ 
      prizeId: winningPrize._id, 
      option: winningPrize.option, 
      code: winningPrize.code 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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

module.exports = { getPrizes, getAllPrizes, createPrize, updatePrize, deletePrize, spinPrize };
