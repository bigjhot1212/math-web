import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { COURSES } from '@/content/course-videos'
import { getAppUrl } from '@/lib/app-url'

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
  'foundation-high-school': 'ปรับพื้นฐานสำหรับเรียนม.ปลาย',
  'a-level-math-1-intensive': 'ตะลุยโจทย์ A-Level Math 1',
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()
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

  const fixedPrice = COURSES[topicId]?.price
  const price = fixedPrice ? fixedPrice * 100 : 39000

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

  const origin = getAppUrl()
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'payment',
    payment_method_types: ['card', 'promptpay'],
    line_items: [{
      price_data: {
        currency: 'thb',
        unit_amount: price,
        product_data: { name: `MathPrep — ${topicName}` },
      },
      quantity: 1,
    }],
    metadata: {
      supabase_user_id: user.id,
      topic_id: topicId,
      type: 'topic_purchase',
      price_thb: String(price / 100),
    },
    success_url: `${origin}/pricing/success?topic=${topicId}`,
    cancel_url: `${origin}/pricing`,
  })

  return NextResponse.json({ url: session.url })
}
