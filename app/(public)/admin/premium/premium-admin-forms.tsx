'use client'

import { useState } from 'react'

// Vercel caps request bodies at ~4.5 MB, so big question files are sent in slices.
const UPLOAD_SLICE = 300

const box = 'rounded-2xl border border-border p-6'
const button = 'rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'

export function InviteForm() {
  const [emails, setEmails] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function submit() {
    if (!emails.trim()) {
      setResult('กรอกอีเมลอย่างน้อย 1 อีเมล')
      return
    }
    setBusy(true)
    setResult(null)
    const response = await fetch('/api/admin/premium/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emails, note }),
    })
    const data = await response.json().catch(() => ({}))
    setBusy(false)
    if (!response.ok) {
      setResult(data.error ?? 'บันทึกไม่สำเร็จ')
      return
    }
    setResult(`บันทึกแล้ว ${data.saved} อีเมล${data.invalid?.length ? ` · รูปแบบไม่ถูกต้อง ${data.invalid.length} รายการ: ${data.invalid.join(', ')}` : ''}`)
    setEmails('')
  }

  return (
    <section className={box}>
      <h2 className="mb-1 font-heading text-lg font-bold text-foreground">อีเมลนักเรียนที่ลงทะเบียนก่อนมีเว็บไซต์</h2>
      <p className="mb-4 text-sm text-muted-foreground">วางอีเมลทีละบรรทัด (หรือคั่นด้วยจุลภาค) เมื่อนักเรียนสมัครและยืนยันอีเมลนี้ จะได้สิทธิ์ฝึกโจทย์พรีเมียมทันที</p>
      <textarea
        value={emails}
        onChange={(event) => setEmails(event.target.value)}
        rows={6}
        placeholder={'student1@gmail.com\nstudent2@hotmail.com'}
        className="mb-3 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground outline-none focus:border-primary"
      />
      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="หมายเหตุ เช่น รุ่นปี 2568 (ไม่บังคับ)"
        className="mb-4 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
      <button type="button" onClick={submit} disabled={busy} className={button}>{busy ? 'กำลังบันทึก...' : 'บันทึกอีเมล'}</button>
      {result && <p className="mt-3 text-sm text-muted-foreground">{result}</p>}
    </section>
  )
}

export function QuestionImportForm() {
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [log, setLog] = useState<string[]>([])

  async function upload() {
    if (!file) {
      setLog(['เลือกไฟล์ JSON ก่อน'])
      return
    }
    setBusy(true)
    setLog([])
    let questions: unknown
    try {
      questions = JSON.parse(await file.text())
    } catch {
      setLog(['อ่านไฟล์ไม่ได้ ไฟล์ต้องเป็น JSON'])
      setBusy(false)
      return
    }
    if (!Array.isArray(questions)) {
      setLog(['ไฟล์ต้องเป็น JSON array ของโจทย์'])
      setBusy(false)
      return
    }

    let saved = 0
    const messages: string[] = []
    for (let start = 0; start < questions.length; start += UPLOAD_SLICE) {
      const slice = questions.slice(start, start + UPLOAD_SLICE)
      const response = await fetch('/api/admin/premium/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slice),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        messages.push(`ข้อ ${start + 1}–${start + slice.length}: ${data.error ?? 'นำเข้าไม่สำเร็จ'}`)
        break
      }
      saved += data.saved
      for (const item of data.rejected ?? []) {
        messages.push(`ข้าม ${item.id ?? `ข้อที่ ${start + item.index + 1}`}: ${item.reason}`)
      }
      setLog([`นำเข้าแล้ว ${saved} / ${questions.length} ข้อ`, ...messages])
    }
    setLog([`นำเข้าแล้ว ${saved} / ${questions.length} ข้อ`, ...messages])
    setBusy(false)
  }

  return (
    <section className={box}>
      <h2 className="mb-1 font-heading text-lg font-bold text-foreground">นำเข้าข้อสอบเก่า</h2>
      <p className="mb-4 text-sm text-muted-foreground">อัปโหลดไฟล์ JSON ของโจทย์ ข้อที่มี id ซ้ำจะถูกอัปเดต จึงอัปโหลดไฟล์เดิมซ้ำหลังแก้ไขได้</p>
      <input
        type="file"
        accept="application/json,.json"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="mb-4 block text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:text-foreground"
      />
      <button type="button" onClick={upload} disabled={busy} className={button}>{busy ? 'กำลังนำเข้า...' : 'นำเข้าโจทย์'}</button>
      {log.length > 0 && (
        <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto text-sm text-muted-foreground">
          {log.map((line, index) => <li key={index}>{line}</li>)}
        </ul>
      )}
    </section>
  )
}
