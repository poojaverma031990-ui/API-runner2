export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export type Provider = 'google' | 'groq' | 'openrouter';

export type ModelSelection = string;
