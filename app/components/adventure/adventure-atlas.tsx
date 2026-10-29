'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { ADVENTURE_DESTINATIONS, ADVENTURE_TOPICS } from '@/lib/adventure-topics'
import { AnimatedContent } from './adventure-effects'
import { useAdventureMotion } from './use-adventure-motion'

export default function AdventureAtlas() {
  const [selected, setSelected] = useState(0)
  const place = ADVENTURE_DESTINATIONS[selected]
  const { ref, active, reduced } = useAdventureMotion()
  const id = useId()
  return <AnimatedContent className="adventure-atlas">
    <header><div><h2>เลือกจุดหมายแรกของคุณ</h2><p>เลือกบทที่อยากทบทวน แล้วค่อย ๆ สำรวจในจังหวะของตัวเอง</p></div><Link href="/practice">ดูทุกบท <ArrowRight size={18} aria-hidden="true" /></Link></header>
    <div ref={ref} className="atlas-feature" data-active={active} id={id} role="region" aria-label="จุดหมายการผจญภัย">
      <div className="atlas-visual">
        <AnimatePresence initial={false}><motion.div key={place.id} className="atlas-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .3 }}><Image src={`/adventure/${place.id}.webp`} fill sizes="(max-width: 767px) 100vw, 760px" alt="" /></motion.div></AnimatePresence>
        <div className="atlas-image-shade" />
        <span className="atlas-place-count">{String(selected + 1).padStart(2, '0')} / {String(ADVENTURE_DESTINATIONS.length).padStart(2, '0')}</span>
      </div>
      <div className="atlas-caption"><p>จุดหมายแนะนำ</p><h3>{place.name}</h3><p>{place.description}</p><div className="atlas-topic-list">{place.topics.map(topicId => { const topic = ADVENTURE_TOPICS.find(item => item.id === topicId)!; return <Link key={topicId} href={`/practice/${topicId}`}><span aria-hidden="true">{topic.icon}</span><span>{topic.name}<small>{topic.grade} · แบบฝึก 50 ข้อ</small></span><ArrowRight size={17} aria-hidden="true" /></Link> })}</div></div>
    </div>
    <div className="atlas-destinations" role="group" aria-label="เลือกจุดหมาย">{ADVENTURE_DESTINATIONS.map((item,index) => <button key={item.id} type="button" aria-pressed={selected === index} aria-controls={id} onClick={() => setSelected(index)}><span className="atlas-thumb"><Image src={`/adventure/${item.id}.webp`} fill sizes="56px" alt="" /></span><span>{item.name}</span>{selected === index && <motion.i layoutId={`${id}-selection`} transition={{ duration: reduced ? 0 : .25 }} />}</button>)}</div>
  </AnimatedContent>
}
