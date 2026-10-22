import type { User } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'

// A student has premium practice if they bought any course, have an active
// subscription, or their email was pre-approved (registered before the website).
export async function hasPremiumAccess(user: User): Promise<boolean> {
  if (isAdminEmail(user.email)) return true

  const admin = createAdminClient()
  // Only a confirmed email may claim an invite, so nobody can sign up with someone else's address
  const email = user.email_confirmed_at ? user.email?.trim().toLowerCase() : undefined
  const [{ count: purchaseCount }, { data: subscription }, { data: invite }] = await Promise.all([
    admin.from('topic_purchases').select('topic_id', { count: 'exact', head: true }).eq('user_id', user.id),
    admin.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle(),
    email
      ? admin.from('premium_invites').select('email').eq('email', email).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  return (purchaseCount ?? 0) > 0 || subscription?.status === 'active' || Boolean(invite)
}
