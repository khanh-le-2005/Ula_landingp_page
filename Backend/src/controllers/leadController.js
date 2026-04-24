const { Lead } = require("../models/leadModel");
const { findByCode } = require("../models/affiliateModel");
const { Campaign } = require("../models/campaignModel");
const { sendRewardEmail } = require("../services/emailService");

/**
 * Đọc Cookie tracking từ request
 */
const getTrackingFromCookie = (req) => {
  try {
    const raw = req.cookies?.ula_tracking;
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Kiểm tra Fraud:
 * 1. Quá nhiều lead từ 1 IP trong 1 giờ (> 5 lead)
 * 2. Self-referral: KOC tự đăng ký cho chính mình
 */
const checkFraud = async (ip, formData, affiliateCode) => {
  const reasons = [];

  // 1. Kiểm tra IP spam
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await Lead.countDocuments({
    ip_address: ip,
    createdAt: { $gte: oneHourAgo },
  });
  if (recentCount >= 5) {
    reasons.push(`IP ${ip} đã gửi ${recentCount + 1} form trong 1 giờ`);
  }

  // 2. Self-referral: Kiểm tra SĐT hoặc email có trùng với KOC không
  if (affiliateCode) {
    const affiliate = await findByCode(affiliateCode);
    if (affiliate) {
      const phone = formData?.phone || formData?.sdt;
      const email = formData?.email;
      if ((phone && affiliate.phone === phone) || (email && affiliate.email === email)) {
        reasons.push(`Self-referral: KOC ${affiliateCode} tự đăng ký`);
      }
    }
  }

  return {
    isSuspicious: reasons.length > 0,
    reason: reasons.join("; "),
  };
};

// --- CORE LOGIC: Xử lý lưu Lead và gửi Email ---
const processLeadSubmission = async (req, res, next, overrideSiteKey = null) => {
  const leadService = require("../services/leadService");
  const { trackLeadEvent } = require("../services/marketingService");

  try {
    const { formData, utm_source, utm_medium, utm_campaign, utm_content, fbp: bodyFbp, fbc: bodyFbc } = req.body;

    const cookieTracking = getTrackingFromCookie(req);
    const fbp = bodyFbp || cookieTracking?.fbp || null;
    const fbc = bodyFbc || cookieTracking?.fbc || null;
    const referralCode = cookieTracking?.aff_id || req.body.referralCode || null;
    const utmSource = cookieTracking?.utm?.source || utm_source;
    const utmMedium = cookieTracking?.utm?.medium || utm_medium;
    const utmCampaign = cookieTracking?.utm?.campaign || utm_campaign;
    const utmContent = cookieTracking?.utm?.content || utm_content;
    const campaignTag = cookieTracking?.campaign || req.body.campaignTag || null;
    const clickTimestamp = cookieTracking?.created_at ? new Date(cookieTracking.created_at) : null;

    // Ưu tiên: overrideSiteKey (API riêng) -> body -> Middleware
    const siteKey = overrideSiteKey || req.body.siteKey || req.siteKey;
    console.log(`[DEBUG LEAD] siteKey = "${siteKey}", overrideSiteKey = "${overrideSiteKey}", body.siteKey = "${req.body.siteKey}"`);

    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ message: "Dữ liệu form không được để trống" });
    }

    let affiliateId = null;
    if (referralCode) {
      const affiliate = await findByCode(referralCode, siteKey);
      if (affiliate) affiliateId = affiliate._id;
    }

    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const { isSuspicious, reason } = await checkFraud(ip, formData, referralCode);

    const lead = await leadService.createLead({
      formData,
      siteKey,
      variant: req.query.variant || "default",
      affiliateId,
      referralCode,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      campaignTag: campaignTag,
      click_timestamp: clickTimestamp,
      conversion_timestamp: new Date(),
      ip_address: ip,
      user_agent: req.headers["user-agent"],
      is_suspicious: isSuspicious,
      fraud_reason: reason || undefined,
    });

    if (isSuspicious) {
      console.warn(`[LEAD] [${siteKey}] ⚠️ Cảnh báo Spam/Fraud: ${reason}`);
    }

    trackLeadEvent(
      {
        email: formData.email,
        phone: formData.phone || formData.sdt,
        ip: ip,
        user_agent: req.headers["user-agent"],
        fbp,
        fbc,
        referralId: affiliateId,
        utm_source: utmSource,
      },
      siteKey
    );

    if (formData && formData.email) {
      // 1. Khởi tạo giá trị quà tặng DỰ PHÒNG (Hardcoded)
      let sitePromoCode = "ULA-SPECIAL";
      let discountText = "Mã Giảm Giá Khóa Học";

      // 2. Lấy quà tặng GỐC từ Database (Cấu hình toàn trang)
      try {
        const { LandingPage } = require("../models/lpModel");
        console.log(`[DEBUG EMAIL] siteKey = "${siteKey}", tìm site_config...`);
        const siteConfig = await LandingPage.findOne({ siteKey, sectionKey: "site_config" });
        console.log(`[DEBUG EMAIL] siteConfig = `, JSON.stringify(siteConfig?.content));
        if (siteConfig && siteConfig.content) {
          sitePromoCode = siteConfig.content.sitePromoCode || sitePromoCode;
          discountText = siteConfig.content.discountText || discountText;
        } else {
          // Fallback theo siteKey nếu chưa có site_config trong DB
          if (siteKey === "tieng-trung") {
            sitePromoCode = "ULA45CHI";
            discountText = "Mã Giảm Giá 45% Khóa Học";
          } else if (siteKey === "tieng-duc") {
            sitePromoCode = "ULA40GER";
            discountText = "Mã Giảm Giá 40% Khóa Học";
          }
        }
      } catch (err) {
        console.error("[ERROR] Lỗi khi lấy site_config:", err);
      }

      // 3. Nếu ĐẶC BIỆT có Tag chiến dịch -> Ghi đè quà của Tag lên quà Gốc
      if (campaignTag) {
        const campaign = await Campaign.findOne({ tag: campaignTag, siteKey });
        if (campaign && campaign.promoCode) {
          sitePromoCode = campaign.promoCode;
          discountText = campaign.discountText || discountText;
        }
      }

      sendRewardEmail(formData.email, {
        customerName: formData.fullname || formData.name || "Khách hàng",
        prizeName: req.body.prizeName || "Quà tặng may mắn",
        prizeCode: req.body.prizeCode || "ULA-LUCKY",
        sitePromoCode: sitePromoCode,
        discountText: discountText
      });
    }

    res.status(201).json({ message: "Đăng ký thành công!", data: lead, site: siteKey });
  } catch (error) {
    next(error);
  }
};

