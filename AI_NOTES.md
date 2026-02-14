# AI Implementation Notes

## LLM Service Architecture

### Centralized LLM Logic

All LLM interactions are centralized in `server/src/services/llmService.ts`. This ensures:
- Single point of configuration
- Consistent error handling
- Easy provider switching (currently OpenAI)

### Provider Choice

**OpenAI** was selected as the LLM provider:
- Model: `gpt-4o-mini` (configurable via `OPENAI_MODEL` env var)
- Temperature: `0` for deterministic outputs
- No markdown in responses (enforced via prompts)

### Prompt System

Prompts are defined in `server/src/utils/prompts.ts`:
- System and user roles separated
- Template-based with `{input}` placeholder
- Explicit instructions: "No markdown in output"
- Deterministic formatting requirements

### Execution Flow

1. **Sequential Processing**: Steps execute one after another
2. **Output Chaining**: Each step receives the previous step's output as input
3. **Error Handling**: If a step fails, execution stops and error is recorded
4. **Partial Results**: Completed steps are saved even if later steps fail

### Step Definitions

Each workflow step has:
- Unique identifier (e.g., `clean_text`)
- System prompt (defines role)
- User prompt template (includes input text)

### Health Checks

The LLM health check (`checkLLMHealth`) verifies:
- API key is configured
- Returns status without making actual API calls (cost-efficient)

## Design Decisions

### Why Sequential?

- Simpler to reason about
- Each step builds on previous output
- Easier error tracking
- No race conditions

### Why Temperature 0?

- Deterministic outputs for same inputs
- Better for reproducible workflows
- Reduces variability in testing

### Why No Markdown?

- Cleaner output display
- Easier parsing
- Consistent formatting across steps

## Future Considerations

- Parallel execution option for independent steps
- Caching layer for repeated inputs
- Streaming responses for long outputs
- Multiple LLM provider support
