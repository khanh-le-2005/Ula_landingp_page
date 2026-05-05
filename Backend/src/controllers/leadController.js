const { Lead } = require("../models/leadModel");
const { MarketingClick } = require("../models/marketingClickModel");
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
        prizeName: req.body.prizeName, // Để null nếu không có
        prizeCode: req.body.prizeCode, // Để null nếu không có
        sitePromoCode: sitePromoCode,
        discountText: discountText,
        siteKey: siteKey // Để email service tự quyết định link dựa trên siteKey
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
    const { 
      ref, tag, status, 
      utm_source, utm_medium, utm_campaign,
      from, to,
      is_suspicious,
      search 
    } = req.query;
    
    // Luôn luôn lọc theo trang hiện tại (Tenant-isolation)
    const filter = { siteKey: req.siteKey };

    // 1. Lọc theo mã giới thiệu & chiến dịch
    if (ref) filter.referralCode = ref;
    if (tag) filter.campaignTag = tag;
    if (status) filter.status = status;

    // 2. Lọc theo UTM Parameters (CRM Readiness)
    if (utm_source) filter.utm_source = utm_source;
    if (utm_medium) filter.utm_medium = utm_medium;
    if (utm_campaign) filter.utm_campaign = utm_campaign;

    // 3. Lọc theo trạng thái nghi ngờ
    if (is_suspicious !== undefined) {
      filter.is_suspicious = is_suspicious === 'true';
    }

    // 4. Lọc theo khoảng thời gian (createdAt)
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // 5. Tìm kiếm theo từ khóa (Search)
    if (search) {
      filter.$or = [
        { "formData.fullname": { $regex: search, $options: "i" } },
        { "formData.name": { $regex: search, $options: "i" } },
        { "formData.email": { $regex: search, $options: "i" } },
        { "formData.phone": { $regex: search, $options: "i" } },
        { "formData.sdt": { $regex: search, $options: "i" } },
        { "referralCode": { $regex: search, $options: "i" } }
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    
    // Đếm tổng số lượng trả về cho Dashboard
    const summary = {
      count: leads.length,
      siteKey: req.siteKey,
      query: req.query
    };

    res.status(200).json({ summary, data: leads });
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

// Cập nhật thông tin Lead (CRM: Trạng thái, Ghi chú, Phân công)
const updateLead = async (req, res, next) => {
  try {
    const { status, notes, assignedTo } = req.body;
    const updateData = {};

    if (status) {
      const validStatuses = ["NEW", "CONTACTED", "ENROLLED", "CANCELLED"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }
      updateData.status = status;
    }

    if (notes !== undefined) updateData.notes = notes;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    
    // Ghi nhận người cập nhật (từ token auth)
    updateData.lastUpdatedBy = req.user?.email || "Admin";

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
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

// 1. Thống kê xu hướng (Trends) - Theo ngày trong 30 ngày qua
const getTrendsStats = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Lead.aggregate([
      { 
        $match: { 
          siteKey, 
          createdAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          leads: { $sum: 1 },
          suspicious: { $sum: { $cond: ["$is_suspicious", 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill zeros for missing days
    const fullTrends = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = trends.find(t => t._id === dateStr);
      fullTrends.push(found || { _id: dateStr, leads: 0, suspicious: 0 });
    }

    res.status(200).json({ siteKey, trends: fullTrends });
  } catch (error) {
    next(error);
  }
};

// 2. Thống kê tỷ lệ chuyển đổi (Conversion) - Theo trạng thái
const getConversionStats = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const stats = await Lead.aggregate([
      { $match: { siteKey } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalLeads = stats.reduce((sum, s) => sum + s.count, 0);
    const validStatuses = ["NEW", "CONTACTED", "ENROLLED", "CANCELLED"];
    
    const breakdown = validStatuses.map(status => {
      const found = stats.find(s => s._id === status);
      const count = found ? found.count : 0;
      return {
        status,
        count: count,
        percentage: totalLeads > 0 ? ((count / totalLeads) * 100).toFixed(2) + '%' : '0%'
      };
    });

    res.status(200).json({ siteKey, totalLeads, breakdown });
  } catch (error) {
    next(error);
  }
};

// 3. Thống kê hiệu suất KOC (KOC Performance)
const getKocPerformanceStats = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const performance = await Lead.aggregate([
      { $match: { siteKey, referralCode: { $ne: null } } },
      {
        $group: {
          _id: "$referralCode",
          totalLeads: { $sum: 1 },
          enrolled: { $sum: { $cond: [{ $eq: ["$status", "ENROLLED"] }, 1, 0] } },
          suspicious: { $sum: { $cond: ["$is_suspicious", 1, 0] } },
          lastLeadAt: { $max: "$createdAt" }
        }
      },
      {
        $project: {
          koc: "$_id",
          totalLeads: 1,
          enrolled: 1,
          suspicious: 1,
          lastLeadAt: 1,
          conversionRate: {
            $cond: [
              { $gt: ["$totalLeads", 0] },
              { $multiply: [{ $divide: ["$enrolled", "$totalLeads"] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalLeads: -1 } }
    ]);

    res.status(200).json({ siteKey, performance });
  } catch (error) {
    next(error);
  }
};

// 4. Báo cáo Marketing chuyên sâu (Clicks, Leads, CR) - THEO YÊU CẦU
const getMarketingStats = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const { from, to, source, medium, campaign, ref } = req.query;

    const filter = { siteKey };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // Thêm lọc theo UTM nếu có
    if (source) filter.utm_source = source;
    if (medium) filter.utm_medium = medium;
    if (campaign) filter.utm_campaign = campaign;
    if (ref) filter.referralCode = ref;

    // 1. Thống kê CLICKS (truy cập) từ MarketingClick collection
    const clicksStats = await MarketingClick.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            source: "$utm_source",
            medium: "$utm_medium",
            campaign: "$utm_campaign",
            ref: "$referralCode"
          },
          clicks: { $sum: 1 }
        }
      }
    ]);

    // 2. Thống kê LEADS (chuyển đổi) từ Lead collection
    const leadsStats = await Lead.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            source: "$utm_source",
            medium: "$utm_medium",
            campaign: "$utm_campaign",
            ref: "$referralCode"
          },
          leads: { $sum: 1 }
        }
      }
    ]);

    // 3. Hợp nhất dữ liệu (Merging)
    const statsMap = new Map();

    clicksStats.forEach(c => {
      const key = JSON.stringify(c._id);
      statsMap.set(key, { ...c._id, clicks: c.clicks, leads: 0 });
    });

    leadsStats.forEach(l => {
      const key = JSON.stringify(l._id);
      if (statsMap.has(key)) {
        const item = statsMap.get(key);
        item.leads = l.leads;
      } else {
        statsMap.set(key, { ...l._id, clicks: 0, leads: l.leads });
      }
    });

    // Chuyển sang array và tính CR
    const result = Array.from(statsMap.values()).map(item => {
      const cr = item.clicks > 0 ? ((item.leads / item.clicks) * 100).toFixed(1) : (item.leads > 0 ? "100" : "0");
      return {
        source: item.source || "Direct/None",
        medium: item.medium || "None",
        campaign: item.campaign || "None",
        ref: item.ref || "Direct/None",
        clicks: item.clicks,
        leads: item.leads,
        cr: cr + "%"
      };
    });

    // Sắp xếp theo số lead giảm dần
    result.sort((a, b) => b.leads - a.leads);

    // Tính tổng quan (Summary)
    const totalVisits = result.reduce((s, i) => s + i.clicks, 0);
    const totalLeads = result.reduce((s, i) => s + i.leads, 0);
    const totalCR = totalVisits > 0 ? ((totalLeads / totalVisits) * 100).toFixed(2) : "0";

    res.status(200).json({
      siteKey,
      period: { from, to },
      summary: {
        totalVisits,
        totalLeads,
        totalCR: totalCR + "%"
      },
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Báo cáo Dạng Biểu Đồ (Charts) - Dành riêng cho Frontend hiển thị Chart.js/Recharts
 * Trả về 3 bộ dữ liệu: Clicks, Leads, CR theo từng Link UTM/Ref (Tên link cụ thể)
 */
const getChartStats = async (req, res, next) => {
  try {
    const siteKey = req.siteKey;
    const { from, to } = req.query;

    const filter = { siteKey };
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // 1. Lấy danh sách các Marketing Link đã tạo để có Tên hiển thị (Labels)
    const { MarketingLink } = require("../models/marketingLinkModel");
    const marketingLinks = await MarketingLink.find({ siteKey });

    // 2. Thực hiện Aggregation song song để lấy Clicks và Leads
    const [clicksStats, leadsStats] = await Promise.all([
      MarketingClick.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              s: "$utm_source",
              m: "$utm_medium",
              c: "$utm_campaign",
              ct: "$utm_content",
              t: "$utm_term",
              r: "$referralCode"
            },
            count: { $sum: 1 }
          }
        }
      ]),
      Lead.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              s: "$utm_source",
              m: "$utm_medium",
              c: "$utm_campaign",
              ct: "$utm_content",
              t: "$utm_term",
              r: "$referralCode"
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // 3. Hợp nhất kết quả bằng Map theo ID bộ UTM (Identity Hash)
    const statsMap = new Map();
    
    // Helper để tạo Key duy nhất cho bộ UTM (Bao gồm cả content và term để siêu chính xác)
    const getUtmKey = (id) => JSON.stringify({ 
      s: id.s, m: id.m, c: id.c, ct: id.ct, t: id.t, r: id.r 
    });

    clicksStats.forEach(c => {
      statsMap.set(getUtmKey(c._id), { clicks: c.count, leads: 0 });
    });

    leadsStats.forEach(l => {
      const key = getUtmKey(l._id);
      if (statsMap.has(key)) {
        statsMap.get(key).leads = l.count;
      } else {
        statsMap.set(key, { clicks: 0, leads: l.count });
      }
    });

    // 4. Ánh xạ dữ liệu Thống kê vào danh sách MarketingLink (Dùng Tên Link làm Label)
    const chartData = marketingLinks.map(link => {
      const utmKey = JSON.stringify({
        s: link.utm_source || null,
        m: link.utm_medium || null,
        c: link.utm_campaign || null,
        ct: link.utm_content || null,
        t: link.utm_term || null,
        r: link.ref || null
      });

      const stats = statsMap.get(utmKey) || { clicks: 0, leads: 0 };
      // Xóa khỏi map để lát nữa xử lý các link "ngoài hệ thống" (vãng lai)
      statsMap.delete(utmKey);

      return {
        label: link.name || "Chưa đặt tên",
        clicks: stats.clicks,
        leads: stats.leads
      };
    });

    // 5. Gom các link "Vãng lai" (không có trong quản lý Link) 
    statsMap.forEach((stats, key) => {
      const id = JSON.parse(key);
      if (stats.clicks > 0 || stats.leads > 0) {
        chartData.push({
          label: `Other: ${id.s || 'direct'} / ${id.r || 'none'}`,
          clicks: stats.clicks,
          leads: stats.leads
        });
      }
    });

    // 6. Sắp xếp và lấy Top 15
    const topData = chartData
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 15);

    const labels = topData.map(d => d.label);
    const clicks = topData.map(d => d.clicks);
    const leads = topData.map(d => d.leads);
    const cr = topData.map(d => d.clicks > 0 ? parseFloat(((d.leads / d.clicks) * 100).toFixed(1)) : (d.leads > 0 ? 100 : 0));

    res.status(200).json({
      siteKey,
      labels,
      datasets: {
        clicks,
        leads,
        cr
      },
      raw: topData
    });
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
  getTrendsStats,
  getConversionStats,
  getKocPerformanceStats,
  getMarketingStats,
  getChartStats,
  updateLead, 
  deleteLead 
};
