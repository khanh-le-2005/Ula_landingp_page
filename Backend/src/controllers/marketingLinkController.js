const { MarketingLink } = require("../models/marketingLinkModel");
const { Campaign } = require("../models/campaignModel");
const { Affiliate } = require("../models/affiliateModel");
const { Lead } = require("../models/leadModel");
const { MarketingClick } = require("../models/marketingClickModel");

// Hàm Helper để build Link chuẩn
const getFullUrl = (req, siteKey, tag) => {
  const protocol = req.protocol === "http" && req.get("host").includes("localhost") ? "http" : "https";
  const host = req.get("host");
  const siteMap = { "tieng-duc": "/german", "tieng-trung": "/chinese", "main": "" };
  const path = siteMap[siteKey] || "";
  let url = `${protocol}://${host}${path}`;
  if (tag) {
    url += `?campaign=${tag}`;
  }
  return url;
};

// Lấy danh sách toàn bộ Marketing Link kèm theo hiệu suất (Clicks, Leads, CR)
const getLinks = async (req, res, next) => {
  try {
    const siteKey = req.query.siteKey || req.headers["x-site-key"] || req.siteKey; 
    const links = await MarketingLink.find({ siteKey }).sort({ createdAt: -1 });

    const enrichedLinks = await Promise.all(links.map(async (link) => {
      // 1. Nhận diện link qua bộ UTM + Ref để lấy chỉ số hiệu suất
      const filter = {
        siteKey: link.siteKey,
        utm_source: link.utm_source || null,
        utm_medium: link.utm_medium || null,
        utm_campaign: link.utm_campaign || null,
        referralCode: link.ref || null
      };

      const [clicksCount, leadsCount, campaign] = await Promise.all([
        MarketingClick.countDocuments(filter),
        Lead.countDocuments(filter),
        link.tag ? Campaign.findOne({ tag: link.tag, siteKey: link.siteKey }) : null
      ]);
      
      const cr = clicksCount > 0 ? ((leadsCount / clicksCount) * 100).toFixed(1) : (leadsCount > 0 ? "100" : "0");
      
      return {
        ...link.toObject(),
        metrics: {
          clicks: clicksCount,
          leads: leadsCount,
          cr: cr + "%"
        },
        campaignInfo: campaign ? {
          promoCode: campaign.promoCode,
          discountText: campaign.discountText
        } : null
      };
    }));

    res.status(200).json(enrichedLinks);
  } catch (error) {
    next(error);
  }
};

// Lấy 1 Link cụ thể
const getLinkById = async (req, res, next) => {
  try {
    const link = await MarketingLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: "Không tìm thấy Link này." });
    res.status(200).json(link);
  } catch (error) {
    next(error);
  }
};

// Tạo một Link mới và render fullUrl
const createLink = async (req, res, next) => {
  try {
    const siteKey = req.body.siteKey || req.siteKey;
    const { name, tag, ref, utm_source, utm_medium, utm_campaign, utm_content, utm_term, isActive, notes } = req.body;

    // Logic render URL
    const baseUrl = getFullUrl(req, siteKey, tag);
    const urlObj = new URL(baseUrl);
    
    if (ref) urlObj.searchParams.set("ref", ref);
    if (utm_source) urlObj.searchParams.set("utm_source", utm_source);
    if (utm_medium) urlObj.searchParams.set("utm_medium", utm_medium);
    if (utm_campaign) urlObj.searchParams.set("utm_campaign", utm_campaign);
    if (utm_content) urlObj.searchParams.set("utm_content", utm_content);
    if (utm_term) urlObj.searchParams.set("utm_term", utm_term);

    const fullUrl = urlObj.toString();

    const newLink = new MarketingLink(req.body);
    newLink.siteKey = siteKey; // Gán cứng siteKey vào model
    newLink.fullUrl = fullUrl; // Gán URL đã render

    await newLink.save();
    res.status(201).json({ message: "Tạo link thành công", data: newLink });
  } catch (error) {
    next(error);
  }
};

// Cập nhật Link hiện tại
const updateLink = async (req, res, next) => {
  try {
    const siteKey = req.body.siteKey || req.siteKey;
    const { name, tag, ref, utm_source, utm_medium, utm_campaign, utm_content, utm_term, isActive, notes } = req.body;

    // Logic render lại URL nếu có thông số thay đổi
    const baseUrl = getFullUrl(req, siteKey, tag);
    const urlObj = new URL(baseUrl);
    
    if (ref) urlObj.searchParams.set("ref", ref);
    if (utm_source) urlObj.searchParams.set("utm_source", utm_source);
    if (utm_medium) urlObj.searchParams.set("utm_medium", utm_medium);
    if (utm_campaign) urlObj.searchParams.set("utm_campaign", utm_campaign);
    if (utm_content) urlObj.searchParams.set("utm_content", utm_content);
    if (utm_term) urlObj.searchParams.set("utm_term", utm_term);

    const fullUrl = urlObj.toString();

    const updatedLink = await MarketingLink.findByIdAndUpdate(
      req.params.id,
      { name, tag, ref, utm_source, utm_medium, utm_campaign, utm_content, utm_term, fullUrl, isActive, notes },
      { new: true, runValidators: true }
    );

    if (!updatedLink) return res.status(404).json({ message: "Không tìm thấy Link để cập nhật." });

    res.status(200).json({ message: "Cập nhật thành công", data: updatedLink });
  } catch (error) {
    next(error);
  }
};

// Xóa Link
const deleteLink = async (req, res, next) => {
  try {
    const deletedLink = await MarketingLink.findByIdAndDelete(req.params.id);
    if (!deletedLink) return res.status(404).json({ message: "Không tìm thấy Link." });
    res.status(200).json({ message: "Đã xóa link thành công." });
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách tùy chọn cho Frontend (Dropdowns)
const getLinkOptions = async (req, res, next) => {
  try {
    const siteKey = req.query.siteKey || req.siteKey;

    const [campaigns, kocs] = await Promise.all([
      Campaign.find({ siteKey, isActive: true }).select("tag name"),
      Affiliate.find({ siteKey, isActive: true }).select("code name"),
    ]);

    const options = {
      sites: [
        { key: "tieng-duc", label: "Tiếng Đức (Ula Germany)" },
        { key: "tieng-trung", label: "Tiếng Trung (Ula China)" },
      ],
      campaigns: campaigns.map((c) => ({ value: c.tag, label: c.name || c.tag })),
      kocs: kocs.map((k) => ({ value: k.code, label: k.name || k.code })),
      utmSources: ["facebook", "tiktok", "youtube", "google", "zalo", "email", "direct"],
      utmMediums: ["ads", "bio", "social", "post", "video", "search", "email"],
    };

    res.status(200).json(options);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLinks, getLinkById, createLink, updateLink, deleteLink, getLinkOptions };
