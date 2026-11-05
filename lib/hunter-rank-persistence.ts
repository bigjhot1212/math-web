import 'server-only'

import { createHash } from 'node:crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  getHunterRank,
  getHunterRankMonthKey,
  scorePercentage,
  type HunterRankCode,
} from '@/lib/hunter-ranking'

export type HunterRankFinalizationReason = 'submitted' | 'left_exam' | 'time_expired' | 'recovered'

type HunterRankSnapshotInput = {
  userId: string
  examSessionId: string
  examType: string
  questionIds: string[]
  earnedPoints: number
  penaltyPoints: number
  netPoints: number
  maximumPoints: number
  submittedAt: string
  finalizationReason: HunterRankFinalizationReason
}

export type HunterRankSnapshot = HunterRankSnapshotInput & {
  monthKey: string
  rating: number
  rankCode: HunterRankCode
  questionSetHash: string
}

export function buildHunterRankSnapshot(input: HunterRankSnapshotInput): HunterRankSnapshot {
  const monthKey = getHunterRankMonthKey(input.examType)
  if (!monthKey) throw new Error(`Not a monthly Hunter Rank exam: ${input.examType}`)
  if (input.maximumPoints <= 0) throw new Error('Hunter Rank exam maximum points must be positive.')

  const rating = scorePercentage(input.netPoints, input.maximumPoints)
  return {
    ...input,
    monthKey,
    rating,
    rankCode: getHunterRank(rating).code,
    questionSetHash: createHash('sha256').update(input.questionIds.join('\n')).digest('hex'),
  }
}

export async function persistHunterRankSnapshot(input: HunterRankSnapshotInput) {
  const snapshot = buildHunterRankSnapshot(input)
  const admin = createAdminClient()
  const { error } = await admin.from('hunter_rank_results').insert({
    user_id: snapshot.userId,
    month_key: snapshot.monthKey,
    exam_session_id: snapshot.examSessionId,
    exam_type: snapshot.examType,
    question_set_hash: snapshot.questionSetHash,
    question_ids: snapshot.questionIds,
    earned_points: snapshot.earnedPoints,
    penalty_points: snapshot.penaltyPoints,
    net_points: snapshot.netPoints,
    maximum_points: snapshot.maximumPoints,
    rating: snapshot.rating,
    rank_code: snapshot.rankCode,
    scoring_version: 'hunter-rank-v1',
    finalization_reason: snapshot.finalizationReason,
    submitted_at: snapshot.submittedAt,
  })

  // A repeated delivery or recovery request must not rewrite the original official result.
  if (error && error.code !== '23505') throw error
  return snapshot
}
