import { createClient } from '@/lib/supabase/server'
import ExamSelector from './exam-selector'

export default async function ExamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  if (user) {
    const { data } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .single()
    isPremium = data?.status === 'active'
  }

  return <ExamSelector isPremium={isPremium} />
}
