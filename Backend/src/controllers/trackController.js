const { findByCode } = require("../models/affiliateModel");

/**
 * Middleware đặt Cookie tracking khi user click vào link KOC/UTM
 * Frontend gọi: GET /api/track?ref=KOC_Yoncy&utm_source=tiktok&...
 */
const trackClick = async (req, res) => {
  try {
    const { ref, utm_source, utm_medium, utm_campaign, utm_content } = req.query;

    const trackingData = {
      aff_id: null,
      utm: { source: utm_source, medium: utm_medium, campaign: utm_campaign, content: utm_content },
      created_at: new Date().toISOString(),
    };

    // Xác thực mã KOC có hợp lệ không
    if (ref) {
      const affiliate = await findByCode(ref);
      if (affiliate) {
        trackingData.aff_id = ref;
        trackingData.aff_name = affiliate.name;
      }
    }

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

    res.status(200).json({ message: "Tracking đã được lưu", data: trackingData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { trackClick };
