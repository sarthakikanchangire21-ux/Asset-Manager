# Design & UI/UX Guidelines

This document outlines the UI/UX design philosophy, theme tokens, and component structure across web and mobile clients for **AI Resume Analyzer**.

---

## 1. Design Philosophy

- **Mobile-First & Clean**: Prioritize clarity, high legibility, and effortless data input for career documents.
- **Visual Feedback & ATS Scores**: Utilize color-coded progress bars and indicators (Green = High Match, Amber = Moderate, Red = Missing/Needs Attention) for resume insights.
- **Accessibility & Contrast**: Modern typography and high-contrast color palettes ensuring accessibility across web and mobile screens.

---

## 2. Color Palette & Typography

### Light Theme
- **Primary**: `#2E7D32` (Emerald Green - symbol of growth and career advancement)
- **Secondary**: `#1B5E20` (Dark Forest Green)
- **Background**: `#F8FAFC` (Clean Slate)
- **Card / Surface**: `#FFFFFF` (Pure White with light border shadows)
- **Text Primary**: `#0F172A` (Slate 900)
- **Text Secondary**: `#475569` (Slate 600)

### Status Indicators
- **Success / High Match**: `#16A34A`
- **Warning / Partial Match**: `#D97706`
- **Danger / Missing Skill**: `#DC2626`
- **Info / Insight**: `#2563EB`

---

## 3. UI Components

### Web UI Components (`artifacts/mockup-sandbox`)
- **ATS Score Gauge**: Visual radial gauge indicating overall resume rating.
- **Skill Gap List**: Interactive tag system highlighting required vs present resume skills.
- **AI Re-writer Card**: Side-by-side comparison view showing original text vs AI-improved bullet points.

### Mobile UI Components (`artifacts/mobile`)
- **StatCard**: Modular metric display for ATS rating, matched keywords, and application counts.
- **BudgetCard / ResumeCard**: Visual card displays with status badges and action triggers.
- **DonutChart**: Interactive breakdown chart built with React Native SVG and Recharts.
