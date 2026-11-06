import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMath1MockSet, type Math1MockSet } from '@/lib/content/math1-mock-sets'
import { getHunterRankMonthKey, isMonthlyRankExamType } from '@/lib/hunter-ranking'
import { validateHunterDraft } from '@/lib/hunter-exam-draft'
import type { Question } from '@/lib/types/question'

/** Read official questions on the server only. Never send answers before submission. */
export async function getServerExamSet(examType: string): Promise<Math1MockSet | null> {
  if (!isMonthlyRankExamType(examType)) return getMath1MockSet(examType)
  // The supplied November set remains fixed and reviewable until its migration.
  const bundled = getMath1MockSet(examType)
  if (bundled) return bundled
  const monthKey = getHunterRankMonthKey(examType)
  if (!monthKey || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null
  const { data, error } = await createAdminClient().from('hunter_rank_exam_sets')
    .select('questions').eq('month_key', monthKey).eq('status', 'published').maybeSingle()
  if (error) throw new Error(`Cannot load Hunter Rank exam set: ${error.message}`)
  if (!data) return null
  if (validateHunterDraft(data.questions).length) throw new Error('Published Hunter Rank exam set is invalid')
  return { type: examType, number: 1, difficulty: 'hard', questions: data.questions as Question[] }
}
