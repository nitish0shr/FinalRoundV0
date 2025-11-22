import { NextRequest, NextResponse } from 'next/server'
import { apiLimiter, getClientIp } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { ResumeStore } from '@/lib/data-store'
import { createResumeSchema } from '@/lib/schemas'
import { z } from 'zod'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Rate limiting
        const ip = getClientIp(request)
        const identifier = user.email || ip
        const { success, limit, remaining, reset } = apiLimiter.check(20, identifier)

        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': reset.toString(),
                    }
                }
            )
        }

        const body = await request.json()

        // Validate request body
        const validatedData = createResumeSchema.parse(body)

        const resume = ResumeStore.createResume({
            userId: user.id,
            jobId: validatedData.jobId,
            resumeText: validatedData.resumeText,
            gapAnalysis: validatedData.gapAnalysis
        })

        return NextResponse.json({
            success: true,
            data: resume
        })
    } catch (error) {
        console.error('Create resume error:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Invalid request data',
                    details: error.issues
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to save resume' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const jobId = searchParams.get('jobId')

        const resumes = jobId
            ? ResumeStore.getResumesByJobId(jobId)
            : ResumeStore.getResumesByUserId(user.id)

        return NextResponse.json({
            success: true,
            data: resumes
        })
    } catch (error) {
        console.error('Get resumes error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch resumes' },
            { status: 500 }
        )
    }
}
