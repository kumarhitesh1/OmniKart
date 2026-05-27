const { createTransport } = require("nodemailer");

async function sendOtp(email, subject, otp) {
  const transport = createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: {
      user: "resend",
      pass: process.env.RESEND_API_KEY,
    },
  });

  await transport.sendMail({
    from: "OmniKart <onboarding@resend.dev>",
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h1 style="color: #1b2a6b;">OmniKart</h1>
        <h2>OTP Verification</h2>
        <p>Hello ${email}, your One-Time Password is:</p>
        <p style="font-size: 36px; color: #4f7ef7; font-weight: bold;">${otp}</p>
        <p>This OTP expires in 2 minutes.</p>
      </div>
    `,
  });
  console.log("OTP Email Sent Successfully");
}

module.exports = { sendOtp };