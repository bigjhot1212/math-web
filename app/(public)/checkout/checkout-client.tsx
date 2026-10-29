'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, Download, Landmark, Loader2, CheckCircle2, QrCode, Upload } from 'lucide-react'
import { BANK_TRANSFER_INFO } from '@/lib/payment-config'
import { removeFromCart } from '@/lib/cart'

type Props = {
  type: 'topic' | 'bundle' | 'cart'
  id: string
  name: string
  price: number
  email: string
}

export default function CheckoutClient({ type, id, name, price, email }: Props) {
  const [paymentGuide, setPaymentGuide] = useState<'qr' | 'bank'>('qr')
  const [file, setFile] = useState<File | null>(null)
  const [bankSubmitting, setBankSubmitting] = useState(false)
  const [bankSubmitted, setBankSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function clearCartItems() {
    if (type === 'cart') id.split(',').forEach((tid) => removeFromCart(tid))
  }

  async function handleSubmitSlip() {
    if (!file) { setError('กรุณาแนบสลิปการโอนเงิน'); return }
    setBankSubmitting(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('type', type)
      form.append('id', id)
      form.append('slip', file)
      const res = await fetch('/api/payment/bank-transfer', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      clearCartItems()
      setBankSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setBankSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <a href="/pricing" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            กลับหน้าคอร์ส
          </a>
        </div>

        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">ชำระด้วยการโอนธนาคาร</h1>
        <p className="mb-6 text-sm leading-6 text-muted-foreground">โอนตามยอดด้านล่างแล้วแนบสลิป ทีมงานจะตรวจสอบและเปิดคอร์สให้ภายใน 24 ชั่วโมง</p>

        <div className="rounded-lg border border-border bg-card/70 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">คอร์ส</span>
            <span className="text-sm font-medium text-foreground">{name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">อีเมล</span>
            <span className="text-sm font-medium text-foreground">{email}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">ยอดชำระ</span>
            <span className="text-xl font-heading font-bold text-cta tabular-nums">฿{price}</span>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-6 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        {bankSubmitted ? (
          <div role="status" className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground mb-1">ส่งหลักฐานการโอนแล้ว</p>
            <p className="text-xs text-muted-foreground">ทีมงานจะตรวจสอบและเปิดคอร์สให้ภายใน 24 ชั่วโมง</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card/70 overflow-hidden">
            <div className="grid grid-cols-2 gap-1 border-b border-border bg-muted/40 p-1.5" aria-label="เลือกวิธีดูข้อมูลการชำระเงิน">
              <button
                type="button"
                aria-pressed={paymentGuide === 'qr'}
                onClick={() => setPaymentGuide('qr')}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${paymentGuide === 'qr' ? 'bg-card text-primary ' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <QrCode className="h-4 w-4" aria-hidden="true" />
                สแกน QR
              </button>
              <button
                type="button"
                aria-pressed={paymentGuide === 'bank'}
                onClick={() => setPaymentGuide('bank')}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${paymentGuide === 'bank' ? 'bg-card text-primary ' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Landmark className="h-4 w-4" aria-hidden="true" />
                เลขบัญชี
              </button>
            </div>
            <div className="space-y-4 p-5">
              {paymentGuide === 'qr' ? (
                <div className="text-center">
                  <div className="mx-auto max-w-[320px] overflow-hidden rounded-lg bg-white p-2">
                    <Image
                      src="/api/payment/promptpay-qr"
                      alt="QR PromptPay สำหรับชำระค่าคอร์ส"
                      width={885}
                      height={1200}
                      sizes="(max-width: 640px) 82vw, 320px"
                      className="h-auto w-full"
                      priority
                      unoptimized
                    />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">สแกนด้วยแอปธนาคาร และตรวจชื่อผู้รับให้ตรงกับภาพก่อนยืนยันยอด</p>
                  <a
                    href="/api/payment/promptpay-qr?download=1"
                    download="math-hunters-promptpay.png"
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    บันทึก QR ลงเครื่อง
                  </a>
                </div>
              ) : (
                <div className="rounded-lg bg-muted/60 p-4 text-sm space-y-1">
                  <p className="text-muted-foreground text-xs">โอนเงินมาที่บัญชี</p>
                  <p className="font-medium text-foreground">{BANK_TRANSFER_INFO.bankName}</p>
                  <p className="font-heading text-lg font-semibold text-foreground tabular-nums">{BANK_TRANSFER_INFO.accountNumber}</p>
                  <p className="font-medium text-foreground">{BANK_TRANSFER_INFO.accountName}</p>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <p className="mb-3 text-sm font-medium text-foreground">แนบหลักฐานการโอน</p>
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary hover:border-primary/40 transition-colors text-center">
                  <Upload className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">
                    {file ? file.name : 'แนบสลิปการโอนเงิน (รูปภาพ)'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-label="แนบสลิปการโอนเงิน"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <button
                onClick={handleSubmitSlip}
                disabled={bankSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed text-sm font-medium"
              >
                {bankSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                ) : 'ส่งหลักฐานการโอน'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
