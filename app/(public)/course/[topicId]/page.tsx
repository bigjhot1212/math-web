import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Clapperboard, ExternalLink, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { COURSES } from '@/content/course-videos'
import { getClassroomJoinCode, getClassroomUrl } from '@/lib/classroom-links'
import { isAdminEmail } from '@/lib/payment-config'

export default async function CoursePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params
  const course = COURSES[topicId]
  if (!course || course.status === 'coming_soon') notFound()
  const classroomUrl = getClassroomUrl(topicId, course.classroomId)
  const classroomCode = getClassroomJoinCode(topicId)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/course/${topicId}`)

  const [{ data: sub }, { data: purchase }] = await Promise.all([
    supabase.from('subscriptions').select('status').eq('user_id', user.id).single(),
    supabase.from('topic_purchases').select('id').eq('user_id', user.id).eq('topic_id', topicId).single(),
  ])

  if (!isAdminEmail(user.email) && sub?.status !== 'active' && !purchase) redirect('/pricing')

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <a
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            กลับคอร์สของฉัน
          </a>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-1">{course.name}</h1>
          <p className="text-sm text-muted-foreground">{course.nameEn} · {course.desc}</p>
        </div>

        {course.videoId ? (
          <div className="rounded-lg overflow-hidden border border-border aspect-video ">
            <iframe
              src={`https://www.youtube.com/embed/${course.videoId}`}
              title={course.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        ) : (
          <div className="rounded-lg border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center gap-3 text-muted-foreground bg-card/40">
            <span className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Clapperboard className="w-7 h-7" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium">วิดีโอกำลังจะมาเร็วๆ นี้</p>
            <p className="text-xs">เนื้อหาเรียนอยู่ใน Google Classroom</p>
          </div>
        )}

        {classroomUrl && (
          <div className="mt-6 p-4 rounded-lg border border-border bg-card/70 flex items-center justify-between transition-all duration-300 ">
            <div>
              <p className="text-sm font-medium text-foreground">Google Classroom</p>
              <p className="text-xs text-muted-foreground">เนื้อหา วิดีโอ และแบบฝึกหัดเพิ่มเติม</p>
            </div>
            <a
              href={classroomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              เปิด Classroom
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        )}

        {classroomCode && (
          <div className="mt-4 rounded-lg border border-border bg-card p-5 text-sm leading-6">
            <h2 className="font-heading font-semibold text-foreground">เข้าห้องครั้งแรกด้วยรหัสชั้นเรียน</h2>
            <p className="mt-2 text-muted-foreground">หากกดลิงก์แล้วไม่พบชั้นเรียน ให้เปิด Google Classroom เข้าสู่ระบบด้วยบัญชี Google ที่ต้องการใช้เรียน กดเครื่องหมาย + → เข้าร่วมชั้นเรียน แล้วกรอกรหัสนี้</p>
            <p className="mt-3 font-semibold text-foreground">รหัสชั้นเรียน: <span className="select-all font-mono tracking-wide">{classroomCode}</span></p>
            <p className="mt-2 text-muted-foreground">หากยังเข้าไม่ได้ กรุณาติดต่อผู้สอนพร้อมอีเมล Google ที่ใช้เรียน</p>
          </div>
        )}

        {course.curriculum && course.curriculum.length > 0 && (
          <div className="mt-6 p-5 rounded-lg border border-border bg-card/70 ">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
              <h2 className="text-sm font-heading font-semibold text-foreground">เนื้อหาในคอร์ส</h2>
            </div>
            <div className="space-y-5">
              {course.curriculum.map((section, sIdx) => (
                <div key={sIdx}>
                  {section.title && (
                    <p className="text-xs font-semibold text-primary  mb-2">{section.title}</p>
                  )}
                  <ol className="space-y-1.5">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-foreground">
                        <span className="text-muted-foreground tabular-nums shrink-0">{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
