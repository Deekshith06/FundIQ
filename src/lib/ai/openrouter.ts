import { Message, AIResponse, AIProviderOptions } from './llm';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const DEFAULT_TIMEOUT_MS = 45_000; // 45 seconds per LLM call

const DEFAULT_FALLBACK_CHAIN = [
  'google/gemma-4-26b-a4b-it:free',
  'openai/gpt-oss-120b:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
];

/** Wait with exponential backoff */
function backoff(attempt: number): Promise<void> {
  const delayMs = Math.min(1000 * Math.pow(2, attempt), 8000);
  return new Promise(resolve => setTimeout(resolve, delayMs));
}

export async function callOpenRouter(
  messages: Message[],
  options: AIProviderOptions = {}
): Promise<AIResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in the environment variables.');
  }
  console.log(`[OpenRouter Debug] Using key length: ${apiKey.length}, start: "${apiKey.slice(0, 10)}...", end: "...${apiKey.slice(-4)}"`);

  // If a specific model is provided, use it first then fall back to the default chain.
  const modelsToTry = options.model
    ? [options.model, ...DEFAULT_FALLBACK_CHAIN.filter(m => m !== options.model)]
    : DEFAULT_FALLBACK_CHAIN;
  
  let lastError: Error | null = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      const startTime = Date.now();
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Investment Research Agent',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error (${response.status}): ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      const content = data.choices?.[0]?.message?.content;
      if (!content || content.trim().length === 0) {
        throw new Error(`Empty response from model ${model}`);
      }

      console.log(`[OpenRouter] Success with ${data.model || model} in ${latencyMs}ms (${data.usage?.total_tokens || '?'} tokens)`);

      return {
        text: content,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
        },
        modelUsed: data.model || model,
        latencyMs,
      };

    } catch (error) {
      const errMsg = (error as Error).message || 'Unknown error';
      
      // Sanitize log output — never print full API key
      const safeMsg = errMsg.replace(/sk-or-v1-[a-z0-9]+/gi, 'sk-or-***');
      console.warn(`[OpenRouter] Failed with model ${model} (attempt ${i + 1}/${modelsToTry.length}): ${safeMsg}`);
      lastError = error as Error;
      
      // Exponential backoff before trying next model
      if (i < modelsToTry.length - 1) {
        await backoff(i);
      }
    }
  }

  throw new Error(`All LLM fallback providers failed. Last error: ${lastError?.message}`);
}
