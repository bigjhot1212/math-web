/** One calendar year after activation, preserving local time in Bangkok. */
export function courseExpiryAt(activatedAt: string | Date): Date {
  const date = new Date(activatedAt)
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid course activation date')
  const bangkok = new Date(date.getTime() + 7 * 60 * 60 * 1000)
  const day = bangkok.getUTCDate()
  bangkok.setUTCDate(1)
  bangkok.setUTCFullYear(bangkok.getUTCFullYear() + 1)
  const lastDay = new Date(Date.UTC(bangkok.getUTCFullYear(), bangkok.getUTCMonth() + 1, 0)).getUTCDate()
  bangkok.setUTCDate(Math.min(day, lastDay))
  return new Date(bangkok.getTime() - 7 * 60 * 60 * 1000)
}

export function hasUnexpiredCourse(activatedAt: string | Date, now: string | Date = new Date()): boolean {
  const at = new Date(now)
  if (!Number.isFinite(at.getTime())) throw new Error('Invalid current date')
  return at.getTime() < courseExpiryAt(activatedAt).getTime()
}

// Purchases activated before 15 November 2026, 00:00 Bangkok retain lifetime access.
export const COURSE_EXPIRY_POLICY_START = '2026-11-14T17:00:00.000Z'

export function courseEntitlement(activatedAt: string | Date, now: string | Date = new Date()): { expiresAt: Date | null; active: boolean } {
  const activated = new Date(activatedAt)
  const current = new Date(now)
  if (!Number.isFinite(activated.getTime()) || !Number.isFinite(current.getTime())) throw new Error('Invalid entitlement date')
  if (activated.getTime() < new Date(COURSE_EXPIRY_POLICY_START).getTime()) return { expiresAt: null, active: true }
  const expiresAt = courseExpiryAt(activated)
  return { expiresAt, active: current.getTime() < expiresAt.getTime() }
}

export type CoursePurchase = { purchased_at: string; payment_method: string | null }

/** Invitations for students who purchased before the website existed retain their original access. */
export function purchaseEntitlement(purchase: CoursePurchase, now: string | Date = new Date()): { expiresAt: Date | null; active: boolean } {
  if (purchase.payment_method === 'pre_site') return { expiresAt: null, active: true }
  return courseEntitlement(purchase.purchased_at, now)
}
