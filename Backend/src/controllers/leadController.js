const { Lead } = require("../models/leadModel");
const { findByCode } = require("../models/affiliateModel");

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

const submitForward = async (req, res) => {
  const leadService = require("../services/leadService");
  const { verifyRecaptcha } = require("../services/captchaService");
  const { trackLeadEvent } = require("../services/marketingService");

  try {
    const { formData, utm_source, utm_medium, utm_campaign, utm_content, captchaToken, fbp, fbc } = req.body;

    // --- Đọc tracking từ Cookie (ưu tiên) hoặc body ---
    const cookieTracking = getTrackingFromCookie(req);
    const referralCode = cookieTracking?.aff_id || req.body.referralCode || null;
    const utmSource = cookieTracking?.utm?.source || utm_source;
    const utmMedium = cookieTracking?.utm?.medium || utm_medium;
    const utmCampaign = cookieTracking?.utm?.campaign || utm_campaign;
    const utmContent = cookieTracking?.utm?.content || utm_content;
    const clickTimestamp = cookieTracking?.created_at ? new Date(cookieTracking.created_at) : null;

    // --- Site Key ---
    const host = req.headers.host || "";
    let siteKey = "main";
    if (!host.includes("localhost") && !host.includes("127.0.0.1") && host.split(".").length > 2) {
      siteKey = host.split(".")[0];
    }

    // --- reCAPTCHA ---
    if (captchaToken) {
      const captchaResult = await verifyRecaptcha(captchaToken);
      if (!captchaResult.success || captchaResult.score < 0.5) {
        return res.status(403).json({ message: "Phát hiện hành vi spam. Vui lòng thử lại." });
      }
    }

    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ message: "Dữ liệu form không được để trống" });
    }

    // --- Xác thực ref KOC và lấy affiliateId ---
    let affiliateId = null;
    if (referralCode) {
      const affiliate = await findByCode(referralCode);
      if (affiliate) affiliateId = affiliate._id;
    }

    // --- Kiểm tra Fraud ---
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    const { isSuspicious, reason } = await checkFraud(ip, formData, referralCode);

    // --- Lưu Lead ---
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
      click_timestamp: clickTimestamp,
      conversion_timestamp: new Date(),
      ip_address: ip,
      user_agent: req.headers["user-agent"],
      is_suspicious: isSuspicious,
      fraud_reason: reason || undefined,
    });

    // --- Facebook CAPI (Bất đồng bộ, không block response) ---
    trackLeadEvent({
      phone: formData.phone || formData.sdt,
      email: formData.email,
      ip,
      user_agent: req.headers["user-agent"],
      fbp,
      fbc,
      referralCode,
      utm_source: utmSource,
    });

    res.status(201).json({ message: "Đăng ký thành công!", data: lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeads = async (req, res) => {
  const leadService = require("../services/leadService");
  try {
    const leads = await leadService.getAllLeads();
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Báo cáo thống kê Leads theo KOC
 * GET /api/leads/stats?from=2024-01-01&to=2024-12-31
 */
const getStats = async (req, res) => {
  try {
    const { from, to, siteKey } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }
    if (siteKey) filter.siteKey = siteKey;

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
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái chìa khóa (CRM)
const updateLeadStatus = async (req, res) => {
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
    res.status(400).json({ message: error.message });
  }
};

// Xóa Lead (Spam/Rác)
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: "Không tìm thấy Lead" });
    res.status(200).json({ message: "Đã xóa Lead" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitForward, getLeads, getStats, updateLeadStatus, deleteLead };
