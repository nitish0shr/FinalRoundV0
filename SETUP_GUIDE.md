# FinalRound - Complete Setup Guide

## ✅ Prerequisites

Before starting, ensure you have:
- Node.js 18+ installed (`node --version`)
- npm or yarn package manager
- A code editor (VS Code recommended)
- Google Chrome browser
- OpenAI API key (get from https://platform.openai.com/api-keys)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
cd /Users/nitishshrivastava/Documents/FinalRoundV0
npm install
```

### Step 2: Configure Environment Variables

**CRITICAL:** You must set your OpenAI API key for the app to work.

Open `.env.local` and replace this line:
```bash
OPENAI_API_KEY=your-openai-api-key-here
```

With your actual API key:
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The other variables have working defaults for local development.

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Open in Chrome

Navigate to: **http://localhost:3000**

You should see the FinalRound landing page with no errors!

---

## 📋 Complete Setup Instructions

### 1. Install All Dependencies

```bash
cd /Users/nitishshrivastava/Documents/FinalRoundV0

# Clean install (recommended)
rm -rf node_modules package-lock.json
npm install

# Or if already installed
npm install
```

**Expected output:**
- No errors
- All packages installed successfully
- `node_modules` directory created

### 2. Environment Configuration

The `.env.local` file has been created with these sections:

#### **Required (App won't work without these):**
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=finalround-super-secret-key-change-in-production-min-32-chars
AUTH_SECRET=finalround-super-secret-key-change-in-production-min-32-chars
OPENAI_API_KEY=your-openai-api-key-here  # ⚠️ MUST BE CHANGED
```

#### **Optional (Currently not used):**
- LinkedIn OAuth
- Supabase
- Stripe
- Video services
- Analytics

**How to get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy it and paste into `.env.local`

### 3. Verify TypeScript Configuration

```bash
npm run build
```

**Expected output:**
- TypeScript compilation successful
- No type errors
- Build completes without errors

If you see errors, they should be clear and fixable. Common issues:
- Missing `.env.local` file → Create it from `.env.example`
- Missing OPENAI_API_KEY → Add it to `.env.local`

### 4. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
   ▲ Next.js 16.0.3
   - Local:        http://localhost:3000
   - ready started server on 0.0.0.0:3000
```

**Troubleshooting:**
- Port 3000 already in use? Kill the process or use a different port:
  ```bash
  lsof -ti:3000 | xargs kill -9
  npm run dev
  ```

### 5. Open in Chrome

**Method 1: Direct URL**
```
http://localhost:3000
```

**Method 2: Command line** (macOS)
```bash
open -a "Google Chrome" http://localhost:3000
```

---

## 🎯 Testing the Application

### Test 1: Landing Page
1. Open http://localhost:3000
2. **Expected:** Beautiful dark-themed landing page with gradient text
3. **Check:** No console errors (F12 → Console tab)

### Test 2: Sign Up Flow
1. Click "Get Started" or "Sign up"
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Create account"
4. **Expected:** Redirects to /dashboard
5. **Check:** Welcome message with your name

### Test 3: Add Job (AI Feature)
1. From dashboard, click "New Job Application"
2. Paste a job description (or use this sample):
   ```
   Senior Software Engineer at Google
   
   Requirements:
   - 5+ years of experience with Python, Go, or Java
   - Strong system design skills
   - Experience with distributed systems
   - Bachelor's in Computer Science
   
   Nice to have:
   - Kubernetes experience
   - Machine learning background
   ```
3. Click "Parse with AI"
4. **Expected:** AI extracts company, role, skills automatically
5. **Check:** Skills displayed in colored tags

### Test 4: Resume Analysis
1. Continue from job parsing
2. Click "Save & Continue to Resume Upload"
3. Paste resume text (or use sample)
4. Click "Analyze Resume"
5. **Expected:** Gap analysis showing covered/partial/missing skills
6. **Check:** Green/yellow/red categories displayed correctly

### Test 5: Navigation
1. Click "Browse Experts" in header
2. **Expected:** Experts page (Coming Soon message)
3. Click "How it Works"
4. **Expected:** Step-by-step guide page
5. Click "FinalRound" logo
6. **Expected:** Returns to landing page

---

## ✅ Verification Checklist

Run through this checklist to confirm everything works:

- [ ] `npm install` completes without errors
- [ ] `.env.local` exists with OPENAI_API_KEY set
- [ ] `npm run dev` starts server successfully
- [ ] http://localhost:3000 loads in Chrome
- [ ] No console errors (F12 → Console)
- [ ] Can create account and sign in
- [ ] Dashboard loads with welcome message
- [ ] Can add new job and parse JD with AI
- [ ] Can upload resume and get gap analysis
- [ ] All navigation links work (no 404s)
- [ ] Sign out and sign in works
- [ ] Dark theme displays correctly

---

## 🐛 Common Issues & Solutions

### Issue: "OPENAI_API_KEY not configured"
**Solution:** Add your API key to `.env.local`:
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Issue: Build fails with TypeScript errors
**Solution:**
```bash
# Delete generated files and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Issue: "Cannot find module 'uuid'"
**Solution:**
```bash
npm install uuid @types/uuid
```

### Issue: White screen / blank page
**Solution:**
1. Open DevTools (F12) → Console tab
2. Look for error messages
3. Most common: Missing environment variables
4. Fix: Ensure `.env.local` is properly configured

### Issue: AI features not working
**Solution:**
1. Verify OPENAI_API_KEY is valid
2. Check OpenAI account has credits
3. Test API key: https://platform.openai.com/playground

---

## 🎨 Features Implemented

### ✅ Working Features:
- [x] User authentication (email/password)
- [x] Job description parsing with AI
- [x] Resume upload and analysis
- [x] Gap analysis (covered/partial/missing skills)
- [x] Dashboard with job tracking
- [x] Responsive dark-themed UI
- [x] Error boundaries
- [x] Protected routes (middleware)

### 🚧 Coming Soon (Placeholder pages created):
- [ ] Expert marketplace
- [ ] Video interview sessions
- [ ] Payment integration (Stripe)
- [ ] LinkedIn OAuth
- [ ] Supabase persistence

---

## 📁 Project Structure

```
FinalRoundV0/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── dashboard/         # Protected dashboard
│   │   ├── jobs/new/          # Add new job flow
│   │   ├── experts/           # Expert directory (coming soon)
│   │   ├── how-it-works/      # Info page
│   │   ├── error.tsx          # Error boundary
│   │   └── api/               # API routes
│   │       ├── auth/          # Authentication
│   │       ├── jobs/          # Job CRUD
│   │       ├── resumes/       # Resume upload
│   │       ├── parse-jd/      # AI JD parsing
│   │       └── scrape-url/    # URL scraping
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   ├── layout/            # Header
│   │   └── ...                # Feature components
│   ├── lib/
│   │   ├── data-store.ts      # In-memory data storage
│   │   ├── user-store.ts      # User management
│   │   ├── openai.ts          # AI functions
│   │   └── utils.ts           # Utilities
│   └── types/
│       └── job.ts             # TypeScript types
├── .env.local                 # Environment variables (YOU EDIT THIS)
├── .env.example               # Template
└── package.json               # Dependencies

```

---

## 🎯 Next Steps After Setup

1. **Test all features** - Go through the testing checklist above
2. **Customize** - Update branding, colors, copy as needed
3. **Add real persistence** - Migrate to Supabase or PostgreSQL
4. **Add payments** - Integrate Stripe for expert bookings
5. **Deploy** - Deploy to Vercel or your preferred host

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Check the browser console (F12) for errors
4. Ensure Node.js version is 18+

---

## 🎉 Success Criteria

Your setup is successful when:
- ✅ Server starts without errors
- ✅ Landing page loads in Chrome
- ✅ Can sign up and log in
- ✅ Can add job and parse with AI
- ✅ Can analyze resume with AI
- ✅ No console errors
- ✅ All routes accessible

**Enjoy building with FinalRound! 🚀**
