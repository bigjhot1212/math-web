import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/payment-config'

export default async function StudentsAdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) redirect('/')

  const admin = createAdminClient()
  const { data: students } = await admin.from('student_profiles').select('*').order('updated_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div><p className="text-sm text-muted-foreground">ข้อมูลสำหรับแอดมิน</p><h1 className="font-heading text-2xl font-bold text-foreground">รายชื่อนักเรียน</h1></div>
          <Link href="/admin/bank-transfers" className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-accent">ตรวจสลิป</Link>
        </div>
        {!students?.length ? <p className="text-sm text-muted-foreground">ยังไม่มีนักเรียนกรอกข้อมูล</p> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-border bg-muted/40 text-muted-foreground"><tr><th className="p-4 font-medium">ชื่อ</th><th className="p-4 font-medium">ชั้น</th><th className="p-4 font-medium">จังหวัด</th><th className="p-4 font-medium">คณะเป้าหมาย</th><th className="p-4 font-medium">มหาวิทยาลัยเป้าหมาย</th></tr></thead>
              <tbody>{students.map((student) => <tr key={student.user_id} className="border-b border-border last:border-0"><td className="p-4 font-medium text-foreground">{student.full_name}</td><td className="p-4">{student.grade}</td><td className="p-4">{student.province}</td><td className="p-4">{student.desired_faculty}</td><td className="p-4">{student.desired_university}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
