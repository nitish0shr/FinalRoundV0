// AI Expert Matching Engine
import OpenAI from 'openai'
import { ParsedJobDescription, Expert, ExpertMatch, GapAnalysis } from '@/types'
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Match experts to job description
export async function matchExperts(
  jd: ParsedJobDescription,
  gapAnalysis?: GapAnalysis
): Promise<ExpertMatch[]> {
  // Get all verified experts
  const { data: experts, error } = await supabase
    .from('experts')
    .select('*')
    .eq('verified', true)
    .gte('success_rate', 70) // Only experts with 70%+ success rate

  if (error || !experts) {
    throw new Error('Failed to fetch experts')
  }

  // Score each expert
  const scoredExperts = await Promise.all(
    experts.map(async (expert) => {
      const score = await calculateMatchScore(expert, jd, gapAnalysis)
      return score
    })
  )

  // Sort by match score (highest first)
  return scoredExperts
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 10) // Top 10 matches
}

// Calculate match score for a single expert
async function calculateMatchScore(
  expert: Expert,
  jd: ParsedJobDescription,
  gapAnalysis?: GapAnalysis
): Promise<ExpertMatch> {
  let matchScore = 0
  const matchingSkills: string[] = []
  const reasons: string[] = []

  // 1. Skills match (40 points max)
  const expertSkills = expert.expertise || []
  const requiredSkills = jd.required_skills || []
  
  for (const skill of requiredSkills) {
    if (expertSkills.some(es => es.toLowerCase().includes(skill.toLowerCase()))) {
      matchingSkills.push(skill)
      matchScore += 40 / requiredSkills.length
    }
  }

  // 2. Company match (20 points)
  const targetCompany = jd.company.toLowerCase()
  if (expert.company && expert.company.toLowerCase().includes(targetCompany)) {
    matchScore += 20
    reasons.push(`Worked at ${expert.company}`)
  }

  // 3. Level match (20 points)
  const levelMatch = matchExperienceLevel(expert.years_experience, jd.level)
  if (levelMatch) {
    matchScore += 20
    reasons.push(`${expert.years_experience} years experience matches ${jd.level} level`)
  }

  // 4. Success rate (10 points)
  matchScore += (expert.success_rate / 100) * 10

  // 5. Gap analysis bonus (10 points)
  if (gapAnalysis) {
    const coversGaps = gapAnalysis.missing_skills.filter(skill =>
      expertSkills.some(es => es.toLowerCase().includes(skill.toLowerCase()))
    )
    if (coversGaps.length > 0) {
      matchScore += (coversGaps.length / gapAnalysis.missing_skills.length) * 10
      reasons.push(`Can help with: ${coversGaps.join(', ')}`)
    }
  }

  return {
    expert,
    match_score: Math.round(matchScore),
    matching_skills: matchingSkills,
    years_experience_match: levelMatch,
    company_match: !!expert.company?.toLowerCase().includes(targetCompany),
    reasons
  }
}

// Match experience level to years
function matchExperienceLevel(years: number, level: string): boolean {
  const levelMap: Record<string, [number, number]> = {
    'entry': [0, 2],
    'mid': [2, 5],
    'senior': [5, 10],
    'staff': [8, 15],
    'principal': [12, 30]
  }

  const range = levelMap[level.toLowerCase()]
  if (!range) return false

  return years >= range[0] && years <= range[1]
}

// AI-powered smart matching with reasoning
export async function aiSmartMatch(
  jd: ParsedJobDescription,
  experts: Expert[]
): Promise<ExpertMatch[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `You are an expert recruiter. Rank experts for a job posting. For each expert, provide:
1. Match score (0-100)
2. Matching skills
3. Reasons why they're a good fit

Return ONLY valid JSON array:
[
  {
    "expert_id": "uuid",
    "match_score": 95,
    "matching_skills": ["skill1"],
    "reasons": ["reason1", "reason2"]
  }
]`
      },
      {
        role: 'user',
        content: `Match these experts to this job:

JOB:
${jd.company} - ${jd.role} (${jd.level})
Required: ${jd.required_skills.join(', ')}

EXPERTS:
${experts.map((e, i) => `${i+1}. ${e.id}: ${e.job_title} at ${e.company} (${e.years_experience}y) - Skills: ${e.expertise?.join(', ')}`).join('\n')}

Rank all experts by fit.`
      }
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' }
  })

  const aiResults = JSON.parse(completion.choices[0].message.content || '{"matches":[]}')
  const matches = aiResults.matches || []

  // Merge AI results with expert data
  return matches.map((m: any) => {
    const expert = experts.find(e => e.id === m.expert_id)
    return {
      expert: expert!,
      match_score: m.match_score,
      matching_skills: m.matching_skills,
      years_experience_match: true,
      company_match: expert?.company === jd.company,
      reasons: m.reasons
    }
  }).filter((m: any) => m.expert) // Only include valid matches
}

// Get recommended experts for a candidate
export async function getRecommendedExperts(params: {
  jobDescription: ParsedJobDescription
  gapAnalysis?: GapAnalysis
  limit?: number
}): Promise<ExpertMatch[]> {
  const { jobDescription, gapAnalysis, limit = 5 } = params

  // Get matches using both algorithms
  const basicMatches = await matchExperts(jobDescription, gapAnalysis)
  
  // Return top N
  return basicMatches.slice(0, limit)
}
