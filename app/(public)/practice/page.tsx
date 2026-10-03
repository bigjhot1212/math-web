import { createClient } from '@/lib/supabase/server'
import PracticeExperience, { type TopicProgress } from './practice-experience'

type ProgressRow = {
  topic_id: string
  question_id: string
  created_at: string
}

const TOTAL_QUESTIONS = 50

export default async function PracticePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const progress: Record<string, TopicProgress> = {}
  let lastTopicId: string | null = null

  if (user) {
    const { data } = await supabase
      .from('user_progress')
      .select('topic_id, question_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1500)

    const rows = (data ?? []) as ProgressRow[]
    lastTopicId = rows[0]?.topic_id ?? null

    const completedByTopic = new Map<string, Set<string>>()
    for (const row of rows) {
      const completed = completedByTopic.get(row.topic_id) ?? new Set<string>()
      completed.add(row.question_id)
      completedByTopic.set(row.topic_id, completed)
    }

    for (const [topicId, completed] of completedByTopic) {
      progress[topicId] = {
        done: Math.min(completed.size, TOTAL_QUESTIONS),
        total: TOTAL_QUESTIONS,
      }
    }
  }

  const today = new Date()
  const dateKey = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(today)
  const dailyIndex = [...dateKey].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const dateLabel = new Intl.DateTimeFormat('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric',
    month: 'short',
  }).format(today)

  return (
    <PracticeExperience
      isLoggedIn={Boolean(user)}
      progress={progress}
      lastTopicId={lastTopicId}
      dailyIndex={dailyIndex}
      dateLabel={dateLabel}
    />
  )
}
