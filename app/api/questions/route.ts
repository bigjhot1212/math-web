import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/types/question'
import { originalPracticeQuestions } from '@/lib/content/original-practice'
import { setChallengeQuestions } from '@/lib/content/set-challenge'
import { logicChallengeQuestions } from '@/lib/content/logic-challenge'
import { realNumbersChallengeQuestions } from '@/lib/content/real-numbers-challenge'
import { relationsFunctionsChallengeQuestions } from '@/lib/content/relations-functions-challenge'
import { exponentialLogarithmChallengeQuestions } from '@/lib/content/exponential-logarithm-challenge'
import { analyticGeometryConicsChallengeQuestions } from '@/lib/content/analytic-geometry-conics-challenge'
import { trigonometryChallengeQuestions } from '@/lib/content/trigonometry-challenge'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนฝึกโจทย์' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const topicId = searchParams.get('topicId')
  const level = searchParams.get('level')
  const difficulty = searchParams.get('difficulty')

  try {
    const filePath = path.join(process.cwd(), 'content', 'questions', `${topicId}.json`)
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Topic not found' }, { status: 404 })
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    let questions: Question[] = topicId === 'set'
      ? setChallengeQuestions
      : topicId === 'logic'
        ? logicChallengeQuestions
        : topicId === 'real-numbers'
          ? realNumbersChallengeQuestions
          : topicId === 'relations-functions'
            ? relationsFunctionsChallengeQuestions
            : topicId === 'exponential-logarithm'
              ? exponentialLogarithmChallengeQuestions
              : topicId === 'analytic-geometry-conics'
                ? analyticGeometryConicsChallengeQuestions
                : topicId === 'trigonometry'
                  ? trigonometryChallengeQuestions
        : [
          ...originalPracticeQuestions.filter(question => question.topicId === topicId),
          ...(JSON.parse(fileContent) as Question[]),
        ]

    if (level) {
      questions = questions.filter(q => q.level === level)
    }

    if (difficulty) {
      questions = questions.filter(q => q.difficulty === difficulty)
    }

    return NextResponse.json({ questions })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
  }
}
