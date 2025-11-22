import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { ResumeStore } from '@/lib/data-store'
import type { GapAnalysis } from '@/types/job'

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { jobId, resumeText, gapAnalysis } = body

        if (!resumeText) {
            return NextResponse.json(
                { error: 'Resume text is required' },
                { status: 400 }
            )
        }

        const resume = ResumeStore.createResume({
            userId: session.user.email,
            jobId: jobId || undefined,
            resumeText,
            gapAnalysis: gapAnalysis || undefined
        })

        return NextResponse.json({
            success: true,
            data: resume
        })
    } catch (error) {
        console.error('Create resume error:', error)
        return NextResponse.json(
            { error: 'Failed to save resume' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const jobId = searchParams.get('jobId')

        const resumes = jobId
            ? ResumeStore.getResumesByJobId(jobId)
            : ResumeStore.getResumesByUserId(session.user.email)

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
