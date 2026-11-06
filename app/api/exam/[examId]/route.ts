import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/types/question'
import { legacySetPracticeQuestions, originalPracticeQuestions } from '@/lib/content/original-practice'
import { setChallengeQuestions } from '@/lib/content/set-challenge'
import { allMath1MockQuestions } from '@/lib/content/math1-mock-sets'
import { getServerExamSet } from '@/lib/hunter-exam-set-server'
import { getHunterRank, isHunterRankingReleased, isMonthlyRankExamType } from '@/lib/hunter-ranking'
import { ensureHunterRankSnapshot, finalizeMonthlyRankExam, selectHunterRankQuestions } from '@/lib/hunter-rank-finalization'
import { canAccessHunterRank } from '@/lib/hunter-rank-access'
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

    if (isMonthlyRankExamType(session.exam_type) && !canAccessHunterRank(user.email)) {
      return NextResponse.json({ error: 'ข้อสอบจัดอันดับยังไม่เปิดให้ใช้งาน' }, { status: 403 })
    }

    if (isMonthlyRankExamType(session.exam_type) && !isHunterRankingReleased()) {
      return NextResponse.json({ error: 'ข้อสอบจัดอันดับจะเปิดวันที่ 7 พฤศจิกายน 2569' }, { status: 403 })
    }

    const monthlyQuestions = (await getServerExamSet(session.exam_type))?.questions ?? []
    const allQuestions = loadAllQuestions().concat(monthlyQuestions)
    const questionMap = new Map(allQuestions.map(q => [q.id, q]))
    const questionIds = Array.isArray(session.question_ids) ? session.question_ids as string[] : []
    const questions = questionIds
      .map(id => questionMap.get(id))
      .filter((q): q is Question => q !== undefined)

    if (isMonthlyRankExamType(session.exam_type)) {
      selectHunterRankQuestions(questions, questionIds)
    }

    if (isMonthlyRankExamType(session.exam_type) && !session.submitted_at) {
      const answers = (session.answers ?? {}) as Record<string, string>
      const result = await finalizeMonthlyRankExam({
        supabase,
        userId: user.id,
        sessionId: session.id,
        examType: session.exam_type,
        questions,
        answers,
        finalizationReason: 'left_exam',
      })
      if (result.finalized) {
        return NextResponse.json({
          session: {
            ...session,
            score: result.scoring.points,
            total_questions: result.scoring.maximumPoints,
            submitted_at: result.submittedAt,
          },
          questions,
          hunterRank: { rank_code: result.snapshot.rankCode, rating: result.snapshot.rating },
        })
      }
      const { data: finalizedSession } = await supabase
        .from('exam_sessions')
        .select('*')
        .eq('id', session.id)
        .eq('user_id', user.id)
        .single()
      return NextResponse.json({ session: finalizedSession ?? session, questions })
    }

    if (isMonthlyRankExamType(session.exam_type) && session.submitted_at) {
      try {
        await ensureHunterRankSnapshot({
          userId: user.id,
          sessionId: session.id,
          examType: session.exam_type,
          questions,
          answers: (session.answers ?? {}) as Record<string, string>,
          score: session.score,
          maximumPoints: session.total_questions,
          submittedAt: session.submitted_at,
          finalizationReason: 'recovered',
        })
      } catch (snapshotError) {
        console.error(`Unable to repair Hunter Rank snapshot for ${session.id}:`, snapshotError)
      }
    }

    let hunterRank = null
    if (isMonthlyRankExamType(session.exam_type) && session.submitted_at) {
      const { data: rankResult } = await supabase.from('hunter_rank_results')
        .select('rank_code, rating')
        .eq('user_id', user.id)
        .eq('exam_session_id', session.id)
        .maybeSingle()
      hunterRank = rankResult ? { ...rankResult, rank_code: getHunterRank(rankResult.rating).code } : null
    }
    return NextResponse.json({ session, questions, hunterRank })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 })
  }
}
