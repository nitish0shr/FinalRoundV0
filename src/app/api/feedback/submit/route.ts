import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { releaseEscrowPayment } from '@/lib/stripe-payments'

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
    const { sessionId, rating, review, got_offer, offer_company, strengths, weaknesses, resources } = body

    // Get session and payment info
    const supabase = getSupabaseClient()
    const { data: sessionData } = await supabase
      .from('sessions')
      .select('*, booking:bookings(*, payment:payments(*), expert:experts(*))')
      .eq('id', sessionId)
      .single()

    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const session = sessionData as any

    // Insert or update feedback
    const feedbackData: any = { session_id: sessionId }
    
    if (rating) feedbackData.candidate_rating = rating
    if (review) feedbackData.candidate_review = review
    if (got_offer !== undefined) feedbackData.got_offer = got_offer
    if (offer_company) feedbackData.offer_company = offer_company
    if (strengths) feedbackData.strengths = strengths
    if (weaknesses) feedbackData.weaknesses = weaknesses
    if (resources) feedbackData.resources = resources

    const { data: feedback } = await supabase
      .from('feedback')
      .upsert(feedbackData, { onConflict: 'session_id' })
      .select()
      .single()

    // If this is candidate feedback with rating, release payment to expert
    if (rating && session.booking?.payment) {
      const payment = session.booking.payment
      
      if (payment.status === 'held') {
        // Release funds to expert
        await releaseEscrowPayment({
          paymentIntentId: payment.stripe_payment_intent_id,
          expertStripeAccountId: session.booking.expert.stripe_account_id,
          amount: Math.round(payment.expert_earnings * 100),
        })

        // Update payment status
        await supabase
          .from('payments')
          .update({ status: 'released' })
          .eq('id', payment.id)

        // Create earnings record
        await supabase
          .from('earnings')
          .insert({
            expert_id: session.expert_id,
            payment_id: payment.id,
            amount: payment.expert_earnings,
            status: 'available',
          })
      }
    }

    // Update expert success rate
    if (got_offer === true) {
      await supabase.rpc('update_expert_success_rate', {
        p_expert_id: session.expert_id
      })
    }

    return NextResponse.json({ success: true, feedback })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}
