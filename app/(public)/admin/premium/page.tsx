import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'
import { InviteForm, QuestionImportForm } from './premium-admin-forms'

export default async function PremiumAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')

  const admin = createAdminClient()
  const [{ count: questionCount }, { count: inviteCount }] = await Promise.all([
    admin.from('premium_questions').select('id', { count: 'exact', head: true }),
    admin.from('premium_invites').select('email', { count: 'exact', head: true }),
  ])

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-border pb-6">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Crown className="h-4 w-4" aria-hidden="true" />
            Admin
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">จัดการฝึกโจทย์พรีเมียม</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ข้อสอบในคลัง <strong className="text-foreground">{(questionCount ?? 0).toLocaleString('th-TH')}</strong> ข้อ ·
            อีเมลที่เปิดสิทธิ์ไว้ <strong className="text-foreground">{(inviteCount ?? 0).toLocaleString('th-TH')}</strong> อีเมล ·
            <Link href="/premium" className="ml-1 text-primary hover:underline">ดูหน้าพรีเมียม</Link>
          </p>
        </header>
        <div className="grid gap-6">
          <InviteForm />
          <QuestionImportForm />
        </div>
      </div>
    </main>
  )
}
