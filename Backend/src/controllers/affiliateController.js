const { Affiliate } = require("../models/affiliateModel");

// Lấy danh sách tất cả KOC (Admin/Editor)
const getAffiliates = async (req, res) => {
  try {
    const affiliates = await Affiliate.find().sort({ createdAt: -1 });
    res.status(200).json(affiliates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy 1 KOC theo ID
const getAffiliateById = async (req, res) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) return res.status(404).json({ message: "Không tìm thấy KOC" });
    res.status(200).json(affiliate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo KOC mới (Admin)
const createAffiliate = async (req, res) => {
  try {
    const affiliate = new Affiliate(req.body);
    await affiliate.save();
    res.status(201).json({ message: "Tạo KOC thành công", data: affiliate });
  } catch (error) {
    // Xử lý lỗi trùng mã Code
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mã giới thiệu (Code) này đã tồn tại" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Sửa KOC (Admin)
const updateAffiliate = async (req, res) => {
  try {
    const affiliate = await Affiliate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!affiliate) return res.status(404).json({ message: "Không tìm thấy KOC" });
    res.status(200).json({ message: "Cập nhật thành công", data: affiliate });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Mã giới thiệu (Code) này đã tồn tại" });
    }
    res.status(400).json({ message: error.message });
  }
};

// Xóa hoặc vô hiệu hóa KOC (Admin)
const deleteAffiliate = async (req, res) => {
  try {
    const affiliate = await Affiliate.findByIdAndDelete(req.params.id);
    if (!affiliate) return res.status(404).json({ message: "Không tìm thấy KOC" });
    res.status(200).json({ message: "Xóa KOC thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAffiliates,
  getAffiliateById,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
};
