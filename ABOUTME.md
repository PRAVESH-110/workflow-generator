# About This Project

## Project Overview

**Workflow Builder Lite** is a clean, review-friendly take-home project demonstrating full-stack development with Next.js, Express, MongoDB, and OpenAI integration.

## Design Philosophy

This project prioritizes:
- **Clarity** over cleverness
- **Simplicity** over complexity
- **Correctness** over optimization
- **Explicit** over implicit

## Key Features

1. **Workflow Builder**
   - Drag-free step reordering (up/down buttons)
   - 2-4 step workflows
   - Real-time execution feedback

2. **Step Execution**
   - Sequential LLM-powered processing
   - Step-by-step output display
   - Graceful error handling

3. **History Management**
   - Last 5 runs stored
   - Automatic cleanup of older runs
   - Full run details preserved

4. **Status Monitoring**
   - Backend health check
   - Database connection status
   - LLM configuration status

## Architecture Highlights

### Backend Structure
```
backend/src/
├── index.ts          # Entry point
├── app.ts            # Express app setup
├── config/           # Database config
├── routes/           # API routes
├── controllers/      # Request handlers
├── services/         # Business logic (LLM)
├── models/           # Mongoose models
├── utils/            # Prompts & helpers
└── middleware/       # Error handling
```

### Frontend Structure
```
frontend/
├── app/              # Next.js App Router
│   ├── page.tsx      # Main workflow builder
│   ├── history/      # Run history page
│   └── status/       # Health status page
├── components/       # UI components
│   └── ui/           # shadcn components
└── lib/              # Utilities & API client
```

## Technical Decisions

### Why This Stack?

- **Next.js App Router**: Modern React framework with server components
- **Express**: Simple, unopinionated backend
- **MongoDB**: Document storage fits workflow runs naturally
- **OpenAI**: Reliable LLM API with good TypeScript support
- **React Query**: Efficient data fetching and caching
- **Tailwind + shadcn**: Rapid UI development without heavy dependencies

### Code Quality Approach

- **No premature optimization**: Simple functions, clear flow
- **Minimal abstractions**: Only when genuinely needed
- **Explicit naming**: `runStep`, `getHistory`, `runWorkflow`
- **Self-documenting code**: Comments only where necessary
- **Type safety**: Full TypeScript coverage

### What Was Avoided

- Class-based patterns (functional approach preferred)
- Over-abstracted layers
- Unnecessary libraries
- Complex state management (React Query handles it)
- Premature caching/optimization

## Development Experience

The project is structured for:
- **Easy review**: Clear file organization
- **Quick setup**: Minimal configuration
- **Straightforward debugging**: Explicit error messages
- **Simple testing**: Pure functions, clear boundaries

## Future Enhancements (Not Implemented)

These were intentionally left out to keep the project focused:
- User authentication
- Workflow templates
- Export/import workflows
- Advanced error recovery
- Step validation UI
- Real-time collaboration

## Learning Outcomes

This project demonstrates:
- Full-stack TypeScript development
- LLM integration patterns
- RESTful API design
- Modern React patterns (hooks, query)
- Database modeling with Mongoose
- Clean code principles
