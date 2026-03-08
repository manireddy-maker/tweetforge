export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { brandName, industry, objective, tone, products, extraContext } = req.body;

    const prompt = `You are an expert social media strategist and copywriter.

A brand wants 10 on-brand tweets generated based on the following details:
- Brand Name: ${brandName || 'Not specified'}
- Industry: ${industry || 'Not specified'}
- Campaign Objective: ${objective}
- Preferred Tone: ${tone || 'Infer from brand/industry'}
- Products/Services: ${products || 'Not specified'}
- Additional Context: ${extraContext || 'None'}

Your task:
1. First, INFER or USE the brand voice. Identify: tone, target audience, content themes.
2. Generate exactly 10 tweets that feel authentically on-brand.
   Include a mix of: engaging/conversational, promotional, witty/meme-style, and informative tweets.
   Each tweet must be under 280 characters. Use hashtags and emojis naturally where appropriate.

Respond ONLY with a valid JSON object in this exact format (no markdown, no explanation, no backticks):
{
  "brandVoice": {
    "tone": "2-4 word description",
    "audience": "1 sentence",
    "themes": ["theme1", "theme2", "theme3"],
    "personality": "1 sentence describing the brand personality"
  },
  "tweets": [
    { "id": 1, "style": "Engaging", "text": "tweet text here" },
    { "id": 2, "style": "Promotional", "text": "tweet text here" },
    { "id": 3, "style": "Witty", "text": "tweet text here" },
    { "id": 4, "style": "Informative", "text": "tweet text here" },
    { "id": 5, "style": "Engaging", "text": "tweet text here" },
    { "id": 6, "style": "Promotional", "text": "tweet text here" },
    { "id": 7, "style": "Witty", "text": "tweet text here" },
    { "id": 8, "style": "Informative", "text": "tweet text here" },
    { "id": 9, "style": "Engaging", "text": "tweet text here" },
    { "id": 10, "style": "Meme-style", "text": "tweet text here" }
  ]
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 2000 },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(500).json({ error: 'Gemini API error', details: data.error?.message });
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: 'Generation failed', details: err.message });
  }
}
