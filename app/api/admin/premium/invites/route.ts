import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Body: { emails: string (any mix of newlines, commas, spaces), note?: string }
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { emails, note } = await request.json()
  if (typeof emails !== 'string') {
    return NextResponse.json({ error: 'emails must be text' }, { status: 400 })
  }

  const candidates = [...new Set(emails.split(/[\s,;]+/).map((email) => email.trim().toLowerCase()).filter(Boolean))]
  const valid = candidates.filter((email) => EMAIL_PATTERN.test(email) && email.length <= 320)
  const invalid = candidates.filter((email) => !valid.includes(email))
  const cleanNote = typeof note === 'string' && note.trim() ? note.trim().slice(0, 200) : null

  if (valid.length) {
    const { error } = await createAdminClient()
      .from('premium_invites')
      .upsert(valid.map((email) => ({ email, note: cleanNote })), { onConflict: 'email' })
    if (error) {
      console.error('Failed to save premium invites', error)
      return NextResponse.json({ error: 'บันทึกไม่สำเร็จ' }, { status: 500 })
    }
  }

  return NextResponse.json({ saved: valid.length, invalid })
}
