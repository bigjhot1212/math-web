import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'

const source = readFileSync(new URL('../lib/exam-scoring.ts', import.meta.url), 'utf8')
const scoring = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`)

const question = (id, type, answer, acceptedAnswers = []) => ({ id, type, answer, acceptedAnswers })
const questions = [
  question('mc-correct', 'multiple-choice', 'a'),
  question('mc-wrong', 'multiple-choice', 'b'),
  question('mc-empty', 'multiple-choice', 'c'),
  question('short-correct', 'short-answer', '12'),
  question('short-wrong', 'short-answer', '9'),
]

const result = scoring.calculateExamPoints(questions, {
  'mc-correct': 'A',
  'mc-wrong': 'd',
  'short-correct': '12',
  'short-wrong': '8',
})

assert.deepEqual(result, {
  earnedPoints: 8,
  penaltyPoints: 8,
  maximumPoints: 19,
  rawPoints: 0,
  points: 0,
})
assert.equal(scoring.calculateExamPoints([questions[1]], { 'mc-wrong': 'a' }).points, 0)
assert.equal(scoring.calculateExamPoints([questions[2]], {}).penaltyPoints, 0)
assert.equal(scoring.calculateExamPoints([questions[3]], { 'short-correct': ' 12 ' }).points, 5)

console.log('Monthly exam scoring awards, penalties, blanks and zero floor passed')
