export type ExamPerformanceRow = {
  user_id: string
  exam_type: string
  score: number
  total_questions: number
  submitted_at: string | null
}

export type HunterRankCode = 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S'

export type HunterRank = {
  code: HunterRankCode
  name: string
  minimumRating: number
}

export type HunterRating = {
  rating: number | null
  rank: HunterRank
  eligible: boolean
  standardSubmittedAt: string | null
}

export type HunterStanding = HunterRating & {
  userId: string
  position: number
}

export type HunterRankResultRow = {
  user_id: string
  month_key: string
  rating: number
  rank_code: HunterRankCode
  submitted_at: string
}

export type HunterJourneyStep = {
  rank: HunterRankCode | 'UNRANKED'
  title: string
  focus: string
  actions: readonly string[]
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

export const HUNTER_JOURNEY: readonly HunterJourneyStep[] = [
  {
    rank: 'UNRANKED',
    title: 'ฮันเตอร์ฝึกหัด',
    focus: 'เตรียมตัวให้พร้อมก่อนเข้าสอบวัดระดับครั้งแรก',
    actions: ['เช็กพื้นฐานรายบท', 'ฝึกอ่านโจทย์และจับคำสำคัญ', 'เลือกเวลาว่าง 90 นาทีเพื่อสอบให้จบในครั้งเดียว'],
  },
  {
    rank: 'F',
    title: 'ตั้งฐานใหม่ให้แน่น',
    focus: 'กลับไปเก็บนิยาม สูตรพื้นฐาน และวิธีคิดที่ยังสับสน',
    actions: ['เริ่มจากบทที่คะแนนอ่อนที่สุด', 'ทำโจทย์พื้นฐานช้า ๆ พร้อมจดเหตุผล', 'ทบทวนข้อผิดก่อนทำชุดใหม่'],
  },
  {
    rank: 'E',
    title: 'เชื่อมพื้นฐานกับโจทย์จริง',
    focus: 'ฝึกเลือกวิธีทำให้ตรงกับสิ่งที่โจทย์ถาม',
    actions: ['สลับโจทย์พื้นฐานกับระดับกลาง', 'สรุปคำใบ้ที่บอกว่าต้องใช้สูตรใด', 'กลับมาทำข้อที่ผิดซ้ำโดยไม่ดูเฉลย'],
  },
  {
    rank: 'D',
    title: 'ลดจุดพลาดที่เกิดซ้ำ',
    focus: 'แยกให้ออกว่าพลาดจากเนื้อหา การคำนวณ หรือการอ่านโจทย์',
    actions: ['ทำบันทึกข้อผิดพลาดแยกประเภท', 'ฝึกโจทย์ผสมหลายบท', 'เริ่มจับเวลาเป็นช่วงสั้น ๆ'],
  },
  {
    rank: 'C',
    title: 'สร้างความแม่นภายใต้เวลา',
    focus: 'รักษาวิธีคิดที่ถูกต้องพร้อมเพิ่มความเร็วอย่างเป็นระบบ',
    actions: ['ทำชุดผสมแบบจับเวลา', 'ข้ามข้อที่ติดแล้วกลับมาทีหลัง', 'ตรวจวิธีลัดว่าปลอดภัยทุกกรณี'],
  },
  {
    rank: 'B',
    title: 'รับมือโจทย์พลิกแพลง',
    focus: 'ฝึกมองโครงสร้างและเชื่อมหลายแนวคิดในข้อเดียว',
    actions: ['เพิ่มสัดส่วนโจทย์ระดับยาก', 'อธิบายวิธีทำด้วยคำของตัวเอง', 'จำลองสอบเต็มชุดและวิเคราะห์เวลาที่ใช้'],
  },
  {
    rank: 'A',
    title: 'เก็บรายละเอียดระดับสนามจริง',
    focus: 'ลดความผิดพลาดเล็ก ๆ และตัดสินใจให้คมขึ้น',
    actions: ['จำลองสอบในเงื่อนไขจริง', 'ทบทวนเฉพาะช่องโหว่ที่ยังเหลือ', 'ฝึกตรวจคำตอบอย่างมีลำดับ'],
  },
  {
    rank: 'S',
    title: 'รักษามาตรฐานสูงสุด',
    focus: 'คงความแม่นและพร้อมรับข้อสอบรูปแบบใหม่',
    actions: ['ทำข้อท้าทายเพื่อรักษาความยืดหยุ่น', 'ทบทวนข้อผิดแม้มีเพียงเล็กน้อย', 'วัดระดับใหม่ทุกเดือนโดยไม่ประมาท'],
  },
]

const MONTHLY_EXAM_PATTERN = /^hunter-rank-(\d{4})-(0[1-9]|1[0-2])$/
export const HUNTER_RANKING_RELEASE_AT = '2026-11-06T17:00:00.000Z'

export function isHunterRankingReleased(date = new Date()) {
  // A local-only test mode lets us exercise the complete November flow before
  // launch. It cannot activate against the production database or in a build.
  if (process.env.NODE_ENV === 'development'
    && process.env.NEXT_PUBLIC_HUNTER_TEST_MODE === 'true'
    && process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://rxtqeqyxdjogwfwbngbt.supabase.co') return true
  return date.getTime() >= Date.parse(HUNTER_RANKING_RELEASE_AT)
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

export function scorePercentage(score: number, maximumPoints: number) {
  return maximumPoints > 0 ? clamp(Math.round((score / maximumPoints) * 100), 0, 100) : 0
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

export function getHunterRankMonthKey(examType: string) {
  const match = MONTHLY_EXAM_PATTERN.exec(examType)
  return match ? `${match[1]}-${match[2]}` : null
}

export function isMonthlyRankExamType(examType: string) {
  return getHunterRankMonthKey(examType) !== null
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

export function calculateHunterRating(
  exams: ExamPerformanceRow[],
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
      rank: getHunterRank(null),
      eligible: false,
      standardSubmittedAt: null,
    }
  }

  const rating = scorePercentage(standardExam.score, standardExam.total_questions)
  return {
    rating,
    rank: getHunterRank(rating),
    eligible: true,
    standardSubmittedAt: standardExam.submitted_at,
  }
}

export function buildHunterStandings(
  exams: ExamPerformanceRow[],
  monthKey = getBangkokMonthKey(),
): HunterStanding[] {
  const userIds = new Set(exams.map(row => row.user_id))
  const standings = [...userIds].flatMap(userId => {
    const rating = calculateHunterRating(
      exams.filter(row => row.user_id === userId),
      monthKey,
    )
    return rating.eligible && rating.rating !== null ? [{ userId, ...rating }] : []
  })
  standings.sort((a, b) =>
    (b.rating ?? 0) - (a.rating ?? 0)
    || a.userId.localeCompare(b.userId)
  )

  let previousRating: number | null = null
  let sharedPosition = 0
  return standings.map((standing, index) => {
    if (standing.rating !== previousRating) sharedPosition = index + 1
    previousRating = standing.rating
    return { ...standing, position: sharedPosition }
  })
}

export function buildHunterStandingsFromResults(
  results: HunterRankResultRow[],
  monthKey = getBangkokMonthKey(),
): HunterStanding[] {
  const standings = results
    .filter(result => result.month_key === monthKey)
    .map(result => ({
      userId: result.user_id,
      rating: clamp(Math.round(result.rating), 0, 100),
      rank: getHunterRank(result.rating),
      eligible: true,
      standardSubmittedAt: result.submitted_at,
    }))
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || a.userId.localeCompare(b.userId))

  let previousRating: number | null = null
  let sharedPosition = 0
  return standings.map((standing, index) => {
    if (standing.rating !== previousRating) sharedPosition = index + 1
    previousRating = standing.rating
    return { ...standing, position: sharedPosition }
  })
}

export function getPreviousMonthKey(monthKey: string) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(monthKey)
  if (!match) throw new Error('Invalid month key')
  const previous = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 2, 1))
  return `${previous.getUTCFullYear()}-${String(previous.getUTCMonth() + 1).padStart(2, '0')}`
}

