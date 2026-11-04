import { NextRequest, NextResponse } from 'next/server'
import { COURSES, BUNDLES } from '@/content/course-videos'
import { getAppUrl } from '@/lib/app-url'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

type CheckoutType = 'topic' | 'bundle' | 'cart'

type CheckoutItem = {
  id: string
  name: string
  price: number
}

function checkoutUrl(type: CheckoutType, id: string) {
  return `/checkout?type=${type}&${type === 'cart' ? `ids=${encodeURIComponent(id)}` : `id=${encodeURIComponent(id)}`}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนชำระเงิน' }, { status: 401 })
    }

    const body = await request.json().catch(() => null) as { type?: CheckoutType; id?: string } | null
    const type = body?.type
    const id = body?.id?.trim()
    if (!id || (type !== 'topic' && type !== 'bundle' && type !== 'cart')) {
      return NextResponse.json({ error: 'ข้อมูลคำสั่งซื้อไม่ถูกต้อง กรุณากลับไปเลือกคอร์สใหม่' }, { status: 400 })
    }

    let items: CheckoutItem[] = []
    let bundleId = ''

    if (type === 'topic') {
      const course = COURSES[id]
      if (!course || course.status !== 'available') {
        return NextResponse.json({ error: 'คอร์สนี้ยังไม่เปิดขาย' }, { status: 400 })
      }
      items = [{ id, name: course.name, price: course.price ?? 390 }]
    } else if (type === 'bundle') {
      const bundle = BUNDLES[id]
      if (!bundle) {
        return NextResponse.json({ error: 'ไม่พบชุดคอร์สนี้' }, { status: 400 })
      }
      bundleId = id
      items = bundle.topicIds.map((topicId) => ({
        id: topicId,
        name: COURSES[topicId]?.name ?? topicId,
        price: 0,
      }))
    } else {
      const requestedIds = [...new Set(id.split(',').map((value) => value.trim()).filter(Boolean))]
      if (requestedIds.length === 0 || requestedIds.length > 20) {
        return NextResponse.json({ error: 'ตะกร้าไม่ถูกต้อง กรุณากลับไปเลือกคอร์สใหม่' }, { status: 400 })
      }
      items = requestedIds.flatMap((topicId) => {
        const course = COURSES[topicId]
        return course?.status === 'available'
          ? [{ id: topicId, name: course.name, price: course.price ?? 390 }]
          : []
      })
    }

    const topicIds = items.map((item) => item.id)
    if (topicIds.length === 0) {
      return NextResponse.json({ error: 'ไม่มีคอร์สที่สามารถชำระเงินได้' }, { status: 400 })
    }

    const { data: ownedRows } = await supabase
      .from('topic_purchases')
      .select('topic_id')
      .eq('user_id', user.id)
      .in('topic_id', topicIds)
    const ownedIds = new Set(ownedRows?.map((row) => row.topic_id) ?? [])

    if (type === 'bundle' && ownedIds.size > 0) {
      return NextResponse.json({ error: 'คุณมีบางบทในชุดนี้แล้ว กรุณาซื้อเฉพาะบทที่ยังไม่มี' }, { status: 409 })
    }

    items = items.filter((item) => !ownedIds.has(item.id))
    if (items.length === 0) {
      return NextResponse.json({ error: 'คุณมีคอร์สเหล่านี้แล้ว' }, { status: 409 })
    }

    const stripe = getStripe()
    const origin = getAppUrl()
    const lineItems = type === 'bundle'
      ? [{
          price_data: {
            currency: 'thb',
            unit_amount: BUNDLES[bundleId].price * 100,
            product_data: { name: `Math Hunters — ${BUNDLES[bundleId].name}` },
          },
          quantity: 1,
        }]
      : items.map((item) => ({
          price_data: {
            currency: 'thb',
            unit_amount: item.price * 100,
            product_data: { name: `Math Hunters — ${item.name}` },
          },
          quantity: 1,
        }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      client_reference_id: user.id,
      payment_method_types: ['card', 'promptpay'],
      line_items: lineItems,
      locale: 'th',
      metadata: {
        type,
        supabase_user_id: user.id,
        topic_ids: items.map((item) => item.id).join(','),
        bundle_id: bundleId,
      },
      payment_intent_data: {
        metadata: {
          supabase_user_id: user.id,
          purchase_type: type,
        },
      },
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${checkoutUrl(type, id)}`,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe ไม่ได้ส่งลิงก์ชำระเงินกลับมา กรุณาลองอีกครั้ง' }, { status: 502 })
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe Checkout session creation failed:', error)
    return NextResponse.json(
      { error: 'ยังเปิดหน้าชำระเงินไม่ได้ กรุณาลองอีกครั้งหรือลองโอนธนาคารแทน' },
      { status: 500 },
    )
  }
}
