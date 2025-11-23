// Stripe Connect Configuration for FinalRound
// Handles escrow payments with 15% platform fee

import Stripe from 'stripe'

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  platformFeePercent: 0.15, // 15% platform fee
  currency: 'usd',
}

// Initialize Stripe
export const stripe = new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Payment statuses
export enum PaymentStatus {
  PENDING = 'pending',
  HELD = 'held', // In escrow
  RELEASED = 'released', // Paid to expert
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

// Calculate payment breakdown
export function calculatePaymentBreakdown(sessionPrice: number) {
  const platformFee = sessionPrice * STRIPE_CONFIG.platformFeePercent
  const expertEarnings = sessionPrice - platformFee
  const stripeProcessingFee = sessionPrice * 0.029 + 0.30 // Stripe's 2.9% + $0.30
  
  return {
    totalCharged: sessionPrice,
    platformFee,
    expertEarnings,
    stripeProcessingFee,
    netToExpert: expertEarnings - stripeProcessingFee,
  }
}

// Create Stripe Connect account for expert
export async function createConnectAccount(expertData: {
  email: string
  firstName: string
  lastName: string
  country: string
}) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: expertData.country || 'US',
    email: expertData.email,
    business_type: 'individual',
    individual: {
      first_name: expertData.firstName,
      last_name: expertData.lastName,
      email: expertData.email,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  return account
}

// Create onboarding link for expert
export async function createOnboardingLink(accountId: string, returnUrl: string, refreshUrl: string) {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  })

  return accountLink
}

// Check if expert's Stripe account is ready
export async function isAccountReady(accountId: string): Promise<boolean> {
  const account = await stripe.accounts.retrieve(accountId)
  return account.charges_enabled && account.payouts_enabled
}

// Create payment intent with escrow (hold funds)
export async function createEscrowPayment(params: {
  amount: number // in cents
  expertStripeAccountId: string
  candidateEmail: string
  sessionId: string
  description: string
}) {
  const { amount, expertStripeAccountId, candidateEmail, sessionId, description } = params
  
  const paymentBreakdown = calculatePaymentBreakdown(amount / 100)
  
  // Create payment intent with on_behalf_of for Connect
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: STRIPE_CONFIG.currency,
    receipt_email: candidateEmail,
    description,
    metadata: {
      session_id: sessionId,
      type: 'session_payment',
    },
    // DON'T transfer yet - hold in escrow
    on_behalf_of: expertStripeAccountId,
    transfer_data: undefined, // We'll transfer manually after session
  })

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    breakdown: paymentBreakdown,
  }
}

// Release payment from escrow to expert
export async function releaseEscrowPayment(params: {
  paymentIntentId: string
  expertStripeAccountId: string
  amount: number // expert's portion in cents
}) {
  const { paymentIntentId, expertStripeAccountId, amount } = params

  // Create transfer to expert's connected account
  const transfer = await stripe.transfers.create({
    amount,
    currency: STRIPE_CONFIG.currency,
    destination: expertStripeAccountId,
    source_transaction: paymentIntentId,
    metadata: {
      payment_intent_id: paymentIntentId,
    },
  })

  return transfer
}

// Refund payment (if session didn't happen or was unsatisfactory)
export async function refundPayment(paymentIntentId: string, reason?: string) {
  const refund = await stripe.refunds.create({
    payment_intent: paymentIntentId,
    reason: reason === 'fraud' ? 'fraudulent' : 'requested_by_customer',
  })

  return refund
}

// Create payout to expert's bank account
export async function createPayout(params: {
  expertStripeAccountId: string
  amount: number // in cents
}) {
  const { expertStripeAccountId, amount } = params

  const payout = await stripe.payouts.create(
    {
      amount,
      currency: STRIPE_CONFIG.currency,
    },
    {
      stripeAccount: expertStripeAccountId,
    }
  )

  return payout
}

// Get expert's balance
export async function getExpertBalance(expertStripeAccountId: string) {
  const balance = await stripe.balance.retrieve({
    stripeAccount: expertStripeAccountId,
  })

  return {
    available: balance.available[0]?.amount || 0,
    pending: balance.pending[0]?.amount || 0,
  }
}

// Webhook signature verification
export function constructWebhookEvent(body: string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    STRIPE_CONFIG.webhookSecret
  )
}
