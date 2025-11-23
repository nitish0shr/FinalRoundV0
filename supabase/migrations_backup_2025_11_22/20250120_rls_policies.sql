-- =============================================
-- Row-Level Security (RLS) Policies
-- =============================================

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PROFILES POLICIES
-- =============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can create own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================
-- EXPERT PROFILES POLICIES
-- =============================================

-- Anyone can view approved experts
CREATE POLICY "Anyone can view approved experts"
  ON public.expert_profiles FOR SELECT
  USING (is_approved = true);

-- Experts can view their own profile (even if not approved)
CREATE POLICY "Experts can view own profile"
  ON public.expert_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Experts can create their own profile
CREATE POLICY "Experts can create own profile"
  ON public.expert_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Experts can update their own profile
CREATE POLICY "Experts can update own profile"
  ON public.expert_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can update any expert profile (for approval)
CREATE POLICY "Admins can update expert profiles"
  ON public.expert_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =============================================
-- JOBS POLICIES
-- =============================================

-- Users can view their own jobs
CREATE POLICY "Users can view own jobs"
  ON public.jobs FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own jobs
CREATE POLICY "Users can create own jobs"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own jobs
CREATE POLICY "Users can update own jobs"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own jobs
CREATE POLICY "Users can delete own jobs"
  ON public.jobs FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- RESUMES POLICIES
-- =============================================

-- Users can view their own resumes
CREATE POLICY "Users can view own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own resumes
CREATE POLICY "Users can create own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own resumes
CREATE POLICY "Users can update own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================
-- BOOKINGS POLICIES
-- =============================================

-- Candidates can view their own bookings
CREATE POLICY "Candidates can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = candidate_id);

-- Experts can view bookings they're involved in
CREATE POLICY "Experts can view their bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = expert_id);

-- Candidates can create bookings
CREATE POLICY "Candidates can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = candidate_id);

-- Experts can update bookings they're involved in
CREATE POLICY "Experts can update their bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = expert_id);

-- =============================================
-- REVIEWS POLICIES
-- =============================================

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Users can create reviews for bookings they're in
CREATE POLICY "Users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- =============================================
-- EXPERT FEEDBACK POLICIES
-- =============================================

-- Candidates can view feedback for their bookings
CREATE POLICY "Candidates can view their feedback"
  ON public.expert_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = expert_feedback.booking_id
      AND bookings.candidate_id = auth.uid()
    )
  );

-- Experts can view their own feedback
CREATE POLICY "Experts can view own feedback"
  ON public.expert_feedback FOR SELECT
  USING (auth.uid() = expert_id);

-- Experts can create feedback
CREATE POLICY "Experts can create feedback"
  ON public.expert_feedback FOR INSERT
  WITH CHECK (auth.uid() = expert_id);

-- =============================================
-- AI SUMMARIES POLICIES
-- =============================================

-- Candidates can view their own AI summaries
CREATE POLICY "Candidates can view own summaries"
  ON public.ai_summaries FOR SELECT
  USING (auth.uid() = candidate_id);

-- System can insert summaries (service role)
-- No user-level INSERT policy needed

-- =============================================
-- OUTCOMES POLICIES
-- =============================================

-- Candidates can view their own outcomes
CREATE POLICY "Candidates can view own outcomes"
  ON public.outcomes FOR SELECT
  USING (auth.uid() = candidate_id);

-- Experts can view outcomes for their sessions
CREATE POLICY "Experts can view their outcomes"
  ON public.outcomes FOR SELECT
  USING (auth.uid() = expert_id);

-- Candidates can create outcomes
CREATE POLICY "Candidates can create outcomes"
  ON public.outcomes FOR INSERT
  WITH CHECK (auth.uid() = candidate_id);

-- =============================================
-- PAYOUTS POLICIES
-- =============================================

-- Experts can view their own payouts
CREATE POLICY "Experts can view own payouts"
  ON public.payouts FOR SELECT
  USING (auth.uid() = expert_id);

-- Experts can create payout requests
CREATE POLICY "Experts can create payout requests"
  ON public.payouts FOR INSERT
  WITH CHECK (auth.uid() = expert_id);
