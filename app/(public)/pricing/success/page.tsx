import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StripeSuccessClient from './stripe-success-client'

type SearchParams = Promise<{ session_id?: string }>

export default async function PricingSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const { session_id: sessionId } = await searchParams
  if (!sessionId) redirect('/pricing')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/pricing/success?session_id=${sessionId}`)}`)

  return <StripeSuccessClient sessionId={sessionId} />
}
