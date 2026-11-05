import type { Question } from '@/lib/types/question'

export function sanitizeExamAnswers(value: unknown, maximumEntries = 30): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const entries = Object.entries(value as Record<string, unknown>)
  if (
    entries.length > maximumEntries
    || entries.some(([key, answer]) => key.length > 120 || String(answer ?? '').length > 100)
  ) return null
  return Object.fromEntries(entries.map(([key, answer]) => [key, String(answer ?? '')]))
}

export function normalizeExamAnswer(value: unknown): string {
  return String(value ?? '').trim().replace(/,/g, '').replace(/\s+/g, '').toLowerCase()
}

export function isCorrectExamAnswer(question: Question, value: unknown): boolean {
  const submitted = normalizeExamAnswer(value)
  const accepted = [question.answer, ...(question.acceptedAnswers ?? [])].map(normalizeExamAnswer)
  return submitted.length > 0 && accepted.includes(submitted)
}

export function hasExamAnswer(value: unknown): boolean {
  return normalizeExamAnswer(value).length > 0
}

export function countCorrectExamAnswers(questions: Question[], answers: Record<string, unknown>) {
  return questions.filter(question => isCorrectExamAnswer(question, answers[question.id])).length
}

export function calculateExamPoints(questions: Question[], answers: Record<string, unknown>) {
  const result = questions.reduce((totals, question) => {
    const questionPoints = question.type === 'short-answer' ? 5 : 3
    totals.maximumPoints += questionPoints
    if (isCorrectExamAnswer(question, answers[question.id])) totals.earnedPoints += questionPoints
    else if (hasExamAnswer(answers[question.id])) totals.penaltyPoints += questionPoints
    return totals
  }, { earnedPoints: 0, penaltyPoints: 0, maximumPoints: 0 })
  const rawPoints = result.earnedPoints - result.penaltyPoints
  return {
    ...result,
    rawPoints,
    points: Math.max(0, rawPoints),
  }
}
