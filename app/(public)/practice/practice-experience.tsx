'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Dice5, Search } from 'lucide-react'
import styles from './practice.module.css'
import 'katex/dist/katex.min.css'

const InlineMath = dynamic(() => import('react-katex').then((module) => module.InlineMath), { ssr: false })

type Grade = 'all' | 'ม.4' | 'ม.5' | 'ม.6'

export type TopicProgress = {
  done: number
  total: number
}

type Topic = {
  id: string
  icon: string
  name: string
  nameEn: string
  grade: Exclude<Grade, 'all'>
  formula: string
}

type DailyQuestion = {
  question: string
  choices: string[]
  correct: number
  explanation: string
}

type Props = {
  isLoggedIn: boolean
  progress: Record<string, TopicProgress>
  lastTopicId: string | null
  dailyIndex: number
  dateLabel: string
}

const TOPICS: Topic[] = [
  { id: 'set', icon: '∪', name: 'เซต', nameEn: 'Set', grade: 'ม.4', formula: 'A \\cup B = \\{x \\mid x \\in A \\lor x \\in B\\}' },
  { id: 'logic', icon: '∧', name: 'ตรรกศาสตร์', nameEn: 'Logic', grade: 'ม.4', formula: 'p \\to q \\equiv \\neg p \\lor q' },
  { id: 'real-numbers', icon: 'ℝ', name: 'จำนวนจริง', nameEn: 'Real Numbers', grade: 'ม.4', formula: '|2x-3|<5' },
  { id: 'relations-functions', icon: 'f', name: 'ความสัมพันธ์และฟังก์ชัน', nameEn: 'Relations & Functions', grade: 'ม.4', formula: '(f \\circ g)(x)=f(g(x))' },
  { id: 'exponential-logarithm', icon: 'eˣ', name: 'เอกซ์โพเนนเชียลและลอการิทึม', nameEn: 'Exponential & Logarithm', grade: 'ม.4', formula: '\\log_a(xy)=\\log_a x+\\log_a y' },
  { id: 'analytic-geometry-conics', icon: '⊙', name: 'เรขาคณิตวิเคราะห์และภาคตัดกรวย', nameEn: 'Analytic Geometry & Conics', grade: 'ม.4', formula: '(x-h)^2+(y-k)^2=r^2' },
  { id: 'trigonometry', icon: '△', name: 'ฟังก์ชันตรีโกณมิติ', nameEn: 'Trigonometry', grade: 'ม.5', formula: '\\sin^2\\theta+\\cos^2\\theta=1' },
  { id: 'matrix', icon: '[ ]', name: 'เมทริกซ์', nameEn: 'Matrix', grade: 'ม.5', formula: '\\det(AB)=\\det A\\cdot\\det B' },
  { id: 'vector', icon: '→', name: 'เวกเตอร์', nameEn: 'Vector', grade: 'ม.5', formula: '\\mathbf{u}\\cdot\\mathbf{v}=|u||v|\\cos\\theta' },
  { id: 'complex-numbers', icon: 'ℂ', name: 'จำนวนเชิงซ้อน', nameEn: 'Complex Numbers', grade: 'ม.5', formula: 'i^2=-1' },
  { id: 'counting-probability', icon: 'n!', name: 'หลักการนับเบื้องต้นและความน่าจะเป็น', nameEn: 'Counting & Probability', grade: 'ม.5', formula: '\\binom{n}{r}=\\frac{n!}{r!(n-r)!}' },
  { id: 'sequences-series', icon: '∑', name: 'ลำดับและอนุกรม', nameEn: 'Sequences & Series', grade: 'ม.6', formula: 'S_n=\\frac{n}{2}(a_1+a_n)' },
  { id: 'calculus', icon: '∫', name: 'แคลคูลัสเบื้องต้น', nameEn: 'Calculus', grade: 'ม.6', formula: '\\frac{d}{dx}x^n=nx^{n-1}' },
  { id: 'statistics-distributions', icon: 'σ', name: 'สถิติและตัวแปรสุ่ม', nameEn: 'Statistics & Distributions', grade: 'ม.6', formula: 'z=\\frac{x-\\mu}{\\sigma}' },
]

const HUES = [275, 45, 190, 350, 150, 240, 20]

