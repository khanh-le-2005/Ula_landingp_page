const axios = require("axios");

/**
 * Gửi sự kiện đăng ký (Lead) sang Facebook Conversion API (CAPI)
 * @param {Object} userData - Thông tin người dùng (email, phone, ip, user_agent...)
 * @param {string} eventName - Tên sự kiện (mặc định là 'Lead')
 */
const trackLeadEvent = async (userData, eventName = "Lead") => {
  try {
    const pixelId = process.env.FB_PIXEL_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!pixelId || !accessToken || pixelId === "YOUR_PIXEL_ID") {
      console.warn("⚠️ FB CAPI chưa được cấu hình. Đang bỏ qua gửi event.");
      return;
    }

    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;

    const eventData = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          user_data: {
            // Facebook yêu cầu hash dữ liệu cá nhân (SHA256) hoặc gửi data thô nếu dùng https
            // Lưu ý: Tốt nhất nên hash email/phone tại đây nếu cần bảo mật cao hơn
            ph: [userData.phone], 
            em: [userData.email],
            client_ip_address: userData.ip,
            client_user_agent: userData.user_agent,
            fbc: userData.fbc,
            fbp: userData.fbp
          },
          custom_data: {
            referral_id: userData.referralId,
            utm_source: userData.utm_source
          }
        }
      ]
    };

    const response = await axios.post(url, eventData);
    console.log("✅ Đã gửi event sang FB CAPI:", response.data);
  } catch (error) {
    console.error("❌ Lỗi gửi FB CAPI:", error.response ? error.response.data : error.message);
  }
};

module.exports = { trackLeadEvent };
