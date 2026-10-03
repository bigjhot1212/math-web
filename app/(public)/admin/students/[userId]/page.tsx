import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, BookOpenCheck, Clock3, GraduationCap, MapPin, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'

const TOPIC_NAMES: Record<string, string> = {
  set: 'เซต', logic: 'ตรรกศาสตร์', 'real-numbers': 'จำนวนจริง', 'relations-functions': 'ความสัมพันธ์และฟังก์ชัน',
  'exponential-logarithm': 'เอกซ์โพเนนเชียลและลอการิทึม', 'analytic-geometry-conics': 'เรขาคณิตวิเคราะห์และภาคตัดกรวย',
  trigonometry: 'ฟังก์ชันตรีโกณมิติ', matrix: 'เมทริกซ์', vector: 'เวกเตอร์', 'complex-numbers': 'จำนวนเชิงซ้อน',
  'counting-probability': 'หลักการนับและความน่าจะเป็น', 'sequences-series': 'ลำดับและอนุกรม', calculus: 'แคลคูลัสเบื้องต้น',
  'statistics-distributions': 'สถิติและตัวแปรสุ่ม',
}

type ProgressRow = { id: string; topic_id: string; is_correct: boolean; answered_at: string; time_spent_seconds: number | null }
type ExamRow = { id: string; exam_type: string; score: number | null; total_questions: number; submitted_at: string }

