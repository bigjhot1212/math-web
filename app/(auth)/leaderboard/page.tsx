import Link from 'next/link'
import { redirect } from 'next/navigation'
import HunterShareCard from '@/app/components/adventure/hunter-share-card'
import { ArrowRight, CalendarCheck2, CheckCircle2, LockKeyhole, ShieldCheck, Trophy } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getServerExamSet } from '@/lib/hunter-exam-set-server'
import { ensureHunterRankSnapshot, finalizeMonthlyRankExam, selectHunterRankQuestions } from '@/lib/hunter-rank-finalization'
import {
  buildHunterStandings,
  buildHunterStandingsFromResults,
  buildHunterImprovementStandings,
  calculateHunterRating,
  getBangkokMonthKey,
  getHunterAlias,
  getHunterRank,
  getMonthDateRange,
  getMonthlyRankExamType,
  getNextHunterRank,
  getRankProgress,
  getPreviousMonthKey,
  HUNTER_RANKS,
  isHunterRankingReleased,
  type ExamPerformanceRow,
  type HunterRankResultRow,
} from '@/lib/hunter-ranking'

export const dynamic = 'force-dynamic'

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
  const { data: monthlyExam } = await supabase
    .from('exam_sessions')
    .select('id, exam_type, score, total_questions, submitted_at, question_ids, answers')
    .eq('user_id', user.id)
    .eq('exam_type', monthlyExamType)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (isHunterRankingReleased() && monthlyExam) {
    const monthlySet = (await getServerExamSet(monthlyExamType))?.questions ?? []
    const questions = selectHunterRankQuestions(monthlySet, monthlyExam.question_ids)
    if (!monthlyExam.submitted_at) {
      await finalizeMonthlyRankExam({
        supabase,
        userId: user.id,
        sessionId: monthlyExam.id,
        examType: monthlyExam.exam_type,
        questions,
        answers: (monthlyExam.answers ?? {}) as Record<string, string>,
        finalizationReason: 'recovered',
      })
    } else {
      await ensureHunterRankSnapshot({
        userId: user.id,
        sessionId: monthlyExam.id,
        examType: monthlyExam.exam_type,
        questions,
        answers: (monthlyExam.answers ?? {}) as Record<string, string>,
        score: monthlyExam.score,
        maximumPoints: monthlyExam.total_questions,
        submittedAt: monthlyExam.submitted_at,
        finalizationReason: 'recovered',
      })
    }
  }

  const [{ data: personalExamData }, personalResultQuery] = await Promise.all([
    supabase
      .from('exam_sessions')
      .select('user_id, exam_type, score, total_questions, submitted_at')
      .eq('user_id', user.id)
      .not('submitted_at', 'is', null)
      .gte('submitted_at', start)
      .lt('submitted_at', end),
    supabase
      .from('hunter_rank_results')
      .select('user_id, month_key, rating, rank_code, submitted_at')
      .eq('user_id', user.id)
      .eq('month_key', monthKey)
      .maybeSingle(),
  ])

  const personalExams = (personalExamData ?? []) as ExamPerformanceRow[]
  const personalResult = personalResultQuery.data as HunterRankResultRow | null
  let resultRows = personalResult ? [personalResult] : []
  let historyRows: HunterRankResultRow[] = []
  let historyUnavailable = !process.env.SUPABASE_SERVICE_ROLE_KEY
  let fallbackExams = personalExams
  let useSnapshotResults = !personalResultQuery.error
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const admin = createAdminClient()
    const { data: officialResults, error: officialResultsError } = await admin
      .from('hunter_rank_results')
      .select('user_id, month_key, rating, rank_code, submitted_at')
      .eq('month_key', monthKey)
      .range(0, 9999)
    if (!officialResultsError) {
      resultRows = (officialResults ?? []) as HunterRankResultRow[]
      useSnapshotResults = true
      const { data: previousResults, error: previousError } = await admin.from('hunter_rank_results')
        .select('user_id, month_key, rating, rank_code, submitted_at')
        .eq('month_key', getPreviousMonthKey(monthKey)).range(0, 9999)
      historyRows = (previousResults ?? []) as HunterRankResultRow[]
      historyUnavailable = Boolean(previousError)
    } else {
      historyUnavailable = true
      useSnapshotResults = false
      const { data: examData } = await admin
        .from('exam_sessions')
        .select('user_id, exam_type, score, total_questions, submitted_at')
        .not('submitted_at', 'is', null)
        .gte('submitted_at', start)
        .lt('submitted_at', end)
        .range(0, 9999)
      if (examData) fallbackExams = examData as ExamPerformanceRow[]
    }
  }

  const standings = useSnapshotResults
    ? buildHunterStandingsFromResults(resultRows, monthKey)
    : buildHunterStandings(fallbackExams, monthKey)
  const personalRating = personalResult
    ? {
        rating: personalResult.rating,
        rank: getHunterRank(personalResult.rating),
        eligible: true,
        standardSubmittedAt: personalResult.submitted_at,
      }
    : calculateHunterRating(personalExams, monthKey)
  const personalStanding = standings.find(item => item.userId === user.id)
  const nextRank = getNextHunterRank(personalRating.rank)
  const topThree = standings.slice(0, 3)
  const tableRows = standings.slice(3, 50)
  const improvements = buildHunterImprovementStandings([...resultRows, ...historyRows], monthKey)
  const previousStandings = buildHunterStandingsFromResults(historyRows, getPreviousMonthKey(monthKey))
  const previousChampions = previousStandings.filter(item => item.position === 1)

  return (
    <main className="leaderboard-page min-h-screen">
      <div className="leaderboard-shell">
        <header className="leaderboard-hero">
          <div>
            <p className="leaderboard-month">ฤดูกาล {monthLabel}</p>
            <h1>อันดับฮันเตอร์</h1>
            <p>แรงค์มาจากข้อสอบมาตรฐานประจำเดือนเพียงชุดเดียว การฝึกช่วยเตรียมความพร้อมแต่ไม่เปลี่ยนคะแนนแรงค์ และตารางใช้รหัสฮันเตอร์แทนชื่อจริง</p>
          </div>
          <Link href={personalRating.eligible ? '/hunter-guide' : '/exam'}>{personalRating.eligible ? 'ดูเส้นทางพัฒนาของฉัน' : 'สอบวัดระดับเดือนนี้'} <ArrowRight aria-hidden="true" /></Link>
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
            <div><dt>คะแนนสอบ</dt><dd>{personalRating.rating ?? '—'}</dd></div>
            <div><dt>สถานะผล</dt><dd>{personalRating.eligible ? 'ยืนยันแล้ว' : 'รอสอบ'}</dd></div>
          </dl>
        </section>

        {personalRating.eligible && personalRating.rating !== null && <HunterShareCard alias={getHunterAlias(user.id, monthKey)} rank={personalRating.rank.code} rankName={personalRating.rank.name} rating={personalRating.rating} month={monthLabel} />}

        <section className="leaderboard-board" aria-labelledby="leaderboard-title">
          <header><div><Trophy aria-hidden="true" /><h2 id="leaderboard-title">ตารางอันดับประจำเดือน</h2></div><p>ผลทางการจากข้อสอบมาตรฐาน {monthLabel}</p></header>
          {standings.length === 0 ? (
            <div className="leaderboard-empty"><Trophy aria-hidden="true" /><h3>สนามกำลังรอฮันเตอร์คนแรก</h3><p>อันดับจะปรากฏเมื่อมีผู้ส่งข้อสอบมาตรฐานประจำเดือน</p><Link href="/exam">เริ่มวัดระดับ</Link></div>
          ) : <>
            <div className="leaderboard-podium">
              {topThree.map(hunter => <article key={hunter.userId} data-position={hunter.position} aria-label={`อันดับ ${hunter.position} ${hunter.userId === user.id ? 'คุณ' : getHunterAlias(hunter.userId, monthKey)}`}>
                <span>{hunter.position}</span><strong>{hunter.userId === user.id ? 'คุณ' : getHunterAlias(hunter.userId, monthKey)}</strong><div data-rank={hunter.rank.code}>{hunter.rank.code}</div><p>{hunter.rating} คะแนน</p>
              </article>)}
            </div>
            {tableRows.length > 0 && <div className="leaderboard-table-wrap"><table><thead><tr><th>อันดับ</th><th>ฮันเตอร์</th><th>แรงค์</th><th>คะแนนสอบมาตรฐาน</th></tr></thead><tbody>{tableRows.map(hunter => <tr key={hunter.userId} data-current={hunter.userId === user.id || undefined}><td>#{hunter.position}</td><td>{hunter.userId === user.id ? 'คุณ' : getHunterAlias(hunter.userId, monthKey)}</td><td><span className="leaderboard-rank-code" data-rank={hunter.rank.code}>{hunter.rank.code}</span>{hunter.rank.name}</td><td>{hunter.rating}</td></tr>)}</tbody></table></div>}
          </>}
        </section>

        <section className="leaderboard-board" aria-labelledby="improvement-title">
          <header><div><Trophy aria-hidden="true" /><h2 id="improvement-title">อันดับพัฒนาการ</h2></div><p>เปรียบเทียบคะแนนสอบกับเดือนก่อน · ไม่กระทบแรงก์</p></header>
          {historyUnavailable ? <div className="leaderboard-empty"><h3>ยังโหลดข้อมูลเดือนก่อนไม่ได้</h3><p>กรุณาลองใหม่อีกครั้ง</p></div> : improvements.length === 0 ? <div className="leaderboard-empty"><h3>เริ่มเก็บเส้นทางของคุณ</h3><p>เมื่อมีผลสอบทั้งเดือนนี้และเดือนก่อน จึงเปรียบเทียบพัฒนาการได้</p></div> :
            <div className="leaderboard-table-wrap"><table><thead><tr><th>อันดับ</th><th>ฮันเตอร์</th><th>เดือนก่อน</th><th>เดือนนี้</th><th>เปลี่ยนแปลง</th></tr></thead><tbody>{improvements.slice(0, 50).map(item => <tr key={item.userId} data-current={item.userId === user.id || undefined}><td>#{item.position}</td><td>{item.userId === user.id ? 'คุณ' : getHunterAlias(item.userId, monthKey)}</td><td>{item.previous}</td><td>{item.current}</td><td>{item.improvement > 0 ? '+' : ''}{item.improvement}</td></tr>)}</tbody></table></div>}
        </section>

        <section className="leaderboard-board" aria-labelledby="hall-of-fame-title">
          <header><div><Trophy aria-hidden="true" /><h2 id="hall-of-fame-title">หอเกียรติยศ</h2></div><p>อันดับหนึ่งของฤดูกาลก่อน · คะแนนเท่ากันได้รับเกียรติร่วมกัน</p></header>
          {historyUnavailable ? <div className="leaderboard-empty"><h3>ยังโหลดข้อมูลฤดูกาลก่อนไม่ได้</h3><p>กรุณาลองใหม่อีกครั้ง</p></div> : previousChampions.length === 0 ? <div className="leaderboard-empty"><h3>ยังไม่มีผลสอบฤดูกาลก่อน</h3><p>หอเกียรติยศจะแสดงผลเมื่อมีการสอบและยืนยันผลอย่างเป็นทางการ</p></div> : <div className="leaderboard-podium">{previousChampions.map(item => <article key={item.userId} data-position="1"><span>1</span><strong>{item.userId === user.id ? 'คุณ' : getHunterAlias(item.userId, getPreviousMonthKey(monthKey))}</strong><div data-rank={item.rank.code}>{item.rank.code}</div><p>{item.rating} คะแนน · {getPreviousMonthKey(monthKey)}</p></article>)}</div>}
        </section>

        <section className="ranking-rules" aria-labelledby="ranking-rules-title">
          <div><h2 id="ranking-rules-title">ระบบคิดแรงค์อย่างไร</h2><p>ทุกคนใช้ข้อสอบและกติกาเดียวกัน ผลการฝึกไม่มีสิทธิ์เพิ่มหรือลดแรงค์</p></div>
          <ol>
            <li><CheckCircle2 aria-hidden="true" /><span><strong>แรงค์มาจากข้อสอบมาตรฐานเท่านั้น</strong>ปรนัยถูก +3 ผิด −3 · อัตนัยถูก +5 ผิด −5 · เว้นว่าง 0 คะแนน</span></li>
            <li><Trophy aria-hidden="true" /><span><strong>การฝึกไม่เปลี่ยนแรงค์</strong>แบบฝึกหัดและข้อสอบอื่นใช้วิเคราะห์จุดอ่อนเพื่อเตรียมสอบรอบถัดไป</span></li>
            <li><CalendarCheck2 aria-hidden="true" /><span><strong>วัดระดับใหม่ทุกเดือน</strong>เดือนใหม่ใช้ข้อสอบชุดใหม่ และไม่นำคะแนนกิจกรรมเดือนเก่ามาสะสม</span></li>
            <li><LockKeyhole aria-hidden="true" /><span><strong>ข้อสอบมาตรฐานทำได้เดือนละครั้ง</strong>เมื่อเริ่มแล้วต้องทำต่อเนื่อง หากออกกลางคันจะคิดคะแนนจากคำตอบที่ทำไว้</span></li>
            <li><ShieldCheck aria-hidden="true" /><span><strong>ปิดบังตัวตน</strong>ตารางแสดงรหัสฮันเตอร์แทนชื่อหรืออีเมล</span></li>
          </ol>
        </section>

        <section className="rank-legend" aria-labelledby="rank-legend-title"><h2 id="rank-legend-title">เส้นทางแรงค์ F–S</h2><div>{HUNTER_RANKS.map(rank => <article key={rank.code} data-rank={rank.code}><strong>{rank.code}</strong><span>{rank.name}</span><small>{`${rank.minimumRating}–${(getNextHunterRank(rank)?.minimumRating ?? 101) - 1}`}</small></article>)}</div></section>
      </div>
    </main>
  )
}
