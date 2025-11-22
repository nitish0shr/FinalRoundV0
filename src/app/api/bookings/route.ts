import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/integrations'
import { getClientIp, apiLimiter } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const ip = getClientIp(request)
    const identifier = user.email || ip
    const { success } = apiLimiter.check(10, identifier)
    if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    try {
        const body = await request.json()
        const { expertId, scheduledAt, durationHours, jobId } = body

        // Get expert profile to determine rate
        const { data: expertProfile, error: expertError } = await supabase
            .from('expert_profiles')
            .select('hourly_rate, user_id')
            .eq('user_id', expertId)
            .single()

        if (expertError || !expertProfile) {
            return NextResponse.json({ error: 'Expert not found' }, { status: 404 })
        }

        // Calculate total price in cents
        const totalPriceCents = expertProfile.hourly_rate * durationHours
        const expertShareCents = Math.floor(totalPriceCents * 0.70) // 70% to expert
        const platformFeeCents = totalPriceCents - expertShareCents // 30% platform fee

        // Create Stripe PaymentIntent with application_fee_amount for Connect
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPriceCents,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: {
                candidateId: user.id,
                expertId: expertProfile.user_id,
                durationHours: durationHours.toString(),
                jobId: jobId || '',
            },
            // In production, set up Connect and transfer_data
            // transfer_data: {
            //     destination: expertStripeAccountId,
            // },
            // application_fee_amount: platformFeeCents,
        })

        // Create booking record in database
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                candidate_id: user.id,
                expert_id: expertId,
                job_id: jobId,
                scheduled_at: scheduledAt,
                duration_hours: durationHours,
                price: totalPriceCents,
                status: 'pending',
                stripe_payment_intent_id: paymentIntent.id,
            })
            .select()
            .single()

        if (bookingError) {
            throw new Error('Failed to create booking')
        }

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            bookingId: booking.id,
        })
    } catch (error: any) {
        console.error('Booking creation error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
