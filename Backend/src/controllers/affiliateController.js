const { Affiliate } = require("../models/affiliateModel");

// Lấy danh sách tất cả KOC (Admin/Editor) theo trang đang chọn
const getAffiliates = async (req, res, next) => {
  try {
    const siteKey = req.query.siteKey || req.headers["x-site-key"] || req.siteKey; 
    const affiliates = await Affiliate.find({ siteKey }).sort({ createdAt: -1 });
    res.status(200).json(affiliates);
  } catch (error) {
    next(error);
  }
};

// Lấy 1 KOC theo ID
const getAffiliateById = async (req, res, next) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) return res.status(404).json({ message: "Không tìm thấy KOC" });
    res.status(200).json(affiliate);
  } catch (error) {
    next(error);
  }
};

// Tạo KOC mới (Admin)
const createAffiliate = async (req, res, next) => {
  try {
    const siteKey = req.body.siteKey || req.siteKey;
    const affiliate = new Affiliate(req.body);
    affiliate.siteKey = siteKey; // Gán cứng siteKey vào model
    await affiliate.save();
    res.status(201).json({ message: "Tạo KOC thành công", data: affiliate });
  } catch (error) {
    next(error);
  }
};

// Sửa KOC (Admin)
const updateAffiliate = async (req, res, next) => {
  try {
    const affiliate = await Affiliate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!affiliate) return res.status(404).json({ message: "Không tìm thấy KOC" });
    res.status(200).json({ message: "Cập nhật thành công", data: affiliate });
  } catch (error) {
    next(error);
  }
};

// Xóa hoặc vô hiệu hóa KOC (Admin)
const deleteAffiliate = async (req, res, next) => {
  try {
    const affiliate = await Affiliate.findByIdAndDelete(req.params.id);
    if (!affiliate) return res.status(404).json({ message: "Không tìm thấy KOC" });
    res.status(200).json({ message: "Xóa KOC thành công" });
  } catch (error) {
    next(error);
  }
};

// --- NEW: UTM Link Builder Utility ---
const generateLinks = async (req, res, next) => {
  try {
    const affiliate = await Affiliate.findById(req.params.id);
    if (!affiliate) return res.status(404).json({ message: "Không tìm thấy KOC" });

    // Lấy site từ query params (ví dụ: ?site=tieng-duc)
    const { site } = req.query;
    
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const code = affiliate.code;

    // Cấu hình các platform
    const platforms = [
      { name: "Facebook", source: "facebook", medium: "social" },
      { name: "TikTok", source: "tiktok", medium: "bio" },
      { name: "YouTube", source: "youtube", medium: "description" },
      { name: "Zalo/Direct", source: "zalo", medium: "direct" },
    ];

    // Cấu hình mapping giữa site key và path
    const siteMap = {
      "tieng-duc": "/german",
      "tieng-trung": "/chinese",
      "main": "/"
    };

    const links = [];
    
    // Nếu truyền site cụ thể, chỉ sinh link cho site đó. Nếu không truyền, sinh link cho tất cả.
    const sitesToGenerate = site ? [site] : Object.keys(siteMap);

    sitesToGenerate.forEach(sKey => {
      const path = siteMap[sKey] || "/";
      platforms.forEach(p => {
        links.push({
          platform: p.name + (site ? "" : ` (${sKey})`),
          site: sKey,
          url: `${baseUrl}${path}?ref=${code}&utm_source=${p.source}&utm_medium=${p.medium}&utm_campaign=koc_launch`
        });
      });
    });

    res.status(200).json({
      affiliateName: affiliate.name,
      referralCode: code,
      links,
    });
  } catch (error) {
    next(error);
  }
};

// --- NEW: Manual Custom Link Builder ---
const buildCustomLink = async (req, res, next) => {
  try {
    const { affiliateId, site, utm_source, utm_medium, utm_campaign, utm_content, custom_path } = req.body;
    
    if (!affiliateId) return res.status(400).json({ message: "Thiếu affiliateId" });
    
    const affiliate = await Affiliate.findById(affiliateId);
    if (!affiliate) return res.status(404).json({ message: "Không tìm thấy KOC" });

    const siteMap = {
      "tieng-duc": "/german",
      "tieng-trung": "/chinese",
      "main": "/"
    };

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const path = custom_path || siteMap[site] || "/";
    const url = new URL(path, baseUrl);
    
    url.searchParams.set("ref", affiliate.code);
    if (utm_source) url.searchParams.set("utm_source", utm_source);
    if (utm_medium) url.searchParams.set("utm_medium", utm_medium);
    if (utm_campaign) url.searchParams.set("utm_campaign", utm_campaign);
    if (utm_content) url.searchParams.set("utm_content", utm_content);

    res.status(200).json({
      affiliateName: affiliate.name,
      referralCode: affiliate.code,
      customUrl: url.toString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAffiliates,
  getAffiliateById,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
  generateLinks,
  buildCustomLink,
};
