import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, BrainCircuit, Check, ExternalLink, KeyRound, Lightbulb, ListChecks, Target } from 'lucide-react'
import { getTreasureResource, TREASURE_ALIASES, TREASURE_RESOURCES } from '@/content/treasure'
import FormulaFlashcards from './formula-flashcards'
import CalculusCoreGuide from './calculus-core-guide'
import { getFormulaLineLabels } from './formula-line-labels'
import MathExpression, { MathText } from './math-expression'
import styles from './treasure-article.module.css'

type Props = { params: Promise<{ slug: string }> }

const FORMULA_DEMOS: Record<string, { prompt: string; tip: string; substitution: string; answer: string }> = {
  'trigonometry-formula-guide::สูตรผลบวกเป็นผลคูณ': {
    prompt: 'จงหาค่า sin 75° + sin 15°',
    tip: 'เป็นผลบวกของไซน์ จึงใช้มุมเฉลี่ย 45° และครึ่งผลต่าง 30°',
    substitution: 'sin 75° + sin 15° = 2sin 45° cos 30°; sin 45° = √2/2; cos 30° = √3/2; 2sin 45° cos 30° = √6/2',
    answer: '√6/2',
  },
  'trigonometry-formula-guide::สูตรผลคูณเป็นผลบวก': {
    prompt: 'จงเปลี่ยน 2sin 75° cos 15° ให้อยู่ในรูปผลบวก',
    tip: 'จับ A=75° และ B=15° แล้วหาทั้ง A+B กับ A−B',
    substitution: '2sin 75° cos 15° = sin 90° + sin 60°; sin 90° = 1; sin 60° = √3/2; 2sin 75° cos 15° = (2+√3)/2',
    answer: '(2+√3)/2',
  },
  'trigonometry-formula-guide::ฟังก์ชันผกผันตรีโกณมิติ': {
    prompt: 'จงหาค่า arcsin(√3/2)',
    tip: 'หามุมในช่วงค่าหลัก −π/2 ถึง π/2 ที่มีค่าไซน์เท่ากับ √3/2',
    substitution: 'sin(π/3) = √3/2; (π/3) ∈ [−π/2, π/2]',
    answer: 'arcsin(√3/2) = π/3',
  },
  'sequences-series-formula-guide::ผลบวกเลขคณิต': {
    prompt: 'ลำดับ 3, 7, 11, … มี 20 พจน์ จงหาผลบวกทั้งหมด',
    tip: 'โจทย์ให้พจน์แรก ผลต่างร่วม และจำนวนพจน์ จึงเลือกสูตรรูปที่มี a₁, d และ n',
    substitution: 'a₁ = 3; d = 4; n = 20; S_20 = 20[2(3) + (20−1)4] / 2 = 20(82) / 2',
    answer: 'S_20 = 820',
  },
  'matrix-formula-guide::สมบัติของดีเทอร์มิแนนต์': {
    prompt: 'ให้ A เป็นเมทริกซ์ขนาด 3×3 และ det(A) = 4 ถ้า B ได้จากการสลับแถวที่ 1 กับแถวที่ 2 ของ A จงหา det(2A^T) และ det(B)',
    tip: 'คูณ 2 ทั้งเมทริกซ์ขนาด 3×3 ได้ 2^3 เท่า ทรานสโพสไม่เปลี่ยน det ส่วนการสลับแถวเปลี่ยนเครื่องหมาย',
    substitution: 'det(2A^T) = 2^3 det(A^T) = 8(4) = 32; det(B) = −det(A) = −4',
    answer: 'det(2A^T) = 32; det(B) = −4',
  },
  'vector-formula-guide::การตั้งฉากของเวกเตอร์': {
    prompt: 'ถ้า u⃗ = 2î + kĵ − k̂ ตั้งฉากกับ v⃗ = 3î + 2ĵ + 4k̂ จงหาค่า k',
    tip: 'ตั้งฉากแปลว่า u⃗·v⃗ = 0 จึงคูณองค์ประกอบคู่เดียวกันแล้วรวมกันให้เท่ากับ 0',
    substitution: 'u⃗·v⃗ = 2(3) + k(2) − 1(4); 6 + 2k − 4 = 0; 2k + 2 = 0',
    answer: 'k = −1',
  },
}

