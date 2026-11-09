import test from 'node:test'
import assert from 'node:assert/strict'
import { classroomApiCourseId } from '../lib/classroom-course-id.ts'

test('converts classroom URL IDs to API IDs and preserves numeric IDs', () => {
  assert.equal(classroomApiCourseId('ODY0MjE2NjIwMTQ1'), '864216620145')
  assert.equal(classroomApiCourseId('864216620145'), '864216620145')
  assert.throws(() => classroomApiCourseId('not-a-course-id'))
})
