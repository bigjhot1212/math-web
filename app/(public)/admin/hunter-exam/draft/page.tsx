import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/payment-config'
import DraftChecker from './draft-checker'

export const dynamic = 'force-dynamic'

export default async function DraftPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')
  return <DraftChecker />
}
