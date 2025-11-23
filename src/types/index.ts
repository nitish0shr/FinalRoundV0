// Global type definitions for FinalRound

import { User } from 'next-auth'

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: 'candidate' | 'expert' | 'admin'
      avatar?: string
    }
  }

  interface User {
    id: string
    role: 'candidate' | 'expert' | 'admin'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'candidate' | 'expert' | 'admin'
  }
}

// Database types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'candidate' | 'expert' | 'admin'
  created_at: string
  updated_at: string
}

export interface Expert {
  id: string
  user_id: string
  company: string
  job_title: string
  years_experience: number
  hourly_rate: number
  bio?: string
  video_intro_url?: string
  expertise: string[]
  verified: boolean
  success_rate: number
  total_sessions: number
  stripe_account_id?: string
  stripe_charges_enabled: boolean
  stripe_payouts_enabled: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  expert_id: string
  candidate_id: string
  scheduled_at: string
  duration: number
  price: number
  is_blind: boolean
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  booking_id: string
  expert_id: string
  candidate_id: string
  room_name: string
  room_url: string
  started_at?: string
  ended_at?: string
  duration?: number
  recording_url?: string
  transcript?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  booking_id: string
  amount: number
  platform_fee: number
  expert_earnings: number
  stripe_payment_intent_id?: string
  stripe_transfer_id?: string
  status: 'pending' | 'held' | 'released' | 'refunded' | 'failed'
  created_at: string
  updated_at: string
}

export interface Feedback {
  id: string
  session_id: string
  candidate_rating?: number
  candidate_review?: string
  strengths?: string
  weaknesses?: string
  resources?: string
  ai_summary?: string
  got_offer?: boolean
  offer_company?: string
  created_at: string
}

export interface Earnings {
  id: string
  expert_id: string
  payment_id: string
  amount: number
  status: 'pending' | 'available' | 'paid_out'
  stripe_payout_id?: string
  paid_out_at?: string
  created_at: string
}

// Job Description types
export interface ParsedJobDescription {
  raw_text: string
  company: string
  role: string
  level: string
  required_skills: string[]
  preferred_skills: string[]
  interview_process: string[]
  key_responsibilities: string[]
  compensation_range?: string
  location?: string
  remote_option?: boolean
}

// Resume types
export interface ParsedResume {
  raw_text: string
  name: string
  email?: string
  phone?: string
  skills: string[]
  experience: ResumeExperience[]
  education: ResumeEducation[]
  summary?: string
}

export interface ResumeExperience {
  company: string
  role: string
  duration: string
  description: string
}

export interface ResumeEducation {
  institution: string
  degree: string
  field: string
  year: string
}

// Gap Analysis
export interface GapAnalysis {
  overall_match_score: number
  missing_skills: string[]
  matching_skills: string[]
  experience_gap: string
  recommendations: string[]
  interview_focus_areas: string[]
}

// Expert Matching
export interface ExpertMatch {
  expert: Expert
  match_score: number
  matching_skills: string[]
  years_experience_match: boolean
  company_match: boolean
  reasons: string[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Daily.co types
export interface DailyRoom {
  id: string
  name: string
  url: string
  created_at: string
  config: {
    exp?: number
    max_participants?: number
    enable_recording?: string
  }
}

export interface DailyMeetingToken {
  token: string
  room_name: string
}

// Stripe types
export interface StripeAccount {
  id: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: string
  client_secret: string
}

// Component Props types
export interface BookingFlowProps {
  expert: Expert
  onComplete: (bookingData: any) => void
  onCancel: () => void
}

export interface VideoSessionRoomProps {
  roomUrl: string
  sessionId: string
  userName: string
  userRole: 'candidate' | 'expert'
  onEndSession: () => void
}

export interface FeedbackFlowProps {
  sessionId: string
  expertName: string
  userRole: 'candidate' | 'expert'
  onComplete: () => void
}

export interface JobDescriptionIntakeProps {
  onComplete: (jdData: ParsedJobDescription) => void
}
