const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

defaultClient.authentications["api-key"].apiKey =
  process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

async function sendOtp(email, subject, otp) {
  await apiInstance.sendTransacEmail({
    sender: {
      name: "OmniKart",
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email }],
    subject,
    htmlContent: `
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