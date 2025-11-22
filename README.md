# FinalRound

**Premium Interview Prep Platform** - Elite human experts + AI-powered coaching

[![CI/CD](https://github.com/nitish0shr/FinalRoundV0/actions/workflows/ci.yml/badge.svg)](https://github.com/nitish0shr/FinalRoundV0/actions/workflows/ci.yml)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in .env.local with your API keys

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📋 Prerequisites

- Node.js 20+
- Supabase account ([supabase.com](https://supabase.com))
- Stripe account ([stripe.com](https://stripe.com))
- OpenAI API key ([platform.openai.com](https://platform.openai.com))
- Daily.co account ([daily.co](https://daily.co))
- Resend account ([resend.com](https://resend.com))

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animation**: Framer Motion
- **State**: Zustand
- **Database**: Supabase (Postgres + Auth + Storage + Realtime)
- **Payments**: Stripe Connect
- **Video**: Daily.co
- **AI**: OpenAI GPT-4
- **Email**: Resend
- **Testing**: Jest + Playwright
- **DevOps**: Docker + GitHub Actions

---

## 📦 Features

### For Candidates
- ✨ AI-powered job description parsing
- 📄 Resume gap analysis
- 🎯 Personalized interview prep roadmap
- 👔 Book sessions with industry experts
- 📹 Video mock interviews with recording
- 📊 Post-session AI feedback

### For Experts
- 💰 Set your own rates
- 📅 Flexible scheduling
- 💳 Guaranteed payouts (70/30 split)
- ⭐ Build your reputation

### Platform Features
- 🔍 Global search (Cmd+K)
- 🎉 "Report Hired" with confetti celebration
- 🏆 Badges & achievements
- 📈 Public success counter
- 🌙 Dark mode glassmorphism UI

---

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── onboarding/        # Role-based onboarding
│   └── ...
├── components/            # React components
├── lib/                   # Utilities & integrations
│   ├── supabase/         # Supabase clients
│   ├── integrations.ts   # Stripe, Daily, Resend
│   └── store.ts          # Zustand state
└── middleware.ts          # Auth middleware

supabase/
└── schema.sql            # Database schema + RLS policies

tests/
└── e2e/                  # Playwright E2E tests
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test:ci

# E2E tests
npm run test:e2e
npm run test:e2e:ui  # Interactive mode
```

---

## 🐳 Docker

```bash
docker build -t finalround .
docker run -p 3000:3000 --env-file .env.local finalround
```

---

## 📝 Documentation

- [Implementation Status](./IMPLEMENTATION_STATUS.md) - Full feature checklist
- [Project Board](./PROJECT_BOARD.md) - Task breakdown
- [Supabase Schema](./supabase/schema.sql) - Database structure

---

## 🔐 Environment Variables

See `.env.example` for all required variables.

Critical:
- `NEXTAUTH_SECRET` - Authentication secret
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `OPENAI_API_KEY` - Must start with `sk-`
- `STRIPE_SECRET_KEY` - Stripe API key
- `DAILY_API_KEY` - Daily.co API key

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

---

## 📊 Status

**Production Ready** ✅

All 19 core features implemented and tested.

---

## 📄 License

Proprietary

---

## 🤝 Support

For issues or questions, contact support@finalround.ai
