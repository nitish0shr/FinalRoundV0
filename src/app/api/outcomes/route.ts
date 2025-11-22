import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getClientIp, apiLimiter } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const ip = getClientIp(request)
    const { success } = apiLimiter.check(3, user.email || ip)
    if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    try {
        const { jobId, gotOffer, offerDetails } = await request.json()

        //Insert outcome record
        const { data: outcome, error } = await supabase
            .from('outcomes')
            .insert({
                user_id: user.id,
                job_id: jobId,
                got_offer: gotOffer,
                offer_details: offerDetails,
            })
            .select()
            .single()

        if (error) {
            throw new Error('Failed to record outcome')
        }

        return NextResponse.json({ data: outcome })
    } catch (error: any) {
        console.error('Outcome recording error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    const supabase = await createClient()

    try {
        // Get public count of successful outcomes
        const { count, error } = await supabase
            .from('outcomes')
            .select('*', { count: 'exact', head: true })
            .eq('got_offer', true)

        if (error) {
            throw error
        }

        return NextResponse.json({ count: count || 0 })
    } catch (error: any) {
        console.error('Outcome count error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
