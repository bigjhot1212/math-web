import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBangkokMonthKey } from '@/lib/hunter-ranking'
import { isHunterNameAllowed, normalizeHunterDisplayName } from '@/lib/hunter-display-name'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
  const body = await request.json().catch(() => null)
  const displayName = normalizeHunterDisplayName(body?.name)
  if (!displayName) return NextResponse.json({ error: 'ชื่อยาว 3–24 ตัว ใช้ตัวอักษร ตัวเลข เว้นวรรค ขีด หรือขีดล่างเท่านั้น' }, { status: 400 })
  if (!isHunterNameAllowed(displayName)) return NextResponse.json({ error: 'ชื่อนี้มีคำไม่เหมาะสม กรุณาเลือกชื่อที่สุภาพ' }, { status: 400 })

  const admin = createAdminClient()
  const monthKey = getBangkokMonthKey()
  const { error } = await admin.from('hunter_display_names').insert({
    user_id: user.id, month_key: monthKey, display_name: displayName,
  })
  if (error?.code === '23505') {
    const { data: existing, error: readError } = await admin.from('hunter_display_names').select('display_name').eq('user_id', user.id).eq('month_key', monthKey).maybeSingle()
    if (readError) return NextResponse.json({ error: 'ตรวจสอบชื่อเดิมไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 })
    if (!existing || isHunterNameAllowed(existing.display_name)) return NextResponse.json({ error: 'คุณตั้งชื่อไปแล้วในเดือนนี้ สามารถเปลี่ยนอีกครั้งในเดือนหน้า' }, { status: 409 })
    const { data: updated, error: updateError } = await admin.from('hunter_display_names').update({ display_name: displayName }).eq('user_id', user.id).eq('month_key', monthKey).eq('display_name', existing.display_name).select('user_id').maybeSingle()
    if (updateError || !updated) return NextResponse.json({ error: 'บันทึกชื่อไม่สำเร็จ กรุณาลองใหม่' }, { status: 409 })
    return NextResponse.json({ ok: true })
  }
  if (error) {
    console.error('Failed to save Hunter display name', error)
    return NextResponse.json({ error: 'บันทึกชื่อไม่สำเร็จ กรุณาลองใหม่' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
