import { createClient } from '@/lib/supabase/server'
import CartClient from './cart-client'

export default async function CartPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let purchasedTopicIds: string[] = []
  if (user) {
    const { data } = await supabase.from('topic_purchases').select('topic_id').eq('user_id', user.id)
    purchasedTopicIds = data?.map((r) => r.topic_id) ?? []
  }

  return <CartClient isLoggedIn={!!user} purchasedTopicIds={purchasedTopicIds} />
}
