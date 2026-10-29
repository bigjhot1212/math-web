import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Check,
  ChevronRight,
  Clock3,
  Gem,
  MessageCircle,
  LibraryBig,
  ReceiptText,
  ShieldCheck,
  Target,
} from 'lucide-react'
import { COURSES, ZONE_LABELS } from '@/content/course-videos'
import styles from './home.module.css'
import AdventureHero from './components/adventure/adventure-hero'
import AdventureAtlas from './components/adventure/adventure-atlas'
import { AnimatedContent } from './components/adventure/adventure-effects'
import CourseArtwork from './(public)/pricing/course-artwork'

const availableCourses = Object.entries(COURSES)
  .filter(([, course]) => course.status === 'available')
  .map(([id, course]) => ({ id, ...course }))

const practiceTopics = [
  ['เซต', '50 ข้อ'],
  ['ฟังก์ชัน', '50 ข้อ'],
  ['แคลคูลัส', '50 ข้อ'],
  ['สถิติ', '50 ข้อ'],
]

export default function Home() {
  return (
    <main className={`${styles.page} flex-1 overflow-hidden bg-background`}>
      <AdventureHero />
      <AdventureAtlas />

      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <div className="max-w-3xl">
          <h2 className="text-balance font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">เส้นทางฝึกของฮันเตอร์</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">เลือกเริ่มจากสิ่งที่ต้องการวันนี้ แล้วระบบจะเก็บผลการฝึกไว้ให้กลับมาดูต่อได้</p>
        </div>

        <AnimatedContent className={styles.featureGrid}>
          <Link href="/practice" className={`${styles.featurePanel} ${styles.practicePanel}`}>
            <div className="flex items-center justify-between gap-4">
              <span className={styles.panelLabel}><BookOpenCheck className="size-4" /> ภารกิจฝึกโจทย์</span>
              <span className="font-mono text-sm text-white/70">14 × 50</span>
            </div>
            <h3 className="mt-8 max-w-md font-heading text-3xl font-semibold leading-tight text-white">ฝึกเฉพาะบทที่ยังไม่แม่นได้เลย</h3>
            <p className="mt-3 max-w-xl leading-7 text-white/75">เลือกหัวข้อ ม.4–ม.6 ทำโจทย์พร้อมเฉลย และกลับมาทำต่อจากจุดเดิมได้</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {practiceTopics.map(([topic, progress]) => (
                <div key={topic} className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3 text-sm text-white">
                  <span>{topic}</span><span className="font-mono text-white/65">{progress}</span>
                </div>
              ))}
            </div>
            <span className="mt-7 inline-flex items-center gap-2 font-semibold text-white">เลือกบทที่อยากฝึก <ArrowRight className="size-4" /></span>
          </Link>

          <Link href="/exam" className={`${styles.featurePanel} ${styles.examPanel}`}>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm font-semibold text-white/80"><Clock3 className="size-4" /> สอบจำลอง</span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">จับเวลาจริง</span>
            </div>
            <div className="mt-10 font-mono text-5xl font-semibold tabular-nums text-white">90:00</div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[72%] rounded-full bg-white" /></div>
            <h3 className="mt-9 font-heading text-2xl font-semibold text-white">ซ้อมก่อนลงสนามจริง</h3>
            <p className="mt-2 leading-7 text-white/65">ทำข้อสอบตามเวลา ส่งคำตอบ แล้วดูผลแยกตามหัวข้อเพื่อรู้ว่าควรกลับไปเติมตรงไหน</p>
          </Link>

          <Link href="/dashboard" className={`${styles.featurePanel} ${styles.dashboardPanel}`}>
            <div className="flex items-center justify-between">
              <span className={styles.darkLabel}><BarChart3 className="size-4" /> ศูนย์บัญชาการ</span>
              <ChevronRight className="size-5 text-primary" />
            </div>
            <h3 className="mt-7 font-heading text-2xl font-semibold text-foreground">เห็นพัฒนาการ ไม่ต้องเดา</h3>
            <p className="mt-2 leading-7 text-muted-foreground">เก็บจำนวนข้อ ความแม่นยำ หัวข้อที่ควรฝึกเพิ่ม และประวัติการสอบไว้ในหน้าเดียว</p>
            <div className="mt-7 grid h-28 grid-cols-7 items-end gap-2 border-b border-border pb-1" aria-label="ตัวอย่างกราฟความแม่นยำ">
              {[34, 52, 45, 66, 58, 76, 84].map((height, index) => (
                <span key={index} className="rounded-t-md bg-primary/80" style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>ตัวอย่างความก้าวหน้า 7 วัน</span><span className="font-mono font-semibold text-primary">ตัวอย่าง 84%</span></div>
          </Link>

          <Link href="/courses" className={`${styles.featurePanel} ${styles.libraryPanel}`}>
            <LibraryBig className="size-6 text-primary" />
            <h3 className="mt-8 font-heading text-2xl font-semibold text-foreground">คอร์สของฉัน</h3>
            <p className="mt-2 leading-7 text-muted-foreground">คอร์สที่ชำระและยืนยันแล้วจะมาอยู่ในคลังส่วนตัว พร้อมลิงก์เข้าเรียนและรายละเอียดเนื้อหา</p>
            <span className="mt-8 inline-flex items-center gap-2 font-semibold text-primary">เปิดคลังคอร์ส <ArrowRight className="size-4" /></span>
          </Link>

          <Link href="/treasure" className={styles.treasurePanel}>
            <div>
              <span className={styles.darkLabel}><Gem className="size-4" /> ขุมทรัพย์ · อ่านฟรี</span>
              <h3 className="mt-5 max-w-xl font-heading text-3xl font-semibold leading-tight text-foreground">เก็บ Keyword จุดหลอก และสรุปที่ควรเห็นก่อนเริ่มคิดเลข</h3>
              <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">เปิดอ่านได้เลยโดยไม่ต้องล็อกอิน ค้นตามบทหรือเลือกเฉพาะโพยสรุป ทริคอ่านโจทย์ และเช็กลิสต์ก่อนสอบ</p>
              <span className="mt-7 inline-flex items-center gap-2 font-semibold text-primary">เปิดขุมทรัพย์ <ArrowRight className="size-4" /></span>
            </div>
            <div className={styles.treasureMarks} aria-hidden="true">
              <span>∪</span><span>⇒</span><span>lim</span><span>σ²</span>
            </div>
          </Link>
        </AnimatedContent>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-heading text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">คอร์สที่เปิดเรียนแล้ว</h2>
              <p className="mt-3 text-lg text-muted-foreground">เลือกซื้อเป็นบท หรือเริ่มจากคอร์สตะลุยโจทย์ A-Level Math 1</p>
            </div>
            <Link href="/pricing" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline hover:underline-offset-4">ดูคอร์สทั้งหมด <ArrowRight className="size-4" /></Link>
          </div>

          <div className={styles.courseGrid}>
            {availableCourses.map((course) => {
              const lessonCount = course.curriculum?.reduce((sum, section) => sum + section.items.length, 0) ?? 0
              return (
                <Link key={course.id} href="/pricing" className={styles.courseCard}>
                  <div className={styles.courseCover}><CourseArtwork courseId={course.id} courseName={course.name} featured /><span className={styles.zoneChip}>{ZONE_LABELS[course.zone]}</span></div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-lg font-semibold leading-snug text-foreground">{course.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{course.desc}</p>
                    <div className="mt-auto flex items-end justify-between gap-4 border-t border-border pt-4">
                      <strong className="font-heading text-xl font-semibold text-cta">฿{(course.price ?? 390).toLocaleString('th-TH')}</strong>
                      <span className="text-xs text-muted-foreground">{lessonCount > 0 ? `${lessonCount} หัวข้อ` : 'ดูรายละเอียด'}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 lg:px-14 lg:py-28">
        <div className={styles.purchasePanel}>
          <div className="p-7 sm:p-10 lg:p-12">
            <h2 className="max-w-lg font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">ซื้อคอร์สง่าย และรู้ว่าหลักฐานถึงพี่แล้ว</h2>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">เลือกคอร์ส โอนเงิน แล้วอัปโหลดสลิปในเว็บ เมื่อพี่ยืนยัน ระบบจะเปิดคอร์สไว้ใน “คอร์สของฉัน”</p>
            <div className="mt-8 grid gap-3">
              {[
                ['เลือกคอร์ส', 'ดูราคาและเนื้อหาก่อนตัดสินใจ', Target],
                ['ส่งหลักฐาน', 'อัปโหลดสลิปจากหน้า Checkout', ReceiptText],
                ['รับสิทธิ์เข้าเรียน', 'พี่ยืนยันแล้วคอร์สจะเข้าคลังของคุณ', ShieldCheck],
              ].map(([title, description, Icon], index) => (
                <div key={String(title)} className="grid grid-cols-[42px_1fr] items-start gap-3 rounded-lg bg-background p-4">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-5" /></span>
                  <div><p className="font-semibold text-foreground">{index + 1}. {String(title)}</p><p className="mt-0.5 text-sm text-muted-foreground">{String(description)}</p></div>
                </div>
              ))}
            </div>
            <Link href="/pricing" className={`${styles.primaryButton} mt-8`}>เลือกคอร์ส <ArrowRight className="size-4" /></Link>
          </div>

          <div className={styles.teacherPanel}>
            <div>
              <p className="text-sm font-semibold text-white/70">เรียนกับคนที่ผ่านสนามจริง</p>
              <p className="mt-4 font-heading text-5xl font-semibold tracking-[-0.03em] text-white">98/100</p>
              <p className="mt-2 text-white/75">A-Level Math 1</p>
            </div>
            <div className="space-y-3">
              {['สอนให้เริ่มคิดเมื่อเจอโจทย์ไม่คุ้น', 'ชี้ Keyword และจุดหลอกที่ออกซ้ำ', 'ดูแลต่อได้ผ่าน Instagram'].map((item) => (
                <p key={item} className="flex items-start gap-3 text-white/85"><Check className="mt-0.5 size-5 shrink-0 text-white" />{item}</p>
              ))}
            </div>
            <a href="https://ig.me/m/j.3ra_" target="_blank" rel="noopener noreferrer" className={styles.instagramButton}>
              <MessageCircle className="size-5" /> ถามพี่ทาง Instagram <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-14 lg:pb-28">
        <div className="mx-auto flex max-w-[1168px] flex-col items-start justify-between gap-8 rounded-lg bg-primary px-7 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:px-14 lg:py-12">
          <div>
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">เริ่มจากข้อเดียวก็ได้</h2>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-white/65">เลือกบทที่ยังไม่มั่นใจ หรือเข้าห้องสอบจำลองเพื่อดูว่าควรกลับไปเติมตรงไหนก่อน</p>
          </div>
          <Link href="/practice" className={styles.orangeButton}>เริ่มฝึกฟรี <ArrowRight className="size-4" /></Link>
        </div>
      </section>
    </main>
  )
}
