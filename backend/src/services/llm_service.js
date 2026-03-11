import axios from "axios";

const GEMINI_MODEL = "gemini-1.5-flash";

export async function generateSalesSummary(stats) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const prompt = buildPrompt(stats);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    },
    {
      params: { key: apiKey },
    },
  );

  const text =
    response.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n").trim() ||
    "No summary generated.";

  return text;
}

function buildPrompt(stats) {
  return `
You are an AI sales analyst. Generate a professional, concise, executive-friendly quarterly sales report for leadership using the following data insights.

Data Insights:
- Total Revenue: ${stats.totalRevenue.toFixed(2)}
- Top Product Category by Revenue: ${stats.topProductCategory || "N/A"}
- Top Region by Revenue: ${stats.topRegion || "N/A"}
- Average Unit Price: ${stats.averageUnitPrice.toFixed(2)}
- Units Sold per Region: ${JSON.stringify(stats.unitsByRegion, null, 2)}

Structure the report with the following sections:
1. Key Sales Insights
2. Revenue Trends
3. Regional Performance
4. Product Performance
5. Business Recommendations

Tone: professional, concise, and tailored for senior executives. Avoid technical jargon.`;
}

