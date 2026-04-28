const nodemailer = require("nodemailer");

/**
 * Cấu hình Transporter dùng Gmail App Password
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

/**
 * Gửi email thông báo mã phần thưởng cho người dùng
 */
const sendRewardEmail = async (toEmail, prizeInfo) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASS) {
    console.warn("⚠️ Email service chưa được cấu hình. Bỏ qua gửi email.");
    return;
  }

  const { customerName, prizeName, prizeCode, sitePromoCode, discountText } = prizeInfo;

  const mailOptions = {
    from: `"Ula Landing Page" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `[Ula Edu] Quà tặng & ${discountText || 'Voucher'} dành riêng cho ${customerName}`,
    html: `
      <div style="background-color: #f1f5f9; padding: 40px 10px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
          <!-- Header Image/Banner Gradient -->
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Chúc mừng ${customerName}!</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Bạn đã nhận thành công gói ưu đãi từ Ula Education</p>
          </div>

          <div style="padding: 40px 30px;">
            <!-- Main Offer -->
            <div style="border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; text-align: center; background-color: #ffffff; position: relative; margin-bottom: 30px;">
              <span style="background-color: #dcfce7; color: #166534; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 99px; text-transform: uppercase; position: absolute; top: -12px; left: 50%; transform: translateX(-50%);">Ưu đãi độc quyền</span>
              <h3 style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600;">🎁 1. ${discountText || 'Ưu đãi học phí đặc biệt'}</h3>
              <div style="margin: 20px 0;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; color: #2563eb; letter-spacing: 4px; background: #f8fafc; padding: 10px 20px; border-radius: 12px; border: 2px dashed #cbd5e1; display: inline-block;">${sitePromoCode || 'ULA-SPECIAL'}</span>
              </div>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 25px;">Sử dụng mã này khi đăng ký để nhận ngay ưu đãi.<br>Hiệu lực trong vòng <strong style="color: #ef4444;">72 giờ</strong> kể từ bây giờ.</p>
              <a href="https://ulaedu.com/khoa-hoc" style="background-color: #2563eb; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; transition: all 0.2s ease;">Dùng ưu đãi ngay</a>
            </div>

            <!-- Lucky Spin Section -->
            ${prizeCode ? `
            <div style="background: linear-gradient(to right, #fff7ed, #ffedd5); border-radius: 16px; padding: 30px; border-left: 6px solid #f97316; margin-bottom: 30px;">
              <h3 style="margin-top: 0; color: #9a3412; font-size: 18px; font-weight: 600; display: flex; align-items: center;">🎡 2. Phần quà Vòng quay may mắn</h3>
              <div style="margin: 15px 0;">
                <p style="margin: 0; color: #7c2d12; font-size: 15px;">Phần quà bạn đã trúng:</p>
                <p style="margin: 5px 0 0 0; color: #c2410c; font-size: 20px; font-weight: 700;">${prizeName || 'Quà tặng bí mật'}</p>
              </div>
              <p style="margin: 15px 0 0 0; color: #9a3412; font-size: 14px; line-height: 1.5;">
                Mã trúng thưởng: <code style="font-weight: 700;">${prizeCode}</code><br>
                Gửi mã này cho tư vấn viên hoặc Hotline: <strong>0986 912 388</strong> để nhận quà.
              </p>
            </div>
            ` : ''}

            <!-- Footer Action -->
            <div style="background-color: #f8fafc; border-radius: 16px; padding: 30px; text-align: center;">
              <h4 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; font-weight: 600;">Sẵn sàng bắt đầu cùng Ula?</h4>
              <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">Lộ trình học tập chi tiết và nền tảng AI thông minh đang chờ đón bạn.</p>
              <a href="https://ulaedu.com/hoc-tap" style="background-color: #475569; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">Vào web học ngay</a>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 700;">Ula Education</p>
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">Khơi dậy tiềm năng ngôn ngữ trong bạn</p>
            <div style="margin-top: 20px; color: #94a3b8; font-size: 11px;">
              Email này được gửi tự động từ hệ thống Ula.<br>Vui lòng không phản hồi trực tiếp vào email này.
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Đã gửi email phần thưởng đến: ${toEmail}`);
  } catch (error) {
    console.error("❌ Lỗi khi gửi email:");
    console.error("- Message:", error.message);
    if (error.code === 'EAUTH') {
      console.error("- Nguyên nhân: Sai Username hoặc App Password. Hãy kiểm tra lại tệp .env");
    }
    console.error("- Chi tiết:", error);
  }
};

module.exports = { sendRewardEmail };
