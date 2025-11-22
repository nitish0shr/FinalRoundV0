import OpenAI from 'openai'
import { ParsedJD, GapAnalysis } from '@/types/job'

// Initialize OpenAI client with error handling
function createOpenAIClient() {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey || apiKey === 'sk-proj-placeholder-replace-with-your-actual-key') {
        throw new Error(
            'OpenAI API key not configured. Please set OPENAI_API_KEY in your .env.local file. ' +
            'Get your key at: https://platform.openai.com/api-keys'
        )
    }

    return new OpenAI({ apiKey })
}

let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        openaiClient = createOpenAIClient()
    }
    return openaiClient
}

export async function parseJobDescription(jdText: string): Promise<ParsedJD> {
    const openai = getOpenAIClient()

    const prompt = `You are an expert job description parser. Parse the following job description and extract key information in JSON format.

Job Description:
${jdText}

Extract and return ONLY a valid JSON object with this exact structure:
{
  "company": "Company name",
  "role": "Job title",
  "level": "junior|mid|senior|staff|principal|unknown",
  "requiredSkills": ["skill1", "skill2", ...],
  "niceToHaveSkills": ["skill1", "skill2", ...]
}

Rules:
- requiredSkills should include must-have technical and soft skills
- niceToHaveSkills should include preferred/bonus skills
- If level is unclear, use "unknown"
- Return ONLY valid JSON, no markdown, no explanations`

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'You are a job description parser. Return only valid JSON.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
    })

    const parsed = JSON.parse(response.choices[0].message.content || '{}')

    return {
        company: parsed.company || 'Unknown',
        role: parsed.role || 'Unknown',
        level: parsed.level || 'unknown',
        requiredSkills: parsed.requiredSkills || [],
        niceToHaveSkills: parsed.niceToHaveSkills || [],
        rawText: jdText,
    }
}

export async function analyzeGap(
    resumeText: string,
    requiredSkills: string[]
): Promise<GapAnalysis> {
    const openai = getOpenAIClient()

    const prompt = `You are an expert resume analyzer. Compare the candidate's resume against required job skills and categorize each skill.

Resume:
${resumeText}

Required Skills:
${requiredSkills.join(', ')}

Categorize each required skill into one of three categories and return ONLY a valid JSON object:
{
  "covered": ["skills clearly demonstrated in resume"],
  "partial": ["skills somewhat or implicitly mentioned"],
  "missing": ["skills not mentioned or demonstrated"]
}

Rules:
- Be strict but fair in assessment
- Look for concrete evidence of skills
- Return ONLY valid JSON, no markdown, no explanations`

    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'You are a resume gap analyzer. Return only valid JSON.',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
    })

    const analysis = JSON.parse(response.choices[0].message.content || '{}')

    return {
        covered: analysis.covered || [],
        partial: analysis.partial || [],
        missing: analysis.missing || [],
    }
}
