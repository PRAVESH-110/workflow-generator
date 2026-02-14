import OpenAI from 'openai';
import { getPromptForStep } from '../utils/prompts.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const runStep = async (
  step: string,
  inputText: string
): Promise<string> => {
  const { system, user } = getPromptForStep(step, inputText);

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0,
    });

    const output = response.choices[0]?.message?.content?.trim();
    if (!output) {
      throw new Error('Empty response from LLM');
    }

    return output;
  } catch (error) {
    console.error(`LLM error for step ${step}:`, error);
    throw new Error(`Failed to execute step ${step}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const checkLLMHealth = (): { configured: boolean; error?: string } => {
  if (!process.env.OPENAI_API_KEY) {
    return { configured: false, error: 'OPENAI_API_KEY not set' };
  }
  return { configured: true };
};
