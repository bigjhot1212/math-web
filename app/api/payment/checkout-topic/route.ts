import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

const TOPIC_NAMES: Record<string, string> = {
  'set': 'เซต',
  'logic': 'ตรรกศาสตร์',
  'real-numbers': 'จำนวนจริง',
  'relations-functions': 'ความสัมพันธ์และฟังก์ชัน',
  'exponential-logarithm': 'เอกซ์โพเนนเชียลและลอการิทึม',
  'analytic-geometry-conics': 'เรขาคณิตวิเคราะห์และภาคตัดกรวย',
  'trigonometry': 'ตรีโกณมิติ',
  'matrix': 'เมทริกซ์',
  'vector': 'เวกเตอร์',
  'complex-numbers': 'จำนวนเชิงซ้อน',
  'counting-probability': 'หลักการนับและความน่าจะเป็น',
  'sequences-series': 'ลำดับและอนุกรม',
  'calculus': 'แคลคูลัสเบื้องต้น',
  'statistics-distributions': 'สถิติและตัวแปรสุ่ม',
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })

  const { topicId } = await request.json()
  const topicName = TOPIC_NAMES[topicId]
  if (!topicName) return NextResponse.json({ error: 'Invalid topic' }, { status: 400 })

  // Check already purchased
  const { data: existing } = await supabase
    .from('topic_purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('topic_id', topicId)
    .single()
  if (existing) return NextResponse.json({ error: 'ซื้อบทนี้ไปแล้ว' }, { status: 400 })

  // Check if user has any previous purchases (promo price)
  const { count } = await supabase
    .from('topic_purchases')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
  const hasExistingPurchase = (count ?? 0) > 0
  const price = hasExistingPurchase ? 34000 : 39000

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
        unit_amount: price,
        product_data: { name: `MathPrep — ${topicName}${hasExistingPurchase ? ' (ราคาพิเศษ)' : ''}` },
      },
      quantity: 1,
    }],
    metadata: {
      supabase_user_id: user.id,
      topic_id: topicId,
      type: 'topic_purchase',
    },
    success_url: `${origin}/pricing/success?topic=${topicId}`,
    cancel_url: `${origin}/pricing`,
  })

  return NextResponse.json({ url: session.url })
}
