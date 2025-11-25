import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
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
    // Authentication check
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const supabase = getSupabaseClient()

    // Fetch user's jobs count
    const { count: totalJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Fetch upcoming sessions
    const { count: upcomingSessions } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('candidate_id', userId)
      .eq('status', 'confirmed')
      .gte('scheduled_at', new Date().toISOString())

    // Fetch skill gaps (from gap_analyses table if exists)
    const { data: gapData } = await supabase
      .from('gap_analyses')
      .select('skill_gaps')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const skillGapsIdentified = gapData?.skill_gaps?.length || 0

    // Calculate success rate from feedback
    const { data: feedbackData } = await supabase
      .from('feedback')
      .select('got_offer')
      .eq('candidate_id', userId)

    let successRate = 0
    if (feedbackData && feedbackData.length > 0) {
      const offers = feedbackData.filter(f => f.got_offer === true).length
      successRate = Math.round((offers / feedbackData.length) * 100)
    }

    return NextResponse.json({
      stats: {
        totalJobs: totalJobs || 0,
        upcomingSessions: upcomingSessions || 0,
        skillGapsIdentified,
        successRate
      }
    })

  } catch (error) {
    console.error('User stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
