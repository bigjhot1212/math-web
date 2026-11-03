import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, CalendarCheck2, CheckCircle2, LockKeyhole, ShieldCheck, Trophy } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getMath1MockSet } from '@/lib/content/math1-mock-sets'
import { calculateExamPoints } from '@/lib/exam-scoring'
import {
  buildHunterStandings,
  calculateHunterRating,
  getBangkokMonthKey,
  getHunterAlias,
  getMonthDateRange,
  getMonthlyRankExamType,
  getNextHunterRank,
  getRankProgress,
  HUNTER_RANKS,
  isHunterRankingReleased,
  type ExamPerformanceRow,
  type PracticePerformanceRow,
} from '@/lib/hunter-ranking'

export const dynamic = 'force-dynamic'

function signed(value: number) {
  return value > 0 ? `+${value}` : String(value)
}

export default async function LeaderboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=%2Fleaderboard')

  const monthKey = getBangkokMonthKey()
  const { start, end } = getMonthDateRange(monthKey)
  const [year, month] = monthKey.split('-').map(Number)
  const monthLabel = new Intl.DateTimeFormat('th-TH', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(Date.UTC(year, month - 1, 15)))

  const monthlyExamType = getMonthlyRankExamType(monthKey)
  const { data: unfinishedMonthlyExam } = await supabase
    .from('exam_sessions')
    .select('id, answers')
    .eq('user_id', user.id)
    .eq('exam_type', monthlyExamType)
    .is('submitted_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (isHunterRankingReleased() && unfinishedMonthlyExam) {
    const questions = getMath1MockSet(monthlyExamType)?.questions ?? []
    const answers = (unfinishedMonthlyExam.answers ?? {}) as Record<string, unknown>
    const { points, maximumPoints } = calculateExamPoints(questions, answers)
    await supabase
      .from('exam_sessions')
      .update({
        score: points,
        total_questions: maximumPoints,
        submitted_at: new Date().toISOString(),
      })
      .eq('id', unfinishedMonthlyExam.id)
      .eq('user_id', user.id)
      .is('submitted_at', null)
  }

  const [{ data: personalExamData }, { data: personalPracticeData }] = await Promise.all([
    supabase
      .from('exam_sessions')
      .select('user_id, exam_type, score, total_questions, submitted_at')
      .eq('user_id', user.id)
      .not('submitted_at', 'is', null)
      .gte('submitted_at', start)
      .lt('submitted_at', end),
    supabase
      .from('user_progress')
      .select('user_id, question_id, is_correct, answered_at')
      .eq('user_id', user.id)
      .gte('answered_at', start)
      .lt('answered_at', end),
  ])

  const personalExams = (personalExamData ?? []) as ExamPerformanceRow[]
  const personalPractice = (personalPracticeData ?? []) as PracticePerformanceRow[]
  let allExams = personalExams
  let allPractice = personalPractice
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient()
    const [{ data: examData }, { data: practiceData }] = await Promise.all([
      admin
        .from('exam_sessions')
        .select('user_id, exam_type, score, total_questions, submitted_at')
        .not('submitted_at', 'is', null)
        .gte('submitted_at', start)
        .lt('submitted_at', end)
        .range(0, 9999),
      admin
        .from('user_progress')
        .select('user_id, question_id, is_correct, answered_at')
        .gte('answered_at', start)
        .lt('answered_at', end)
        .range(0, 9999),
    ])
    if (examData) allExams = examData as ExamPerformanceRow[]
    if (practiceData) allPractice = practiceData as PracticePerformanceRow[]
  }

  const standings = buildHunterStandings(allExams, allPractice, monthKey)
  const personalRating = calculateHunterRating(personalExams, personalPractice, monthKey)
  const personalStanding = standings.find(item => item.userId === user.id)
  const nextRank = getNextHunterRank(personalRating.rank)
  const topThree = standings.slice(0, 3)
  const tableRows = standings.slice(3, 50)

  return (
    <main className="leaderboard-page min-h-screen">
      <div className="leaderboard-shell">
        <header className="leaderboard-hero">
          <div>
            <p className="leaderboard-month">ฤดูกาล {monthLabel}</p>
            <h1>อันดับฮันเตอร์</h1>
            <p>เริ่มจากข้อสอบมาตรฐานประจำเดือน แล้วขยับตามการฝึกจริงในเดือนนั้น ชื่อทุกคนถูกปิดบังเพื่อความเป็นส่วนตัว</p>
          </div>
          <Link href="/exam">{personalRating.eligible ? 'เข้าสู่สนามสอบ' : 'สอบวัดระดับเดือนนี้'} <ArrowRight aria-hidden="true" /></Link>
        </header>

        <section className="personal-rank" aria-labelledby="personal-rank-title">
          <div className="personal-rank-mark" data-rank={personalRating.rank.code}>{personalRating.rank.code}</div>
          <div className="personal-rank-copy">
            <p id="personal-rank-title">แรงค์ประจำเดือนของคุณ</p>
            <h2>{personalRating.eligible ? personalRating.rank.name : 'ยังไม่ได้วัดระดับ'}</h2>
            <div className="personal-rank-value"><strong>{personalRating.rating ?? '—'}</strong><span>Hunter Rating</span></div>
            <div className="personal-rank-track" aria-label={personalRating.rating === null ? 'ยังไม่มีคะแนนแรงค์เดือนนี้' : `ความคืบหน้าไปแรงค์ถัดไป ${getRankProgress(personalRating.rating, personalRating.rank)} เปอร์เซ็นต์`}><span style={{ width: `${getRankProgress(personalRating.rating, personalRating.rank)}%` }} /></div>
            <p>{personalRating.rating === null ? 'ทำข้อสอบมาตรฐานประจำเดือนเพื่อเปิดแรงค์' : nextRank ? `อีก ${nextRank.minimumRating - personalRating.rating} คะแนนถึงแรงค์ ${nextRank.code}` : 'คุณอยู่ในแรงค์สูงสุดแล้ว'}</p>
          </div>
          <dl>
            <div><dt>อันดับเดือนนี้</dt><dd>{personalStanding ? `#${personalStanding.position}` : '—'}</dd></div>
            <div><dt>คะแนนตั้งต้น</dt><dd>{personalRating.baseline ?? '—'}</dd></div>
            <div><dt>ปรับจากกิจกรรม</dt><dd>{personalRating.rating === null ? '—' : signed(personalRating.activityAdjustment)}</dd></div>
          </dl>
        </section>

        <section className="leaderboard-board" aria-labelledby="leaderboard-title">
          <header><div><Trophy aria-hidden="true" /><h2 id="leaderboard-title">ตารางอันดับประจำเดือน</h2></div><p>อัปเดตจากการสอบและแบบฝึกหัดใน {monthLabel}</p></header>
          {standings.length === 0 ? (
            <div className="leaderboard-empty"><Trophy aria-hidden="true" /><h3>สนามกำลังรอฮันเตอร์คนแรก</h3><p>อันดับจะปรากฏเมื่อมีผู้ส่งข้อสอบมาตรฐานประจำเดือน</p><Link href="/exam">เริ่มวัดระดับ</Link></div>
          ) : <>
            <div className="leaderboard-podium">
              {topThree.map(hunter => <article key={hunter.userId} data-position={hunter.position} aria-label={`อันดับ ${hunter.position} ${hunter.userId === user.id ? 'คุณ' : getHunterAlias(hunter.userId)}`}>
                <span>{hunter.position}</span><strong>{hunter.userId === user.id ? 'คุณ' : getHunterAlias(hunter.userId)}</strong><div data-rank={hunter.rank.code}>{hunter.rank.code}</div><p>{hunter.rating} คะแนน</p>
              </article>)}
            </div>
            {tableRows.length > 0 && <div className="leaderboard-table-wrap"><table><thead><tr><th>อันดับ</th><th>ฮันเตอร์</th><th>แรงค์</th><th>คะแนนตั้งต้น</th><th>ปรับเดือนนี้</th><th>Rating</th></tr></thead><tbody>{tableRows.map(hunter => <tr key={hunter.userId} data-current={hunter.userId === user.id || undefined}><td>#{hunter.position}</td><td>{hunter.userId === user.id ? 'คุณ' : getHunterAlias(hunter.userId)}</td><td><span className="leaderboard-rank-code" data-rank={hunter.rank.code}>{hunter.rank.code}</span>{hunter.rank.name}</td><td>{hunter.baseline}</td><td>{signed(hunter.activityAdjustment)}</td><td>{hunter.rating}</td></tr>)}</tbody></table></div>}
          </>}
        </section>

        <section className="ranking-rules" aria-labelledby="ranking-rules-title">
          <div><h2 id="ranking-rules-title">ระบบคิดแรงค์อย่างไร</h2><p>คะแนนสะท้อนทั้งมาตรฐานเดียวกันและความสม่ำเสมอ โดยไม่ให้กิจกรรมกลบผลสอบหลัก</p></div>
          <ol>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>ข้อสอบมาตรฐานคือคะแนนตั้งต้น</strong>ปรนัยถูก +3 ผิด −3 · อัตนัยถูก +5 ผิด −5 · เว้นว่าง 0 คะแนน</span></li>
            <li><Trophy aria-hidden="true" /><span><strong>กิจกรรมปรับได้ไม่เกิน ±5</strong>ดูทั้งความแม่น จำนวนข้อที่ฝึก และผลสอบอื่นในเดือนนั้น</span></li>
            <li><CalendarCheck2 aria-hidden="true" /><span><strong>วัดระดับใหม่ทุกเดือน</strong>เดือนใหม่ใช้ข้อสอบชุดใหม่ และไม่นำคะแนนกิจกรรมเดือนเก่ามาสะสม</span></li>
            <li><LockKeyhole aria-hidden="true" /><span><strong>ข้อสอบมาตรฐานทำได้เดือนละครั้ง</strong>เมื่อเริ่มแล้วต้องทำต่อเนื่อง หากออกกลางคันจะคิดคะแนนจากคำตอบที่ทำไว้</span></li>
            <li><ShieldCheck aria-hidden="true" /><span><strong>ปิดบังตัวตน</strong>ตารางแสดงรหัสฮันเตอร์แทนชื่อหรืออีเมล</span></li>
          </ol>
        </section>

        <section className="rank-legend" aria-labelledby="rank-legend-title"><h2 id="rank-legend-title">เส้นทางแรงค์ F–S</h2><div>{HUNTER_RANKS.map(rank => <article key={rank.code} data-rank={rank.code}><strong>{rank.code}</strong><span>{rank.name}</span><small>{rank.code === 'F' ? '0–39' : rank.code === 'S' ? '90–100' : `${rank.minimumRating}–${(getNextHunterRank(rank)?.minimumRating ?? 101) - 1}`}</small></article>)}</div></section>
      </div>
    </main>
  )
}