function formatDate(value: string) {
  return new Date(value).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function AdminStudentDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')

  const admin = createAdminClient()
  const [profileResult, progressResult, examResult, authResult] = await Promise.all([
    admin.from('student_profiles').select('*').eq('user_id', userId).maybeSingle(),
    admin.from('user_progress').select('id, topic_id, is_correct, answered_at, time_spent_seconds').eq('user_id', userId).order('answered_at', { ascending: false }),
    admin.from('exam_sessions').select('id, exam_type, score, total_questions, submitted_at').eq('user_id', userId).not('submitted_at', 'is', null).order('submitted_at', { ascending: false }),
    admin.auth.admin.getUserById(userId),
  ])
  const profile = profileResult.data
  if (!profile) notFound()

  const progress = (progressResult.data ?? []) as ProgressRow[]
  const exams = (examResult.data ?? []) as ExamRow[]
  const correct = progress.filter(row => row.is_correct).length
  const accuracy = progress.length > 0 ? Math.round((correct / progress.length) * 100) : null
  const timedAnswers = progress.filter(row => typeof row.time_spent_seconds === 'number' && row.time_spent_seconds > 0)
  const averageSeconds = timedAnswers.length > 0 ? Math.round(timedAnswers.reduce((sum, row) => sum + (row.time_spent_seconds ?? 0), 0) / timedAnswers.length) : null
  const topicMap = new Map<string, { correct: number; total: number }>()
  for (const row of progress) {
    const current = topicMap.get(row.topic_id) ?? { correct: 0, total: 0 }
    current.total += 1
    if (row.is_correct) current.correct += 1
    topicMap.set(row.topic_id, current)
  }
  const topicStats = Array.from(topicMap.entries()).map(([topicId, value]) => ({ topicId, ...value, accuracy: Math.round((value.correct / value.total) * 100) })).sort((a, b) => b.total - a.total)

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/students" className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft className="size-4" aria-hidden="true" />กลับไปรายชื่อนักเรียน</Link>
        <header className="mb-8 border-b border-border pb-7"><h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground">{profile.full_name}</h1><p className="mt-2 text-sm text-muted-foreground">{authResult.data.user?.email ?? 'ไม่พบอีเมล'}</p></header>

        <section aria-label="ข้อมูลนักเรียน" className="mb-8 grid gap-5 border-b border-border pb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="flex items-center gap-2 text-xs text-muted-foreground"><GraduationCap className="size-4" aria-hidden="true" />ชั้นเรียน</p><p className="mt-2 font-medium text-foreground">{profile.grade}</p></div>
          <div><p className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />จังหวัด</p><p className="mt-2 font-medium text-foreground">{profile.province}</p></div>
          <div><p className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="size-4" aria-hidden="true" />คณะเป้าหมาย</p><p className="mt-2 font-medium text-foreground">{profile.desired_faculty}</p></div>
          <div><p className="flex items-center gap-2 text-xs text-muted-foreground"><BookOpenCheck className="size-4" aria-hidden="true" />มหาวิทยาลัยเป้าหมาย</p><p className="mt-2 font-medium text-foreground">{profile.desired_university}</p></div>
        </section>

        <section aria-labelledby="summary-heading" className="mb-10">
          <h2 id="summary-heading" className="mb-4 text-lg font-semibold text-foreground">ภาพรวมการเรียน</h2>
          <div className="grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-2 lg:grid-cols-4">
            {([['โจทย์ที่ทำแล้ว', `${progress.length} ข้อ`], ['ตอบถูก', `${correct} ข้อ`], ['ความแม่นยำ', accuracy === null ? '—' : `${accuracy}%`], ['เวลาเฉลี่ยต่อข้อ', averageSeconds === null ? '—' : `${averageSeconds} วินาที`]] as const).map(([label, value], index) => (
              <div key={label} className={`px-5 py-5 ${index > 0 ? 'border-t border-border sm:border-t-0 sm:border-l' : ''} ${index === 2 ? 'sm:border-l-0 lg:border-l' : ''}`}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p></div>
            ))}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section aria-labelledby="topics-heading">
            <h2 id="topics-heading" className="text-lg font-semibold text-foreground">ผลงานแยกตามบท</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">เรียงตามจำนวนโจทย์ที่ทำมากที่สุด</p>
            {topicStats.length === 0 ? <div className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">นักเรียนคนนี้ยังไม่ได้เริ่มทำแบบฝึกหัด</div> : (
              <div className="divide-y divide-border rounded-2xl border border-border bg-card">{topicStats.map(topic => (
                <div key={topic.topicId} className="px-5 py-4"><div className="mb-2 flex items-center justify-between gap-4"><div><p className="text-sm font-medium text-foreground">{TOPIC_NAMES[topic.topicId] ?? topic.topicId}</p><p className="mt-0.5 text-xs text-muted-foreground">ถูก {topic.correct} จาก {topic.total} ข้อ</p></div><span className={`text-sm font-semibold tabular-nums ${topic.accuracy >= 80 ? 'text-green-600' : topic.accuracy >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{topic.accuracy}%</span></div><div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true"><div className={`h-full rounded-full ${topic.accuracy >= 80 ? 'bg-green-500' : topic.accuracy >= 60 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${topic.accuracy}%` }} /></div></div>
              ))}</div>
            )}
          </section>

          <section aria-labelledby="exams-heading">
            <h2 id="exams-heading" className="text-lg font-semibold text-foreground">ประวัติการสอบจำลอง</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">ส่งข้อสอบแล้วทั้งหมด {exams.length} ครั้ง</p>
            {exams.length === 0 ? <div className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">ยังไม่มีประวัติการสอบจำลอง</div> : (
              <div className="divide-y divide-border rounded-2xl border border-border bg-card">{exams.slice(0, 10).map(exam => { const score = exam.score ?? 0; const percentage = exam.total_questions > 0 ? Math.round((score / exam.total_questions) * 100) : 0; return (
                <div key={exam.id} className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="text-sm font-medium text-foreground">{exam.exam_type}</p><p className="mt-0.5 text-xs text-muted-foreground">{formatDate(exam.submitted_at)}</p></div><div className="text-right"><p className="font-semibold tabular-nums text-foreground">{score}/{exam.total_questions}</p><p className="mt-0.5 text-xs tabular-nums text-muted-foreground">{percentage}%</p></div></div>
              )})}</div>
            )}
          </section>
        </div>

        <div className="mt-10 flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><Clock3 className="size-4" aria-hidden="true" />{progress[0]?.answered_at ? `ทำแบบฝึกหัดล่าสุด ${formatDate(progress[0].answered_at)}` : 'ยังไม่มีการทำแบบฝึกหัด'}</div>
      </div>
    </main>
  )
}
