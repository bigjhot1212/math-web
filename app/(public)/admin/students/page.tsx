import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BookOpenCheck, ChevronRight, CircleCheckBig, UsersRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'
import { COURSES } from '@/content/course-videos'
import {
  buildConfirmationMap,
  getPurchaseConfirmation,
  type AdminPurchaseRow,
  type ConfirmedTransferRow,
} from '@/lib/admin-course-purchases'

type ProgressSummary = { user_id: string; is_correct: boolean; answered_at: string }
type ExamSummary = { user_id: string; submitted_at: string | null }

function formatActivity(value?: string | null) {
  if (!value) return 'ยังไม่เริ่มฝึก'
  return new Date(value).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatBaht(value: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(value)
}

export default async function StudentsAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')

  const admin = createAdminClient()
  const [profilesResult, purchasesResult, transfersResult, authResult] = await Promise.all([
    admin.from('student_profiles').select('*').order('updated_at', { ascending: false }),
    admin.from('topic_purchases').select('user_id, topic_id, price_thb, payment_method'),
    admin.from('bank_transfer_requests').select('user_id, topic_id, bundle_id, confirmed_at').eq('status', 'confirmed'),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ])

  const profiles = profilesResult.data ?? []
  const purchases = (purchasesResult.data ?? []) as AdminPurchaseRow[]
  const transfers = (transfersResult.data ?? []) as ConfirmedTransferRow[]
  const authUsers = authResult.data?.users ?? []
  const profileById = new Map(profiles.map(profile => [profile.user_id, profile]))
  const authById = new Map(authUsers.map(authUser => [authUser.id, authUser]))
  const confirmationByPurchase = buildConfirmationMap(transfers)
  const studentIds = [...new Set([...profiles.map(profile => profile.user_id), ...purchases.map(purchase => purchase.user_id)])]
  const [{ data: progressRows }, { data: examRows }] = studentIds.length > 0
    ? await Promise.all([
        admin.from('user_progress').select('user_id, is_correct, answered_at').in('user_id', studentIds),
        admin.from('exam_sessions').select('user_id, submitted_at').in('user_id', studentIds).not('submitted_at', 'is', null),
      ])
    : [{ data: [] }, { data: [] }]

  const progress = (progressRows ?? []) as ProgressSummary[]
  const exams = (examRows ?? []) as ExamSummary[]
  const emailById = new Map(authUsers.map(authUser => [authUser.id, authUser.email]))
  const summaries = studentIds.map(userId => {
    const profile = profileById.get(userId)
    const authUser = authById.get(userId)
    const studentPurchases = purchases.filter(purchase => purchase.user_id === userId)
    const answers = progress.filter(row => row.user_id === userId)
    const correct = answers.filter(row => row.is_correct).length
    const submittedExams = exams.filter(row => row.user_id === userId)
    const confirmationDates = studentPurchases
      .map(purchase => getPurchaseConfirmation(purchase, confirmationByPurchase))
      .filter((value): value is string => Boolean(value))
    const activityDates = [profile?.updated_at, authUser?.created_at, ...confirmationDates, ...answers.map(row => row.answered_at), ...submittedExams.map(row => row.submitted_at).filter(Boolean)].filter(Boolean) as string[]
    const lastActivity = activityDates.filter(Boolean).sort((a, b) => Date.parse(b) - Date.parse(a))[0]
    return {
      user_id: userId,
      full_name: profile?.full_name || authUser?.user_metadata?.full_name || emailById.get(userId)?.split('@')[0] || 'ยังไม่กรอกชื่อ',
      grade: profile?.grade || 'ยังไม่กรอก',
      email: emailById.get(userId) ?? null,
      answered: answers.length,
      accuracy: answers.length > 0 ? Math.round((correct / answers.length) * 100) : null,
      examCount: submittedExams.length,
      purchases: studentPurchases,
      purchaseTotal: studentPurchases.reduce((sum, purchase) => sum + (purchase.price_thb ?? 0), 0),
      latestConfirmation: confirmationDates.sort((a, b) => Date.parse(b) - Date.parse(a))[0] ?? null,
      lastActivity,
    }
  }).sort((a, b) => Date.parse(b.lastActivity ?? '0') - Date.parse(a.lastActivity ?? '0'))

  const purchasers = summaries.filter(student => student.purchases.length > 0)
  const recordedRevenue = purchases.reduce((sum, purchase) => sum + (purchase.price_thb ?? 0), 0)

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground">ความก้าวหน้าของนักเรียน</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">เปิดดูข้อมูลเป้าหมาย ผลการฝึก และประวัติการสอบของนักเรียนแต่ละคนได้จากหน้านี้</p>
          </div>
          <Link href="/admin/bank-transfers" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">ตรวจสลิปการโอน</Link>
        </header>

        <div className="mb-5 grid gap-4 border-y border-border py-4 sm:grid-cols-3">
          <div className="flex items-center gap-3"><UsersRound className="size-5 text-primary" aria-hidden="true" /><p className="text-sm text-muted-foreground">นักเรียน <span className="font-semibold tabular-nums text-foreground">{summaries.length}</span> คน</p></div>
          <div className="flex items-center gap-3"><BookOpenCheck className="size-5 text-primary" aria-hidden="true" /><p className="text-sm text-muted-foreground">ซื้อคอร์สแล้ว <span className="font-semibold tabular-nums text-foreground">{purchasers.length}</span> คน</p></div>
          <div className="flex items-center gap-3"><CircleCheckBig className="size-5 text-primary" aria-hidden="true" /><p className="text-sm text-muted-foreground">ยอดที่บันทึก <span className="font-semibold tabular-nums text-foreground">{formatBaht(recordedRevenue)}</span></p></div>
        </div>

        {summaries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border px-6 py-14 text-center">
            <h2 className="font-semibold text-foreground">ยังไม่มีข้อมูลนักเรียน</h2>
            <p className="mt-2 text-sm text-muted-foreground">เมื่อนักเรียนกรอกโปรไฟล์ รายชื่อจะปรากฏที่นี่</p>
          </div>
        ) : (
          <>
          <div className="grid gap-4 xl:hidden" aria-label="รายชื่อนักเรียน">
            {summaries.map(student => (
              <article key={student.user_id} className="min-w-0 rounded-lg border border-border bg-card p-5">
                <Link href={`/admin/students/${student.user_id}`} className="font-heading text-lg font-semibold text-primary underline-offset-4 hover:underline">{student.full_name}</Link>
                <p className="mt-1 break-all text-xs text-muted-foreground">{student.email ?? 'ยังไม่มีอีเมล'} · {student.grade}</p>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div><dt className="text-xs text-muted-foreground">การเรียน</dt><dd className="mt-1">{student.answered} ข้อ · {student.examCount} สนาม</dd></div>
                  <div><dt className="text-xs text-muted-foreground">ความแม่นยำ</dt><dd className="mt-1">{student.accuracy === null ? 'ยังไม่มีข้อมูล' : `${student.accuracy}%`}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">การชำระเงิน</dt><dd className="mt-1">{student.purchases.length > 0 ? `ชำระแล้ว ${formatBaht(student.purchaseTotal)}` : 'ยังไม่มีคอร์ส'}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">ใช้งานล่าสุด</dt><dd className="mt-1">{formatActivity(student.lastActivity)}</dd></div>
                </dl>
                <p className="mt-4 text-sm text-muted-foreground">คอร์สที่เปิดสิทธิ์: {student.purchases.length > 0 ? student.purchases.map(purchase => COURSES[purchase.topic_id]?.name ?? purchase.topic_id).join(', ') : 'ยังไม่มีคอร์ส'}</p>
                {student.latestConfirmation && <p className="mt-2 text-xs text-muted-foreground">ยืนยันล่าสุด {formatActivity(student.latestConfirmation)}</p>}
                <Link href={`/admin/students/${student.user_id}`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">ดูความก้าวหน้า<ChevronRight className="size-4" aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
          <div role="region" aria-label="รายชื่อนักเรียน เลื่อนแนวนอนเพื่อดูข้อมูลทั้งหมด" tabIndex={0} className="hidden max-w-full overflow-x-auto rounded-lg border border-border bg-card xl:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground"><tr><th className="px-5 py-3.5 font-medium">นักเรียน</th><th className="px-4 py-3.5 font-medium">ชั้น</th><th className="px-4 py-3.5 font-medium">คอร์สที่เปิดสิทธิ์</th><th className="px-4 py-3.5 font-medium">การชำระเงิน</th><th className="px-4 py-3.5 font-medium">การเรียน</th><th className="px-4 py-3.5 font-medium">ใช้งานล่าสุด</th><th className="w-14 px-4 py-3.5"><span className="sr-only">ดูรายละเอียด</span></th></tr></thead>
              <tbody>{summaries.map(student => (
                <tr key={student.user_id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-4"><Link href={`/admin/students/${student.user_id}`} className="font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:underline">{student.full_name}</Link>{student.email && <p className="mt-0.5 text-xs text-muted-foreground">{student.email}</p>}</td>
                  <td className="px-4 py-4 text-muted-foreground">{student.grade}</td>
                  <td className="max-w-72 px-4 py-4">{student.purchases.length > 0 ? <><p className="line-clamp-2 font-medium text-foreground">{student.purchases.slice(0, 2).map(purchase => COURSES[purchase.topic_id]?.name ?? purchase.topic_id).join(', ')}</p>{student.purchases.length > 2 && <p className="mt-1 text-xs text-muted-foreground">และอีก {student.purchases.length - 2} คอร์ส</p>}</> : <span className="text-muted-foreground">ยังไม่มีคอร์ส</span>}</td>
                  <td className="px-4 py-4">{student.purchases.length > 0 ? <><span className="inline-flex rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-semibold text-green-700">ชำระแล้ว</span><p className="mt-1.5 text-xs tabular-nums text-muted-foreground">{formatBaht(student.purchaseTotal)}{student.latestConfirmation ? ` · ${formatActivity(student.latestConfirmation)}` : ''}</p></> : <span className="text-muted-foreground">—</span>}</td>
                  <td className="px-4 py-4"><p className="tabular-nums text-foreground">{student.answered} ข้อ · {student.examCount} สนาม</p><p className={`mt-1 text-xs font-semibold tabular-nums ${student.accuracy === null ? 'text-muted-foreground' : student.accuracy >= 80 ? 'text-green-700' : student.accuracy >= 60 ? 'text-amber-700' : 'text-red-700'}`}>{student.accuracy === null ? 'ยังไม่มีข้อมูลความแม่นยำ' : `แม่นยำ ${student.accuracy}%`}</p></td>
                  <td className="px-4 py-4 text-muted-foreground">{formatActivity(student.lastActivity)}</td>
                  <td className="px-4 py-4"><Link href={`/admin/students/${student.user_id}`} aria-label={`ดูความก้าวหน้าของ ${student.full_name}`} className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ChevronRight className="size-4" aria-hidden="true" /></Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </main>
  )
}
