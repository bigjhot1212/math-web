'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Lightbulb, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { Question } from '@/lib/types/question'
import 'katex/dist/katex.min.css'

const InlineMath = dynamic(() => import('react-katex').then(m => m.InlineMath), { ssr: false })

export default function PracticeTopicPage() {
  const { topicId } = useParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/questions?topicId=${topicId}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions)
        setLoading(false)
      })
  }, [topicId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">กำลังโหลดโจทย์...</p>
    </div>
  )

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">ยังไม่มีโจทย์ในหัวข้อนี้</p>
    </div>
  )

  const q = questions[current]
  const isCorrect = selected === q.answer
  const isWrong = selected !== null && !isCorrect

  async function saveProgress(isCorrect: boolean, hintUsed: boolean) {
  await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      questionId: q.id,
      topicId: q.topicId,
      isCorrect,
      timeSpentSeconds: 0,
      hintUsed
    })
  })
}

  function handleNext() {
  saveProgress(isCorrect, showHint)
  setCurrent(c => c + 1)
  setSelected(null)
  setShowHint(false)
  setShowSolution(false)
}

  function renderText(text: string) {
    const parts = text.split(/(\$[^$]+\$)/)
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return <InlineMath key={i} math={part.slice(1, -1)} />
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            ข้อ {current + 1} / {questions.length}
          </span>
          <span className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
            {q.level} · {q.difficulty}
          </span>
        </div>

        <div className="h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_0_var(--primary)]"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="mb-6 text-lg leading-relaxed">
          {renderText(q.content.text)}
        </div>

        {showHint && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-start gap-2.5 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{q.hint}</span>
          </div>
        )}

        {q.content.choices && (
          <div className="flex flex-col gap-3 mb-6">
            {Object.entries(q.content.choices).map(([key, value]) => {
              const isSelectedCorrect = selected === key && isCorrect
              const isSelectedWrong = selected === key && isWrong
              const isRevealedAnswer = showSolution && key === q.answer

              let className = "flex items-center gap-3 p-4 rounded-2xl border transition-all "
              if (isSelectedCorrect) className += "border-green-500 bg-green-50 dark:bg-green-950"
              else if (isSelectedWrong) className += "border-red-500 bg-red-50 dark:bg-red-950"
              else if (isRevealedAnswer) className += "border-green-500 bg-green-50 dark:bg-green-950"
              else className += "border-border hover:border-primary hover:bg-accent/50 cursor-pointer"

              return (
                <div
                  key={key}
                  className={className}
                  onClick={() => {
                    if (!selected) {
                      setSelected(key)
                      if (key === q.answer) saveProgress(true, showHint)
                    }
                  }}
                >
                  <span className="font-medium text-sm w-6 text-muted-foreground uppercase shrink-0">{key}.</span>
                  <span className="text-sm flex-1">{renderText(value as string)}</span>
                  {(isSelectedCorrect || isRevealedAnswer) && (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" aria-hidden="true" />
                  )}
                  {isSelectedWrong && (
                    <XCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {showSolution && (
          <div className="mb-6 p-4 rounded-2xl border border-border bg-muted/30">
            <p className="font-medium text-sm mb-3">วิธีทำ</p>
            {q.solution.steps.map((step, i) => (
              <p key={i} className="text-sm text-muted-foreground mb-2">
                {i + 1}. {renderText(step)}
              </p>
            ))}
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          {isWrong && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
              ดู Hint
            </button>
          )}
          {selected && !showSolution && (
            <button
              onClick={() => setShowSolution(true)}
              className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent transition-colors cursor-pointer"
            >
              ดูเฉลย
            </button>
          )}
          {selected && current < questions.length - 1 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              ข้อถัดไป
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          {selected && current === questions.length - 1 && (
            <button
              onClick={() => window.location.href = '/practice'}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              เสร็จสิ้น
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

      </div>
    </main>
  )
}