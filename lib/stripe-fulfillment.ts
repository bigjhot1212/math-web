import type Stripe from 'stripe'
import { COURSES } from '@/content/course-videos'
import { inviteStudentToClassroom } from '@/lib/google-classroom'
import { createAdminClient } from '@/lib/supabase/admin'

export async function grantPaidCourses(session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid') return false

  const userId = session.metadata?.supabase_user_id
  const topicIds = [...new Set(session.metadata?.topic_ids?.split(',').filter(Boolean) ?? [])]
  if (!userId || topicIds.length === 0) {
    throw new Error(`Checkout Session ${session.id} is missing purchase metadata.`)
  }

  const admin = createAdminClient()
  const totalThb = Math.round((session.amount_total ?? 0) / 100)
  const purchaseType = session.metadata?.type
  const bundlePrice = purchaseType === 'bundle' && topicIds.length > 0
    ? Math.round(totalThb / topicIds.length)
    : null

  const { data: userData } = await admin.auth.admin.getUserById(userId)
  const email = userData?.user?.email

  for (const topicId of topicIds) {
    const { data: existing, error: existingError } = await admin
      .from('topic_purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .maybeSingle()
    if (existingError) throw existingError
    if (existing) continue

    const { error: purchaseError } = await admin.from('topic_purchases').upsert({
      user_id: userId,
      topic_id: topicId,
      price_thb: bundlePrice ?? (COURSES[topicId]?.price ?? 390),
      payment_method: 'stripe',
    }, { onConflict: 'user_id,topic_id' })
    if (purchaseError) throw purchaseError

    const classroomId = COURSES[topicId]?.classroomId
    if (classroomId && email) {
      try {
        await inviteStudentToClassroom(classroomId, email)
      } catch (error) {
        console.error(`Classroom invite failed for ${topicId}:`, error)
      }
    }
  }

  return true
}
