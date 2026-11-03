import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/types/question'
import { legacySetPracticeQuestions, originalPracticeQuestions } from '@/lib/content/original-practice'
import { setChallengeQuestions } from '@/lib/content/set-challenge'
import { allMath1MockQuestions, getMath1MockSet } from '@/lib/content/math1-mock-sets'
import { calculateExamPoints } from '@/lib/exam-scoring'
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อน' }, { status: 401 })
    }

    const { data: session, error } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('id', examId)
      .eq('user_id', user.id)
      .single()

    if (error || !session) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    const monthlyQuestions = getMath1MockSet(session.exam_type)?.questions ?? []
    const allQuestions = loadAllQuestions().concat(monthlyQuestions)
    const questionMap = new Map(allQuestions.map(q => [q.id, q]))
    const questions = (session.question_ids as string[])
      .map(id => questionMap.get(id))
      .filter((q): q is Question => q !== undefined)

    if (isMonthlyRankExamType(session.exam_type) && !session.submitted_at) {
      const answers = (session.answers ?? {}) as Record<string, unknown>
      const submittedAt = new Date().toISOString()
      const { points, maximumPoints } = calculateExamPoints(questions, answers)
      await supabase
        .from('exam_sessions')
        .update({ score: points, total_questions: maximumPoints, submitted_at: submittedAt })
        .eq('id', session.id)
        .eq('user_id', user.id)
        .is('submitted_at', null)
      return NextResponse.json({ session: { ...session, score: points, total_questions: maximumPoints, submitted_at: submittedAt }, questions })
    }

    return NextResponse.json({ session, questions })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 })
  }
}
