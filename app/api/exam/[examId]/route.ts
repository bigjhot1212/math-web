import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Question } from '@/lib/types/question'
import fs from 'fs'
import path from 'path'

function loadAllQuestions(): Question[] {
  const dir = path.join(process.cwd(), 'content', 'questions')
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as Question[])
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params
    const supabase = await createClient()

    const { data: session, error } = await supabase
      .from('exam_sessions')
      .select('*')
      .eq('id', examId)
      .single()

    if (error || !session) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    const allQuestions = loadAllQuestions()
    const questionMap = new Map(allQuestions.map(q => [q.id, q]))
    const questions = (session.question_ids as string[])
      .map(id => questionMap.get(id))
      .filter((q): q is Question => q !== undefined)

    return NextResponse.json({ session, questions })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 })
  }
}
