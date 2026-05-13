import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { questionId, topicId, isCorrect, timeSpentSeconds, hintUsed } = body

    const { error } = await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        question_id: questionId,
        topic_id: topicId,
        is_correct: isCorrect,
        time_spent_seconds: timeSpentSeconds,
        hint_used: hintUsed
      })

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}