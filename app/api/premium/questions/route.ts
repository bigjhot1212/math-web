import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasPremiumAccess } from '@/lib/premium-access'
import { PREMIUM_BUCKET, PREMIUM_IMAGE_TTL_SECONDS, PREMIUM_QUESTION_COLUMNS, PREMIUM_SESSION_LIMIT, toPracticeQuestion, type PremiumQuestionRow } from '@/lib/premium-questions'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนฝึกโจทย์' }, { status: 401 })
  }
  if (!(await hasPremiumAccess(user))) {
    return NextResponse.json({ error: 'ฝึกโจทย์พรีเมียมสำหรับนักเรียนที่ซื้อคอร์ส' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const exam = searchParams.get('exam')
  const year = Number(searchParams.get('year'))
  const topic = searchParams.get('topic')
  const offset = Math.max(0, Number(searchParams.get('offset')) || 0)

  const admin = createAdminClient()
  let query = admin
    .from('premium_questions')
    .select(PREMIUM_QUESTION_COLUMNS)
    .eq('published', true)
  if (exam) query = query.eq('exam', exam)
  if (Number.isInteger(year) && year > 0) query = query.eq('exam_year', year)
  if (topic) query = query.eq('topic_id', topic)

  const { data, error } = await query
    .order('exam_year', { ascending: false })
    .order('question_number', { ascending: true })
    .range(offset, offset + PREMIUM_SESSION_LIMIT - 1)

  if (error) {
    console.error('Failed to load premium questions', error)
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
  }

  const rows = (data ?? []) as PremiumQuestionRow[]
  // Question images live in the private "premium" bucket; hand out short-lived links only
  const paths = rows.map(row => row.content.image).filter((image): image is string => !!image && !/^(https?:|data:)/.test(image))
  if (paths.length) {
    const { data: signed, error: signError } = await admin.storage.from(PREMIUM_BUCKET).createSignedUrls(paths, PREMIUM_IMAGE_TTL_SECONDS)
    if (signError) console.error('Failed to sign premium images', signError)
    const urls = new Map((signed ?? []).map(item => [item.path, item.signedUrl]))
    for (const row of rows) {
      if (row.content.image && urls.has(row.content.image)) row.content = { ...row.content, image: urls.get(row.content.image)! }
    }
  }

  return NextResponse.json({ questions: rows.map(toPracticeQuestion) })
}
