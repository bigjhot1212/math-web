'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlayCircle, Loader2, Lock, CheckCircle2 } from 'lucide-react'
import { COURSES } from '@/content/course-videos'

const POSTER_GRADIENTS = [
  'bg-gradient-to-br from-[var(--primary)] to-[#1e1b4b]',
  'bg-gradient-to-br from-[var(--cta)] to-[#7c2d12]',
  'bg-gradient-to-br from-[var(--chart-3)] to-[#134e4a]',
]

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, durationMs])

  return value
}

const ALL_COURSES = [
  { id: 'set',                      icon: '∪'    },
  { id: 'logic',                    icon: '∧'    },
  { id: 'real-numbers',             icon: 'ℝ'    },
  { id: 'relations-functions',      icon: 'f(x)' },
  { id: 'exponential-logarithm',    icon: 'eˣ'   },
  { id: 'analytic-geometry-conics', icon: '⊙'    },
  { id: 'trigonometry',             icon: '△'    },
  { id: 'matrix',                   icon: '[]'   },
  { id: 'vector',                   icon: '→'    },
  { id: 'complex-numbers',          icon: 'ℂ'    },
  { id: 'counting-probability',     icon: 'n!'   },
  { id: 'sequences-series',         icon: '∑'    },
  { id: 'calculus',                 icon: '∫'    },
  { id: 'statistics-distributions', icon: 'σ'    },
]

type Props = { isLoggedIn: boolean; purchasedTopicIds: string[] }

export default function PricingCards({ isLoggedIn, purchasedTopicIds }: Props) {
  const router = useRouter()
  const [topicLoading, setTopicLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const regularPrice = useCountUp(390)
  const promoPrice = useCountUp(340)

  async function handleBuyTopic(topicId: string) {
    if (!isLoggedIn) { router.push('/login'); return }
    setTopicLoading(topicId)
    setError(null)
    try {
      const res = await fetch('/api/payment/checkout-topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      setTopicLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">คอร์สทั้งหมด</h1>
          <p className="text-muted-foreground mb-8">ฝึกโจทย์และสอบจำลอง A-Level คณิตศาสตร์ครบทุกหัวข้อ</p>

          <div className="inline-grid grid-cols-2 gap-4 text-left">
            <div className="px-5 py-4 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_-8px_var(--primary)]">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">ราคาปกติ</p>
              <p className="text-2xl font-heading font-bold text-foreground mb-1 tabular-nums">฿{regularPrice}</p>
              <p className="text-xs text-muted-foreground">ต่อบท</p>
            </div>
            <div className="px-5 py-4 rounded-2xl border-2 border-cta bg-card/70 backdrop-blur-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_32px_-6px_var(--cta)]">
              <span className="animate-pulse-glow pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-cta/40 blur-2xl" aria-hidden="true" />
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-2.5 py-0.5 bg-cta text-cta-foreground rounded-full z-10">โปรโมชัน</span>
              <p className="relative text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">ซื้อ 2 บทขึ้นไป</p>
              <p className="relative text-2xl font-heading font-bold text-foreground mb-1 tabular-nums">฿{promoPrice}</p>
              <p className="relative text-xs text-muted-foreground">ต่อบท (ประหยัด ฿50)</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
          {[...ALL_COURSES].sort((a, b) => {
            const aAvail = COURSES[a.id]?.status === 'available' ? 0 : 1
            const bAvail = COURSES[b.id]?.status === 'available' ? 0 : 1
            return aAvail - bAvail
          }).map(({ id, icon }, i) => {
            const course = COURSES[id]
            const owned = purchasedTopicIds.includes(id)
            const available = course.status === 'available'
            const gradient = POSTER_GRADIENTS[i % POSTER_GRADIENTS.length]

            return (
              <div
                key={id}
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
                className={`animate-fade-slide-in group relative rounded-3xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-300 ${available ? 'hover:shadow-lg hover:-translate-y-1' : ''}`}
              >
                {/* Poster */}
                <div className={`relative aspect-[4/3] flex items-center justify-center overflow-hidden ${gradient}`}>
                  <span className="text-7xl font-heading font-bold text-white/90 drop-shadow-lg select-none" aria-hidden="true">
                    {icon}
                  </span>
                  <span className="pointer-events-none absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />

                  {owned && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full bg-white/90 text-primary">
                      <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                      เป็นเจ้าของแล้ว
                    </span>
                  )}
                  {available && !owned && (
                    <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-1 rounded-full bg-white/85 text-foreground backdrop-blur-sm">
                      มีเฉลยละเอียด
                    </span>
                  )}
                  {!available && (
                    <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                      <Lock className="w-5 h-5" aria-hidden="true" />
                      <span className="text-xs font-medium">เร็วๆ นี้</span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">คอร์สออนไลน์</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{id}</span>
                  </div>
                  <h3 className="text-sm font-heading font-semibold text-foreground mb-1 line-clamp-1">{course.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.nameEn} · {course.desc}</p>

                  <div className="border-t border-border pt-3">
                    {!available ? (
                      <p className="text-sm font-semibold text-muted-foreground">Coming Soon</p>
                    ) : owned ? (
                      <a
                        href={`/course/${id}`}
                        className="group/btn relative flex items-center justify-center gap-1.5 w-full text-xs font-medium px-3 py-2 rounded-xl bg-primary text-primary-foreground overflow-hidden transition-transform cursor-pointer hover:scale-[1.02]"
                      >
                        <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 -translate-x-[200%] group-hover/btn:translate-x-[400%] transition-transform duration-700" aria-hidden="true" />
                        <PlayCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        เข้าเรียน
                      </a>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <p className="flex items-baseline gap-1.5 text-lg font-heading font-bold text-cta tabular-nums shrink-0">
                          ฿{purchasedTopicIds.length > 0 ? '340' : '390'}
                          {purchasedTopicIds.length > 0 && (
                            <span className="text-xs font-normal text-muted-foreground line-through">฿390</span>
                          )}
                        </p>
                        <button
                          onClick={() => handleBuyTopic(id)}
                          disabled={topicLoading !== null}
                          className="shrink-0 text-xs font-medium px-3 py-2 rounded-xl border border-border hover:border-cta hover:bg-cta/5 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                        >
                          {topicLoading === id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" aria-label="กำลังดำเนินการ" />
                          ) : 'ซื้อคอร์สนี้'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!isLoggedIn && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            <a href="/login" className="underline hover:text-foreground">เข้าสู่ระบบ</a> เพื่อซื้อคอร์ส
          </p>
        )}

      </div>
    </main>
  )
}
