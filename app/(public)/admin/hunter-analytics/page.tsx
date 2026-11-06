import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'
import { getServerExamSet } from '@/lib/hunter-exam-set-server'
import { getBangkokMonthKey } from '@/lib/hunter-ranking'
import { analyzeHunterExam, type AnalysisSession } from '@/lib/hunter-exam-analysis'

export const dynamic = 'force-dynamic'

export default async function HunterAnalyticsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')
  const requested = (await searchParams).month
  const month = requested && /^\d{4}-(0[1-9]|1[0-2])$/.test(requested) ? requested : getBangkokMonthKey()
  const examType = `hunter-rank-${month}`
  const exam = await getServerExamSet(examType)
  if (!exam) return <main className="mx-auto max-w-3xl px-5 py-10"><h1 className="text-xl font-semibold">ยังไม่มีข้อสอบที่อนุมัติสำหรับเดือน {month}</h1><form className="mt-5 flex flex-wrap gap-3"><label>เลือกเดือน <input name="month" type="month" defaultValue={month} className="rounded-lg border border-border bg-background p-2" /></label><button className="rounded-lg border border-border px-4 py-2">ดูผล</button></form><Link href="/admin/hunter-exam/draft" className="mt-5 inline-block underline">เตรียมชุดสอบรายเดือน</Link></main>
  const admin = createAdminClient()
  const { data, error } = await admin.from('exam_sessions')
    .select('id, question_ids, answers, started_at, submitted_at')
    .eq('exam_type', examType).not('submitted_at', 'is', null)
    .order('submitted_at', { ascending: false }).limit(1000)
  const analysis = analyzeHunterExam(exam.questions, (data ?? []) as AnalysisSession[])
  return <main className="mx-auto max-w-6xl px-5 py-10">
    <h1 className="text-2xl font-semibold">คุณภาพข้อสอบวัดระดับ</h1>
    <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">เดือน {month} · สรุปจากรอบสอบที่ส่งแล้ว ใช้ช่วยตรวจข้อสอบและหาประเด็นที่ควรทบทวน</p>
    <form className="mt-4 flex flex-wrap items-end gap-3"><label className="text-sm">เลือกเดือน <input name="month" type="month" defaultValue={month} className="ml-2 rounded-lg border border-border bg-background p-2" /></label><button className="rounded-lg border border-border px-4 py-2 text-sm">ดูผล</button></form>
    <div className="mt-5 flex flex-wrap gap-3"><Link href="/admin/hunter-exam" className="rounded-lg border border-border px-4 py-2 text-sm">ดูโจทย์และเฉลย</Link><Link href="/admin/hunter-exam/student-view" className="rounded-lg border border-border px-4 py-2 text-sm">ทดลองมุมมองนักเรียน</Link><Link href="/admin/hunter-exam/draft" className="rounded-lg border border-border px-4 py-2 text-sm">เตรียมชุดสอบรายเดือน</Link></div>
    {error ? <p role="alert" className="mt-8 rounded-lg border border-destructive/30 p-5">โหลดข้อมูลรอบสอบไม่สำเร็จ กรุณาลองใหม่</p> : <>
      <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="ภาพรวมข้อสอบ">
        <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">ส่งข้อสอบแล้ว</p><strong className="mt-2 block text-2xl">{analysis.completed} รอบ</strong></div>
        <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">ส่งภายใน 5 นาที</p><strong className="mt-2 block text-2xl">{analysis.shortSessions} รอบ</strong></div>
        <div className="rounded-xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">เวลาเริ่ม–ส่งผิดปกติ</p><strong className="mt-2 block text-2xl">{analysis.invalidDurations} รอบ</strong></div>
      </section>
      <p className="mt-3 text-xs leading-6 text-muted-foreground">ตัวเลขเวลาเป็นสัญญาณให้ครูตรวจเพิ่มเติม ไม่ใช่หลักฐานการทุจริต แสดงไม่เกิน 1,000 รอบล่าสุด และอัตราถูกคิดจากคนที่ตอบข้อนั้น</p>
      <section className="mt-8 overflow-x-auto rounded-xl border border-border bg-card"><h2 className="p-5 text-lg font-semibold">ผลรายข้อ</h2><table className="w-full min-w-[620px] text-left text-sm"><thead className="bg-muted/50"><tr><th className="p-4">ข้อ</th><th className="p-4">บท</th><th className="p-4">ตอบ</th><th className="p-4">ถูก</th><th className="p-4">เว้นว่าง</th><th className="p-4">อัตราถูก</th></tr></thead><tbody>{analysis.items.map(item => <tr key={item.question.id} className="border-t border-border"><td className="p-4">{item.number}</td><td className="p-4">{item.question.topicId}</td><td className="p-4">{item.answered}/{item.eligible}</td><td className="p-4">{item.correct}</td><td className="p-4">{item.omitted}</td><td className="p-4">{item.accuracy === null ? 'ยังไม่มีข้อมูล' : `${item.accuracy}%`}</td></tr>)}</tbody></table></section>
    </>}
  </main>
}
