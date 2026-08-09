# AI Resume Analyzer

An AI-powered web and mobile application that analyzes resumes, calculates ATS scores, highlights skill gaps, matches with job descriptions, and provides suggestions to optimize job search success.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Expo/React Native & React components mockup sandbox
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mobile` — Expo-based mobile client application.
- `artifacts/mockup-sandbox` — Vite-based UI workspace mockup testing.
- `artifacts/api-server` — Express 5 REST API backend.
- `lib/api-spec` — OpenAPI specs containing `openapi.yaml` and Orval config.
- `lib/api-zod` — Generated zod validation schemas.
- `lib/api-client-react` — React hooks generated directly from API schemas.
- `lib/db` — Drizzle schema models, migrations, and PostgreSQL client setup.

## Architecture decisions

- **OpenAPI/Specs-First Development**: Design endpoints in `lib/api-spec/openapi.yaml` and generate TypeScript client bindings to guarantee sync across the boundaries.
- **Unified Schema Validation**: Keep single schema validation source of truth using `lib/api-zod` validation schemas matching OpenAPI specs.
- **Type-safe Database Queries**: Drizzle ORM ensures compile-time check for database access across services.

## Product

- **Resume Upload & Parsing**: Parse DOCX and PDF resume files.
- **ATS and Resume Scoring**: Real-time evaluation scoring of resumes.
- **Job Description Match**: Gap analysis and match score based on target JD.
- **AI Improvements**: Dynamic rephrasing recommendations.

## Gotchas

- **Do not edit generated folders**: Avoid modifying items under `generated/` folders. Run `pnpm --filter @workspace/api-spec run codegen` instead.
- **Database synchronization**: Always run `pnpm --filter @workspace/db run push` when changing schemas to sync local database.
- **Use pnpm**: Preinstall scripts enforce the use of `pnpm` exclusively.
