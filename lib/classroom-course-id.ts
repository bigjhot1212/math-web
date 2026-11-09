// Classroom URLs use a base64-encoded numeric ID; the API needs the course ID.
export function classroomApiCourseId(id: string): string {
  if (/^\d+$/.test(id)) return id
  const decoded = Buffer.from(id, 'base64url').toString('utf8')
  if (!/^\d+$/.test(decoded)) throw new Error('Invalid Google Classroom course ID')
  return decoded
}
