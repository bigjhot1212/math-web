import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { validateHunterDraft } from '../lib/hunter-exam-draft.ts'

test('checks the supplied set and catches invalid structure and duplicate ids', () => {
  const questions = JSON.parse(readFileSync(new URL('../content/hunter-rank/set-01.json', import.meta.url), 'utf8'))
  assert.deepEqual(validateHunterDraft(questions), [])
  questions[1].id = questions[0].id
  questions[0].content.choices.a = ''
  questions[29].answer = 'not a number'
  const issues = validateHunterDraft(questions)
  assert.ok(issues.some(issue => issue.question === 2 && issue.message.includes('ซ้ำ')))
  assert.ok(issues.some(issue => issue.question === 1 && issue.message.includes('ตัวเลือก')))
  assert.ok(issues.some(issue => issue.question === 30 && issue.message.includes('ตัวเลข')))
})
