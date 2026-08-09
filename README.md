# AI Resume Analyzer

AI Resume Analyzer is a comprehensive, smart, and interactive platform designed to help job seekers optimize their resumes, pass applicant tracking systems (ATS), and land their dream jobs. By analyzing formatting, experience quality, and skills relevance, it provides actionable, data-driven suggestions to boost your resume's impact.

---

## 🚀 Getting Started with the Interactive Control Center

To make onboarding and development across this monorepo as frictionless as possible, we have introduced a terminal-based **Interactive README & Command Orchestration Tool**.

Instead of searching through countless Markdown files and manually copying terminal scripts, you can run the following single command to explore documentation and run commands:

```bash
pnpm readme
```

### What you can do inside the Interactive Center:
1. **Browse Project Overview & Vision**: Understand the core objectives and features of the AI Resume Analyzer.
2. **Explore the Technical Stack**: Detailed views of the technologies (React, Expo, Express, PostgreSQL, Drizzle ORM, OpenAPI, Zod).
3. **Inspect the Workspace Architecture**: Get a complete map of the workspaces (`lib/`, `artifacts/`, etc.) and the development flow.
4. **Learn Dev Gotchas**: Crucial warnings about auto-generated specifications and database sync commands.
5. **Orchestrate Development Tools**: Run typecheck, compile/build, sync database structures, or boot up development servers directly from the menu.

---

## ✨ Core Features

- **ATS Score Check**: Instantly evaluate how well your resume passes through Applicant Tracking Systems (ATS) with detailed compatibility and formatting analysis.
- **Comprehensive Resume Score**: Get a 0–100 score covering formatting, experience quality, skills relevance, and education.
- **Tailored AI Suggestions**: Receive personalized, actionable recommendations to improve bullet points and highlight measurable achievements.
- **Job Description Matching**: Paste any job description to instantly see how well your resume aligns with the required keywords and skills.
- **Skill Gap Analysis**: Identify missing key skills compared to industry benchmarks and discover curated pathways to close the gap.
- **AI-Powered Resume Rewrite**: Rewrite your summary, experience bullets, and skills section with ATS-friendly, impactful language.

---

## 🛠️ Stack and Workspaces

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
