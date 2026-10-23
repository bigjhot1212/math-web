'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Lightbulb, CheckCircle2, XCircle, ArrowLeft, ArrowRight, LogOut, SkipForward } from 'lucide-react'
import { Question } from '@/lib/types/question'
import { formatMathForDisplay } from '@/lib/format-math'
import Scratchpad from '@/app/components/scratchpad'
import 'katex/dist/katex.min.css'

const InlineMath = dynamic(() => import('react-katex').then(m => m.InlineMath), { ssr: false })

type Props = {
  // API that returns { questions }; 401 sends the student to log in, 403 to `lockedPath`
  questionsUrl: string
  // Where "ออกจากแบบฝึก" and "เสร็จสิ้น" go, and where login returns to
  exitPath: string
  returnPath: string
  lockedPath?: string
  emptyMessage?: string
}

export default function PracticeSession({ questionsUrl, exitPath, returnPath, lockedPath, emptyMessage = 'ยังไม่มีโจทย์ในหัวข้อนี้' }: Props) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [shortAnswer, setShortAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<{ questionId: string | null; elapsedMs: number; runningSince: number | null }>({
    questionId: null,
    elapsedMs: 0,
    runningSince: null,
  })
  const savedQuestionsRef = useRef(new Set<string>())
  const refreshedImagesRef = useRef(new Set<string>())

  useEffect(() => {
    fetch(questionsUrl)
      .then(async res => {
        if (res.status === 401) {
          window.location.assign(`/login?next=${encodeURIComponent(returnPath)}`)
          return null
        }
        if (res.status === 403 && lockedPath) {
          window.location.assign(lockedPath)
          return null
        }
        return res.json()
      })
      .then(data => {
        if (!data) return
        setQuestions(data.questions)
        setLoading(false)
        // Image links are short-lived; fetch them all now so later questions still show
        for (const question of data.questions as Question[]) {
          if (question.content.image) new Image().src = question.content.image
        }
      })
  }, [questionsUrl, returnPath, lockedPath])

  const currentQuestionId = questions[current]?.id ?? null

  useEffect(() => {
    if (!currentQuestionId) return
    timerRef.current = {
      questionId: currentQuestionId,
      elapsedMs: 0,
      runningSince: savedQuestionsRef.current.has(currentQuestionId) ? null : performance.now(),
    }
  }, [currentQuestionId])

  useEffect(() => {
    function pauseTimer() {
      const timer = timerRef.current
      if (timer.runningSince === null) return
      timer.elapsedMs += performance.now() - timer.runningSince
      timer.runningSince = null
    }

    function resumeTimer() {
      const timer = timerRef.current
      if (!timer.questionId || timer.runningSince !== null || savedQuestionsRef.current.has(timer.questionId)) return
      timer.runningSince = performance.now()
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') pauseTimer()
      else if (document.hasFocus()) resumeTimer()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', pauseTimer)
    window.addEventListener('focus', resumeTimer)
    return () => {
      pauseTimer()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', pauseTimer)
      window.removeEventListener('focus', resumeTimer)
    }
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">กำลังโหลดโจทย์...</p>
    </div>
  )

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">{emptyMessage}</p>
    </div>
  )

  const q = questions[current]
  const normalizeAnswer = (value: unknown) => String(value ?? '').trim().replace(/,/g, '').replace(/\s+/g, '').toLowerCase()
  const acceptedAnswers = [q.answer, ...(q.acceptedAnswers ?? [])].map(normalizeAnswer)
  const isCorrect = selected !== null && acceptedAnswers.includes(normalizeAnswer(selected))
  const isWrong = selected !== null && !isCorrect

  function getElapsedSeconds(questionId: string) {
    const timer = timerRef.current
    if (timer.questionId !== questionId) return 1
    if (timer.runningSince !== null) {
      // This helper runs only from answer event handlers, never during render.
      // eslint-disable-next-line react-hooks/purity
      timer.elapsedMs += performance.now() - timer.runningSince
      timer.runningSince = null
    }
    return Math.max(1, Math.round(timer.elapsedMs / 1000))
  }

  async function saveProgress(question: Question, answerIsCorrect: boolean, hintUsed: boolean) {
    if (savedQuestionsRef.current.has(question.id)) return
    savedQuestionsRef.current.add(question.id)

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          questionId: question.id,
          topicId: question.topicId,
          isCorrect: answerIsCorrect,
          timeSpentSeconds: getElapsedSeconds(question.id),
          hintUsed,
        }),
      })
      if (!response.ok) throw new Error('Progress request failed')
    } catch (error) {
      savedQuestionsRef.current.delete(question.id)
      console.error('Unable to save practice progress', error)
    }
  }

  function handleSelect(key: string) {
    if (selected !== null) return
    const answerIsCorrect = key === q.answer
    setSelected(key)
    void saveProgress(q, answerIsCorrect, showHint)
  }

  function handleNext() {
    setCurrent(c => c + 1)
    setSelected(null)
    setShowHint(false)
    setShowSolution(false)
    setShortAnswer('')
  }

  function moveToQuestion(nextQuestion: number) {
    setCurrent(nextQuestion)
    setSelected(null)
    setShowHint(false)
    setShowSolution(false)
    setShortAnswer('')
  }

  function handleShortAnswerSubmit() {
    const answer = shortAnswer.trim()
    if (!answer || selected !== null) return
    const answerIsCorrect = acceptedAnswers.includes(normalizeAnswer(answer))
    setSelected(answer)
    void saveProgress(q, answerIsCorrect, showHint)
  }

  // An expired image link: ask the API for fresh links once and swap in this question's image
  function refreshImage(questionId: string) {
    if (refreshedImagesRef.current.has(questionId)) return
    refreshedImagesRef.current.add(questionId)
    fetch(questionsUrl)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        const fresh = (data?.questions as Question[] | undefined)?.find(item => item.id === questionId)
        if (!fresh?.content.image) return
        setQuestions(items => items.map(item => (item.id === questionId ? { ...item, content: { ...item.content, image: fresh.content.image } } : item)))
      })
      .catch(error => console.error('Unable to refresh question image', error))
  }

  function renderText(text: string) {
    const parts = text.split(/(\$[^$]+\$)/)
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$')) {
        return <InlineMath key={i} math={formatMathForDisplay(part.slice(1, -1))} />
      }
      // **label** marks a heading inside worked solutions, e.g. "**ขั้นที่ 1**"
      return part.split(/(\*\*[^*]+\*\*)/).map((piece, j) =>
        piece.startsWith('**') && piece.endsWith('**') && piece.length > 4
          ? <strong key={`${i}-${j}`} className="font-semibold text-foreground">{piece.slice(2, -2)}</strong>
          : <span key={`${i}-${j}`}>{piece}</span>,
      )
    })
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-2xl mx-auto">

        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            ข้อ {current + 1} / {questions.length}
          </span>
          <button
            type="button"
            onClick={() => window.location.assign(exitPath)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            ออกจากแบบฝึก
          </button>
        </div>

        <div className="h-1.5 bg-muted rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 shadow-[0_0_8px_0_var(--primary)]"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>

        {q.source && q.tags.includes('past-exam') && (
          <p className="mb-2 text-xs font-semibold tracking-wide text-primary">ที่มา: {q.source}</p>
        )}
        {q.content.image && (
          // Past-exam questions are shown exactly as printed; the image comes from a signed URL.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={q.content.image}
            alt={`โจทย์ข้อ ${current + 1}`}
            className="mb-4 w-full rounded-2xl border border-border bg-white p-2 sm:p-3"
            onError={() => refreshImage(q.id)}
          />
        )}
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
            {Object.entries(q.content.choices).filter(([, value]) => value !== '').map(([key, value]) => {
              const isSelectedCorrect = selected === key && isCorrect
              const isSelectedWrong = selected === key && isWrong
              const isRevealedAnswer = showSolution && key === q.answer

              let className = "flex items-center gap-3 p-4 rounded-2xl border transition-all "
              if (isSelectedCorrect) className += "border-green-500 bg-green-50 dark:bg-green-950"
              else if (isSelectedWrong) className += "border-red-500 bg-red-50 dark:bg-red-950"
              else if (isRevealedAnswer) className += "border-green-500 bg-green-50 dark:bg-green-950"
              else className += "border-border hover:border-primary hover:bg-accent/50 cursor-pointer"

              return (
                <button
                  type="button"
                  key={key}
                  className={className}
                  onClick={() => handleSelect(key)}
                  disabled={selected !== null}
                  aria-pressed={selected === key}
                >
                  {q.content.image && /^\d$/.test(value) ? (
                    // the choices are printed in the question image; the button is just its number
                    <span className="text-sm font-semibold flex-1">ข้อ {value}</span>
                  ) : (
                    <>
                      <span className="font-medium text-sm w-6 text-muted-foreground uppercase shrink-0">{key}.</span>
                      <span className="text-sm flex-1">{renderText(value as string)}</span>
                    </>
                  )}
                  {(isSelectedCorrect || isRevealedAnswer) && (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" aria-hidden="true" />
                  )}
                  {isSelectedWrong && (
                    <XCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {q.type === 'short-answer' && !q.content.choices && (
          <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/[0.05] p-5">
            <label htmlFor={`short-answer-${q.id}`} className="mb-2 block text-sm font-medium text-foreground">
              คำตอบเป็นตัวเลข
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id={`short-answer-${q.id}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={shortAnswer}
                onChange={event => setShortAnswer(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter') handleShortAnswerSubmit()
                }}
                disabled={selected !== null}
                placeholder="กรอกเฉพาะตัวเลข"
                aria-describedby={`short-answer-help-${q.id}`}
                className={`min-h-11 flex-1 rounded-xl border bg-background px-4 py-3 font-mono text-base text-foreground outline-none transition focus:ring-2 focus:ring-primary/20 disabled:opacity-80 ${
                  selected === null ? 'border-border focus:border-primary' : isCorrect ? 'border-green-500' : 'border-red-500'
                }`}
              />
              <button
                type="button"
                onClick={handleShortAnswerSubmit}
                disabled={!shortAnswer.trim() || selected !== null}
                className="min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45"
              >
                ตรวจคำตอบ
              </button>
            </div>
            <p id={`short-answer-help-${q.id}`} className="mt-2 text-xs text-muted-foreground">
              ไม่ต้องใส่หน่วยหรือข้อความเพิ่มเติม
            </p>
            {selected !== null && (
              <div className={`mt-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm ${isCorrect ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-red-500/10 text-red-700 dark:text-red-300'}`}>
                {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
                <span>{isCorrect ? 'ถูกต้อง' : <>ยังไม่ถูก คำตอบที่ถูกคือ <strong>{String(q.answer)}</strong></>}</span>
              </div>
            )}
          </div>
        )}

        {showSolution && (
          <div className="mb-6 p-4 rounded-2xl border border-border bg-muted/30">
            <p className="font-medium text-sm mb-3">วิธีทำ</p>
            {q.solution.steps.map((step, i) => {
              // "[[img:url]]" is a figure that helps explain the solution
              const figure = step.match(/^\[\[img:(.+)\]\]$/)?.[1]
              if (figure) {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={figure} alt="รูปประกอบวิธีทำ" className="my-3 w-full max-w-md rounded-xl border border-border bg-white" />
                )
              }
              return (
              <p key={i} className="text-sm text-muted-foreground mb-2 leading-relaxed">
                {/* solutions written with their own headings are not numbered again */}
                {!q.solution.steps.some(item => item.startsWith('**')) && `${i + 1}. `}
                {renderText(step)}
              </p>
              )
            })}
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          {current > 0 && (
            <button
              type="button"
              onClick={() => moveToQuestion(current - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent active:scale-[0.98] transition-transform cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              ย้อนกลับ
            </button>
          )}
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
              onClick={() => window.location.href = exitPath}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              เสร็จสิ้น
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          {!selected && current < questions.length - 1 && (
            <button
              type="button"
              onClick={() => moveToQuestion(current + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm border border-border rounded-xl hover:bg-accent active:scale-[0.98] transition-transform cursor-pointer"
            >
              ข้ามข้อ
              <SkipForward className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

      </div>
      <Scratchpad
        key={`practice-${q.id}`}
        storageKey={`practice:${q.id}`}
        title={`กระดาษทด · ข้อ ${current + 1}`}
      />
    </main>
  )
}
