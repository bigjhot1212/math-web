import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/payment-config'
import AppShell from './app-shell'

export default async function Nav({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <AppShell
      user={user ? {
        name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'นักเรียน',
        email: user.email ?? '',
        avatarUrl: user.user_metadata?.avatar_url ?? null,
      } : null}
      isAdmin={isAdminEmail(user?.email)}
    >
      {children}
    </AppShell>
  )
}
