# 📊 FinalRound V1.0 Project Board

**Status:** 🔴 Planning Phase  
**Target:** Production Launch  
**Strict Requirement:** 100% Completion of all tickets below.

---

## 🏗️ Epic 1: Infrastructure & Foundation
*Setup the bedrock for the application.*

### [INF-001] Initialize Next.js 16 & Tech Stack
- **Description:** Initialize a new Next.js 16 (App Router) project. Configure TypeScript 5, Tailwind CSS 4, Shadcn UI, Framer Motion, and Zustand.
- **Acceptance Criteria:**
  - [ ] Next.js 16 running without errors.
  - [ ] Tailwind 4 configured and compiling.
  - [ ] Shadcn UI components (Button, Card, Input) render correctly.
  - [ ] Framer Motion animations working.
  - [ ] Global Zustand store configured.
  - [ ] Dark mode (Charcoal/Violet) theme applied globally.

### [INF-002] Setup Supabase Project
- **Description:** Create Supabase project and configure environment.
- **Acceptance Criteria:**
  - [ ] Supabase project created.
  - [ ] Database schema defined (Users, Jobs, Experts, Bookings).
  - [ ] Row Level Security (RLS) policies enabled.
  - [ ] Storage buckets created (resumes, avatars).
  - [ ] Edge Functions initialized.

### [INF-003] Configure Integrations (Stripe, Daily, OpenAI, Resend)
- **Description:** Set up accounts and API keys for all third-party services.
- **Acceptance Criteria:**
  - [ ] Stripe Connect Platform account setup.
  - [ ] Daily.co account setup.
  - [ ] OpenAI API key with GPT-4o access secured.
  - [ ] Resend account setup & domain verified.
  - [ ] All secrets added to `.env.local` (and Vercel).

### [INF-004] Production DevOps Setup
- **Description:** Configure Docker, CI/CD, and Monitoring.
- **Acceptance Criteria:**
  - [ ] Multi-stage Dockerfile created (build -> runtime, non-root).
  - [ ] GitHub Actions pipeline (Lint -> Test -> Build -> Deploy).
  - [ ] Sentry & LogRocket configured.
  - [ ] Vercel Analytics enabled.

---

## 🔐 Epic 2: Authentication & Onboarding
*Secure user access and role management.*

### [AUTH-001] Supabase Auth Implementation
- **Description:** Implement full authentication flow using Supabase Auth.
- **Acceptance Criteria:**
  - [ ] Email/Password login & signup.
  - [ ] Magic Link login.
  - [ ] Protected routes middleware.
  - [ ] Session management via Zustand.

### [AUTH-002] Role-Based Onboarding
- **Description:** Create distinct onboarding flows for Candidates and Experts.
- **Acceptance Criteria:**
  - [ ] User selects role upon signup.
  - [ ] Candidate flow: Profile setup -> Dashboard.
  - [ ] Expert flow: Profile setup -> Verification Gate.
  - [ ] Profile completeness progress bar.

---

## 🎯 Epic 3: Core Candidate Features
*The heart of the prep experience.*

### [CAND-001] Job Description Intake & Parsing
- **Description:** Allow users to input JDs and parse them using GPT-4o.
- **Acceptance Criteria:**
  - [ ] Paste text input.
  - [ ] PDF/DOCX file upload.
  - [ ] OpenAI Function Calling to extract structured data (Role, Skills, Level).
  - [ ] Loading state with micro-interactions.

### [CAND-002] Resume Gap Analysis
- **Description:** Analyze uploaded resume against parsed JD.
- **Acceptance Criteria:**
  - [ ] Resume upload to Supabase Storage.
  - [ ] GPT-4o comparison of Resume vs JD.
  - [ ] Visual display of "Covered" vs "Missing" skills.
  - [ ] 3D tilt cards for results.

### [CAND-003] AI Mock Questions & Roadmap
- **Description:** Generate personalized prep materials.
- **Acceptance Criteria:**
  - [ ] Generate 10 technical + 10 behavioral questions.
  - [ ] Generate 30/60/90 day roadmap.
  - [ ] Save to database.

