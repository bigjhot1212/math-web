import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import { getNextHunterRank, getRankProgress, type HunterRating } from '@/lib/hunter-ranking'

export default function HunterRankCard({ rating }: { rating: HunterRating }) {
  const nextRank = getNextHunterRank(rating.rank)
  return (
    <section className="hunter-rank-card" aria-labelledby="hunter-rank-card-title">
      <div className="hunter-rank-card-mark" aria-hidden="true">{rating.rank.code}</div>
      <div className="hunter-rank-card-copy">
        <div className="hunter-rank-card-heading"><Trophy aria-hidden="true" /><h2 id="hunter-rank-card-title">แรงค์ฮันเตอร์ของคุณ</h2></div>
        <strong>{rating.rating === null ? 'ยังไม่ได้วัดระดับเดือนนี้' : rating.rank.name}</strong>
        <p>{rating.rating === null ? 'ทำข้อสอบมาตรฐานเพื่อเปิดแรงค์' : `Hunter Rating ${rating.rating} · ตั้งต้น ${rating.baseline} · กิจกรรม ${rating.activityAdjustment > 0 ? '+' : ''}${rating.activityAdjustment}`}</p>
        {rating.rating !== null && <div className="hunter-rank-progress"><span style={{ width: `${getRankProgress(rating.rating, rating.rank)}%` }} /></div>}
        <small>{rating.rating === null ? 'ข้อสอบเปลี่ยนใหม่และต้องวัดระดับอีกครั้งทุกเดือน' : nextRank ? `อีก ${nextRank.minimumRating - rating.rating} คะแนนถึงแรงค์ ${nextRank.code}` : 'คุณอยู่ในแรงค์สูงสุดแล้ว'}</small>
      </div>
      <Link href={rating.rating === null ? '/exam' : '/leaderboard'}>{rating.rating === null ? 'สอบวัดระดับ' : 'ดูอันดับทั้งหมด'} <ArrowRight aria-hidden="true" /></Link>
    </section>
  )
}
