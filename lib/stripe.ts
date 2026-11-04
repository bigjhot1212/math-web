import 'server-only'

import Stripe from 'stripe'

let stripe: Stripe | null = null

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required to use Stripe Checkout.')
  }

  stripe ??= new Stripe(secretKey, {
    maxNetworkRetries: 2,
    timeout: 10_000,
  })

  return stripe
}
