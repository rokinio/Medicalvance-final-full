// This is a MOCK email service.
// In a real application, you would integrate a service like Nodemailer, SendGrid, Mailgun, etc.

const sendEmail = async ({ to, subject, text, html }) => {
  console.log("--- MOCK EMAIL SENDER ---");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  console.log("--- END MOCK EMAIL SENDER ---");
  return Promise.resolve();
};

export const sendVerificationEmail = async (to, token) => {
  const subject = "Verify Your Email for MedPlatform";
  const text = `Thank you for registering. Please use this verification code: ${token}`;

  console.log("--- MOCK EMAIL SENDER ---");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  console.log("--- END MOCK EMAIL SENDER ---");
  return Promise.resolve();
};

export const sendPasswordResetEmail = async (to, token) => {
  const subject = "Password Reset Request for MedPlatform";
  const resetUrl = `http://localhost:5176/reset-password?token=${token}`; // Your frontend URL
  const text =
    `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
    `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
    `${resetUrl}\n\n` +
    `Or use this code on the reset page: ${token}\n\n` +
    `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

  await sendEmail({ to, subject, text });
};
