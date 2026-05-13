import { createClient } from '@/lib/supabase/server'
import PricingCards from './pricing-cards'

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let purchasedTopicIds: string[] = []

  if (user) {
    const { data } = await supabase.from('topic_purchases').select('topic_id').eq('user_id', user.id)
    purchasedTopicIds = data?.map(r => r.topic_id) ?? []
  }

  return <PricingCards isLoggedIn={!!user} purchasedTopicIds={purchasedTopicIds} />
}
