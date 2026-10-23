import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'

const CHOICE_KEYS = ['a', 'b', 'c', 'd', 'e'] as const
const BATCH_SIZE = 500

type IncomingQuestion = Record<string, unknown>

function text(value: unknown, max: number) {
  return typeof value === 'string' && value.trim() && value.length <= max ? value.trim() : null
}

// Returns the database row, or the reason the question was rejected.
function toRow(item: IncomingQuestion): { row: Record<string, unknown> } | { reason: string } {
  const id = text(item.id, 160)
  const exam = text(item.exam, 80)
  const topicId = text(item.topic_id, 100)
  const content = item.content as { text?: unknown; image?: unknown; choices?: Record<string, unknown> } | undefined
  const type = item.type === 'short-answer' ? 'short-answer' : 'multiple-choice'
  const answer = item.answer === undefined || item.answer === null ? null : String(item.answer).trim()

  if (!id) return { reason: 'ไม่มี id' }
  if (!exam) return { reason: 'ไม่มี exam' }
  if (!topicId) return { reason: 'ไม่มี topic_id' }
  if (!content || !text(content.text, 20_000)) return { reason: 'ไม่มีตัวโจทย์ content.text' }
  if (!answer) return { reason: 'ไม่มีคำตอบ answer' }
  if (type === 'multiple-choice') {
    const choices = content.choices
    // a four-choice question leaves e as an empty string
    if (!choices || CHOICE_KEYS.some((key) => typeof choices[key] !== 'string')) return { reason: 'ตัวเลือก a–e ไม่ครบ' }
    if (!CHOICE_KEYS.includes(answer as (typeof CHOICE_KEYS)[number]) || !choices[answer]) return { reason: 'answer ต้องเป็น a–e ที่มีตัวเลือก' }
  }

  const year = Number(item.exam_year)
  const questionNumber = Number(item.question_number)
  const difficulty = ['easy', 'medium', 'hard'].includes(String(item.difficulty)) ? item.difficulty : 'medium'
  const steps = Array.isArray((item.solution as { steps?: unknown })?.steps) ? (item.solution as { steps: unknown[] }).steps.map(String) : []

  return {
    row: {
      id,
      exam,
      exam_year: Number.isInteger(year) && year >= 2400 && year <= 2700 ? year : null,
      exam_round: text(item.exam_round, 80),
      question_number: Number.isInteger(questionNumber) && questionNumber > 0 ? questionNumber : null,
      topic_id: topicId,
      subtopic: text(item.subtopic, 160) ?? '',
      difficulty,
      type,
      content,
      answer,
      accepted_answers: Array.isArray(item.accepted_answers) ? item.accepted_answers : null,
      hint: text(item.hint, 5_000) ?? '',
      solution: { ...(item.solution as object ?? {}), steps },
      published: item.published !== false,
      updated_at: new Date().toISOString(),
    },
  }
}

// Body: an array of questions (see supabase/premium-practice.sql for the fields).
// Questions with an existing id are updated, so the same file can be uploaded again after fixes.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: 'ไฟล์ต้องเป็น JSON array ของโจทย์' }, { status: 400 })
  }

  const rows: Record<string, unknown>[] = []
  const rejected: { index: number; id: unknown; reason: string }[] = []
  body.forEach((item, index) => {
    const result = toRow(item ?? {})
    if ('row' in result) rows.push(result.row)
    else rejected.push({ index, id: (item as IncomingQuestion)?.id, reason: result.reason })
  })

  const admin = createAdminClient()
  for (let start = 0; start < rows.length; start += BATCH_SIZE) {
    const { error } = await admin.from('premium_questions').upsert(rows.slice(start, start + BATCH_SIZE), { onConflict: 'id' })
    if (error) {
      console.error('Failed to import premium questions', error)
      return NextResponse.json({ error: `นำเข้าไม่สำเร็จที่ข้อที่ ${start + 1}`, saved: start, rejected }, { status: 500 })
    }
  }

  return NextResponse.json({ saved: rows.length, rejected: rejected.slice(0, 50), rejectedCount: rejected.length })
}
