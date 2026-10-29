import HunterLicense from '@/app/components/adventure/hunter-license'
import WorldExplorer from '@/app/components/adventure/world-explorer'
import { buildTopicProgress } from '@/lib/adventure-topics'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BookOpenCheck, BrainCircuit, ShieldCheck, TrendingDown, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/payment-config'
import { analyzeLearningEvidence, type LearningEvidence } from '@/lib/learning-insights'
import { deduplicateAttempts, formatCompactDuration, formatDuration, getValidTimes, median } from '@/lib/progress-analytics'
import { getQuestionCatalog, isCorrectQuestionAnswer } from '@/lib/question-catalog'

const TOPIC_NAMES: Record<string, string> = {
  'set': 'เซต',
  'logic': 'ตรรกศาสตร์',
  'real-numbers': 'จำนวนจริง',
  'relations-functions': 'ความสัมพันธ์และฟังก์ชัน',
  'exponential-logarithm': 'เอกซ์โพเนนเชียลและลอการิทึม',
  'analytic-geometry-conics': 'เรขาคณิตวิเคราะห์และภาคตัดกรวย',
  'trigonometry': 'ฟังก์ชันตรีโกณมิติ',
  'matrix': 'เมทริกซ์',
  'vector': 'เวกเตอร์',
  'complex-numbers': 'จำนวนเชิงซ้อน',
  'counting-probability': 'หลักการนับและความน่าจะเป็น',
  'sequences-series': 'ลำดับและอนุกรม',
  'calculus': 'แคลคูลัสเบื้องต้น',
  'statistics-distributions': 'สถิติและตัวแปรสุ่ม',
  'a-level-math-1-intensive': 'ตะลุยโจทย์ A-Level Math 1',
}

type ProgressRow = {
  id: string
  topic_id: string
  question_id: string
  is_correct: boolean
  time_spent_seconds: number | null
  answered_at: string
}

type ExamRow = {
  id: string
  exam_type: string
  score: number
  total_questions: number
  submitted_at: string
  question_ids: string[] | null
  answers: Record<string, unknown> | null
}

const DIFFICULTY_NAMES = {
  easy: 'พื้นฐาน',
  medium: 'ระดับกลาง',
  hard: 'ระดับยาก',
} as const

