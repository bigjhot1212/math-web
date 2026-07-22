import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { COURSES, BUNDLES } from '@/content/course-videos'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })

  const form = await request.formData()
  const type = form.get('type')
  const id = form.get('id')
  const slip = form.get('slip')

  if ((type !== 'topic' && type !== 'bundle') || typeof id !== 'string' || !(slip instanceof File)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  let amountThb: number
  let topicId: string | null = null
  let bundleId: string | null = null

  if (type === 'topic') {
    const course = COURSES[id]
    if (!course || course.status !== 'available') return NextResponse.json({ error: 'Invalid topic' }, { status: 400 })

    const { data: existing } = await supabase
      .from('topic_purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('topic_id', id)
      .single()
    if (existing) return NextResponse.json({ error: 'ซื้อบทนี้ไปแล้ว' }, { status: 400 })

    amountThb = course.price ?? 390
    topicId = id
  } else {
    const bundle = BUNDLES[id]
    if (!bundle) return NextResponse.json({ error: 'Invalid bundle' }, { status: 400 })

    const { data: existing } = await supabase
      .from('topic_purchases')
      .select('topic_id')
      .eq('user_id', user.id)
      .in('topic_id', bundle.topicIds)
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'คุณซื้อบางบทในชุดนี้ไปแล้ว' }, { status: 400 })
    }

    amountThb = bundle.price
    bundleId = id
  }

  const path = `${user.id}/${Date.now()}-${slip.name}`
  const { error: uploadError } = await supabase.storage
    .from('payment-slips')
    .upload(path, slip, { contentType: slip.type })
  if (uploadError) return NextResponse.json({ error: 'อัปโหลดสลิปไม่สำเร็จ' }, { status: 500 })

  const { error: insertError } = await supabase.from('bank_transfer_requests').insert({
    user_id: user.id,
    user_email: user.email,
    topic_id: topicId,
    bundle_id: bundleId,
    amount_thb: amountThb,
    slip_url: path,
    status: 'pending',
  })
  if (insertError) return NextResponse.json({ error: 'บันทึกคำขอไม่สำเร็จ' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
