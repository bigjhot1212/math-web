'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, BookOpenCheck, CheckCircle2, Target, XCircle } from 'lucide-react'
import { Question } from '@/lib/types/question'
import { formatMathForDisplay } from '@/lib/format-math'
import 'katex/dist/katex.min.css'

const InlineMath = dynamic(() => import('react-katex').then(m => m.InlineMath), { ssr: false })

function normalizeAnswer(value: unknown): string {
  return String(value ?? '').trim().replace(/,/g, '').replace(/\s+/g, '').toLowerCase()
}

function isCorrectAnswer(question: Question, value: unknown): boolean {
  const submitted = normalizeAnswer(value)
  const accepted = [question.answer, ...(question.acceptedAnswers ?? [])].map(normalizeAnswer)
  return submitted.length > 0 && accepted.includes(submitted)
}

type Session = {
  id: string
  exam_type: string
  score: number
  total_questions: number
  answers: Record<string, string>
  submitted_at: string
  started_at: string
}

const TOPIC_NAMES: Record<string, string> = {
  'math1-mock': 'ข้อสอบจำลอง คณิตศาสตร์ 1',
  'set': 'เซต',
  'logic': 'ตรรกศาสตร์',
  'real-numbers': 'จำนวนจริง',
  'relations-functions': 'ความสัมพันธ์และฟังก์ชัน',
  'exponential-logarithm': 'เอกซ์โพเนนเชียลและลอการิทึม',
  'analytic-geometry-conics': 'เรขาคณิตวิเคราะห์และภาคตัดกรวย',
  'trigonometry': 'ฟังก์ชันตรีโกณมิติ',
  'matrix': 'เมทริกซ์',
  'vector': 'เวกเตอร์',
  'complex-numbers': 'จำนวนเชิงซ้อน',
  'counting-probability': 'หลักการนับและความน่าจะเป็น',
  'sequences-series': 'ลำดับและอนุกรม',
  'calculus': 'แคลคูลัสเบื้องต้น',
  'statistics-distributions': 'สถิติและตัวแปรสุ่ม',
}

const EXAM_NAMES: Record<string, string> = {
  'basic-diagnostic-v1': 'แบบวัดพื้นฐาน A-Level Math 1',
}

function renderText(text: string) {
  const parts = text.split(/(\$[^$]+\$)/)
  return parts.map((part, i) =>
    part.startsWith('$') && part.endsWith('$')
      ? <InlineMath key={i} math={formatMathForDisplay(part.slice(1, -1))} />
      : <span key={i}>{part}</span>
  )
}

