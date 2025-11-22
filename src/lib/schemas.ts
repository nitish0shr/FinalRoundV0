import { z } from 'zod'

// Job creation schema
export const createJobSchema = z.object({
    company: z.string().min(1, 'Company name is required').max(200),
    role: z.string().min(1, 'Role is required').max(200),
    level: z.enum(['junior', 'mid', 'senior', 'staff', 'principal', 'unknown']),
    requiredSkills: z.array(z.string()).min(1, 'At least one required skill needed').max(50),
    niceToHaveSkills: z.array(z.string()).max(50),
    jdRaw: z.string().min(10, 'Job description too short').max(50000, 'Job description too long'),
    jdParsed: z.object({
        company: z.string(),
        role: z.string(),
        level: z.enum(['junior', 'mid', 'senior', 'staff', 'principal', 'unknown']),
        requiredSkills: z.array(z.string()),
        niceToHaveSkills: z.array(z.string()),
        rawText: z.string(),
    }),
})

// Resume creation schema
export const createResumeSchema = z.object({
    jobId: z.string().uuid().optional(),
    resumeText: z.string().min(50, 'Resume too short').max(100000, 'Resume too long'),
    gapAnalysis: z.object({
        covered: z.array(z.string()),
        partial: z.array(z.string()),
        missing: z.array(z.string()),
    }).optional(),
})

// JD parsing schema
export const parseJDSchema = z.object({
    jdText: z.string().min(10, 'Job description too short').max(50000, 'Job description too long'),
})

// Resume upload schema
export const uploadResumeSchema = z.object({
    resumeText: z.string().min(50, 'Resume too short').max(100000, 'Resume too long'),
    requiredSkills: z.array(z.string()).min(1, 'Required skills needed').max(50),
})

// URL scraping schema
export const scrapeUrlSchema = z.object({
    url: z.string().url('Invalid URL format').max(2000, 'URL too long'),
})

// Expert profile creation schema
export const createExpertProfileSchema = z.object({
    bio: z.string().max(2000).optional(),
    company: z.string().max(200).optional(),
    role: z.string().max(200).optional(),
    yearsExperience: z.number().int().min(0).max(50).optional(),
    hourlyRate: z.number().min(0).max(10000),
    introVideoUrl: z.string().url().optional(),
    calendlyLink: z.string().url().optional(),
})

// Booking creation schema
export const createBookingSchema = z.object({
    expertId: z.string().uuid(),
    jobId: z.string().uuid().optional(),
    scheduledAt: z.string().datetime(),
    durationHours: z.number().min(0.5).max(8),
    price: z.number().min(0),
    isBlind: z.boolean().optional(),
})

// Review creation schema
export const createReviewSchema = z.object({
    bookingId: z.string().uuid(),
    expertId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    reviewText: z.string().max(2000).optional(),
})

// Helper type exports
export type CreateJobInput = z.infer<typeof createJobSchema>
export type CreateResumeInput = z.infer<typeof createResumeSchema>
export type ParseJDInput = z.infer<typeof parseJDSchema>
export type UploadResumeInput = z.infer<typeof uploadResumeSchema>
export type ScrapeUrlInput = z.infer<typeof scrapeUrlSchema>
export type CreateExpertProfileInput = z.infer<typeof createExpertProfileSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
