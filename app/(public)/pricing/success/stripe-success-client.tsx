'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Clock3, Loader2, RefreshCw, TriangleAlert } from 'lucide-react'
import { removeFromCart } from '@/lib/cart'

type PaymentState = 'checking' | 'ready' | 'processing' | 'error'

type StatusResponse = {
  paymentStatus?: string
  accessReady?: boolean
  topicIds?: string[]
  error?: string
}

export default function StripeSuccessClient({ sessionId }: { sessionId: string }) {
  const [state, setState] = useState<PaymentState>('checking')
  const [message, setMessage] = useState('กำลังตรวจสอบการชำระเงินกับ Stripe')

  const checkStatus = useCallback(async (signal?: AbortSignal) => {
    try {
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const response = await fetch(`/api/payment/stripe-status?session_id=${encodeURIComponent(sessionId)}`, {
          cache: 'no-store',
          signal,
        })
        const data = await response.json().catch(() => ({})) as StatusResponse
        if (!response.ok) throw new Error(data.error ?? 'ตรวจสอบสถานะไม่สำเร็จ')

        if (data.paymentStatus === 'paid' && data.accessReady) {
          data.topicIds?.forEach((topicId) => removeFromCart(topicId))
          setState('ready')
          setMessage('ชำระเงินสำเร็จและเปิดสิทธิ์คอร์สแล้ว')
          return
        }

        if (data.paymentStatus === 'unpaid') {
          setState('processing')
          setMessage('Stripe ยังยืนยันยอดไม่เสร็จ กรุณารอสักครู่')
          return
        }

        await new Promise((resolve) => window.setTimeout(resolve, 1_250))
        if (signal?.aborted) return
      }

      setState('processing')
      setMessage('รับยอดชำระแล้ว ระบบกำลังเปิดสิทธิ์คอร์ส')
    } catch (error) {
      if (signal?.aborted) return
      setState('error')
      setMessage(error instanceof Error ? error.message : 'ตรวจสอบสถานะไม่สำเร็จ')
    }
  }, [sessionId])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => void checkStatus(controller.signal), 0)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [checkStatus])

  function retryStatusCheck() {
    setState('checking')
    setMessage('กำลังตรวจสอบการชำระเงินกับ Stripe')
    void checkStatus()
  }

  const StatusIcon = state === 'ready'
    ? CheckCircle2
    : state === 'processing'
      ? Clock3
      : state === 'error'
        ? TriangleAlert
        : Loader2

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-5 sm:p-6">
      <section className="w-full max-w-md rounded-2xl bg-card p-7 text-center shadow-[0_20px_48px_-32px_rgba(15,23,42,0.55)] sm:p-9" aria-live="polite">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${state === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
          <StatusIcon className={`h-7 w-7 ${state === 'checking' ? 'animate-spin' : ''}`} aria-hidden="true" />
        </div>
        <h1 className="mt-6 font-heading text-2xl font-bold tracking-[-0.025em] text-foreground">
          {state === 'ready' ? 'เปิดคอร์สเรียบร้อยแล้ว' : state === 'error' ? 'ตรวจสอบรายการไม่สำเร็จ' : 'กำลังยืนยันรายการ'}
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{message}</p>

        {state === 'ready' ? (
          <div className="mt-7 grid gap-3">
            <Link href="/courses" className="flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              ไปที่คอร์สของฉัน
            </Link>
            <Link href="/dashboard" className="flex min-h-12 items-center justify-center rounded-xl px-5 font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              กลับ Dashboard
            </Link>
          </div>
        ) : (
          <div className="mt-7 grid gap-3">
            <button
              type="button"
              onClick={retryStatusCheck}
              disabled={state === 'checking'}
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw className={`h-5 w-5 ${state === 'checking' ? 'animate-spin' : ''}`} aria-hidden="true" />
              ตรวจสอบอีกครั้ง
            </button>
            <Link href="/courses" className="flex min-h-12 items-center justify-center rounded-xl px-5 font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              ดูคอร์สของฉัน
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
