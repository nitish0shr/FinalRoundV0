import { NextRequest, NextResponse } from 'next/server'
import { getRecommendedExperts } from '@/lib/ai/expert-matcher'
import { ParsedJobDescription, GapAnalysis } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobDescription, gapAnalysis, limit } = body as {
      jobDescription: ParsedJobDescription
      gapAnalysis?: GapAnalysis
      limit?: number
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Job description required' },
        { status: 400 }
      )
    }

    // Get recommended experts
    const matches = await getRecommendedExperts({
      jobDescription,
      gapAnalysis,
      limit: limit || 5
    })

    return NextResponse.json({
      success: true,
      data: matches
    })

  } catch (error) {
    console.error('Expert matching error:', error)
    return NextResponse.json(
      { error: 'Failed to match experts' },
      { status: 500 }
    )
  }
}
