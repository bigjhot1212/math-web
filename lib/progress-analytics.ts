export type ProgressAttempt = {
  topic_id: string
  question_id?: string | null
  is_correct: boolean
  time_spent_seconds?: number | null
  answered_at?: string | null
}

export type LearningStatus =
  | 'strong'
  | 'accurate-slow'
  | 'fast-inaccurate'
  | 'needs-practice'
  | 'collecting'

export type TopicPerformance = {
  topicId: string
  correct: number
  total: number
  accuracy: number
  timedAnswers: number
  medianSeconds: number | null
  status: LearningStatus
  statusLabel: string
  priority: number
}

const TARGET_SECONDS_PER_QUESTION = 180
const MIN_SAMPLE_SIZE = 5
const MAX_REASONABLE_SECONDS = 7_200

const STATUS_LABELS: Record<LearningStatus, string> = {
  strong: 'แม่นและทันเวลา',
  'accurate-slow': 'แม่นแล้ว เพิ่มความเร็ว',
  'fast-inaccurate': 'เร็วดี เพิ่มความแม่น',
  'needs-practice': 'ควรทบทวนและฝึกเพิ่ม',
  collecting: 'กำลังเก็บข้อมูล',
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? Math.round((sorted[middle - 1] + sorted[middle]) / 2)
    : sorted[middle]
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return '—'
  if (seconds < 60) return `${seconds} วินาที`
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return remainder > 0 ? `${minutes} นาที ${remainder} วินาที` : `${minutes} นาที`
}

export function formatCompactDuration(seconds: number | null): string {
  if (seconds === null) return '—'
  if (seconds < 60) return `${seconds} วินาที`
  const minutes = Math.floor(seconds / 60)
  const remainder = String(seconds % 60).padStart(2, '0')
  return `${minutes}:${remainder} นาที`
}

export function getValidTimes(rows: ProgressAttempt[]): number[] {
  return rows
    .map(row => row.time_spent_seconds)
    .filter((value): value is number => (
      typeof value === 'number'
      && Number.isFinite(value)
      && value > 0
      && value <= MAX_REASONABLE_SECONDS
    ))
}

export function deduplicateAttempts<T extends ProgressAttempt>(rows: T[]): T[] {
  const sorted = [...rows].sort((a, b) => Date.parse(a.answered_at ?? '') - Date.parse(b.answered_at ?? ''))
  const latestByQuestion = new Map<string, T>()
  const accepted = new Set<T>()

  for (const row of sorted) {
    if (!row.question_id || !row.answered_at) {
      accepted.add(row)
      continue
    }
    const key = `${row.topic_id}:${row.question_id}:${row.is_correct}`
    const previous = latestByQuestion.get(key)
    const secondsSincePrevious = previous?.answered_at
      ? (Date.parse(row.answered_at) - Date.parse(previous.answered_at)) / 1000
      : Number.POSITIVE_INFINITY
    if (previous && secondsSincePrevious >= 0 && secondsSincePrevious <= 30) continue
    latestByQuestion.set(key, row)
    accepted.add(row)
  }

  return rows.filter(row => accepted.has(row))
}

export function analyzeTopic(topicId: string, rows: ProgressAttempt[]): TopicPerformance {
  const total = rows.length
  const correct = rows.filter(row => row.is_correct).length
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
  const times = getValidTimes(rows)
  const medianSeconds = median(times)

  let status: LearningStatus
  if (total < MIN_SAMPLE_SIZE || times.length < Math.min(3, total)) {
    status = 'collecting'
  } else if (accuracy >= 80 && medianSeconds !== null && medianSeconds <= TARGET_SECONDS_PER_QUESTION) {
    status = 'strong'
  } else if (accuracy >= 80) {
    status = 'accurate-slow'
  } else if (accuracy >= 60 && medianSeconds !== null && medianSeconds <= TARGET_SECONDS_PER_QUESTION) {
    status = 'fast-inaccurate'
  } else {
    status = 'needs-practice'
  }

  const statusPriority: Record<LearningStatus, number> = {
    'needs-practice': 0,
    'fast-inaccurate': 1,
    'accurate-slow': 2,
    collecting: 3,
    strong: 4,
  }

  return {
    topicId,
    correct,
    total,
    accuracy,
    timedAnswers: times.length,
    medianSeconds,
    status,
    statusLabel: STATUS_LABELS[status],
    priority: statusPriority[status],
  }
}

export function getTopicPerformances(rows: ProgressAttempt[]): TopicPerformance[] {
  const grouped = new Map<string, ProgressAttempt[]>()
  for (const row of rows) {
    const topicRows = grouped.get(row.topic_id) ?? []
    topicRows.push(row)
    grouped.set(row.topic_id, topicRows)
  }
  return Array.from(grouped, ([topicId, topicRows]) => analyzeTopic(topicId, topicRows))
}
