'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Question } from '@/lib/types/question'
import 'katex/dist/katex.min.css'

const InlineMath = dynamic(() => import('react-katex').then(m => m.InlineMath), { ssr: false })

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

function renderText(text: string) {
  const parts = text.split(/(\$[^$]+\$)/)
  return parts.map((part, i) =>
    part.startsWith('$') && part.endsWith('$')
      ? <InlineMath key={i} math={part.slice(1, -1)} />
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

  const percentage = session.total_questions > 0
    ? Math.round((session.score / session.total_questions) * 100)
    : 0

  const scoreColor =
    percentage >= 80 ? 'text-green-600' :
    percentage >= 60 ? 'text-amber-600' :
    'text-red-600'

  const scoreLabel =
    percentage >= 80 ? 'ยอดเยี่ยม!' :
    percentage >= 60 ? 'ดีแล้ว ฝึกเพิ่มอีกนิดนึง' :
    'ต้องฝึกเพิ่มอีก'

  // Breakdown by topic
  const breakdown: Record<string, { correct: number; total: number }> = {}
  for (const q of questions) {
    if (!breakdown[q.topicId]) breakdown[q.topicId] = { correct: 0, total: 0 }
    breakdown[q.topicId].total++
    if (session.answers?.[q.id] === q.answer) breakdown[q.topicId].correct++
  }

  const durationMs = new Date(session.submitted_at).getTime() - new Date(session.started_at).getTime()
  const durationMin = Math.floor(durationMs / 60000)
  const durationSec = Math.floor((durationMs % 60000) / 1000)

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-2xl mx-auto">

        {/* Score hero */}
        <div className="text-center py-10 mb-10 border-b border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
            {session.exam_type} · ผลสอบ
          </p>
          <div className={`text-8xl font-bold mb-3 ${scoreColor}`}>{percentage}%</div>
          <p className="text-muted-foreground text-lg mb-2">
            {session.score} / {session.total_questions} ข้อ
          </p>
          <p className={`font-medium ${scoreColor}`}>{scoreLabel}</p>
          <p className="text-xs text-muted-foreground mt-3">
            ใช้เวลา {durationMin} นาที {durationSec} วินาที
          </p>
        </div>

        {/* Topic breakdown */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-foreground mb-5 uppercase tracking-wider">
            ผลตามหัวข้อ
          </h2>
          <div className="flex flex-col gap-4">
            {Object.entries(breakdown).map(([topicId, stats]) => {
              const pct = Math.round((stats.correct / stats.total) * 100)
              const barColor =
                pct >= 80 ? 'bg-green-500' :
                pct >= 60 ? 'bg-amber-500' :
                'bg-red-500'
              return (
                <div key={topicId} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-44 shrink-0 truncate">
                    {TOPIC_NAMES[topicId] ?? topicId}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right shrink-0">
                    {stats.correct}/{stats.total}
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
              const correct = userAns === q.answer
              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    correct
                      ? 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800'
                      : 'border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs text-muted-foreground">ข้อ {i + 1}</span>
                    <span className={`text-xs font-semibold ${correct ? 'text-green-600' : 'text-red-600'}`}>
                      {correct ? '✓ ถูก' : '✗ ผิด'}
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
            className="px-6 py-3 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
          >
            สอบอีกครั้ง
          </Link>
          <Link
            href="/practice"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            ฝึกโจทย์ตามหัวข้อ
          </Link>
        </div>

      </div>
    </main>
  )
}
