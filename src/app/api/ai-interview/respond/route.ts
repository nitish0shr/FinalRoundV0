import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { conversation, jobRole, difficulty } = await request.json()

    const systemPrompt = `You are an expert ${jobRole} interviewer conducting a ${difficulty} difficulty interview.

Rules:
1. Ask one focused question at a time
2. Follow up on candidate's answers
3. Cover: technical skills, behavioral, system design
4. Be friendly but professional
5. If candidate struggles, give subtle hints
6. After 5-7 questions, wrap up naturally

Current stage: ${conversation.length} exchanges`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.map((m: any) => ({
        role: m.role === 'interviewer' ? 'assistant' : 'user',
        content: m.content
      }))
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500
    })

    const response = completion.choices[0].message.content

    return NextResponse.json({ response })

  } catch (error) {
    console.error('AI interview error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
