import type { Question } from '@/lib/types/question'
import { setChallengeQuestions } from '@/lib/content/set-challenge'
import { logicChallengeQuestions } from '@/lib/content/logic-challenge'
import { realNumbersChallengeQuestions } from '@/lib/content/real-numbers-challenge'
import { relationsFunctionsChallengeQuestions } from '@/lib/content/relations-functions-challenge'
import { exponentialLogarithmChallengeQuestions } from '@/lib/content/exponential-logarithm-challenge'
import { analyticGeometryConicsChallengeQuestions } from '@/lib/content/analytic-geometry-conics-challenge'
import { trigonometryChallengeQuestions } from '@/lib/content/trigonometry-challenge'
import { matrixChallengeQuestions } from '@/lib/content/matrix-challenge'
import { vectorChallengeQuestions } from '@/lib/content/vector-challenge'
import { complexNumbersChallengeQuestions } from '@/lib/content/complex-numbers-challenge'
import { countingProbabilityChallengeQuestions } from '@/lib/content/counting-probability-challenge'
import { sequencesSeriesChallengeQuestions } from '@/lib/content/sequences-series-challenge'
import { calculusChallengeQuestions } from '@/lib/content/calculus-challenge'
import { statisticsDistributionsChallengeQuestions } from '@/lib/content/statistics-distributions-challenge'

const banks: Record<string, Question[]> = {
  set: setChallengeQuestions,
  logic: logicChallengeQuestions,
  'real-numbers': realNumbersChallengeQuestions,
  'relations-functions': relationsFunctionsChallengeQuestions,
  'exponential-logarithm': exponentialLogarithmChallengeQuestions,
  'analytic-geometry-conics': analyticGeometryConicsChallengeQuestions,
  trigonometry: trigonometryChallengeQuestions,
  matrix: matrixChallengeQuestions,
  vector: vectorChallengeQuestions,
  'complex-numbers': complexNumbersChallengeQuestions,
  'counting-probability': countingProbabilityChallengeQuestions,
  'sequences-series': sequencesSeriesChallengeQuestions,
  calculus: calculusChallengeQuestions,
  'statistics-distributions': statisticsDistributionsChallengeQuestions,
}

export type Math1MockDifficulty = 'medium' | 'hard' | 'very-hard'
export type Math1MockSet = {
  type: string
  number: number
  difficulty: Math1MockDifficulty
  questions: Question[]
}

const configs: Math1MockDifficulty[] = [
  'medium', 'medium', 'medium', 'medium', 'medium',
  'hard', 'hard', 'hard',
  'very-hard', 'very-hard',
]

const blueprint = [
  {
    topics: ['set', 'logic', 'real-numbers', 'relations-functions', 'exponential-logarithm', 'trigonometry', 'complex-numbers', 'matrix', 'sequences-series'],
    multipleChoice: 14,
    shortAnswer: 2,
  },
  { topics: ['analytic-geometry-conics', 'vector'], multipleChoice: 3, shortAnswer: 1 },
  { topics: ['counting-probability', 'statistics-distributions'], multipleChoice: 6, shortAnswer: 1 },
  { topics: ['calculus'], multipleChoice: 2, shortAnswer: 1 },
]

function correctChoiceText(question: Question): string | null {
  if (!question.content.choices || typeof question.answer !== 'string') return null
  if (!['a', 'b', 'c', 'd', 'e'].includes(question.answer)) return null
  return question.content.choices[question.answer as keyof typeof question.content.choices]
}

function normalizeNumericAnswer(value: string): string {
  return value.trim().replace(/^\$|\$$/g, '').replace(/,/g, '').replace(/\\,/g, '')
}

function isPlainNumericQuestion(question: Question): boolean {
  const answer = correctChoiceText(question)
  return answer !== null && /^-?\d+(?:\.\d+)?$/.test(normalizeNumericAnswer(answer))
}

function orderedCandidates(topics: string[], difficulty: Math1MockDifficulty, seed: number): Question[] {
  const byTopic = topics.map((topic, topicIndex) => {
    const bank = banks[topic] ?? []
    const medium = bank.filter(question => question.difficulty === 'medium')
    const hard = bank.filter(question => question.difficulty === 'hard')
    const primary = difficulty === 'medium' ? medium : hard
    const secondary = difficulty === 'medium' ? hard : medium
    const ordered: Question[] = []
    const primaryStride = difficulty === 'very-hard' ? 4 : 2
    for (let i = 0; i < Math.max(primary.length, secondary.length); i++) {
      for (let repeat = 0; repeat < primaryStride; repeat++) {
        const question = primary[i * primaryStride + repeat]
        if (question) ordered.push(question)
      }
      if (difficulty !== 'very-hard' && secondary[i]) ordered.push(secondary[i])
    }
    for (const question of [...primary, ...secondary]) {
      if (!ordered.some(item => item.id === question.id)) ordered.push(question)
    }
    if (!ordered.length) return []
    const shift = (seed * 7 + topicIndex * 11) % ordered.length
    return [...ordered.slice(shift), ...ordered.slice(0, shift)]
  })

  const result: Question[] = []
  const maxLength = Math.max(...byTopic.map(items => items.length))
  for (let row = 0; row < maxLength; row++) {
    for (let topicIndex = 0; topicIndex < byTopic.length; topicIndex++) {
      const items = byTopic[(topicIndex + seed) % byTopic.length]
      if (row < items.length) result.push(items[row])
    }
  }
  return result
}

