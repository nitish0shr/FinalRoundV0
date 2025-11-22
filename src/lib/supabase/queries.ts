import { createClient } from './client'
import type { ParsedJD, GapAnalysis } from '@/types/job'

// =============================================
// USER QUERIES
// =============================================

export async function getUserProfile(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) throw error
    return data
}

export async function createUserProfile(data: {
    id: string
    email: string
    name: string
    role: 'candidate' | 'expert' | 'admin'
}) {
    const supabase = createClient()
    const { data: profile, error } = await supabase
        .from('profiles')
        .insert(data)
        .select()
        .single()

    if (error) throw error
    return profile
}

export async function updateUserProfile(
    userId: string,
    updates: Partial<{ name: string; avatar_url: string }>
) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error
    return data
}

// =============================================
// JOB QUERIES
// =============================================

export async function createJob(data: {
    user_id: string
    company: string
    role: string
    level: string
    required_skills: string[]
    nice_to_have_skills: string[]
    jd_raw: string
    jd_parsed: ParsedJD
}) {
    const supabase = createClient()
    const { data: job, error } = await supabase
        .from('jobs')
        .insert(data)
        .select()
        .single()

    if (error) throw error
    return job
}

export async function getUserJobs(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getJob(jobId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

    if (error) throw error
    return data
}

export async function updateJob(
    jobId: string,
    updates: Partial<{
        company: string
        role: string
        level: string
        required_skills: string[]
        nice_to_have_skills: string[]
        jd_parsed: ParsedJD
    }>
) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single()

    if (error) throw error
    return data
}

// =============================================
// RESUME QUERIES
// =============================================

export async function createResume(data: {
    user_id: string
    job_id?: string
    resume_text: string
    resume_url?: string
    gap_analysis?: GapAnalysis
}) {
    const supabase = createClient()
    const { data: resume, error } = await supabase
        .from('resumes')
        .insert(data)
        .select()
        .single()

    if (error) throw error
    return resume
}

export async function getResumesByJob(jobId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('job_id', jobId)

    if (error) throw error
    return data
}

export async function updateResume(
    resumeId: string,
    updates: Partial<{
        resume_text: string
        gap_analysis: GapAnalysis
    }>
) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('resumes')
        .update(updates)
        .eq('id', resumeId)
        .select()
        .single()

    if (error) throw error
    return data
}

// =============================================
// EXPERT QUERIES
// =============================================

export async function getApprovedExperts() {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('expert_profiles')
        .select(`
      *,
      profiles:user_id (
        id,
        name,
        email,
        avatar_url
      )
    `)
        .eq('is_approved', true)
        .order('success_rate', { ascending: false })

    if (error) throw error
    return data
}

export async function getExpertProfile(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('expert_profiles')
        .select(`
      *,
      profiles:user_id (
        id,
        name,
        email,
        avatar_url
      )
    `)
        .eq('user_id', userId)
        .single()

    if (error) throw error
    return data
}

export async function createExpertProfile(data: {
    user_id: string
    bio?: string
    company?: string
    role?: string
    years_experience?: number
    hourly_rate: number
    intro_video_url?: string
    calendly_link?: string
}) {
    const supabase = createClient()
    const { data: expert, error } = await supabase
        .from('expert_profiles')
        .insert(data)
        .select()
        .single()

    if (error) throw error
    return expert
}

// =============================================
// BOOKING QUERIES
// =============================================

export async function createBooking(data: {
    candidate_id: string
    expert_id: string
    job_id?: string
    scheduled_at: string
    duration_hours: number
    price: number
    is_blind?: boolean
}) {
    const supabase = createClient()
    const { data: booking, error } = await supabase
        .from('bookings')
        .insert(data)
        .select()
        .single()

    if (error) throw error
    return booking
}

export async function getCandidateBookings(candidateId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      expert:expert_id (
        id,
        name,
        avatar_url
      ),
      job:job_id (
        company,
        role
      )
    `)
        .eq('candidate_id', candidateId)
        .order('scheduled_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getExpertBookings(expertId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('bookings')
        .select(`
      *,
      candidate:candidate_id (
        id,
        name,
        avatar_url
      ),
      job:job_id (
        company,
        role
      )
    `)
        .eq('expert_id', expertId)
        .order('scheduled_at', { ascending: false })

    if (error) throw error
    return data
}

// =============================================
// REVIEW QUERIES
// =============================================

export async function createReview(data: {
    booking_id: string
    reviewer_id: string
    expert_id: string
    rating: number
    review_text?: string
}) {
    const supabase = createClient()
    const { data: review, error } = await supabase
        .from('reviews')
        .insert(data)
        .select()
        .single()

    if (error) throw error
    return review
}

export async function getExpertReviews(expertId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('reviews')
        .select(`
      *,
      reviewer:reviewer_id (
        name,
        avatar_url
      )
    `)
        .eq('expert_id', expertId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

// =============================================
// OUTCOME QUERIES
// =============================================

export async function createOutcome(data: {
    booking_id: string
    candidate_id: string
    expert_id: string
    job_id?: string
    got_offer: boolean
    offer_details?: string
}) {
    const supabase = createClient()
    const { data: outcome, error } = await supabase
        .from('outcomes')
        .insert(data)
        .select()
        .single()

    if (error) throw error
    return outcome
}

export async function getExpertSuccessRate(expertId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('outcomes')
        .select('got_offer')
        .eq('expert_id', expertId)

    if (error) throw error

    if (!data || data.length === 0) return 0

    const offers = data.filter((o: { got_offer: boolean }) => o.got_offer).length
    return (offers / data.length) * 100
}
