'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog } from 'radix-ui'
import { ArrowUpRight, X } from 'lucide-react'
import BrandMark from '../brand-mark'
import TiltCard from './tilt-card'
import PixelReveal from './pixel-reveal'
import { CountUp, ShinyText } from './adventure-effects'

export default function HunterLicense({ name, avatarUrl, answered, accuracy, streak }: {
  name: string; avatarUrl?: string | null; answered: number; accuracy: number | null; streak: number
}) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <TiltCard className="hunter-license-wrap"><Dialog.Trigger asChild><button ref={trigger} className="hunter-license" type="button">
      <Image src="/adventure/archive.webp" alt="" fill sizes="500px" />
      <span className="hunter-license-inner"><span className="hunter-license-top"><BrandMark className="size-9" reversed /><span>Math Hunters<br /><small><ShinyText>Association</ShinyText></small></span><ArrowUpRight className="size-5" aria-hidden="true" /></span>
      <span className="hunter-license-name">{avatarUrl ? <span className="license-avatar"><Image src={avatarUrl} alt="" width={46} height={46} unoptimized /></span> : <span className="license-avatar" aria-hidden="true">{name.slice(0,1)}</span>}<span><small>บัตรประจำตัวฮันเตอร์</small><strong>{name}</strong></span></span>
      <span className="hunter-license-stats"><span><b><CountUp value={answered} /></b>ข้อที่ฝึกและสอบ</span><span><b>{accuracy === null ? '—' : <CountUp value={accuracy} suffix="%" />}</b>ความแม่นยำ</span><span><b>{streak}</b>วันต่อเนื่อง</span></span>
      <span className="hunter-license-details">เปิดดูบัตรของฉัน →</span></span>
    </button></Dialog.Trigger></TiltCard>
    <Dialog.Portal><Dialog.Overlay className="mission-overlay" /><Dialog.Content className="license-dialog">
      <Dialog.Close className="briefing-close" aria-label="ปิดบัตรฮันเตอร์"><X size={20} /></Dialog.Close>
      <div className="license-dialog-art"><Image src="/adventure/archive.webp" fill sizes="500px" alt="" /><PixelReveal /></div>
      <div className="briefing-copy"><p className="adventure-kicker">MATH HUNTERS ASSOCIATION</p><Dialog.Title>บัตรฮันเตอร์ของ {name}</Dialog.Title><Dialog.Description>บันทึกการเดินทางจากผลการฝึกและข้อสอบจริงของคุณ</Dialog.Description>
        <dl className="license-details-list"><div><dt>ฝึกและสอบแล้ว</dt><dd>{answered} ข้อ</dd></div><div><dt>ความแม่นยำ</dt><dd>{accuracy === null ? 'ยังไม่มีข้อมูล' : `${accuracy}%`}</dd></div><div><dt>ฝึกต่อเนื่อง</dt><dd>{streak} วัน</dd></div></dl>
        <Link className="adventure-button" href="/profile" onClick={() => setOpen(false)}>แก้ไขข้อมูลของฉัน <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </div>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>
}
