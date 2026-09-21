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
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-heading font-bold text-foreground cursor-pointer">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-lg text-primary-foreground shadow-sm shadow-primary/30">∑</span>
          <span className="tracking-tight">MathPrep</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl bg-muted/70 p-1 md:flex">
          {[
            ['ฝึกโจทย์', '/practice'],
            ['สอบจำลอง', '/exam'],
            ['Dashboard', '/dashboard'],
            ['ราคา', '/pricing'],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-xl px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-primary cursor-pointer">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <CartIcon />
          {user ? (
            <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
          ) : (
            <Link href="/login" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/25 transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer">
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
