import { NextRequest, NextResponse } from 'next/server'
import { Question } from '@/lib/types/question'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
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
    let questions: Question[] = JSON.parse(fileContent)

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