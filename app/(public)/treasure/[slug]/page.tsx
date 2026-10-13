import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Check, Clock3, ExternalLink, KeyRound, Lightbulb, ListChecks, Target } from 'lucide-react'
import { getTreasureResource, TREASURE_ALIASES, TREASURE_RESOURCES } from '@/content/treasure'
import styles from './treasure-article.module.css'

type Props = { params: Promise<{ slug: string }> }

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
            <span><Clock3 aria-hidden="true" className="size-4" /> ใช้เวลาอ่านประมาณ {resource.readMinutes} นาที</span>
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
                  <div className={styles.formula}>{formula.expression}</div>
                  <dl className={styles.formulaDetails}>
                    <div><dt>ความหมาย</dt><dd>{formula.meaning}</dd></div>
                    <div><dt>เงื่อนไข</dt><dd>{formula.condition}</dd></div>
                    <div><dt>ใช้เมื่อ</dt><dd>{formula.use}</dd></div>
                    <div><dt>Keyword</dt><dd>{formula.keywords}</dd></div>
                  </dl>
                  <div className={styles.cautions}>
                    <p><AlertTriangle aria-hidden="true" /> <span><strong>ระวัง</strong>{formula.caution}</span></p>
                    <p><Lightbulb aria-hidden="true" /> <span><strong>พลาดบ่อย</strong>{formula.mistakes}</span></p>
                  </div>
                </div>
              ))}</div>
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
                    <div className={styles.exampleFacts}><p><span>คำตอบ</span><strong>{example.answer}</strong></p><p><span>สูตรที่เลือกใช้</span>{example.formula}</p><p><span>Keyword</span>{example.keywords}</p></div>
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