// API 1: Submit Tiếng Đức
const submitGerman = async (req, res, next) => {
  return processLeadSubmission(req, res, next, "tieng-duc");
};

// API 2: Submit Tiếng Trung
const submitChinese = async (req, res, next) => {
  return processLeadSubmission(req, res, next, "tieng-trung");
};

// API Mặc định (Tự nhận diện qua Header/Subdomain)
const submitForward = async (req, res, next) => {
  return processLeadSubmission(req, res, next, null);
};

const getLeads = async (req, res, next) => {
  try {
    const { ref, tag, status } = req.query;
    
    // Luôn luôn lọc theo trang hiện tại để đảm bảo bảo mật (Tenant-isolation)
    const filter = { siteKey: req.siteKey };

    // Thêm các bộ lọc nếu Client có truyền lên
    if (ref) filter.referralCode = ref;
    if (tag) filter.campaignTag = tag;
    if (status) filter.status = status;

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

/**
 * Báo cáo thống kê Leads theo KOC
 * GET /api/leads/stats?from=2024-01-01&to=2024-12-31
 */
const getStats = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const siteKey = req.siteKey; // Lọc theo trang đang chọn

    const filter = { siteKey };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const stats = await Lead.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$referralCode",
          total: { $sum: 1 },
          suspicious: { $sum: { $cond: ["$is_suspicious", 1, 0] } },
          sources: { $addToSet: "$utm_source" },
          lastLead: { $max: "$createdAt" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const summary = {
      totalLeads: stats.reduce((s, r) => s + r.total, 0),
      totalSuspicious: stats.reduce((s, r) => s + r.suspicious, 0),
      byAffiliate: stats,
    };

    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};

/**
 * Thống kê chuyên sâu toàn diện (High-level)
 * GET /api/leads/stats/summary
 */
const getComprehensiveStats = async (req, res, next) => {
  try {
    const siteKey = req.siteKey; // Lọc theo trang đang chọn
    const match = { siteKey };

    // 1. Thống kê theo Campaign Tag (SL Tag)
    const byTag = await Lead.aggregate([
      { $match: match },
      { $group: { _id: "$campaignTag", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 2. Thống kê theo KOC (Referral Code)
    const byKoc = await Lead.aggregate([
      { $match: match },
      { $group: { _id: "$referralCode", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 3. Thống kê theo UTM Source (Nguồn traffic)
    const byUtmSource = await Lead.aggregate([
      { $match: match },
      { $group: { _id: "$utm_source", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      siteKey,
      timestamp: new Date(),
      stats: {
        byTag: byTag.map(i => ({ tag: i._id || "Tự nhiên/Mặc định", count: i.count })),
        byKoc: byKoc.map(i => ({ koc: i._id || "Không có KOC", count: i.count })),
        byUtmSource: byUtmSource.map(i => ({ source: i._id || "Direct/Unknown", count: i.count }))
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Thống kê UTM chuyên sâu (Source > Medium > Campaign)
 * GET /api/leads/stats/utm?from=2024-01-01&to=2024-12-31
 */
const getUtmStats = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const { from, to } = req.query;

    const match = { siteKey };
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const utmStats = await Lead.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            source: "$utm_source",
            medium: "$utm_medium",
            campaign: "$utm_campaign"
          },
          count: { $sum: 1 },
          lastLeadAt: { $max: "$createdAt" }
        }
      },
      {
        $project: {
          _id: 0,
          source: { $ifNull: ["$_id.source", "Direct/None"] },
          medium: { $ifNull: ["$_id.medium", "None"] },
          campaign: { $ifNull: ["$_id.campaign", "None"] },
          count: 1,
          lastLeadAt: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      siteKey,
      period: { from, to },
      totalDistinctUtms: utmStats.length,
      data: utmStats
    });
  } catch (error) {
    next(error);
  }
};

// Cập nhật trạng thái chìa khóa (CRM)
const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["NEW", "CONTACTED", "ENROLLED", "CANCELLED"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!lead) return res.status(404).json({ message: "Không tìm thấy Lead" });
    res.status(200).json({ message: "Cập nhật thành công", data: lead });
  } catch (error) {
    next(error);
  }
};

// Xóa Lead (Spam/Rác)
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Không tìm thấy Lead" });
    res.status(200).json({ message: "Đã xóa Lead" });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  submitForward, 
  submitGerman, 
  submitChinese, 
  getLeads, 
  getStats, 
  getComprehensiveStats,
  getUtmStats,
  updateLeadStatus, 
  deleteLead 
};
