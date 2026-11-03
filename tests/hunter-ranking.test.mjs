import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'

const source = readFileSync(new URL('../lib/hunter-ranking.ts', import.meta.url), 'utf8')
const ranking = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`)

const month = '2026-10'
const monthlyType = ranking.getMonthlyRankExamType(month)
const exam = (user_id, exam_type, score, total_questions, submitted_at = '2026-10-10T03:00:00.000Z') => ({ user_id, exam_type, score, total_questions, submitted_at })
const practice = (user_id, question_id, is_correct, answered_at = '2026-10-12T03:00:00.000Z') => ({ user_id, question_id, is_correct, answered_at })

assert.equal(monthlyType, 'hunter-rank-2026-10')
assert.equal(ranking.isMonthlyRankExamType(monthlyType), true)
assert.equal(ranking.isMonthlyRankExamType('hunter-rank-2026-13'), false)
assert.deepEqual(ranking.getMonthDateRange(month), {
  start: '2026-09-30T17:00:00.000Z',
  end: '2026-10-31T17:00:00.000Z',
})

const missingStandard = ranking.calculateHunterRating([
  exam('a', 'math1-mock-01', 30, 30),
], [], month)
assert.equal(missingStandard.rating, null)
assert.equal(missingStandard.eligible, false)

const baselineRating = ranking.calculateHunterRating([
  exam('a', monthlyType, 24, 30),
], [], month)
assert.equal(baselineRating.baseline, 80)
assert.equal(baselineRating.rating, 80)
assert.equal(baselineRating.rank.code, 'A')
assert.equal(baselineRating.eligible, true)

const strongPractice = Array.from({ length: 30 }, (_, index) => practice('a', `q-${index}`, index < 27))
const improvedRating = ranking.calculateHunterRating([
  exam('a', monthlyType, 24, 30),
], strongPractice, month)
assert.equal(improvedRating.practiceAccuracy, 90)
assert.equal(improvedRating.activityAdjustment, 3)
assert.equal(improvedRating.rating, 83)

const supportingRating = ranking.calculateHunterRating([
  exam('a', monthlyType, 24, 30),
  exam('a', 'math1-mock-01', 27, 30),
], strongPractice, month)
assert.equal(supportingRating.activityAdjustment, 4)
assert.equal(supportingRating.rating, 84)

const repeatedPractice = [
  practice('a', 'repeat', false, '2026-10-01T03:00:00.000Z'),
  practice('a', 'repeat', true, '2026-10-02T03:00:00.000Z'),
  ...Array.from({ length: 19 }, (_, index) => practice('a', `unique-${index}`, true)),
]
const deduplicated = ranking.calculateHunterRating([exam('a', monthlyType, 15, 30)], repeatedPractice, month)
assert.equal(deduplicated.practiceCount, 20)
assert.equal(deduplicated.practiceAccuracy, 100)
assert.equal(deduplicated.activityAdjustment, 2)

const standings = ranking.buildHunterStandings([
  exam('a', monthlyType, 24, 30, '2026-10-10T03:00:00.000Z'),
  exam('b', monthlyType, 27, 30, '2026-10-11T03:00:00.000Z'),
  exam('c', 'math1-mock-01', 30, 30),
], strongPractice, month)
assert.deepEqual(standings.map(item => item.userId), ['b', 'a'])
assert.deepEqual(standings.map(item => item.position), [1, 2])

assert.equal(ranking.getHunterAlias('same-user'), ranking.getHunterAlias('same-user'))
assert.notEqual(ranking.getHunterAlias('same-user'), ranking.getHunterAlias('other-user'))
assert.equal(ranking.getHunterRank(39).code, 'F')
assert.equal(ranking.getHunterRank(40).code, 'E')
assert.equal(ranking.getHunterRank(49).code, 'E')
assert.equal(ranking.getHunterRank(50).code, 'D')
assert.equal(ranking.getHunterRank(60).code, 'C')
assert.equal(ranking.getHunterRank(70).code, 'B')
assert.equal(ranking.getHunterRank(80).code, 'A')
assert.equal(ranking.getHunterRank(90).code, 'S')
assert.equal(ranking.getHunterRank(100).code, 'S')

console.log('Monthly baseline, activity adjustment, eligibility, privacy aliases and F–S thresholds passed')
