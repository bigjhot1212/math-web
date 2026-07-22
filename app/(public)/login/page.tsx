'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginCard() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/dashboard'

  async function handleGoogleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
  }

  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-8 shadow-sm">
      <p className="text-sm text-muted-foreground text-center mb-6">
        เข้าสู่ระบบเพื่อบันทึกความก้าวหน้า
      </p>
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5 transition-all cursor-pointer text-sm font-medium text-foreground"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
          />
          <path
            fill="#34A853"
            d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"
          />
          <path
            fill="#FBBC05"
            d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"
          />
          <path
            fill="#EA4335"
            d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"
          />
        </svg>
        เข้าสู่ระบบด้วย Google
      </button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="animate-fade-slide-in w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-heading font-semibold text-primary">
            ∑
          </div>
          <h1 className="text-2xl font-heading font-semibold text-foreground mb-2">MathPrep</h1>
          <p className="text-muted-foreground text-sm">
            ระบบฝึกโจทย์คณิตศาสตร์ ONET · A-Level · PAT1
          </p>
        </div>

        <Suspense fallback={null}>
          <LoginCard />
        </Suspense>

        <p className="text-center text-xs text-muted-foreground mt-6">
          การเข้าสู่ระบบถือว่ายอมรับ{' '}
          <span className="underline cursor-pointer hover:text-foreground transition-colors">นโยบายความเป็นส่วนตัว</span>
        </p>
      </div>
    </main>
  )
}
