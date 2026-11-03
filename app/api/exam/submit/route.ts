import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/types/question'
import { legacySetPracticeQuestions, originalPracticeQuestions } from '@/lib/content/original-practice'
import { setChallengeQuestions } from '@/lib/content/set-challenge'
import { allMath1MockQuestions, getMath1MockSet } from '@/lib/content/math1-mock-sets'
import { hasExamAnswer, isCorrectExamAnswer } from '@/lib/exam-scoring'
import { isMonthlyRankExamType } from '@/lib/hunter-ranking'
import fs from 'fs'
import path from 'path'

function loadAllQuestions(): Question[] {
  const dir = path.join(process.cwd(), 'content', 'questions')
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as Question[])
    .concat(originalPracticeQuestions, legacySetPracticeQuestions, setChallengeQuestions, allMath1MockQuestions)
}

export async function POST(request: NextRequest) {
  try {
    const { examId, answers } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
    }

    const { data: session, error: fetchError } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('id', examId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !session) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    if (session.submitted_at) {
      return NextResponse.json({ error: 'Exam already submitted' }, { status: 400 })
    }

    const monthlyQuestions = getMath1MockSet(session.exam_type)?.questions ?? []
    const allQuestions = loadAllQuestions().concat(monthlyQuestions)
    const questionMap = new Map(allQuestions.map(q => [q.id, q]))
    const questions = (session.question_ids as string[])
      .map(id => questionMap.get(id))
      .filter((q): q is Question => q !== undefined)

    let score = 0
    let points = 0
    let penaltyPoints = 0
    let maximumPoints = 0
    const isMonthlyRankExam = isMonthlyRankExamType(session.exam_type)
    const breakdown: Record<string, { correct: number; total: number }> = {}
    for (const q of questions) {
      const correct = isCorrectExamAnswer(q, answers[q.id])
      const questionPoints = q.type === 'short-answer' ? 5 : 3
      maximumPoints += questionPoints
      if (correct) score++
      if (correct) points += questionPoints
      else if (isMonthlyRankExam && hasExamAnswer(answers[q.id])) penaltyPoints += questionPoints
      if (!breakdown[q.topicId]) breakdown[q.topicId] = { correct: 0, total: 0 }
      breakdown[q.topicId].total++
      if (correct) breakdown[q.topicId].correct++
    }

    const finalPoints = isMonthlyRankExam ? Math.max(0, points - penaltyPoints) : points
    const { error: updateError } = await supabase
      .from('exam_sessions')
      .update({
        answers,
        submitted_at: new Date().toISOString(),
        score: isMonthlyRankExam ? finalPoints : score,
        total_questions: isMonthlyRankExam ? maximumPoints : session.total_questions,
      })
      .eq('id', examId)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({
      score,
      total: questions.length,
      points: finalPoints,
      earnedPoints: points,
      penaltyPoints,
      maximumPoints,
      percentage: maximumPoints > 0 ? Math.round((finalPoints / maximumPoints) * 100) : 0,
      breakdown,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 })
  }
}
