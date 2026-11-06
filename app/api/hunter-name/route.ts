import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBangkokMonthKey } from '@/lib/hunter-ranking'
import { normalizeHunterDisplayName } from '@/lib/hunter-display-name'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const displayName = normalizeHunterDisplayName(body?.name)
  if (!displayName) return NextResponse.json({ error: 'ชื่อยาว 3–24 ตัว ใช้ตัวอักษร ตัวเลข เว้นวรรค ขีด หรือขีดล่างเท่านั้น' }, { status: 400 })

  const { error } = await createAdminClient().from('hunter_display_names').insert({
    user_id: user.id, month_key: getBangkokMonthKey(), display_name: displayName,
  })
  if (error?.code === '23505') return NextResponse.json({ error: 'คุณตั้งชื่อไปแล้วในเดือนนี้ สามารถเปลี่ยนอีกครั้งในเดือนหน้า' }, { status: 409 })
  if (error) {
    console.error('Failed to save Hunter display name', error)
    return NextResponse.json({ error: 'บันทึกชื่อไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
