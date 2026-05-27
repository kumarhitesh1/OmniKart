const { createTransport } = require("nodemailer");

async function sendOrderConfirmation({ email, subject, orderId, products, totalAmount }) {
  const transport = createTransport({
    host: "smtp.resend.com",
    port: 465,
    secure: true,
    auth: {
      user: "resend",
      pass: process.env.RESEND_API_KEY,
    },
  });

  const productsHtml = products.map((product) => `
    <tr>
      <td style="padding: 10px; border: 1px solid #ddd;">${product.name}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">₹${product.price}</td>
    </tr>
  `).join("");

  await transport.sendMail({
    from: "OmniKart <onboarding@resend.dev>",
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h1 style="color: #1b2a6b;">OmniKart</h1>
        <h2 style="color: #16a34a;">Order Confirmed! 🎉</h2>
        <p>Dear ${email},</p>
        <p>Your order <strong>${orderId}</strong> has been placed successfully.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f2f2f2;">
              <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>${productsHtml}</tbody>
        </table>
        <p style="font-size: 18px; font-weight: bold;">Total: ₹${totalAmount}</p>
        <p>Thank you for shopping with OmniKart!</p>
      </div>
    `,
  });
}

module.exports = { sendOrderConfirmation };