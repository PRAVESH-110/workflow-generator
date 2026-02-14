export const STEP_PROMPTS: Record<string, { system: string; user: string }> = {
  clean_text: {
    system:
      'You are a text cleaning assistant. Remove extra whitespace, normalize formatting, and fix common typos. Return only the cleaned text without any markdown or explanations.',
    user: 'Clean the following text:\n\n{input}',
  },
  summarize: {
    system:
      'You are a summarization assistant. Create a concise summary of the input text. Return only the summary text without any markdown or explanations.',
    user: 'Summarize the following text:\n\n{input}',
  },
  extract_key_points: {
    system:
      'You are a key points extraction assistant. Extract the main points from the input text as a simple list, one point per line. Return only the key points without any markdown formatting or explanations.',
    user: 'Extract key points from the following text:\n\n{input}',
  },
  tag_category: {
    system:
      'You are a categorization assistant. Assign a single category tag to the input text. Return only the category name without any markdown or explanations.',
    user: 'Categorize the following text with a single tag:\n\n{input}',
  },
};

export const getPromptForStep = (
  step: string,
  input: string
): { system: string; user: string } => {
  const prompt = STEP_PROMPTS[step];
  if (!prompt) {
    throw new Error(`Unknown step: ${step}`);
  }
  return {
    system: prompt.system,
    user: prompt.user.replace('{input}', input),
  };
};
