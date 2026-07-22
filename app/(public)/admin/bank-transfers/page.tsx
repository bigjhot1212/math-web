import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'
import { COURSES, BUNDLES } from '@/content/course-videos'
import BankTransferActions from './bank-transfer-actions'

export default async function AdminBankTransfersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')

  const admin = createAdminClient()
  const { data: requests } = await admin
    .from('bank_transfer_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const withUrls = await Promise.all(
    (requests ?? []).map(async (r) => {
      const { data: signed } = await admin.storage
        .from('payment-slips')
        .createSignedUrl(r.slip_url, 600)
      const name = r.topic_id ? COURSES[r.topic_id]?.name : r.bundle_id ? BUNDLES[r.bundle_id]?.name : '-'
      return { ...r, signedUrl: signed?.signedUrl ?? null, courseName: name ?? r.topic_id ?? r.bundle_id }
    })
  )

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-heading font-bold text-foreground mb-6">รายการโอนเงินรอตรวจสอบ</h1>

        {withUrls.length === 0 ? (
          <p className="text-sm text-muted-foreground">ไม่มีรายการรอตรวจสอบ</p>
        ) : (
          <div className="space-y-4">
            {withUrls.map((r) => (
              <div key={r.id} className="rounded-3xl border border-border bg-card/70 backdrop-blur-xl p-5 flex flex-col sm:flex-row gap-4">
                {r.signedUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.signedUrl} alt="สลิปการโอนเงิน" className="w-full sm:w-40 h-40 object-contain rounded-xl border border-border bg-background" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{r.courseName}</p>
                  <p className="text-xs text-muted-foreground mb-1">{r.user_email}</p>
                  <p className="text-xs text-muted-foreground mb-3">฿{r.amount_thb} · {new Date(r.created_at).toLocaleString('th-TH')}</p>
                  <BankTransferActions id={r.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
