import test from 'node:test'
import assert from 'node:assert/strict'
import { QUESTIONS } from '../app/(public)/practice/formula-game/questions.ts'

test('every question has a reachable final step and valid unique dependencies', () => {
  assert.equal(new Set(QUESTIONS.map(q => q.id)).size, QUESTIONS.length)
  for (const q of QUESTIONS) {
    const ids = new Set(q.steps.map(step => step.id))
    assert.equal(ids.size, q.steps.length, q.id)
    assert.ok(ids.has(q.finish), q.id)
    for (const step of q.steps) for (const dependency of step.requires ?? []) assert.ok(ids.has(dependency), `${q.id}: ${dependency}`)
    const reached = new Set<string>()
    for (let i = 0; i < q.steps.length; i++) for (const step of q.steps) if ((step.requires ?? []).every(id => reached.has(id))) reached.add(step.id)
    assert.ok(reached.has(q.finish), q.id)
  }
})

test('independent steps do not force a single order', () => {
  const tangent = QUESTIONS.find(q => q.id === 'm5')!
  assert.deepEqual(tangent.steps.find(s => s.id === 'point')?.requires ?? [], [])
  assert.deepEqual(tangent.steps.find(s => s.id === 'diff')?.requires ?? [], [])
  assert.deepEqual(new Set(tangent.steps.find(s => s.id === 'line')?.requires), new Set(['point', 'slope']))
  const continuity = QUESTIONS.find(q => q.id === 'c1')!
  for (const id of ['left', 'right', 'value']) assert.deepEqual(continuity.steps.find(s => s.id === id)?.requires ?? [], [])
})
