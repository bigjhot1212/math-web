'use client'

import { useState } from 'react'
import { validateHunterDraft, type HunterDraftIssue } from '@/lib/hunter-exam-draft'

export default function DraftChecker() {
  const [text, setText] = useState('')
  const [issues, setIssues] = useState<HunterDraftIssue[] | null>(null)
  const [month, setMonth] = useState('2026-12')
  const [saved, setSaved] = useState(false)
  const [reviewed, setReviewed] = useState(false)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  function check() {
    try { setIssues(validateHunterDraft(JSON.parse(text))) }
    catch { setIssues([{ question: null, message: 'อ่าน JSON ไม่ได้ กรุณาตรวจวงเล็บ เครื่องหมายจุลภาค และรูปแบบไฟล์' }]) }
  }
  async function send(action: 'save' | 'publish') {
    let questions: unknown
    try { questions = JSON.parse(text) } catch { setNotice('อ่าน JSON ไม่ได้'); return }
    const problems = validateHunterDraft(questions)
    setIssues(problems)
    if (problems.length) return
    setBusy(true)
    setNotice('')
    try {
      const response = await fetch('/api/admin/hunter-exam-sets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ month, questions, action }) })
      const result = await response.json()
      if (!response.ok) { setNotice(result.error ?? 'ดำเนินการไม่สำเร็จ'); return }
      setSaved(action === 'save')
      setNotice(action === 'save' ? 'บันทึกฉบับร่างแล้ว ตรวจโจทย์และเฉลยทุกข้อก่อนอนุมัติ' : 'อนุมัติชุดสอบแล้ว ชุดนี้จะไม่สามารถแก้ไขย้อนหลังได้')
    } catch { setNotice('เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่') }
    finally { setBusy(false) }
  }
  async function loadDraft() {
    setBusy(true)
    setNotice('')
    try {
      const response = await fetch(`/api/admin/hunter-exam-sets?month=${encodeURIComponent(month)}`, { cache: 'no-store' })
      const result = await response.json()
      if (!response.ok) { setNotice(result.error ?? 'โหลดไม่สำเร็จ'); return }
      setText(JSON.stringify(result.questions, null, 2))
      setIssues(null)
      setReviewed(false)
      setSaved(result.status === 'draft')
      setNotice(result.status === 'draft' ? 'โหลดฉบับร่างแล้ว' : 'ชุดนี้อนุมัติแล้ว ดูได้แต่ไม่สามารถแก้ไขย้อนหลัง')
    } catch { setNotice('เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่') }
    finally { setBusy(false) }
  }
  return <main className="mx-auto max-w-4xl px-5 py-10">
    <h1 className="text-2xl font-semibold">เตรียมชุดสอบรายเดือน</h1>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">วางข้อมูลโจทย์ JSON เพื่อตรวจและบันทึกฉบับร่าง ครูต้องตรวจโจทย์และเฉลยทุกข้อก่อนอนุมัติ ชุดที่อนุมัติแล้วแก้ไขย้อนหลังไม่ได้</p>
    <label htmlFor="draft-month" className="mt-6 block text-sm font-semibold">เดือนที่ใช้สอบ</label>
    <input id="draft-month" type="month" min="2026-12" value={month} onChange={event => { setMonth(event.target.value); setSaved(false); setReviewed(false) }} className="mt-2 rounded-lg border border-border bg-background p-3" />
    <button type="button" disabled={busy} onClick={loadDraft} className="ml-3 rounded-lg border border-border px-4 py-3 text-sm disabled:opacity-50">โหลดชุดสอบที่บันทึกไว้</button>
    <label htmlFor="draft-json" className="mt-7 block text-sm font-semibold">ข้อมูลชุดข้อสอบ</label>
    <textarea id="draft-json" value={text} onChange={event => { setText(event.target.value); setIssues(null); setSaved(false); setReviewed(false) }} rows={14} spellCheck={false} className="mt-2 w-full rounded-lg border border-border bg-background p-4 font-mono text-sm" placeholder="วาง JSON array ของข้อสอบที่นี่" />
    <button type="button" onClick={check} className="mt-4 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">ตรวจโครงสร้าง</button>
    {issues && <section aria-live="polite" className="mt-6 rounded-xl border border-border bg-card p-5"><h2 className="font-semibold">{issues.length ? `พบ ${issues.length} จุดที่ต้องแก้` : 'ผ่านการตรวจโครงสร้างเบื้องต้น'}</h2>{issues.length ? <ul className="mt-3 space-y-2 text-sm">{issues.map((issue, index) => <li key={index}>{issue.question ? `ข้อ ${issue.question}: ` : ''}{issue.message}</li>)}</ul> : <p className="mt-3 text-sm leading-7 text-muted-foreground">ยังต้องตรวจความถูกต้องทางคณิตศาสตร์ รูปประกอบ และเฉลยทุกข้อก่อนใช้งานจริง</p>}</section>}
    <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => send('save')} className="rounded-lg border border-border px-4 py-3 text-sm disabled:opacity-50">บันทึกฉบับร่าง</button></div>
    {saved && <div className="mt-6 rounded-xl border border-border p-5"><label className="flex gap-3 text-sm"><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} /> ตรวจโจทย์ ตัวเลือก คำตอบ และเฉลยครบทุกข้อแล้ว</label><button type="button" disabled={!reviewed || busy} onClick={() => send('publish')} className="mt-4 rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground disabled:opacity-50">อนุมัติชุดสอบเดือนนี้</button></div>}
    {notice && <p role="status" className="mt-4 text-sm">{notice}</p>}
  </main>
}
