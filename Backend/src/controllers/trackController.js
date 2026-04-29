const { findByCode } = require("../models/affiliateModel");
const { MarketingClick } = require("../models/marketingClickModel");

/**
 * Middleware đặt Cookie tracking và lưu Click vào DB khi user click vào link KOC/UTM
 * Frontend gọi: GET /api/track?ref=KOC_Yoncy&utm_source=tiktok&...
 */
const trackClick = async (req, res, next) => {
  try {
    // Hỗ trợ cả GET (?ref=...) lẫn POST ({ ref: ... })
    const params = { ...req.query, ...req.body };
    const { ref, campaign, utm_source, utm_medium, utm_campaign, utm_content, fbc, fbp } = params;

    const trackingData = {
      aff_id: null,
      siteKey: req.siteKey, // Lưu trang gốc mà khách truy cập
      campaign: campaign || null, 
      utm: { source: utm_source, medium: utm_medium, campaign: utm_campaign, content: utm_content },
      fbc: fbc || null,
      fbp: fbp || null,
      created_at: new Date().toISOString(),
    };

    // 1. Xác thực mã KOC có hợp lệ không (Lọc theo site)
    if (ref) {
      const affiliate = await findByCode(ref, req.siteKey);
      if (affiliate) {
        trackingData.aff_id = ref;
        trackingData.aff_name = affiliate.name;
      }
    }

    // 2. LƯU CLICK VÀO DATABASE để làm báo cáo CR
    await MarketingClick.create({
      siteKey: req.siteKey,
      referralCode: ref || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      fbc: fbc || null,
      fbp: fbp || null,
      ip: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    const cookieValue = JSON.stringify(trackingData);
    const maxAge = 60 * 24 * 60 * 60; // 60 ngày tính bằng giây

    // Set-Cookie: HttpOnly=false để Frontend đọc được nếu cần
    res.cookie("ula_tracking", cookieValue, {
      maxAge: maxAge * 1000, // milliseconds
      httpOnly: false,      // Frontend có thể đọc
      sameSite: "Lax",      // Cho phép từ redirect mạng xã hội
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    console.log(`[TRACK] Đã lưu CLICK & Cookie: ${ref || 'Tự nhiên'} (UTM Source: ${utm_source || 'Direct'})`);
    res.status(200).json({ message: "Tracking đã được lưu", data: trackingData });
  } catch (error) {
    next(error);
  }
};

module.exports = { trackClick };
