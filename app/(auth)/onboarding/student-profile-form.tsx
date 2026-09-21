'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

const grades = ['ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6', 'เด็กซิ่ว', 'ปวช.', 'ปวส.']
const provinces = ['กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 'แพร่', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยะลา', 'ยโสธร', 'ร้อยเอ็ด', 'ระนอง', 'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี']
const faculties = ['แพทยศาสตร์', 'ทันตแพทยศาสตร์', 'เภสัชศาสตร์', 'พยาบาลศาสตร์', 'สัตวแพทยศาสตร์', 'สหเวชศาสตร์', 'วิศวกรรมศาสตร์', 'วิทยาศาสตร์', 'เทคโนโลยีสารสนเทศ', 'สถาปัตยกรรมศาสตร์', 'บัญชี', 'บริหารธุรกิจ', 'เศรษฐศาสตร์', 'นิติศาสตร์', 'รัฐศาสตร์', 'นิเทศศาสตร์', 'อักษรศาสตร์', 'มนุษยศาสตร์', 'ศิลปกรรมศาสตร์', 'ครุศาสตร์ / ศึกษาศาสตร์', 'จิตวิทยา', 'สังคมสงเคราะห์ศาสตร์', 'เกษตรศาสตร์', 'ประมง', 'วารสารศาสตร์', 'ดนตรี', 'อื่น ๆ']
const universities = ['จุฬาลงกรณ์มหาวิทยาลัย', 'มหาวิทยาลัยธรรมศาสตร์', 'มหาวิทยาลัยมหิดล', 'มหาวิทยาลัยเกษตรศาสตร์', 'มหาวิทยาลัยศิลปากร', 'มหาวิทยาลัยศรีนครินทรวิโรฒ', 'มหาวิทยาลัยเชียงใหม่', 'มหาวิทยาลัยขอนแก่น', 'มหาวิทยาลัยสงขลานครินทร์', 'มหาวิทยาลัยบูรพา', 'มหาวิทยาลัยนเรศวร', 'มหาวิทยาลัยแม่ฟ้าหลวง', 'มหาวิทยาลัยวลัยลักษณ์', 'มหาวิทยาลัยอุบลราชธานี', 'มหาวิทยาลัยเทคโนโลยีสุรนารี', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี', 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง', 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 'อื่น ๆ']

function SearchableField({ name, label, options, placeholder, defaultValue }: { name: string; label: string; options: string[]; placeholder: string; defaultValue?: string }) {
  const listId = `${name}-options`
  return <label className="text-sm font-medium text-foreground">{label}
    <div className="relative mt-1.5"><input name={name} required list={listId} defaultValue={defaultValue} placeholder={placeholder} autoComplete="off" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 pr-9 text-sm outline-none focus:border-primary" />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">⌄</span></div>
    <datalist id={listId}>{options.map((option) => <option key={option} value={option} />)}</datalist>
  </label>
}

type ProfileDefaults = { grade?: string; province?: string; desiredFaculty?: string; desiredUniversity?: string }

export default function StudentProfileForm({ next, defaultName, defaults = {}, mode = 'onboarding' }: { next: string; defaultName: string; defaults?: ProfileDefaults; mode?: 'onboarding' | 'edit' }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())
    const response = await fetch('/api/profile', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      setError(data.error ?? 'บันทึกข้อมูลไม่สำเร็จ')
      setSaving(false)
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-xl rounded-3xl border border-border bg-card p-7 shadow-sm md:p-9">
        <p className="text-sm font-medium text-primary mb-2">{mode === 'edit' ? 'โปรไฟล์ของฉัน' : 'ยินดีต้อนรับสู่ MathPrep'}</p>
        <h1 className="font-heading text-2xl font-bold text-foreground">{mode === 'edit' ? 'อัปเดตข้อมูลของน้อง' : 'ขอรู้จักกันอีกนิด'}</h1>
        <p className="mt-2 text-sm text-muted-foreground">ข้อมูลนี้ช่วยให้พี่เข้าใจเป้าหมายของน้อง ๆ และพัฒนาคอร์สให้ตรงจุดขึ้น</p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium text-foreground">ชื่อ-นามสกุล
            <input name="fullName" required defaultValue={defaultName} className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <SearchableField name="grade" label="กำลังเรียนชั้น" options={grades} placeholder="พิมพ์หรือเลือกชั้นเรียน" defaultValue={defaults.grade} />
          <SearchableField name="province" label="จังหวัด" options={provinces} placeholder="พิมพ์ค้นหาจังหวัด" defaultValue={defaults.province} />
          <SearchableField name="desiredFaculty" label="คณะที่อยากเข้า" options={faculties} placeholder="พิมพ์ค้นหาคณะ" defaultValue={defaults.desiredFaculty} />
          <SearchableField name="desiredUniversity" label="มหาวิทยาลัยที่อยากเข้า" options={universities} placeholder="พิมพ์ค้นหามหาวิทยาลัย" defaultValue={defaults.desiredUniversity} />
        </div>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        <button disabled={saving} className="mt-7 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
          {saving ? 'กำลังบันทึก...' : mode === 'edit' ? 'บันทึกการเปลี่ยนแปลง' : 'บันทึกและเริ่มฝึกโจทย์'}
        </button>
      </form>
    </main>
  )
}
