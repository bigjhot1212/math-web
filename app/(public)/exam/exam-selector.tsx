'use client'

import { Dialog } from 'radix-ui'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowRight, BookOpenCheck, CalendarClock, Clock3, Gauge, Layers3, Lock, Trophy } from 'lucide-react'
import { HUNTER_RANKING_RELEASE_AT } from '@/lib/hunter-ranking'

const BASIC_DIAGNOSTIC_TYPE = 'basic-diagnostic-v1'

function RankCountdown() {
  const router = useRouter()
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    let refreshed = false
    const tick = () => {
      const seconds = Math.max(0, Math.ceil((Date.parse(HUNTER_RANKING_RELEASE_AT) - Date.now()) / 1000))
      setRemaining(seconds)
      if (seconds === 0 && !refreshed) {
        refreshed = true
        router.refresh()
      }
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [router])

  if (remaining === null) return null
  if (remaining === 0) return <p className="mb-3 text-sm text-muted-foreground">กำลังตรวจสอบสถานะการเปิดสอบ...</p>

  const units = [
    { label: 'วัน', value: Math.floor(remaining / 86400) },
    { label: 'ชั่วโมง', value: Math.floor((remaining % 86400) / 3600) },
    { label: 'นาที', value: Math.floor((remaining % 3600) / 60) },
    { label: 'วินาที', value: remaining % 60 },
  ]

  return (
    <div className="mb-4" aria-label="เวลาที่เหลือก่อนเปิดสอบวัดแรงค์">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">นับถอยหลังสู่การเปิดสอบ</p>
      <div className="grid grid-cols-4 gap-2">
        {units.map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-cta/20 bg-background/70 px-2 py-2 text-center">
            <span className="block text-xl font-bold tabular-nums text-cta">{String(value).padStart(2, '0')}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const EXAMS = [
  {
    type: 'A-Level-1-free',
    subject: 'คณิตศาสตร์ 1',
    tier: 'ฟรี',
    tierStyle: 'bg-cta/15 text-cta',
    topics: 'ชุดคัดสรร: ฟังก์ชัน · เซต · ตรรกะ · ลอการิทึม · เรขาคณิต · แคลคูลัส',
    questionCount: 15,
    durationMinutes: 45,
    paid: false,
  },
  {
    type: 'A-Level-1-paid',
    subject: 'คณิตศาสตร์ 1',
    tier: 'Premium',
    tierStyle: 'bg-primary/15 text-primary',
    topics: 'เซต · ตรรกศาสตร์ · จำนวนจริง · ฟังก์ชัน · เอกซ์โพเนนเชียล · เรขาคณิตวิเคราะห์',
    questionCount: 30,
    durationMinutes: 90,
    paid: true,
    available: false,
  },
  {
    type: 'A-Level-2-free',
    subject: 'คณิตศาสตร์ 2',
    tier: 'ฟรี',
    tierStyle: 'bg-cta/15 text-cta',
    topics: 'ตรีโกณมิติ · เมทริกซ์ · เวกเตอร์ · จำนวนเชิงซ้อน · หลักการนับ · ลำดับ · แคลคูลัส · สถิติ',
    questionCount: 10,
    durationMinutes: 30,
    paid: false,
  },
  {
    type: 'A-Level-2-paid',
    subject: 'คณิตศาสตร์ 2',
    tier: 'Premium',
    tierStyle: 'bg-primary/15 text-primary',
    topics: 'ตรีโกณมิติ · เมทริกซ์ · เวกเตอร์ · จำนวนเชิงซ้อน · หลักการนับ · ลำดับ · แคลคูลัส · สถิติ',
    questionCount: 30,
    durationMinutes: 90,
    paid: true,
    available: false,
  },
]

type Props = {
  isPremium: boolean
  isLoggedIn: boolean
  monthlyRankExamType: string
  monthlyRankLabel: string
  monthlyRankStarted: boolean
  monthlyRankCompleted: boolean
  monthlyRankReleased: boolean
  monthlyRankRecoveryError: boolean
}

export default function ExamSelector({
  isPremium,
  isLoggedIn,
  monthlyRankExamType,
  monthlyRankLabel,
  monthlyRankStarted,
  monthlyRankCompleted,
  monthlyRankReleased,
  monthlyRankRecoveryError,
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showMonthlyWarning, setShowMonthlyWarning] = useState(false)

  async function startExam(examType: string) {
    if (!isLoggedIn) {
      router.push('/login?next=%2Fexam')
      return
    }
    setLoading(examType)
    setError(null)
    try {
      const res = await fetch('/api/exam/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create exam')
      sessionStorage.setItem(`exam_${data.examId}`, JSON.stringify(data))
      router.push(`/exam/${data.examId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด ลองใหม่อีกครั้ง')
      setLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">สนามสอบจำลอง</h1>
          <p className="text-muted-foreground">เริ่มจากเช็กพื้นฐานรายบท แล้วค่อยวางแผนฝึกให้ตรงจุด</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <section className="mb-8 overflow-hidden rounded-xl border border-cta/40 bg-card shadow-sm">
          <div className="grid md:grid-cols-[1fr_auto] md:items-center">
            <div className="p-7 md:p-9">
              <div className="flex items-center gap-3 text-cta">
                <Trophy className="h-6 w-6" aria-hidden="true" />
                <p className="text-sm font-semibold">ข้อสอบจัดอันดับประจำเดือน · {monthlyRankLabel}</p>
              </div>
              <h2 className="mt-4 font-heading text-2xl font-semibold text-foreground">{monthlyRankReleased ? 'วัดระดับเพื่อเปิดแรงค์ฮันเตอร์' : 'ระบบแรงค์เปิด 7 พฤศจิกายน'}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                ข้อสอบมาตรฐาน 30 ข้อเป็นคะแนนแรงค์ทางการของเดือนนี้ มีการหักคะแนนเมื่อตอบผิด และผลการฝึกจะไม่เพิ่มหรือลดแรงค์
              </p>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-primary" aria-hidden="true" />30 ข้อ</span>
                <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />90 นาที</span>
                <span className="inline-flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />1 ครั้งต่อเดือน</span>
              </div>
            </div>
            <div className="border-t border-border bg-cta/[0.06] p-7 md:border-l md:border-t-0 md:p-9">
              {!monthlyRankReleased && <RankCountdown />}
              {!monthlyRankReleased ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-cta/35 bg-cta/10 px-5 py-3 text-sm font-semibold text-cta"
                >
                  Coming Soon · 7 พฤศจิกายน
                </button>
              ) : monthlyRankRecoveryError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-6 text-foreground" role="alert">
                  ระบบกำลังตรวจสอบข้อมูลการสอบครั้งก่อน กรุณาติดต่อผู้ดูแลเพื่อช่วยตรวจสอบ
                </div>
              ) : monthlyRankCompleted ? (
                <Link href="/leaderboard" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cta px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  ดูแรงค์ประจำเดือน <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMonthlyWarning(true)}
                  disabled={loading !== null}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cta px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading === monthlyRankExamType ? 'กำลังเตรียมข้อสอบ...' : monthlyRankStarted ? 'ตรวจผลการสอบ' : 'เริ่มวัดระดับเดือนนี้'}
                  {loading !== monthlyRankExamType && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                </button>
              )}
              <p className="mt-4 text-xs leading-5 text-muted-foreground">{monthlyRankReleased ? 'เริ่มแล้วต้องทำต่อเนื่อง หากออกจากหน้าสอบ ระบบจะคิดคะแนนจากคำตอบที่ทำไว้ทันที' : 'เปิดให้เริ่มสอบพร้อมกันวันที่ 7 พฤศจิกายน 2569 เวลา 00:00 น.'}</p>
            </div>
          </div>
        </section>

        <section className="animate-fade-slide-in mb-12 overflow-hidden rounded-lg border border-primary/35 bg-card ">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            <div className="p-7 md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <span className="rounded-full bg-cta/15 px-3 py-1 text-xs font-semibold text-cta">
                  ฟรี · แบบวัดพื้นฐาน
                </span>
                <span className="text-xs text-muted-foreground">A-Level Math 1</span>
              </div>

              <h2 className="max-w-2xl font-heading text-2xl font-semibold leading-tight text-foreground md:text-3xl">
                เช็กให้ชัดว่าแต่ละบทแม่นแค่ไหน
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                ทำข้อสอบ 30 ข้อที่ครอบคลุมทั้ง 14 บท แล้วดูผลแยกเป็นรายหัวข้อทันที
                เพื่อรู้ว่าบทไหนพร้อมต่อยอดและบทไหนควรกลับไปทบทวนก่อน
              </p>

              <div className="mt-7 grid grid-cols-3 gap-3 border-y border-border py-5">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpenCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="text-xs">จำนวนข้อ</span>
                  </div>
                  <p className="mt-1 font-heading text-lg font-semibold text-foreground">30 ข้อ</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="text-xs">เวลาทำ</span>
                  </div>
                  <p className="mt-1 font-heading text-lg font-semibold text-foreground">90 นาที</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Layers3 className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="text-xs">เนื้อหา</span>
                  </div>
                  <p className="mt-1 font-heading text-lg font-semibold text-foreground">14 บท</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startExam(BASIC_DIAGNOSTIC_TYPE)}
                disabled={loading !== null}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {loading === BASIC_DIAGNOSTIC_TYPE ? 'กำลังเตรียมแบบทดสอบ...' : 'เริ่มทดสอบพื้นฐาน'}
                {loading !== BASIC_DIAGNOSTIC_TYPE && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>

            <div className="border-t border-border bg-primary/[0.06] p-7 lg:border-l lg:border-t-0 lg:p-9">
              <Gauge className="h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">หลังทำเสร็จจะได้อะไร</h3>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                  คะแนนรวมและเวลาที่ใช้จริง
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                  แผนภาพความแม่นแยกครบทุกบท
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cta" />
                  ลิงก์ไปฝึกบทที่ยังพลาดได้ทันที
                </li>
              </ul>
              <p className="mt-7 border-t border-border pt-5 text-xs leading-5 text-muted-foreground">
                แนะนำให้ทำรวดเดียวโดยไม่เปิดสูตร เพื่อให้ผลสะท้อนพื้นฐานจริงที่สุด
              </p>
            </div>
          </div>
        </section>

        <div className="mb-5">
          <h2 className="font-heading text-xl font-semibold text-foreground">ข้อสอบจำลองชุดอื่น</h2>
          <p className="mt-1 text-sm text-muted-foreground">ฝึกทำภายใต้เวลาใกล้เคียงสนามสอบจริง</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {EXAMS.map((exam, i) => {
            const unavailable = exam.available === false
            const locked = unavailable || (exam.paid && !isPremium)
            return (
              <div
                key={exam.type}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`animate-fade-slide-in p-6 rounded-lg border-2 bg-card/70 transition-all duration-300 ${
                  locked
                    ? 'border-primary/35 opacity-75'
                    : 'border-primary/30 hover:border-primary '
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${exam.tierStyle}`}>
                    {exam.tier}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    A-Level
                  </span>
                </div>

                <h2 className="text-base font-heading font-semibold text-foreground mb-1">{exam.subject}</h2>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{exam.topics}</p>

                <div className="flex gap-4 text-sm text-muted-foreground mb-5">
                  <span>{exam.questionCount} ข้อ</span>
                  <span>{exam.durationMinutes} นาที</span>
                </div>

                {unavailable ? (
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-primary/50 text-primary rounded-lg text-sm font-medium opacity-80 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    ยังไม่เปิดใช้งาน
                  </button>
                ) : locked ? (
                  <Link
                    href="/pricing"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-primary/50 text-primary rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    อัปเกรดเป็น Premium
                  </Link>
                ) : (
                  <button
                    onClick={() => startExam(exam.type)}
                    disabled={loading !== null}
                    className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading === exam.type ? 'กำลังโหลด...' : 'เริ่มสอบ'}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          ข้อสอบจะสุ่มจากคลังโจทย์ · เมื่อเริ่มสอบแล้วควรทำให้เสร็จในครั้งเดียว
        </p>
      </div>

      <Dialog.Root open={showMonthlyWarning} onOpenChange={setShowMonthlyWarning}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/55" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-xl md:p-7">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-700">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <Dialog.Title className="font-heading text-xl font-semibold text-foreground">พร้อมแล้วค่อยเริ่มสอบ</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
                  ข้อสอบจัดอันดับทำได้เดือนละครั้งและต้องทำต่อเนื่อง 90 นาที หากออกจากหน้าสอบ ปิดแท็บ หรือปิดแอป ระบบจะส่งคำตอบและคิดคะแนนเท่าที่ทำทันที
                </Dialog.Description>
              </div>
            </div>
            <ul className="mt-5 space-y-2 border-y border-border py-4 text-sm leading-6 text-foreground">
              <li>เตรียมเวลาให้ครบ 90 นาที</li>
              <li>ตรวจอินเทอร์เน็ตและแบตเตอรี่ให้พร้อม</li>
              <li>ปรนัย: ตอบถูก +3 · ตอบผิด −3</li>
              <li>อัตนัย: ตอบถูก +5 · ตอบผิด −5</li>
              <li>ข้อที่ไม่ตอบได้ 0 คะแนน และคะแนนรวมต่ำสุดคือ 0</li>
            </ul>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowMonthlyWarning(false)}
                className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
              >
                ยังไม่พร้อม
              </button>
              <button
                type="button"
                onClick={() => { setShowMonthlyWarning(false); startExam(monthlyRankExamType) }}
                disabled={loading !== null}
                className="rounded-lg bg-cta px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading === monthlyRankExamType ? 'กำลังเตรียมข้อสอบ...' : 'พร้อม เริ่มสอบทันที'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  )
}
