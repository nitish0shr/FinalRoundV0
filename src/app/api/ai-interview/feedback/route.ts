import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Lazy initialization to avoid errors during build
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

export async function POST(request: NextRequest) {
  try {
    const { transcript, jobRole, difficulty } = await request.json()

    const openai = getOpenAIClient()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert interview coach. Analyze this ${jobRole} interview and provide detailed feedback. Return ONLY valid JSON:
{
  "overall_score": 85,
  "strengths": ["strength1", "strength2"],
  "areas_for_improvement": ["area1", "area2"],
  "technical_assessment": "detailed feedback",
  "communication_assessment": "detailed feedback",
  "recommendations": ["rec1", "rec2"],
  "next_steps": ["step1", "step2"]
}`
        },
        {
          role: 'user',
          content: `Analyze this interview transcript:\n\n${JSON.stringify(transcript, null, 2)}`
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const feedback = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json(feedback)

  } catch (error) {
    console.error('Feedback generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    )
  }
}
