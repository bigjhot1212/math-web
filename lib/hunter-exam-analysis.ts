import { hasExamAnswer, isCorrectExamAnswer } from './exam-scoring'
import type { Question } from './types/question'

export type AnalysisSession = {
  id: string
  question_ids: string[] | null
  answers: Record<string, unknown> | null
  started_at: string
  submitted_at: string | null
}

export function analyzeHunterExam(questions: Question[], sessions: AnalysisSession[]) {
  const completed = sessions.filter(session => session.submitted_at)
  const items = questions.map((question, index) => {
    const eligible = completed.filter(session => session.question_ids?.includes(question.id))
    const answered = eligible.filter(session => hasExamAnswer(session.answers?.[question.id]))
    const correct = answered.filter(session => isCorrectExamAnswer(question, session.answers?.[question.id])).length
    return { question, number: index + 1, eligible: eligible.length, answered: answered.length, correct, omitted: eligible.length - answered.length,
      accuracy: answered.length ? Math.round(correct * 100 / answered.length) : null }
  })
  const shortSessions = completed.filter(session => {
    const duration = Date.parse(session.submitted_at!) - Date.parse(session.started_at)
    return Number.isFinite(duration) && duration >= 0 && duration < 5 * 60_000
  })
  const invalidDurations = completed.filter(session => {
    const duration = Date.parse(session.submitted_at!) - Date.parse(session.started_at)
    return !Number.isFinite(duration) || duration < 0
  })
  return { completed: completed.length, items, shortSessions: shortSessions.length, invalidDurations: invalidDurations.length }
}
