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
import { matrixChallengeQuestions } from '@/lib/content/matrix-challenge'
import { vectorChallengeQuestions } from '@/lib/content/vector-challenge'
import { complexNumbersChallengeQuestions } from '@/lib/content/complex-numbers-challenge'
import { countingProbabilityChallengeQuestions } from '@/lib/content/counting-probability-challenge'
import { sequencesSeriesChallengeQuestions } from '@/lib/content/sequences-series-challenge'
import { calculusChallengeQuestions } from '@/lib/content/calculus-challenge'
import { statisticsDistributionsChallengeQuestions } from '@/lib/content/statistics-distributions-challenge'
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
    const supplementalQuestionFiles = ['ipst-m4-book1-v1.json', 'ipst-m4-book2-v1.json']
    const supplementalQuestions = supplementalQuestionFiles.flatMap(fileName => {
      const supplementalPath = path.join(process.cwd(), 'content', 'questions', fileName)
      return fs.existsSync(supplementalPath)
        ? (JSON.parse(fs.readFileSync(supplementalPath, 'utf-8')) as Question[])
            .filter(question => question.topicId === topicId)
        : []
    })

    let questions: Question[] = topicId === 'set'
      ? [...setChallengeQuestions, ...supplementalQuestions]
      : topicId === 'logic'
        ? [...logicChallengeQuestions, ...supplementalQuestions]
        : topicId === 'real-numbers'
          ? [...realNumbersChallengeQuestions, ...supplementalQuestions]
          : topicId === 'relations-functions'
            ? [...relationsFunctionsChallengeQuestions, ...supplementalQuestions]
            : topicId === 'exponential-logarithm'
              ? [...exponentialLogarithmChallengeQuestions, ...supplementalQuestions]
              : topicId === 'analytic-geometry-conics'
                ? [...analyticGeometryConicsChallengeQuestions, ...supplementalQuestions]
                : topicId === 'trigonometry'
                  ? trigonometryChallengeQuestions
                  : topicId === 'matrix'
                    ? matrixChallengeQuestions
                    : topicId === 'vector'
                      ? vectorChallengeQuestions
                      : topicId === 'complex-numbers'
                        ? complexNumbersChallengeQuestions
                        : topicId === 'counting-probability'
                          ? countingProbabilityChallengeQuestions
                          : topicId === 'sequences-series'
                            ? sequencesSeriesChallengeQuestions
                            : topicId === 'calculus'
                              ? calculusChallengeQuestions
                              : topicId === 'statistics-distributions'
                                ? statisticsDistributionsChallengeQuestions
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

  } catch {
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
  }
}
