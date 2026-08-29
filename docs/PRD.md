# Product Requirements Document (PRD)

## 1. Executive Summary
**AI Resume Analyzer (ResumeAI)** is an intelligent, interactive personal career development system designed to optimize resumes, identify key industry skill gaps, match job descriptions dynamically, and suggest actionable revisions. Integrated with AI-driven insights, ResumeAI acts as an advanced career coach guiding candidates toward higher interview callbacks and successful job applications.

---

## 2. Product Overview & Core Vision

### Vision
Democratize career guidance and resume optimization by giving candidates instant, AI-driven feedback that mirrors real Applicant Tracking Systems (ATS) and hiring recruiter evaluations.

### Key Objectives
- **ATS Compatibility Analysis**: Provide real-time ATS scoring based on formatting, action verbs, section organization, and vocabulary.
- **Skill Gap & Job Description Matching**: Compare candidate resumes against job postings to identify missing skills and suggest targeted improvements.
- **AI Bullet Point & Summary Re-writer**: Auto-generate impact-focused bullet points using action verbs and quantified achievements.
- **Career Dashboard**: Track application improvements, analyze skill trends, and manage document versions over time.

---

## 3. Core Capabilities & User Stories

### 3.1 Capabilities
1. **Resume Ingestion & Parsing**: Extract structured content from plain text, PDF, and DOCX formats.
2. **Interactive Career Control Center**: Terminal CLI tool (`pnpm readme`) and interactive Web/Mobile interfaces for rapid workspace orchestration.
3. **Automated Skill Extraction**: Categorize technical, soft, and domain-specific skills using natural language processing.
4. **Actionable Revisions**: Context-aware AI recommendations for polishing summary statements and experience sections.

### 3.2 User Stories
- **Candidate**: *As a job seeker, I want to paste a target job description so that I can see my match score and missing keywords before applying.*
- **Career Switcher**: *As a professional changing industries, I want AI recommendations on transferable skills so that I can highlight relevant experience.*
- **Developer / Contributor**: *As a developer, I want a single unified CLI tool to inspect micro-workspace packages, run type checks, and boot servers seamlessly.*

---

## 4. Workspaces & Functional Scope

| Package / Workspace | Scope & Functionality |
| ------------------- | --------------------- |
| `artifacts/api-server` | Express 5 TypeScript server handling authentication, ATS analysis, and OpenAI API integrations. |
| `artifacts/mobile` | Expo React Native client supporting mobile navigation, budget & career tracking components. |
| `artifacts/mockup-sandbox` | Vite React preview environment for rapid component experimentation. |
| `lib/api-spec` | Source of truth OpenAPI 3.1 specification for contract-first development. |
| `lib/api-zod` | Auto-generated Zod schemas for runtime validation across packages. |
| `lib/api-client-react` | TanStack Query fetch hooks auto-generated from OpenAPI specifications. |
| `lib/db` | PostgreSQL schema definitions and Drizzle ORM migrations. |
| `scripts/` | Terminal orchestration and interactive documentation tools (`pnpm readme`). |

---

## 5. Non-Functional Requirements & Metrics

- **Response Time**: API endpoints return standard responses in < 200ms; AI analysis routines finish in < 3 seconds.
- **Type Safety**: 100% strict TypeScript verification across all workspace packages (`pnpm run typecheck`).
- **Data Privacy**: Secure database operations with zero permanent storing of unhashed sensitive credentials.
