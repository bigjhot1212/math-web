'use client'

import { useState } from 'react'
import { ArrowLeft, CreditCard, Landmark, Loader2, CheckCircle2, Upload } from 'lucide-react'
import { BANK_TRANSFER_INFO } from '@/lib/payment-config'
import { removeFromCart } from '@/lib/cart'

type Props = {
  type: 'topic' | 'bundle' | 'cart'
  id: string
  name: string
  price: number
  email: string
}

const CHECKOUT_ENDPOINTS = {
  topic: '/api/payment/checkout-topic',
  bundle: '/api/payment/checkout-bundle',
  cart: '/api/payment/checkout-cart',
}

export default function CheckoutClient({ type, id, name, price, email }: Props) {
  const [payLoading, setPayLoading] = useState(false)
  const [showBankForm, setShowBankForm] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [bankSubmitting, setBankSubmitting] = useState(false)
  const [bankSubmitted, setBankSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function clearCartItems() {
    if (type === 'cart') id.split(',').forEach((tid) => removeFromCart(tid))
  }

  async function handlePayStripe() {
    setPayLoading(true)
    setError(null)
    try {
      const body = type === 'topic' ? { topicId: id } : type === 'bundle' ? { bundleId: id } : { topicIds: id.split(',') }
      const res = await fetch(CHECKOUT_ENDPOINTS[type], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      clearCartItems()
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      setPayLoading(false)
    }
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

        <h1 className="text-2xl font-heading font-bold text-foreground mb-6">ชำระเงิน</h1>

        <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-6 mb-6">
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
          <div className="mb-6 p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        {bankSubmitted ? (
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground mb-1">ส่งหลักฐานการโอนแล้ว</p>
            <p className="text-xs text-muted-foreground">ทีมงานจะตรวจสอบและเปิดคอร์สให้ภายใน 24 ชั่วโมง</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handlePayStripe}
              disabled={payLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {payLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <CreditCard className="w-4 h-4" aria-hidden="true" />
              )}
              ชำระด้วยบัตร / PromptPay
            </button>

            <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl overflow-hidden">
              <button
                onClick={() => setShowBankForm((v) => !v)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-foreground hover:bg-accent/50 transition-all cursor-pointer"
              >
                <Landmark className="w-4 h-4" aria-hidden="true" />
                โอนเงินผ่านธนาคาร
              </button>

              {showBankForm && (
                <div className="p-5 pt-0 space-y-4 border-t border-border">
                  <div className="pt-4 text-sm space-y-1">
                    <p className="text-muted-foreground text-xs">โอนเงินมาที่บัญชี</p>
                    <p className="font-medium text-foreground">{BANK_TRANSFER_INFO.bankName}</p>
                    <p className="font-medium text-foreground tabular-nums">{BANK_TRANSFER_INFO.accountNumber}</p>
                    <p className="font-medium text-foreground">{BANK_TRANSFER_INFO.accountName}</p>
                  </div>

                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-2xl p-6 cursor-pointer hover:border-primary/40 transition-colors text-center">
                    <Upload className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                    <span className="text-xs text-muted-foreground">
                      {file ? file.name : 'แนบสลิปการโอนเงิน (รูปภาพ)'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>

                  <button
                    onClick={handleSubmitSlip}
                    disabled={bankSubmitting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-cta hover:bg-cta/5 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {bankSubmitting ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : 'ส่งหลักฐานการโอน'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
