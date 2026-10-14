import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, BrainCircuit, Check, ExternalLink, KeyRound, Lightbulb, ListChecks, Target } from 'lucide-react'
import { getTreasureResource, TREASURE_ALIASES, TREASURE_RESOURCES } from '@/content/treasure'
import FormulaFlashcards from './formula-flashcards'
import { getFormulaLineLabels } from './formula-line-labels'
import MathExpression from './math-expression'
import styles from './treasure-article.module.css'

type Props = { params: Promise<{ slug: string }> }

const FORMULA_DEMOS: Record<string, { prompt: string; tip: string; substitution: string; answer: string }> = {
  'sequences-series-formula-guide::ผลบวกเลขคณิต': {
    prompt: 'ลำดับ 3, 7, 11, … มี 20 พจน์ จงหาผลบวกทั้งหมด',
    tip: 'โจทย์ให้พจน์แรก ผลต่างร่วม และจำนวนพจน์ จึงเลือกสูตรรูปที่มี a₁, d และ n',
    substitution: 'a₁ = 3; d = 4; n = 20; S_20 = 20[2(3) + (20−1)4] / 2 = 20(82) / 2',
    answer: 'S_20 = 820',
  },
}

export function generateStaticParams() {
  return TREASURE_RESOURCES.map((resource) => ({ slug: resource.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resource = getTreasureResource(slug)
  if (!resource) return { title: 'ไม่พบเนื้อหา | MathPrep' }
  return { title: `${resource.title} | ขุมทรัพย์ MathPrep`, description: resource.description }
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

            <section id="formulas">
              <div className={styles.sectionHeading}><span className={styles.mathIcon}>ƒ</span><div><span>จำความหมายก่อนแทนค่า</span><h2>สูตรและแนวคิดสำคัญ</h2></div></div>
              <div className={styles.formulaList}>{resource.formulas.map((formula, index) => (
                <div className={styles.formulaBlock} key={formula.name}>
                  <div className={styles.formulaTitle}><span>{String(index + 1).padStart(2, '0')}</span><h3>{formula.name}</h3></div>
                  <div className={styles.formulaContext}>
                    <p><span>สูตรนี้คืออะไร</span>{formula.meaning}</p>
                    <p><span>เอาไว้ใช้เมื่อ</span>{formula.use}</p>
                  </div>
                  <div className={styles.formula}>
                    <MathExpression value={formula.expression} lineLabels={getFormulaLineLabels(resource.slug, formula.name, formula.expression)} />
                  </div>
                  {FORMULA_DEMOS[`${resource.slug}::${formula.name}`] && (() => {
                    const demo = FORMULA_DEMOS[`${resource.slug}::${formula.name}`]
                    return <div className={styles.formulaDemo}>
                      <strong>ตัวอย่างแทนค่าจริง</strong>
                      <p>{demo.prompt}</p>
                      <p className={styles.formulaDemoTip}>{demo.tip}</p>
                      <MathExpression value={demo.substitution} />
                      <p className={styles.formulaDemoAnswer}>ดังนั้น <MathExpression value={demo.answer} /></p>
                    </div>
                  })()}
                  <div className={styles.formulaWalkthrough}>
                    <h4>วิธีใช้สูตรนี้ทีละขั้น</h4>
                    <ol>
                      <li><strong>จับคำสำคัญจากโจทย์</strong><span>ถ้าโจทย์กล่าวถึง {formula.keywords} ให้หยุดดูว่าสูตรนี้ตรงกับสิ่งที่โจทย์ถามหรือไม่</span></li>
                      <li><strong>ระบุความหมายของข้อมูล</strong><span>{formula.meaning}</span></li>
                      <li><strong>ตรวจเงื่อนไขก่อนแทนค่า</strong><span>{formula.condition}</span></li>
                      <li><strong>เลือกใช้ให้ตรงคำถาม</strong><span>{formula.use}</span></li>
                      <li><strong>ตรวจคำตอบอีกครั้ง</strong><span>{formula.caution} และอย่าพลาดแบบที่พบบ่อย: {formula.mistakes}</span></li>
                    </ol>
                  </div>
                  <dl className={styles.formulaDetails}>
                    <div><dt>สัญลักษณ์และความหมาย</dt><dd>{formula.meaning}</dd></div>
                    <div><dt>เงื่อนไขที่ต้องตรวจ</dt><dd>{formula.condition}</dd></div>
                    <div><dt>โจทย์แบบไหนใช้สูตรนี้</dt><dd>{formula.use}</dd></div>
                    <div><dt>คำสำคัญในโจทย์</dt><dd>{formula.keywords}</dd></div>
                  </dl>
                  <div className={styles.cautions}>
                    <p><AlertTriangle aria-hidden="true" /> <span><strong>ระวัง</strong>{formula.caution}</span></p>
                    <p><Lightbulb aria-hidden="true" /> <span><strong>พลาดบ่อย</strong>{formula.mistakes}</span></p>
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
              <div className={styles.pairList}>{resource.patterns.map((item) => <div key={item.label}><strong>{item.label}</strong><p>{item.guidance}</p></div>)}</div>
            </section>}

            <section id="keywords">
              <div className={styles.sectionHeading}><KeyRound aria-hidden="true" /><div><span>เห็นคำนี้ ให้นึกถึงอะไร</span><h2>Keyword ในโจทย์</h2></div></div>
              <div className={styles.keywordTable}>{resource.keywords.map((item) => <div key={item.label}><strong>{item.label}</strong><span>{item.guidance}</span></div>)}</div>
            </section>

            <section id="traps">
              <div className={styles.sectionHeading}><AlertTriangle aria-hidden="true" /><div><span>คะแนนมักหลุดก่อนเริ่มคำนวณ</span><h2>จุดหลอกและข้อควรระวัง</h2></div></div>
              <ol className={styles.trapList}>{resource.traps.map((item) => <li key={item}>{item}</li>)}</ol>
              {resource.scopeNote && <p className={styles.scopeNote}><strong>ขอบเขตของบทนี้</strong>{resource.scopeNote}</p>}
            </section>

            <section id="checklist">
              <div className={styles.sectionHeading}><Check aria-hidden="true" /><div><span>ใช้เวลาไม่ถึงครึ่งนาที</span><h2>Checklist ก่อนตอบ</h2></div></div>
              <ul className={styles.checklist}>{resource.checklist.map((item) => <li key={item}><Check aria-hidden="true" /><span>{item}</span></li>)}</ul>
            </section>

            <section id="examples">
              <div className={styles.sectionHeading}><BookOpenCheck aria-hidden="true" /><div><span>ลองทำก่อนเปิดวิธีคิด</span><h2>ตัวอย่างพร้อมวิธีทำ</h2></div></div>
              <div className={styles.examples}>{resource.examples.map((example, index) => (
                <details key={example.title} open={index === 0}>
                  <summary><span>{example.level}</span><strong>{example.title}</strong><small>กดเพื่อ{index === 0 ? 'ปิด' : 'เปิด'}วิธีทำ</small></summary>
                  <div className={styles.exampleBody}>
                    <div><h3>โจทย์</h3><p className={styles.problem}>{example.problem}</p></div>
                    <div className={styles.exampleFacts}><p><span>คำตอบ</span><strong>{example.answer}</strong></p><p><span>สูตรที่เลือกใช้</span><MathExpression value={example.formula} /></p><p><span>Keyword</span>{example.keywords}</p></div>
                    <div><h3>วิธีคิดทีละขั้น</h3><ol>{example.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
                    <div className={styles.exampleChecks}><p><AlertTriangle aria-hidden="true" /><span><strong>จุดหลอก</strong>{example.trap}</span></p><p><Check aria-hidden="true" /><span><strong>วิธีตรวจคำตอบ</strong>{example.check}</span></p></div>
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