### [CAND-004] Global Search (Cmd+K)
- **Description:** Implement global command palette.
- **Acceptance Criteria:**
  - [ ] Cmd+K opens search.
  - [ ] Search across Jobs, Experts, and History.
  - [ ] Keyboard navigation support.

---

## 🎓 Epic 4: Expert Marketplace
*Connecting candidates with pros.*

### [MKT-001] Expert Profile & Verification
- **Description:** Expert profile management and public view.
- **Acceptance Criteria:**
  - [ ] Edit Bio, Rate, Company, Role.
  - [ ] Verification status badge.
  - [ ] Availability calendar management.

### [MKT-002] Marketplace Search & Filters
- **Description:** Search interface for finding experts.
- **Acceptance Criteria:**
  - [ ] Filter by Company, Role, Price.
  - [ ] Sort by Rating, Experience.
  - [ ] Glassmorphism cards for experts.

### [MKT-003] Smart Matching & Pricing
- **Description:** Algorithms to recommend experts and set dynamic prices.
- **Acceptance Criteria:**
  - [ ] Matching score based on JD overlap.
  - [ ] Dynamic pricing engine (demand-based).

---

## 💳 Epic 5: Booking & Payments
*Secure transaction handling.*

### [PAY-001] Booking Flow
- **Description:** UI for selecting time and confirming booking.
- **Acceptance Criteria:**
  - [ ] Select slot from availability.
  - [ ] Stripe Payment Element integration.
  - [ ] 70/30 split calculation.
  - [ ] Escrow hold logic implemented.

### [PAY-002] Transactional Emails
- **Description:** Send emails for booking events.
- **Acceptance Criteria:**
  - [ ] Booking Confirmed email.
  - [ ] Reminder email (24h, 1h).
  - [ ] React Email templates used.

---

## 📹 Epic 6: Video & Feedback
*The interview experience.*

### [VID-001] Video Room Implementation
- **Description:** Daily.co / 100ms integration.
- **Acceptance Criteria:**
  - [ ] Join room button (active 5m before).
  - [ ] Video/Audio controls.
  - [ ] Server-side recording enabled.
  - [ ] Live transcription display.

### [VID-002] Post-Session Feedback
- **Description:** AI analysis and rating system.
- **Acceptance Criteria:**
  - [ ] Expert submits feedback form.
  - [ ] AI generates summary from transcript.
  - [ ] Candidate rates Expert.

---

## 🏆 Epic 7: Gamification & Dashboards
*Engagement and management.*

### [GAME-001] Badges & Achievements
- **Description:** System for awarding user achievements.
- **Acceptance Criteria:**
  - [ ] Database schema for badges.
  - [ ] UI for displaying badges.
  - [ ] "Report Hired" flow with confetti explosion.
  - [ ] Public success counter.

### [DASH-001] Expert Dashboard
- **Description:** Financials and session management for experts.
- **Acceptance Criteria:**
  - [ ] Earnings chart.
  - [ ] Escrow status list.
  - [ ] Payout request button.

### [DASH-002] Admin Dashboard
- **Description:** Super-admin controls.
- **Acceptance Criteria:**
  - [ ] User management list.
  - [ ] Transaction log.
  - [ ] Dispute resolution actions.

---

## 🛡️ Epic 8: Production Readiness
*Non-negotiable requirements.*

### [PROD-001] Security & Compliance
- **Description:** GDPR and Security headers.
- **Acceptance Criteria:**
  - [ ] "Delete Everything" button works (cascading delete).
  - [ ] Helmet/CSP headers configured.
  - [ ] Rate limiting on API routes.

### [PROD-002] Testing & Quality
- **Description:** Automated testing suite.
- **Acceptance Criteria:**
  - [ ] Jest unit tests.
  - [ ] Playwright E2E tests.
  - [ ] >85% coverage verified.
  - [ ] Load test to 500 concurrent users.

---

**Approval Required:**
[ ] Board Reviewed
[ ] All Tickets Approved
