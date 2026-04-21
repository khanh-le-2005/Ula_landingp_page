const { Campaign } = require("../models/campaignModel");

// Lấy tất cả chiến dịch (Admin)
const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy 1 chiến dịch theo Tag (dùng cho Frontend resolve)
const getCampaignByTag = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ tag: req.params.tag, isActive: true });
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    res.status(200).json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo chiến dịch mới (Admin)
const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json({ message: "Tạo chiến dịch thành công", data: campaign });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Campaign Tag đã tồn tại. Vui lòng chọn tên khác." });
    }
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật chiến dịch (Admin)
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    res.status(200).json({ message: "Cập nhật thành công", data: campaign });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa chiến dịch (Admin)
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCampaigns, getCampaignByTag, createCampaign, updateCampaign, deleteCampaign };
