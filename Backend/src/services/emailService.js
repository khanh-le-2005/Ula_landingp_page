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

  const { customerName, prizeName, prizeCode } = prizeInfo;

  const mailOptions = {
    from: `"Ula Landing Page" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `[Ula Edu] Chúc mừng bạn đã trúng giải: ${prizeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #d32f2f; text-align: center;">Chúc mừng ${customerName}!</h2>
        <p>Hệ thống ghi nhận bạn vừa quay trúng phần quà tuyệt vời từ Ula:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h3 style="margin: 0; color: #d32f2f;">${prizeName}</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #333;">Mã code: ${prizeCode}</p>
        </div>
        <p>Vui lòng đưa mã code này cho nhân viên tư vấn của Ula để kích hoạt phần quà của bạn nhé.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888; text-align: center;">Đây là email tự động từ hệ thống Ula Landing Page. Vui lòng không phản hồi email này.</p>
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
