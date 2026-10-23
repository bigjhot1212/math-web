import 'server-only'

import fs from 'fs'
import path from 'path'
import { allMath1MockQuestions } from '@/lib/content/math1-mock-sets'
import { originalPracticeQuestions, legacySetPracticeQuestions } from '@/lib/content/original-practice'
import { setChallengeQuestions } from '@/lib/content/set-challenge'
import type { Question } from '@/lib/types/question'

let cachedCatalog: Map<string, Question> | null = null

export function getQuestionCatalog(): Map<string, Question> {
  if (cachedCatalog) return cachedCatalog

  const directory = path.join(process.cwd(), 'content', 'questions')
  const fileQuestions = fs.readdirSync(directory)
    .filter(file => file.endsWith('.json'))
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf-8')) as Question[])

  const questions = fileQuestions.concat(
    originalPracticeQuestions,
    legacySetPracticeQuestions,
    setChallengeQuestions,
    allMath1MockQuestions,
  )

  cachedCatalog = new Map(questions.map(question => [question.id, question]))
  return cachedCatalog
}

function normalizeAnswer(value: unknown): string {
  return String(value ?? '').trim().replace(/,/g, '').replace(/\s+/g, '').toLowerCase()
}

export function isCorrectQuestionAnswer(question: Question, value: unknown): boolean {
  const submitted = normalizeAnswer(value)
  const accepted = [question.answer, ...(question.acceptedAnswers ?? [])].map(normalizeAnswer)
  return submitted.length > 0 && accepted.includes(submitted)
}
