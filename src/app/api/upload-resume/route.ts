import { NextRequest, NextResponse } from 'next/server'
import { analyzeGap } from '@/lib/openai'
import { createClient } from '@/lib/supabase/server'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // Rate limiting: 5 requests per minute per user
        const ip = getClientIp(request)
        const identifier = user.email || ip
        const { success, limit, remaining, reset } = aiLimiter.check(5, identifier)

        if (!success) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please try again in a minute.',
                    limit,
                    remaining: 0,
                    reset,
                },
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

        const { resumeText, requiredSkills } = await request.json()

        // Validate required fields
        if (!resumeText || typeof resumeText !== 'string') {
            return NextResponse.json(
                { error: 'Invalid resume text' },
                { status: 400 }
            )
        }

        if (!requiredSkills || !Array.isArray(requiredSkills) || requiredSkills.length === 0) {
            return NextResponse.json(
                { error: 'Required skills array is missing or empty' },
                { status: 400 }
            )
        }

        const analysis = await analyzeGap(resumeText, requiredSkills)

        return NextResponse.json(
            {
                success: true,
                analysis,
                limit,
                remaining,
                reset
            },
            {
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString(),
                }
            }
        )
    } catch (error) {
        console.error('Resume analysis error:', error)
        return NextResponse.json(
            { error: 'Failed to analyze resume. Please try again.' },
            { status: 500 }
        )
    }
}
