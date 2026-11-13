import FormulaGame from './formula-game'
import { notFound } from 'next/navigation'
import { isAdminEmail } from '@/lib/payment-config'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function FormulaGamePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) notFound()
  return <FormulaGame />
}
