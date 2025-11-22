import { NextRequest, NextResponse } from 'next/server'
import { parseJobDescription } from '@/lib/openai'
import { createClient } from '@/lib/supabase/server'
import { aiLimiter, getClientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

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

        const { jdText } = await request.json()

        if (!jdText || typeof jdText !== 'string') {
            return NextResponse.json(
                { error: 'Job description text is required' },
                { status: 400 }
            )
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            )
        }

        const parsed = await parseJobDescription(jdText)

        const response = NextResponse.json({ success: true, data: parsed })

        // Add rate limit headers
        response.headers.set('X-RateLimit-Limit', limit.toString())
        response.headers.set('X-RateLimit-Remaining', remaining.toString())
        response.headers.set('X-RateLimit-Reset', reset.toString())

        return response
    } catch (error) {
        console.error('Parse JD error:', error)
        return NextResponse.json(
            { error: 'Failed to parse job description' },
            { status: 500 }
        )
    }
}
