import { NextRequest, NextResponse } from 'next/server'
import { parseJobDescription } from '@/lib/openai'

export async function POST(request: NextRequest) {
    try {
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

        return NextResponse.json({ success: true, data: parsed })
    } catch (error) {
        console.error('Parse JD error:', error)
        return NextResponse.json(
            { error: 'Failed to parse job description' },
            { status: 500 }
        )
    }
}
