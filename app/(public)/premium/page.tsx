import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Crown, Lock, ScrollText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasPremiumAccess } from '@/lib/premium-access'
import { COURSES } from '@/content/course-videos'

export const metadata: Metadata = {
  title: 'ฝึกโจทย์พรีเมียม ข้อสอบเก่า | Math Hunters',
  description: 'คลังข้อสอบเก่าที่หาได้ยาก สำหรับนักเรียนที่ซื้อคอร์ส',
}

type CatalogRow = { exam: string; exam_year: number | null; topic_id: string }

// Supabase returns at most 1,000 rows per request, so read the bank in pages.
async function loadCatalog() {
  const admin = createAdminClient()
  const pageSize = 1000
  const rows: CatalogRow[] = []
  for (let from = 0; ; from += pageSize) {
    const { data, error } = await admin
      .from('premium_questions')
      .select('exam, exam_year, topic_id')
      .eq('published', true)
      .order('id')
      .range(from, from + pageSize - 1)
    if (error) {
      // e.g. the premium tables have not been created yet; show the "coming soon" state
      console.error('Failed to load premium catalog', error)
      return rows
    }
    rows.push(...((data ?? []) as CatalogRow[]))
    if (!data || data.length < pageSize) return rows
  }
}

function practiceHref(params: Record<string, string | number>) {
  return `/premium/practice?${new URLSearchParams(Object.entries(params).map(([key, value]) => [key, String(value)]))}`
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 border-b border-border pb-7">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Crown className="h-4 w-4" aria-hidden="true" />
            Premium
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">ฝึกโจทย์พรีเมียม ข้อสอบเก่า</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            คลังข้อสอบเก่าที่หาได้ยาก พร้อมเฉลยละเอียด สำหรับนักเรียนที่ซื้อคอร์สกับเรา
          </p>
        </header>
        {children}
      </div>
    </main>
  )
}

function Notice({ title, children, actions }: { title: string; children: React.ReactNode; actions: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-6 sm:p-8">
      <div className="mb-3 flex items-center gap-2 text-primary">
        <Lock className="h-5 w-5" aria-hidden="true" />
        <h2 className="font-heading text-xl font-bold text-foreground">{title}</h2>
      </div>
      <div className="space-y-2 text-sm leading-7 text-muted-foreground">{children}</div>
      <div className="mt-6 flex flex-wrap gap-3">{actions}</div>
    </section>
  )
}

const primaryButton = 'inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]'
const secondaryButton = 'inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted'

export default async function PremiumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Shell>
        <Notice
          title="เข้าสู่ระบบเพื่อใช้ฝึกโจทย์พรีเมียม"
          actions={<Link href="/login?next=/premium" className={primaryButton}>เข้าสู่ระบบ / สมัครสมาชิก <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        >
          <p>นักเรียนที่ซื้อคอร์สบนเว็บไซต์ เข้าสู่ระบบด้วยบัญชีที่ใช้ซื้อคอร์สได้เลย</p>
          <p>นักเรียนที่ลงทะเบียนเรียนกับเราก่อนมีเว็บไซต์ ให้สมัครสมาชิกด้วย<strong className="text-foreground">อีเมลเดียวกับที่ลงทะเบียนไว้</strong> และยืนยันอีเมลให้เรียบร้อย ระบบจะเปิดสิทธิ์ให้อัตโนมัติ</p>
        </Notice>
      </Shell>
    )
  }

  if (!(await hasPremiumAccess(user))) {
    return (
      <Shell>
        <Notice
          title="ฝึกโจทย์พรีเมียมสำหรับนักเรียนที่ซื้อคอร์ส"
          actions={<>
            <Link href="/pricing" className={primaryButton}>ดูคอร์สทั้งหมด <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            <Link href="/practice" className={secondaryButton}>ฝึกโจทย์ทั่วไป</Link>
          </>}
        >
          <p>ซื้อคอร์สใดก็ได้อย่างน้อย 1 คอร์ส เพื่อปลดล็อกคลังข้อสอบเก่าทั้งหมด</p>
          <p>ถ้าคุณลงทะเบียนเรียนกับเราก่อนมีเว็บไซต์ ตรวจสอบว่าบัญชีนี้ใช้อีเมลเดียวกับที่ลงทะเบียนไว้ (บัญชีนี้คือ <strong className="text-foreground">{user.email}</strong>) และยืนยันอีเมลแล้ว หากยังเข้าไม่ได้ ติดต่อเราทาง Instagram</p>
        </Notice>
      </Shell>
    )
  }

  const rows = await loadCatalog()

  if (!rows.length) {
    return (
      <Shell>
        <section className="rounded-2xl border border-border p-8 text-center text-sm text-muted-foreground">
          กำลังเตรียมคลังข้อสอบเก่า เร็ว ๆ นี้
        </section>
      </Shell>
    )
  }

  const byExam = new Map<string, Map<number, number>>()
  const examCounts = new Map<string, number>()
  const byTopic = new Map<string, number>()
  for (const row of rows) {
    const years = byExam.get(row.exam) ?? new Map<number, number>()
    if (row.exam_year) years.set(row.exam_year, (years.get(row.exam_year) ?? 0) + 1)
    byExam.set(row.exam, years)
    examCounts.set(row.exam, (examCounts.get(row.exam) ?? 0) + 1)
    byTopic.set(row.topic_id, (byTopic.get(row.topic_id) ?? 0) + 1)
  }

  return (
    <Shell>
      <p className="mb-8 text-sm text-muted-foreground">ทั้งหมด <strong className="text-foreground">{rows.length.toLocaleString('th-TH')}</strong> ข้อ เลือกฝึกตามชุดข้อสอบหรือตามบทก็ได้</p>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 font-heading text-xl font-bold text-foreground">
          <ScrollText className="h-5 w-5 text-primary" aria-hidden="true" />
          ฝึกตามชุดข้อสอบ
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[...byExam.entries()].sort(([a], [b]) => a.localeCompare(b, 'th', { numeric: true })).map(([exam, years]) => (
            <div key={exam} className="rounded-2xl border border-border p-5">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <h3 className="font-heading text-lg font-bold text-foreground">{exam}</h3>
                {years.size > 0 && (
                  <Link href={practiceHref({ exam })} className="text-xs font-semibold text-primary hover:underline">ฝึกทุกปี</Link>
                )}
              </div>
              {years.size === 0 && (
                // a ready-made set (no exam year): one button that runs the whole set in order
                <Link href={practiceHref({ exam })} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary">
                  เริ่มทำชุดนี้ <span className="text-xs text-muted-foreground">({examCounts.get(exam)} ข้อ)</span>
                </Link>
              )}
              <div className="flex flex-wrap gap-2">
                {[...years.entries()].sort(([a], [b]) => b - a).map(([year, count]) => (
                  <Link key={year} href={practiceHref({ exam, year })} className="rounded-xl border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary">
                    {year} <span className="text-xs text-muted-foreground">({count} ข้อ)</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-xl font-bold text-foreground">ฝึกตามบท</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...byTopic.entries()].sort(([, a], [, b]) => b - a).map(([topic, count]) => (
            <Link key={topic} href={practiceHref({ topic })} className="flex items-center justify-between gap-3 rounded-2xl border border-border px-4 py-3 text-sm transition-colors hover:border-primary">
              <span className="font-medium text-foreground">{COURSES[topic]?.name ?? topic}</span>
              <span className="text-xs text-muted-foreground">{count} ข้อ</span>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  )
}
