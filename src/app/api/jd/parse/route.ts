import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length < 100) {
      return NextResponse.json(
        { error: 'Job description too short' },
        { status: 400 }
      )
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing job descriptions. Extract structured information and return ONLY valid JSON with this exact structure:
{
  "company": "string",
  "role": "string",
  "level": "entry|mid|senior|staff|principal",
  "required_skills": ["skill1", "skill2"],
  "preferred_skills": ["skill1", "skill2"],
  "interview_process": ["stage1", "stage2"],
  "key_responsibilities": ["resp1", "resp2"]
}`
        },
        {
          role: 'user',
          content: `Analyze this job description and extract structured information:\n\n${text}`
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const parsed = JSON.parse(completion.choices[0].message.content || '{}')
    parsed.raw_text = text

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('JD parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse job description' },
      { status: 500 }
    )
  }
}
