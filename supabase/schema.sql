-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('candidate', 'expert', 'admin');
CREATE TYPE job_level AS ENUM ('junior', 'mid', 'senior', 'staff', 'principal', 'unknown');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'refunded');

-- USERS TABLE (Extends Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role user_role DEFAULT 'candidate',
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOBS TABLE
CREATE TABLE public.jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    level job_level DEFAULT 'unknown',
    required_skills TEXT[] DEFAULT '{}',
    nice_to_have_skills TEXT[] DEFAULT '{}',
    jd_raw TEXT NOT NULL,
    jd_parsed JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESUMES TABLE
CREATE TABLE public.resumes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    file_path TEXT, -- Storage path
    text_content TEXT NOT NULL,
    gap_analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EXPERT PROFILES TABLE
CREATE TABLE public.expert_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    years_experience INTEGER NOT NULL DEFAULT 0,
    hourly_rate INTEGER NOT NULL DEFAULT 0, -- In cents
    intro_video_url TEXT,
    calendly_link TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    success_rate INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    total_earnings INTEGER DEFAULT 0, -- In cents
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS TABLE
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    candidate_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    expert_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_hours NUMERIC(3, 1) NOT NULL DEFAULT 1.0,
    price INTEGER NOT NULL, -- In cents
    status booking_status DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    video_room_url TEXT,
    recording_url TEXT,
    transcript_text TEXT,
    is_blind BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEWS TABLE
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL UNIQUE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    expert_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OUTCOMES TABLE (Report Hired)
CREATE TABLE public.outcomes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    got_offer BOOLEAN DEFAULT TRUE,
    offer_details TEXT,
    reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- BADGES TABLE
CREATE TABLE public.badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER BADGES (Join Table)
CREATE TABLE public.user_badges (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- RLS POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;

-- Users: View own data, Update own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
-- Public can view basic expert info (handled via API logic usually, but for SQL access:)
CREATE POLICY "Public can view experts" ON public.users FOR SELECT USING (role = 'expert');

-- Jobs: Private to owner
CREATE POLICY "Users can view own jobs" ON public.jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON public.jobs FOR DELETE USING (auth.uid() = user_id);

-- Resumes: Private to owner
CREATE POLICY "Users can view own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Expert Profiles: Public read, Owner write
CREATE POLICY "Public can view approved experts" ON public.expert_profiles FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Experts can update own profile" ON public.expert_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Experts can insert own profile" ON public.expert_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Bookings: Visible to Candidate and Expert
CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = candidate_id OR auth.uid() = expert_id);
CREATE POLICY "Candidates can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = candidate_id);

-- Reviews: Public read
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Participants can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- TRIGGER: Create public.user on auth.signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', (new.raw_user_meta_data->>'role')::user_role);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
