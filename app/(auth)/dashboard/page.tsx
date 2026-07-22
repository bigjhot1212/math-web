import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ListChecks, Target, Flame, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/payment-config'

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
}

type ProgressRow = {
  id: string
  topic_id: string
  is_correct: boolean
  answered_at: string
}

type ExamRow = {
  id: string
  exam_type: string
  score: number
  total_questions: number
  submitted_at: string
}

function calculateStreak(rows: ProgressRow[]): number {
  if (rows.length === 0) return 0
  const dates = new Set(rows.map(r => r.answered_at?.slice(0, 10)).filter(Boolean))
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

function getAccuracyTrend(rows: ProgressRow[], days = 14) {
  const today = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (days - 1 - i))
    const dateStr = d.toISOString().slice(0, 10)
    const day = rows.filter(r => r.answered_at?.startsWith(dateStr))
    const total = day.length
    const correct = day.filter(r => r.is_correct).length
    const label = d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
    return { dateStr, label, total, accuracy: total > 0 ? Math.round((correct / total) * 100) : null }
  })
}

function getTopicStats(rows: ProgressRow[]) {
  const map: Record<string, { correct: number; total: number }> = {}
  for (const r of rows) {
    if (!map[r.topic_id]) map[r.topic_id] = { correct: 0, total: 0 }
    map[r.topic_id].total++
    if (r.is_correct) map[r.topic_id].correct++
  }
  return Object.entries(map)
    .map(([topicId, s]) => ({ topicId, ...s, accuracy: Math.round((s.correct / s.total) * 100) }))
    .filter(t => t.total >= 2)
    .sort((a, b) => a.accuracy - b.accuracy)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: progressRows }, { data: examRows }] = await Promise.all([
    supabase
      .from('user_progress')
      .select('id, topic_id, is_correct, answered_at')
      .eq('user_id', user.id)
      .order('answered_at', { ascending: true }),
    supabase
      .from('exam_sessions')
      .select('id, exam_type, score, total_questions, submitted_at')
      .eq('user_id', user.id)
      .not('submitted_at', 'is', null)
      .order('submitted_at', { ascending: false })
      .limit(5),
  ])

  const progress: ProgressRow[] = progressRows ?? []
  const exams: ExamRow[] = examRows ?? []

  const totalAnswered = progress.length
  const totalCorrect = progress.filter(p => p.is_correct).length
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
  const streak = calculateStreak(progress)
  const trend = getAccuracyTrend(progress, 14)
  const topicStats = getTopicStats(progress)
  const weakTopics = topicStats.slice(0, 5)
  const strongTopics = [...topicStats].reverse().slice(0, 3)

  const displayName = user.user_metadata?.full_name?.split(' ')[0] ?? user.email?.split('@')[0] ?? 'คุณ'

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-sm text-muted-foreground mb-1">สวัสดี, {displayName}</p>
            <h1 className="text-2xl font-heading font-semibold text-foreground">ความก้าวหน้าของคุณ</h1>
          </div>
          <div className="flex gap-3">
            {isAdminEmail(user.email) && (
              <Link
                href="/admin/bank-transfers"
                className="flex items-center gap-1.5 px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                แอดมิน
              </Link>
            )}
            <Link
              href="/practice"
              className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent transition-colors cursor-pointer"
            >
              ฝึกโจทย์
            </Link>
            <Link
              href="/exam"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              สอบจำลอง
            </Link>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-3xl border border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <span className="w-9 h-9 rounded-xl bg-chart-3/15 text-chart-3 flex items-center justify-center mb-3">
              <ListChecks className="w-4.5 h-4.5" aria-hidden="true" />
            </span>
            <p className="text-xs text-muted-foreground mb-1">โจทย์ทั้งหมด</p>
            <p className="text-3xl font-heading font-bold text-foreground tabular-nums">{totalAnswered}</p>
            <p className="text-xs text-muted-foreground mt-1">ข้อที่ทำแล้ว</p>
          </div>
          <div className="p-5 rounded-3xl border border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Target className="w-4.5 h-4.5" aria-hidden="true" />
            </span>
            <p className="text-xs text-muted-foreground mb-1">ความแม่นยำ</p>
            <p className={`text-3xl font-heading font-bold tabular-nums ${overallAccuracy >= 80 ? 'text-green-600' : overallAccuracy >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
              {totalAnswered > 0 ? `${overallAccuracy}%` : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCorrect}/{totalAnswered} ข้อถูก
            </p>
          </div>
          <div className="p-5 rounded-3xl border border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <span className="w-9 h-9 rounded-xl bg-cta/10 text-cta flex items-center justify-center mb-3">
              <Flame className="w-4.5 h-4.5" aria-hidden="true" />
            </span>
            <p className="text-xs text-muted-foreground mb-1">Streak</p>
            <p className="text-3xl font-heading font-bold text-foreground tabular-nums">{streak}</p>
            <p className="text-xs text-muted-foreground mt-1">วันติดต่อกัน</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Accuracy trend */}
          <div className="animate-fade-slide-in p-5 rounded-3xl border border-border bg-card shadow-sm">
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
          <div style={{ animationDelay: '80ms' }} className="animate-fade-slide-in p-5 rounded-3xl border border-border bg-card shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-4">หัวข้อที่ต้องฝึกเพิ่ม</h2>
            {weakTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {totalAnswered === 0
                  ? 'ยังไม่มีข้อมูล เริ่มทำโจทย์เลย!'
                  : 'ทำโจทย์อย่างน้อย 2 ข้อต่อหัวข้อเพื่อดูสถิติ'}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {weakTopics.map(t => (
                  <Link
                    key={t.topicId}
                    href={`/practice/${t.topicId}`}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-sm text-muted-foreground w-36 shrink-0 truncate group-hover:text-foreground transition-colors">
                      {TOPIC_NAMES[t.topicId] ?? t.topicId}
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${t.accuracy >= 80 ? 'bg-green-500' : t.accuracy >= 60 ? 'bg-amber-500' : 'bg-red-400'}`}
                        style={{ width: `${t.accuracy}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
                      {t.accuracy}%
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Exam history */}
          <div style={{ animationDelay: '140ms' }} className="animate-fade-slide-in p-5 rounded-3xl border border-border bg-card shadow-sm">
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
                {exams.map(exam => {
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
                        <span className={`text-sm font-semibold ${pct >= 80 ? 'text-green-600' : pct >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
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
          <div style={{ animationDelay: '200ms' }} className="animate-fade-slide-in p-5 rounded-3xl border border-border bg-card shadow-sm">
            <h2 className="text-sm font-semibold text-foreground mb-4">หัวข้อที่ทำได้ดี</h2>
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
                    <span className="text-xs text-muted-foreground w-10 text-right shrink-0">
                      {t.accuracy}%
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
