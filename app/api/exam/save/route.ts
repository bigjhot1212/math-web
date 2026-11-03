import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { examId?: unknown; answers?: unknown }
    if (typeof body.examId !== 'string' || !body.answers || typeof body.answers !== 'object' || Array.isArray(body.answers)) {
      return NextResponse.json({ error: 'ข้อมูลคำตอบไม่ถูกต้อง' }, { status: 400 })
    }

    const entries = Object.entries(body.answers as Record<string, unknown>)
    if (entries.length > 30 || entries.some(([key, value]) => key.length > 120 || String(value ?? '').length > 100)) {
      return NextResponse.json({ error: 'ข้อมูลคำตอบเกินขอบเขตที่กำหนด' }, { status: 400 })
    }
    const answers = Object.fromEntries(entries.map(([key, value]) => [key, String(value ?? '')]))

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })

    const { error } = await supabase
      .from('exam_sessions')
      .update({ answers })
      .eq('id', body.examId)
      .eq('user_id', user.id)
      .is('submitted_at', null)

    if (error) throw error
    return NextResponse.json({ saved: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'บันทึกคำตอบไม่สำเร็จ' }, { status: 500 })
  }
}
