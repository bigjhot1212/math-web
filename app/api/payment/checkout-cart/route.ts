import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { COURSES } from '@/content/course-videos'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })

  const { topicIds } = await request.json()
  if (!Array.isArray(topicIds) || topicIds.length === 0) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('topic_purchases')
    .select('topic_id')
    .eq('user_id', user.id)
    .in('topic_id', topicIds)
  const ownedIds = new Set(existing?.map((r) => r.topic_id) ?? [])

  const validIds: string[] = topicIds.filter(
    (tid: string) => COURSES[tid]?.status === 'available' && !ownedIds.has(tid)
  )
  if (validIds.length === 0) {
    return NextResponse.json({ error: 'ไม่มีคอร์สที่สามารถซื้อได้ในตะกร้า' }, { status: 400 })
  }

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
    payment_method_types: ['card', 'promptpay'],
    line_items: validIds.map((tid) => ({
      price_data: {
        currency: 'thb',
        unit_amount: (COURSES[tid].price ?? 390) * 100,
        product_data: { name: `MathPrep — ${COURSES[tid].name}` },
      },
      quantity: 1,
    })),
    metadata: {
      supabase_user_id: user.id,
      topic_ids: validIds.join(','),
      type: 'cart_purchase',
    },
    success_url: `${origin}/pricing/success?cart=1`,
    cancel_url: `${origin}/cart`,
  })

  return NextResponse.json({ url: session.url })
}
