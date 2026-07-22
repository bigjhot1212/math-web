import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { BUNDLES } from '@/content/course-videos'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })

  const { bundleId } = await request.json()
  const bundle = BUNDLES[bundleId]
  if (!bundle) return NextResponse.json({ error: 'Invalid bundle' }, { status: 400 })

  // Bundle only valid if the user doesn't already own any of the topics
  const { data: existing } = await supabase
    .from('topic_purchases')
    .select('topic_id')
    .eq('user_id', user.id)
    .in('topic_id', bundle.topicIds)
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'คุณซื้อบางบทในชุดนี้ไปแล้ว กรุณาซื้อทีละบทแทน' }, { status: 400 })
  }

  // Reuse or create Stripe customer
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  let customerId = sub?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { supabase_user_id: user.id } })
    customerId = customer.id
  }

  const origin = request.headers.get('origin') ?? 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'thb',
        unit_amount: bundle.price * 100,
        product_data: { name: `MathPrep — ${bundle.name}` },
      },
      quantity: 1,
    }],
    metadata: {
      supabase_user_id: user.id,
      bundle_id: bundleId,
      topic_ids: bundle.topicIds.join(','),
      type: 'bundle_purchase',
    },
    success_url: `${origin}/pricing/success?bundle=${bundleId}`,
    cancel_url: `${origin}/pricing`,
  })

  return NextResponse.json({ url: session.url })
}
