import Link from 'next/link'
import { BookOpen, Timer, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: '14 หัวข้อ',
    description: 'ครอบคลุมทุกเนื้อหา ตั้งแต่เซตจนถึงแคลคูลัส พร้อมคำใบ้และเฉลยละเอียด',
    accent: 'bg-primary/10 text-primary',
  },
  {
    icon: Timer,
    title: 'สอบจำลอง',
    description: 'ข้อสอบสุ่มพร้อมจับเวลา รองรับ ONET (30 ข้อ), A-Level และ PAT1 (45 ข้อ)',
    accent: 'bg-cta/10 text-cta',
  },
  {
    icon: TrendingUp,
    title: 'ติดตามความก้าวหน้า',
    description: 'Dashboard แสดง streak, ความแม่นยำ และหัวข้อที่ต้องฝึกเพิ่ม',
    accent: 'bg-chart-3/15 text-chart-3',
  },
]

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
          ระบบฝึกโจทย์คณิตศาสตร์ออนไลน์
        </div>
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl font-heading font-semibold text-primary">
          ∑
        </div>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-cta bg-clip-text text-transparent">
          เตรียมสอบคณิตศาสตร์
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          ฝึกโจทย์และสอบจำลองครบทุกหัวข้อ สำหรับ ONET · A-Level · PAT1
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/practice"
            className="px-8 py-4 bg-cta text-cta-foreground rounded-2xl font-semibold shadow-lg shadow-cta/25 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
          >
            เริ่มฝึกโจทย์
          </Link>
          <Link
            href="/exam"
            className="px-8 py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-semibold hover:bg-primary/15 active:scale-[0.98] transition-all cursor-pointer"
          >
            สอบจำลอง
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, description, accent }) => (
            <div
              key={title}
              className="p-6 rounded-3xl border border-border bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${accent}`}>
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="font-heading font-semibold text-foreground mb-1.5">{title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
