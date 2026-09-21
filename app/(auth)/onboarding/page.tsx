import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/payment-config'
import StudentProfileForm from './student-profile-form'

function safeNext(next?: string) {
  return next?.startsWith('/') ? next : '/dashboard'
}

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const destination = safeNext(next)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(destination)}`)
  if (isAdminEmail(user.email)) redirect(destination)

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (profile) redirect(destination)

  return <StudentProfileForm next={destination} defaultName={user.user_metadata?.full_name ?? ''} />
}
