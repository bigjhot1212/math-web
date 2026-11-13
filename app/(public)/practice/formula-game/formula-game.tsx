'use client'

import Link from 'next/link'
import { useState } from 'react'
import { QUESTIONS, type Level } from './questions'

const LEVELS: { id: Level; name: string; description: string }[] = [
  { id: 'start', name: 'เริ่มต้น', description: 'รู้จักแนวคิดและเลือกสูตรจากโจทย์สั้น' },
  { id: 'middle', name: 'ปานกลาง', description: 'เชื่อมวิธีคิดและสูตร 2–3 ขั้น' },
  { id: 'challenge', name: 'ท้าทาย', description: 'วางแผนหลายขั้นและตรวจเงื่อนไข' },
]

export default function FormulaGame() {
  const [level, setLevel] = useState<Level | null>(null)
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState<string[]>([])
  const [feedback, setFeedback] = useState('')
  const [hint, setHint] = useState(false)
  const [finished, setFinished] = useState(false)
  const questions = QUESTIONS.filter(question => question.level === level)
  const current = questions[index]
  const completed = Boolean(current && done.includes(current.finish))
  const options = current ? [...current.steps.map(item => ({ ...item, valid: true, feedback: '' })), ...current.distractors.map(item => ({ ...item, id: `wrong-${item.label}`, valid: false }))].sort((a, b) => {
    const hash = (value: string) => [...`${current.id}:${value}`].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7)
    return hash(a.id) - hash(b.id)
  }) : []

  function start(next: Level) { setLevel(next); setIndex(0); setDone([]); setFeedback(''); setHint(false); setFinished(false) }
  function next() { if (index + 1 >= questions.length) setFinished(true); else { setIndex(index + 1); setDone([]); setFeedback(''); setHint(false) } }
  function choose(id: string) {
    const selected = current.steps.find(item => item.id === id)
    if (!selected) return
    if (done.includes(id)) { setFeedback('ขั้นนี้ทำแล้ว ลองเลือกขั้นต่อไป'); return }
    if (selected.requires?.some(required => !done.includes(required))) { setFeedback(selected.missing ?? 'ยังขาดข้อมูลบางอย่าง ลองหาข้อมูลที่จำเป็นก่อน'); return }
    setDone([...done, id]); setFeedback(''); setHint(false)
  }

  if (!level || finished) return <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 sm:px-8">
    <Link href="/practice" className="text-sm font-semibold text-primary underline underline-offset-4">← กลับไปแบบฝึกหัด</Link>
    <div className="mt-8 max-w-2xl"><p className="font-semibold text-primary">แคลคูลัส · ชุดฝึก {QUESTIONS.length} ข้อ</p><h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">{finished ? 'จบชุดนี้แล้ว!' : 'เลือกสูตร แล้วไปต่อ'}</h1><p className="mt-4 leading-7 text-muted-foreground">อ่านโจทย์ เลือกว่าควรทำอะไรต่อ แล้วดูวิธีคิดทีละขั้น เกมช่วยคำนวณให้ และไม่กระทบแรงก์ฮันเตอร์</p></div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">{LEVELS.map(item => <button key={item.id} onClick={() => start(item.id)} className="min-h-40 rounded-xl border border-border bg-card p-6 text-left hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><span className="font-heading text-xl font-bold text-primary">{item.name}</span><span className="mt-3 block leading-6 text-muted-foreground">{item.description}</span><span className="mt-4 block text-sm font-semibold">เล่น {QUESTIONS.filter(question => question.level === item.id).length} ข้อ →</span></button>)}</div>
    <p className="mt-7 text-sm leading-6 text-muted-foreground">โจทย์แต่งใหม่อิงแนวข้อสอบ A-Level และ PAT1 ครอบคลุมลิมิต ความต่อเนื่อง อนุพันธ์ การประยุกต์ และอินทิกรัล ความคืบหน้าจะเริ่มใหม่เมื่อออกจากหน้า</p>
  </main>

  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-8 sm:px-8">
    <button onClick={() => setLevel(null)} className="text-sm font-semibold text-primary underline underline-offset-4">← เลือกระดับใหม่</button>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="font-semibold text-primary">{LEVELS.find(item => item.id === level)?.name} · ข้อ {index + 1} / {questions.length} · {current.topic}</p><span className="text-sm text-muted-foreground">ฝึกวางแผน · ไม่กระทบแรงก์</span></div>
    <section className="mt-4 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8"><h1 className="font-heading text-xl font-bold">โจทย์</h1><p className="mt-4 text-xl leading-8 sm:text-2xl">{current.prompt}</p></section>
    <div className="mt-7 grid gap-8 md:grid-cols-2"><section><h2 className="font-heading text-xl font-bold">{completed ? 'ทำข้อนี้สำเร็จแล้ว' : 'เลือกสิ่งที่ควรทำต่อ'}</h2><p className="mt-2 text-sm text-muted-foreground">บางข้อเลือกขั้นตอนที่เป็นอิสระต่อกันสลับลำดับได้</p><div className="mt-4 grid gap-2">{options.map(item => <button key={item.id} disabled={completed} onClick={() => item.valid ? choose(item.id) : setFeedback(item.feedback)} className="rounded-lg border border-border bg-card px-4 py-3 text-left hover:border-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60"><span className="font-semibold">{item.label}</span><span className="ml-2 text-sm text-muted-foreground">{item.formula}</span>{done.includes(item.id) && <span className="ml-2 text-sm text-primary">✓ ทำแล้ว</span>}</button>)}</div>{!completed && <button onClick={() => setHint(!hint)} className="mt-4 font-semibold text-primary underline underline-offset-4">{hint ? 'ซ่อนคำใบ้' : 'ขอคำใบ้'}</button>}{hint && <p className="mt-2 text-sm leading-6 text-muted-foreground">{current.hint}</p>}{feedback && <p role="status" className="mt-4 rounded-lg bg-accent p-4 leading-6">{feedback}</p>}</section>
    <section aria-live="polite"><h2 className="font-heading text-xl font-bold">เส้นทางความคิด</h2>{done.length === 0 ? <p className="mt-4 leading-7 text-muted-foreground">เลือกขั้นแรก แล้วผลการคำนวณจะปรากฏตรงนี้</p> : <ol className="mt-4 space-y-3">{done.map((id, i) => { const item = current.steps.find(step => step.id === id)!; return <li key={id} className="rounded-lg border border-border bg-card p-4 leading-7"><strong className="text-primary">ขั้นที่ {i + 1} · {item.label}</strong><p className="mt-2">{item.result}</p></li> })}</ol>}{completed && <div className="mt-5 rounded-lg bg-accent p-4"><strong>วางแผนได้ครบแล้ว!</strong><button onClick={next} className="mt-4 block min-h-11 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">{index + 1 === questions.length ? 'จบชุด' : 'ข้อต่อไป →'}</button></div>}</section></div>
  </main>
}
