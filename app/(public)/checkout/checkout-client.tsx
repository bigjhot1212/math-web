'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Download,
  Landmark,
  Loader2,
  LockKeyhole,
  QrCode,
  Upload,
} from 'lucide-react'
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
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'bank'>('stripe')
  const [paymentGuide, setPaymentGuide] = useState<'qr' | 'bank'>('qr')
  const [file, setFile] = useState<File | null>(null)
  const [stripeSubmitting, setStripeSubmitting] = useState(false)
  const [bankSubmitting, setBankSubmitting] = useState(false)
  const [bankSubmitted, setBankSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function selectPaymentMethod(method: 'stripe' | 'bank') {
    setPaymentMethod(method)
    setError(null)
  }

  function clearCartItems() {
    if (type === 'cart') id.split(',').forEach((topicId) => removeFromCart(topicId))
  }

  async function handleStripeCheckout() {
    if (stripeSubmitting) return
    setStripeSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/payment/stripe-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      })
      const data = await response.json().catch(() => ({})) as { url?: string; error?: string }
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? 'เปิดหน้าชำระเงินไม่สำเร็จ')
      }
      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เชื่อมต่อ Stripe ไม่สำเร็จ กรุณาลองอีกครั้ง')
      setStripeSubmitting(false)
    }
  }

  async function handleSubmitSlip() {
    if (!file) {
      setError('กรุณาแนบสลิปการโอนเงิน')
      return
    }
    if (bankSubmitting) return

    setBankSubmitting(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('type', type)
      form.append('id', id)
      form.append('slip', file)
      const response = await fetch('/api/payment/bank-transfer', { method: 'POST', body: form })
      const data = await response.json().catch(() => ({})) as { error?: string }
      if (!response.ok) throw new Error(data.error ?? 'ส่งสลิปไม่สำเร็จ')
      clearCartItems()
      setBankSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ส่งสลิปไม่สำเร็จ กรุณาลองอีกครั้ง')
    } finally {
      setBankSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-5 sm:p-6 md:p-10">
      <div className="mx-auto max-w-xl">
        <a
          href="/pricing"
          className="mb-6 inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          กลับหน้าคอร์ส
        </a>

        <h1 className="font-heading text-3xl font-bold tracking-[-0.025em] text-foreground">เลือกวิธีชำระเงิน</h1>
        <p className="mt-2 text-base leading-7 text-muted-foreground">
          ชำระผ่าน Stripe เพื่อเปิดคอร์สอัตโนมัติ หรือโอนธนาคารและแนบสลิปให้ทีมงานตรวจ
        </p>

        <section aria-label="สรุปคำสั่งซื้อ" className="my-7 rounded-2xl bg-card p-5 shadow-[0_12px_32px_-24px_rgba(15,23,42,0.5)] sm:p-6">
          <dl className="space-y-3">
            <div className="flex min-w-0 items-start justify-between gap-5">
              <dt className="shrink-0 text-sm text-muted-foreground">คอร์ส</dt>
              <dd className="min-w-0 text-right text-sm font-medium leading-6 text-foreground [overflow-wrap:anywhere]">{name}</dd>
            </div>
            <div className="flex min-w-0 items-start justify-between gap-5">
              <dt className="shrink-0 text-sm text-muted-foreground">อีเมล</dt>
              <dd className="min-w-0 text-right text-sm font-medium text-foreground [overflow-wrap:anywhere]">{email}</dd>
            </div>
            <div className="flex items-end justify-between gap-5 border-t border-border pt-4">
              <dt className="text-sm text-muted-foreground">ยอดชำระ</dt>
              <dd className="font-heading text-2xl font-bold tabular-nums text-cta">฿{price.toLocaleString('th-TH')}</dd>
            </div>
          </dl>
        </section>

        <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="วิธีชำระเงิน">
          <button
            type="button"
            role="radio"
            aria-checked={paymentMethod === 'stripe'}
            onClick={() => selectPaymentMethod('stripe')}
            className={`rounded-2xl p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${paymentMethod === 'stripe' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-muted'}`}
          >
            <CreditCard className="mb-4 h-6 w-6" aria-hidden="true" />
            <span className="block font-heading text-lg font-semibold">ชำระทันที</span>
            <span className={`mt-1 block text-sm leading-6 ${paymentMethod === 'stripe' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              บัตรหรือ PromptPay · เปิดสิทธิ์อัตโนมัติ
            </span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={paymentMethod === 'bank'}
            onClick={() => selectPaymentMethod('bank')}
            className={`rounded-2xl p-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${paymentMethod === 'bank' ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground hover:bg-muted'}`}
          >
            <Landmark className="mb-4 h-6 w-6" aria-hidden="true" />
            <span className="block font-heading text-lg font-semibold">โอนธนาคาร</span>
            <span className={`mt-1 block text-sm leading-6 ${paymentMethod === 'bank' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              แนบสลิป · ตรวจภายใน 24 ชั่วโมง
            </span>
          </button>
        </div>

        {error && (
          <div role="alert" aria-live="polite" className="mt-5 rounded-xl bg-destructive/10 p-4 text-sm leading-6 text-destructive">
            {error}
          </div>
        )}

        {paymentMethod === 'stripe' ? (
          <section className="mt-5 rounded-2xl bg-card p-5 sm:p-6" aria-labelledby="stripe-heading">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LockKeyhole className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 id="stripe-heading" className="font-heading text-lg font-semibold text-foreground">ชำระบนหน้าที่ปลอดภัยของ Stripe</h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  เลือกบัตรหรือ PromptPay ในหน้าถัดไป ระบบจะเปิดคอร์สเมื่อ Stripe ยืนยันยอดสำเร็จ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleStripeCheckout}
              disabled={stripeSubmitting}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cta px-5 text-base font-semibold text-cta-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:cursor-wait disabled:opacity-60"
            >
              {stripeSubmitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <LockKeyhole className="h-5 w-5" aria-hidden="true" />}
              {stripeSubmitting ? 'กำลังเปิด Stripe…' : `ชำระ ฿${price.toLocaleString('th-TH')}`}
            </button>
            <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">เว็บนี้ไม่เห็นหรือจัดเก็บข้อมูลบัตรของคุณ</p>
          </section>
        ) : bankSubmitted ? (
          <div role="status" aria-live="polite" className="mt-5 rounded-2xl bg-primary/5 p-6 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-primary" aria-hidden="true" />
            <p className="font-heading text-lg font-semibold text-foreground">ส่งหลักฐานการโอนแล้ว</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">ทีมงานจะตรวจสอบและเปิดคอร์สให้ภายใน 24 ชั่วโมง</p>
          </div>
        ) : (
          <section className="mt-5 overflow-hidden rounded-2xl bg-card" aria-labelledby="bank-heading">
            <h2 id="bank-heading" className="sr-only">ข้อมูลโอนธนาคาร</h2>
            <div className="grid grid-cols-2 gap-1 bg-muted/50 p-1.5" aria-label="เลือกข้อมูลสำหรับโอนเงิน">
              <button
                type="button"
                aria-pressed={paymentGuide === 'qr'}
                onClick={() => setPaymentGuide('qr')}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${paymentGuide === 'qr' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <QrCode className="h-4 w-4" aria-hidden="true" />
                สแกน QR
              </button>
              <button
                type="button"
                aria-pressed={paymentGuide === 'bank'}
                onClick={() => setPaymentGuide('bank')}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary ${paymentGuide === 'bank' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Landmark className="h-4 w-4" aria-hidden="true" />
                เลขบัญชี
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {paymentGuide === 'qr' ? (
                <div className="text-center">
                  <div className="mx-auto max-w-[320px] overflow-hidden rounded-xl bg-white p-2">
                    <Image
                      src="/api/payment/promptpay-qr"
                      alt="QR PromptPay สำหรับโอนเงินเข้าบัญชีและแนบสลิป"
                      width={885}
                      height={1200}
                      sizes="(max-width: 640px) 82vw, 320px"
                      className="h-auto w-full"
                      priority
                      unoptimized
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">ตรวจชื่อผู้รับและกรอกยอดตามสรุปคำสั่งซื้อก่อนยืนยัน</p>
                  <a
                    href="/api/payment/promptpay-qr?download=1"
                    download="math-hunters-promptpay.png"
                    className="mt-2 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    บันทึก QR ลงเครื่อง
                  </a>
                </div>
              ) : (
                <div className="rounded-xl bg-muted/60 p-5">
                  <p className="text-sm text-muted-foreground">โอนเงินมาที่บัญชี</p>
                  <p className="mt-3 font-medium text-foreground">{BANK_TRANSFER_INFO.bankName}</p>
                  <p className="mt-1 font-heading text-xl font-semibold tabular-nums text-foreground">{BANK_TRANSFER_INFO.accountNumber}</p>
                  <p className="mt-1 font-medium text-foreground">{BANK_TRANSFER_INFO.accountName}</p>
                </div>
              )}

              <div className="border-t border-border pt-5">
                <p className="mb-3 text-sm font-medium text-foreground">แนบหลักฐานการโอน</p>
                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-5 text-center transition-colors hover:border-primary/50 hover:bg-primary/5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
                  <Upload className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                  <span className="max-w-full text-sm text-muted-foreground [overflow-wrap:anywhere]">
                    {file ? file.name : 'เลือกรูปสลิปจากเครื่อง'}
                  </span>
                  <span className="text-xs text-muted-foreground">รองรับไฟล์รูปภาพ</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-label="แนบสลิปการโอนเงิน"
                    onChange={(event) => {
                      setFile(event.target.files?.[0] ?? null)
                      setError(null)
                    }}
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleSubmitSlip}
                disabled={bankSubmitting}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
              >
                {bankSubmitting && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
                {bankSubmitting ? 'กำลังส่งหลักฐาน…' : 'ส่งหลักฐานการโอน'}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
