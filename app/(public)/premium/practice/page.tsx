import type { Metadata } from 'next'
import PracticeSession from '../../practice/practice-session'

export const metadata: Metadata = {
  title: 'แบบฝึกหัดรวมบท | Math Hunters Premium',
}

type SearchParams = Promise<{ exam?: string; year?: string; topic?: string }>

export default async function PremiumPracticePage({ searchParams }: { searchParams: SearchParams }) {
  const { exam, year, topic } = await searchParams
  const filters = new URLSearchParams()
  if (exam) filters.set('exam', exam)
  if (year) filters.set('year', year)
  if (topic) filters.set('topic', topic)
  const query = filters.toString()

  return (
    <PracticeSession
      questionsUrl={`/api/premium/questions?${query}`}
      exitPath="/premium"
      returnPath={`/premium/practice?${query}`}
      lockedPath="/premium"
      emptyMessage="ยังไม่มีแบบฝึกหัดในชุดนี้"
    />
  )
}
