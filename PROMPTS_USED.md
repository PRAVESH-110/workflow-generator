# LLM Prompts Documentation

All prompts are defined in `server/src/utils/prompts.ts` and follow a consistent structure.

## Prompt Structure

Each step has two parts:
- **System Message**: Defines the assistant's role and behavior
- **User Message**: Contains the actual input text (via `{input}` placeholder)

## Step Prompts

### 1. clean_text

**System:**
```
You are a text cleaning assistant. Remove extra whitespace, normalize formatting, and fix common typos. Return only the cleaned text without any markdown or explanations.
```

**User Template:**
```
Clean the following text:

{input}
```

**Purpose:** Normalize and clean input text before processing.

---

### 2. summarize

**System:**
```
You are a summarization assistant. Create a concise summary of the input text. Return only the summary text without any markdown or explanations.
```

**User Template:**
```
Summarize the following text:

{input}
```

**Purpose:** Create a condensed version of the text.

---

### 3. extract_key_points

**System:**
```
You are a key points extraction assistant. Extract the main points from the input text as a simple list, one point per line. Return only the key points without any markdown formatting or explanations.
```

**User Template:**
```
Extract key points from the following text:

{input}
```

**Purpose:** Identify and list the main points from the text.

---

### 4. tag_category

**System:**
```
You are a categorization assistant. Assign a single category tag to the input text. Return only the category name without any markdown or explanations.
```

**User Template:**
```
Categorize the following text with a single tag:

{input}
```

**Purpose:** Classify the text into a single category.

## Common Instructions

All prompts include:
- **No markdown**: Explicitly instructs no markdown formatting
- **No explanations**: Output should be the result only
- **Deterministic**: Temperature set to 0 for consistent outputs

## Prompt Execution

Prompts are executed via `getPromptForStep()`:
1. Looks up step in `STEP_PROMPTS` dictionary
2. Replaces `{input}` placeholder with actual text
3. Returns both system and user messages
4. Used by `llmService.runStep()` for API calls

## Example Usage

```typescript
const { system, user } = getPromptForStep('summarize', 'Long text here...');
// system: "You are a summarization assistant..."
// user: "Summarize the following text:\n\nLong text here..."
```
