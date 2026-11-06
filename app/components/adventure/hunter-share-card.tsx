'use client'

import { useState } from 'react'

type Props = { alias: string; rank: string; rankName: string; rating: number; month: string }

export default function HunterShareCard({ alias, rank, rankName, rating, month }: Props) {
  const [message, setMessage] = useState('')
  async function share() {
    const text = `Math Hunters Association · ${month}\n${alias} · แรงก์ ${rank} ${rankName}\nคะแนนสอบ ${rating}/100`
    if (navigator.share) {
      try { await navigator.share({ title: 'ผลสอบฮันเตอร์', text }); return } catch { return }
    }
    try { await navigator.clipboard.writeText(text); setMessage('คัดลอกข้อความแล้ว') }
    catch { setMessage('คัดลอกไม่สำเร็จ กรุณาลองอีกครั้ง') }
  }
  function download() {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 630
    const context = canvas.getContext('2d')
    if (!context) { setMessage('สร้างรูปไม่สำเร็จ กรุณาลองอีกครั้ง'); return }
    context.fillStyle = '#143f34'
    context.fillRect(0, 0, 1200, 630)
    context.strokeStyle = '#e5ce94'
    context.lineWidth = 4
    context.strokeRect(35, 35, 1130, 560)
    context.fillStyle = '#e5ce94'
    context.font = 'bold 30px sans-serif'
    context.fillText('MATH HUNTERS ASSOCIATION', 90, 105)
    context.font = '30px sans-serif'
    context.fillText(month, 90, 165)
    context.fillStyle = '#fff8e7'
    context.font = 'bold 58px sans-serif'
    context.fillText(alias, 90, 265)
    context.font = '36px sans-serif'
    context.fillText(`แรงก์ ${rank} · ${rankName}`, 90, 340)
    context.fillText(`คะแนนสอบ ${rating}/100`, 90, 405)
    context.fillStyle = '#e5ce94'
    context.font = 'bold 180px sans-serif'
    context.fillText(rank, 880, 395)
    canvas.toBlob(blob => {
      if (!blob) { setMessage('สร้างรูปไม่สำเร็จ กรุณาลองอีกครั้ง'); return }
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'math-hunters-rank.png'
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMessage('ดาวน์โหลดบัตรแล้ว')
    }, 'image/png')
  }
  return <section className="mt-7 rounded-2xl border border-[#cbbb8a] bg-[#143f34] p-6 text-[#fff8e7]" aria-label="บัตรแรงก์ของคุณ">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm text-[#e5ce94]">บัตรแรงก์ประจำเดือน · {month}</p><h2 className="mt-2 text-xl font-bold">{alias}</h2><p className="mt-1 text-sm text-[#d8e3d7]">แรงก์ {rank} · {rankName} · {rating}/100</p></div><strong className="rounded-xl border border-[#d8c58e] px-5 py-3 text-4xl">{rank}</strong></div>
    <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={download} className="rounded-lg bg-[#ecd18e] px-4 py-2 text-sm font-semibold text-[#143f34]">ดาวน์โหลดบัตร</button><button type="button" onClick={share} className="rounded-lg border border-[#ecd18e] px-4 py-2 text-sm font-semibold text-[#fff8e7]">แชร์ข้อความ</button></div>
    <p className="mt-2 text-xs text-[#d8e3d7]" aria-live="polite">{message || 'แชร์เฉพาะรหัสฮันเตอร์ แรงก์ และคะแนนเมื่อคุณกดแชร์'}</p>
  </section>
}
