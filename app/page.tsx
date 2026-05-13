import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex-1 bg-background">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">∑</div>
        <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
          เตรียมสอบคณิตศาสตร์
        </h1>
        <p className="text-lg text-muted-foreground mb-10">
          ฝึกโจทย์และสอบจำลองครบทุกหัวข้อ สำหรับ ONET · A-Level · PAT1
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/practice"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            เริ่มฝึกโจทย์
          </Link>
          <Link
            href="/exam"
            className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
          >
            สอบจำลอง
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl border border-border">
            <div className="text-2xl mb-3">📚</div>
            <h2 className="font-semibold text-foreground mb-1">14 หัวข้อ</h2>
            <p className="text-sm text-muted-foreground">
              ครอบคลุมทุกเนื้อหา ตั้งแต่เซตจนถึงแคลคูลัส พร้อมคำใบ้และเฉลยละเอียด
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border">
            <div className="text-2xl mb-3">⏱</div>
            <h2 className="font-semibold text-foreground mb-1">สอบจำลอง</h2>
            <p className="text-sm text-muted-foreground">
              ข้อสอบสุ่มพร้อมจับเวลา รองรับ ONET (30 ข้อ), A-Level และ PAT1 (45 ข้อ)
            </p>
          </div>
          <div className="p-6 rounded-xl border border-border">
            <div className="text-2xl mb-3">📊</div>
            <h2 className="font-semibold text-foreground mb-1">ติดตามความก้าวหน้า</h2>
            <p className="text-sm text-muted-foreground">
              Dashboard แสดง streak, ความแม่นยำ และหัวข้อที่ต้องฝึกเพิ่ม
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
