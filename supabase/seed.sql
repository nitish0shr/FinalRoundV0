-- =============================================
-- Seed Data for FinalRound Testing
-- =============================================

-- Note: Run this AFTER running the schema migration
-- This creates test users and sample data

-- =============================================
-- IMPORTANT: Create Auth Users First
-- =============================================

-- You need to create these users through Supabase Auth UI or using the service
-- We'll create the profiles manually here, assuming auth.users were created

-- For Supabase, use the dashboard to create users with these emails:
-- 1. candidate@test.com (password: password123)
-- 2. expert@test.com (password: password123)
-- 3. admin@test.com (password: password123)

-- After creating users in Supabase Auth dashboard, get their UUIDs and update below:

-- =============================================
-- PROFILES
-- =============================================

-- Insert profiles (replace UUIDs with actual auth.users IDs from your Supabase dashboard)
-- You can find UUIDs in Authentication > Users

-- Example structure (update with real UUIDs):
/*
INSERT INTO public.profiles (id, email, name, role)
VALUES 
  ('candidate-uuid-here', 'candidate@test.com', 'Test Candidate', 'candidate'),
  ('expert-uuid-here', 'expert@test.com', 'Jane Smith', 'expert'),
  ('admin-uuid-here', 'admin@test.com', 'Admin User', 'admin');
*/

-- =============================================
-- EXPERT PROFILE
-- =============================================

-- Create test expert profile (update expert-uuid-here)
/*
INSERT INTO public.expert_profiles (
  user_id,
  bio,
  company,
  role,
  years_experience,
  hourly_rate,
  is_approved,
  success_rate,
  total_sessions,
  blind_booking_enabled
) VALUES (
  'expert-uuid-here',
  'Former Senior Software Engineer at Google with 8+ years of experience in distributed systems, algorithms, and system design. Helped 50+ candidates land FAANG offers.',
  'Google',
  'Senior Software Engineer',
  8,
  200.00,
  true,
  85.50,
  50,
  true
);
*/

-- =============================================
-- SAMPLE JOB
-- =============================================

-- Create a sample job for testing (update candidate-uuid-here)
/*
INSERT INTO public.jobs (
  user_id,
  company,
  role,
  level,
  required_skills,
  nice_to_have_skills,
  jd_raw,
  jd_parsed
) VALUES (
  'candidate-uuid-here',
  'Google',
  'Software Engineer',
  'senior',
  ARRAY['Python', 'System Design', 'Data Structures', 'Algorithms', 'Distributed Systems'],
  ARRAY['Go', 'Kubernetes', 'Machine Learning'],
  'We are looking for a Senior Software Engineer to join our Infrastructure team...',
  '{"company": "Google", "role": "Software Engineer", "level": "senior", "requiredSkills": ["Python", "System Design", "Data Structures", "Algorithms", "Distributed Systems"], "niceToHaveSkills": ["Go", "Kubernetes", "Machine Learning"]}'::jsonb
);
*/

-- =============================================
-- SAMPLE RESUME
-- =============================================

/*
INSERT INTO public.resumes (
  user_id,
  job_id,
  resume_text,
  gap_analysis
) VALUES (
  'candidate-uuid-here',
  (SELECT id FROM public.jobs WHERE user_id = 'candidate-uuid-here' LIMIT 1),
  'John Doe\n\nSoftware Engineer with 5 years of experience...\n\nSkills: Python, JavaScript, React, Node.js, Docker, System Design...',
  '{"covered": ["Python", "Data Structures", "Algorithms"], "partial": ["System Design"], "missing": ["Distributed Systems"]}'::jsonb
);
*/

-- =============================================
-- SAMPLE BOOKING (Past Session)
-- =============================================

/*
INSERT INTO public.bookings (
  candidate_id,
  expert_id,
  scheduled_at,
  duration_hours,
  price,
  status
) VALUES (
  'candidate-uuid-here',
  'expert-uuid-here',
  NOW() - INTERVAL '7 days',
  2.0,
  400.00,
  'completed'
);
*/

-- =============================================
-- SAMPLE REVIEW
-- =============================================

/*
INSERT INTO public.reviews (
  booking_id,
  reviewer_id,
  expert_id,
  rating,
  review_text
) VALUES (
  (SELECT id FROM public.bookings WHERE candidate_id = 'candidate-uuid-here' LIMIT 1),
  'candidate-uuid-here',
  'expert-uuid-here',
  5,
  'Excellent session! Jane helped me understand distributed systems concepts and gave great tips for the Google interview process.'
);
*/

-- =============================================
-- SAMPLE OUTCOME (Got the Offer!)
-- =============================================

/*
INSERT INTO public.outcomes (
  booking_id,
  candidate_id,
  expert_id,
  got_offer,
  offer_details
) VALUES (
  (SELECT id FROM public.bookings WHERE candidate_id = 'candidate-uuid-here' LIMIT 1),
  'candidate-uuid-here',
  'expert-uuid-here',
  true,
  'L5 Software Engineer at Google - $180k base + $100k stock'
);
*/

-- =============================================
-- INSTRUCTIONS
-- =============================================

/*
HOW TO USE THIS FILE:

1. First, create users in Supabase Auth:
   - Go to Authentication > Users > Add User
   - Create: candidate@test.com, expert@test.com, admin@test.com
   - Set password to: password123 for all

2. Get the UUIDs from Authentication > Users page

3. Uncomment the INSERT statements above

4. Replace all instances of:
   - 'candidate-uuid-here' with actual candidate UUID
   - 'expert-uuid-here' with actual expert UUID  
   - 'admin-uuid-here' with actual admin UUID

5. Run this SQL in Supabase SQL Editor

6. Verify data in Table Editor
*/
