import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateExamPoints, sanitizeExamAnswers } from '../lib/exam-scoring.ts'
import {
  buildHunterStandings,
  buildHunterStandingsFromResults,
  buildHunterImprovementStandings,
  getPreviousMonthKey,
  calculateHunterRating,
  getHunterAlias,
  getHunterRank,
  getHunterRankMonthKey,
  scorePercentage,
  type ExamPerformanceRow,
  type HunterRankResultRow,
} from '../lib/hunter-ranking.ts'
import type { Question } from '../lib/types/question.ts'

const monthKey = '2026-11'

function exam(overrides: Partial<ExamPerformanceRow> = {}): ExamPerformanceRow {
  return {
    user_id: 'user-a',
    exam_type: `hunter-rank-${monthKey}`,
    score: 50,
    total_questions: 100,
    submitted_at: '2026-11-07T01:00:00.000Z',
    ...overrides,
  }
}

function question(id: string, type: Question['type'], answer: string): Question {
  return {
    id,
    topicId: 'set',
    subtopic: 'test',
    level: 'A-Level',
    difficulty: 'medium',
    type,
    content: { text: id },
    answer,
    hint: '',
    solution: { steps: [] },
    tags: [],
  }
}

test('rank thresholds cover F through S exactly', () => {
  assert.equal(getHunterRank(0).code, 'F')
  assert.equal(getHunterRank(39).code, 'F')
  assert.equal(getHunterRank(40).code, 'E')
  assert.equal(getHunterRank(50).code, 'D')
  assert.equal(getHunterRank(60).code, 'C')
  assert.equal(getHunterRank(70).code, 'B')
  assert.equal(getHunterRank(80).code, 'A')
  assert.equal(getHunterRank(90).code, 'S')
  assert.equal(getHunterRank(100).code, 'S')
})

test('rating comes only from the current monthly standard exam', () => {
  const rating = calculateHunterRating([
    exam({ exam_type: 'chapter-basic-01', score: 100 }),
    exam({ exam_type: 'hunter-rank-2026-10', score: 100, submitted_at: '2026-10-15T01:00:00.000Z' }),
    exam({ score: 64 }),
  ], monthKey)
  assert.equal(rating.rating, 64)
  assert.equal(rating.rank.code, 'C')
  assert.equal(rating.eligible, true)
})

test('student without the monthly exam remains unranked', () => {
  const rating = calculateHunterRating([exam({ exam_type: 'chapter-basic-01' })], monthKey)
  assert.equal(rating.rating, null)
  assert.equal(rating.eligible, false)
})

test('ties share the same position without rewarding submission speed', () => {
  const standings = buildHunterStandings([
    exam({ user_id: 'user-b', score: 80, submitted_at: '2026-11-07T03:00:00.000Z' }),
    exam({ user_id: 'user-a', score: 80, submitted_at: '2026-11-07T05:00:00.000Z' }),
    exam({ user_id: 'user-c', score: 70 }),
  ], monthKey)
  assert.deepEqual(standings.map(item => [item.userId, item.position]), [
    ['user-a', 1],
    ['user-b', 1],
    ['user-c', 3],
  ])
})

test('official snapshot standings preserve shared positions', () => {
  const rows: HunterRankResultRow[] = [
    { user_id: 'one', month_key: monthKey, rating: 90, rank_code: 'S', submitted_at: '2026-11-07T01:00:00.000Z' },
    { user_id: 'two', month_key: monthKey, rating: 90, rank_code: 'S', submitted_at: '2026-11-07T02:00:00.000Z' },
    { user_id: 'three', month_key: monthKey, rating: 89, rank_code: 'A', submitted_at: '2026-11-07T03:00:00.000Z' },
  ]
  assert.deepEqual(buildHunterStandingsFromResults(rows, monthKey).map(item => item.position), [1, 1, 3])
})

test('monthly aliases are stable inside a month and rotate next month', () => {
  const first = getHunterAlias('user-a', '2026-11')
  assert.equal(first, getHunterAlias('user-a', '2026-11'))
  assert.notEqual(first, getHunterAlias('user-a', '2026-12'))
})

test('improvement compares consecutive monthly exam scores, including a year boundary', () => {
  assert.equal(getPreviousMonthKey('2027-01'), '2026-12')
  const rows: HunterRankResultRow[] = [
    { user_id: 'a', month_key: '2026-12', rating: 50, rank_code: 'D', submitted_at: '2026-12-04T00:00:00Z' },
    { user_id: 'a', month_key: '2027-01', rating: 70, rank_code: 'B', submitted_at: '2027-01-04T00:00:00Z' },
    { user_id: 'b', month_key: '2027-01', rating: 90, rank_code: 'S', submitted_at: '2027-01-04T00:00:00Z' },
  ]
  assert.deepEqual(buildHunterImprovementStandings(rows, '2027-01').map(row => [row.userId, row.improvement, row.position]), [['a', 20, 1]])
})

test('monthly exam type parsing and percentages reject invalid spillover', () => {
  assert.equal(getHunterRankMonthKey('hunter-rank-2026-11'), '2026-11')
  assert.equal(getHunterRankMonthKey('hunter-rank-2026-13'), null)
  assert.equal(scorePercentage(130, 100), 100)
  assert.equal(scorePercentage(-5, 100), 0)
  assert.equal(scorePercentage(1, 0), 0)
})

test('exam scoring applies +3/-3 and +5/-5, leaves blanks at zero, and clamps the net score', () => {
  const questions = [
    question('mc-correct', 'multiple-choice', 'a'),
    question('mc-wrong', 'multiple-choice', 'b'),
    question('short-correct', 'short-answer', '12'),
    question('short-blank', 'short-answer', '8'),
  ]
  assert.deepEqual(calculateExamPoints(questions, {
    'mc-correct': 'a',
    'mc-wrong': 'a',
    'short-correct': '12',
    'short-blank': '',
  }), {
    earnedPoints: 8,
    penaltyPoints: 3,
    maximumPoints: 16,
    rawPoints: 5,
    points: 5,
  })
  assert.equal(calculateExamPoints(questions, {
    'mc-correct': 'x',
    'mc-wrong': 'x',
    'short-correct': 'x',
    'short-blank': 'x',
  }).points, 0)
})

test('answer payload sanitization rejects oversized and invalid payloads', () => {
  assert.deepEqual(sanitizeExamAnswers({ a: 1, b: ' 2 ' }), { a: '1', b: ' 2 ' })
  assert.equal(sanitizeExamAnswers(null), null)
  assert.equal(sanitizeExamAnswers({ a: '1', b: '2' }, 1), null)
})
