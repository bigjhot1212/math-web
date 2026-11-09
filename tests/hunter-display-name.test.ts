import test from 'node:test'
import assert from 'node:assert/strict'
import { hunterDisplayNameAt, isHunterNameAllowed, normalizeHunterDisplayName } from '../lib/hunter-display-name.ts'

test('validates names and removes unsupported characters and identifiers', () => {
  assert.equal(normalizeHunterDisplayName('  นักล่า   เลข  '), 'นักล่า เลข')
  assert.equal(normalizeHunterDisplayName('ab'), null)
  assert.equal(normalizeHunterDisplayName('student@example.com'), null)
  assert.equal(normalizeHunterDisplayName('https://example.com'), null)
  assert.equal(normalizeHunterDisplayName('x'.repeat(25)), null)
})

test('filters clear profanity and common separator evasion without rejecting ordinary names', () => {
  for (const name of ['นักล่าควย', 'ค ว ย', 'Fuck', 'f_u_c_k', 'bitch']) assert.equal(isHunterNameAllowed(name), false, name)
  for (const name of ['นักล่าคณิต', 'Scunthorpe', 'หีบสมบัติ', 'Alice']) assert.equal(isHunterNameAllowed(name), true, name)
})

test('a blocked latest name is hidden rather than falling back to an older name', () => {
  const rows = [{ user_id: 'a', month_key: '2026-10', display_name: 'นักล่า' }, { user_id: 'a', month_key: '2026-11', display_name: 'ควย' }]
  assert.equal(hunterDisplayNameAt(rows, 'a', '2026-10'), 'นักล่า')
  assert.equal(hunterDisplayNameAt(rows, 'a', '2026-11'), null)
})

test('names carry forward while past seasons keep their original name', () => {
  const rows = [
    { user_id: 'a', month_key: '2026-11', display_name: 'แรก' },
    { user_id: 'a', month_key: '2027-01', display_name: 'ใหม่' },
    { user_id: 'b', month_key: '2026-11', display_name: 'อื่น' },
  ]
  assert.equal(hunterDisplayNameAt(rows, 'a', '2026-10'), null)
  assert.equal(hunterDisplayNameAt(rows, 'a', '2026-12'), 'แรก')
  assert.equal(hunterDisplayNameAt(rows, 'a', '2027-01'), 'ใหม่')
})
