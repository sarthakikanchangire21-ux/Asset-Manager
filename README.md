# FinBuddy AI - Asset Manager

FinBuddy AI is a smart, interactive personal finance management system designed to make tracking transactions, organizing budgets, and analyzing spending patterns extremely fast and engaging. With integrated AI-driven insights, FinBuddy acts as a virtual financial advisor that suggests optimal budgets and points out spend anomalies.

---

## 🚀 Getting Started with the Interactive Control Center

To make onboarding and development across this monorepo as frictionless as possible, we have introduced a terminal-based **Interactive README & Command Orchestration Tool**.

Instead of searching through countless Markdown files and manually copying terminal scripts, you can run the following single command to explore documentation and run commands:

```bash
pnpm readme
```

### What you can do inside the Interactive Center:
1. **Browse Project Overview & Vision**: Understand the core objectives and features of FinBuddy AI.
2. **Explore the Technical Stack**: Detailed views of the technologies (React, Expo, Express, PostgreSQL, Drizzle ORM, OpenAPI, Zod).
3. **Inspect the Workspace Architecture**: Get a complete map of the workspaces (`lib/`, `artifacts/`, etc.) and the development flow.
4. **Learn Dev Gotchas**: Crucial warnings about auto-generated specifications and database sync commands.
5. **Orchestrate Development Tools**: Run typecheck, compile/build, sync database structures, or boot up development servers directly from the menu.

---

## 🛠️ Stack and workspaces

This repository is powered by a modern multi-workspace monorepo architecture:

- **Frontend Clients**:
  - `artifacts/mobile`: Expo & React Native mobile client application.
  - `artifacts/mockup-sandbox`: Vite & React mockup sandbox environment.
- **Backend Services**:
  - `artifacts/api-server`: High-performance Express 5 (TypeScript) backend.
- **Shared Libraries**:
  - `lib/api-spec`: OpenAPI specification and client SDK generation rules.
  - `lib/api-zod`: Auto-generated schemas for fast schema validation.
  - `lib/api-client-react`: Unified React Query hooks for client fetch operations.
  - `lib/db`: PostgreSQL client declaration, migrations, and schema definitions.

For more information, boot up the console tool:
```bash
pnpm readme
```
