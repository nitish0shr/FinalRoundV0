export interface ParsedJD {
    company: string
    role: string
    level: 'junior' | 'mid' | 'senior' | 'staff' | 'principal' | 'unknown'
    requiredSkills: string[]
    niceToHaveSkills: string[]
    rawText: string
}

export interface GapAnalysis {
    covered: string[]
    partial: string[]
    missing: string[]
}

export interface Job {
    id: string
    userId: string
    company: string
    role: string
    level: string
    requiredSkills: string[]
    niceToHaveSkills: string[]
    jdRaw: string
    jdParsed: ParsedJD
    createdAt: Date
    updatedAt: Date
}

export interface Resume {
    id: string
    userId: string
    jobId?: string
    resumeText: string
    resumeUrl?: string
    gapAnalysis?: GapAnalysis
    createdAt: Date
    updatedAt: Date
}

export interface ExpertProfile {
    id: string
    userId: string
    bio?: string
    company?: string
    role?: string
    yearsExperience?: number
    hourlyRate: number
    introVideoUrl?: string
    calendlyLink?: string
    isApproved: boolean
    successRate: number
    totalSessions: number
    totalEarnings: number
    offerGuaranteed: boolean
    blindBookingEnabled: boolean
    createdAt: Date
    updatedAt: Date
}

export interface Booking {
    id: string
    candidateId: string
    expertId: string
    jobId?: string
    scheduledAt: Date
    durationHours: number
    price: number
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded'
    stripePaymentIntentId?: string
    videoRoomUrl?: string
    isBlind: boolean
    createdAt: Date
    updatedAt: Date
}

export interface Review {
    id: string
    bookingId: string
    reviewerId: string
    expertId: string
    rating: number
    reviewText?: string
    createdAt: Date
}

export interface Outcome {
    id: string
    bookingId: string
    candidateId: string
    expertId: string
    jobId?: string
    gotOffer: boolean
    offerDetails?: string
    createdAt: Date
}
