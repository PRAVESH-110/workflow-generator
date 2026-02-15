import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPromptForStep } from '../utils/prompts.js';

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in .env');
  }
  return new GoogleGenerativeAI(apiKey);
}

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const RATE_LIMIT_RETRY_DELAY_MS = 30_000;
const RATE_LIMIT_MAX_RETRIES = 2;

function isRateLimitError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes('429') || msg.includes('Too Many Requests') || msg.includes('rate limit') || msg.includes('RESOURCE_EXHAUSTED');
}

export const runStep = async (
  step: string,
  inputText: string
): Promise<string> => {
  const { system, user } = getPromptForStep(step, inputText);

  const doRequest = async (): Promise<string> => {
    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: MODEL });

    // Combine system and user prompts for Gemini
    const prompt = `${system}\n\nUser: ${user}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const output = response.text().trim();

    if (!output) {
      throw new Error('Empty response from LLM');
    }

    return output;
  };

  let lastError: unknown;
  for (let attempt = 0; attempt <= RATE_LIMIT_MAX_RETRIES; attempt++) {
    try {
      return await doRequest();
    } catch (error) {
      lastError = error;
      if (isRateLimitError(error) && attempt < RATE_LIMIT_MAX_RETRIES) {
        console.warn(
          `Rate limited on step ${step} (attempt ${attempt + 1}/${RATE_LIMIT_MAX_RETRIES + 1}), retrying in ${RATE_LIMIT_RETRY_DELAY_MS / 1000}s...`
        );
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_DELAY_MS));
        continue;
      }
      break;
    }
  }

  console.error(`LLM error for step ${step}:`, lastError);

  if (lastError && isRateLimitError(lastError)) {
    throw new Error(
      `Rate limit exceeded. Please wait a minute and try again.`
    );
  }

  throw new Error(
    `Failed to execute step ${step}: ${lastError instanceof Error ? lastError.message : 'Unknown error'}`
  );
};

export const checkLLMHealth = (): { configured: boolean; error?: string } => {
  if (!process.env.GEMINI_API_KEY) {
    return { configured: false, error: 'GEMINI_API_KEY not set' };
  }
  return { configured: true };
};
