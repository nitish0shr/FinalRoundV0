import { NextRequest, NextResponse } from 'next/server'
import { apiLimiter, getClientIp } from '@/lib/rate-limit'
import { createClient } from '@/lib/supabase/server'
import { JobStore } from '@/lib/data-store'
import { createJobSchema } from '@/lib/schemas'
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
        const validatedData = createJobSchema.parse(body)

        const job = JobStore.createJob({
            userId: user.id,
            company: validatedData.company,
            role: validatedData.role,
            level: validatedData.level,
            requiredSkills: validatedData.requiredSkills,
            niceToHaveSkills: validatedData.niceToHaveSkills,
            jdRaw: validatedData.jdRaw,
            jdParsed: validatedData.jdParsed
        })

        return NextResponse.json({
            success: true,
            data: job
        })
    } catch (error) {
        console.error('Create job error:', error)

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
            { error: 'Failed to create job' },
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

        const jobs = JobStore.getJobsByUserId(user.id)

        return NextResponse.json({
            success: true,
            data: jobs
        })
    } catch (error) {
        console.error('Get jobs error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        )
    }
}
