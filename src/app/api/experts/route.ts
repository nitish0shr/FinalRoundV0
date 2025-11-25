import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid errors during build
let supabaseClient: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase not configured')
    }
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
  return supabaseClient
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')

    const supabase = getSupabaseClient()

    // If fetching a single expert by ID
    if (id) {
      const { data: expert, error } = await supabase
        .from('experts')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !expert) {
        return NextResponse.json({ error: 'Expert not found' }, { status: 404 })
      }

      return NextResponse.json({ expert })
    }

    // Fetch all experts with optional search
    let query = supabase
      .from('experts')
      .select('*')
      .eq('verified', true)
      .order('success_rate', { ascending: false })
      .limit(limit)

    if (search) {
      query = query.or(`name.ilike.%${search}%,company.ilike.%${search}%,expertise.cs.{${search}}`)
    }

    const { data: experts, error } = await query

    if (error) {
      console.error('Error fetching experts:', error)
      return NextResponse.json({ error: 'Failed to fetch experts' }, { status: 500 })
    }

    // Transform to match ExpertData interface
    const transformedExperts = (experts || []).map(expert => ({
      id: expert.id,
      name: expert.name,
      role: expert.role || 'Software Engineer',
      company: expert.company,
      yearsExperience: expert.years_experience || 5,
      hourlyRate: expert.hourly_rate,
      successRate: expert.success_rate || 90,
      totalSessions: expert.total_sessions || 0,
      avatar: expert.avatar || expert.name.split(' ').map((n: string) => n[0]).join(''),
      expertise: expert.expertise || [],
      verified: expert.verified,
      isElite: expert.is_elite || false,
      calendlyLink: expert.calendly_link,
    }))

    return NextResponse.json({ experts: transformedExperts })

  } catch (error) {
    console.error('Experts API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experts' },
      { status: 500 }
    )
  }
}
