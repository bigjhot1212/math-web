export type ExamPerformanceRow = {
  user_id: string
  exam_type: string
  score: number
  total_questions: number
  submitted_at: string | null
}

export type PracticePerformanceRow = {
  user_id: string
  question_id: string
  is_correct: boolean
  answered_at: string
}

export type HunterRankCode = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export type HunterRank = {
  code: HunterRankCode
  name: string
  minimumRating: number
}

export type HunterRating = {
  rating: number | null
  baseline: number | null
  activityAdjustment: number
  rank: HunterRank
  eligible: boolean
  practiceCount: number
  practiceAccuracy: number | null
  supportingExamCount: number
  standardSubmittedAt: string | null
}

export type HunterStanding = HunterRating & {
  userId: string
  position: number
}

export const HUNTER_RANKS: HunterRank[] = [
  { code: 'F', name: 'ผู้เริ่มต้น', minimumRating: 0 },
  { code: 'E', name: 'นักสำรวจ', minimumRating: 40 },
  { code: 'D', name: 'นักฝึกหัด', minimumRating: 50 },
  { code: 'C', name: 'นักแกะรอย', minimumRating: 60 },
  { code: 'B', name: 'ฮันเตอร์ชำนาญ', minimumRating: 70 },
  { code: 'A', name: 'ฮันเตอร์ชั้นสูง', minimumRating: 80 },
  { code: 'S', name: 'ฮันเตอร์ระดับสูงสุด', minimumRating: 90 },
]

const MONTHLY_EXAM_PATTERN = /^hunter-rank-(\d{4})-(0[1-9]|1[0-2])$/
const MAX_ACTIVITY_ADJUSTMENT = 5

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

function scorePercentage(row: ExamPerformanceRow) {
  return row.total_questions > 0 ? Math.round((row.score / row.total_questions) * 100) : 0
}

export function getBangkokMonthKey(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(date)
  const year = parts.find(part => part.type === 'year')?.value
  const month = parts.find(part => part.type === 'month')?.value
  if (!year || !month) throw new Error('Unable to determine Bangkok month')
  return `${year}-${month}`
}

export function getMonthDateRange(monthKey: string) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(monthKey)
  if (!match) throw new Error(`Invalid month key: ${monthKey}`)
  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const start = new Date(Date.UTC(year, monthIndex, 1) - 7 * 60 * 60 * 1000)
  const end = new Date(Date.UTC(year, monthIndex + 1, 1) - 7 * 60 * 60 * 1000)
  return { start: start.toISOString(), end: end.toISOString() }
}

export function getMonthlyRankExamType(monthKey = getBangkokMonthKey()) {
  return `hunter-rank-${monthKey}`
}

export function isMonthlyRankExamType(examType: string) {
  return MONTHLY_EXAM_PATTERN.test(examType)
}

export function getHunterRank(rating: number | null): HunterRank {
  const safeRating = rating === null ? 0 : clamp(rating, 0, 100)
  return [...HUNTER_RANKS].reverse().find(rank => safeRating >= rank.minimumRating) ?? HUNTER_RANKS[0]
}

export function getNextHunterRank(rank: HunterRank) {
  const index = HUNTER_RANKS.findIndex(item => item.code === rank.code)
  return index >= 0 ? HUNTER_RANKS[index + 1] ?? null : null
}

export function getRankProgress(rating: number | null, rank: HunterRank) {
  if (rating === null) return 0
  const next = getNextHunterRank(rank)
  if (!next) return 100
  return clamp(Math.round(((rating - rank.minimumRating) / (next.minimumRating - rank.minimumRating)) * 100), 0, 100)
}

function withinMonth(value: string | null, range: { start: string; end: string }) {
  return Boolean(value && value >= range.start && value < range.end)
}

function selectLatestPractice(rows: PracticePerformanceRow[], range: { start: string; end: string }) {
  const latest = new Map<string, PracticePerformanceRow>()
  for (const row of rows) {
    if (!withinMonth(row.answered_at, range)) continue
    const current = latest.get(row.question_id)
    if (!current || row.answered_at > current.answered_at) latest.set(row.question_id, row)
  }
  return [...latest.values()]
}

