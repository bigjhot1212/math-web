import Link from 'next/link'
import { ArrowRight, ShieldCheck, Trophy } from 'lucide-react'
import { HUNTER_RANKS } from '@/lib/hunter-ranking'

export default function HunterRankShowcase() {
  return (
    <section className="hunter-rank-showcase" aria-labelledby="hunter-rank-showcase-title">
      <div className="hunter-rank-showcase-copy">
        <Trophy className="hunter-rank-showcase-icon" aria-hidden="true" />
        <h2 id="hunter-rank-showcase-title">แรงค์ที่วัดใหม่ทุกเดือน</h2>
        <p>แรงค์วัดจากข้อสอบมาตรฐานชุดใหม่ประจำเดือนเพียงอย่างเดียว ส่วนการฝึกมีไว้ช่วยอุดจุดอ่อนและเตรียมสอบรอบถัดไป</p>
        <div className="hunter-rank-principle"><ShieldCheck aria-hidden="true" /><span>มาตรฐานเดียวกัน · วัดใหม่ทุกเดือน · ปิดบังชื่อผู้เรียน</span></div>
        <Link href="/leaderboard">เปิดระบบแรงค์ฮันเตอร์ <ArrowRight aria-hidden="true" /></Link>
      </div>
      <div className="hunter-rank-ladder" aria-label="ระดับแรงค์ฮันเตอร์ F ถึง S">
        {HUNTER_RANKS.map(rank => <div key={rank.code} data-rank={rank.code}><strong>{rank.code}</strong><span>{rank.name}</span><small>{rank.code === 'F' ? 'เริ่มต้น' : `${rank.minimumRating}+`}</small></div>)}
      </div>
    </section>
  )
}
