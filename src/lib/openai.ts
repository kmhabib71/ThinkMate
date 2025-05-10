import OpenAI from "openai";

// Initialize the OpenAI client with the API key from environment variables
// This should only be used in server components or API routes
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateNoteOptions {
  prompt: string;
  maxTokens?: number;
}

export interface GenerateNoteResult {
  content: string;
  error?: never;
}

export interface GenerateNoteError {
  content?: never;
  error: string;
}

export type GenerateNoteResponse = GenerateNoteResult | GenerateNoteError;

// Export the OpenAI instance to be used in server-side code only
export default openai;
