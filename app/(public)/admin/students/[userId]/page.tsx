import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock3, GraduationCap, MapPin, Target } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'
import { deduplicateAttempts, formatDuration, getTopicPerformances, getValidTimes, median } from '@/lib/progress-analytics'
import { COURSES } from '@/content/course-videos'
import {
  buildConfirmationMap,
  getPaymentLabel,
  getPurchaseConfirmation,
  type AdminPurchaseRow,
  type ConfirmedTransferRow,
} from '@/lib/admin-course-purchases'

const TOPIC_NAMES: Record<string, string> = {
  set: 'เซต', logic: 'ตรรกศาสตร์', 'real-numbers': 'จำนวนจริง', 'relations-functions': 'ความสัมพันธ์และฟังก์ชัน',
  'exponential-logarithm': 'เอกซ์โพเนนเชียลและลอการิทึม', 'analytic-geometry-conics': 'เรขาคณิตวิเคราะห์และภาคตัดกรวย',
  trigonometry: 'ฟังก์ชันตรีโกณมิติ', matrix: 'เมทริกซ์', vector: 'เวกเตอร์', 'complex-numbers': 'จำนวนเชิงซ้อน',
  'counting-probability': 'หลักการนับและความน่าจะเป็น', 'sequences-series': 'ลำดับและอนุกรม', calculus: 'แคลคูลัสเบื้องต้น',
  'statistics-distributions': 'สถิติและตัวแปรสุ่ม',
}

type ProgressRow = { id: string; topic_id: string; question_id: string; is_correct: boolean; answered_at: string; time_spent_seconds: number | null }
type ExamRow = { id: string; exam_type: string; score: number | null; total_questions: number; submitted_at: string }

