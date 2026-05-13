'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { COURSES } from '@/content/course-videos'

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
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-3">คอร์สทั้งหมด</h1>
          <p className="text-muted-foreground mb-8">ฝึกโจทย์และสอบจำลอง A-Level คณิตศาสตร์ครบทุกหัวข้อ</p>

          <div className="inline-grid grid-cols-2 gap-4 text-left">
            <div className="px-5 py-4 rounded-xl border-2 border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">ราคาปกติ</p>
              <p className="text-2xl font-bold text-foreground mb-1">฿390</p>
              <p className="text-xs text-muted-foreground">ต่อบท</p>
            </div>
            <div className="px-5 py-4 rounded-xl border-2 border-primary relative">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold px-2 py-0.5 bg-primary text-primary-foreground rounded-full">โปรโมชัน</span>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">ซื้อ 2 บทขึ้นไป</p>
              <p className="text-2xl font-bold text-foreground mb-1">฿340</p>
              <p className="text-xs text-muted-foreground">ต่อบท (ประหยัด ฿50)</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-border overflow-hidden mb-10">
          {[...ALL_COURSES].sort((a, b) => {
            const aAvail = COURSES[a.id]?.status === 'available' ? 0 : 1
            const bAvail = COURSES[b.id]?.status === 'available' ? 0 : 1
            return aAvail - bAvail
          }).map(({ id, icon }, i) => {
            const course = COURSES[id]
            const owned = purchasedTopicIds.includes(id)
            const available = course.status === 'available'

            return (
              <div
                key={id}
                className={`flex items-center gap-4 px-5 py-4 ${i < ALL_COURSES.length - 1 ? 'border-b border-border' : ''} ${!available ? 'opacity-50' : ''}`}
              >
                <span className="text-xl w-8 text-center shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{course.name}</p>
                    {!available && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{course.desc}</p>
                </div>
                <div className="shrink-0 flex justify-end">
                  {!available ? null : owned ? (
                    <a
                      href={`/course/${id}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      ▶ เข้าเรียน
                    </a>
                  ) : (
                    <button
                      onClick={() => handleBuyTopic(id)}
                      disabled={topicLoading !== null}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-accent disabled:opacity-50 transition-colors text-right"
                    >
                      {topicLoading === id ? '...' : purchasedTopicIds.length > 0 ? (
                        <span className="flex flex-col items-end">
                          <span className="line-through text-muted-foreground">฿390</span>
                          <span className="text-foreground font-medium">฿340</span>
                        </span>
                      ) : '฿390 / บท'}
                    </button>
                  )}
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