export default function ExamResultPage() {
  const { examId } = useParams<{ examId: string }>()
  const [session, setSession] = useState<Session | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/exam/${examId}`)
      .then(r => r.json())
      .then(data => {
        setSession(data.session)
        setQuestions(data.questions)
        setLoading(false)
      })
  }, [examId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลดผลสอบ...</p>
      </div>
    )
  }

  if (!session) return null

  const correctCount = questions.filter(q => isCorrectAnswer(q, session.answers?.[q.id])).length
  const earnedPoints = questions.reduce((sum, q) => (
    sum + (isCorrectAnswer(q, session.answers?.[q.id]) ? (q.type === 'short-answer' ? 5 : 3) : 0)
  ), 0)
  const maximumPoints = questions.reduce((sum, q) => sum + (q.type === 'short-answer' ? 5 : 3), 0)
  const percentage = maximumPoints > 0 ? Math.round((earnedPoints / maximumPoints) * 100) : 0

  const scoreColor =
    percentage >= 80 ? 'text-green-600' :
    percentage >= 60 ? 'text-amber-600' :
    'text-red-600'

  const scoreLabel =
    percentage >= 80 ? 'พื้นฐานพร้อมต่อยอด' :
    percentage >= 60 ? 'พื้นฐานเริ่มแน่นแล้ว' :
    'เจอบทที่ควรกลับไปอุดแล้ว'

  // Breakdown by topic
  const breakdown: Record<string, { correct: number; total: number }> = {}
  for (const q of questions) {
    if (!breakdown[q.topicId]) breakdown[q.topicId] = { correct: 0, total: 0 }
    breakdown[q.topicId].total++
    if (isCorrectAnswer(q, session.answers?.[q.id])) breakdown[q.topicId].correct++
  }

  const isBasicDiagnostic = session.exam_type === 'basic-diagnostic-v1'
  const topicResults = Object.entries(breakdown)
    .map(([topicId, stats]) => ({
      topicId,
      ...stats,
      percentage: Math.round((stats.correct / stats.total) * 100),
    }))
    .sort((a, b) => a.percentage - b.percentage)
  const strongTopics = topicResults.filter(topic => topic.percentage >= 70)
  const focusTopics = topicResults.filter(topic => topic.percentage < 70).slice(0, 4)

  const durationMs = new Date(session.submitted_at).getTime() - new Date(session.started_at).getTime()
  const durationMin = Math.floor(durationMs / 60000)
  const durationSec = Math.floor((durationMs % 60000) / 1000)

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* Score hero */}
        <div className="animate-fade-slide-in text-center py-10 mb-10 border-b border-border relative">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            {EXAM_NAMES[session.exam_type] ?? session.exam_type} · ผลสอบ
          </p>
          <div className={`font-heading text-8xl font-bold mb-3 tabular-nums ${scoreColor}`}>{percentage}%</div>
          <p className="text-muted-foreground text-lg mb-2">
            {earnedPoints} / {maximumPoints} คะแนน · ถูก {correctCount}/{questions.length} ข้อ
          </p>
          <p className={`font-medium ${scoreColor}`}>{scoreLabel}</p>
          <p className="text-xs text-muted-foreground mt-3">
            ใช้เวลา {durationMin} นาที {durationSec} วินาที
          </p>
        </div>

        {isBasicDiagnostic && (
          <section className="mb-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-green-500/25 bg-green-500/[0.06] p-6">
              <div className="flex items-center gap-3">
                <BookOpenCheck className="h-5 w-5 text-green-600" aria-hidden="true" />
                <h2 className="font-heading text-lg font-semibold text-foreground">พื้นฐานที่พร้อมต่อยอด</h2>
              </div>
              {strongTopics.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {strongTopics.map(topic => (
                    <span
                      key={topic.topicId}
                      className="rounded-lg border border-green-500/20 bg-background/70 px-3 py-2 text-xs text-foreground"
                    >
                      {TOPIC_NAMES[topic.topicId] ?? topic.topicId} · {topic.correct}/{topic.total}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  ยังไม่มีบทที่ผ่านเกณฑ์รอบนี้ ไม่เป็นไร—เริ่มเก็บจากบทที่พลาดน้อยที่สุดก่อน
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-primary/30 bg-primary/[0.06] p-6">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-heading text-lg font-semibold text-foreground">ควรเริ่มทบทวนจากตรงนี้</h2>
              </div>
              {focusTopics.length > 0 ? (
                <div className="mt-4 divide-y divide-border">
                  {focusTopics.map(topic => (
                    <Link
                      key={topic.topicId}
                      href={`/practice/${topic.topicId}`}
                      className="group flex items-center justify-between gap-4 py-3 text-sm text-foreground transition-colors hover:text-primary"
                    >
                      <span>{TOPIC_NAMES[topic.topicId] ?? topic.topicId}</span>
                      <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground group-hover:text-primary">
                        ฝึกบทนี้
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  ทำได้ดีทุกบท ลองต่อด้วยข้อสอบจำลองแบบจับเวลาได้เลย
                </p>
              )}
            </div>

            <p className="text-xs leading-5 text-muted-foreground md:col-span-2">
              ผลนี้เป็นสัญญาณเริ่มต้นจากโจทย์ 30 ข้อ ควรใช้ร่วมกับผลการฝึกเพิ่มเติมในแต่ละบท
            </p>
          </section>
        )}

        {/* Topic breakdown */}
        <div className="mb-10 p-5 rounded-3xl border border-border bg-card shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">
            ผลตามหัวข้อ
          </h2>
          <div className="flex flex-col gap-4">
            {topicResults.map(({ topicId, correct, total, percentage: pct }) => {
              const barColor =
                pct >= 80 ? 'bg-green-500' :
                pct >= 60 ? 'bg-amber-500' :
                'bg-red-500'
              return (
                <div key={topicId} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 sm:grid-cols-[12rem_1fr_auto]">
                  {isBasicDiagnostic ? (
                    <Link
                      href={`/practice/${topicId}`}
                      className="order-1 truncate text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {TOPIC_NAMES[topicId] ?? topicId}
                    </Link>
                  ) : (
                    <span className="order-1 truncate text-sm text-muted-foreground">
                      {TOPIC_NAMES[topicId] ?? topicId}
                    </span>
                  )}
                  <div className="order-3 col-span-2 h-2 overflow-hidden rounded-full bg-muted sm:order-2 sm:col-span-1">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="order-2 text-right text-sm text-muted-foreground sm:order-3 sm:w-12">
                    {correct}/{total}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Per-question review */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">
            รายละเอียดแต่ละข้อ
          </h2>
          <div className="flex flex-col gap-3">
            {questions.map((q, i) => {
              const userAns = session.answers?.[q.id]
              const correct = isCorrectAnswer(q, userAns)
              return (
                <div
                  key={q.id}
                  style={{ animationDelay: `${Math.min(i * 25, 300)}ms` }}
                  className={`animate-fade-slide-in p-4 rounded-2xl border ${
                    correct
                      ? 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800'
                      : 'border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs text-muted-foreground">ข้อ {i + 1}</span>
                    <span className={`flex items-center gap-1 text-xs font-semibold ${correct ? 'text-green-600' : 'text-red-600'}`}>
                      {correct ? (
                        <><CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> ถูก</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" aria-hidden="true" /> ผิด</>
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">
                    {renderText(q.content.text)}
                  </p>
                  {!correct && (
                    <div className="flex gap-5 mt-2 text-xs text-muted-foreground">
                      <span>
                        คำตอบของคุณ:{' '}
                        <strong className="text-red-600">{userAns ?? 'ไม่ได้ตอบ'}</strong>
                      </span>
                      <span>
                        เฉลย:{' '}
                        <strong className="text-green-600">{q.answer}</strong>
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/exam"
            className="px-6 py-3 border border-border rounded-xl text-sm hover:bg-accent transition-colors cursor-pointer"
          >
            สอบอีกครั้ง
          </Link>
          <Link
            href="/practice"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            ฝึกโจทย์ตามหัวข้อ
          </Link>
        </div>

      </div>
    </main>
  )
}
