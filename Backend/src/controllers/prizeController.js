const { Prize } = require("../models/prizeModel");

// Lấy toàn bộ danh sách giải thưởng (public, dùng cho vòng quay)
const getPrizes = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const prizes = await Prize.find({ isActive: true, siteKey }).sort({ order: 1 });
    res.status(200).json(prizes);
  } catch (err) {
    next(err);
  }
};

// Admin: Lấy tất cả kể cả ẩn của site hiện tại
const getAllPrizes = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const prizes = await Prize.find({ siteKey }).sort({ order: 1 });
    res.status(200).json(prizes);
  } catch (err) {
    next(err);
  }
};

// Thêm giải thưởng mới cho đúng site
const createPrize = async (req, res, next) => {
  try {
    const data = { ...req.body, siteKey: req.siteKey };
    const prize = new Prize(data);
    await prize.save();
    res.status(201).json({ message: "Đã thêm giải thưởng", data: prize });
  } catch (err) {
    next(err);
  }
};

// Vòng quay: Thuật toán chọn giải thưởng dựa trên tỷ lệ (probability)
const spinPrize = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    // Chỉ lấy các giải quay thuộc đúng SITE đang truy cập
    const prizeFilter = { isActive: true, siteKey };
    const prizeTag = req.body.prize_tag || req.query.prize_tag;
    if (prizeTag) {
      prizeFilter.tags = prizeTag;
    }
    const prizes = await Prize.find(prizeFilter);
    
    if (!prizes || prizes.length === 0) {
      return res.status(400).json({ message: "Vòng quay chưa có giải thưởng cho trang này" });
    }

    // Tổng tỷ lệ
    const totalProbability = prizes.reduce((sum, prize) => sum + (prize.probability || 0), 0);
    
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

    console.log(`[SPIN] [${siteKey}] Người dùng trúng: ${winningPrize.option}`);
    res.status(200).json({ 
      prizeId: winningPrize._id, 
      option: winningPrize.option, 
      code: winningPrize.code 
    });
  } catch (err) {
    next(err);
  }
};

// Sửa giải thưởng (bảo mật theo siteKey)
const updatePrize = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const prize = await Prize.findOneAndUpdate(
      { _id: req.params.id, siteKey }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!prize) return res.status(404).json({ message: "Không tìm thấy giải thưởng ở trang này" });
    res.status(200).json({ message: "Đã cập nhật", data: prize });
  } catch (err) {
    next(err);
  }
};

// Xóa giải thưởng (bảo mật theo siteKey)
const deletePrize = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const prize = await Prize.findOneAndDelete({ _id: req.params.id, siteKey });
    if (!prize) return res.status(404).json({ message: "Không tìm thấy giải thưởng" });
    res.status(200).json({ message: "Đã xóa giải thưởng" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPrizes, getAllPrizes, createPrize, updatePrize, deletePrize, spinPrize };