function calculateStreak(activityDates: string[]): number {
  if (activityDates.length === 0) return 0
  const dates = new Set(activityDates.map(date => date.slice(0, 10)).filter(Boolean))
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const cursor = new Date(today)
  if (!dates.has(todayStr)) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (true) {
    const key = cursor.toISOString().slice(0, 10)
    if (dates.has(key)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

function getAccuracyTrend(rows: LearningEvidence[], days = 14) {
  const today = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (days - 1 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const day = rows.filter(row => row.answeredAt.startsWith(dateStr))
    const total = day.length
    const correct = day.filter(row => row.isCorrect).length
    const label = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
    return { dateStr, label, total, accuracy: total > 0 ? Math.round((correct / total) * 100) : null }
  })
}

function getExamTrend(exams: ExamRow[]): number | null {
  if (exams.length < 2) return null
  const latest = exams[0].total_questions > 0 ? Math.round((exams[0].score / exams[0].total_questions) * 100) : 0
  const previous = exams.slice(1, 4)
  const previousAverage = Math.round(previous.reduce((sum, exam) => (
    sum + (exam.total_questions > 0 ? (exam.score / exam.total_questions) * 100 : 0)
  ), 0) / previous.length)
  return latest - previousAverage
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: progressRows }, { data: examRows }] = await Promise.all([
    supabase
      .from('user_progress')
      .select('id, topic_id, question_id, is_correct, time_spent_seconds, answered_at')
      .eq('user_id', user.id)
      .order('answered_at', { ascending: true }),
    supabase
      .from('exam_sessions')
      .select('id, exam_type, score, total_questions, submitted_at, question_ids, answers')
      .eq('user_id', user.id)
      .not('submitted_at', 'is', null)
      .order('submitted_at', { ascending: false })
      .limit(20),
  ])

  const progress = deduplicateAttempts((progressRows ?? []) as ProgressRow[])
  const exams = (examRows ?? []) as ExamRow[]
  const questionCatalog = getQuestionCatalog()
  const practiceEvidence: LearningEvidence[] = progress.map(row => {
    const question = questionCatalog.get(row.question_id)
    return {
      topicId: row.topic_id,
      questionId: row.question_id,
      isCorrect: row.is_correct,
      source: 'practice',
      answeredAt: row.answered_at,
      timeSpentSeconds: row.time_spent_seconds,
      difficulty: question?.difficulty,
    }
  })
  const examEvidence: LearningEvidence[] = exams.flatMap(exam => (exam.question_ids ?? []).flatMap(questionId => {
    const question = questionCatalog.get(questionId)
    if (!question) return []
    return [{
      topicId: question.topicId,
      questionId: `${exam.id}:${questionId}`,
      isCorrect: isCorrectQuestionAnswer(question, exam.answers?.[questionId]),
      source: 'exam' as const,
      answeredAt: exam.submitted_at,
      timeSpentSeconds: null,
      difficulty: question.difficulty,
    }]
  }))
  const evidence = [...practiceEvidence, ...examEvidence]
  const insights = analyzeLearningEvidence(evidence)
  const analyzedTopics = insights.filter(topic => topic.total >= 5).length
  const primaryFocus = insights.find(topic => topic.status === 'focus')
    ?? insights.find(topic => topic.status === 'developing')
    ?? insights.find(topic => topic.status === 'collecting')
    ?? insights[0]

  const totalAnswered = evidence.length
  const totalCorrect = evidence.filter(item => item.isCorrect).length
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
  const streak = calculateStreak(evidence.map(item => item.answeredAt))
  const trend = getAccuracyTrend(evidence, 14)
  const overallMedianSeconds = median(getValidTimes(progress))
  const weakTopics = insights
    .filter(topic => topic.status === 'focus' || topic.status === 'developing')
    .slice(0, 5)
  const strongTopics = insights
    .filter(topic => topic.status === 'strong')
    .sort((a, b) => b.accuracy - a.accuracy || (a.medianSeconds ?? Infinity) - (b.medianSeconds ?? Infinity))
    .slice(0, 3)
  const examTrend = getExamTrend(exams)
  const latestExam = exams[0]
  const latestExamAccuracy = latestExam?.total_questions > 0
    ? Math.round((latestExam.score / latestExam.total_questions) * 100)
    : null

  const displayName = user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'คุณ'
  const focusName = primaryFocus ? TOPIC_NAMES[primaryFocus.topicId] ?? primaryFocus.topicId : null
  const focusDifficulty = primaryFocus?.weakestDifficulty
    ? DIFFICULTY_NAMES[primaryFocus.weakestDifficulty]
    : null

  return (
    <main className="adventure-page min-h-screen p-5 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-1">สวัสดี, {displayName}</p>
            <h1 className="text-2xl font-heading font-semibold text-foreground">ศูนย์บัญชาการ</h1>
          </div>
          <div className="flex gap-3">
            {isAdminEmail(user.email) && (
              <Link
                href="/admin/students"
                className="flex items-center gap-1.5 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                แอดมิน
              </Link>
            )}
            <Link
              href="/practice"
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              ฝึกโจทย์
            </Link>
            <Link
              href="/exam"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              สอบจำลอง
            </Link>
          </div>
        </div>

        <div className="dashboard-world-layout">
          <div className="dashboard-map">
        <WorldExplorer progress={buildTopicProgress(progress)} signedIn recommendedTopicId={primaryFocus?.topicId} />
          </div>
        <div className="dashboard-loadout">
        <section className="next-mission" aria-labelledby="next-mission-title">
          <div>
            <h2 id="next-mission-title">{focusName ? `ภารกิจถัดไป · ${focusName}` : 'เริ่มภารกิจแรกของคุณ'}</h2>
            <p>{focusName ? 'เลือกจากผลการฝึกและข้อสอบที่มีอยู่ ทบทวนจุดที่ยังไม่แม่น แล้วลองทำต่ออีกครั้ง' : 'เลือกบทที่อยากฝึก แล้วระบบจะใช้ผลจริงช่วยให้เห็นว่าควรพัฒนาตรงไหนต่อ'}</p>
          </div>
          <Link href={primaryFocus ? `/practice/${primaryFocus.topicId}` : '/practice'}>{focusName ? 'ฝึกบทนี้ต่อ' : 'เลือกภารกิจฝึกโจทย์'}<ArrowRight className="size-4" aria-hidden="true" /></Link>
        </section>

        <HunterLicense name={user.user_metadata?.full_name ?? displayName} avatarUrl={user.user_metadata?.avatar_url} answered={totalAnswered} accuracy={totalAnswered > 0 ? overallAccuracy : null} streak={streak} />
        </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
          <div className="p-5 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">โจทย์ทั้งหมด</p>
            <p className="text-3xl font-heading font-bold text-foreground tabular-nums">{totalAnswered}</p>
            <p className="text-xs text-muted-foreground mt-1">แบบฝึกและข้อสอบรวมกัน</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">ความแม่นยำ</p>
            <p className={`text-3xl font-heading font-bold tabular-nums ${overallAccuracy >= 80 ? 'text-green-700' : overallAccuracy >= 60 ? 'text-amber-700' : 'text-red-700'}`}>
              {totalAnswered > 0 ? `${overallAccuracy}%` : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCorrect}/{totalAnswered} ข้อถูก
            </p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">Streak</p>
            <p className="text-3xl font-heading font-bold text-foreground tabular-nums">{streak}</p>
            <p className="text-xs text-muted-foreground mt-1">วันติดต่อกัน</p>
          </div>
          <div className="p-5 rounded-lg border border-border bg-card">
            <p className="text-xs text-muted-foreground mb-1">เวลาต่อข้อ</p>
            <p className="text-2xl font-heading font-bold text-foreground tabular-nums">{formatCompactDuration(overallMedianSeconds)}</p>
            <p className="text-xs text-muted-foreground mt-1">ค่ามัธยฐานของเวลาที่ทำจริง</p>
          </div>
        </div>

        <section className="mb-8 overflow-hidden rounded-lg border border-border bg-card ">
          <header className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between md:p-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2.5">
                <BrainCircuit className="size-5 text-primary" aria-hidden="true" />
                <h2 className="font-heading text-lg font-semibold text-foreground">วิเคราะห์เพื่อพัฒนาต่อ</h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                รวมผลจากแบบฝึกหัด {practiceEvidence.length} ข้อ และข้อสอบ {examEvidence.length} ข้อ เพื่อหาเรื่องที่ควรลงมือฝึกต่อจริง ๆ
              </p>
            </div>
            <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary tabular-nums">
              วิเคราะห์ได้ {analyzedTopics}/14 บท
            </span>
          </header>

          {primaryFocus && focusName ? (
            <>
              <div className="grid md:grid-cols-[1.15fr_.85fr]">
                <div className="p-5 md:p-6 md:pr-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      primaryFocus.status === 'focus'
                        ? 'bg-red-500/10 text-red-700'
                        : primaryFocus.status === 'developing'
                          ? 'bg-amber-500/10 text-amber-700'
                          : primaryFocus.status === 'strong'
                            ? 'bg-green-500/10 text-green-700'
                            : 'bg-muted text-muted-foreground'
                    }`}>
                      {primaryFocus.statusLabel}
                    </span>
                    <span className="text-xs text-muted-foreground">{primaryFocus.confidenceLabel}</span>
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                    เริ่มพัฒนาที่ “{focusName}”
                  </h3>
                  <p className="mt-2 max-w-[65ch] text-sm leading-6 text-muted-foreground">
                    ทำถูก {primaryFocus.correct} จาก {primaryFocus.total} ข้อ ({primaryFocus.accuracy}%)
                    {focusDifficulty && primaryFocus.weakestDifficultyAccuracy !== null
                      ? ` โดยโจทย์${focusDifficulty}ยังทำได้ ${primaryFocus.weakestDifficultyAccuracy}%`
                      : ''}
                    {primaryFocus.trendDelta !== null
                      ? primaryFocus.trendDelta >= 0
                        ? ` และ 5 ข้อล่าสุดดีขึ้น ${primaryFocus.trendDelta} จุดเปอร์เซ็นต์`
                        : ` แต่ 5 ข้อล่าสุดลดลง ${Math.abs(primaryFocus.trendDelta)} จุดเปอร์เซ็นต์`
                      : ''}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground tabular-nums">
                    <span>แบบฝึก {primaryFocus.practiceTotal} ข้อ</span>
                    <span>ข้อสอบ {primaryFocus.examTotal} ข้อ</span>
                    <span>เวลามัธยฐาน {formatDuration(primaryFocus.medianSeconds)}</span>
                  </div>
                  <Link
                    href={`/practice/${primaryFocus.topicId}`}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
                  >
                    ฝึกบทนี้ต่อ
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>

                <div className="border-t border-border bg-muted/30 p-5 md:border-l md:border-t-0 md:p-6">
                  <h3 className="font-heading text-base font-semibold text-foreground">แผนฝึกรอบถัดไป</h3>
                  <ol className="mt-4 space-y-4">
                    <li className="grid grid-cols-[1.75rem_1fr] gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="flex size-7 items-center justify-center rounded-full bg-background font-semibold text-foreground tabular-nums">1</span>
                      <span>ทบทวนสูตรและตัวอย่างของบทนี้ โดยเน้น{focusDifficulty ? `โจทย์${focusDifficulty}` : 'จุดที่ตอบผิดล่าสุด'}</span>
                    </li>
                    <li className="grid grid-cols-[1.75rem_1fr] gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="flex size-7 items-center justify-center rounded-full bg-background font-semibold text-foreground tabular-nums">2</span>
                      <span>ทำเพิ่มอย่างน้อย 5 ข้อ และอ่านเฉลยทุกข้อที่ผิดก่อนข้าม</span>
                    </li>
                    <li className="grid grid-cols-[1.75rem_1fr] gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="flex size-7 items-center justify-center rounded-full bg-background font-semibold text-foreground tabular-nums">3</span>
                      <span>{primaryFocus.examTotal > 0 ? 'กลับไปลองข้อสอบจับเวลา แล้วเทียบผลรอบใหม่' : 'ลองแบบทดสอบพื้นฐาน เพื่อเช็กว่านำไปใช้ในข้อสอบได้หรือยัง'}</span>
                    </li>
                  </ol>
                </div>
              </div>

              <dl className="grid divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="p-4 md:px-6">
                  <dt className="text-xs text-muted-foreground">แนวโน้มของบทนี้</dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    {primaryFocus.trendDelta === null ? (
                      'รอข้อมูลอีกเล็กน้อย'
                    ) : primaryFocus.trendDelta >= 0 ? (
                      <><TrendingUp className="size-4 text-green-700" aria-hidden="true" /> ดีขึ้น {primaryFocus.trendDelta} จุด</>
                    ) : (
                      <><TrendingDown className="size-4 text-red-700" aria-hidden="true" /> ลดลง {Math.abs(primaryFocus.trendDelta)} จุด</>
                    )}
                  </dd>
                </div>
                <div className="p-4 md:px-6">
                  <dt className="text-xs text-muted-foreground">ข้อสอบล่าสุด</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground tabular-nums">
                    {latestExamAccuracy === null ? 'ยังไม่มีผลสอบ' : `${latestExamAccuracy}%`}
                    {examTrend !== null
                      ? examTrend >= 0
                        ? ` · ดีขึ้น ${examTrend} จุด`
                        : ` · ลดลง ${Math.abs(examTrend)} จุด`
                      : ''}
                  </dd>
                </div>
                <div className="p-4 md:px-6">
                  <dt className="text-xs text-muted-foreground">หลักฐานที่ใช้</dt>
                  <dd className="mt-1 text-sm font-semibold text-foreground tabular-nums">{primaryFocus.total} ข้อในบทนี้</dd>
                </div>
              </dl>
            </>
          ) : (
            <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground">เริ่มทำข้อแรกเพื่อให้ระบบรู้จักคุณ</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">เมื่อมีข้อมูลอย่างน้อย 5 ข้อในหนึ่งบท ระบบจะเริ่มแนะนำแนวทางที่เหมาะกับผลจริง</p>
              </div>
              <Link href="/practice" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                เริ่มฝึกโจทย์ <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Accuracy trend */}
          <div className="animate-fade-slide-in p-5 rounded-lg border border-border bg-card ">
            <h2 className="text-sm font-semibold text-foreground mb-4">ความแม่นยำ 14 วันที่ผ่านมา</h2>
            {totalAnswered === 0 ? (
              <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล เริ่มทำโจทย์เลย!</p>
            ) : (
              <div className="flex items-end gap-1 h-24">
                {trend.map((day) => (
                  <div
                    key={day.dateStr}
                    className="flex-1 flex flex-col items-center justify-end gap-1"
                    title={day.total > 0 ? `${day.label}: ${day.accuracy}% (${day.total} ข้อ)` : day.label}
                  >
                    <div
                      className={`w-full rounded-sm transition-all ${
                        day.accuracy === null
                          ? 'bg-muted'
                          : day.accuracy >= 80
                          ? 'bg-green-500'
                          : day.accuracy >= 60
                          ? 'bg-amber-500'
                          : 'bg-red-400'
                      }`}
                      style={{ height: day.accuracy !== null ? `${Math.max(8, day.accuracy)}%` : '8%', opacity: day.accuracy === null ? 0.3 : 1 }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">{trend[0]?.label}</span>
              <span className="text-xs text-muted-foreground">{trend[trend.length - 1]?.label}</span>
            </div>
          </div>

          {/* Weak topics */}
          <div style={{ animationDelay: '80ms' }} className="animate-fade-slide-in p-5 rounded-lg border border-border bg-card ">
            <h2 className="text-sm font-semibold text-foreground mb-1">หัวข้อที่ควรฝึกต่อ</h2>
            <p className="mb-4 text-xs text-muted-foreground">รวมคำตอบจากแบบฝึกหัดและข้อสอบ</p>
            {weakTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {totalAnswered === 0
                  ? 'ยังไม่มีข้อมูล เริ่มทำโจทย์เลย!'
                  : 'ทำอย่างน้อย 5 ข้อต่อบท ระบบจึงจะเริ่มวิเคราะห์ได้'}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {weakTopics.map(t => (
                  <Link
                    key={t.topicId}
                    href={`/practice/${t.topicId}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground group-hover:text-primary transition-colors">{TOPIC_NAMES[t.topicId] ?? t.topicId}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{t.statusLabel} · {t.confidenceLabel}</span>
                    </span>
                    <span className="shrink-0 text-right text-xs text-muted-foreground">
                      <span className="block font-semibold tabular-nums text-foreground">{t.accuracy}%</span>
                      <span className="block tabular-nums">{formatDuration(t.medianSeconds)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Exam history */}
          <div style={{ animationDelay: '140ms' }} className="animate-fade-slide-in p-5 rounded-lg border border-border bg-card ">
            <h2 className="text-sm font-semibold text-foreground mb-4">ประวัติการสอบ</h2>
            {exams.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                <p className="mb-3">ยังไม่เคยสอบจำลอง</p>
                <Link href="/exam" className="text-primary hover:underline cursor-pointer">
                  เริ่มสอบจำลอง →
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {exams.slice(0, 5).map(exam => {
                  const pct = exam.total_questions > 0
                    ? Math.round((exam.score / exam.total_questions) * 100)
                    : 0
                  const date = new Date(exam.submitted_at).toLocaleDateString('th-TH', {
                    day: 'numeric', month: 'short', year: '2-digit',
                  })
                  return (
                    <Link
                      key={exam.id}
                      href={`/exam/${exam.id}/result`}
                      className="flex items-center justify-between gap-3 hover:bg-accent/50 rounded-lg p-2 -mx-2 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {exam.exam_type}
                        </span>
                        <span className="text-xs text-muted-foreground">{date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {exam.score}/{exam.total_questions}
                        </span>
                        <span className={`text-sm font-semibold ${pct >= 80 ? 'text-green-700' : pct >= 60 ? 'text-amber-700' : 'text-red-700'}`}>
                          {pct}%
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Strong topics */}
          <div style={{ animationDelay: '200ms' }} className="animate-fade-slide-in p-5 rounded-lg border border-border bg-card ">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="size-4 text-green-700" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-foreground">หัวข้อที่ทำได้ดี</h2>
            </div>
            <p className="mb-4 mt-1 text-xs text-muted-foreground">แม่นอย่างน้อย 80% จากข้อมูลรวม</p>
            {strongTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="flex flex-col gap-3">
                {strongTopics.map(t => (
                  <div key={t.topicId} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-36 shrink-0 truncate">
                      {TOPIC_NAMES[t.topicId] ?? t.topicId}
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-green-500"
                        style={{ width: `${t.accuracy}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground min-w-24 text-right shrink-0 tabular-nums">
                      {t.accuracy}% · {formatDuration(t.medianSeconds)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
