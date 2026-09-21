import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-12">
      <article className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-7 shadow-sm md:p-10">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">← กลับ MathPrep</Link>
        <h1 className="mt-6 font-heading text-3xl font-bold text-foreground">นโยบายความเป็นส่วนตัว</h1>
        <p className="mt-2 text-sm text-muted-foreground">ปรับปรุงล่าสุด: 21 กันยายน 2569</p>
        <div className="mt-8 space-y-7 text-sm leading-7 text-foreground">
          <section><h2 className="font-heading text-lg font-semibold">ข้อมูลที่เราเก็บ</h2><p>เมื่อสมัครใช้งาน เราเก็บอีเมลและชื่อจาก Google รวมถึงข้อมูลที่น้องกรอก ได้แก่ ชื่อ-นามสกุล ระดับชั้น จังหวัด คณะ และมหาวิทยาลัยเป้าหมาย เรายังเก็บประวัติการทำโจทย์ ผลสอบ และข้อมูลคำสั่งซื้อเท่าที่จำเป็นต่อการให้บริการ</p></section>
          <section><h2 className="font-heading text-lg font-semibold">เราใช้ข้อมูลอย่างไร</h2><p>เราใช้ข้อมูลเพื่อให้บริการฝึกโจทย์ บันทึกความก้าวหน้า ตรวจสอบการชำระเงิน ติดต่อเกี่ยวกับบริการ และพัฒนาคอร์สให้เหมาะกับผู้เรียน ข้อมูลจะไม่ถูกขายหรือให้เช่าแก่บุคคลภายนอก</p></section>
          <section><h2 className="font-heading text-lg font-semibold">การเข้าถึงและระยะเวลาเก็บ</h2><p>เฉพาะผู้ดูแล MathPrep ที่จำเป็นต่อการให้บริการเท่านั้นที่เข้าถึงข้อมูลได้ เราเก็บข้อมูลตราบเท่าที่บัญชียังใช้งาน หรือเท่าที่จำเป็นตามวัตถุประสงค์และกฎหมายที่เกี่ยวข้อง</p></section>
          <section><h2 className="font-heading text-lg font-semibold">สิทธิของเจ้าของข้อมูล</h2><p>น้องสามารถขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลได้ โดยติดต่อผ่าน Instagram ด้านล่าง หากอายุต่ำกว่ากฎหมายกำหนด ควรขอความยินยอมจากผู้ปกครองก่อนใช้งาน</p></section>
          <section><h2 className="font-heading text-lg font-semibold">คุกกี้</h2><p>เราใช้คุกกี้ที่จำเป็นต่อการเข้าสู่ระบบและรักษาความปลอดภัยของบัญชี ปัจจุบันเราไม่ได้ใช้คุกกี้โฆษณาหรือติดตามข้ามเว็บไซต์</p></section>
          <section><h2 className="font-heading text-lg font-semibold">ติดต่อเรา</h2><p>หากมีคำถามเกี่ยวกับข้อมูลส่วนบุคคล ติดต่อ <a className="text-primary hover:underline" href="https://ig.me/m/j.3ra_" target="_blank" rel="noreferrer">Instagram @j.3ra_</a></p></section>
        </div>
      </article>
    </main>
  )
}
