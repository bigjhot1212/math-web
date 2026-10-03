import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, BookOpen, CheckCircle2, Clock3, PlayCircle, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BUNDLES, COURSES } from '@/content/course-videos'

type PurchaseRow = {
  topic_id: string
  payment_method: string | null
}

type PendingTransferRow = {
  id: string
  topic_id: string | null
  bundle_id: string | null
  created_at: string
}

const COURSE_MARKS: Record<string, string> = {
  'foundation-high-school': 'ABC',
  'a-level-math-1-intensive': 'A1',
  trigonometry: '△',
  'sequences-series': '∑',
  calculus: '∫',
  'statistics-distributions': 'σ',
}

function pendingCourseIds(row: PendingTransferRow) {
  if (row.bundle_id) return BUNDLES[row.bundle_id]?.topicIds ?? []
  return row.topic_id?.split(',').filter(Boolean) ?? []
}

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/courses')

  const [{ data: purchaseRows }, { data: subscription }, { data: pendingRows }] = await Promise.all([
    supabase
      .from('topic_purchases')
      .select('topic_id, payment_method')
      .eq('user_id', user.id),
    supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('bank_transfer_requests')
      .select('id, topic_id, bundle_id, created_at')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
  ])

  const purchases = (purchaseRows ?? []) as PurchaseRow[]
  const purchasedById = new Map(purchases.map((purchase) => [purchase.topic_id, purchase]))
  const ownedIds = subscription?.status === 'active'
    ? Object.keys(COURSES).filter((id) => COURSES[id].status === 'available')
    : purchases.map((purchase) => purchase.topic_id)
  const ownedCourses = ownedIds
    .filter((id) => COURSES[id]?.status === 'available')
    .map((id) => ({ id, course: COURSES[id], purchase: purchasedById.get(id) }))
  const pending = (pendingRows ?? []) as PendingTransferRow[]
  const pendingIds = [...new Set(pending.flatMap(pendingCourseIds))]
    .filter((id) => COURSES[id]?.status === 'available' && !ownedIds.includes(id))

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              My learning
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">คอร์สของฉัน</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              คอร์สที่ชำระและได้รับการยืนยันแล้วจะมาอยู่ที่นี่ เข้าเรียนต่อได้จากที่เดียว
            </p>
          </div>
          {ownedCourses.length > 0 && (
            <div className="rounded-2xl border border-primary/15 bg-primary/5 px-5 py-3">
              <p className="text-xs text-muted-foreground">พร้อมเรียน</p>
              <p className="mt-0.5 font-heading text-2xl font-bold text-primary tabular-nums">
                {ownedCourses.length} <span className="text-sm font-medium">คอร์ส</span>
              </p>
            </div>
          )}
        </header>

        {pendingIds.length > 0 && (
          <section className="mb-8 rounded-3xl border border-amber-300/60 bg-amber-50/70 p-5 text-amber-950">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-heading text-sm font-semibold">กำลังตรวจสอบหลักฐานการโอน</h2>
                <p className="mt-1 text-xs leading-5 text-amber-800">
                  {pendingIds.map((id) => COURSES[id].name).join(', ')} — เมื่อแอดมินยืนยันแล้ว คอร์สจะย้ายมาอยู่ในรายการพร้อมเรียนอัตโนมัติ
                </p>
              </div>
            </div>
          </section>
        )}

        {ownedCourses.length === 0 ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center shadow-sm sm:px-12">
            <span className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-5 font-heading text-xl font-bold text-foreground">
              {pendingIds.length > 0 ? 'รออีกนิด คอร์สกำลังเข้ามา' : 'ยังไม่มีคอร์สในบัญชีนี้'}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              {pendingIds.length > 0
                ? 'หลังตรวจสอบสลิปเรียบร้อย คุณจะกดเข้าเรียนจากหน้านี้ได้ทันที'
                : 'เลือกคอร์สที่เหมาะกับเป้าหมายของคุณ เมื่อชำระเรียบร้อยแล้วจะกลับมาเรียนจากหน้านี้ได้ตลอด'}
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
            >
              ดูคอร์สทั้งหมด
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2" aria-label="รายการคอร์สที่ซื้อแล้ว">
            {ownedCourses.map(({ id, course, purchase }, index) => {
              const lessonCount = course.curriculum?.reduce((sum, section) => sum + section.items.length, 0) ?? 0
              const mark = COURSE_MARKS[id] ?? course.nameEn.slice(0, 2).toUpperCase()
              return (
                <article
                  key={id}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className="animate-fade-slide-in group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative flex min-h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-[#211c62]">
                    <span className="select-none font-heading text-6xl font-bold text-white/95 drop-shadow-lg" aria-hidden="true">{mark}</span>
                    <span className="absolute -bottom-14 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      พร้อมเรียน
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Online course</p>
                    <h2 className="mt-1 font-heading text-lg font-bold text-foreground">{course.name}</h2>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{course.desc}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                      <p className="text-xs text-muted-foreground">
                        {lessonCount > 0 ? `${lessonCount} หัวข้อ` : purchase?.payment_method === 'bank_transfer' ? 'ยืนยันการชำระแล้ว' : 'เข้าถึงเนื้อหาครบ'}
                      </p>
                      <Link
                        href={`/course/${id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
                      >
                        <PlayCircle className="h-4 w-4" aria-hidden="true" />
                        เข้าเรียน
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>
    </main>
  )
}
