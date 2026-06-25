const Groq = require("groq-sdk");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");
const tryCatch = require("../utils/tryCatch");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function getUserFromToken(req) {
  try {
    const { token } = req.headers;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    return await User.findById(decoded._id);
  } catch (error) {
    return null;
  }
}

async function chatWithAI(req, res) {
  const { message, history } = req.body;
  const user = await getUserFromToken(req);

  const products = await Product.find()
    .select("title category price stock images")
    .limit(40);

  const productList = products
    .map((p) => `${p.title} | ₹${p.price} | category: ${p.category} | stock: ${p.stock > 0 ? "in stock" : "out of stock"}`)
    .join("\n");

  let orderContext = "User is not logged in.";

  if (user) {
    const orders = await Order.find({ user: user._id })
      .populate("items.product", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    if (orders.length === 0) {
      orderContext = `User (${user.email}) is logged in but has no orders yet.`;
    } else {
      const orderList = orders.map((o) => {
        const items = o.items
          .map((i) => `${i.name || i.product?.title || "item"} x${i.quantity}`)
          .join(", ");
        return `Order ID: ${o._id} | Status: ${o.status} | Total: ₹${o.subTotal} | Items: ${items} | Placed: ${new Date(o.createdAt).toLocaleDateString("en-IN")}`;
      }).join("\n");
      orderContext = `User (${user.email}) recent orders:\n${orderList}`;
    }
  }

  const systemPrompt = `
You are "Omi", the friendly AI shopping assistant for OmniKart, an Indian ecommerce store.

You can help users with:
1. Product recommendations — suggest real products from the catalog below based on their needs, budget, or preferences
2. Order tracking — tell users their real order status using the order data below
3. Store FAQ — answer questions about the store

STORE POLICIES (MEMORIZE THESE EXACTLY — never say anything different):
- Login process: User enters their EMAIL ADDRESS ONLY on the login page. An OTP is sent to that EMAIL INBOX ONLY (not to phone, not SMS, not WhatsApp). User enters the OTP to login. There is ABSOLUTELY NO password field, NO mobile number, NO SMS, NO Google login.
- Payment: Cash on Delivery (COD) only. No online payment, no UPI, no cards, no wallets.
- Order statuses: Pending → Shipped → Delivered
- To place an order: login → add to cart → checkout → select address → place order
- Shipping time: Not defined — do not make up a shipping timeframe. Tell users to contact support for shipping estimates.
- Order cancellation: Not defined — do not make up a cancellation policy. Tell users to contact support.
- Returns/refunds: Not defined — do not make up a return policy. Tell users to contact support.
- Contact support: Users can reach out via the website for any support queries.
- If a policy is not listed above, say "This information isn't available right now, please contact our support team."

Available products:
${productList}

Order data:
${orderContext}

STRICT RULES:
- Only recommend products that exist in the catalog above with their exact prices
- Only discuss orders that appear in the order data above — never invent order IDs, statuses, or totals
- If user asks about orders and is not logged in, tell them to login first
- Keep replies concise and friendly (3-4 lines max)
- Never make up policies, prices, product names, or order details
- All prices are in Indian Rupees (₹)
`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(history || []),
    { role: "user", content: message },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.2,
    max_tokens: 400,
  });

  const reply = completion.choices[0].message.content;

  res.json({ reply });
}

module.exports = { chatWithAI: tryCatch(chatWithAI) };