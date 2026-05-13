import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/types/question'
import fs from 'fs'
import path from 'path'

function loadAllQuestions(): Question[] {
  const dir = path.join(process.cwd(), 'content', 'questions')
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as Question[])
}

export async function POST(request: NextRequest) {
  try {
    const { examId, answers } = await request.json()
    const supabase = await createClient()

    const { data: session, error: fetchError } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('id', examId)
      .single()

    if (fetchError || !session) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    if (session.submitted_at) {
      return NextResponse.json({ error: 'Exam already submitted' }, { status: 400 })
    }

    const allQuestions = loadAllQuestions()
    const questionMap = new Map(allQuestions.map(q => [q.id, q]))
    const questions = (session.question_ids as string[])
      .map(id => questionMap.get(id))
      .filter((q): q is Question => q !== undefined)

    let score = 0
    const breakdown: Record<string, { correct: number; total: number }> = {}
    for (const q of questions) {
      const correct = answers[q.id] === q.answer
      if (correct) score++
      if (!breakdown[q.topicId]) breakdown[q.topicId] = { correct: 0, total: 0 }
      breakdown[q.topicId].total++
      if (correct) breakdown[q.topicId].correct++
    }

    const { error: updateError } = await supabase
      .from('exam_sessions')
      .update({
        answers,
        submitted_at: new Date().toISOString(),
        score,
      })
      .eq('id', examId)

    if (updateError) throw updateError

    return NextResponse.json({
      score,
      total: questions.length,
      percentage: questions.length > 0 ? Math.round((score / questions.length) * 100) : 0,
      breakdown,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 })
  }
}
