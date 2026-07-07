'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Props = {
  name: string
  email: string
  avatarUrl: string | null
}

export default function UserMenu({ name, email, avatarUrl }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div ref={ref} className="relative ml-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors cursor-pointer"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-semibold bg-primary text-primary-foreground w-full h-full flex items-center justify-center">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-fade-slide-in absolute right-0 top-10 w-52 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-lg py-1 z-50">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            Dashboard
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors cursor-pointer"
          >
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  )
}
