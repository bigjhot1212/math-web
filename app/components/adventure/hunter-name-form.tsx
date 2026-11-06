'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, UserRound } from 'lucide-react'

export default function HunterNameForm({ name, changedThisMonth }: { name: string; changedThisMonth: boolean }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/hunter-name', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: value }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'บันทึกชื่อไม่สำเร็จ')
      setEditing(false)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'บันทึกชื่อไม่สำเร็จ')
    } finally { setSaving(false) }
  }

  return <section className="mb-6 rounded-2xl border border-[#c5a85e] bg-[#fff8e7] p-5 text-[#143f34] sm:p-6" aria-labelledby="hunter-name-title">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#143f34] text-[#f4d98d]"><UserRound className="size-5" aria-hidden="true" /></span>
        <div className="min-w-0">
          <h2 id="hunter-name-title" className="font-heading text-lg font-bold sm:text-xl">ชื่อที่แสดงบน Leaderboard</h2>
          <p className="mt-1 break-words text-base font-semibold">{name}</p>
          <p className="mt-1 text-sm leading-6 text-[#395d4e]">ผู้อื่นจะเห็นชื่อนี้ · เปลี่ยนได้เดือนละครั้ง</p>
        </div>
      </div>
      {!changedThisMonth && !editing && <button type="button" onClick={() => setEditing(true)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#143f34] px-5 py-3 text-sm font-semibold text-white hover:bg-[#205b49] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#143f34]"><Pencil className="size-4" aria-hidden="true" />เปลี่ยนชื่อบน Leaderboard</button>}
    </div>
    {changedThisMonth ? <p className="mt-4 text-sm text-[#395d4e]">ตั้งชื่อเดือนนี้แล้ว เปลี่ยนได้อีกครั้งเดือนหน้าตามเวลาไทย</p> : editing &&
      <form onSubmit={save} className="mt-5 flex max-w-2xl flex-wrap items-end gap-3 border-t border-[#d9cda9] pt-4">
        <label className="min-w-48 flex-1 text-sm font-semibold">ชื่อฮันเตอร์ <input className="mt-1 block w-full rounded-lg border border-[#799284] bg-white px-3 py-2 text-[#143f34]" value={value} onChange={event => setValue(event.target.value)} maxLength={48} required /></label>
        <button disabled={saving} className="min-h-11 rounded-lg bg-[#143f34] px-5 py-2 font-semibold text-white disabled:opacity-50">{saving ? 'กำลังบันทึก...' : 'บันทึกชื่อ'}</button>
        <button type="button" onClick={() => setEditing(false)} className="min-h-11 rounded-lg border border-[#799284] px-4 py-2">ยกเลิก</button>
        <p className="basis-full text-sm leading-6 text-[#395d4e]">ใช้ 3–24 ตัวอักษร เลือกชื่อเล่นที่ไม่เปิดเผยข้อมูลส่วนตัว เมื่อบันทึกแล้วเปลี่ยนได้อีกครั้งเดือนหน้า</p>
        {error && <p role="alert" className="basis-full text-sm text-[#a52525]">{error}</p>}
      </form>}
  </section>
}
