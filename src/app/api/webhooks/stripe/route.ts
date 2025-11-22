import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/integrations'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createClient()

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object
            // Update booking status to confirmed
            await supabase
                .from('bookings')
                .update({ status: 'confirmed' })
                .eq('stripe_payment_intent_id', paymentIntent.id)
            break

        case 'payment_intent.payment_failed':
            const failedIntent = event.data.object
            await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('stripe_payment_intent_id', failedIntent.id)
            break

        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