export function calculateHunterRating(
  exams: ExamPerformanceRow[],
  practice: PracticePerformanceRow[] = [],
  monthKey = getBangkokMonthKey(),
): HunterRating {
  const monthlyType = getMonthlyRankExamType(monthKey)
  const range = getMonthDateRange(monthKey)
  const standardExam = exams
    .filter(row => row.exam_type === monthlyType && withinMonth(row.submitted_at, range))
    .sort((a, b) => (b.submitted_at ?? '').localeCompare(a.submitted_at ?? ''))[0]

  if (!standardExam) {
    return {
      rating: null,
      baseline: null,
      activityAdjustment: 0,
      rank: getHunterRank(null),
      eligible: false,
      practiceCount: 0,
      practiceAccuracy: null,
      supportingExamCount: 0,
      standardSubmittedAt: null,
    }
  }

  const baseline = scorePercentage(standardExam)
  const monthlyPractice = selectLatestPractice(practice, range)
  const practiceCount = monthlyPractice.length
  const practiceAccuracy = practiceCount > 0
    ? Math.round((monthlyPractice.filter(row => row.is_correct).length / practiceCount) * 100)
    : null
  let adjustment = 0

  if (practiceCount >= 20 && practiceAccuracy !== null) {
    if (practiceAccuracy >= 85) adjustment += 2
    else if (practiceAccuracy >= 70) adjustment += 1
    else if (practiceAccuracy < 50) adjustment -= 2
    else if (practiceAccuracy < 60) adjustment -= 1

    if (practiceAccuracy >= 60) {
      if (practiceCount >= 80) adjustment += 2
      else if (practiceCount >= 30) adjustment += 1
    }
  }

  const supportingExams = exams
    .filter(row => row.exam_type !== monthlyType)
    .filter(row => !row.exam_type.startsWith('basic-diagnostic'))
    .filter(row => withinMonth(row.submitted_at, range))
    .sort((a, b) => (b.submitted_at ?? '').localeCompare(a.submitted_at ?? ''))
    .slice(0, 3)
  if (supportingExams.length > 0) {
    const totalCorrect = supportingExams.reduce((sum, row) => sum + row.score, 0)
    const totalQuestions = supportingExams.reduce((sum, row) => sum + row.total_questions, 0)
    const supportingAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    if (supportingAccuracy >= baseline + 5) adjustment += 1
    else if (supportingAccuracy <= baseline - 10) adjustment -= 1
  }

  const activityAdjustment = clamp(adjustment, -MAX_ACTIVITY_ADJUSTMENT, MAX_ACTIVITY_ADJUSTMENT)
  const rating = clamp(baseline + activityAdjustment, 0, 100)
  return {
    rating,
    baseline,
    activityAdjustment,
    rank: getHunterRank(rating),
    eligible: true,
    practiceCount,
    practiceAccuracy,
    supportingExamCount: supportingExams.length,
    standardSubmittedAt: standardExam.submitted_at,
  }
}

export function buildHunterStandings(
  exams: ExamPerformanceRow[],
  practice: PracticePerformanceRow[] = [],
  monthKey = getBangkokMonthKey(),
): HunterStanding[] {
  const userIds = new Set(exams.map(row => row.user_id))
  const standings = [...userIds].flatMap(userId => {
    const rating = calculateHunterRating(
      exams.filter(row => row.user_id === userId),
      practice.filter(row => row.user_id === userId),
      monthKey,
    )
    return rating.eligible && rating.rating !== null ? [{ userId, ...rating }] : []
  })
  standings.sort((a, b) =>
    (b.rating ?? 0) - (a.rating ?? 0)
    || (b.baseline ?? 0) - (a.baseline ?? 0)
    || b.practiceCount - a.practiceCount
    || (b.standardSubmittedAt ?? '').localeCompare(a.standardSubmittedAt ?? '')
    || a.userId.localeCompare(b.userId)
  )
  return standings.map((standing, index) => ({ ...standing, position: index + 1 }))
}

export function getHunterAlias(userId: string) {
  let hash = 2166136261
  for (const character of userId) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return `Hunter-${(hash >>> 0).toString(36).toUpperCase().padStart(6, '0').slice(0, 6)}`
}
