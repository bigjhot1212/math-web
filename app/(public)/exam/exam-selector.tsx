'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock } from 'lucide-react'

const EXAMS = [
  {
    type: 'A-Level-1-free',
    subject: 'คณิตศาสตร์ 1',
    tier: 'ฟรี',
    tierStyle: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    topics: 'เซต · ตรรกศาสตร์ · จำนวนจริง · ฟังก์ชัน · เอกซ์โพเนนเชียล · เรขาคณิตวิเคราะห์',
    questionCount: 10,
    durationMinutes: 30,
    paid: false,
  },
  {
    type: 'A-Level-1-paid',
    subject: 'คณิตศาสตร์ 1',
    tier: 'Premium',
    tierStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    topics: 'เซต · ตรรกศาสตร์ · จำนวนจริง · ฟังก์ชัน · เอกซ์โพเนนเชียล · เรขาคณิตวิเคราะห์',
    questionCount: 30,
    durationMinutes: 90,
    paid: true,
  },
  {
    type: 'A-Level-2-free',
    subject: 'คณิตศาสตร์ 2',
    tier: 'ฟรี',
    tierStyle: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    topics: 'ตรีโกณมิติ · เมทริกซ์ · เวกเตอร์ · จำนวนเชิงซ้อน · หลักการนับ · ลำดับ · แคลคูลัส · สถิติ',
    questionCount: 10,
    durationMinutes: 30,
    paid: false,
  },
  {
    type: 'A-Level-2-paid',
    subject: 'คณิตศาสตร์ 2',
    tier: 'Premium',
    tierStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    topics: 'ตรีโกณมิติ · เมทริกซ์ · เวกเตอร์ · จำนวนเชิงซ้อน · หลักการนับ · ลำดับ · แคลคูลัส · สถิติ',
    questionCount: 30,
    durationMinutes: 90,
    paid: true,
  },
]

type Props = { isPremium: boolean }

export default function ExamSelector({ isPremium }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function startExam(examType: string) {
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
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-heading font-semibold text-foreground mb-2">สอบจำลอง</h1>
          <p className="text-muted-foreground">ข้อสอบ A-Level คณิตศาสตร์ จับเวลาจริง</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {EXAMS.map((exam, i) => {
            const locked = exam.paid && !isPremium
            return (
              <div
                key={exam.type}
                style={{ animationDelay: `${i * 60}ms` }}
                className={`animate-fade-slide-in p-6 rounded-3xl border-2 bg-card/70 backdrop-blur-xl transition-all duration-300 ${
                  locked
                    ? 'border-amber-200 dark:border-amber-900 opacity-75'
                    : 'border-primary/30 hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_0_28px_-8px_var(--primary)]'
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

                {locked ? (
                  <Link
                    href="/pricing"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 rounded-xl text-sm font-medium hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors cursor-pointer"
                  >
                    <Lock className="w-4 h-4" aria-hidden="true" />
                    อัปเกรดเป็น Premium
                  </Link>
                ) : (
                  <button
                    onClick={() => startExam(exam.type)}
                    disabled={loading !== null}
                    className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
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
    </main>
  )
}