const DAILY_QUESTIONS: DailyQuestion[] = [
  {
    question: 'ถ้า $\\log_2 3=a$ แล้ว $\\log_{12}18$ เท่ากับเท่าใด',
    choices: ['\\frac{1+2a}{2+a}', '\\frac{2+a}{1+2a}', '\\frac{1+a}{2a}', '\\frac{2a}{1+a}'],
    correct: 0,
    explanation: '$\\log_{12}18=\\frac{\\log_2 18}{\\log_2 12}=\\frac{1+2a}{2+a}$',
  },
  {
    question: 'กำหนดให้ $n(A)=18$, $n(B)=20$ และ $n(A\\cup B)=30$ แล้ว $n(A\\cap B)$ เท่ากับเท่าใด',
    choices: ['6', '8', '10', '12'],
    correct: 1,
    explanation: '$n(A\\cap B)=18+20-30=8$',
  },
  {
    question: 'จงหา $\\displaystyle \\lim_{x\\to2}\\frac{x^2-4}{x-2}$',
    choices: ['0', '2', '4', 'หาไม่ได้'],
    correct: 2,
    explanation: 'แยกตัวประกอบ $x^2-4=(x-2)(x+2)$ แล้วแทนค่า จะได้ $4$',
  },
]

const GRADE_TABS: Array<{ id: Grade; label: string; dot: string }> = [
  { id: 'all', label: 'ทั้งหมด', dot: 'oklch(0.22 0.08 280)' },
  { id: 'ม.4', label: 'ม.4', dot: 'oklch(0.51 0.22 275)' },
  { id: 'ม.5', label: 'ม.5', dot: 'oklch(0.7 0.19 45)' },
  { id: 'ม.6', label: 'ม.6', dot: 'oklch(0.55 0.14 150)' },
]

function renderMath(text: string) {
  return text.split(/(\$[^$]+\$)/).map((part, index) => (
    part.startsWith('$') && part.endsWith('$')
      ? <InlineMath key={index} math={part.slice(1, -1)} />
      : <span key={index}>{part}</span>
  ))
}

function topicStyle(hue: number): CSSProperties {
  return {
    '--topic-bg': `oklch(0.955 0.04 ${hue})`,
    '--topic-border': `oklch(0.9 0.06 ${hue})`,
    '--topic-solid': `oklch(0.55 0.17 ${hue})`,
    '--topic-deep': `oklch(0.42 0.08 ${hue})`,
    '--topic-chip': `oklch(0.45 0.15 ${hue})`,
    '--topic-track': `oklch(0.9 0.05 ${hue})`,
    '--topic-watermark': `oklch(0.86 0.09 ${hue})`,
    '--topic-shadow': `oklch(0.5 0.17 ${hue} / .6)`,
  } as CSSProperties
}

function getStatus(done: number, total: number) {
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  if (done === 0) return 'ยังไม่เริ่ม'
  if (done >= total) return 'ครบแล้ว ✓'
  if (percent >= 80) return 'อีกนิดเดียว'
  return 'กำลังฝึก'
}

