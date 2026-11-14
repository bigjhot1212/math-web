import { createClient } from '@/lib/supabase/server'
import PricingCards from './pricing-cards'
import { purchaseEntitlement } from '@/lib/course-expiry'
import { isAdminEmail } from '@/lib/payment-config'

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let purchasedTopicIds: string[] = []
  let expiredTopicIds: string[] = []

  if (user) {
    const [{ data }, { data: subscription }] = await Promise.all([
      supabase.from('topic_purchases').select('topic_id, purchased_at, payment_method').eq('user_id', user.id),
      supabase.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle(),
    ])
    purchasedTopicIds = data?.map(r => r.topic_id) ?? []
    expiredTopicIds = isAdminEmail(user.email) || subscription?.status === 'active' ? [] : data?.filter(r => !purchaseEntitlement(r).active).map(r => r.topic_id) ?? []
  }

  return <PricingCards isLoggedIn={!!user} purchasedTopicIds={purchasedTopicIds} expiredTopicIds={expiredTopicIds} />
}
