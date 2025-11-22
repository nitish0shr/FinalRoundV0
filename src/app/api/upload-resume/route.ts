import { NextRequest, NextResponse } from 'next/server'
import { analyzeGap } from '@/lib/openai'

export async function POST(request: NextRequest) {
    try {
        const { resumeText, requiredSkills } = await request.json()

        if (!resumeText || typeof resumeText !== 'string') {
            return NextResponse.json(
                { error: 'Resume text is required' },
                { status: 400 }
            )
        }

        if (!requiredSkills || !Array.isArray(requiredSkills)) {
            return NextResponse.json(
                { error: 'Required skills are required' },
                { status: 400 }
            )
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key not configured' },
                { status: 500 }
            )
        }

        // Perform gap analysis
        const gapAnalysis = await analyzeGap(resumeText, requiredSkills)

        return NextResponse.json({
            success: true,
            data: {
                resumeText,
                gapAnalysis,
            },
        })
    } catch (error) {
        console.error('Upload resume error:', error)
        return NextResponse.json(
            { error: 'Failed to process resume' },
            { status: 500 }
        )
    }
}
