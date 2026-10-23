import type { Difficulty } from '@/lib/types/question'
import { getValidTimes, median } from '@/lib/progress-analytics'

export type EvidenceSource = 'practice' | 'exam'

export type LearningEvidence = {
  topicId: string
  questionId: string
  isCorrect: boolean
  source: EvidenceSource
  answeredAt: string
  timeSpentSeconds?: number | null
  difficulty?: Difficulty
}

export type InsightStatus = 'strong' | 'developing' | 'focus' | 'collecting'
export type ConfidenceLevel = 'high' | 'medium' | 'low'

export type TopicInsight = {
  topicId: string
  correct: number
  total: number
  accuracy: number
  practiceTotal: number
  examTotal: number
  medianSeconds: number | null
  status: InsightStatus
  statusLabel: string
  confidence: ConfidenceLevel
  confidenceLabel: string
  trendDelta: number | null
  weakestDifficulty: Difficulty | null
  weakestDifficultyAccuracy: number | null
  priority: number
}

const STATUS_LABELS: Record<InsightStatus, string> = {
  strong: 'พร้อมต่อยอด',
  developing: 'กำลังพัฒนา',
  focus: 'ควรกลับมาอุดพื้นฐาน',
  collecting: 'กำลังเก็บข้อมูล',
}

const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: 'ข้อมูลค่อนข้างชัด',
  medium: 'ข้อมูลเริ่มเพียงพอ',
  low: 'ควรทำเพิ่มเพื่อยืนยันผล',
}

function percentage(correct: number, total: number): number {
  return total > 0 ? Math.round((correct / total) * 100) : 0
}

function getTrendDelta(rows: LearningEvidence[]): number | null {
  if (rows.length < 8) return null
  const ordered = [...rows].sort((a, b) => Date.parse(a.answeredAt) - Date.parse(b.answeredAt))
  const recent = ordered.slice(-5)
  const previous = ordered.slice(-10, -5)
  if (previous.length < 3) return null
  const recentAccuracy = percentage(recent.filter(row => row.isCorrect).length, recent.length)
  const previousAccuracy = percentage(previous.filter(row => row.isCorrect).length, previous.length)
  return recentAccuracy - previousAccuracy
}

function getWeakestDifficulty(rows: LearningEvidence[]) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
  const compared = difficulties
    .map(difficulty => {
      const matches = rows.filter(row => row.difficulty === difficulty)
      return {
        difficulty,
        total: matches.length,
        accuracy: percentage(matches.filter(row => row.isCorrect).length, matches.length),
      }
    })
    .filter(group => group.total >= 2)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)

  return compared[0] ?? null
}

export function analyzeLearningEvidence(rows: LearningEvidence[]): TopicInsight[] {
  const grouped = new Map<string, LearningEvidence[]>()
  for (const row of rows) {
    const topicRows = grouped.get(row.topicId) ?? []
    topicRows.push(row)
    grouped.set(row.topicId, topicRows)
  }

  return Array.from(grouped, ([topicId, topicRows]) => {
    const total = topicRows.length
    const correct = topicRows.filter(row => row.isCorrect).length
    const accuracy = percentage(correct, total)
    const practiceRows = topicRows.filter(row => row.source === 'practice')
    const weakestDifficulty = getWeakestDifficulty(topicRows)

    const status: InsightStatus = total < 5
      ? 'collecting'
      : accuracy >= 80
        ? 'strong'
        : accuracy >= 60
          ? 'developing'
          : 'focus'

    const confidence: ConfidenceLevel = total >= 15 ? 'high' : total >= 7 ? 'medium' : 'low'
    const statusPriority: Record<InsightStatus, number> = {
      focus: 0,
      developing: 1,
      collecting: 2,
      strong: 3,
    }

    return {
      topicId,
      correct,
      total,
      accuracy,
      practiceTotal: practiceRows.length,
      examTotal: topicRows.filter(row => row.source === 'exam').length,
      medianSeconds: median(getValidTimes(practiceRows.map(row => ({
        topic_id: row.topicId,
        is_correct: row.isCorrect,
        time_spent_seconds: row.timeSpentSeconds,
      })))),
      status,
      statusLabel: STATUS_LABELS[status],
      confidence,
      confidenceLabel: CONFIDENCE_LABELS[confidence],
      trendDelta: getTrendDelta(topicRows),
      weakestDifficulty: weakestDifficulty?.difficulty ?? null,
      weakestDifficultyAccuracy: weakestDifficulty?.accuracy ?? null,
      priority: statusPriority[status],
    }
  }).sort((a, b) => a.priority - b.priority || a.accuracy - b.accuracy || b.total - a.total)
}
