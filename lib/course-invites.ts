import type { User } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'

// Students who paid before the website existed are listed by email in course_invites.
// When they sign in, their courses become ordinary purchases (price 0, so website revenue
// is not counted twice) and the invites are removed.
export async function claimCourseInvites(user: User) {
  // Only a confirmed email may claim, so nobody can sign up with someone else's address
  const email = user.email_confirmed_at ? user.email?.trim().toLowerCase() : undefined
  if (!email) return

  const admin = createAdminClient()
  const { data: invites, error } = await admin.from('course_invites').select('topic_id').eq('email', email)
  if (error || !invites?.length) return

  const { error: grantError } = await admin.from('topic_purchases').upsert(
    invites.map(({ topic_id }) => ({ user_id: user.id, topic_id, price_thb: 0, payment_method: 'pre_site' })),
    // a course the student has since bought on the website keeps its real purchase row
    { onConflict: 'user_id,topic_id', ignoreDuplicates: true },
  )
  if (grantError) {
    console.error('Failed to grant pre-website courses', grantError)
    return
  }
  await admin.from('course_invites').delete().eq('email', email)
}
