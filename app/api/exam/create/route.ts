import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/types/question'
import { originalPracticeQuestions } from '@/lib/content/original-practice'
import { setChallengeQuestions } from '@/lib/content/set-challenge'
import { getMath1MockSet } from '@/lib/content/math1-mock-sets'
import { isHunterRankingReleased, isMonthlyRankExamType } from '@/lib/hunter-ranking'
import { finalizeMonthlyRankExam, selectHunterRankQuestions } from '@/lib/hunter-rank-finalization'
import fs from 'fs'
import path from 'path'

const TOPIC_GROUPS: Record<string, string[]> = {
  'A-Level-1': ['set', 'logic', 'real-numbers', 'relations-functions', 'exponential-logarithm', 'analytic-geometry-conics'],
  'A-Level-2': ['trigonometry', 'matrix', 'vector', 'complex-numbers', 'counting-probability', 'sequences-series', 'calculus', 'statistics-distributions'],
}

const BASIC_DIAGNOSTIC_TYPE = 'basic-diagnostic-v1'

// examType: "A-Level-1-free", "A-Level-1-paid", "A-Level-2-free", "A-Level-2-paid"
function parseExamType(examType: string): { topics: string[]; tier: 'free' | 'paid' } | null {
  const tier = examType.endsWith('-paid') ? 'paid' : examType.endsWith('-free') ? 'free' : null
  if (!tier) return null
  const group = examType.slice(0, -(tier.length + 1))
  const topics = TOPIC_GROUPS[group]
  if (!topics) return null
  return { topics, tier }
}

function loadAllQuestions(): Question[] {
  const dir = path.join(process.cwd(), 'content', 'questions')
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as Question[])
    .filter(question => !question.tags?.some(tag => tag === 'ipst-m4-book1-v1' || tag === 'ipst-m4-book2-v1'))
    .filter(question => question.topicId !== 'set' || question.tags?.includes(BASIC_DIAGNOSTIC_TYPE))
    .concat(originalPracticeQuestions, setChallengeQuestions)
}

export async function POST(request: NextRequest) {
  try {
    const { examType } = await request.json()
    const mockSet = getMath1MockSet(examType)
    const isBasicDiagnostic = examType === BASIC_DIAGNOSTIC_TYPE
    const parsed = mockSet || isBasicDiagnostic ? null : parseExamType(examType)
    if (!mockSet && !parsed && !isBasicDiagnostic) {
      return NextResponse.json({ error: 'Invalid exam type' }, { status: 400 })
    }

    if (examType === 'A-Level-1-paid' || examType === 'A-Level-2-paid') {
      return NextResponse.json({ error: 'ข้อสอบชุดนี้ยังไม่เปิดใช้งาน' }, { status: 403 })
    }
    const tier = parsed?.tier ?? 'free'
    const topics = parsed?.topics ?? []
    const questionCount = mockSet || isBasicDiagnostic ? 30 : tier === 'paid' ? 30 : 10
    const durationMinutes = mockSet || isBasicDiagnostic ? 90 : tier === 'paid' ? 90 : 30

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนเริ่มข้อสอบ' }, { status: 401 })
    }

    if (isMonthlyRankExamType(examType) && !isHunterRankingReleased()) {
      return NextResponse.json({ error: 'ข้อสอบจัดอันดับจะเปิดวันที่ 7 พฤศจิกายน 2569' }, { status: 403 })
    }

    if (isMonthlyRankExamType(examType)) {
      const { data: existingSession } = await supabase
        .from('exam_sessions')
        .select('id, answers, question_ids, started_at, submitted_at')
        .eq('user_id', user.id)
        .eq('exam_type', examType)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (existingSession?.submitted_at) {
        return NextResponse.json({ error: 'คุณทำข้อสอบจัดอันดับเดือนนี้แล้ว ดูผลและอันดับได้ที่หน้าแรงค์ฮันเตอร์' }, { status: 409 })
      }
      if (existingSession && mockSet) {
        const answers = (existingSession.answers ?? {}) as Record<string, string>
        const questions = selectHunterRankQuestions(mockSet.questions, existingSession.question_ids)
        await finalizeMonthlyRankExam({
          supabase,
          userId: user.id,
          sessionId: existingSession.id,
          examType,
          questions,
          answers,
          finalizationReason: 'recovered',
        })
        return NextResponse.json({ error: 'การสอบครั้งนี้สิ้นสุดแล้ว ระบบคิดคะแนนจากคำตอบที่บันทึกไว้ให้เรียบร้อย' }, { status: 409 })
      }
    }

    // Gate paid exams behind active subscription
    if (tier === 'paid') {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single()
      if (sub?.status !== 'active') {
        return NextResponse.json({ error: 'ต้องเป็นสมาชิก Premium' }, { status: 403 })
      }
    }

    const allQuestions = loadAllQuestions()
    const topicSet = new Set(topics)
    const pool = allQuestions.filter(q => topicSet.has(q.topicId))
    const diagnosticQuestions = allQuestions
      .filter(question => question.tags?.includes(BASIC_DIAGNOSTIC_TYPE))
      .sort((a, b) => a.id.localeCompare(b.id))

    if (isBasicDiagnostic && diagnosticQuestions.length !== 30) {
      console.error(`Expected 30 diagnostic questions, found ${diagnosticQuestions.length}`)
      return NextResponse.json({ error: 'ชุดแบบทดสอบยังไม่พร้อมใช้งาน' }, { status: 500 })
    }

    const selected = isBasicDiagnostic
      ? diagnosticQuestions
      : mockSet?.questions ?? (pool.length > 0 ? pool : allQuestions)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(questionCount, pool.length || allQuestions.length))

    const startedAt = new Date().toISOString()
    const { data, error } = await supabase
      .from('exam_sessions')
      .insert({
        user_id: user.id,
        exam_type: examType,
        question_ids: selected.map(q => q.id),
        answers: {},
        total_questions: selected.length,
        started_at: startedAt,
      })
      .select('id')
      .single()

    if (error?.code === '23505' && isMonthlyRankExamType(examType)) {
      return NextResponse.json({ error: 'คุณมีรอบสอบจัดอันดับของเดือนนี้แล้ว' }, { status: 409 })
    }
    if (error) throw error

    return NextResponse.json({
      examId: data.id,
      examType,
      freshAttempt: true,
      questions: selected,
      durationMinutes,
      startedAt,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'ไม่สามารถเริ่มข้อสอบได้ กรุณาลองใหม่อีกครั้ง' }, { status: 500 })
  }
}
