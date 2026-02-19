# Workflow Builder Lite

A clean, review-friendly take-home project for building and running text processing workflows with LLM-powered steps.

## Features

- **Workflow Builder**: Create workflows with 2-4 predefined steps
- **Step Reordering**: Move steps up/down to change execution order
- **Real-time Execution**: Run workflows and see step-by-step outputs
- **Run History**: View the last 5 workflow runs
- **Status Monitoring**: Check backend, database, and LLM health

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- @tanstack/react-query
- lucide-react

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- OpenAI API
- TypeScript

## Project Structure

```
/
├── frontend/          # Next.js frontend
├── backend/          # Express backend
└── README.md
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm run install:all
```

3. Set up environment variables:

**Server** (`backend/.env`):
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/workflow-auto
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

**Client** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running

**Development:**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

Visit `http://localhost:3000` to use the application.

## API Endpoints

- `POST /api/workflow/run` - Execute a workflow
- `GET /api/workflow/history` - Get last 5 workflow runs
- `GET /api/health` - System health check

## Workflow Steps

- `clean_text` - Clean and normalize text
- `summarize` - Create a concise summary
- `extract_key_points` - Extract main points
- `tag_category` - Assign a category tag

## Architecture Decisions

- **Monorepo**: Simple workspace structure for client and server
- **Sequential Execution**: Steps run one after another, each receiving the previous step's output
- **History Limit**: Only last 5 runs stored in database
- **Error Handling**: Graceful failure handling with partial outputs
- **No Over-engineering**: Simple functions, explicit naming, minimal abstractions

## Documentation

- `AI_NOTES.md` - AI implementation notes
- `PROMPTS_USED.md` - LLM prompt documentation
- `ABOUTME.md` - Project overview
