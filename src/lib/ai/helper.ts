import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENAI_API_KEY ? undefined : 'https://openrouter.ai/api/v1',
});

const MODEL = process.env.OPENAI_API_KEY ? 'gpt-4o' : (process.env.FINANCIAL_MODEL || 'openai/gpt-4o');

export async function generateSimulatedForecast(ticker: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a quantitative hedge fund analyst.' },
        { role: 'user', content: `Generate a JSON forecast for ${ticker} with bullCase, baseCase, bearCase containing expectedPriceRange, expectedCagr, expectedRevenue, expectedEps, probability, and assumptions.` }
      ],
      response_format: { type: 'json_object' }
    });
    return response.choices[0].message.content || '{}';
  } catch (error) {
    console.error('LLM Error:', error);
    return '{}';
  }
}