export function generateStaticParams() {
  return TREASURE_RESOURCES.map((resource) => ({ slug: resource.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resource = getTreasureResource(slug)
  if (!resource) return { title: 'ไม่พบเนื้อหา | Math Hunters' }
  return { title: `${resource.title} | ขุมทรัพย์ Math Hunters`, description: resource.description }
}

export default async function TreasureArticlePage({ params }: Props) {
  const { slug } = await params
  if (TREASURE_ALIASES[slug]) redirect(`/treasure/${TREASURE_ALIASES[slug]}`)
  const resource = getTreasureResource(slug)
  if (!resource) notFound()

  const currentIndex = TREASURE_RESOURCES.findIndex((item) => item.slug === resource.slug)
  const next = TREASURE_RESOURCES[(currentIndex + 1) % TREASURE_RESOURCES.length]
  const sections = [
    ['overview', 'ภาพรวม'],
    ...(resource.slug === 'calculus-formula-guide' ? [['calculus-core', 'พื้นฐานแคลคูลัส']] : []),
    ['formulas', 'สูตรสำคัญ'],
    ['flashcards', 'Flash Cards'],
    ...(resource.patterns.length ? [['patterns', 'รูปแบบโจทย์']] : []),
    ['keywords', 'Keyword'],
    ['traps', 'จุดหลอก'],
    ['checklist', 'Checklist'],
    ['examples', 'ตัวอย่าง'],
    ['references', 'แหล่งอ้างอิง'],
  ]

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link href="/treasure" className={styles.back}><ArrowLeft aria-hidden="true" className="size-4" /> กลับไปขุมทรัพย์</Link>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <p>บทที่ {resource.chapter} จาก 14</p>
            <h1>{resource.topic}</h1>
            <p className={styles.goal}>{resource.goal}</p>
          </div>
          <div className={styles.mark} aria-hidden="true">{resource.mark}</div>
        </header>

        <div className={styles.bodyGrid}>
          <aside className={styles.sidebar}>
            <nav aria-label="สารบัญบทนี้">
              <p>สารบัญบทนี้</p>
              {sections.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
            </nav>
            <div className={styles.outcomes}>
              <div><Target aria-hidden="true" className="size-5" /><h2>อ่านจบแล้วควรทำได้</h2></div>
              <ul>{resource.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <Link className={styles.practiceLink} href={`/practice/${resource.practiceSlug}`}>ไปฝึกโจทย์บทนี้ <ArrowRight aria-hidden="true" className="size-4" /></Link>
          </aside>

          <article className={styles.article}>
            <section id="overview" className={styles.overview}>
              <div className={styles.sectionHeading}><BookOpenCheck aria-hidden="true" /><div><span>เริ่มจากภาพใหญ่</span><h2>ภาพรวม</h2></div></div>
              {resource.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className={styles.scope}><strong>บทนี้ครอบคลุม</strong><ul>{resource.scope.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </section>

            {resource.slug === 'calculus-formula-guide' && <CalculusCoreGuide />}

            <section id="formulas">
              <div className={styles.sectionHeading}><span className={styles.mathIcon}>ƒ</span><div><span>จำความหมายก่อนแทนค่า</span><h2>สูตรและแนวคิดสำคัญ</h2></div></div>
              <div className={styles.formulaList}>{resource.formulas.map((formula, index) => (
                <div className={formula.examFocus ? `${styles.formulaBlock} ${styles.formulaBlockFocus}` : styles.formulaBlock} key={formula.name}>
                  <div className={styles.formulaTitle}><span>{String(index + 1).padStart(2, '0')}</span><h3>{formula.name}</h3>{formula.examFocus && <strong className={styles.examBadge}>ออกสอบบ่อย</strong>}</div>
                  {formula.examFocus && <p className={styles.examFocusNote}><MathText value={formula.examFocus} /></p>}
                  <div className={styles.formulaContext}>
                    <p><span>สูตรนี้คืออะไร</span><MathText value={formula.meaning} /></p>
                    <p><span>เอาไว้ใช้เมื่อ</span><MathText value={formula.use} /></p>
                  </div>
                  <div className={styles.formula}>
                    <MathExpression value={formula.expression} lineLabels={getFormulaLineLabels(resource.slug, formula.name, formula.expression)} />
                  </div>
                  {FORMULA_DEMOS[`${resource.slug}::${formula.name}`] && (() => {
                    const demo = FORMULA_DEMOS[`${resource.slug}::${formula.name}`]
                    return <div className={styles.formulaDemo}>
                      <strong>ตัวอย่างแทนค่าจริง</strong>
                      <p><MathText value={demo.prompt} /></p>
                      <p className={styles.formulaDemoTip}><MathText value={demo.tip} /></p>
                      <MathExpression value={demo.substitution} />
                      <p className={styles.formulaDemoAnswer}>ดังนั้น <MathExpression value={demo.answer} /></p>
                    </div>
                  })()}
                  <div className={styles.formulaWalkthrough}>
                    <h4>วิธีใช้สูตรนี้ทีละขั้น</h4>
                    <ol>
                      <li><strong>จับคำสำคัญจากโจทย์</strong><span>ถ้าโจทย์กล่าวถึง <MathText value={formula.keywords} /> ให้หยุดดูว่าสูตรนี้ตรงกับสิ่งที่โจทย์ถามหรือไม่</span></li>
                      <li><strong>ระบุความหมายของข้อมูล</strong><span><MathText value={formula.meaning} /></span></li>
                      <li><strong>ตรวจเงื่อนไขก่อนแทนค่า</strong><span><MathText value={formula.condition} /></span></li>
                      <li><strong>เลือกใช้ให้ตรงคำถาม</strong><span><MathText value={formula.use} /></span></li>
                      <li><strong>ตรวจคำตอบอีกครั้ง</strong><span><MathText value={`${formula.caution} และอย่าพลาดแบบที่พบบ่อย: ${formula.mistakes}`} /></span></li>
                    </ol>
                  </div>
                  <dl className={styles.formulaDetails}>
                    <div><dt>สัญลักษณ์และความหมาย</dt><dd><MathText value={formula.meaning} /></dd></div>
                    <div><dt>เงื่อนไขที่ต้องตรวจ</dt><dd><MathText value={formula.condition} /></dd></div>
                    <div><dt>โจทย์แบบไหนใช้สูตรนี้</dt><dd><MathText value={formula.use} /></dd></div>
                    <div><dt>คำสำคัญในโจทย์</dt><dd><MathText value={formula.keywords} /></dd></div>
                  </dl>
                  <div className={styles.cautions}>
                    <p><AlertTriangle aria-hidden="true" /> <span><strong>ระวัง</strong><MathText value={formula.caution} /></span></p>
                    <p><Lightbulb aria-hidden="true" /> <span><strong>พลาดบ่อย</strong><MathText value={formula.mistakes} /></span></p>
                  </div>
                </div>
              ))}</div>
            </section>

            <section id="flashcards">
              <div className={styles.sectionHeading}><BrainCircuit aria-hidden="true" /><div><span>ปิดสูตร แล้วตอบจากความจำ</span><h2>Flash Cards ทดสอบความเข้าใจ</h2></div></div>
              <p className={styles.flashIntro}>ลองนึกทั้งสูตร ความหมาย และเงื่อนไขก่อนเปิดเฉลย ใบที่ยังไม่แม่นจะวนกลับมาให้ทบทวนอีกครั้งจนจำได้ครบ</p>
              <FormulaFlashcards formulas={resource.formulas} topic={resource.topic} />
            </section>

            {resource.patterns.length > 0 && <section id="patterns">
              <div className={styles.sectionHeading}><ListChecks aria-hidden="true" /><div><span>จำแนกหน้าตาโจทย์ก่อน</span><h2>รูปแบบโจทย์ที่ออกบ่อย</h2></div></div>
              <div className={styles.pairList}>{resource.patterns.map((item) => <div key={item.label}><strong><MathText value={item.label} /></strong><p><MathText value={item.guidance} /></p></div>)}</div>
            </section>}

            <section id="keywords">
              <div className={styles.sectionHeading}><KeyRound aria-hidden="true" /><div><span>เห็นคำนี้ ให้นึกถึงอะไร</span><h2>Keyword ในโจทย์</h2></div></div>
              <div className={styles.keywordTable}>{resource.keywords.map((item) => <div key={item.label}><strong><MathText value={item.label} /></strong><span><MathText value={item.guidance} /></span></div>)}</div>
            </section>

            <section id="traps">
              <div className={styles.sectionHeading}><AlertTriangle aria-hidden="true" /><div><span>คะแนนมักหลุดก่อนเริ่มคำนวณ</span><h2>จุดหลอกและข้อควรระวัง</h2></div></div>
              <ol className={styles.trapList}>{resource.traps.map((item) => <li key={item}><MathText value={item} /></li>)}</ol>
              {resource.scopeNote && <p className={styles.scopeNote}><strong>ขอบเขตของบทนี้</strong><MathText value={resource.scopeNote} /></p>}
            </section>

            <section id="checklist">
              <div className={styles.sectionHeading}><Check aria-hidden="true" /><div><span>ใช้เวลาไม่ถึงครึ่งนาที</span><h2>Checklist ก่อนตอบ</h2></div></div>
              <ul className={styles.checklist}>{resource.checklist.map((item) => <li key={item}><Check aria-hidden="true" /><span><MathText value={item} /></span></li>)}</ul>
            </section>

            <section id="examples">
              <div className={styles.sectionHeading}><BookOpenCheck aria-hidden="true" /><div><span>ลองทำก่อนเปิดวิธีคิด</span><h2>ตัวอย่างพร้อมวิธีทำ</h2></div></div>
              <div className={styles.examples}>{resource.examples.map((example, index) => (
                <details key={example.title} open={index === 0}>
                  <summary><span>{example.level}</span><strong>{example.title}</strong><small>กดเพื่อ{index === 0 ? 'ปิด' : 'เปิด'}วิธีทำ</small></summary>
                  <div className={styles.exampleBody}>
                    <div><h3>โจทย์</h3><p className={styles.problem}><MathText value={example.problem} /></p></div>
                    <div className={styles.exampleFacts}><p><span>คำตอบ</span><strong><MathText value={example.answer} /></strong></p><p><span>สูตรที่เลือกใช้</span><MathExpression value={example.formula} /></p><p><span>Keyword</span><MathText value={example.keywords} /></p></div>
                    <div><h3>วิธีคิดทีละขั้น</h3><ol>{example.steps.map((step) => <li key={step}><MathText value={step} /></li>)}</ol></div>
                    <div className={styles.exampleChecks}><p><AlertTriangle aria-hidden="true" /><span><strong>จุดหลอก</strong><MathText value={example.trap} /></span></p><p><Check aria-hidden="true" /><span><strong>วิธีตรวจคำตอบ</strong><MathText value={example.check} /></span></p></div>
                  </div>
                </details>
              ))}</div>
            </section>

            <section id="references">
              <div className={styles.sectionHeading}><ExternalLink aria-hidden="true" /><div><span>แหล่งใช้ตรวจขอบเขต</span><h2>แหล่งอ้างอิง</h2></div></div>
              <div className={styles.references}>{resource.references.map((reference) => (
                <a href={reference.url} target="_blank" rel="noreferrer" key={reference.url}>
                  <strong>{reference.organization}</strong><span>{reference.title}</span><small>{reference.note}</small><ExternalLink aria-hidden="true" />
                </a>
              ))}</div>
            </section>
          </article>
        </div>

        <Link href={`/treasure/${next.slug}`} className={styles.next}>
          <span>บทถัดไป · บทที่ {next.chapter}</span>
          <strong>{next.topic} <ArrowRight aria-hidden="true" className="size-5" /></strong>
        </Link>
      </div>
    </main>
  )
}
