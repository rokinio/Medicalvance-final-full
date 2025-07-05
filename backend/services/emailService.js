import nodemailer from "nodemailer";

// 1. ایجاد یک "transporter" که اطلاعات اتصال به سرور ایمیل را نگه می‌دارد
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT || "587", 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

// تابع کلی برای ارسال ایمیل با استفاده از Nodemailer
const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: `"Medicalvance Platform Support" <${process.env.MAIL_FROM}>`, // آدرس فرستنده
    to: to, // آدرس گیرنده
    subject: subject, // موضوع ایمیل
    html: htmlContent, // محتوای HTML
    headers: {
      "x-liara-tag": "transactional", // برچسب برای دسته‌بندی در پنل لیارا
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Liara: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email via Liara:", error);
    // پرتاب خطا تا در کنترلر مدیریت شود
    throw new Error("Failed to send email. Please check server logs.");
  }
};

// تابع برای ارسال ایمیل تایید
export const sendVerificationEmail = async (to, token) => {
  const subject = "Verify Your Email for Medicalvance Platform";
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2>Welcome to Medicalvance Platform!</h2>
        <p>Thank you for registering. Please use the code below to verify your email address:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 8px; background: #f2f2f2; padding: 15px 25px; border-radius: 8px; display: inline-block; margin: 20px 0;">
            ${token}
        </div>
        <p style="font-size: 12px; color: #777;">If you did not create an account, no further action is required.</p>
      </body>
    </html>
  `;
  await sendEmail(to, subject, htmlContent);
};

// تابع برای ارسال ایمیل ریست پسورد
export const sendPasswordResetEmail = async (to, token) => {
  const subject = "Password Reset Request for Medicalvance Platform";
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Use the code below on the reset password page:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 8px; background: #f2f2f2; padding: 15px 25px; border-radius: 8px; display: inline-block; margin: 20px 0;">
            ${token}
        </div>
        <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email.</p>
      </body>
    </html>
  `;
  await sendEmail(to, subject, htmlContent);
};
