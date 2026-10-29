'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Crown } from 'lucide-react'
import WorldExplorer from '@/app/components/adventure/world-explorer'
import { ADVENTURE_TOPICS as TOPICS, type TopicProgress } from '@/lib/adventure-topics'
export type { TopicProgress } from '@/lib/adventure-topics'
import { formatMathForDisplay } from '@/lib/format-math'
import 'katex/dist/katex.min.css'

const InlineMath = dynamic(() => import('react-katex').then((module) => module.InlineMath), { ssr: false })

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

function renderMath(text: string) {
  return text.split(/(\$[^$]+\$)/).map((part, index) => (
    part.startsWith('$') && part.endsWith('$')
      ? <InlineMath key={index} math={formatMathForDisplay(part.slice(1, -1))} />
      : <span key={index}>{part}</span>
  ))
}

export default function PracticeExperience({ isLoggedIn, progress, lastTopicId, dailyIndex, dateLabel }: Props) {
  const [dailyChoice, setDailyChoice] = useState<number | null>(null)

  const daily = DAILY_QUESTIONS[dailyIndex % DAILY_QUESTIONS.length]
  const continueTopic = isLoggedIn ? TOPICS.find((topic) => topic.id === lastTopicId) : undefined
  const continueProgress = continueTopic ? (progress[continueTopic.id] ?? { done: 0, total: 50 }) : null

  return (
    <main className="adventure-page min-h-screen px-5 py-10 sm:px-8 sm:py-12 lg:px-14 lg:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-7">
        <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2.5 text-sm font-semibold text-primary">
              <span className="h-0.5 w-7 bg-current" aria-hidden="true" />
              เลือกบทที่อยากพิชิต · 14 หัวข้อ ม.4–ม.6
            </p>
            <h1 className="text-[clamp(2rem,4vw,2.625rem)] font-semibold leading-tight tracking-[-0.025em] text-foreground">
              ภารกิจฝึกโจทย์
            </h1>
          </div>

        </header>


        <WorldExplorer progress={progress} signedIn={isLoggedIn} recommendedTopicId={lastTopicId ?? undefined} />

        <section className={`grid gap-5 ${continueTopic ? 'lg:grid-cols-[1fr_1.15fr]' : 'grid-cols-1'}`} aria-label="เริ่มฝึกอย่างรวดเร็ว">
          {continueTopic && continueProgress && (
            <article className="relative flex min-h-64 flex-col gap-4 overflow-hidden rounded-lg bg-primary px-7 py-6 text-white ">
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
                  return <span key={index} className={`h-1.5 rounded-full ${index < activeSegments ? 'bg-white' : 'bg-white/20'}`} />
                })}
              </div>
              <div className="relative mt-auto flex flex-wrap items-center gap-4">
                <Link href={`/practice/${continueTopic.id}`} className="inline-flex min-h-11 items-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-primary transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                  ทำข้อที่ {Math.min(continueProgress.done + 1, continueProgress.total)} ต่อ →
                </Link>
                <span className="text-sm text-white/75">เหลืออีก {Math.max(continueProgress.total - continueProgress.done, 0)} ข้อ</span>
              </div>
            </article>
          )}

          <article className="flex min-h-64 flex-col gap-4 rounded-lg border border-border bg-card px-7 py-6 text-foreground ">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-primary">โจทย์ประจำวัน · {dateLabel}</p>
              <p className="text-xs text-muted-foreground">โจทย์สั้นก่อนเริ่มฝึกจริง</p>
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
                    className={`min-h-11 rounded-lg border-[1.5px] px-2 py-2 font-math text-base text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      correct
                        ? 'border-green-700 bg-green-50'
                        : wrong
                          ? 'border-red-700 bg-red-50'
                          : 'border-border bg-background hover:bg-accent'
                    }`}
                  >
                    <InlineMath math={formatMathForDisplay(choice)} />
                  </button>
                )
              })}
            </div>
            <div className="mt-auto text-sm leading-relaxed text-muted-foreground" aria-live="polite">
              {dailyChoice === null ? (
                'เลือกคำตอบเพื่อดูแนวคิด'
              ) : (
                <>
                  <strong className={dailyChoice === daily.correct ? 'text-green-800' : 'text-primary'}>
                    {dailyChoice === daily.correct ? 'ถูกต้อง! ' : 'ยังไม่ใช่ — '}
                  </strong>
                  {renderMath(daily.explanation)}
                </>
              )}
            </div>
          </article>
        </section>

        <Link href="/premium" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-4 text-sm">
          <span className="flex items-center gap-3"><Crown className="size-5 shrink-0 text-[var(--brass)]" aria-hidden="true" /><span><strong className="text-primary">แบบฝึกหัดรวมบท A-Level</strong><span className="mt-1 block text-muted-foreground">Premium สำหรับนักเรียนที่ซื้อคอร์ส · ชุดละ 30 ข้อ พร้อมเฉลยละเอียด</span></span></span>
          <span className="font-semibold text-primary">ดูแบบฝึกหัด →</span>
        </Link>

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
