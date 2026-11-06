import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Question } from '@/lib/types/question'
import { calculateExamPoints } from '@/lib/exam-scoring'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  persistHunterRankSnapshot,
  type HunterRankFinalizationReason,
} from '@/lib/hunter-rank-persistence'

type FinalizeMonthlyRankExamInput = {
  supabase: SupabaseClient
  userId: string
  sessionId: string
  examType: string
  questions: Question[]
  answers: Record<string, string>
  finalizationReason: HunterRankFinalizationReason
  submittedAt?: string
}

export function selectHunterRankQuestions(questionBank: Question[], questionIds: unknown) {
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    throw new Error('Hunter Rank exam has no recorded question set.')
  }
  const requestedIds = questionIds.filter((id): id is string => typeof id === 'string')
  const uniqueIds = new Set(requestedIds)
  if (requestedIds.length !== questionIds.length || uniqueIds.size !== requestedIds.length) {
    throw new Error('Hunter Rank exam question set contains invalid or duplicate IDs.')
  }
  const questionMap = new Map(questionBank.map(question => [question.id, question]))
  const questions = requestedIds.map(id => questionMap.get(id)).filter((question): question is Question => Boolean(question))
  if (questions.length !== requestedIds.length) {
    throw new Error(`Hunter Rank exam is missing ${requestedIds.length - questions.length} recorded questions.`)
  }
  return questions
}

export async function finalizeMonthlyRankExam(input: FinalizeMonthlyRankExamInput) {
  const submittedAt = input.submittedAt ?? new Date().toISOString()
  const scoring = calculateExamPoints(input.questions, input.answers)
  const { data: updatedSession, error: updateError } = await createAdminClient()
    .from('exam_sessions')
    .update({
      answers: input.answers,
      score: scoring.points,
      total_questions: scoring.maximumPoints,
      submitted_at: submittedAt,
    })
    .eq('id', input.sessionId)
    .eq('user_id', input.userId)
    .is('submitted_at', null)
    .select('id')
    .maybeSingle()

  if (updateError) throw updateError
  if (!updatedSession) return { finalized: false as const, scoring }

  const snapshot = await persistHunterRankSnapshot({
    userId: input.userId,
    examSessionId: input.sessionId,
    examType: input.examType,
    questionIds: input.questions.map(question => question.id),
    earnedPoints: scoring.earnedPoints,
    penaltyPoints: scoring.penaltyPoints,
    netPoints: scoring.points,
    maximumPoints: scoring.maximumPoints,
    submittedAt,
    finalizationReason: input.finalizationReason,
  })

  return { finalized: true as const, scoring, snapshot, submittedAt }
}

export async function ensureHunterRankSnapshot(input: Omit<FinalizeMonthlyRankExamInput, 'supabase'> & {
  score: number
  maximumPoints: number
}) {
  const scoring = calculateExamPoints(input.questions, input.answers)
  await persistHunterRankSnapshot({
    userId: input.userId,
    examSessionId: input.sessionId,
    examType: input.examType,
    questionIds: input.questions.map(question => question.id),
    earnedPoints: scoring.earnedPoints,
    penaltyPoints: scoring.penaltyPoints,
    netPoints: input.score,
    maximumPoints: input.maximumPoints,
    submittedAt: input.submittedAt ?? new Date().toISOString(),
    finalizationReason: input.finalizationReason,
  })
}
