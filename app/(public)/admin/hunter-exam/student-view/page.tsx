import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/payment-config'
import { getMath1MockSet } from '@/lib/content/math1-mock-sets'
import StudentExamPreview from './student-preview'

export const dynamic = 'force-dynamic'

export default async function StudentViewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')
  const exam = getMath1MockSet('hunter-rank-2026-11')
  if (!exam) return <p>ยังไม่พบชุดข้อสอบ</p>
  return <StudentExamPreview questions={exam.questions} />
}
