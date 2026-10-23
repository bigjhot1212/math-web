import type { Question } from '@/lib/types/question'

export type PremiumQuestionRow = {
  id: string
  exam: string
  exam_year: number | null
  exam_round: string | null
  question_number: number | null
  topic_id: string
  subtopic: string
  difficulty: Question['difficulty']
  type: Question['type']
  content: Question['content']
  answer: string
  accepted_answers: Array<string | number> | null
  hint: string
  solution: Question['solution']
}

export const PREMIUM_QUESTION_COLUMNS =
  'id, exam, exam_year, exam_round, question_number, topic_id, subtopic, difficulty, type, content, answer, accepted_answers, hint, solution'

// Most questions a single practice session loads at once.
export const PREMIUM_SESSION_LIMIT = 60

// Private storage bucket for question images; content.image holds the path inside it.
export const PREMIUM_BUCKET = 'premium'
export const PREMIUM_IMAGE_TTL_SECONDS = 15 * 60

// "PAT1 มี.ค. 2563 ข้อ 12": shown under each question so students know where it came from.
export function premiumSourceLabel(row: Pick<PremiumQuestionRow, 'exam' | 'exam_year' | 'exam_round' | 'question_number'>) {
  return [
    row.exam,
    row.exam_round,
    row.exam_year ? String(row.exam_year) : null,
    row.question_number ? `ข้อ ${row.question_number}` : null,
  ].filter(Boolean).join(' ')
}

export function toPracticeQuestion(row: PremiumQuestionRow): Question {
  return {
    id: row.id,
    topicId: row.topic_id,
    subtopic: row.subtopic,
    level: 'A-Level',
    difficulty: row.difficulty,
    type: row.type,
    content: row.content,
    answer: row.answer,
    acceptedAnswers: row.accepted_answers ?? undefined,
    hint: row.hint,
    solution: row.solution?.steps ? row.solution : { steps: [] },
    tags: ['premium', 'past-exam'],
    source: premiumSourceLabel(row),
  }
}
