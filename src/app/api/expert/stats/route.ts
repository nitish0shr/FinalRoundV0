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

    // Get expert record
    const { data: expert } = await supabase
      .from('experts')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!expert) {
      return NextResponse.json({ error: 'Expert profile not found' }, { status: 404 })
    }

    const expertId = expert.id

    // Fetch total earnings
    const { data: earningsData } = await supabase
      .from('earnings')
      .select('amount, status')
      .eq('expert_id', expertId)

    const totalEarnings = earningsData?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0
    const pendingPayouts = earningsData?.filter(e => e.status === 'pending')
      .reduce((sum, e) => sum + (e.amount || 0), 0) || 0

    // Calculate this week's earnings
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const { data: weekEarnings } = await supabase
      .from('earnings')
      .select('amount')
      .eq('expert_id', expertId)
      .gte('created_at', weekAgo.toISOString())

    const thisWeekEarnings = weekEarnings?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0

    // Get total sessions
    const { count: totalSessions } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('expert_id', expertId)
      .eq('status', 'completed')

    // Get average session rate from completed payments
    const { data: payments } = await supabase
      .from('payments')
      .select('expert_earnings')
      .eq('status', 'released')

    const averageSessionRate = payments && payments.length > 0
      ? Math.round(payments.reduce((sum, p) => sum + (p.expert_earnings || 0), 0) / payments.length)
      : 0

    // Calculate next payout date (next Monday)
    const today = new Date()
    const nextMonday = new Date(today)
    nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7))
    const nextPayoutDate = nextMonday.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })

    // Get upcoming sessions
    const { data: upcomingSessions } = await supabase
      .from('sessions')
      .select(`
        id,
        scheduled_at,
        booking:bookings(
          session_type,
          candidate:users(name)
        )
      `)
      .eq('expert_id', expertId)
      .eq('status', 'scheduled')
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(5)

    return NextResponse.json({
      stats: {
        totalEarnings,
        pendingPayouts,
        thisWeekEarnings,
        averageSessionRate,
        totalSessions: totalSessions || 0,
        nextPayoutDate
      },
      upcomingSessions: upcomingSessions || []
    })

  } catch (error) {
    console.error('Expert stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
