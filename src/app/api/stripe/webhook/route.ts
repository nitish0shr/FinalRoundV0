import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe-payments'
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
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  try {
    const event = constructWebhookEvent(body, signature)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object)
        break

      case 'transfer.created':
        await handleTransferCreated(event.data.object)
        break

      case 'account.updated':
        await handleAccountUpdated(event.data.object)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    )
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  const supabase = getSupabaseClient()

  // Update payment status to held (in escrow)
  await supabase
    .from('payments')
    .update({ status: 'held' })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  // Also update booking status to confirmed
  await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}

async function handlePaymentFailure(paymentIntent: any) {
  const supabase = getSupabaseClient()

  // Update payment status to failed
  await supabase
    .from('payments')
    .update({ status: 'failed' })
    .eq('stripe_payment_intent_id', paymentIntent.id)

  // Also update booking status to cancelled
  await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('stripe_payment_intent_id', paymentIntent.id)
}

async function handleTransferCreated(transfer: any) {
  const supabase = getSupabaseClient()
  await supabase
    .from('payments')
    .update({ status: 'released' })
    .eq('stripe_payment_intent_id', transfer.source_transaction)
}

async function handleAccountUpdated(account: any) {
  const supabase = getSupabaseClient()
  await supabase
    .from('experts')
    .update({
      stripe_charges_enabled: account.charges_enabled,
      stripe_payouts_enabled: account.payouts_enabled,
    })
    .eq('stripe_account_id', account.id)
}
