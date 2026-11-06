'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import { HUNTER_RANKING_RELEASE_AT } from '@/lib/hunter-ranking'

export default function RankOpeningBanner() {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, Math.ceil((Date.parse(HUNTER_RANKING_RELEASE_AT) - Date.now()) / 1000)))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const units = remaining === null ? null : [
    { label: 'วัน', value: Math.floor(remaining / 86400) },
    { label: 'ชั่วโมง', value: Math.floor((remaining % 86400) / 3600) },
    { label: 'นาที', value: Math.floor((remaining % 3600) / 60) },
    { label: 'วินาที', value: remaining % 60 },
  ]

  return (
    <section aria-label="การสอบวัดแรงค์ฮันเตอร์" className="border-y border-[#d6aa51] bg-[linear-gradient(110deg,#064c3c_0%,#103d35_52%,#35234f_100%)] px-5 py-7 text-white sm:px-8 sm:py-8 lg:px-14">
      <div className="mx-auto flex max-w-[1168px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-xl">
          <h2 className="flex items-center gap-3 font-heading text-xl font-semibold leading-snug text-[#fff6df] sm:text-2xl">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#e8c77f]/60 bg-[#39244e] text-[#ffdc8b]"><Trophy className="size-6" aria-hidden="true" /></span>
            {remaining === 0 ? 'สนามสอบวัดแรงค์ฮันเตอร์' : 'เตรียมตัวสอบวัดแรงค์ฮันเตอร์'}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#e2f0e8] sm:text-base">{remaining === 0 ? 'ดูรายละเอียดและสถานะการสอบประจำเดือนได้ที่นี่' : 'เปิดสนาม 7 พฤศจิกายน 2569 เวลา 00:00 น. · สอบได้เดือนละ 1 ครั้ง'}</p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          {remaining !== null && remaining > 0 && units && (
            <div aria-label="เวลาที่เหลือก่อนเปิดสอบวัดแรงค์" className="flex items-start gap-2 sm:gap-3">
              {units.map(({ label, value }) => (
                <div key={label} className="min-w-14 rounded-lg border border-[#d6b971]/50 bg-[#201a39]/70 px-2 py-2 text-center sm:min-w-16">
                  <span className="block font-heading text-3xl font-semibold leading-none tabular-nums text-[#ffdc8b] sm:text-4xl">{String(value).padStart(2, '0')}</span>
                  <span className="mt-1 block text-xs text-[#f2e7fb]">{label}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/exam" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#ffda83] px-5 py-3 text-sm font-bold text-[#183b2f] transition-colors hover:bg-[#ffe9ad] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
            ดูรายละเอียดการสอบ <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