export default function PracticeExperience({ isLoggedIn, progress, lastTopicId, dailyIndex, dateLabel }: Props) {
  const [grade, setGrade] = useState<Grade>('all')
  const [query, setQuery] = useState('')
  const [pickedId, setPickedId] = useState<string | null>(null)
  const [rolling, setRolling] = useState(false)
  const [rolls, setRolls] = useState(0)
  const [dailyChoice, setDailyChoice] = useState<number | null>(null)
  const shuffleTimers = useRef<number[]>([])

  const daily = DAILY_QUESTIONS[dailyIndex % DAILY_QUESTIONS.length]
  const continueTopic = isLoggedIn ? TOPICS.find((topic) => topic.id === lastTopicId) : undefined
  const continueProgress = continueTopic ? (progress[continueTopic.id] ?? { done: 0, total: 50 }) : null

  const visibleTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('th')
    return TOPICS.filter((topic) => {
      const matchesGrade = grade === 'all' || topic.grade === grade
      const searchable = `${topic.name} ${topic.nameEn}`.toLocaleLowerCase('th')
      return matchesGrade && (!normalizedQuery || searchable.includes(normalizedQuery))
    })
  }, [grade, query])

  useEffect(() => () => {
    shuffleTimers.current.forEach((timer) => window.clearTimeout(timer))
  }, [])

  function shuffleTopic() {
    if (rolling || visibleTopics.length === 0) return
    shuffleTimers.current.forEach((timer) => window.clearTimeout(timer))
    shuffleTimers.current = []
    setRolling(true)

    let elapsed = 0
    for (let step = 0; step < 12; step += 1) {
      const delay = 60 + step * 18
      elapsed += delay
      const timer = window.setTimeout(() => {
        const topic = visibleTopics[Math.floor(Math.random() * visibleTopics.length)]
        setPickedId(topic.id)
        setRolls((value) => value + 1)
        if (step === 11) setRolling(false)
      }, elapsed)
      shuffleTimers.current.push(timer)
    }
  }

  const pickedTopic = TOPICS.find((topic) => topic.id === pickedId)

  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:px-8 sm:py-12 lg:px-14 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2.5 text-sm font-semibold text-primary">
              <span className="h-0.5 w-7 bg-current" aria-hidden="true" />
              14 หัวข้อ · ม.4–ม.6
            </p>
            <h1 className="text-[clamp(2rem,4vw,2.625rem)] font-semibold leading-tight tracking-[-0.025em] text-foreground">
              วันนี้อยากฝึกเรื่องไหน?
            </h1>
          </div>
          <button
            type="button"
            onClick={shuffleTopic}
            disabled={rolling || visibleTopics.length === 0}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-cta bg-[oklch(0.97_0.035_60)] px-5 py-3 text-sm font-bold text-[oklch(0.5_0.16_45)] transition-colors hover:bg-[oklch(0.95_0.05_60)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Dice5
              className="h-5 w-5 transition-transform duration-500"
              style={{ transform: `rotate(${rolls * 90}deg)` }}
              aria-hidden="true"
            />
            <span aria-live="polite">
              {rolling ? 'กำลังสุ่ม…' : pickedTopic ? `สุ่มใหม่ · ได้ ${pickedTopic.name}` : 'สุ่มหัวข้อให้หน่อย'}
            </span>
          </button>
        </header>

        <section className={`grid gap-5 ${continueTopic ? 'lg:grid-cols-[1fr_1.15fr]' : 'grid-cols-1'}`} aria-label="เริ่มฝึกอย่างรวดเร็ว">
          {continueTopic && continueProgress && (
            <article className="relative flex min-h-64 flex-col gap-4 overflow-hidden rounded-3xl bg-primary px-7 py-6 text-white">
              <span className="pointer-events-none absolute -bottom-16 -right-1 font-math text-[200px] leading-none text-white/10" aria-hidden="true">
                {continueTopic.icon}
              </span>
              <p className="relative text-sm font-semibold text-white/75">ทำต่อจากครั้งล่าสุด</p>
              <div className="relative">
                <h2 className="text-2xl font-semibold leading-snug">{continueTopic.name}</h2>
                <p className="mt-1 text-sm text-white/75">กลับไปฝึกต่อจากจุดล่าสุด · เก็บให้ครบ {continueProgress.total} ข้อ</p>
              </div>
              <div className="relative grid max-w-xs grid-cols-5 gap-1.5" aria-label={`ทำแล้ว ${continueProgress.done} จาก ${continueProgress.total} ข้อ`}>
                {Array.from({ length: 5 }, (_, index) => {
                  const activeSegments = Math.ceil((continueProgress.done / continueProgress.total) * 5)
                  return <span key={index} className={`h-1.5 rounded-full ${index < activeSegments ? 'bg-[oklch(0.78_0.15_45)]' : 'bg-white/25'}`} />
                })}
              </div>
              <div className="relative mt-auto flex flex-wrap items-center gap-4">
                <Link href={`/practice/${continueTopic.id}`} className="inline-flex min-h-11 items-center rounded-[14px] bg-white px-5 py-3 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                  ทำข้อที่ {Math.min(continueProgress.done + 1, continueProgress.total)} ต่อ →
                </Link>
                <span className="text-sm text-white/75">เหลืออีก {Math.max(continueProgress.total - continueProgress.done, 0)} ข้อ</span>
              </div>
            </article>
          )}

          <article className="flex min-h-64 flex-col gap-4 rounded-3xl bg-[oklch(0.22_0.08_280)] px-7 py-6 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-[oklch(0.78_0.15_45)]">โจทย์ประจำวัน · {dateLabel}</p>
              <p className="text-xs text-white/65">โจทย์สั้นก่อนเริ่มฝึกจริง</p>
            </div>
            <div className="text-lg leading-relaxed">{renderMath(daily.question)}</div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {daily.choices.map((choice, index) => {
                const answered = dailyChoice !== null
                const correct = answered && index === daily.correct
                const wrong = answered && index === dailyChoice && dailyChoice !== daily.correct
                return (
                  <button
                    key={choice}
                    type="button"
                    onClick={() => setDailyChoice(index)}
                    disabled={answered}
                    className={`min-h-11 rounded-xl border-[1.5px] px-2 py-2 font-math text-base text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                      correct
                        ? 'border-[oklch(0.7_0.14_150)] bg-[oklch(0.55_0.14_150/.35)]'
                        : wrong
                          ? 'border-[oklch(0.65_0.18_27)] bg-[oklch(0.58_0.2_27/.35)]'
                          : 'border-white/20 bg-white/[.06] hover:bg-white/10'
                    }`}
                  >
                    <InlineMath math={choice} />
                  </button>
                )
              })}
            </div>
            <div className="mt-auto text-sm leading-relaxed text-white/70" aria-live="polite">
              {dailyChoice === null ? (
                'เลือกคำตอบเพื่อดูแนวคิด'
              ) : (
                <>
                  <strong className={dailyChoice === daily.correct ? 'text-[oklch(0.78_0.14_150)]' : 'text-[oklch(0.78_0.15_45)]'}>
                    {dailyChoice === daily.correct ? 'ถูกต้อง! ' : 'ยังไม่ใช่ — '}
                  </strong>
                  {renderMath(daily.explanation)}
                </>
              )}
            </div>
          </article>
        </section>

        <section className="mt-1 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" aria-label="ค้นหาและกรองหัวข้อ">
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-[14px] bg-muted p-1">
            {GRADE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGrade(tab.id)}
                aria-pressed={grade === tab.id}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[10px] px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${grade === tab.id ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: tab.dot }} aria-hidden="true" />
                {tab.label}
              </button>
            ))}
          </div>
          <label className="flex min-h-12 w-full items-center gap-2.5 rounded-[14px] border border-border bg-white px-4 md:w-80">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">ค้นหาหัวข้อ</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหา เช่น ลอการิทึม, matrix"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
        </section>

        {visibleTopics.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="หัวข้อฝึกโจทย์">
            {visibleTopics.map((topic) => {
              const originalIndex = TOPICS.findIndex((item) => item.id === topic.id)
              const hue = HUES[originalIndex % HUES.length]
              const topicProgress = isLoggedIn ? (progress[topic.id] ?? { done: 0, total: 50 }) : { done: 0, total: 50 }
              const percent = Math.round((topicProgress.done / topicProgress.total) * 100)
              const href = isLoggedIn
                ? `/practice/${topic.id}`
                : `/login?next=${encodeURIComponent(`/practice/${topic.id}`)}`

              return (
                <Link
                  key={topic.id}
                  href={href}
                  style={topicStyle(hue)}
                  className={`${styles.card} ${pickedId === topic.id ? styles.picked : ''}`}
                  aria-label={`${topic.name} ${topic.nameEn} ${isLoggedIn ? `ทำแล้ว ${topicProgress.done} จาก ${topicProgress.total} ข้อ` : 'เข้าสู่ระบบเพื่อเริ่มฝึก'}`}
                >
                  <span className={styles.watermark} aria-hidden="true">{topic.icon}</span>
                  <span className={styles.topRow}>
                    <span className={styles.gradeChip}>{topic.grade}</span>
                    <span className={styles.count}>{isLoggedIn ? `${topicProgress.done}/${topicProgress.total} ข้อ` : 'เริ่มฝึก'}</span>
                  </span>
                  <span className={styles.titleGroup}>
                    <span className={styles.topicName}>{topic.name}</span>
                    <span className={styles.topicEnglish}>{topic.nameEn}</span>
                  </span>
                  <span className={styles.bottomGroup}>
                    <span className={styles.formula}><InlineMath math={topic.formula} /></span>
                    <span className={styles.progressRow}>
                      <span className={styles.progressTrack}>
                        <span className={styles.progressBar} style={{ width: `${percent}%` }} />
                      </span>
                      <span className={styles.status}>{isLoggedIn ? getStatus(topicProgress.done, topicProgress.total) : 'พร้อมเริ่ม'}</span>
                    </span>
                  </span>
                </Link>
              )
            })}
          </section>
        ) : (
          <div className="rounded-[22px] border-[1.5px] border-dashed border-border px-6 py-12 text-center text-muted-foreground">
            ไม่พบหัวข้อ “{query}” — ลองพิมพ์ชื่อภาษาอังกฤษดูไหม
          </div>
        )}

        <a
          href="https://ig.me/m/j.3ra_"
          target="_blank"
          rel="noopener noreferrer"
          className="self-center text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ติดตรงไหน? <strong className="text-primary">สอบถามพี่ทาง Instagram →</strong>
        </a>
      </div>
    </main>
  )
}
