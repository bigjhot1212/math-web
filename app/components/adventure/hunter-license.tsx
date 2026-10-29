'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog } from 'radix-ui'
import { ArrowUpRight, ChevronRight, ShieldCheck, X } from 'lucide-react'
import BrandMark from '../brand-mark'

function AssociationSeal() {
  return (
    <span className="association-seal" aria-hidden="true">
      <BrandMark className="association-seal-mark" />
      <span>ตราสมาคม</span>
    </span>
  )
}

export default function HunterLicense({ name, avatarUrl, answered, accuracy, streak }: {
  name: string
  avatarUrl?: string | null
  answered: number
  accuracy: number | null
  streak: number
}) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          ref={trigger}
          className="hunter-license"
          type="button"
          aria-label={`เปิดบัตรสมาชิกของ ${name}`}
        >
          <span className="hunter-license-inner">
            <span className="hunter-license-top">
              <AssociationSeal />
              <span className="hunter-license-title">
                <strong>Math Hunters Association</strong>
                <small>สมาคมฮันเตอร์คณิตศาสตร์</small>
              </span>
              <span className="hunter-license-type">
                <small>HUNTER ID</small>
                <strong>MEMBER</strong>
              </span>
            </span>

            <span className="hunter-license-name">
              {avatarUrl ? (
                <span className="license-avatar">
                  <Image src={avatarUrl} alt="" width={58} height={58} unoptimized />
                </span>
              ) : (
                <span className="license-avatar" aria-hidden="true">{name.slice(0, 1)}</span>
              )}
              <span className="hunter-license-member">
                <small>ชื่อผู้ถือบัตร</small>
                <strong>{name}</strong>
                <span>สมาชิกผู้เรียน</span>
              </span>
            </span>

            <dl className="hunter-license-stats">
              <div><dt>ฝึกและสอบแล้ว</dt><dd>{answered}<small> ข้อ</small></dd></div>
              <div><dt>ความแม่นยำ</dt><dd>{accuracy === null ? '—' : `${accuracy}%`}</dd></div>
              <div><dt>ฝึกต่อเนื่อง</dt><dd>{streak}<small> วัน</small></dd></div>
            </dl>

            <span className="hunter-license-footer">
              <span><ShieldCheck aria-hidden="true" /> รับรองโดยสมาคม</span>
              <span>ดูข้อมูลสมาชิก <ChevronRight aria-hidden="true" /></span>
            </span>
          </span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="mission-overlay" />
        <Dialog.Content className="license-dialog">
          <Dialog.Close className="briefing-close" aria-label="ปิดบัตรฮันเตอร์"><X size={20} /></Dialog.Close>
          <header className="license-dialog-header">
            <AssociationSeal />
            <div>
              <p>Math Hunters Association</p>
              <Dialog.Title>ข้อมูลสมาชิก</Dialog.Title>
              <Dialog.Description>บันทึกผลการฝึกและการสอบของ {name}</Dialog.Description>
            </div>
          </header>
          <div className="license-dialog-body">
            <dl className="license-details-list">
              <div><dt>ชื่อผู้ถือบัตร</dt><dd>{name}</dd></div>
              <div><dt>สถานะ</dt><dd>สมาชิกผู้เรียน</dd></div>
              <div><dt>ฝึกและสอบแล้ว</dt><dd>{answered} ข้อ</dd></div>
              <div><dt>ความแม่นยำ</dt><dd>{accuracy === null ? 'ยังไม่มีข้อมูล' : `${accuracy}%`}</dd></div>
              <div><dt>ฝึกต่อเนื่อง</dt><dd>{streak} วัน</dd></div>
            </dl>
            <Link className="adventure-button" href="/profile" onClick={() => setOpen(false)}>
              แก้ไขข้อมูลของฉัน <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
