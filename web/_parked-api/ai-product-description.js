// [PARKED 2026-10-26] AI product description generator — parked out of pages/api/ so the
// app builds without the `openai` dependency. Restore by moving back under pages/api/,
// running `npm i openai`, and setting OPENAI_API_KEY / AI_MODEL in .env.
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { productName } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You write short, catchy product descriptions for a small local shop. Reply with three one-sentence description options separated by a newline.',
        },
        {
          role: 'user',
          content: `Product: ${productName}`,
        },
      ],
      max_tokens: 150,
    });

    const text = completion.choices[0]?.message?.content || '';
    const descriptions = text
      .split('\n')
      .map((line) => line.replace(/^[\d.*-]+\s*/, '').trim())
      .filter(Boolean);

    return res.status(200).json({ descriptions });
  } catch (error) {
    console.error('AI Product Description Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
