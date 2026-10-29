'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Compass } from 'lucide-react'
import { ADVENTURE_DESTINATIONS, ADVENTURE_TOPICS } from '@/lib/adventure-topics'
import { AnimatedContent, ClickSpark } from './adventure-effects'
import PixelReveal from './pixel-reveal'
import WorldSimulation from './world-simulation'
import { useAdventureMotion } from './use-adventure-motion'

export default function AdventureAtlas() {
  const [selected, setSelected] = useState(0)
  const place = ADVENTURE_DESTINATIONS[selected]
  const { ref, active, reduced } = useAdventureMotion()
  const id = useId()
  return <AnimatedContent className="adventure-atlas">
    <header><div><p className="adventure-kicker">A WORLD WORTH EXPLORING</p><h2>เลือกจุดหมายแรกของคุณ</h2><p>ทุกบทมีโลกให้ค้นพบ · เลือกเริ่มที่ไหนก็ได้</p></div><Link href="/practice">ดูแผนที่ภารกิจทั้งหมด <ArrowRight size={18} aria-hidden="true" /></Link></header>
    <div ref={ref} className="atlas-viewport world-scene" data-active={active} id={id} role="region" aria-label="จุดหมายการผจญภัย">
      <AnimatePresence initial={false}><motion.div key={place.id} className="atlas-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .35 }}><Image src={`/adventure/${place.id}.webp`} fill sizes="(max-width: 767px) 100vw, 1200px" alt="" className="world-landscape" /><PixelReveal /><ClickSpark /></motion.div></AnimatePresence>
      <WorldSimulation map />
      <div className="atlas-scrim" />
      <div className="atlas-caption"><p><Compass size={17} aria-hidden="true" /> EXPLORE THE UNKNOWN</p><h3>{place.name}</h3><p>{place.description}</p><div>{place.topics.map(topicId => { const topic = ADVENTURE_TOPICS.find(item => item.id === topicId)!; return <Link key={topicId} href={`/practice/${topicId}`}><span aria-hidden="true">{topic.icon}</span><span>{topic.name}<small>{topic.grade} · ฝึกฟรี 50 ข้อ</small></span><ArrowRight size={17} aria-hidden="true" /></Link> })}</div></div>
    </div>
    <div className="atlas-destinations" role="group" aria-label="เลือกจุดหมาย">{ADVENTURE_DESTINATIONS.map((item,index) => <button key={item.id} type="button" aria-pressed={selected === index} aria-controls={id} onClick={() => setSelected(index)}><Image src={`/adventure/${item.id}.webp`} fill sizes="180px" alt="" /><span>{item.name}</span>{selected === index && <motion.i layoutId={`${id}-selection`} transition={{ duration: reduced ? 0 : .25 }} />}</button>)}</div>
  </AnimatedContent>
}
