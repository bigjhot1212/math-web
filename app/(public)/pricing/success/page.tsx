import Link from 'next/link'

export default function PricingSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-foreground mb-3">ยินดีต้อนรับสู่ Premium!</h1>
        <p className="text-muted-foreground mb-8">
          การชำระเงินสำเร็จแล้ว คุณสามารถเข้าถึงข้อสอบแบบเต็มได้ทันที
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/exam"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            เริ่มสอบจำลอง
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-border rounded-lg text-sm hover:bg-accent transition-colors"
          >
            ดู Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
