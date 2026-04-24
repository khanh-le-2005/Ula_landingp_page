const { Campaign } = require("../models/campaignModel");
const getFullUrl = (req, siteKey, tag) => {
  const protocol = req.protocol === "http" && req.get("host").includes("localhost") ? "http" : "https";
  const host = req.get("host");
  const siteMap = { "tieng-duc": "/german", "tieng-trung": "/china", "main": "" };
  const path = siteMap[siteKey] || "";
  return `${protocol}://${host}${path}?campaign=${tag}`;
};

// Lấy tất cả chiến dịch (Admin) theo trang đang chọn
const getCampaigns = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const campaigns = await Campaign.find({ siteKey }).sort({ createdAt: -1 });
    
    // Thêm Link vào kết quả trả về
    const enhancedCampaigns = campaigns.map(c => ({
      ...c.toObject(),
      fullUrl: getFullUrl(req, siteKey, c.tag)
    }));

    res.status(200).json(enhancedCampaigns);
  } catch (err) {
    next(err);
  }
};

// Lấy 1 chiến dịch theo Tag (dùng cho Frontend resolve)
const getCampaignByTag = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const campaign = await Campaign.findOne({ 
      tag: req.params.tag, 
      siteKey, 
      isActive: true 
    });
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    res.status(200).json(campaign);
  } catch (err) {
    next(err);
  }
};

// Tạo chiến dịch mới (Admin)
const createCampaign = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const data = { ...req.body, siteKey }; // Gắn tag site vào campaign
    const campaign = new Campaign(data);
    await campaign.save();
    res.status(201).json({ 
      message: "Tạo chiến dịch thành công", 
      data: { ...campaign.toObject(), fullUrl: getFullUrl(req, siteKey, campaign.tag) } 
    });
  } catch (err) {
    next(err);
  }
};

// Cập nhật chiến dịch (Admin)
const updateCampaign = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, siteKey }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch hoặc bạn không có quyền sửa" });
    res.status(200).json({ 
      message: "Cập nhật thành công", 
      data: { ...campaign.toObject(), fullUrl: getFullUrl(req, siteKey, campaign.tag) } 
    });
  } catch (err) {
    next(err);
  }
};

// Xóa chiến dịch (Admin)
const deleteCampaign = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, siteKey });
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch" });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (err) {
    next(err);
  }
};

/**
 * Công cụ tạo Link Marketing hoàn chỉnh
 * POST /api/campaigns/generate-link
 */
const generateMarketingLink = async (req, res, next) => {
  try {
    const { tag, ref, utm_source, utm_medium, utm_campaign, utm_content } = req.body;
    const siteKey = req.siteKey;

    let baseUrl = getFullUrl(req, siteKey, tag || "default");
    
    // Nếu tag là default (trang gốc), ta xóa cái ?campaign= đi để link đẹp
    if (!tag) {
      baseUrl = baseUrl.split("?")[0];
    }

    const url = new URL(baseUrl);
    
    if (ref) url.searchParams.set("ref", ref);
    if (utm_source) url.searchParams.set("utm_source", utm_source);
    if (utm_medium) url.searchParams.set("utm_medium", utm_medium);
    if (utm_campaign) url.searchParams.set("utm_campaign", utm_campaign);
    if (utm_content) url.searchParams.set("utm_content", utm_content);

    res.status(200).json({
      siteKey,
      fullUrl: url.toString()
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getCampaigns, 
  getCampaignByTag, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign,
  generateMarketingLink
};
