// AI Resume Analysis System
import OpenAI from 'openai'
import { ParsedResume, ParsedJobDescription, GapAnalysis } from '@/types'

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

// Parse resume from text
export async function parseResume(text: string): Promise<ParsedResume> {
  const openai = getOpenAIClient()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an expert resume parser. Extract structured information and return ONLY valid JSON:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "year": "string"
    }
  ],
  "summary": "brief professional summary"
}`
      },
      {
        role: 'user',
        content: `Parse this resume:\n\n${text}`
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  const parsed = JSON.parse(completion.choices[0].message.content || '{}')
  return {
    ...parsed,
    raw_text: text
  }
}

// Analyze gap between resume and job description
export async function analyzeGap(
  resume: ParsedResume,
  jd: ParsedJobDescription
): Promise<GapAnalysis> {
  const openai = getOpenAIClient()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an expert career coach. Analyze the gap between a candidate's resume and a job description. Return ONLY valid JSON:
{
  "overall_match_score": 85,
  "missing_skills": ["skill1", "skill2"],
  "matching_skills": ["skill1", "skill2"],
  "experience_gap": "detailed analysis",
  "recommendations": ["rec1", "rec2"],
  "interview_focus_areas": ["area1", "area2"]
}`
      },
      {
        role: 'user',
        content: `Analyze this candidate for this role:

RESUME:
Name: ${resume.name}
Skills: ${resume.skills.join(', ')}
Experience: ${resume.experience.map(e => `${e.role} at ${e.company} (${e.duration})`).join('; ')}

JOB DESCRIPTION:
Company: ${jd.company}
Role: ${jd.role}
Level: ${jd.level}
Required Skills: ${jd.required_skills.join(', ')}
Preferred Skills: ${jd.preferred_skills.join(', ')}

Provide detailed gap analysis.`
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  return JSON.parse(completion.choices[0].message.content || '{}')
}

// Generate interview prep roadmap
export async function generateRoadmap(
  gapAnalysis: GapAnalysis,
  jd: ParsedJobDescription
): Promise<{
  week1: string[]
  week2: string[]
  week3: string[]
  week4: string[]
  resources: Array<{ title: string; url: string; type: string }>
}> {
  const openai = getOpenAIClient()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an expert interview coach. Create a 4-week prep roadmap. Return ONLY valid JSON:
{
  "week1": ["task1", "task2"],
  "week2": ["task1", "task2"],
  "week3": ["task1", "task2"],
  "week4": ["task1", "task2"],
  "resources": [
    {"title": "Resource Name", "url": "https://...", "type": "video|article|course"}
  ]
}`
      },
      {
        role: 'user',
        content: `Create a 4-week interview prep plan for ${jd.role} at ${jd.company}.

Missing Skills: ${gapAnalysis.missing_skills.join(', ')}
Focus Areas: ${gapAnalysis.interview_focus_areas.join(', ')}

Include specific resources (LeetCode, System Design courses, etc.)`
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  })

  return JSON.parse(completion.choices[0].message.content || '{}')
}

// Extract text from PDF buffer
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Use pdf-parse library
  const pdfParse = require('pdf-parse')
  const data = await pdfParse(buffer)
  return data.text
}

// Extract text from DOCX buffer
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  // Use mammoth library
  const mammoth = require('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}
