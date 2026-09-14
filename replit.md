# AI Resume Analyzer (ResumeAI)

AI Resume Analyzer is an intelligent, contract-driven monorepo application for resume optimization, ATS scoring, skill gap identification, and AI-powered career coaching.

## Run & Operate

- `pnpm readme` — Launch the terminal-based interactive documentation & command runner
- `pnpm --filter @workspace/api-server run dev` — Run the Express API server (port 5000)
- `pnpm run typecheck` — Strict typecheck across all workspace packages and libraries
- `pnpm run build` — Build all packages across the monorepo
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API hooks and Zod schemas from the OpenAPI spec (`openapi.yaml`)
- `pnpm --filter @workspace/db run push` — Push Drizzle DB schema changes to PostgreSQL

## Stack

- **Monorepo & Tooling**: pnpm workspaces, Node.js 24, TypeScript 5.9
- **API Server**: Express 5 (TypeScript)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation & Codegen**: Zod (`zod/v4`), `drizzle-zod`, Orval (from `openapi.yaml`)
- **Web & Mobile Clients**: Vite + React, Expo + React Native

## Workspace Map

- `artifacts/api-server` — Express 5 API server
- `artifacts/mobile` — Expo & React Native mobile client
- `artifacts/mockup-sandbox` — Vite & React component preview environment
- `lib/api-spec` — OpenAPI 3.1 contract specification (`openapi.yaml`)
- `lib/api-zod` — Generated Zod validation schemas
- `lib/api-client-react` — Generated React Query client hooks
- `lib/db` — Drizzle ORM PostgreSQL schema
- `docs/` — Project PRD, Tech Stack, and Design documentation
- `scripts/` — Terminal utility scripts (`pnpm readme`)

## Environment Setup

- `DATABASE_URL` — PostgreSQL connection string (required)
- `OPENAI_API_KEY` — OpenAI API key for AI features (optional)
- `PORT` — Server port (default: 5000)

## Developer Gotchas

1. **Codegen Artifacts**: Never modify files inside `generated` folders directly. Modify `lib/api-spec/openapi.yaml` and run `pnpm --filter @workspace/api-spec run codegen`.
2. **Database Sync**: Always run `pnpm --filter @workspace/db run push` after modifying Drizzle schemas in `lib/db/src/schema/`.
3. **Package Manager**: Use `pnpm` exclusively across all workspace operations.
