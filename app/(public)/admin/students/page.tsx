import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronRight, UsersRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'

type ProgressSummary = { user_id: string; is_correct: boolean; answered_at: string }
type ExamSummary = { user_id: string; submitted_at: string | null }

function formatActivity(value?: string | null) {
  if (!value) return 'ยังไม่เริ่มฝึก'
  return new Date(value).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function StudentsAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')

  const admin = createAdminClient()
  const { data: students } = await admin.from('student_profiles').select('*').order('updated_at', { ascending: false })
  const studentIds = (students ?? []).map(student => student.user_id)
  const [{ data: progressRows }, { data: examRows }, { data: authData }] = studentIds.length > 0
    ? await Promise.all([
        admin.from('user_progress').select('user_id, is_correct, answered_at').in('user_id', studentIds),
        admin.from('exam_sessions').select('user_id, submitted_at').in('user_id', studentIds).not('submitted_at', 'is', null),
        admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      ])
    : [{ data: [] }, { data: [] }, { data: { users: [] } }]

  const progress = (progressRows ?? []) as ProgressSummary[]
  const exams = (examRows ?? []) as ExamSummary[]
  const emailById = new Map(authData?.users?.map(authUser => [authUser.id, authUser.email]) ?? [])
  const summaries = (students ?? []).map(student => {
    const answers = progress.filter(row => row.user_id === student.user_id)
    const correct = answers.filter(row => row.is_correct).length
    const submittedExams = exams.filter(row => row.user_id === student.user_id)
    const activityDates = [student.updated_at, ...answers.map(row => row.answered_at), ...submittedExams.map(row => row.submitted_at).filter(Boolean)] as string[]
    const lastActivity = activityDates.filter(Boolean).sort((a, b) => Date.parse(b) - Date.parse(a))[0]
    return {
      ...student,
      email: emailById.get(student.user_id) ?? null,
      answered: answers.length,
      accuracy: answers.length > 0 ? Math.round((correct / answers.length) * 100) : null,
      examCount: submittedExams.length,
      lastActivity,
    }
  })

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:px-8 md:py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground">ความก้าวหน้าของนักเรียน</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">เปิดดูข้อมูลเป้าหมาย ผลการฝึก และประวัติการสอบของนักเรียนแต่ละคนได้จากหน้านี้</p>
          </div>
          <Link href="/admin/bank-transfers" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">ตรวจสลิปการโอน</Link>
        </header>

        <div className="mb-5 flex items-center gap-3 border-y border-border py-4">
          <UsersRound className="size-5 text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">นักเรียนที่กรอกข้อมูลแล้ว <span className="font-semibold tabular-nums text-foreground">{summaries.length}</span> คน</p>
        </div>

        {summaries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
            <h2 className="font-semibold text-foreground">ยังไม่มีข้อมูลนักเรียน</h2>
            <p className="mt-2 text-sm text-muted-foreground">เมื่อนักเรียนกรอกโปรไฟล์ รายชื่อจะปรากฏที่นี่</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground"><tr><th className="px-5 py-3.5 font-medium">นักเรียน</th><th className="px-4 py-3.5 font-medium">ชั้น</th><th className="px-4 py-3.5 font-medium">ทำโจทย์แล้ว</th><th className="px-4 py-3.5 font-medium">ความแม่นยำ</th><th className="px-4 py-3.5 font-medium">สอบจำลอง</th><th className="px-4 py-3.5 font-medium">ใช้งานล่าสุด</th><th className="w-14 px-4 py-3.5"><span className="sr-only">ดูรายละเอียด</span></th></tr></thead>
              <tbody>{summaries.map(student => (
                <tr key={student.user_id} className="border-b border-border last:border-0 hover:bg-accent/40">
                  <td className="px-5 py-4"><Link href={`/admin/students/${student.user_id}`} className="font-medium text-foreground hover:text-primary focus-visible:outline-none focus-visible:underline">{student.full_name}</Link>{student.email && <p className="mt-0.5 text-xs text-muted-foreground">{student.email}</p>}</td>
                  <td className="px-4 py-4 text-muted-foreground">{student.grade}</td>
                  <td className="px-4 py-4 tabular-nums text-foreground">{student.answered} ข้อ</td>
                  <td className="px-4 py-4"><span className={`font-semibold tabular-nums ${student.accuracy === null ? 'text-muted-foreground' : student.accuracy >= 80 ? 'text-green-600' : student.accuracy >= 60 ? 'text-amber-600' : 'text-red-500'}`}>{student.accuracy === null ? '—' : `${student.accuracy}%`}</span></td>
                  <td className="px-4 py-4 tabular-nums text-muted-foreground">{student.examCount} ครั้ง</td>
                  <td className="px-4 py-4 text-muted-foreground">{formatActivity(student.lastActivity)}</td>
                  <td className="px-4 py-4"><Link href={`/admin/students/${student.user_id}`} aria-label={`ดูความก้าวหน้าของ ${student.full_name}`} className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ChevronRight className="size-4" aria-hidden="true" /></Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