export function buildHunterImprovementStandings(results: HunterRankResultRow[], monthKey: string) {
  const previousMonth = getPreviousMonthKey(monthKey)
  const previous = new Map(results.filter(row => row.month_key === previousMonth).map(row => [row.user_id, row]))
  const rows = results.filter(row => row.month_key === monthKey && previous.has(row.user_id)).map(row => ({
    userId: row.user_id,
    current: row.rating,
    previous: previous.get(row.user_id)!.rating,
    improvement: row.rating - previous.get(row.user_id)!.rating,
  })).sort((a, b) => b.improvement - a.improvement || a.userId.localeCompare(b.userId))
  let last: number | null = null
  let position = 0
  return rows.map((row, index) => {
    if (row.improvement !== last) position = index + 1
    last = row.improvement
    return { ...row, position }
  })
}

export function getHunterJourneyStep(rating: HunterRating) {
  const code = rating.eligible ? rating.rank.code : 'UNRANKED'
  return HUNTER_JOURNEY.find(step => step.rank === code) ?? HUNTER_JOURNEY[0]
}

export function getHunterAlias(userId: string, monthKey = getBangkokMonthKey()) {
  let hash = 2166136261
  for (const character of `${monthKey}:${userId}`) {
    hash ^= character.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return `Hunter-${(hash >>> 0).toString(36).toUpperCase().padStart(6, '0').slice(0, 6)}`
}
