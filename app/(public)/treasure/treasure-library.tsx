'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, BookOpenText, Check, Search, X } from 'lucide-react'
import type { TreasureResource } from '@/content/treasure'
import { TREASURE_TOPICS } from '@/content/treasure'
import styles from './treasure.module.css'

type Props = { resources: TreasureResource[] }

export default function TreasureLibrary({ resources }: Props) {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('ทั้งหมด')
  const featured = resources.find((resource) => resource.featured) ?? resources[0]

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('th')
    return resources.filter((resource) => {
      const matchesTopic = topic === 'ทั้งหมด' || resource.topic === topic
      const deepText = [
        resource.title,
        resource.description,
        resource.topic,
        resource.goal,
        ...resource.takeaways,
        ...resource.scope,
        ...resource.formulas.flatMap((formula) => Object.values(formula)),
        ...resource.patterns.flatMap((item) => [item.label, item.guidance]),
        ...resource.keywords.flatMap((item) => [item.label, item.guidance]),
        ...resource.traps,
      ].join(' ').toLocaleLowerCase('th')
      return matchesTopic && (!normalized || deepText.includes(normalized))
    })
  }, [query, resources, topic])

  const hasFilters = Boolean(query) || topic !== 'ทั้งหมด'
  const listedResources = filtered.filter((resource) => hasFilters || resource.slug !== featured?.slug)

  function clearFilters() {
    setQuery('')
    setTopic('ทั้งหมด')
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <h1>ขุมทรัพย์</h1>
          <p>คู่มือคณิตศาสตร์ 14 บท อ่านฟรีตั้งแต่สูตร ความหมาย วิธีเลือกใช้ ไปจนถึง Keyword จุดหลอก และตัวอย่างทำจริง</p>
        </div>
        <p className={styles.heroNote}>ไม่ต้องท่องทุกอย่างในครั้งเดียว เลือกบทที่กำลังฝึก แล้วอ่านเฉพาะส่วนที่ยังพลาด</p>
      </section>

      <section className={styles.workspace}>
        <aside className={styles.filters} aria-label="ค้นหาและเลือกบทเรียน">
          <div className={styles.searchGroup}>
            <label htmlFor="treasure-search">ค้นหาในขุมทรัพย์</label>
            <div className={styles.searchBox}>
              <Search aria-hidden="true" className="size-4" />
              <input id="treasure-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="เช่น โดเมน, log, จุดสูงสุด" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="ล้างคำค้น"><X className="size-4" /></button>}
            </div>
          </div>
          <div className={styles.topicNav}>
            <p>เลือกบท</p>
            <div className={styles.filterList}>{TREASURE_TOPICS.map((item) => (
              <button key={item} type="button" aria-pressed={topic === item} data-active={topic === item} onClick={() => setTopic(item)}>
                {topic === item && <Check aria-hidden="true" className="size-4" />}{item}
              </button>
            ))}</div>
          </div>
        </aside>

        <div className={styles.library}>
          {!hasFilters && featured && (
            <Link href={`/treasure/${featured.slug}`} className={styles.featured}>
              <div className={styles.featuredMark} aria-hidden="true">{featured.mark}</div>
              <div className={styles.featuredCopy}>
                <span>บทที่ {featured.chapter} · คู่มือฉบับเต็ม</span>
                <h2>{featured.topic}</h2>
                <p>{featured.goal}</p>
                <div className={styles.featuredMeta}><strong>{featured.formulas.length} สูตรและแนวคิด</strong><strong>{featured.examples.length} ตัวอย่างพร้อมวิธีทำ</strong></div>
                <b>เปิดอ่านบทนี้ <ArrowRight aria-hidden="true" className="size-4" /></b>
              </div>
            </Link>
          )}

          <div className={styles.listHeading}>
            <div><BookOpenText aria-hidden="true" className="size-5" /><h2>{hasFilters ? 'ผลลัพธ์ที่พบ' : 'คู่มือทุกบท'}</h2></div>
            <span role="status" aria-live="polite">{listedResources.length} บท</span>
          </div>

          {filtered.length > 0 ? (
            <div className={styles.resourceList}>{listedResources.map((resource) => (
              <Link href={`/treasure/${resource.slug}`} className={styles.resourceRow} key={resource.slug}>
                <span className={styles.rowNumber}>{String(resource.chapter).padStart(2, '0')}</span>
                <span className={styles.rowMark} aria-hidden="true">{resource.mark}</span>
                <span className={styles.rowCopy}>
                  <span>บทที่ {resource.chapter}</span>
                  <strong>{resource.topic}</strong>
                  <small>{resource.goal}</small>
                </span>
                <ArrowRight aria-hidden="true" className={styles.rowArrow} />
              </Link>
            ))}</div>
          ) : (
            <div className={styles.empty}>
              <Search aria-hidden="true" className="size-8" />
              <h2>ยังไม่เจอเรื่องที่ค้นหา</h2>
              <p>ลองใช้คำสั้นลง หรือเปิดดูทุกบทในคลัง</p>
              <button type="button" onClick={clearFilters}>ล้างตัวกรอง</button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
