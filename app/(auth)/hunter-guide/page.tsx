import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, CalendarCheck2, CheckCircle2, Compass, ShieldCheck, Sparkles, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  calculateHunterRating,
  getBangkokMonthKey,
  getHunterAlias,
  getHunterJourneyStep,
  getHunterRank,
  getMonthlyRankExamType,
  HUNTER_JOURNEY,
  HUNTER_RANKS,
  type ExamPerformanceRow,
  type HunterRankCode,
} from '@/lib/hunter-ranking'

export const dynamic = 'force-dynamic'

type RankResultRow = {
  rating: number
  rank_code: HunterRankCode
  submitted_at: string
}

export default async function HunterGuidePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=%2Fhunter-guide')

  const monthKey = getBangkokMonthKey()
  const [{ data: officialResult }, { data: examRows }] = await Promise.all([
    supabase
      .from('hunter_rank_results')
      .select('rating, rank_code, submitted_at')
      .eq('user_id', user.id)
      .eq('month_key', monthKey)
      .maybeSingle(),
    supabase
      .from('exam_sessions')
      .select('user_id, exam_type, score, total_questions, submitted_at')
      .eq('user_id', user.id)
      .eq('exam_type', getMonthlyRankExamType(monthKey))
      .not('submitted_at', 'is', null),
  ])

  const result = officialResult as RankResultRow | null
  const rating = result
    ? {
        rating: result.rating,
        rank: getHunterRank(result.rating),
        eligible: true,
        standardSubmittedAt: result.submitted_at,
      }
    : calculateHunterRating((examRows ?? []) as ExamPerformanceRow[], monthKey)
  const journey = getHunterJourneyStep(rating)
  const currentIndex = HUNTER_JOURNEY.findIndex(step => step.rank === journey.rank)
  const [year, month] = monthKey.split('-').map(Number)
  const monthLabel = new Intl.DateTimeFormat('th-TH', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(Date.UTC(year, month - 1, 15)))

  return (
    <main className="hunter-guide-page min-h-screen">
      <div className="hunter-guide-shell">
        <header className="hunter-guide-hero">
          <div>
            <p>HUNTER DEVELOPMENT PATH</p>
            <h1>เส้นทางพัฒนาของคุณ</h1>
            <span>แรงก์บอกผลสอบล่าสุด ส่วนแผนฝึกบอกว่าควรทำอะไรต่อ ทั้งสองอย่างแยกจากกันอย่างชัดเจน</span>
          </div>
          <div className="hunter-guide-emblem" data-rank={rating.eligible ? rating.rank.code : 'F'}>
            <small>{rating.eligible ? 'แรงก์ประจำเดือน' : 'สถานะปัจจุบัน'}</small>
            <strong>{rating.eligible ? rating.rank.code : '—'}</strong>
            <span>{rating.eligible ? rating.rank.name : 'ฮันเตอร์ฝึกหัด'}</span>
          </div>
        </header>

        <section className="hunter-guide-current" aria-labelledby="current-mission-title">
          <div className="hunter-guide-current-copy">
            <p>ภารกิจแนะนำตอนนี้</p>
            <h2 id="current-mission-title">{journey.title}</h2>
            <span>{journey.focus}</span>
            <ul>{journey.actions.map(action => <li key={action}><CheckCircle2 aria-hidden="true" />{action}</li>)}</ul>
            <div className="hunter-guide-actions">
              <Link href={rating.eligible ? '/practice' : '/exam'}>{rating.eligible ? 'เริ่มฝึกตามแผน' : 'ไปสอบวัดระดับ'} <ArrowRight aria-hidden="true" /></Link>
              <Link href="/dashboard">ดูผลวิเคราะห์ของฉัน</Link>
            </div>
          </div>
          <aside aria-label="ข้อมูลประจำฤดูกาล">
            <div><CalendarCheck2 aria-hidden="true" /><span>ฤดูกาล<strong>{monthLabel}</strong></span></div>
            <div><Trophy aria-hidden="true" /><span>Hunter Rating<strong>{rating.rating ?? 'ยังไม่มีผล'}</strong></span></div>
            <div><ShieldCheck aria-hidden="true" /><span>รหัสบนตาราง<strong>{getHunterAlias(user.id, monthKey)}</strong></span></div>
            <p>รหัสจะเปลี่ยนทุกเดือนและไม่เปิดเผยชื่อหรืออีเมลของคุณ</p>
          </aside>
        </section>

        <section className="hunter-cycle" aria-labelledby="hunter-cycle-title">
          <div>
            <Compass aria-hidden="true" />
            <h2 id="hunter-cycle-title">วงจรพัฒนารายเดือน</h2>
            <p>คุณฝึกได้ไม่จำกัด แต่แรงก์จะเปลี่ยนเฉพาะเมื่อทำข้อสอบมาตรฐานของเดือนใหม่</p>
          </div>
          <ol>
            <li><strong>01</strong><span>วัดระดับ<small>ทำข้อสอบมาตรฐานหนึ่งครั้ง</small></span></li>
            <li><strong>02</strong><span>อ่านผล<small>ดูบทที่ควรพัฒนาและข้อผิดพลาด</small></span></li>
            <li><strong>03</strong><span>ฝึกตรงจุด<small>ฝึกเพื่อแก้จุดอ่อน ไม่ใช่ปั๊มแรงก์</small></span></li>
            <li><strong>04</strong><span>วัดใหม่เดือนหน้า<small>ใช้ข้อสอบชุดใหม่และเริ่มฤดูกาลใหม่</small></span></li>
          </ol>
        </section>

        <section className="hunter-path-ladder" aria-labelledby="hunter-path-title">
          <header><div><Sparkles aria-hidden="true" /><h2 id="hunter-path-title">จากฮันเตอร์ฝึกหัดสู่แรงก์ S</h2></div><p>ทุกแรงก์ได้เนื้อหาและสิทธิ์การเรียนเท่ากัน เครื่องหมายแรงก์มีไว้บันทึกพัฒนาการเท่านั้น</p></header>
          <div>
            {HUNTER_JOURNEY.map((step, index) => {
              const rank = step.rank === 'UNRANKED' ? null : HUNTER_RANKS.find(item => item.code === step.rank)
              const state = index < currentIndex ? 'completed' : index === currentIndex ? 'current' : 'upcoming'
              return <article key={step.rank} data-state={state} data-rank={rank?.code ?? 'F'}>
                <span>{rank?.code ?? 'เริ่ม'}</span>
                <div><small>{state === 'current' ? 'ตำแหน่งปัจจุบัน' : state === 'completed' ? 'ผ่านช่วงนี้แล้ว' : 'เส้นทางถัดไป'}</small><strong>{step.title}</strong><p>{step.focus}</p></div>
              </article>
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
