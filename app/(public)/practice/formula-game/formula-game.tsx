'use client'

import Link from 'next/link'
import { useState } from 'react'

type Level = 'start' | 'middle' | 'challenge'
type Action = 'differentiate' | 'point' | 'slope' | 'line' | 'integrate'
const levels: { id: Level; title: string; detail: string }[] = [
  { id: 'start', title: 'เริ่มต้น', detail: 'เลือกกฎที่ใช้หาอนุพันธ์ · 1 ขั้น' },
  { id: 'middle', title: 'ปานกลาง', detail: 'หาอนุพันธ์แล้วหาความชัน · 2 ขั้น' },
  { id: 'challenge', title: 'ท้าทาย', detail: 'วางแผนหาเส้นสัมผัส · หลายขั้น' },
]
const actions: { id: Action; name: string; formula: string }[] = [
  { id: 'differentiate', name: 'หาอนุพันธ์', formula: '(xⁿ)′ = nxⁿ⁻¹' },
  { id: 'point', name: 'หาจุดบนกราฟ', formula: '(a, f(a))' },
  { id: 'slope', name: 'หาความชันที่จุด', formula: 'm = f′(a)' },
  { id: 'line', name: 'เขียนสมการเส้นสัมผัส', formula: 'y − y₁ = m(x − x₁)' },
  { id: 'integrate', name: 'หาอินทิกรัล', formula: '∫ f(x) dx' },
]
const superscripts = ['', '¹', '²', '³', '⁴', '⁵', '⁶']
const cases: Record<Level, { n: number; a: number; c: number }[]> = {
  start: [2, 3, 4, 5, 6].map(n => ({ n, a: 0, c: 0 })),
  middle: [{ n: 2, a: 3, c: 0 }, { n: 3, a: 2, c: 0 }, { n: 4, a: 2, c: 0 }, { n: 5, a: 1, c: 0 }, { n: 6, a: 1, c: 0 }],
  challenge: [{ n: 2, a: 1, c: 0 }, { n: 2, a: 2, c: 0 }, { n: 2, a: 1, c: 2 }, { n: 2, a: 2, c: 3 }, { n: 2, a: 3, c: 1 }],
}

