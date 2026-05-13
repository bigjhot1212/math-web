export type UserProgress = {
  id: string
  userId: string
  questionId: string
  topicId: string
  isCorrect: boolean
  timeSpentSeconds: number
  answeredAt: string
  hintUsed: boolean
}

export type ExamSession = {
  id: string
  userId: string
  examType: string
  questionIds: string[]
  answers: Record<string, string>
  startedAt: string
  submittedAt?: string
  score?: number
  totalQuestions: number
}