import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 })

  const sessionId = request.nextUrl.searchParams.get('session_id')
  if (!sessionId?.startsWith('cs_')) {
    return NextResponse.json({ error: 'ไม่พบรายการชำระเงิน' }, { status: 400 })
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId)
    if (session.metadata?.supabase_user_id !== user.id) {
      return NextResponse.json({ error: 'คุณไม่มีสิทธิ์ดูรายการนี้' }, { status: 403 })
    }

    const topicIds = session.metadata?.topic_ids?.split(',').filter(Boolean) ?? []
    const { data: purchaseRows } = topicIds.length > 0
      ? await supabase
          .from('topic_purchases')
          .select('topic_id')
          .eq('user_id', user.id)
          .in('topic_id', topicIds)
      : { data: [] }
    const grantedIds = new Set(purchaseRows?.map((row) => row.topic_id) ?? [])

    return NextResponse.json({
      paymentStatus: session.payment_status,
      accessReady: topicIds.length > 0 && topicIds.every((topicId) => grantedIds.has(topicId)),
      topicIds,
    })
  } catch (error) {
    console.error('Stripe status lookup failed:', error)
    return NextResponse.json({ error: 'ตรวจสอบสถานะไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 })
  }
}
