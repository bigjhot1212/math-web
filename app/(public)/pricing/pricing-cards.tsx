'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlayCircle, Loader2, Lock, CheckCircle2, Sparkles, ChevronDown, BookOpen, ShoppingCart, Check, MessageCircle } from 'lucide-react'
import { COURSES, ZONE_LABELS, BUNDLES, type CourseZone } from '@/content/course-videos'
import { getCart, addToCart, removeFromCart, onCartChange } from '@/lib/cart'
import CourseArtwork from './course-artwork'

function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setValue(target))
      return () => cancelAnimationFrame(reducedMotionFrame)
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
  { id: 'foundation-high-school' },
  { id: 'a-level-math-1-intensive' },
  { id: 'set' },
  { id: 'logic' },
  { id: 'real-numbers' },
  { id: 'relations-functions' },
  { id: 'exponential-logarithm' },
  { id: 'analytic-geometry-conics' },
  { id: 'trigonometry' },
  { id: 'matrix' },
  { id: 'vector' },
  { id: 'complex-numbers' },
  { id: 'counting-probability' },
  { id: 'sequences-series' },
  { id: 'calculus' },
  { id: 'statistics-distributions' },
]

const ZONE_ORDER: CourseZone[] = ['special', 'm6', 'm5', 'm4']

type Props = { isLoggedIn: boolean; purchasedTopicIds: string[] }

type CourseCardProps = {
  id: string
  index: number
  owned: boolean
  loading: boolean
  disabled: boolean
  onBuy: (id: string) => void
}

