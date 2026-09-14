# 🚀 AI Resume Analyzer (ResumeAI)

[![Node.js Version](https://img.shields.io/badge/node-24.x-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![pnpm Workspaces](https://img.shields.io/badge/pnpm-workspaces-orange.svg)](https://pnpm.io/)
[![Express 5](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**AI Resume Analyzer (ResumeAI)** is an intelligent, multi-platform personal career development and resume optimization platform. Built as a high-performance contract-driven monorepo, ResumeAI provides job seekers with real-time Applicant Tracking System (ATS) scoring, dynamic skill gap analysis against job descriptions, AI-powered bullet point revisions, and interactive mobile and web career dashboards.

---

## ⚡ Interactive Control Center

To streamline navigation, testing, and workspace management, run the interactive terminal control center:

```bash
pnpm readme
```

### What you can do in the Control Center:
- 📖 **Browse Project Vision & Architecture**: View product goals, tech stack choices, and micro-package dependencies.
- ⚡ **Execute Orchestration Commands**: Run typechecking, build scripts, ORM database pushes, and client codegen directly from an interactive CLI menu.
- 🛠️ **Review Developer Notes**: Inspect contract-first rules and environment configuration guidance.

---

## ✨ Key Features

- **🎯 ATS Resume Scoring**: Evaluates candidate resumes against ATS parsing algorithms, formatting rules, and impact phrasing.
- **🔍 Dynamic Job Matching & Skill Gap Analysis**: Paste target job descriptions to identify missing technical keywords and hard/soft skill gaps.
- **✍️ AI Resume Bullet Re-writer**: Transforms weak bullet points into high-impact, quantifiable achievement statements powered by LLMs.
- **📱 Multi-Platform Clients**:
  - **Web Sandbox (`artifacts/mockup-sandbox`)**: Vite & React interactive web interface.
  - **Mobile App (`artifacts/mobile`)**: Expo & React Native iOS/Android application.
- **🔒 Contract-First Backend (`artifacts/api-server`)**: High-performance Express 5 server backed by PostgreSQL, Drizzle ORM, Zod validation, and OpenAPI 3.1 specifications.

---

## 📁 Repository Directory Structure

```
.
├── 📁 artifacts/              # Monorepo application artifacts & clients
│   ├── 📁 api-server/         # High-performance Express 5 API Server (TypeScript)
│   ├── 📁 mobile/             # Expo & React Native cross-platform mobile client
│   └── 📁 mockup-sandbox/     # Vite + React component preview & sandbox environment
│
├── 📁 attached_assets/        # Project specifications & PRD reference assets
│   ├── 📁 generated_images/   # Project logos & UI visual assets
│   ├── 📄 DesignPRD_*.md      # UI/UX design requirements spec
│   ├── 📄 ProjectPRD_*.md     # Detailed product requirements document
│   └── 📄 TechStackPRD_*.md   # Technical architecture specification
│
├── 📁 docs/                   # Structured Project Documentation
│   ├── 📄 DESIGN.md           # UI/UX & Design Guidelines
│   ├── 📄 PRD.md              # Product Requirements Document
│   └── 📄 TECH_STACK.md       # Technical Stack & Architecture Specification
│
├── 📁 lib/                    # Shared Monorepo Packages & Core Libraries
│   ├── 📁 api-client-react/   # TanStack React Query hooks auto-generated via Orval
│   ├── 📁 api-spec/           # Central OpenAPI 3.1 contract spec (openapi.yaml)
│   ├── 📁 api-zod/            # Auto-generated Zod runtime validation schemas
│   └── 📁 db/                 # PostgreSQL declarations & Drizzle ORM schema definitions
│
├── 📁 scripts/                # Terminal Utilities & Interactive CLI Control Center
│   ├── 📁 src/                # Interactive README & CLI script sources
│   ├── 📄 package.json        # Workspace package config for scripts
│   └── 📄 post-merge.sh       # Git hook script for post-merge actions
│
├── 📄 package.json            # Root monorepo workspace configuration
├── 📄 pnpm-workspace.yaml     # pnpm workspace package declarations
├── 📄 replit.md               # Quick operational summary & environment cheat sheet
└── 📄 README.md               # Primary project documentation
```

---

## 🛠️ Technology Stack

| Domain | Technology |
| ------ | ---------- |
| **Monorepo Management** | `pnpm` workspaces, Node.js 24+, TypeScript 5.9 |
| **Backend Framework** | Express 5, Node.js (TypeScript) |
| **Database & ORM** | PostgreSQL, Drizzle ORM, `drizzle-zod` |
| **API Contract & Codegen** | OpenAPI 3.1 (`openapi.yaml`), Orval, Zod (`zod/v4`) |
| **Web Frontend** | Vite, React 18, Tailwind CSS, Lucide Icons, Radix UI |
| **Mobile Frontend** | Expo SDK, React Native, Expo Router, Recharts |
| **AI Integration** | OpenAI API (GPT-3.5 / GPT-4) |

---

## 🚦 Quick Start Guide

### Prerequisites

- **Node.js**: `v24.x` or higher
- **pnpm**: `v10.x` or higher (`npm install -g pnpm`)
- **PostgreSQL Database**: Accessible via connection URI

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sarthakikanchangire21-ux/AI-Resume-Analyzer.git
   cd AI-Resume-Analyzer
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file or declare the required environment variables:
   ```env
   DATABASE_URL="postgres://user:password@localhost:5432/resume_ai"
   OPENAI_API_KEY="your-openai-api-key"
   PORT=5000
   ```

---

## 📜 Available Scripts

Run these scripts from the repository root:

| Command | Description |
| ------- | ----------- |
| `pnpm readme` | Launches the interactive terminal documentation & command runner. |
| `pnpm run typecheck` | Performs strict TypeScript checks across all workspace packages and shared libraries. |
| `pnpm run build` | Builds all monorepo packages for production deployment. |
| `pnpm --filter @workspace/api-server run dev` | Starts the Express API server in development mode (Port 5000). |
| `pnpm --filter @workspace/api-spec run codegen` | Regenerates Zod schemas and React fetch hooks from `openapi.yaml`. |
| `pnpm --filter @workspace/db run push` | Synchronizes Drizzle ORM schema changes directly with PostgreSQL. |

---

## 📑 Detailed Documentation

For in-depth architectural choices, product specs, and design guidelines, explore the `docs/` folder:
- 📄 [Product Requirements Document (`docs/PRD.md`)](docs/PRD.md)
- 📄 [Technical Stack & Architecture (`docs/TECH_STACK.md`)](docs/TECH_STACK.md)
- 📄 [Design & UI/UX Guidelines (`docs/DESIGN.md`)](docs/DESIGN.md)

---

## 🤝 Contributing & License

Contributions are welcome! Please ensure all code passes type checks (`pnpm run typecheck`) and adheres to contract-first OpenAPI guidelines before submitting pull requests.

Distributed under the **MIT License**.
