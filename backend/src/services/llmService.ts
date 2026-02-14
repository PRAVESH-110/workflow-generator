import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPromptForStep } from '../utils/prompts.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

export const runStep = async (
  step: string,
  inputText: string
): Promise<string> => {
  const { system, user } = getPromptForStep(step, inputText);

  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const prompt = `${system}\n\n${user}`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const output = response.text()?.trim();

    if (!output) {
      throw new Error('Empty response from LLM');
    }

    return output;
  } catch (error) {
    console.error(`LLM error for step ${step}:`, error);
    throw new Error(
      `Failed to execute step ${step}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export const checkLLMHealth = (): { configured: boolean; error?: string } => {
  if (!process.env.GEMINI_API_KEY) {
    return { configured: false, error: 'GEMINI_API_KEY not set' };
  }
  return { configured: true };
};
