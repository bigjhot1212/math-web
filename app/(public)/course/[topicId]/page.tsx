import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Clapperboard, ExternalLink } from 'lucide-react'
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
          <a
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            กลับหน้าคอร์ส
          </a>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">{course.name}</h1>
          <p className="text-sm text-muted-foreground">{course.nameEn} · {course.desc}</p>
        </div>

        {course.videoId ? (
          <div className="rounded-3xl overflow-hidden border border-border aspect-video shadow-sm">
            <iframe
              src={`https://www.youtube.com/embed/${course.videoId}`}
              title={course.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center gap-3 text-muted-foreground bg-card/40">
            <span className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Clapperboard className="w-7 h-7" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium">วิดีโอกำลังจะมาเร็วๆ นี้</p>
            <p className="text-xs">เนื้อหาอยู่ใน Google Classroom ของคุณแล้ว</p>
          </div>
        )}

        {course.classroomId && (
          <div className="mt-6 p-4 rounded-2xl border border-border bg-card/70 backdrop-blur-xl flex items-center justify-between transition-all duration-300 hover:shadow-[0_0_20px_-8px_var(--primary)]">
            <div>
              <p className="text-sm font-medium text-foreground">Google Classroom</p>
              <p className="text-xs text-muted-foreground">เนื้อหา วิดีโอ และแบบฝึกหัดเพิ่มเติม</p>
            </div>
            <a
              href={`https://classroom.google.com/c/${course.classroomId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              เปิด Classroom
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        )}

      </div>
    </main>
  )
}
