import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'
import { validateHunterDraft } from '@/lib/hunter-exam-draft'
import { getBangkokMonthKey } from '@/lib/hunter-ranking'

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    const object = value as Record<string, unknown>
    return `{${Object.keys(object).sort().map(key => `${JSON.stringify(key)}:${canonical(object[key])}`).join(',')}}`
  }
  return JSON.stringify(value) ?? 'null'
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: 'ไม่มีสิทธิ์ใช้งาน' }, { status: 403 })
  const month = request.nextUrl.searchParams.get('month')
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return NextResponse.json({ error: 'ระบุเดือนให้ถูกต้อง' }, { status: 400 })
  const { data, error } = await createAdminClient().from('hunter_rank_exam_sets').select('questions,status').eq('month_key', month).maybeSingle()
  if (error) return NextResponse.json({ error: 'โหลดชุดสอบไม่สำเร็จ' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'ไม่พบชุดสอบของเดือนนี้' }, { status: 404 })
  return NextResponse.json(data, { headers: { 'Cache-Control': 'private, no-store' } })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) return NextResponse.json({ error: 'ไม่มีสิทธิ์ใช้งาน' }, { status: 403 })
  const body = await request.json().catch(() => null) as { month?: unknown; questions?: unknown; action?: unknown } | null
  if (!body || typeof body.month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(body.month)) {
    return NextResponse.json({ error: 'ระบุเดือนในรูปแบบ YYYY-MM' }, { status: 400 })
  }
  if (body.month <= '2026-11') return NextResponse.json({ error: 'ชุดแรกถูกกำหนดไว้แล้ว กรุณาเลือกเดือนหลังพฤศจิกายน 2026' }, { status: 400 })
  if (body.month < getBangkokMonthKey()) return NextResponse.json({ error: 'ไม่สามารถสร้างหรืออนุมัติชุดสอบย้อนหลังได้' }, { status: 400 })
  const admin = createAdminClient()
  if (body.action === 'save') {
    const issues = validateHunterDraft(body.questions)
    if (issues.length) return NextResponse.json({ error: 'โครงสร้างข้อสอบไม่ถูกต้อง', issues }, { status: 400 })
    const { error } = await admin.from('hunter_rank_exam_sets').upsert({ month_key: body.month, questions: body.questions, status: 'draft', updated_by: user.id, updated_at: new Date().toISOString() }, { onConflict: 'month_key' })
    if (error) return NextResponse.json({ error: 'บันทึกไม่ได้ ตรวจสอบว่าชุดนี้ยังไม่อนุมัติและติดตั้งฐานข้อมูลแล้ว' }, { status: 409 })
    return NextResponse.json({ saved: true })
  }
  if (body.action === 'publish') {
    const { data: draft, error: readError } = await admin.from('hunter_rank_exam_sets').select('questions,status,updated_at').eq('month_key', body.month).maybeSingle()
    if (readError || !draft || draft.status !== 'draft') return NextResponse.json({ error: 'ไม่พบฉบับร่างที่อนุมัติได้' }, { status: 409 })
    if (validateHunterDraft(draft.questions).length) return NextResponse.json({ error: 'ฉบับร่างไม่ผ่านการตรวจโครงสร้าง' }, { status: 400 })
    // Match the exact version reviewed in the editor, then use optimistic locking.
    if (canonical(draft.questions) !== canonical(body.questions)) return NextResponse.json({ error: 'ฉบับร่างเปลี่ยนไป กรุณาบันทึกและตรวจใหม่ก่อนอนุมัติ' }, { status: 409 })
    const { data, error } = await admin.from('hunter_rank_exam_sets').update({ status: 'published', updated_by: user.id, updated_at: new Date().toISOString(), published_at: new Date().toISOString() }).eq('month_key', body.month).eq('status', 'draft').eq('updated_at', draft.updated_at).select('month_key').maybeSingle()
    if (error || !data) return NextResponse.json({ error: 'อนุมัติไม่สำเร็จ กรุณาตรวจสถานะชุดสอบอีกครั้ง' }, { status: 409 })
    return NextResponse.json({ published: true })
  }
  return NextResponse.json({ error: 'คำสั่งไม่ถูกต้อง' }, { status: 400 })
}
