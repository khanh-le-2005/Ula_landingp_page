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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 30px; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0;">Chúc mừng ${customerName}!</h1>
          <p style="font-size: 16px; color: #666;">Cảm ơn bạn đã quan tâm đến Ula. Dưới đây là các phần quà dành riêng cho bạn:</p>
        </div>

        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 5px solid #2563eb; margin-bottom: 25px;">
          <h3 style="margin-top: 0; color: #1e40af;">🎁 1. ${discountText || 'Mã Ưu Đãi Khóa Học'}:</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #1d4ed8; letter-spacing: 2px;">${sitePromoCode || 'ULA-SPECIAL'}</p>
          <p style="font-size: 14px; margin-bottom: 0; color: #374151;">Dùng mã này khi đăng ký để được áp dụng ngay lập tức.</p>
        </div>

        ${prizeCode ? `
        <div style="background: #fff7ed; padding: 20px; border-radius: 8px; border-left: 5px solid #f97316;">
          <h3 style="margin-top: 0; color: #9a3412;">🎡 2. Quà Tặng Từ Vòng Quay:</h3>
          <p style="margin: 5px 0;"><strong>${prizeName || 'Quà tặng may mắn'}</strong></p>
          <p style="font-size: 20px; font-weight: bold; margin: 10px 0; color: #c2410c;">Mã trúng thưởng: ${prizeCode}</p>
        </div>
        ` : ''}

        <div style="margin-top: 30px; padding: 15px; background: #f8fafc; border-radius: 8px; font-size: 14px;">
          <p style="margin-top: 0;"><strong>Cách thức nhận quà:</strong> Hãy chụp màn hình email này và gửi cho bộ phận tư vấn của Ula hoặc đem trực tiếp đến cơ sở gần nhất.</p>
        </div>

        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">Ula Education - Khơi dậy tiềm năng ngôn ngữ trong bạn.<br>Email tự động, vui lòng không phản hồi.</p>
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