function formatDate(value: string) {
  return new Date(value).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatBaht(value: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(value)
}

export default async function AdminStudentDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')

  const admin = createAdminClient()
  const [profileResult, progressResult, examResult, authResult, purchasesResult, transfersResult] = await Promise.all([
    admin.from('student_profiles').select('*').eq('user_id', userId).maybeSingle(),
    admin.from('user_progress').select('id, topic_id, question_id, is_correct, answered_at, time_spent_seconds').eq('user_id', userId).order('answered_at', { ascending: false }),
    admin.from('exam_sessions').select('id, exam_type, score, total_questions, submitted_at').eq('user_id', userId).not('submitted_at', 'is', null).order('submitted_at', { ascending: false }),
    admin.auth.admin.getUserById(userId),
    admin.from('topic_purchases').select('user_id, topic_id, price_thb, payment_method').eq('user_id', userId),
    admin.from('bank_transfer_requests').select('user_id, topic_id, bundle_id, confirmed_at').eq('user_id', userId).eq('status', 'confirmed'),
  ])
  const profile = profileResult.data
  const authUser = authResult.data.user
  const purchases = (purchasesResult.data ?? []) as AdminPurchaseRow[]
  const transfers = (transfersResult.data ?? []) as ConfirmedTransferRow[]
  if (!profile && !authUser && purchases.length === 0) notFound()

  const progress = deduplicateAttempts((progressResult.data ?? []) as ProgressRow[])
  const exams = (examResult.data ?? []) as ExamRow[]
  const correct = progress.filter(row => row.is_correct).length
  const accuracy = progress.length > 0 ? Math.round((correct / progress.length) * 100) : null
  const overallMedianSeconds = median(getValidTimes(progress))
  const topicStats = getTopicPerformances(progress).sort((a, b) => a.priority - b.priority || b.total - a.total)
  const confirmationByPurchase = buildConfirmationMap(transfers)
  const purchaseTotal = purchases.reduce((sum, purchase) => sum + (purchase.price_thb ?? 0), 0)
  const displayName = profile?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'ยังไม่กรอกชื่อ'

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/students" className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft className="size-4" aria-hidden="true" />กลับไปรายชื่อนักเรียน</Link>
        <header className="mb-8 flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground">{displayName}</h1><p className="mt-2 text-sm text-muted-foreground">{authUser?.email ?? 'ไม่พบอีเมล'}</p></div>{purchases.length > 0 && <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400"><CheckCircle2 className="size-4" aria-hidden="true" />เปิดสิทธิ์แล้ว {purchases.length} คอร์ส</div>}</header>

        <section aria-label="ข้อมูลนักเรียน" className="mb-8 grid gap-5 border-b border-border pb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="flex items-center gap-2 text-xs text-muted-foreground"><GraduationCap className="size-4" aria-hidden="true" />ชั้นเรียน</p><p className="mt-2 font-medium text-foreground">{profile?.grade ?? 'ยังไม่กรอก'}</p></div>
          <div><p className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-4" aria-hidden="true" />จังหวัด</p><p className="mt-2 font-medium text-foreground">{profile?.province ?? 'ยังไม่กรอก'}</p></div>
          <div><p className="flex items-center gap-2 text-xs text-muted-foreground"><Target className="size-4" aria-hidden="true" />คณะเป้าหมาย</p><p className="mt-2 font-medium text-foreground">{profile?.desired_faculty ?? 'ยังไม่กรอก'}</p></div>
          <div><p className="flex items-center gap-2 text-xs text-muted-foreground"><BookOpenCheck className="size-4" aria-hidden="true" />มหาวิทยาลัยเป้าหมาย</p><p className="mt-2 font-medium text-foreground">{profile?.desired_university ?? 'ยังไม่กรอก'}</p></div>
        </section>

        <section aria-labelledby="purchases-heading" className="mb-10">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div><h2 id="purchases-heading" className="text-lg font-semibold text-foreground">คอร์สและการชำระเงิน</h2><p className="mt-1 text-sm text-muted-foreground">ตรวจสอบสิทธิ์ที่เปิดให้ พร้อมช่องทางและวันที่ยืนยัน</p></div>
            {purchases.length > 0 && <p className="text-sm text-muted-foreground">ยอดที่บันทึก <span className="font-semibold tabular-nums text-foreground">{formatBaht(purchaseTotal)}</span></p>}
          </div>
          {purchases.length === 0 ? <div className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">ยังไม่มีประวัติการซื้อคอร์ส</div> : (
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">{purchases.map(purchase => { const confirmedAt = getPurchaseConfirmation(purchase, confirmationByPurchase); return (
              <div key={purchase.topic_id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-medium text-foreground">{COURSES[purchase.topic_id]?.name ?? purchase.topic_id}</p><p className="mt-1 text-xs text-muted-foreground">{getPaymentLabel(purchase.payment_method)}{confirmedAt ? ` · ยืนยัน ${formatDate(confirmedAt)}` : ''}</p></div>
                <div className="flex items-center justify-between gap-4 sm:justify-end"><span className="inline-flex rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400">เปิดสิทธิ์แล้ว</span><span className="min-w-20 text-right font-semibold tabular-nums text-foreground">{formatBaht(purchase.price_thb ?? 0)}</span></div>
              </div>
            )})}</div>
          )}
        </section>

        <section aria-labelledby="summary-heading" className="mb-10">
          <h2 id="summary-heading" className="mb-4 text-lg font-semibold text-foreground">ภาพรวมการเรียน</h2>
          <div className="grid overflow-hidden rounded-2xl border border-border bg-card sm:grid-cols-2 lg:grid-cols-4">
            {([['โจทย์ที่ทำแล้ว', `${progress.length} ข้อ`], ['ตอบถูก', `${correct} ข้อ`], ['ความแม่นยำ', accuracy === null ? '—' : `${accuracy}%`], ['เวลามัธยฐานต่อข้อ', formatDuration(overallMedianSeconds)]] as const).map(([label, value], index) => (
              <div key={label} className={`px-5 py-5 ${index > 0 ? 'border-t border-border sm:border-t-0 sm:border-l' : ''} ${index === 2 ? 'sm:border-l-0 lg:border-l' : ''}`}><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{value}</p></div>
            ))}
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <section aria-labelledby="topics-heading">
            <h2 id="topics-heading" className="text-lg font-semibold text-foreground">ผลงานแยกตามบท</h2><p className="mb-4 mt-1 text-sm text-muted-foreground">เรียงบทที่ควรดูแลก่อน โดยวิเคราะห์ทั้งความถูกต้องและเวลาที่ใช้</p>
            {topicStats.length === 0 ? <div className="rounded-2xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">นักเรียนคนนี้ยังไม่ได้เริ่มทำแบบฝึกหัด</div> : (
              <div className="divide-y divide-border rounded-2xl border border-border bg-card">{topicStats.map(topic => (
                <div key={topic.topicId} className="px-5 py-4">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{TOPIC_NAMES[topic.topicId] ?? topic.topicId}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">ถูก {topic.correct} จาก {topic.total} ข้อ · {formatDuration(topic.medianSeconds)} ต่อข้อ</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`block text-sm font-semibold tabular-nums ${topic.accuracy >= 80 ? 'text-green-600' : topic.accuracy >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{topic.accuracy}%</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{topic.statusLabel}</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true"><div className={`h-full rounded-full ${topic.accuracy >= 80 ? 'bg-green-500' : topic.accuracy >= 60 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${topic.accuracy}%` }} /></div>
                </div>
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
