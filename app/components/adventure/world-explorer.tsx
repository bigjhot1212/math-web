'use client'

import { useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog } from 'radix-ui'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, Check, Compass, Layers, Map, Search, X } from 'lucide-react'
import { ADVENTURE_TOPICS, ADVENTURE_REGIONS, MAP_LOCATIONS, filterAdventureTopics, getPracticeHref, getTopicProgress, getTopicArtwork, type AdventureGrade, type AdventureTopic, type TopicProgress } from '@/lib/adventure-topics'
import { useAdventureMotion } from './use-adventure-motion'

export default function WorldExplorer({ progress = {}, signedIn = false, recommendedTopicId }: {
  progress?: Record<string, TopicProgress>; signedIn?: boolean; recommendedTopicId?: string
}) {
  const [view, setView] = useState<'map' | 'cards'>('map')
  const [grade, setGrade] = useState<AdventureGrade>('ม.4')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<AdventureTopic | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const scroll = useRef<HTMLDivElement>(null)
  const { ref, active } = useAdventureMotion()
  const reduced = useReducedMotion()
  const id = useId()
  const topics = filterAdventureTopics(grade, query)
  const selectedProgress = selected ? getTopicProgress(progress, selected.id) : null
  const selectedRegion = ADVENTURE_REGIONS.find(region => region.grade === selected?.grade)
  const choose = (topic: AdventureTopic, button: HTMLButtonElement) => { trigger.current = button; setSelected(topic) }

  function chooseGrade(next: AdventureGrade) {
    setGrade(next)
    const index = ADVENTURE_REGIONS.findIndex(region => region.grade === next)
    scroll.current?.scrollTo({ left: index < 0 ? 0 : index * scroll.current.scrollWidth / 3, behavior: reduced ? 'instant' : 'smooth' })
  }

  return (
    <LayoutGroup id={id}>
      <section className="world-explorer" aria-labelledby={`${id}-title`}>
        <div className="world-heading">
          <div><h2 id={`${id}-title`}>แผนที่บทเรียน</h2><p>เลือกดูทีละระดับชั้น หรือค้นหาบทที่ต้องการได้เลย</p></div>
          <div className="world-view-switch" role="group" aria-label="รูปแบบการสำรวจ">
            <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}><Map size={17} aria-hidden="true" />แผนที่</button>
            <button type="button" aria-pressed={view === 'cards'} onClick={() => setView('cards')}><Layers size={17} aria-hidden="true" />การ์ดภารกิจ</button>
          </div>
        </div>
        <div className="world-toolbar">
          <div className="world-grade-filter" role="group" aria-label="เลือกชั้นเรียน">
            {(['all', 'ม.4', 'ม.5', 'ม.6'] as const).map(value => <button key={value} type="button" aria-pressed={grade === value} onClick={() => chooseGrade(value)}>{value === 'all' ? 'ทุกดินแดน' : value}</button>)}
          </div>
          <div className="world-toolbar-actions"><label className="world-search"><Search size={17} aria-hidden="true" /><span className="sr-only">ค้นหาภารกิจ</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="ค้นหาชื่อบท" /></label><button className="world-random-button" type="button" disabled={topics.length === 0} onClick={event => { const topic = topics[Math.floor(Math.random() * topics.length)]; if (topic) choose(topic, event.currentTarget) }}><Compass size={15} aria-hidden="true" />สุ่มบท</button></div>
        </div>
        <p className="sr-only" role="status">พบ {topics.length} ภารกิจ</p>
        {topics.length === 0 ? <div className="world-empty"><Compass size={40} aria-hidden="true" /><h3>ยังไม่พบภารกิจนี้</h3><p>ลองใช้ชื่อบทภาษาไทยหรือภาษาอังกฤษ</p><button type="button" onClick={() => { setQuery(''); chooseGrade('all') }}>แสดงทุกภารกิจ</button></div> : view === 'map' ? (
          <div ref={ref} className="world-scene" data-active={active}>
            <div ref={scroll} className="world-map-scroll" role="region" aria-label="แผนที่ 14 ภารกิจ เลื่อนแนวนอนเพื่อสำรวจทุกดินแดน" tabIndex={0}>
              <div className="world-map-canvas">
                <Image src="/adventure/island.webp" fill sizes="1100px" priority alt="" className="world-landscape" />
                <div className="world-map-shade" />
                <svg className="world-paths" viewBox="0 0 1000 610" preserveAspectRatio="none" aria-hidden="true"><path d="M90 146 Q300 140 260 226 T100 305 T270 384 T100 470 T280 537 M440 152 Q700 175 590 250 T430 335 T590 427 T440 525 M790 177 Q970 200 870 335 T770 488" /></svg>
                {topics.map(topic => {
                  const location = MAP_LOCATIONS[ADVENTURE_TOPICS.findIndex(item => item.id === topic.id)]
                  const value = getTopicProgress(progress, topic.id)
                  return <button key={topic.id} type="button" className={`world-landmark ${recommendedTopicId === topic.id ? 'landmark-recommended' : ''}`} style={{ left: `${location[0]}%`, top: `${location[1]}%` }} onClick={event => choose(topic, event.currentTarget)} aria-label={`${topic.name} ${topic.grade} ทำแล้ว ${value.done} จาก ${value.total} ข้อ`}>
                    <span className="landmark-symbol" aria-hidden="true">{topic.icon}{value.percent === 100 && <Check size={15} />}</span><span className="landmark-name">{topic.name}<small>{value.done}/{value.total} ข้อ{recommendedTopicId === topic.id ? ' · แนะนำ' : ''}</small></span>
                  </button>
                })}
              </div>
            </div>
            <div className="world-map-caption"><span><Compass size={15} aria-hidden="true" />แตะชื่อบทเพื่อดูรายละเอียด</span><span>เลื่อนแผนที่ซ้าย–ขวาได้</span></div>
          </div>
        ) : (
          <div className="mission-collection" aria-label="การ์ดภารกิจทั้งหมด">
            {topics.map(topic => {
              const value = getTopicProgress(progress, topic.id)
              return <button key={topic.id} type="button" className="mission-card" data-crop={ADVENTURE_TOPICS.indexOf(topic) % 2 ? 'detail' : 'wide'} onClick={event => choose(topic, event.currentTarget)} aria-label={`เปิดภารกิจ ${topic.name} ${topic.grade} ทำแล้ว ${value.done} จาก ${value.total} ข้อ`}>
                <motion.div layoutId={`art-${topic.id}`} className="mission-card-art"><Image src={getTopicArtwork(topic.id)} fill sizes="360px" alt="" /><span className="mission-card-grade">{topic.grade}</span><span className="mission-card-symbol" aria-hidden="true">{topic.icon}</span></motion.div>
                <span className="mission-card-copy"><span className="mission-card-en">{topic.nameEn}</span><strong>{topic.name}</strong><span className="mission-card-track"><span style={{ width: `${value.percent}%` }} /></span><span className="mission-card-bottom"><span>{signedIn ? `${value.done}/${value.total} ข้อ` : `${value.total} ข้อ พร้อมเริ่ม`}</span><span>{value.percent === 100 ? 'ทำครบแล้ว ✓' : 'เปิดภารกิจ →'}</span></span></span>
              </button>
            })}
          </div>
        )}
      </section>
      <Dialog.Root open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null) }}>
        <AnimatePresence>{selected && selectedProgress && selectedRegion && <Dialog.Portal forceMount>
          <Dialog.Overlay asChild><motion.div className="mission-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} /></Dialog.Overlay>
          <Dialog.Content asChild onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus() }}>
            <motion.div className="mission-briefing" initial={{ opacity: 0, x: reduced ? 0 : 60, y: reduced ? 0 : 20 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: reduced ? 0 : 40 }} transition={{ type: 'spring', stiffness: 250, damping: 28 }}>
              <motion.div className="briefing-art" layoutId={view === 'cards' ? `art-${selected.id}` : undefined}><Image src={getTopicArtwork(selected.id)} fill sizes="520px" alt="" /><span className="briefing-symbol" aria-hidden="true">{selected.icon}</span></motion.div>
              <Dialog.Close className="briefing-close" aria-label="ปิดรายละเอียดภารกิจ"><X size={21} /></Dialog.Close>
              <div className="briefing-copy"><p className="adventure-kicker">{selected.grade} · {selectedRegion.name}</p><Dialog.Title>{selected.name}</Dialog.Title><Dialog.Description>{selected.nameEn} · ฝึกโจทย์พร้อมเฉลยและทบทวนแนวคิด</Dialog.Description>
                <div className="briefing-progress"><span>ทำแล้ว {selectedProgress.done} จาก {selectedProgress.total} ข้อ</span><strong>{selectedProgress.percent}%</strong></div><div className="mission-card-track"><motion.span initial={{ width: 0 }} animate={{ width: `${selectedProgress.percent}%` }} transition={{ duration: reduced ? 0 : 0.6 }} /></div>
                <p className="briefing-note">{selectedProgress.percent === 100 ? 'ทำครบแล้ว กลับมาฝึกซ้ำเพื่อทบทวนได้เสมอ' : 'เลือกฝึกทีละข้อ เปิดเฉลยเมื่ออยากทบทวน แล้วกลับมาทำต่อได้'}</p>
                <Link className="adventure-button" href={getPracticeHref(selected.id, signedIn)}>{!signedIn ? 'เข้าสู่ระบบเพื่อเริ่มฝึก' : selectedProgress.done > 0 ? 'กลับไปฝึกต่อ' : 'เริ่มภารกิจ'}<ArrowRight size={18} aria-hidden="true" /></Link>
                <Link className="briefing-guide" href={`/treasure/${selected.id}-formula-guide`}>เปิดคู่มือบทนี้ก่อนฝึก →</Link>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>}</AnimatePresence>
      </Dialog.Root>
    </LayoutGroup>
  )
}
