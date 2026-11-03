import type { Question } from '@/lib/types/question'

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
