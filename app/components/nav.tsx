import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UserMenu from './user-menu'

export default async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'User'
  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url ?? null

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-lg">∑</span>
          <span>MathPrep</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/practice"
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            ฝึกโจทย์
          </Link>
          <Link
            href="/exam"
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            สอบจำลอง
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            ราคา
          </Link>
          {user ? (
            <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
          ) : (
            <Link
              href="/login"
              className="ml-2 px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-accent transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
