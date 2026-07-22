import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UserMenu from './user-menu'
import CartIcon from './cart-icon'

export default async function Nav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const name = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'User'
  const email = user?.email ?? ''
  const avatarUrl = user?.user_metadata?.avatar_url ?? null

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-heading font-semibold text-foreground flex items-center gap-2 cursor-pointer">
          <span className="text-lg text-primary">∑</span>
          <span>MathPrep</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/practice"
            className="px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            ฝึกโจทย์
          </Link>
          <Link
            href="/exam"
            className="px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            สอบจำลอง
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
          >
            ราคา
          </Link>
          <CartIcon />
          {user ? (
            <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
          ) : (
            <Link
              href="/login"
              className="ml-2 px-4 py-1.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