function CourseCard({ id, index, owned, loading, disabled, onBuy }: CourseCardProps) {
  const course = COURSES[id]
  const available = course.status === 'available'
  const isSpecial = course.zone === 'special'
  const [showCurriculum, setShowCurriculum] = useState(false)
  const totalLessons = course.curriculum?.reduce((sum, s) => sum + s.items.length, 0) ?? 0
  const [inCart, setInCart] = useState(false)

  useEffect(() => {
    const update = () => setInCart(getCart().includes(id))
    update()
    return onCartChange(update)
  }, [id])

  function toggleCart() {
    if (inCart) removeFromCart(id)
    else addToCart(id)
  }

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
      className={`animate-fade-slide-in group relative rounded-3xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-300 ${available ? 'hover:shadow-lg hover:-translate-y-1' : ''}`}
    >
      {/* Poster */}
      <div className={`relative overflow-hidden bg-[#171a3b] ${isSpecial ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}>
        <CourseArtwork courseId={id} courseName={course.name} featured={isSpecial} />

        {owned && (
          <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border border-white/10 bg-[oklch(0.17_0.04_265/.9)] text-primary">
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
            เป็นเจ้าของแล้ว
          </span>
        )}
        {available && !owned && (
          <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-1 rounded-full border border-white/10 bg-[oklch(0.17_0.04_265/.88)] text-white/85 backdrop-blur-sm">
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
      <div className={isSpecial ? 'p-5' : 'p-4'}>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {isSpecial ? 'คอร์สพิเศษ' : 'คอร์สออนไลน์'}
        </p>
        <h3 className={`${isSpecial ? 'text-lg' : 'text-sm'} font-heading font-semibold text-foreground mb-1 ${isSpecial ? '' : 'line-clamp-1'}`}>{course.name}</h3>
        <p className={`text-xs text-muted-foreground mb-3 ${isSpecial ? 'line-clamp-3' : 'line-clamp-2'}`}>{course.nameEn} · {course.desc}</p>

        {course.curriculum && course.curriculum.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setShowCurriculum((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              {showCurriculum ? 'ซ่อนเนื้อหา' : `ดูเนื้อหาในคอร์ส (${totalLessons} บท)`}
              <ChevronDown className={`w-3 h-3 transition-transform ${showCurriculum ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {showCurriculum && (
              <div className="mt-2 p-3 rounded-xl bg-accent/40 max-h-48 overflow-y-auto">
                {course.curriculum.map((section, sIdx) => (
                  <div key={sIdx} className={sIdx > 0 ? 'mt-2' : ''}>
                    {section.title && (
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">{section.title}</p>
                    )}
                    <ol className="space-y-1">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex gap-1.5 text-xs text-foreground">
                          <span className="text-muted-foreground tabular-nums shrink-0">{i + 1}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-baseline gap-1.5 text-lg font-heading font-bold text-cta tabular-nums shrink-0">
                ฿{course.price ?? '390'}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleCart}
                  title={inCart ? 'นำออกจากตะกร้า' : 'เพิ่มลงตะกร้า'}
                  className={`shrink-0 p-2 rounded-xl border transition-all cursor-pointer ${
                    inCart ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {inCart ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />}
                </button>
                <button
                  onClick={() => onBuy(id)}
                  disabled={disabled}
                  className="shrink-0 text-xs font-medium px-3 py-2 rounded-xl border border-border hover:border-cta hover:bg-cta/5 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" aria-label="กำลังดำเนินการ" />
                  ) : 'ซื้อเลย'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type BundleBannerProps = {
  bundleId: string
  isLoggedIn: boolean
  loading: boolean
  disabled: boolean
  onBuy: (bundleId: string) => void
}

function BundleBanner({ bundleId, isLoggedIn, loading, disabled, onBuy }: BundleBannerProps) {
  const bundle = BUNDLES[bundleId]

  return (
    <div className="mb-5 p-5 rounded-2xl border-2 border-cta bg-card/70 backdrop-blur-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:shadow-[0_0_32px_-6px_var(--cta)]">
      <span className="animate-pulse-glow pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-cta/40 blur-2xl" aria-hidden="true" />
      <div className="relative flex items-center gap-3 text-left">
        <span className="shrink-0 w-10 h-10 rounded-xl bg-cta/15 text-cta flex items-center justify-center">
          <Sparkles className="w-5 h-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-heading font-semibold text-foreground">{bundle.name}</p>
          <p className="text-xs text-muted-foreground">ซื้อพร้อมกันคุ้มกว่า</p>
        </div>
      </div>
      <div className="relative flex items-center gap-4 shrink-0">
        <p className="flex items-baseline gap-1.5 text-xl font-heading font-bold text-cta tabular-nums">
          ฿{bundle.price}
          <span className="text-xs font-normal text-muted-foreground line-through">฿{bundle.regularTotal}</span>
        </p>
        <button
          onClick={() => onBuy(bundleId)}
          disabled={disabled}
          className="shrink-0 text-xs font-medium px-4 py-2 rounded-xl bg-cta text-cta-foreground hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" aria-label="กำลังดำเนินการ" />
          ) : isLoggedIn ? 'ซื้อชุดนี้' : 'เข้าสู่ระบบเพื่อซื้อ'}
        </button>
      </div>
    </div>
  )
}

export default function PricingCards({ isLoggedIn, purchasedTopicIds }: Props) {
  const router = useRouter()
  const [topicLoading, setTopicLoading] = useState<string | null>(null)
  const [bundleLoading, setBundleLoading] = useState<string | null>(null)
  const [cart, setCart] = useState<string[]>([])
  const [activeZone, setActiveZone] = useState<CourseZone | 'all'>('all')
  const regularPrice = useCountUp(390)

  useEffect(() => {
    const update = () => setCart(getCart())
    update()
    return onCartChange(update)
  }, [])

  const cartTotal = cart.reduce((sum, id) => sum + (COURSES[id]?.price ?? 390), 0)

  function handleBuyTopic(topicId: string) {
    setTopicLoading(topicId)
    if (!isLoggedIn) { router.push(`/login?next=${encodeURIComponent(`/checkout?type=topic&id=${topicId}`)}`); return }
    router.push(`/checkout?type=topic&id=${topicId}`)
  }

  function handleBuyBundle(bundleId: string) {
    setBundleLoading(bundleId)
    if (!isLoggedIn) { router.push(`/login?next=${encodeURIComponent(`/checkout?type=bundle&id=${bundleId}`)}`); return }
    router.push(`/checkout?type=bundle&id=${bundleId}`)
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Browse header */}
        <div className="mb-10 border-b border-border pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">MathPrep courses</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-heading font-bold text-foreground">เลือกคอร์สที่อยากเริ่ม</h1>
              <p className="mt-2 text-muted-foreground">เลือกเรียนเป็นบท หรือค่อย ๆ เก็บครบตามระดับชั้น</p>
            </div>

            <div className="inline-block self-start px-5 py-4 rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xl text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_-8px_var(--primary)]">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">เริ่มต้น</p>
              <p className="text-2xl font-heading font-bold text-foreground mb-1 tabular-nums">฿{regularPrice}</p>
              <p className="text-xs text-muted-foreground">ต่อบท</p>
            </div>
          </div>

          <div className="mt-7 flex gap-2 overflow-x-auto pb-1" aria-label="เลือกหมวดคอร์ส">
            {([{ id: 'all', label: 'ทุกคอร์ส' }, ...ZONE_ORDER.map((zone) => ({ id: zone, label: ZONE_LABELS[zone] }))] as { id: CourseZone | 'all'; label: string }[]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveZone(id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeZone === id ? 'bg-primary text-primary-foreground shadow-sm' : 'border border-border bg-card text-muted-foreground hover:border-primary/35 hover:text-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <a
          href="https://ig.me/m/j.3ra_"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-10 flex items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_-8px_var(--primary)]"
        >
          <span className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-heading font-semibold text-foreground">ยังเลือกคอร์สไม่ถูก?</span>
              <span className="block text-xs text-muted-foreground">ทักมาสอบถามพี่ได้โดยตรงทาง Instagram</span>
            </span>
          </span>
          <span className="shrink-0 text-xs font-semibold text-primary">ส่งข้อความเลย →</span>
        </a>

        {ZONE_ORDER.filter((zone) => activeZone === 'all' || activeZone === zone).map((zone) => {
          const zoneCourses = ALL_COURSES.filter(({ id }) => COURSES[id]?.zone === zone)
          if (zoneCourses.length === 0) return null

          const sorted = [...zoneCourses].sort((a, b) => {
            const aAvail = COURSES[a.id]?.status === 'available' ? 0 : 1
            const bAvail = COURSES[b.id]?.status === 'available' ? 0 : 1
            return aAvail - bAvail
          })

          const zoneBundles = Object.entries(BUNDLES).filter(
            ([, bundle]) => bundle.zone === zone && !bundle.topicIds.some((t) => purchasedTopicIds.includes(t))
          )

          return (
            <section key={zone} className="mb-10">
              <h2 className="text-lg font-heading font-bold text-foreground mb-5 pb-2 border-b border-border">
                {ZONE_LABELS[zone]}
              </h2>
              {zoneBundles.map(([bundleId]) => (
                <BundleBanner
                  key={bundleId}
                  bundleId={bundleId}
                  isLoggedIn={isLoggedIn}
                  loading={bundleLoading === bundleId}
                  disabled={bundleLoading !== null}
                  onBuy={handleBuyBundle}
                />
              ))}
              <div className={zone === 'special'
                ? 'grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2'
                : 'grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}>
                {sorted.map(({ id }, i) => (
                  <CourseCard
                    key={id}
                    id={id}
                    index={i}
                    owned={purchasedTopicIds.includes(id)}
                    loading={topicLoading === id}
                    disabled={topicLoading !== null}
                    onBuy={handleBuyTopic}
                  />
                ))}
              </div>
            </section>
          )
        })}

        {!isLoggedIn && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            <a href="/login" className="underline hover:text-foreground">เข้าสู่ระบบ</a> เพื่อซื้อคอร์ส
          </p>
        )}

      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-5 py-3 rounded-2xl border border-border bg-card shadow-lg">
          <span className="text-sm text-foreground">
            ตะกร้า <span className="font-semibold">{cart.length}</span> คอร์ส · <span className="font-heading font-bold text-cta tabular-nums">฿{cartTotal}</span>
          </span>
          <a
            href="/cart"
            className="text-xs font-medium px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            ไปที่ตะกร้า
          </a>
        </div>
      )}
    </main>
  )
}
