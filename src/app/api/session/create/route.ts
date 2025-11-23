import { NextRequest, NextResponse } from 'next/server'
import { getDailyAPI } from '@/lib/daily-video'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, expertId, candidateId } = body

    // Create Daily.co room
    const dailyAPI = getDailyAPI()
    const roomName = `finalround-${bookingId}-${Date.now()}`
    
    const room = await dailyAPI.createRoom(roomName, {
      exp: Math.floor(Date.now() / 1000) + (60 * 90),
      max_participants: 2,
      enable_recording: 'cloud',
    })

    // Create tokens
    const expertToken = await dailyAPI.createMeetingToken(room.name, {
      user_name: 'Expert',
      is_owner: true,
    })

    const candidateToken = await dailyAPI.createMeetingToken(room.name, {
      user_name: 'Candidate',
    })

    // Save to database
    const { data: session } = await supabase
      .from('sessions')
      .insert({
        booking_id: bookingId,
        expert_id: expertId,
        candidate_id: candidateId,
        room_name: room.name,
        room_url: room.url,
        status: 'scheduled',
      })
      .select()
      .single()

    return NextResponse.json({
      sessionId: session.id,
      roomUrl: room.url,
      expertToken: expertToken.token,
      candidateToken: candidateToken.token,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}
