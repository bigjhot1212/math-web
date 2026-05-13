import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/types/question'
import fs from 'fs'
import path from 'path'

const TOPIC_GROUPS: Record<string, string[]> = {
  'A-Level-1': ['set', 'logic', 'real-numbers', 'relations-functions', 'exponential-logarithm', 'analytic-geometry-conics'],
  'A-Level-2': ['trigonometry', 'matrix', 'vector', 'complex-numbers', 'counting-probability', 'sequences-series', 'calculus', 'statistics-distributions'],
}

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
}

export async function POST(request: NextRequest) {
  try {
    const { examType } = await request.json()
    const parsed = parseExamType(examType)
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid exam type' }, { status: 400 })
    }
    const { topics, tier } = parsed
    const questionCount = tier === 'paid' ? 30 : 10
    const durationMinutes = tier === 'paid' ? 90 : 30

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Gate paid exams behind active subscription
    if (tier === 'paid') {
      if (!user) return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
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
    const selected = (pool.length > 0 ? pool : allQuestions)
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(questionCount, pool.length))

    const startedAt = new Date().toISOString()
    const { data, error } = await supabase
      .from('exam_sessions')
      .insert({
        user_id: user?.id ?? null,
        exam_type: examType,
        question_ids: selected.map(q => q.id),
        answers: {},
        total_questions: selected.length,
        started_at: startedAt,
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({
      examId: data.id,
      questions: selected,
      durationMinutes,
      startedAt,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 })
  }
}
