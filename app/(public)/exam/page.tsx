import { createClient } from '@/lib/supabase/server'
import { getMath1MockSet } from '@/lib/content/math1-mock-sets'
import { getBangkokMonthKey, getMonthlyRankExamType, isHunterRankingReleased } from '@/lib/hunter-ranking'
import { finalizeMonthlyRankExam, selectHunterRankQuestions } from '@/lib/hunter-rank-finalization'
import ExamSelector from './exam-selector'

export default async function ExamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  const monthlyRankReleased = isHunterRankingReleased()
  const monthlyRankExamType = getMonthlyRankExamType()
  let monthlyRankCompleted = false
  let monthlyRankStarted = false
  if (user) {
    const [{ data: subscription }, { data: monthlySession }] = await Promise.all([
      supabase.from('subscriptions').select('status').eq('user_id', user.id).single(),
      supabase
        .from('exam_sessions')
        .select('id, answers, question_ids, submitted_at')
        .eq('user_id', user.id)
        .eq('exam_type', monthlyRankExamType)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])
    isPremium = subscription?.status === 'active'
    monthlyRankStarted = Boolean(monthlySession)
    monthlyRankCompleted = Boolean(monthlySession?.submitted_at)
    if (monthlyRankReleased && monthlySession && !monthlySession.submitted_at) {
      const monthlySet = getMath1MockSet(monthlyRankExamType)?.questions ?? []
      const questions = selectHunterRankQuestions(monthlySet, monthlySession.question_ids)
      await finalizeMonthlyRankExam({
        supabase,
        userId: user.id,
        sessionId: monthlySession.id,
        examType: monthlyRankExamType,
        questions,
        answers: (monthlySession.answers ?? {}) as Record<string, string>,
        finalizationReason: 'recovered',
      })
      monthlyRankCompleted = true
    }
  }

  const [year, month] = getBangkokMonthKey().split('-').map(Number)
  const monthlyRankLabel = new Intl.DateTimeFormat('th-TH', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(Date.UTC(year, month - 1, 15)))

  return <ExamSelector
    isPremium={isPremium}
    isLoggedIn={Boolean(user)}
    monthlyRankExamType={monthlyRankExamType}
    monthlyRankLabel={monthlyRankLabel}
    monthlyRankStarted={monthlyRankStarted}
    monthlyRankCompleted={monthlyRankCompleted}
    monthlyRankReleased={monthlyRankReleased}
  />
}
