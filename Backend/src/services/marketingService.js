const axios = require("axios");
const crypto = require("crypto");

// Hàm băm SHA256 theo yêu cầu của Facebook CAPI
const sha256 = (value) => {
  if (!value) return undefined;
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
};

/**
 * Gửi sự kiện đăng ký (Lead) sang Facebook Conversion API (CAPI)
 * @param {Object} userData - Thông tin người dùng (email, phone, ip, user_agent...)
 * @param {string} eventName - Tên sự kiện (mặc định là 'Lead')
 */
const trackLeadEvent = async (userData, eventName = "Lead") => {
  try {
    const pixelId = process.env.FB_PIXEL_ID;
    const accessToken = process.env.FB_ACCESS_TOKEN;

    if (!pixelId || !accessToken || pixelId.includes("YOUR_") || accessToken.includes("YOUR_")) {
      console.warn("⚠️ FB CAPI chưa được cấu hình (đang dùng placeholder). Đang bỏ qua gửi event.");
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
            ph: [sha256(userData.phone)],
            em: [sha256(userData.email)],
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