export default function FormulaGame() {
  const [level, setLevel] = useState<Level | null>(null)
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState<Action[]>([])
  const [feedback, setFeedback] = useState('')
  const [finished, setFinished] = useState(false)
  const [hint, setHint] = useState(false)

  function chooseLevel(next: Level) { setLevel(next); setIndex(0); setDone([]); setFeedback(''); setFinished(false); setHint(false) }
  function nextQuestion() { if (!level) return; if (index + 1 >= cases[level].length) { setFinished(true); return }; setIndex(index + 1); setDone([]); setFeedback(''); setHint(false) }

  if (!level || finished) return <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 sm:px-8">
    <Link href="/practice" className="text-sm font-semibold text-primary underline underline-offset-4">← กลับไปแบบฝึกหัด</Link>
    <div className="mt-8 max-w-2xl"><p className="font-semibold text-primary">แคลคูลัส · ชุดทดลอง 15 ข้อ</p><h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">{finished ? 'จบชุดนี้แล้ว!' : 'เลือกสูตร แล้วไปต่อ'}</h1><p className="mt-4 leading-7 text-muted-foreground">{finished ? 'ลองเลือกระดับอื่นเพื่อฝึกต่อได้เลย' : 'อ่านโจทย์ เลือกว่าควรทำอะไรต่อ แล้วดูวิธีคิดทีละขั้น เกมช่วยคำนวณให้ ไม่กระทบแรงก์ฮันเตอร์'}</p></div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">{levels.map(item => <button key={item.id} onClick={() => chooseLevel(item.id)} className="min-h-40 rounded-xl border border-border bg-card p-6 text-left transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><span className="font-heading text-xl font-bold text-primary">{item.title}</span><span className="mt-3 block leading-6 text-muted-foreground">{item.detail}</span><span className="mt-4 block text-sm font-semibold text-foreground">เล่น 5 ข้อ →</span></button>)}</div>
    <p className="mt-7 text-sm leading-6 text-muted-foreground">ชุดนำร่องนี้เริ่มจากอนุพันธ์และเส้นสัมผัส ความคืบหน้าอยู่ในหน้านี้และจะเริ่มใหม่เมื่อออกจากหน้า</p>
  </main>

  const current = cases[level][index]
  const { n, a, c } = current
  const functionText = `x${superscripts[n]}${c ? ` + ${c}` : ''}`
  const derivative = `${n}x${superscripts[n - 1]}`
  const pointY = a * a + c
  const slopeValue = n * a ** (n - 1)
  const intercept = c - a * a
  const lineText = `y = ${2 * a}x${intercept < 0 ? ` − ${-intercept}` : intercept > 0 ? ` + ${intercept}` : ''}`
  const completed = level === 'start' ? done.includes('differentiate') : level === 'middle' ? done.includes('slope') : done.includes('line')
  const question = level === 'start' ? `จงหาอนุพันธ์ของ f(x) = ${functionText}` : level === 'middle' ? `จงหาความชันของกราฟ f(x) = ${functionText} ที่ x = ${a}` : `จงหาสมการเส้นสัมผัสกราฟ f(x) = ${functionText} ที่ x = ${a}`
  function select(action: Action) {
    setHint(false)
    if (done.includes(action)) { setFeedback('ขั้นนี้ทำแล้ว เลือกสิ่งที่ต้องทำต่อได้เลย'); return }
    if (action === 'integrate') { setFeedback('ข้อนี้ถามอนุพันธ์ ความชัน หรือเส้นสัมผัส ลองดูว่าสูตรนี้ช่วยตอบโจทย์หรือไม่'); return }
    if (action === 'point' && level !== 'challenge') { setFeedback('ลองดูอีกครั้งว่าโจทย์ถามหาพิกัดจุดหรือไม่'); return }
    if (action === 'slope' && level === 'start') { setFeedback('ข้อนี้ถามหาอนุพันธ์ ยังไม่ได้ถามความชันที่จุดใด'); return }
    if (action === 'line' && level !== 'challenge') { setFeedback('โจทย์ข้อนี้ไม่ได้ถามสมการเส้นสัมผัส'); return }
    if (action === 'slope' && !done.includes('differentiate')) { setFeedback('ก่อนหาความชันที่ x ที่กำหนด ต้องหาอนุพันธ์ f′(x) ก่อน'); return }
    if (action === 'line' && (!done.includes('slope') || !done.includes('point'))) { setFeedback(`สมการเส้นตรงต้องมีทั้งจุดและความชัน ตอนนี้ยังขาด${!done.includes('point') && !done.includes('slope') ? 'ทั้งจุดสัมผัสและความชัน' : !done.includes('point') ? 'จุดสัมผัส' : 'ความชัน'}`); return }
    setDone([...done, action]); setFeedback('')
  }
  const explanation: Partial<Record<Action, string>> = {
    differentiate: `ใช้กฎเลขยกกำลัง: f′(x) = ${derivative}${c ? ' เพราะอนุพันธ์ของค่าคงที่เป็น 0' : ''}`,
    point: `แทน x = ${a} ใน f(x) ได้ f(${a}) = ${a}²${c ? ` + ${c}` : ''} = ${pointY} ดังนั้นจุดสัมผัสคือ (${a}, ${pointY})`,
    slope: `แทน x = ${a} ใน f′(x) ได้ m = ${n}(${a})${superscripts[n - 1]} = ${slopeValue}`,
    line: `ใช้จุด (${a}, ${pointY}) และความชัน ${slopeValue}: y − ${pointY} = ${slopeValue}(x − ${a}) จัดรูปได้ ${lineText}`,
  }
  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-8 sm:px-8">
    <button onClick={() => setLevel(null)} className="text-sm font-semibold text-primary underline underline-offset-4">← เลือกระดับใหม่</button>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="font-semibold text-primary">{levels.find(item => item.id === level)?.title} · ข้อ {index + 1} / {cases[level].length}</p><span className="text-sm text-muted-foreground">ฝึกวางแผน · ไม่กระทบแรงก์</span></div>
    <section className="mt-4 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8"><h1 className="font-heading text-xl font-bold">โจทย์</h1><p className="mt-4 text-xl leading-8 sm:text-2xl">{question}</p></section>
    <div className="mt-7 grid gap-8 md:grid-cols-2"><section><h2 className="font-heading text-xl font-bold">{completed ? 'ทำข้อนี้สำเร็จแล้ว' : 'เลือกสิ่งที่ควรทำต่อ'}</h2><p className="mt-2 text-sm text-muted-foreground">เลือกได้หลายลำดับเมื่อมีข้อมูลพร้อม</p><div className="mt-4 grid gap-2">{actions.map(action => <button key={action.id} disabled={completed} onClick={() => select(action.id)} className="rounded-lg border border-border bg-card px-4 py-3 text-left hover:border-primary focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-60"><span className="font-semibold">{action.name}</span><span className="ml-2 text-sm text-muted-foreground">{action.formula}</span>{done.includes(action.id) && <span className="ml-2 text-sm text-primary">✓ ทำแล้ว</span>}</button>)}</div>{!completed && <button onClick={() => setHint(!hint)} className="mt-4 font-semibold text-primary underline underline-offset-4">{hint ? 'ซ่อนคำใบ้' : 'ขอคำใบ้'}</button>}{hint && <p className="mt-2 text-sm leading-6 text-muted-foreground">{level === 'start' ? 'โจทย์ถามอนุพันธ์ของพจน์กำลัง ลองเลือกกฎเลขยกกำลัง' : level === 'middle' ? 'ความชันที่จุดหาได้จาก f′(a) เริ่มจากหา f′(x)' : 'เส้นตรงต้องรู้จุดและความชัน คุณเลือกหาจุดก่อน หรือหาอนุพันธ์ก่อนก็ได้'}</p>}{feedback && <p role="status" className="mt-4 rounded-lg bg-accent p-4 leading-6">{feedback}</p>}</section>
    <section aria-live="polite"><h2 className="font-heading text-xl font-bold">เส้นทางความคิด</h2>{done.length === 0 ? <p className="mt-4 leading-7 text-muted-foreground">เลือกขั้นแรก แล้วผลการคำนวณจะปรากฏตรงนี้</p> : <ol className="mt-4 space-y-3">{done.map((step, i) => <li key={step} className="rounded-lg border border-border bg-card p-4 leading-7"><strong className="text-primary">ขั้นที่ {i + 1} · {actions.find(action => action.id === step)?.name}</strong><p className="mt-2">{explanation[step]}</p></li>)}</ol>}{completed && <div className="mt-5 rounded-lg bg-accent p-4"><strong>ถูกต้อง! คุณวางแผนได้ครบแล้ว</strong><button onClick={nextQuestion} className="mt-4 block min-h-11 rounded-lg bg-primary px-5 py-2 font-semibold text-primary-foreground">{index + 1 === cases[level].length ? 'จบชุด' : 'ข้อต่อไป →'}</button></div>}</section></div>
  </main>
}
