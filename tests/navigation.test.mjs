import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'

const source = readFileSync(new URL('../lib/navigation.ts', import.meta.url), 'utf8')
const { DEFAULT_STUDENT_DESTINATION, getNavigationMode, showFloatingSupport } = await import(
  `data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(source)).toString('base64')}`
)

assert.equal(DEFAULT_STUDENT_DESTINATION, '/dashboard')
for (const signedIn of [true, false]) {
  for (const path of ['/practice/calculus', '/premium/practice', '/exam/test-id']) assert.equal(getNavigationMode(path, signedIn), 'session', path)
  for (const path of ['/admin/students', '/admin/students/user-id', '/admin/bank-transfers', '/admin/premium']) assert.equal(getNavigationMode(path, signedIn), 'admin', path)
  for (const path of ['/', '/pricing', '/checkout', '/privacy', '/login', '/onboarding']) assert.equal(getNavigationMode(path, signedIn), 'public', path)
}
for (const path of ['/dashboard', '/practice', '/exam', '/exam/test-id/result', '/treasure', '/treasure/calculus-formula-guide', '/courses', '/course/calculus', '/profile']) {
  assert.equal(getNavigationMode(path, true), 'student', path)
  assert.equal(getNavigationMode(path, false), 'public', path)
}
for (const path of ['/', '/pricing', '/cart', '/checkout', '/pricing/success']) assert.equal(showFloatingSupport(path), true, path)
for (const path of ['/practice', '/practice/calculus', '/exam/id', '/treasure', '/admin/students', '/login']) assert.equal(showFloatingSupport(path), false, path)
assert.equal(getNavigationMode('/practice-extra', true), 'public')
assert.equal(getNavigationMode('/administrator', true), 'public')
console.log('Navigation and default destination checks passed')
