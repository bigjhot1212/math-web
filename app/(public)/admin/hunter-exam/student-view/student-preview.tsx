'use client'

import { useState } from 'react'
import Link from 'next/link'
import { InlineMath } from 'react-katex'
import Scratchpad from '@/app/components/scratchpad'
import { calculateExamPoints, hasExamAnswer, isCorrectExamAnswer } from '@/lib/exam-scoring'
import { formatMathForDisplay } from '@/lib/format-math'
import type { Question } from '@/lib/types/question'

function mathText(text: string) {
  return text.split(/(\$[^$]+\$)/g).map((part, index) => part.startsWith('$') && part.endsWith('$')
    ? <InlineMath key={index} math={formatMathForDisplay(part.slice(1, -1))} />
    : <span key={index}>{part.replaceAll('**', '')}</span>)
}

export default function StudentExamPreview({ questions }: { questions: Question[] }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const question = questions[current]
  const count = questions.filter(item => hasExamAnswer(answers[item.id])).length
  const correct = questions.filter(item => isCorrectExamAnswer(item, answers[item.id])).length
  const wrong = count - correct
  const points = calculateExamPoints(questions, answers)

  if (submitted) return <main className="mx-auto max-w-4xl px-5 py-10">
    <p className="mb-6 rounded-lg border border-border bg-card p-4 text-sm">มุมมองทดลองสำหรับแอดมิน · ผลนี้ไม่ถูกบันทึกและไม่ส่งผลต่อแรงก์</p>
    <section className="border-b border-border pb-8 text-center">
      <h1 className="text-2xl font-semibold">ผลสอบวัดระดับ</h1>
      <p className="mt-4 text-5xl font-bold text-primary">{Math.round(points.points / points.maximumPoints * 100)}%</p>
      <p className="mt-3">{points.points} / {points.maximumPoints} คะแนน</p>
      <p className="mt-2 text-sm text-muted-foreground">ถูก {correct} ข้อ · ผิด {wrong} ข้อ · ไม่ได้ตอบ {questions.length - count} ข้อ</p>
      <p className="mt-2 text-sm text-muted-foreground">ได้จากข้อถูก +{points.earnedPoints} · หักข้อผิด −{points.penaltyPoints}</p>
    </section>
    <h2 className="mb-4 mt-8 text-lg font-semibold">รายละเอียดแต่ละข้อ</h2>
    <div className="space-y-3">{questions.map((item, index) => {
      const answer = answers[item.id]
      const status = !hasExamAnswer(answer) ? 'ไม่ได้ตอบ' : isCorrectExamAnswer(item, answer) ? 'ถูก' : 'ผิด'
      return <details key={item.id} className="rounded-lg border border-border bg-card p-4">
        <summary className="cursor-pointer font-semibold">ข้อ {index + 1} · {status}</summary>
        <p className="mt-4 whitespace-pre-wrap leading-7">{mathText(item.content.text)}</p>
        {item.content.image && <img src={item.content.image} alt={`ภาพประกอบข้อ ${index + 1}`} className="mt-4 max-h-80 max-w-full bg-white" />}
        {item.content.choices && <ol className="mt-4 space-y-2">{Object.entries(item.content.choices).map(([key, value]) => <li key={key}>{key.toUpperCase()}. {mathText(value)}</li>)}</ol>}
        <p className="mt-4 text-sm">คำตอบของคุณ: {answer || 'ไม่ได้ตอบ'} · เฉลย: {String(item.answer).toUpperCase()}</p>
        <h3 className="mt-5 font-semibold">วิธีทำทีละขั้น</h3>
        <div className="mt-3 space-y-3 text-sm leading-7">{item.solution.steps.map((step, i) => <p key={i}>{mathText(step)}</p>)}</div>
      </details>
    })}</div>
    <button className="mt-6 rounded-lg bg-primary px-4 py-3 text-primary-foreground" onClick={() => { setAnswers({}); setCurrent(0); setSubmitted(false) }}>เริ่มทดลองใหม่</button>
    <Link className="ml-4 text-sm underline" href="/admin/hunter-exam">กลับหน้าตรวจข้อสอบ</Link>
  </main>

  return <main className="min-h-screen bg-background">
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950">มุมมองทดลองสำหรับแอดมิน · ไม่บันทึกผลและไม่ใช้สิทธิ์สอบจริง · ตัวจับเวลาเป็นภาพตัวอย่าง</div>
    <header className="exam-session-header sticky z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-4 py-3">
      <span className="text-sm text-muted-foreground">ตอบแล้ว <strong>{count}</strong>/{questions.length}</span>
      <span className="font-mono text-xl">90:00</span>
      <button onClick={() => setConfirm(true)} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">ส่งข้อสอบ</button>
    </header>
    <div className="flex">
      <aside className="hidden w-44 shrink-0 border-r border-border p-4 md:block"><p className="mb-3 text-xs text-muted-foreground">นำทางข้อสอบ</p><div className="grid grid-cols-4 gap-1.5">{questions.map((item, index) => <button key={item.id} onClick={() => setCurrent(index)} className={`h-8 rounded-lg text-xs ${index === current ? 'bg-primary text-primary-foreground' : answers[item.id] ? 'bg-primary/15 text-primary' : 'border border-border'}`}>{index + 1}</button>)}</div></aside>
      <section className="mx-auto w-full max-w-3xl p-6 md:p-10">
        <p className="mb-6 text-sm text-muted-foreground">ข้อที่ {current + 1}</p>
        <div className="mb-8 whitespace-pre-wrap text-base leading-relaxed">{mathText(question.content.text)}</div>
        {question.content.image && <img src={question.content.image} alt={`ภาพประกอบข้อ ${current + 1}`} className="mb-5 max-h-80 max-w-full rounded-lg bg-white" />}
        <Scratchpad key={question.id} storageKey={`admin-preview:${question.id}`} title={`กระดาษทด · ข้อ ${current + 1}`} question={<div>{mathText(question.content.text)}</div>} />
        {question.content.choices && <div className="flex flex-col gap-3">{Object.entries(question.content.choices).map(([key, value]) => <button key={key} onClick={() => setAnswers(previous => ({ ...previous, [question.id]: key }))} className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left text-sm ${answers[question.id] === key ? 'border-primary bg-primary/10' : 'border-border hover:bg-accent/50'}`}><span className="w-6 shrink-0 font-semibold uppercase">{key}.</span>{mathText(value)}</button>)}</div>}
        {question.type === 'short-answer' && <label className="block rounded-lg border border-primary/25 bg-primary/5 p-5 text-sm">ระบายคำตอบที่เป็นตัวเลข<input value={answers[question.id] ?? ''} onChange={event => setAnswers(previous => ({ ...previous, [question.id]: event.target.value }))} inputMode="decimal" placeholder="กรอกคำตอบ เช่น 12 หรือ 3.5" className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-lg" /></label>}
        <div className="mt-10 flex justify-between"><button disabled={current === 0} onClick={() => setCurrent(current - 1)} className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-30">ก่อนหน้า</button><button onClick={() => current === questions.length - 1 ? setConfirm(true) : setCurrent(current + 1)} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">{current === questions.length - 1 ? 'ส่งข้อสอบ' : 'ถัดไป'}</button></div>
      </section>
    </div>
    <nav aria-label="เลือกข้อสอบ" className="flex gap-2 overflow-x-auto border-t border-border p-3 md:hidden">{questions.map((item, index) => <button key={item.id} onClick={() => setCurrent(index)} className={`h-9 w-9 shrink-0 rounded-lg text-xs ${index === current ? 'bg-primary text-primary-foreground' : answers[item.id] ? 'bg-primary/15 text-primary' : 'border border-border'}`}>{index + 1}</button>)}</nav>
    {confirm && <div role="dialog" aria-modal="true" aria-labelledby="preview-confirm" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"><div className="w-full max-w-md rounded-xl bg-background p-6"><h2 id="preview-confirm" className="text-lg font-semibold">ส่งข้อสอบทั้งชุด?</h2><p className="mt-3 text-sm text-muted-foreground">ตอบแล้ว {count} จาก {questions.length} ข้อ · ยังไม่ได้ตอบ {questions.length - count} ข้อ</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setConfirm(false)} className="rounded-lg border border-border px-4 py-2">กลับไปทำต่อ</button><button onClick={() => { setSubmitted(true); setConfirm(false); window.scrollTo(0, 0) }} className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">ยืนยันส่งข้อสอบ</button></div></div></div>}
  </main>
}
