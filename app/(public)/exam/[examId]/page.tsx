'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Question } from '@/lib/types/question'
import 'katex/dist/katex.min.css'

const InlineMath = dynamic(() => import('react-katex').then(m => m.InlineMath), { ssr: false })

type ExamData = {
  examId: string
  questions: Question[]
  durationMinutes: number
  startedAt: string
}

const EXAM_DURATIONS: Record<string, number> = {
  ONET: 90,
  'A-Level': 90,
  PAT1: 180,
}

function renderText(text: string) {
  const parts = text.split(/(\$[^$]+\$)/)
  return parts.map((part, i) =>
    part.startsWith('$') && part.endsWith('$')
      ? <InlineMath key={i} math={part.slice(1, -1)} />
      : <span key={i}>{part}</span>
  )
}

function formatTime(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function ExamRoomPage() {
  const { examId } = useParams<{ examId: string }>()
  const router = useRouter()

  const [examData, setExamData] = useState<ExamData | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const endTimeRef = useRef(0)
  const answersRef = useRef<Record<string, string>>({})
  const submittingRef = useRef(false)

  answersRef.current = answers

  useEffect(() => {
    const cached = sessionStorage.getItem(`exam_${examId}`)
    if (cached) {
      const data = JSON.parse(cached) as ExamData
      setExamData(data)
      endTimeRef.current = new Date(data.startedAt).getTime() + data.durationMinutes * 60 * 1000
      setTimeLeft(Math.max(0, endTimeRef.current - Date.now()))
      return
    }
    fetch(`/api/exam/${examId}`)
      .then(r => r.json())
      .then(({ session, questions }) => {
        const durationMinutes = EXAM_DURATIONS[session.exam_type] ?? 90
        const data: ExamData = {
          examId: session.id,
          questions,
          durationMinutes,
          startedAt: session.started_at,
        }
        setExamData(data)
        endTimeRef.current = new Date(data.startedAt).getTime() + durationMinutes * 60 * 1000
        setTimeLeft(Math.max(0, endTimeRef.current - Date.now()))
        if (session.answers && Object.keys(session.answers).length > 0) {
          setAnswers(session.answers)
        }
      })
  }, [examId])

  async function handleSubmit() {
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId, answers: answersRef.current }),
      })
      if (res.ok) {
        sessionStorage.removeItem(`exam_${examId}`)
        router.push(`/exam/${examId}/result`)
      } else {
        submittingRef.current = false
        setSubmitting(false)
      }
    } catch {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const handleSubmitRef = useRef(handleSubmit)
  handleSubmitRef.current = handleSubmit

  useEffect(() => {
    if (!examData) return
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTimeRef.current - Date.now())
      setTimeLeft(remaining)
      if (remaining === 0) {
        clearInterval(interval)
        handleSubmitRef.current()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [examData])

  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">กำลังโหลดข้อสอบ...</p>
      </div>
    )
  }

  const q = examData.questions[current]
  const answeredCount = Object.keys(answers).length
  const isLowTime = timeLeft < 5 * 60 * 1000
  const isCritical = timeLeft < 60 * 1000

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur px-4 py-3 flex items-center justify-between gap-4">
        <span className="text-sm text-muted-foreground">
          ตอบแล้ว{' '}
          <span className="font-medium text-foreground">{answeredCount}</span>
          /{examData.questions.length}
        </span>

        <span className={`font-mono text-xl font-semibold tabular-nums ${isCritical ? 'text-red-600' : isLowTime ? 'text-amber-600' : 'text-foreground'}`}>
          {formatTime(timeLeft)}
        </span>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={submitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          ส่งข้อสอบ
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar nav */}
        <aside className="hidden md:flex flex-col w-44 shrink-0 border-r border-border p-4 overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-3">นำทางข้อสอบ</p>
          <div className="grid grid-cols-4 gap-1.5">
            {examData.questions.map((qn, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-8 rounded text-xs font-medium transition-colors ${
                  i === current
                    ? 'bg-primary text-primary-foreground'
                    : answers[qn.id]
                    ? 'bg-primary/15 text-primary'
                    : 'border border-border text-muted-foreground hover:bg-accent'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </aside>

        {/* Question area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-muted-foreground font-medium">ข้อที่ {current + 1}</span>
              <span className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
                {q.level} · {q.difficulty}
              </span>
            </div>

            <div className="mb-8 text-base leading-relaxed text-foreground">
              {renderText(q.content.text)}
            </div>

            {q.content.choices && (
              <div className="flex flex-col gap-3">
                {Object.entries(q.content.choices).map(([key, value]) => {
                  const selected = answers[q.id] === key
                  return (
                    <button
                      key={key}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: key }))}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left w-full transition-all ${
                        selected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-accent/50'
                      }`}
                    >
                      <span className={`font-semibold text-sm w-6 shrink-0 uppercase ${selected ? 'text-primary' : 'text-muted-foreground'}`}>
                        {key}.
                      </span>
                      <span className="text-sm text-foreground">{renderText(value as string)}</span>
                    </button>
                  )
                })}
              </div>
            )}

            <div className="flex justify-between mt-10">
              <button
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                disabled={current === 0}
                className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-30"
              >
                ← ก่อนหน้า
              </button>
              {current < examData.questions.length - 1 ? (
                <button
                  onClick={() => setCurrent(c => c + 1)}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  ถัดไป →
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  ส่งข้อสอบ
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile question nav */}
      <div className="md:hidden border-t border-border bg-background p-3 overflow-x-auto">
        <div className="flex gap-1.5 w-max">
          {examData.questions.map((qn, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-8 w-8 shrink-0 rounded text-xs font-medium transition-colors ${
                i === current
                  ? 'bg-primary text-primary-foreground'
                  : answers[qn.id]
                  ? 'bg-primary/15 text-primary'
                  : 'border border-border text-muted-foreground'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl border border-border p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-lg font-semibold mb-2 text-foreground">ยืนยันการส่งข้อสอบ</h2>
            <p className="text-sm text-muted-foreground mb-1">
              คุณตอบแล้ว{' '}
              <span className="font-medium text-foreground">{answeredCount}</span>{' '}
              จาก{' '}
              <span className="font-medium text-foreground">{examData.questions.length}</span>{' '}
              ข้อ
            </p>
            {answeredCount < examData.questions.length && (
              <p className="text-sm text-amber-600 mb-4">
                ยังมี {examData.questions.length - answeredCount} ข้อที่ยังไม่ได้ตอบ
              </p>
            )}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => { setShowConfirm(false); handleSubmit() }}
                disabled={submitting}
                className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {submitting ? 'กำลังส่ง...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
