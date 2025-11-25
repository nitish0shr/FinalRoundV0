import { NextRequest, NextResponse } from 'next/server'
import { createEscrowPayment } from '@/lib/stripe-payments'
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, amount, candidateEmail } = body

    // Get booking details
    const supabase = getSupabaseClient()
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, expert:experts(*)')
      .eq('id', bookingId)
      .single()

    if (!booking || !booking.expert.stripe_account_id) {
      return NextResponse.json(
        { error: 'Invalid booking or expert not connected to Stripe' },
        { status: 400 }
      )
    }

    // Create escrow payment
    const payment = await createEscrowPayment({
      amount: amount * 100, // Convert to cents
      expertStripeAccountId: booking.expert.stripe_account_id,
      candidateEmail,
      sessionId: booking.id,
      description: `FinalRound Session with ${booking.expert.name}`,
    })

    // Save payment record
    await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        amount,
        platform_fee: payment.breakdown.platformFee,
        expert_earnings: payment.breakdown.expertEarnings,
        stripe_payment_intent_id: payment.paymentIntentId,
        status: 'held', // In escrow
      })

    return NextResponse.json({
      clientSecret: payment.clientSecret,
      breakdown: payment.breakdown,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
