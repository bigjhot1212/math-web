'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Trash2, ShoppingCart, CheckCircle2 } from 'lucide-react'
import { COURSES } from '@/content/course-videos'
import { getCart, removeFromCart, onCartChange } from '@/lib/cart'

type Props = { isLoggedIn: boolean; purchasedTopicIds: string[] }

export default function CartClient({ isLoggedIn, purchasedTopicIds }: Props) {
  const router = useRouter()
  const [cart, setCart] = useState<string[]>([])

  useEffect(() => {
    const update = () => setCart(getCart())
    update()
    return onCartChange(update)
  }, [])

  const items = cart
    .map((id) => ({ id, course: COURSES[id] }))
    .filter((x): x is { id: string; course: NonNullable<typeof x.course> } => !!x.course)

  const owned = items.filter((x) => purchasedTopicIds.includes(x.id))
  const payable = items.filter((x) => !purchasedTopicIds.includes(x.id))
  const total = payable.reduce((sum, x) => sum + (x.course.price ?? 390), 0)

  function handleCheckout() {
    const ids = payable.map((x) => x.id).join(',')
    if (!isLoggedIn) { router.push(`/login?next=${encodeURIComponent(`/checkout?type=cart&ids=${ids}`)}`); return }
    router.push(`/checkout?type=cart&ids=${ids}`)
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <a href="/pricing" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            กลับหน้าคอร์ส
          </a>
        </div>

        <h1 className="text-2xl font-heading font-bold text-foreground mb-6">ตะกร้าของคุณ</h1>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center text-muted-foreground">
            <ShoppingCart className="w-8 h-8 mx-auto mb-3" aria-hidden="true" />
            <p className="text-sm mb-4">ยังไม่มีคอร์สในตะกร้า</p>
            <a href="/pricing" className="text-sm text-primary hover:underline cursor-pointer">เลือกคอร์ส →</a>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {payable.map(({ id, course }) => (
                <div key={id} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card/70">
                  <div>
                    <p className="text-sm font-medium text-foreground">{course.name}</p>
                    <p className="text-xs text-muted-foreground">{course.nameEn}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-heading font-bold text-cta tabular-nums">฿{course.price ?? 390}</span>
                    <button
                      onClick={() => removeFromCart(id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="นำออกจากตะกร้า"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}

              {owned.map(({ id, course }) => (
                <div key={id} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-muted/30 opacity-70">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{course.name}</p>
                      <p className="text-xs text-muted-foreground">เป็นเจ้าของแล้ว — จะไม่ถูกเรียกเก็บเงินซ้ำ</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="นำออกจากตะกร้า"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            {payable.length > 0 && (
              <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">ยอดรวม ({payable.length} คอร์ส)</span>
                  <span className="text-xl font-heading font-bold text-cta tabular-nums">฿{total}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
                >
                  ดำเนินการชำระเงิน
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
