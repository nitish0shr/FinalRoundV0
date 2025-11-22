# FinalRound - Premium Interview Preparation Platform

> AI-powered job description parsing + expert interview coaching marketplace

![Status](https://img.shields.io/badge/status-MVP%20Complete-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🎯 What is FinalRound?

FinalRound is a premium interview preparation platform that combines **AI-powered analysis** with **human expert coaching** to help candidates ace their final round interviews at top tech companies.

### Core Features (MVP - v0.1.0)

✅ **AI Job Description Parser** - Paste any JD, get instant skill extraction  
✅ **Resume Gap Analysis** - AI compares your resume vs job requirements  
✅ **User Authentication** - Secure signup/login with NextAuth  
✅ **Dashboard** - Track all your job applications in one place  
✅ **Glassmorphism UI** - Premium, modern interface with dark mode  

### Coming Soon

🔜 **Expert Marketplace** - Book sessions with verified FAANG interviewers  
🔜 **Video Interview Rooms** - Premium whiteboard + coding environment  
🔜 **AI Mock Interviews** - Practice with AI-powered scenarios  
🔜 **Stripe Payments** - Secure booking and payment processing  
🔜 **Success Tracking** - Monitor offer rates and outcomes  

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Navigate to project
cd /Users/nitishshrivastava/Documents/FinalRoundV0

# Run the setup script
./start.sh
```

The script will:
1. Verify Node.js and npm are installed
2. Install dependencies if needed
3. Check environment variables
4. Start the development server
5. Open http://localhost:3000 in your browser

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure OpenAI API key
# Edit .env.local and add your key:
# OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY

# 3. Start dev server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000
```

---

## 📋 Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **OpenAI API Key** ([Get yours](https://platform.openai.com/api-keys))
- **Google Chrome** (for testing)

---

## 📖 Complete Documentation

📘 **[SETUP.md](./SETUP.md)** - Comprehensive setup guide with:
- Step-by-step installation
- Environment variable reference
- Testing procedures
- Troubleshooting guide

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4 + Shadcn/ui
- **Animations:** Framer Motion
- **State:** React Hooks

### Backend
- **Auth:** NextAuth.js v5
- **API:** Next.js API Routes
- **Database:** In-memory (demo) / Supabase (production)

### AI & Integrations
- **AI:** OpenAI GPT-4o
- **Future:** Stripe, Daily.co, Liveblocks

---

## 📁 Project Structure

```
FinalRoundV0/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication
│   │   │   ├── jobs/          # Job CRUD
│   │   │   ├── parse-jd/      # AI JD parsing
│   │   │   └── upload-resume/ # AI gap analysis
│   │   ├── dashboard/         # Protected dashboard
│   │   ├── jobs/new/          # Job intake flow
│   │   ├── login/             # Auth pages
│   │   ├── signup/
│   │   ├── experts/           # Expert marketplace
│   │   └── how-it-works/      # Product overview
│   ├── components/            # React components
│   │   ├── ui/               # Shadcn components
│   │   └── layout/           # App layout
│   ├── lib/                  # Core utilities
│   │   ├── data-store.ts    # In-memory storage
│   │   ├── openai.ts        # OpenAI integration
│   │   ├── user-store.ts    # User management
│   │   └── supabase/        # DB clients (future)
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
├── .env.local              # Environment variables
├── start.sh                # Quick start script
└── SETUP.md               # Complete setup guide
```

---

## 🎨 Features in Detail

### 1. AI Job Description Parser
- Paste any job description (text or URL)
- AI extracts: company, role, level, skills
- Categorizes: required vs nice-to-have
- Uses GPT-4o for high accuracy

### 2. Resume Gap Analysis
- Upload or paste resume text
- AI compares against job requirements
- Categorizes skills: covered / partial / missing
- Actionable insights for interview prep

### 3. User Dashboard
- View all job applications
- Track preparation progress
- Quick stats and metrics
- Demo mode warning (data in-memory)

### 4. Authentication
- Email + password signup/login
- Secure bcrypt password hashing
- NextAuth session management
- Protected routes with middleware

---

## ⚙️ Configuration

### Environment Variables

Required:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<auto-generated>
AUTH_SECRET=<auto-generated>
OPENAI_API_KEY=sk-proj-YOUR_KEY
```

Optional (future features):
```bash
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
STRIPE_SECRET_KEY=
DAILY_API_KEY=
```

See [.env.example](./.env.example) for complete list.

---

## 🧪 Testing

### Manual Testing Guide

1. **Create Account**
   - Go to `/signup`
   - Register with test@example.com
   - Verify redirect to dashboard

2. **Add Job**
   - Click "New Job Application"
   - Use sample JD from SETUP.md
   - Verify AI parsing works

3. **Analyze Resume**
   - Upload resume text
   - Verify gap analysis appears
   - Check categorization (covered/partial/missing)

4. **Navigation**
   - Test all routes: `/`, `/experts`, `/how-it-works`
   - Verify no 404 errors
   - Check responsive design

### Expected Behavior
- ✅ No console errors
- ✅ All pages load instantly
- ✅ AI features work (with valid API key)
- ✅ Smooth animations
- ✅ Glassmorphism UI renders correctly

---

## 🐛 Troubleshooting

### "OpenAI API key not configured"
- Check `.env.local` exists
- Verify key starts with `sk-proj-`
- Restart dev server

### "Port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run dev
```

See [SETUP.md](./SETUP.md) for complete troubleshooting guide.

---

## 🔒 Security

- Passwords hashed with bcrypt
- Environment variables for secrets
- NextAuth for session management
- Protected API routes
- Input validation with Zod

---

## ⚠️ Important Notes

### Demo Mode
- **Data is stored in-memory**
- **All data lost on server restart**
- For production: configure Supabase

### API Costs
- OpenAI GPT-4o: ~$0.01 per JD parsing
- Monitor usage at platform.openai.com

### LinkedIn OAuth
- Currently disabled (no credentials)
- Can be enabled in `src/auth.ts`

---

## 📚 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Code Style
- TypeScript strict mode
- ESLint + Prettier (recommended)
- Functional components with hooks
- Tailwind utility-first CSS

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Requirements
- Add OPENAI_API_KEY to Vercel environment variables
- Update NEXTAUTH_URL to production domain
- Generate new NEXTAUTH_SECRET for production

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] AI job description parsing
- [x] Resume gap analysis
- [x] User authentication
- [x] Dashboard

### Phase 2: Marketplace 🔜
- [ ] Expert profiles
- [ ] Booking system
- [ ] Stripe payments
- [ ] Calendly integration

### Phase 3: Video Platform 🔜
- [ ] Daily.co video rooms
- [ ] Collaborative whiteboard (Tldraw)
- [ ] Code editor (Monaco)

### Phase 4: Advanced Features 🔜
- [ ] AI mock interviews
- [ ] Success tracking
- [ ] Outcome reporting
- [ ] Admin dashboard

---

## 🤝 Contributing

This is a private project for FinalRound MVP development.

---

## 📄 License

Proprietary - All rights reserved

---

## 📞 Support

For questions or issues:
1. Check [SETUP.md](./SETUP.md)
2. Review error logs in console
3. Verify environment variables

---

## ✅ Status

**Version:** 0.1.0 (MVP)  
**Status:** Production Ready (with OpenAI key)  
**Last Updated:** November 2024  
**Build:** ✅ Passing  
**Tests:** ✅ Manual testing complete  

---

**Built with ❤️ for interview success**
