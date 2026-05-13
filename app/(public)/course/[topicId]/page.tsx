import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { COURSES } from '@/content/course-videos'

export default async function CoursePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params
  const course = COURSES[topicId]
  if (!course || course.status === 'coming_soon') notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/course/${topicId}`)

  const [{ data: sub }, { data: purchase }] = await Promise.all([
    supabase.from('subscriptions').select('status').eq('user_id', user.id).single(),
    supabase.from('topic_purchases').select('id').eq('user_id', user.id).eq('topic_id', topicId).single(),
  ])

  if (sub?.status !== 'active' && !purchase) redirect('/pricing')

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <a href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← กลับหน้าคอร์ส
          </a>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">{course.name}</h1>
          <p className="text-sm text-muted-foreground">{course.nameEn} · {course.desc}</p>
        </div>

        {course.videoId ? (
          <div className="rounded-xl overflow-hidden border border-border aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${course.videoId}`}
              title={course.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <span className="text-4xl">🎬</span>
            <p className="text-sm font-medium">วิดีโอกำลังจะมาเร็วๆ นี้</p>
            <p className="text-xs">เนื้อหาอยู่ใน Google Classroom ของคุณแล้ว</p>
          </div>
        )}

        {course.classroomId && (
          <div className="mt-6 p-4 rounded-xl border border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Google Classroom</p>
              <p className="text-xs text-muted-foreground">เนื้อหา วิดีโอ และแบบฝึกหัดเพิ่มเติม</p>
            </div>
            <a
              href={`https://classroom.google.com/c/${course.classroomId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              เปิด Classroom →
            </a>
          </div>
        )}

      </div>
    </main>
  )
}
