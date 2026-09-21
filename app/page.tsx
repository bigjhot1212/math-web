import Link from 'next/link'
import { ArrowRight, BookOpen, CheckCircle2, Clock3, GraduationCap, Sparkles, Target, TrendingUp } from 'lucide-react'

const learningPoints = [
  'เริ่มทำโจทย์ได้ แม้เจอโจทย์ที่ไม่คุ้น',
  'อ่าน Keyword ออก และไม่ตกหลุมข้อสอบ',
  'ฝึกจับเวลากับข้อสอบจำลอง 15 ข้อ',
]

const tools = [
  { icon: Target, title: 'คิดเป็น ไม่ใช่ท่องจำ', description: 'เห็นแนวคิดก่อนลงมือทำ เพื่อรับมือโจทย์ที่พลิกแพลงได้' },
  { icon: BookOpen, title: 'ฝึกเป็นบท', description: 'ทบทวนเนื้อหา ฝึกโจทย์ และดูเฉลยอย่างเป็นระบบ' },
  { icon: TrendingUp, title: 'วัดผลได้จริง', description: 'สอบจำลองพร้อมเวลา รู้ทันทีว่าต้องกลับไปเติมตรงไหน' },
]

export default function Home() {
  return (
    <main className="flex-1 overflow-hidden bg-background">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_18%_10%,rgba(111,82,255,0.16),transparent_35%),radial-gradient(circle_at_78%_16%,rgba(255,177,73,0.14),transparent_30%)]" />
        <div className="max-w-6xl mx-auto grid items-center gap-12 px-6 pt-16 pb-20 md:pt-24 md:pb-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-fade-slide-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-3.5 py-2 text-sm font-semibold text-primary shadow-sm">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              ตะลุยโจทย์ A-Level Math 1
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl md:text-5xl font-heading font-bold tracking-tight leading-[1.15] text-foreground">
              ถ้าอยากยื่นคณะโดยไม่ต้องมองคะแนน<br />
              ก็ต้องทำโจทย์โดยไม่ต้องดู<span className="text-primary">เวลาเหมือนกัน</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              ฝึกมองโครงสร้างโจทย์ อ่านจุดหลอกให้ขาด และค่อย ๆ เปลี่ยนข้อที่เคยตันให้เป็นคะแนนของเรา
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/pricing" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25">
                ดูคอร์สตะลุยโจทย์ <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link href="/exam" className="rounded-2xl border border-border bg-card/70 px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent">
                ลองทำข้อสอบจำลองฟรี
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> โจทย์จริง 15 ปีย้อนหลัง</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> เรียนได้จนกว่าจะสอบติด</span>
            </div>
          </div>

          <div className="relative animate-fade-slide-in" style={{ animationDelay: '100ms' }}>
            <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-primary/10 blur-3xl" />
            <div className="rounded-[2rem] border border-primary/15 bg-card/90 p-6 shadow-2xl shadow-primary/10 backdrop-blur md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">A-LEVEL MATH 1</p>
                  <p className="mt-2 text-sm text-muted-foreground">คะแนนสอบจริงของผู้สอน</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cta/15 text-cta"><Target className="w-5 h-5" /></div>
              </div>
              <div className="mt-7 flex items-end gap-3">
                <span className="text-7xl font-heading font-bold tracking-tighter text-foreground">98</span>
                <span className="mb-2 text-xl font-semibold text-muted-foreground">/100</span>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full w-[98%] rounded-full bg-gradient-to-r from-primary to-[#8f7cff]" /></div>
              <p className="mt-3 text-sm font-medium text-muted-foreground">เป้าหมายไม่ใช่ทำข้อสอบให้หมด แต่คือเก็บคะแนนให้คุ้มทุกนาที</p>

              <div className="mt-8 rounded-2xl border border-border bg-background/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><GraduationCap className="w-5 h-5" /></div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">เรียนกับคนที่ผ่านสนามจริง</p>
                    <p className="text-sm text-muted-foreground">A-Level Math 1 98/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/60">
        <div className="max-w-6xl mx-auto grid gap-6 px-6 py-7 text-center sm:grid-cols-3">
          <div><p className="font-heading text-2xl font-bold text-foreground">15 ปี</p><p className="mt-1 text-sm text-muted-foreground">โจทย์ย้อนหลัง 55–69</p></div>
          <div className="sm:border-x sm:border-border"><p className="font-heading text-2xl font-bold text-foreground">30+ ชม.</p><p className="mt-1 text-sm text-muted-foreground">ตะลุยโจทย์อย่างเป็นระบบ</p></div>
          <div><p className="font-heading text-2xl font-bold text-foreground">15 ข้อ</p><p className="mt-1 text-sm text-muted-foreground">ข้อสอบจำลองให้ลองทำฟรี</p></div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-wider text-primary">เรียนแล้วได้อะไร</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold tracking-tight text-foreground">ไม่ใช่แค่ดูเฉลย แต่ต้องกลับไปทำเองได้</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tools.map(({ icon: Icon, title, description }, index) => (
            <article key={title} style={{ animationDelay: `${index * 80}ms` }} className="animate-fade-slide-in rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="w-5 h-5" /></div>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 leading-relaxed text-sm text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-primary p-8 text-primary-foreground md:p-10">
            <h2 className="text-3xl font-heading font-bold leading-tight">เข้าใจโจทย์<br />ก่อนรีบหาคำตอบ</h2>
            <p className="mt-5 max-w-sm leading-relaxed text-primary-foreground/80">ก่อนจะหาคำตอบ เราต้องเข้าใจก่อนว่าโจทย์อยากทดสอบอะไร และคนออกข้อสอบกำลังอยาก Challenge เราตรงไหน</p>
          </div>
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 text-primary"><GraduationCap className="w-5 h-5" /><span className="text-sm font-bold">PROFILE</span></div>
            <h3 className="mt-4 text-2xl font-heading font-bold text-foreground">A-Level Math 1 98/100</h3>
            <p className="mt-2 text-muted-foreground">ศิษย์เก่า <span className="font-semibold text-foreground">คณะพาณิชยศาสตร์และการบัญชี<br />จุฬาลงกรณ์มหาวิทยาลัย</span></p>
            <ul className="mt-6 space-y-3">
              {learningPoints.map(point => <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{point}</li>)}
            </ul>
            <Link href="/pricing" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary transition-all hover:gap-3">ดูรายละเอียดคอร์ส <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="max-w-4xl mx-auto rounded-[2rem] bg-foreground px-7 py-12 text-center text-background md:px-12">
          <Clock3 className="mx-auto h-6 w-6 text-cta" />
          <h2 className="mt-4 text-3xl font-heading font-bold">เริ่มจากข้อเดียวก็ได้</h2>
          <p className="mt-3 text-background/70">ลองทำข้อสอบจำลอง 15 ข้อ แล้วดูว่าโจทย์แบบไหนที่คุณควรเริ่มเก็บคะแนนก่อน</p>
          <Link href="/exam" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-cta px-6 py-3.5 text-sm font-bold text-cta-foreground transition-transform hover:-translate-y-0.5">เริ่มทำข้อสอบฟรี <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    </main>
  )
}
