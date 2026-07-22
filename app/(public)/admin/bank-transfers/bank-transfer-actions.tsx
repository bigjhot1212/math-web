'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function BankTransferActions({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'confirm' | 'reject' | null>(null)

  async function act(action: 'confirm' | 'reject') {
    setLoading(action)
    try {
      const res = await fetch(`/api/admin/bank-transfers/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error()
      router.refresh()
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => act('confirm')}
        disabled={loading !== null}
        className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        {loading === 'confirm' ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'ยืนยัน'}
      </button>
      <button
        onClick={() => act('reject')}
        disabled={loading !== null}
        className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-destructive/10 hover:border-destructive/40 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
      >
        {loading === 'reject' ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : 'ปฏิเสธ'}
      </button>
    </div>
  )
}
