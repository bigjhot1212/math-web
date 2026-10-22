'use client'

import { useParams } from 'next/navigation'
import PracticeSession from '../practice-session'

export default function PracticeTopicPage() {
  const { topicId } = useParams<{ topicId: string }>()

  return (
    <PracticeSession
      questionsUrl={`/api/questions?topicId=${topicId}`}
      exitPath="/practice"
      returnPath={`/practice/${topicId}`}
    />
  )
}
