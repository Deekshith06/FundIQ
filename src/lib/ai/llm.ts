export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  modelUsed: string;
  latencyMs: number;
}

export interface AIProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
