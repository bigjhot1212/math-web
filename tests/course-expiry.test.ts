import test from 'node:test'
import assert from 'node:assert/strict'
import { courseEntitlement, courseExpiryAt, hasUnexpiredCourse, purchaseEntitlement } from '../lib/course-expiry.ts'

test('course expires at the same Bangkok time one calendar year later', () => {
  assert.equal(courseExpiryAt('2026-11-13T14:34:11.000Z').toISOString(), '2027-11-13T14:34:11.000Z')
  assert.equal(hasUnexpiredCourse('2026-11-13T14:34:11.000Z', '2027-11-13T14:34:10.999Z'), true)
  assert.equal(hasUnexpiredCourse('2026-11-13T14:34:11.000Z', '2027-11-13T14:34:11.000Z'), false)
})

test('pre-website invite remains lifetime even when claimed after the cutoff', () => {
  assert.deepEqual(purchaseEntitlement({ purchased_at: '2026-11-16T00:00:00Z', payment_method: 'pre_site' }, '2030-01-01T00:00:00Z'), { expiresAt: null, active: true })
})

test('preserves existing purchasers and applies the cutoff at midnight Bangkok', () => {
  assert.deepEqual(courseEntitlement('2026-11-14T16:59:59.999Z', '2030-01-01T00:00:00Z'), { expiresAt: null, active: true })
  const newPurchase = courseEntitlement('2026-11-14T17:00:00.000Z', '2027-11-14T17:00:00.000Z')
  assert.equal(newPurchase.expiresAt?.toISOString(), '2027-11-14T17:00:00.000Z')
  assert.equal(newPurchase.active, false)
})

test('leap day is clamped to February 28 in Bangkok', () => {
  assert.equal(courseExpiryAt('2024-02-28T18:00:00.000Z').toISOString(), '2025-02-27T18:00:00.000Z')
  assert.throws(() => courseExpiryAt('not-a-date'))
})
