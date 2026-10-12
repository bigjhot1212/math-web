'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, BookOpenText, Check, Clock3, Search, Sparkles, X } from 'lucide-react'
import type { TreasureKind, TreasureResource } from '@/content/treasure'
import { TREASURE_KINDS, TREASURE_TOPICS } from '@/content/treasure'
import styles from './treasure.module.css'

type Props = { resources: TreasureResource[] }

export default function TreasureLibrary({ resources }: Props) {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('ทั้งหมด')
  const [kind, setKind] = useState<'all' | TreasureKind>('all')
  const featured = resources.find((resource) => resource.featured) ?? resources[0]

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('th')
    return resources.filter((resource) => {
      const matchesTopic = topic === 'ทั้งหมด' || resource.topic === topic
      const matchesKind = kind === 'all' || resource.kind === kind
      const haystack = `${resource.title} ${resource.description} ${resource.topic} ${resource.kindLabel}`.toLocaleLowerCase('th')
      return matchesTopic && matchesKind && (!normalized || haystack.includes(normalized))
    })
  }, [kind, query, resources, topic])

  const hasFilters = Boolean(query) || topic !== 'ทั้งหมด' || kind !== 'all'
  const listedResources = filtered.filter((resource) => hasFilters || resource.slug !== featured?.slug)
  function clearFilters() { setQuery(''); setTopic('ทั้งหมด'); setKind('all') }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}><Sparkles aria-hidden="true" className="size-4" /> อ่านฟรี ไม่ต้องล็อกอิน</p>
          <h1>ขุมทรัพย์</h1>
          <p>สรุปสิ่งที่ต้องรู้ ทริคอ่านโจทย์ และจุดหลอกที่ควรเห็นก่อนเริ่มคำนวณ</p>
        </div>
        <div className={styles.heroIndex} aria-label="ภาพรวมเนื้อหา">
          <span className={styles.indexMark}>∑</span>
          <div><strong>{resources.length}</strong><span>เรื่องในคลัง</span></div>
          <div><strong>{TREASURE_TOPICS.length - 1}</strong><span>หัวข้อคณิต</span></div>
          <div><strong>ฟรี</strong><span>ทุกเรื่อง</span></div>
        </div>
      </section>

      <section className={styles.workspace}>
        <aside className={styles.filters} aria-label="ตัวกรองขุมทรัพย์">
          <div>
            <label htmlFor="treasure-search">ค้นหาเรื่องที่อยากทบทวน</label>
            <div className={styles.searchBox}>
              <Search aria-hidden="true" className="size-4" />
              <input id="treasure-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="เช่น โดเมน, 0/0, ยูเนียน" />
              {query && <button type="button" onClick={() => setQuery('')} aria-label="ล้างคำค้น"><X className="size-4" /></button>}
            </div>
          </div>
          <fieldset>
            <legend>ประเภท</legend>
            <div className={styles.filterList}>{TREASURE_KINDS.map((item) => (
              <button key={item.value} type="button" aria-pressed={kind === item.value} data-active={kind === item.value} onClick={() => setKind(item.value)}>
                {kind === item.value && <Check aria-hidden="true" className="size-4" />}{item.label}
              </button>
            ))}</div>
          </fieldset>
          <fieldset>
            <legend>บทเรียน</legend>
            <div className={styles.filterList}>{TREASURE_TOPICS.map((item) => (
              <button key={item} type="button" aria-pressed={topic === item} data-active={topic === item} onClick={() => setTopic(item)}>
                {topic === item && <Check aria-hidden="true" className="size-4" />}{item}
              </button>
            ))}</div>
          </fieldset>
        </aside>

        <div className={styles.library}>
          {!hasFilters && featured && (
            <Link href={`/treasure/${featured.slug}`} className={styles.featured}>
              <div className={styles.featuredMark} aria-hidden="true">{featured.mark}</div>
              <div className={styles.featuredCopy}>
                <span>{featured.kindLabel} · {featured.topic}</span>
                <h2>{featured.title}</h2>
                <p>{featured.description}</p>
                <ul>{featured.takeaways.map((item) => <li key={item}>{item}</li>)}</ul>
                <strong>เปิดอ่าน <ArrowRight aria-hidden="true" className="size-4" /></strong>
              </div>
            </Link>
          )}
          <div className={styles.listHeading}>
            <div><BookOpenText aria-hidden="true" className="size-5" /><h2>{hasFilters ? 'ผลลัพธ์' : 'เปิดแฟ้มต่อ'}</h2></div>
            <span role="status" aria-live="polite">{listedResources.length} เรื่อง</span>
          </div>
          {filtered.length > 0 ? (
            <div className={styles.resourceList}>{listedResources.map((resource, index) => (
              <Link href={`/treasure/${resource.slug}`} className={styles.resourceRow} key={resource.slug}>
                <span className={styles.rowNumber}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.rowMark} aria-hidden="true">{resource.mark}</span>
                <span className={styles.rowCopy}><span>{resource.kindLabel} · {resource.topic}</span><strong>{resource.title}</strong><small>{resource.description}</small></span>
                <span className={styles.rowMeta}><Clock3 aria-hidden="true" className="size-4" /> {resource.readMinutes} นาที</span>
                <ArrowRight aria-hidden="true" className={styles.rowArrow} />
              </Link>
            ))}</div>
          ) : (
            <div className={styles.empty}><span aria-hidden="true">∅</span><h2>ยังไม่เจอเรื่องที่ค้นหา</h2><p>ลองเปลี่ยนคำค้น หรือเปิดดูทุกหัวข้อในคลังก่อน</p><button type="button" onClick={clearFilters}>ล้างตัวกรอง</button></div>
          )}
        </div>
      </section>
    </main>
  )
}
