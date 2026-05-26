const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAIRecommendedProducts(product, products) {
  const list = products
    .map(
      (p) =>
        `ID:${p.id} | ${p.name} | ${p.category} | ${p.description} | Price:${p.price}`,
    )
    .join("\n");

  const prompt = `
You are a smart ecommerce recommendation engine.

Current product:
${product.name}
${product.category}
${product.description}
Price: ${product.price}

Available products:
${list}

Return ONLY JSON array of most similar product IDs (max 6)
Example:
[2,5,9]
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  try {
    const text = response.choices[0].message.content;

    const match = text.match(/\[.*\]/s);
    if (!match) return [];

    return JSON.parse(match[0]);
  } catch {
    return [];
  }
};

module.exports = {
  getAIRecommendedProducts,
};