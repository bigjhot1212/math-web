import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'
import { inviteStudentToClassroom } from '@/lib/google-classroom'
import { COURSES, BUNDLES } from '@/content/course-videos'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { action } = await request.json()
  if (action !== 'confirm' && action !== 'reject') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data: reqRow } = await admin.from('bank_transfer_requests').select('*').eq('id', id).single()
  if (!reqRow || reqRow.status !== 'pending') {
    return NextResponse.json({ error: 'Request not found or already processed' }, { status: 404 })
  }

  if (action === 'reject') {
    await admin.from('bank_transfer_requests').update({ status: 'rejected' }).eq('id', id)
    return NextResponse.json({ ok: true })
  }

  const isBundle = !!reqRow.bundle_id
  const topicIds: string[] = isBundle
    ? (BUNDLES[reqRow.bundle_id]?.topicIds ?? [])
    : (reqRow.topic_id?.split(',').filter(Boolean) ?? [])

  // Bundles are sold at a discount, so split the paid amount evenly across topics;
  // cart purchases are each topic's own listed price, not a discount split.
  const perTopicPrice = isBundle && topicIds.length > 0 ? Math.round(reqRow.amount_thb / topicIds.length) : null

  for (const topicId of topicIds) {
    await admin.from('topic_purchases').upsert({
      user_id: reqRow.user_id,
      topic_id: topicId,
      price_thb: perTopicPrice ?? (COURSES[topicId]?.price ?? 390),
      payment_method: 'bank_transfer',
    }, { onConflict: 'user_id,topic_id' })

    const course = COURSES[topicId]
    if (course?.classroomId && reqRow.user_email) {
      try {
        await inviteStudentToClassroom(course.classroomId, reqRow.user_email)
      } catch (e) {
        console.error('Classroom invite failed:', e)
      }
    }
  }

  await admin.from('bank_transfer_requests').update({
    status: 'confirmed',
    confirmed_at: new Date().toISOString(),
  }).eq('id', id)

  return NextResponse.json({ ok: true })
}
