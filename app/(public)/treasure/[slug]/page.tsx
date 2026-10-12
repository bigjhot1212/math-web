import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Clock3, Lightbulb, ListChecks } from 'lucide-react'
import { getTreasureResource, TREASURE_RESOURCES } from '@/content/treasure'
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
  const resource = getTreasureResource(slug)
  if (!resource) notFound()
  const currentIndex = TREASURE_RESOURCES.findIndex((item) => item.slug === resource.slug)
  const next = TREASURE_RESOURCES[(currentIndex + 1) % TREASURE_RESOURCES.length]

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link href="/treasure" className={styles.back}><ArrowLeft aria-hidden="true" className="size-4" /> กลับไปขุมทรัพย์</Link>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <p>{resource.kindLabel} · {resource.topic}</p>
            <h1>{resource.title}</h1>
            <span><Clock3 aria-hidden="true" className="size-4" /> ใช้เวลาอ่านประมาณ {resource.readMinutes} นาที</span>
          </div>
          <div className={styles.mark} aria-hidden="true">{resource.mark}</div>
        </header>

        <div className={styles.bodyGrid}>
          <aside className={styles.takeaways}>
            <div><ListChecks aria-hidden="true" className="size-5" /><h2>อ่านจบแล้วควรได้อะไร</h2></div>
            <ul>{resource.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
          </aside>
          <article className={styles.article}>
            <p className={styles.lead}>{resource.description}</p>
            {resource.sections.map((section, index) => (
              <section key={section.heading}>
                <span className={styles.sectionNumber}>{String(index + 1).padStart(2, '0')}</span>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.formula && <div className={styles.formula}>{section.formula}</div>}
                {section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
                {section.note && <div className={styles.note}><Lightbulb aria-hidden="true" className="size-5" /><p>{section.note}</p></div>}
              </section>
            ))}
          </article>
        </div>

        <Link href={`/treasure/${next.slug}`} className={styles.next}>
          <span>อ่านเรื่องถัดไป · {next.topic}</span>
          <strong>{next.title} <ArrowRight aria-hidden="true" className="size-5" /></strong>
        </Link>
      </div>
    </main>
  )
}