function takeQuestions(
  topics: string[],
  count: number,
  difficulty: Math1MockDifficulty,
  seed: number,
  used: Set<string>,
  predicate: (question: Question) => boolean,
): Question[] {
  const selected: Question[] = []
  for (const question of orderedCandidates(topics, difficulty, seed)) {
    if (used.has(question.id) || !predicate(question)) continue
    used.add(question.id)
    selected.push(question)
    if (selected.length === count) return selected
  }
  throw new Error(`Unable to build mock set ${seed}: requested ${count} questions`)
}

function cloneQuestion(question: Question, setNumber: number, index: number, shortAnswer: boolean): Question {
  const prefix = `math1-mock-${String(setNumber).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`
  if (!shortAnswer) return { ...question, id: prefix, tags: [...question.tags, 'mock-exam'] }

  const correctText = correctChoiceText(question)
  if (!correctText) throw new Error(`Short-answer source has no correct choice: ${question.id}`)
  return {
    ...question,
    id: prefix,
    type: 'short-answer',
    content: { text: question.content.text, image: question.content.image },
    answer: normalizeNumericAnswer(correctText),
    tags: [...question.tags, 'mock-exam', 'numeric-response'],
  }
}

function buildSet(number: number, difficulty: Math1MockDifficulty, used: Set<string>): Math1MockSet {
  const multipleChoice: Question[] = []
  const shortAnswer: Question[] = []

  for (const [categoryIndex, category] of blueprint.entries()) {
    shortAnswer.push(...takeQuestions(
      category.topics,
      category.shortAnswer,
      difficulty,
      number * 13 + categoryIndex,
      used,
      isPlainNumericQuestion,
    ))
    multipleChoice.push(...takeQuestions(
      category.topics,
      category.multipleChoice,
      difficulty,
      number * 17 + categoryIndex,
      used,
      () => true,
    ))
  }

  const questions = [
    ...multipleChoice.map((question, index) => cloneQuestion(question, number, index, false)),
    ...shortAnswer.map((question, index) => cloneQuestion(question, number, 25 + index, true)),
  ]
  if (questions.length !== 30) throw new Error(`Mock set ${number} has ${questions.length} questions`)
  if (questions.filter(question => question.type === 'multiple-choice').length !== 25) throw new Error(`Mock set ${number} must have 25 multiple-choice questions`)
  if (questions.filter(question => question.type === 'short-answer').length !== 5) throw new Error(`Mock set ${number} must have 5 short-answer questions`)

  return { type: `math1-mock-${String(number).padStart(2, '0')}`, number, difficulty, questions }
}

const globallyUsedSourceIds = new Set<string>()
export const math1MockSets: Math1MockSet[] = configs.map((difficulty, index) => buildSet(index + 1, difficulty, globallyUsedSourceIds))
if (globallyUsedSourceIds.size !== 300) throw new Error(`Expected 300 unique source questions, received ${globallyUsedSourceIds.size}`)
export const allMath1MockQuestions: Question[] = math1MockSets.flatMap(set => set.questions)

const allIds = new Set<string>()
for (const set of math1MockSets) {
  const categoryCounts = blueprint.map(category => set.questions.filter(question => category.topics.includes(question.topicId)).length)
  if (categoryCounts.join(',') !== '16,4,7,3') throw new Error(`Mock set ${set.number} violates the official content blueprint`)
  for (const question of set.questions) {
    if (allIds.has(question.id)) throw new Error(`Duplicate mock question id: ${question.id}`)
    allIds.add(question.id)
    if (question.type === 'short-answer' && !/^-?\d+(?:\.\d+)?$/.test(String(question.answer))) {
      throw new Error(`Mock short-answer question is not numeric: ${question.id}`)
    }
  }
}

export function getMath1MockSet(examType: string): Math1MockSet | null {
  return math1MockSets.find(set => set.type === examType) ?? null
}
