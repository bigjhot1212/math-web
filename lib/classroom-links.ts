import 'server-only'

const CLASSROOM_JOIN_CODES: Record<string, string> = {
  'foundation-high-school': 'qdr4pulu',
  'a-level-math-1-intensive': 'ivyw5npe',
  'sequences-series': 'bvlnqxkk',
  'calculus': 'zs2mqktf',
  'statistics-distributions': 'qyxhljqq',
}

export function getClassroomJoinCode(topicId: string) {
  return CLASSROOM_JOIN_CODES[topicId] ?? null
}

export function getClassroomUrl(topicId: string, classroomId?: string) {
  if (!classroomId) return null
  const url = new URL(`https://classroom.google.com/c/${classroomId}`)
  const joinCode = getClassroomJoinCode(topicId)
  if (joinCode) url.searchParams.set('cjc', joinCode)
  return url.toString()
}
