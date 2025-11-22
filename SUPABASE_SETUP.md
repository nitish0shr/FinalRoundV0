# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in the details:
   - **Name:** finalround-dev
   - **Database Password:** (choose a strong password and save it)
   - **Region:** Choose closest to you (e.g., US West)
   - **Pricing Plan:** Free

4. Wait for the project to be created (~2 minutes)

## Step 2: Get API Credentials

1. In your Supabase project, go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see three important values:

   - **Project URL** - starts with `https://...supabase.co`
   - **anon public** key - long string starting with `eyJ...`
   - **service_role** key - long string starting with `eyJ...` (click "Reveal" to see it)

## Step 3: Update Local Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and update these values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
   ```

## Step 4: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the contents of `supabase/migrations/20250120_initial_schema.sql`
4. Click **Run** (or press Cmd+Enter)
5. You should see "Success. No rows returned"

6. Create another new query
7. Copy and paste the contents of `supabase/migrations/20250120_rls_policies.sql`
8. Click **Run**
9. You should see "Success. No rows returned"

## Step 5: Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Scroll down to **Email Templates** (optional but recommended):
   - Customize the confirmation and reset password emails

## Step 6: Seed Test Data (Optional)

1. In SQL Editor, create a new query
2. Copy and paste the contents of `supabase/seed.sql`
3. Run the query
4. This will create 3 test users:
   - `candidate@test.com` (password: `password123`)
   - `expert@test.com` (password: `password123`)
   - `admin@test.com` (password: `password123`)

## Step 7: Verify Setup

1. Restart your Next.js dev server:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. Go to `http://localhost:3000/signup`
3. Create a new account
4. In Supabase dashboard, go to **Authentication** → **Users**
5. You should see your new user listed

6. Go to **Table Editor** and check the `profiles` table
7. Your user profile should be there

## Troubleshooting

### "Missing environment variables"
- Make sure `.env.local` exists and has the correct values
- Restart your dev server after updating env vars

### "Invalid API key"
- Double-check you copied the entire key (they're very long)
- Make sure there are no extra spaces or line breaks

### "Permission denied" errors
- RLS policies might not be set up correctly
- Re-run the `20250120_rls_policies.sql` migration

### "JWT expired" or auth issues
- Your service role key might be wrong
- Try regenerating the keys in Supabase dashboard

## Next Steps

Once setup is complete:
- ✅ Users can sign up and login
- ✅ Jobs and resumes persist to database
- ✅ Data survives server restarts
- ✅ Ready for expert marketplace development

---

## Database Schema Overview

The database includes these tables:

- **profiles** - User accounts (extends auth.users)
- **expert_profiles** - Expert-specific data
- **jobs** - Job descriptions submitted by candidates
- **resumes** - Resume data and gap analysis
- **bookings** - Session bookings between candidates and experts
- **reviews** - Candidate reviews of experts
- **expert_feedback** - Expert feedback for candidates
- **ai_summaries** - AI-generated session summaries
- **outcomes** - "Got the offer" tracking
- **payouts** - Expert payout requests

All tables have Row-Level Security (RLS) enabled to protect user data.
