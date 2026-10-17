# 🚀 AI Resume Analyzer (ResumeAI)

[![Node.js Version](https://img.shields.io/badge/Node.js-v24.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm Workspaces](https://img.shields.io/badge/pnpm-Workspaces-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Express 5](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An intelligent, full-stack, contract-driven personal career development and resume optimization platform. Built as a high-performance monorepo, **ResumeAI** delivers real-time Applicant Tracking System (ATS) scoring, dynamic skill gap analysis, AI-powered bullet point enhancements, and cross-platform web and mobile experiences.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Interactive Control Center](#-interactive-control-center)
- [Architecture & Workspace Structure](#-architecture--workspace-structure)
- [Tech Stack](#-tech-stack)
- [Quick Start Guide](#-quick-start-guide)
- [Environment Variables](#-environment-variables)
- [Scripts & Workflow](#-scripts--workflow)
- [Contract-First API Development](#-contract-first-api-development)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Navigating job applications in modern markets requires optimizing resumes for Applicant Tracking Systems (ATS) and target job descriptions. **ResumeAI** provides actionable, AI-driven career feedback to boost recruiter callbacks and interview conversion rates.

The platform relies on a **contract-first monorepo architecture** where an OpenAPI 3.1 specification serves as the source of truth, generating type-safe API clients, Zod validation schemas, and React Query hooks automatically across both Web and Mobile targets.

---

## ✨ Key Features

- 🎯 **Real-time ATS Resume Scoring**: Evaluates candidate resumes against ATS parsing algorithms, formatting best practices, action verbs, and quantifiable impact.
- 🔍 **Dynamic Skill Gap & Job Matching**: Parses target job descriptions to reveal missing technical keywords, hard/soft skill gaps, and relevance alignment.
- ✍️ **AI Bullet Point Re-writer**: Uses Large Language Models (LLMs) to transform passive job bullets into high-impact, quantified achievement statements.
- 📱 **Multi-Platform Experience**:
  - **Web Sandbox (`artifacts/mockup-sandbox`)**: Interactive React & Vite web preview interface.
  - **Mobile App (`artifacts/mobile`)**: Expo & React Native cross-platform app for iOS and Android.
- 🔒 **Contract-First Backend (`artifacts/api-server`)**: High-performance Express 5 server powered by PostgreSQL, Drizzle ORM, Zod validation schemas, and OpenAPI 3.1 contracts.

---

## ⚡ Interactive Control Center

For instant workspace navigation, testing, and operational tasks, run the interactive terminal control center:

```bash
pnpm readme
```

### Features of the Interactive CLI:
- 📖 **Browse Project Architecture**: Explore product goals, tech stack selections, and inter-package dependencies.
- ⚡ **Execute Orchestration Commands**: Run typechecking, build tasks, ORM database pushes, and client codegen directly from an interactive menu.
- 🛠️ **Developer Notes**: Review contract-first standards, environment setup guides, and troubleshooting steps.

---

## 🏗️ Architecture & Workspace Structure

```
AI-Resume-Analyzer/
├── 📁 artifacts/                 # Executable applications & user-facing clients
│   ├── 📁 api-server/            # Express 5 backend server (Node.js & TypeScript)
│   ├── 📁 mobile/                # Expo & React Native cross-platform mobile app
│   └── 📁 mockup-sandbox/        # Vite + React web sandbox & component preview
│
├── 📁 lib/                       # Core shared monorepo libraries & packages
│   ├── 📁 api-spec/              # Central OpenAPI 3.1 specification (openapi.yaml)
│   ├── 📁 api-zod/               # Auto-generated Zod runtime validation schemas
│   ├── 📁 api-client-react/      # Auto-generated TanStack React Query API hooks (Orval)
│   └── 📁 db/                    # PostgreSQL schemas & Drizzle ORM configurations
│
├── 📁 docs/                      # Comprehensive project documentation
│   ├── 📄 PRD.md                 # Product Requirements Document
│   ├── 📄 TECH_STACK.md          # Technical Architecture Specification
│   └── 📄 DESIGN.md             # UI/UX & Design Guidelines
│
├── 📁 scripts/                   # Workspace utilities & interactive CLI source
│   └── 📁 src/                   # Interactive README control center logic
│
├── 📄 package.json               # Root monorepo workspace configuration
├── 📄 pnpm-workspace.yaml        # pnpm workspace configuration
└── 📄 README.md                  # Project documentation hub
```

---

## 🛠️ Tech Stack

| Domain | Tech Stack |
| ------ | ---------- |
| **Monorepo Management** | `pnpm` Workspaces, Node.js 24+, TypeScript 5.9 |
| **Backend Framework** | Express 5, Node.js (TypeScript) |
| **Database & ORM** | PostgreSQL, Drizzle ORM, `drizzle-zod` |
| **API Spec & Codegen** | OpenAPI 3.1 (`openapi.yaml`), Orval, Zod (`zod/v4`) |
| **Web Frontend** | Vite, React 18, Tailwind CSS, Lucide Icons, Radix UI |
| **Mobile Frontend** | Expo SDK, React Native, Expo Router, Recharts |
| **AI Integration** | OpenAI API (GPT-4 / GPT-3.5) |

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have the following installed locally:
- **Node.js**: `v24.x` or higher
- **pnpm**: `v10.x` or higher (`npm install -g pnpm`)
- **PostgreSQL**: A running instance or connection string

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sarthakikanchangire21-ux/AI-Resume-Analyzer.git
   cd AI-Resume-Analyzer
   ```

2. **Install monorepo dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables)).

4. **Synchronize the database schema**:
   ```bash
   pnpm --filter @workspace/db run push
   ```

5. **Start the API Server**:
   ```bash
   pnpm --filter @workspace/api-server run dev
   ```

---

## 🔑 Environment Variables

| Variable | Description | Required | Default |
| -------- | ----------- | -------- | ------- |
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | — |
| `OPENAI_API_KEY` | OpenAI API key for AI resume analysis & re-writing | Optional | — |
| `PORT` | API server port | No | `5000` |
| `BASE_PATH` | Server base path routing | No | `/` |
| `EXPO_PUBLIC_DOMAIN` | Host domain for mobile app API requests | No | `localhost` |

---

## 📜 Scripts & Workflow

All workspace scripts can be executed from the repository root:

| Command | Description |
| ------- | ----------- |
| `pnpm readme` | Launches the interactive terminal documentation & command runner CLI. |
| `pnpm run typecheck` | Executes strict TypeScript checks across all packages and libraries. |
| `pnpm run build` | Builds all monorepo packages and apps for production deployment. |
| `pnpm --filter @workspace/api-server run dev` | Boots the Express API server in development mode. |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerates Zod validation schemas and React fetch hooks from `openapi.yaml`. |
| `pnpm --filter @workspace/db run push` | Applies Drizzle ORM schema changes directly to PostgreSQL. |

---

## 🔄 Contract-First API Development

This repository adheres to a **Contract-First API Design** rule:

1. **Modify Specification**: Make edits to `lib/api-spec/openapi.yaml`.
2. **Trigger Codegen**:
   ```bash
   pnpm --filter @workspace/api-spec run codegen
   ```
3. **Automatic Client Sync**: Generated code in `lib/api-zod/` and `lib/api-client-react/` updates automatically. Never edit generated files directly.

---

## 📑 Documentation

Explore detailed system design and requirement specifications in `docs/`:
- 📄 [Product Requirements Document (`docs/PRD.md`)](docs/PRD.md)
- 📄 [Technical Stack & Architecture (`docs/TECH_STACK.md`)](docs/TECH_STACK.md)
- 📄 [Design & UI/UX Guidelines (`docs/DESIGN.md`)](docs/DESIGN.md)

---

## 🤝 Contributing

Contributions, bug fixes, and feature additions are welcome!

1. Fork the repository and create your feature branch: `git checkout -b feature/amazing-feature`
2. Ensure strict type safety: `pnpm run typecheck`
3. Commit your changes and open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
