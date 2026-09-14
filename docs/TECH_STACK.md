# Technical Stack & Architecture

This document describes the technical stack, workspace monorepo layout, data flow, and environment configurations for **AI Resume Analyzer**.

---

## 1. Monorepo Workspaces Layout

The codebase uses a **pnpm workspaces** setup driven by Node.js 24 and strict TypeScript 5.9.

```
.
├── artifacts/
│   ├── api-server/         # Express 5 backend server (TypeScript)
│   ├── mobile/             # Expo & React Native mobile client
│   └── mockup-sandbox/     # Vite & React component preview environment
├── lib/
│   ├── api-client-react/   # React Query client hooks (auto-generated)
│   ├── api-spec/           # OpenAPI 3.1 specification & Orval codegen configuration
│   ├── api-zod/            # Auto-generated Zod validation schemas
│   └── db/                 # PostgreSQL declarations & Drizzle ORM schema
├── scripts/                # Terminal orchestration & interactive README tool
├── docs/                   # Product, Architecture, and Design documentation
├── README.md               # Primary workspace documentation
└── replit.md               # Quick operational summary & developer setup guide
```

---

## 2. Core Technologies

### Backend & API Architecture
- **Runtime**: Node.js 24.x
- **Framework**: Express 5 (TypeScript)
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Contract-first Generation**: Orval (from `lib/api-spec/openapi.yaml`)
- **Logging**: Pino / Pino-HTTP

### Frontend & UI Architecture
- **Web Client**: Vite, React 18, Tailwind CSS, Radix UI components
- **Mobile Client**: Expo, React Native, Expo Router, Lucide Icons, Recharts
- **State & Data Fetching**: TanStack React Query via `@workspace/api-client-react`

---

## 3. Development Commands

| Command | Action |
| ------- | ------ |
| `pnpm readme` | Launches the interactive CLI Control Center. |
| `pnpm run typecheck` | Runs strict typechecking across all libraries and workspace packages. |
| `pnpm run build` | Builds all monorepo workspace packages. |
| `pnpm --filter @workspace/api-server run dev` | Boots up the Express API server on port 5000. |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerates Zod schemas and React fetch hooks from `openapi.yaml`. |
| `pnpm --filter @workspace/db run push` | Pushes Drizzle ORM schema updates directly to PostgreSQL. |

---

## 4. Environment Variables

| Variable | Description | Required |
| -------- | ----------- | -------- |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI advice and resume optimization | Optional (For AI features) |
| `PORT` | API Server listening port (default: 5000) | Optional |
