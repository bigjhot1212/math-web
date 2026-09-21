import Stripe from 'stripe'

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is required to use Stripe.')
  }

  return new Stripe(secretKey, {
    apiVersion: '2026-08-26.dahlia',
  })
}
