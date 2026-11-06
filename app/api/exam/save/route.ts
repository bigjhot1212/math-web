import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isMonthlyRankExamType } from '@/lib/hunter-ranking'
import { sanitizeExamAnswers } from '@/lib/exam-scoring'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { examId?: unknown; answers?: unknown }
    if (typeof body.examId !== 'string') {
      return NextResponse.json({ error: 'ข้อมูลคำตอบไม่ถูกต้อง' }, { status: 400 })
    }
    const answers = sanitizeExamAnswers(body.answers)
    if (!answers) {
      return NextResponse.json({ error: 'ข้อมูลคำตอบเกินขอบเขตที่กำหนด' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })

    const { data: session, error: readError } = await supabase.from('exam_sessions')
      .select('exam_type').eq('id', body.examId).eq('user_id', user.id).maybeSingle()
    if (readError || !session) return NextResponse.json({ error: 'ไม่พบรอบสอบนี้' }, { status: 404 })
    const writeClient = isMonthlyRankExamType(session.exam_type) ? createAdminClient() : supabase
    const { data: updatedSession, error } = await writeClient
      .from('exam_sessions')
      .update({ answers })
      .eq('id', body.examId)
      .eq('user_id', user.id)
      .is('submitted_at', null)
      .select('id')
      .maybeSingle()

    if (error) throw error
    if (!updatedSession) {
      return NextResponse.json({ error: 'รอบสอบนี้สิ้นสุดแล้ว' }, { status: 409 })
    }
    return NextResponse.json({ saved: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'บันทึกคำตอบไม่สำเร็จ' }, { status: 500 })
  }
}
