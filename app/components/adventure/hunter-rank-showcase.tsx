import Link from 'next/link'
import { ArrowRight, ShieldCheck, Trophy } from 'lucide-react'
import { HUNTER_RANKS } from '@/lib/hunter-ranking'

export default function HunterRankShowcase() {
  return (
    <section className="hunter-rank-showcase" aria-labelledby="hunter-rank-showcase-title">
      <div className="hunter-rank-showcase-copy">
        <Trophy className="hunter-rank-showcase-icon" aria-hidden="true" />
        <h2 id="hunter-rank-showcase-title">แรงค์ที่วัดใหม่ทุกเดือน</h2>
        <p>เริ่มจากข้อสอบมาตรฐานชุดใหม่ประจำเดือน แล้วให้การฝึกจริงขยับคะแนนได้ไม่เกิน ±5 เพื่อให้แรงค์สะท้อนความสามารถปัจจุบัน</p>
        <div className="hunter-rank-principle"><ShieldCheck aria-hidden="true" /><span>วัดใหม่ทุกเดือน · ไม่สะสมข้ามเดือน · ปิดบังชื่อผู้เรียน</span></div>
        <Link href="/leaderboard">เปิดระบบแรงค์ฮันเตอร์ <ArrowRight aria-hidden="true" /></Link>
      </div>
      <div className="hunter-rank-ladder" aria-label="ระดับแรงค์ฮันเตอร์ F ถึง S">
        {HUNTER_RANKS.map(rank => <div key={rank.code} data-rank={rank.code}><strong>{rank.code}</strong><span>{rank.name}</span><small>{rank.code === 'F' ? 'เริ่มต้น' : `${rank.minimumRating}+`}</small></div>)}
      </div>
    </section>
  )
}
