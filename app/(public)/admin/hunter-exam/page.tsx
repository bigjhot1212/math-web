import { redirect } from 'next/navigation'
import { InlineMath } from 'react-katex'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/payment-config'
import { getMath1MockSet } from '@/lib/content/math1-mock-sets'
import { formatMathForDisplay } from '@/lib/format-math'

export const dynamic = 'force-dynamic'

function mathText(value: string) {
  return value.split(/(\$[^$]+\$)/g).map((part, index) =>
    part.startsWith('$') && part.endsWith('$')
      ? <InlineMath key={index} math={formatMathForDisplay(part.slice(1, -1))} />
      : <span key={index}>{part.replaceAll('**', '')}</span>,
  )
}

export default async function AdminHunterExamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')
  const exam = getMath1MockSet('hunter-rank-2026-11')
  if (!exam) return <main>ยังไม่พบข้อสอบ</main>
  return <main className="mx-auto max-w-4xl px-5 py-10">
    <h1 className="text-2xl font-bold">ตรวจข้อสอบวัดระดับชุดแรก</h1>
    <p className="mt-2 text-sm text-muted-foreground">หน้านี้เฉพาะแอดมิน · แสดงโจทย์พร้อมเฉลยเพื่อทบทวนก่อนเปิดสอบ</p>
    <div className="mt-8 space-y-5">{exam.questions.map((question, index) => <details key={question.id} className="rounded-xl border border-border bg-card p-5">
      <summary className="cursor-pointer font-semibold">ข้อ {index + 1} · {question.type === 'short-answer' ? 'เติมคำตอบ' : 'ปรนัย'}</summary>
      <p className="mt-4 whitespace-pre-wrap leading-8">{mathText(question.content.text)}</p>
      {question.content.image && <img src={question.content.image} alt={`ภาพประกอบข้อ ${index + 1}`} className="mt-4 max-h-80 max-w-full" />}
      {question.content.choices && <ol className="mt-4 space-y-2">{Object.entries(question.content.choices).map(([key, choice]) => <li key={key}>{key.toUpperCase()}. {mathText(choice)}</li>)}</ol>}
      <p className="mt-5 font-semibold">คำตอบ: {mathText(String(question.answer))}</p>
      <h2 className="mt-5 font-semibold">เฉลยละเอียด</h2>
      <div className="mt-3 space-y-3 text-sm leading-7">{question.solution.steps.map((step, stepIndex) => <p key={stepIndex}>{mathText(step)}</p>)}</div>
    </details>)}</div>
  </main>
}
