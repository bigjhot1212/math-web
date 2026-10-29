import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_STUDENT_DESTINATION } from '@/lib/navigation'
import { claimCourseInvites } from '@/lib/course-invites'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? DEFAULT_STUDENT_DESTINATION

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Students who paid before the website existed get their courses on first sign-in
      try {
        if (data.user) await claimCourseInvites(data.user)
      } catch (claimError) {
        console.error('Failed to claim pre-website courses', claimError)
      }
      // Ask each new student for the details needed to personalize support.
      // The onboarding page sends returning students straight to `next`.
      return NextResponse.redirect(`${origin}/onboarding?next=${encodeURIComponent(next.startsWith('/') ? next : '/')}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
