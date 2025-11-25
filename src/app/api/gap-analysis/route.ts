import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { analyzeGap, generateRoadmap } from '@/lib/ai/resume-analyzer'
import { ParsedResume, ParsedJobDescription } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { resume, jobDescription } = body as {
      resume: ParsedResume
      jobDescription: ParsedJobDescription
    }

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: 'Resume and job description required' },
        { status: 400 }
      )
    }

    // Analyze gap
    const gapAnalysis = await analyzeGap(resume, jobDescription)

    // Generate prep roadmap
    const roadmap = await generateRoadmap(gapAnalysis, jobDescription)

    return NextResponse.json({
      success: true,
      data: {
        gapAnalysis,
        roadmap
      }
    })

  } catch (error) {
    console.error('Gap analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze gap' },
      { status: 500 }
    )
  }
}
