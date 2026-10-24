import 'server-only'

const CLASSROOM_JOIN_CODES: Record<string, string> = {
  'a-level-math-1-intensive': 'ivyw5npe',
}

export function getClassroomUrl(topicId: string, classroomId?: string) {
  if (!classroomId) return null
  const url = new URL(`https://classroom.google.com/c/${classroomId}`)
  const joinCode = CLASSROOM_JOIN_CODES[topicId]
  if (joinCode) url.searchParams.set('cjc', joinCode)
  return url.toString()
}
