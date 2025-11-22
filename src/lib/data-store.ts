import { v4 as uuidv4 } from 'uuid';
import type { ParsedJD, GapAnalysis } from '@/types/job';

// =============================================
// JOB STORE
// =============================================

// Using Job type from @/types/job to avoid duplication
export interface Job {
    id: string;
    userId: string;
    company: string;
    role: string;
    level: string;
    requiredSkills: string[];
    niceToHaveSkills: string[];
    jdRaw: string;
    jdParsed: ParsedJD;
    resumeUrl: string | null;
    resumeText: string | null;
    resumeAnalysis: GapAnalysis | null;
    createdAt: Date;
    updatedAt: Date;
}

class JobStoreClass {
    private jobs: Map<string, Job> = new Map();

    createJob(data: {
        userId: string;
        company: string;
        role: string;
        level: string;
        requiredSkills: string[];
        niceToHaveSkills: string[];
        jdRaw: string;
        jdParsed: ParsedJD;
    }): Job {
        const job: Job = {
            id: uuidv4(),
            ...data,
            resumeUrl: null,
            resumeText: null,
            resumeAnalysis: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.jobs.set(job.id, job);
        return job;
    }

    getJobById(id: string): Job | undefined {
        return this.jobs.get(id);
    }

    getJobsByUserId(userId: string): Job[] {
        return Array.from(this.jobs.values())
            .filter(job => job.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    getAllJobs(): Job[] {
        return Array.from(this.jobs.values())
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    updateJob(id: string, updates: Partial<Omit<Job, 'id' | 'userId' | 'createdAt'>>): Job | undefined {
        const job = this.jobs.get(id);
        if (!job) return undefined;

        const updatedJob = {
            ...job,
            ...updates,
            updatedAt: new Date(),
        };
        this.jobs.set(id, updatedJob);
        return updatedJob;
    }

    deleteJob(id: string): boolean {
        return this.jobs.delete(id);
    }
}

export const JobStore = new JobStoreClass();

// =============================================
// RESUME STORE
// =============================================

export interface Resume {
    id: string;
    userId: string;
    jobId?: string;
    resumeText: string;
    resumeUrl?: string;
    gapAnalysis?: GapAnalysis;
    createdAt: Date;
    updatedAt: Date;
}

class ResumeStoreClass {
    private resumes: Map<string, Resume> = new Map();

    createResume(data: {
        userId: string;
        jobId?: string;
        resumeText: string;
        resumeUrl?: string;
        gapAnalysis?: GapAnalysis;
    }): Resume {
        const resume: Resume = {
            id: uuidv4(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.resumes.set(resume.id, resume);
        return resume;
    }

    getResumeById(id: string): Resume | undefined {
        return this.resumes.get(id);
    }

    getResumesByUserId(userId: string): Resume[] {
        return Array.from(this.resumes.values())
            .filter(resume => resume.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    getResumesByJobId(jobId: string): Resume[] {
        return Array.from(this.resumes.values())
            .filter(resume => resume.jobId === jobId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    updateResume(id: string, updates: Partial<Omit<Resume, 'id' | 'userId' | 'createdAt'>>): Resume | undefined {
        const resume = this.resumes.get(id);
        if (!resume) return undefined;

        const updatedResume = {
            ...resume,
            ...updates,
            updatedAt: new Date(),
        };
        this.resumes.set(id, updatedResume);
        return updatedResume;
    }

    deleteResume(id: string): boolean {
        return this.resumes.delete(id);
    }
}

export const ResumeStore = new ResumeStoreClass();

// =============================================
// EXPERT PROFILE STORE
// =============================================

export interface ExpertProfile {
    id: string;
    userId: string;
    bio?: string;
    company?: string;
    role?: string;
    yearsExperience?: number;
    hourlyRate: number;
    introVideoUrl?: string;
    calendlyLink?: string;
    isApproved: boolean;
    successRate: number;
    totalSessions: number;
    totalEarnings: number;
    offerGuaranteed: boolean;
    blindBookingEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

class ExpertProfileStoreClass {
    private experts: Map<string, ExpertProfile> = new Map();

    createExpertProfile(data: {
        userId: string;
        bio?: string;
        company?: string;
        role?: string;
        yearsExperience?: number;
        hourlyRate: number;
        introVideoUrl?: string;
        calendlyLink?: string;
    }): ExpertProfile {
        const expert: ExpertProfile = {
            id: uuidv4(),
            ...data,
            isApproved: false,
            successRate: 0,
            totalSessions: 0,
            totalEarnings: 0,
            offerGuaranteed: false,
            blindBookingEnabled: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.experts.set(expert.id, expert);
        return expert;
    }

    getExpertById(id: string): ExpertProfile | undefined {
        return this.experts.get(id);
    }

    getExpertByUserId(userId: string): ExpertProfile | undefined {
        return Array.from(this.experts.values()).find(expert => expert.userId === userId);
    }

    getApprovedExperts(): ExpertProfile[] {
        return Array.from(this.experts.values())
            .filter(expert => expert.isApproved)
            .sort((a, b) => b.successRate - a.successRate);
    }

    getPendingExperts(): ExpertProfile[] {
        return Array.from(this.experts.values())
            .filter(expert => !expert.isApproved)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    updateExpert(id: string, updates: Partial<Omit<ExpertProfile, 'id' | 'userId' | 'createdAt'>>): ExpertProfile | undefined {
        const expert = this.experts.get(id);
        if (!expert) return undefined;

        const updatedExpert = {
            ...expert,
            ...updates,
            updatedAt: new Date(),
        };
        this.experts.set(id, updatedExpert);
        return updatedExpert;
    }

    approveExpert(id: string): ExpertProfile | undefined {
        return this.updateExpert(id, { isApproved: true });
    }
}

export const ExpertProfileStore = new ExpertProfileStoreClass();

// =============================================
// BOOKING STORE
// =============================================

export interface Booking {
    id: string;
    candidateId: string;
    expertId: string;
    jobId?: string;
    scheduledAt: Date;
    durationHours: number;
    price: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
    stripePaymentIntentId?: string;
    videoRoomUrl?: string;
    isBlind: boolean;
    createdAt: Date;
    updatedAt: Date;
}

class BookingStoreClass {
    private bookings: Map<string, Booking> = new Map();

    createBooking(data: {
        candidateId: string;
        expertId: string;
        jobId?: string;
        scheduledAt: Date;
        durationHours: number;
        price: number;
        isBlind?: boolean;
    }): Booking {
        const booking: Booking = {
            id: uuidv4(),
            ...data,
            status: 'pending',
            isBlind: data.isBlind || false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.bookings.set(booking.id, booking);
        return booking;
    }

    getBookingById(id: string): Booking | undefined {
        return this.bookings.get(id);
    }

    getBookingsByCandidateId(candidateId: string): Booking[] {
        return Array.from(this.bookings.values())
            .filter(booking => booking.candidateId === candidateId)
            .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
    }

    getBookingsByExpertId(expertId: string): Booking[] {
        return Array.from(this.bookings.values())
            .filter(booking => booking.expertId === expertId)
            .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
    }

    updateBooking(id: string, updates: Partial<Omit<Booking, 'id' | 'candidateId' | 'expertId' | 'createdAt'>>): Booking | undefined {
        const booking = this.bookings.get(id);
        if (!booking) return undefined;

        const updatedBooking = {
            ...booking,
            ...updates,
            updatedAt: new Date(),
        };
        this.bookings.set(id, updatedBooking);
        return updatedBooking;
    }

    confirmBooking(id: string): Booking | undefined {
        return this.updateBooking(id, { status: 'confirmed' });
    }

    completeBooking(id: string): Booking | undefined {
        return this.updateBooking(id, { status: 'completed' });
    }

    cancelBooking(id: string): Booking | undefined {
        return this.updateBooking(id, { status: 'cancelled' });
    }
}

export const BookingStore = new BookingStoreClass();

// =============================================
// REVIEW STORE
// =============================================

export interface Review {
    id: string;
    bookingId: string;
    reviewerId: string;
    expertId: string;
    rating: number; // 1-5
    reviewText?: string;
    createdAt: Date;
}

class ReviewStoreClass {
    private reviews: Map<string, Review> = new Map();

    createReview(data: {
        bookingId: string;
        reviewerId: string;
        expertId: string;
        rating: number;
        reviewText?: string;
    }): Review {
        const review: Review = {
            id: uuidv4(),
            ...data,
            createdAt: new Date(),
        };
        this.reviews.set(review.id, review);
        return review;
    }

    getReviewById(id: string): Review | undefined {
        return this.reviews.get(id);
    }

    getReviewsByExpertId(expertId: string): Review[] {
        return Array.from(this.reviews.values())
            .filter(review => review.expertId === expertId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    getReviewByBookingId(bookingId: string): Review | undefined {
        return Array.from(this.reviews.values()).find(review => review.bookingId === bookingId);
    }

    getAverageRatingForExpert(expertId: string): number {
        const reviews = this.getReviewsByExpertId(expertId);
        if (reviews.length === 0) return 0;

        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    }
}

export const ReviewStore = new ReviewStoreClass();

// =============================================
// OUTCOME STORE
// =============================================

export interface Outcome {
    id: string;
    bookingId: string;
    candidateId: string;
    expertId: string;
    jobId?: string;
    gotOffer: boolean;
    offerDetails?: string;
    createdAt: Date;
}

class OutcomeStoreClass {
    private outcomes: Map<string, Outcome> = new Map();

    createOutcome(data: {
        bookingId: string;
        candidateId: string;
        expertId: string;
        jobId?: string;
        gotOffer: boolean;
        offerDetails?: string;
    }): Outcome {
        const outcome: Outcome = {
            id: uuidv4(),
            ...data,
            createdAt: new Date(),
        };
        this.outcomes.set(outcome.id, outcome);
        return outcome;
    }

    getOutcomeById(id: string): Outcome | undefined {
        return this.outcomes.get(id);
    }

    getOutcomeByBookingId(bookingId: string): Outcome | undefined {
        return Array.from(this.outcomes.values()).find(outcome => outcome.bookingId === bookingId);
    }

    getOutcomesByExpertId(expertId: string): Outcome[] {
        return Array.from(this.outcomes.values())
            .filter(outcome => outcome.expertId === expertId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    getSuccessRateForExpert(expertId: string): number {
        const outcomes = this.getOutcomesByExpertId(expertId);
        if (outcomes.length === 0) return 0;

        const offers = outcomes.filter(outcome => outcome.gotOffer).length;
        return (offers / outcomes.length) * 100;
    }
}

export const OutcomeStore = new OutcomeStoreClass();
