import { callOpenRouter } from './openrouter';
import { Message, AIProviderOptions, AIResponse } from './llm';

/**
 * Centralized AI response generator.
 * All agents MUST use this function instead of calling models directly.
 */
export async function generateAIResponse(
  messages: Message[],
  options?: AIProviderOptions
): Promise<AIResponse> {
  // We can add global logging, caching, or deduplication here later.
  // For now, it passes straight through to the OpenRouter client.
  return await callOpenRouter(messages, options);
}
