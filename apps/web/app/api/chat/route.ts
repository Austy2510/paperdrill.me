import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter('deepseek/deepseek-chat'),
    messages,
    system: "You are the PaperDrill AI Tutor. You help students understand complex exam questions, provide step-by-step solutions, and offer study tips for boards like Edexcel, AQA, IB, Dhaka Board, and CAIE. Be encouraging, professional, and precise. Never just give the final answer away directly; guide the student to the solution.",
  });

  return result.toTextStreamResponse();
}
