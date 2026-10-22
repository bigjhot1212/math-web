import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasPremiumAccess } from '@/lib/premium-access'
import { PREMIUM_QUESTION_COLUMNS, PREMIUM_SESSION_LIMIT, toPracticeQuestion, type PremiumQuestionRow } from '@/lib/premium-questions'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนฝึกโจทย์' }, { status: 401 })
  }
  if (!(await hasPremiumAccess(user))) {
    return NextResponse.json({ error: 'ฝึกโจทย์พรีเมียมสำหรับนักเรียนที่ซื้อคอร์ส' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const exam = searchParams.get('exam')
  const year = Number(searchParams.get('year'))
  const topic = searchParams.get('topic')
  const offset = Math.max(0, Number(searchParams.get('offset')) || 0)

  let query = createAdminClient()
    .from('premium_questions')
    .select(PREMIUM_QUESTION_COLUMNS)
    .eq('published', true)
  if (exam) query = query.eq('exam', exam)
  if (Number.isInteger(year) && year > 0) query = query.eq('exam_year', year)
  if (topic) query = query.eq('topic_id', topic)

  const { data, error } = await query
    .order('exam_year', { ascending: false })
    .order('question_number', { ascending: true })
    .range(offset, offset + PREMIUM_SESSION_LIMIT - 1)

  if (error) {
    console.error('Failed to load premium questions', error)
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
  }

  return NextResponse.json({ questions: ((data ?? []) as PremiumQuestionRow[]).map(toPracticeQuestion) })
}
