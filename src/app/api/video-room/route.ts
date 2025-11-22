import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { daily } from '@/lib/integrations'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { bookingId } = await request.json()

        // Get booking details
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single()

        if (bookingError || !booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Verify user is part of this booking
        if (booking.candidate_id !== user.id && booking.expert_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Check if room already exists
        if (booking.video_room_url) {
            return NextResponse.json({ roomUrl: booking.video_room_url })
        }

        // Create Daily.co room
        const room = await daily.createRoom({
            privacy: 'private',
            properties: {
                enable_chat: true,
                enable_recording: 'cloud',
                enable_transcription: true,
                exp: Math.floor(Date.now() / 1000) + (booking.duration_hours * 60 * 60) + 600, // Expire 10 mins after session
            },
        })

        // Update booking with room URL
        await supabase
            .from('bookings')
            .update({ video_room_url: room.url })
            .eq('id', bookingId)

        return NextResponse.json({ roomUrl: room.url })
    } catch (error: any) {
        console.error('Video room creation error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
