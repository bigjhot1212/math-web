'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Compass } from 'lucide-react'
import { ADVENTURE_REGIONS } from '@/lib/adventure-topics'
import TiltCard from './tilt-card'
import WorldSimulation, { WorldCompass } from './world-simulation'
import { useAdventureMotion } from './use-adventure-motion'
import { ShinyText, CountUp } from './adventure-effects'

export default function AdventureHero() {
  const { ref, active, reduced } = useAdventureMotion()
  return <section ref={ref} className="adventure-hero world-scene" data-active={active}>
    <Image src="/adventure/island.webp" fill priority sizes="100vw" alt="เกาะการเรียนรู้สามดินแดน มีหมู่บ้านกลางป่า หอคอยบนภูเขา และวิหารเหนือเมฆ" className="world-landscape" />
    <div className="adventure-hero-shade" />
    <WorldSimulation />
    <div className="simulation-hud"><span><i /> ISLAND EXPLORER</span><span>14 MISSIONS / 03 REGIONS</span></div>
    <WorldCompass />
    <div className="adventure-hero-copy"><p className="adventure-kicker">MATH HUNTERS ASSOCIATION</p>
      <h1><ShinyText>ทุกข้อคือการผจญภัย</ShinyText><br />ทุกวันเก่งขึ้นได้</h1>
      <p>ออกสำรวจโลกคณิตศาสตร์ ฝึกทีละบท พิชิตโจทย์ทีละข้อ<br className="hidden sm:block" />แล้วกลับมาเห็นพัฒนาการของตัวเอง</p>
      <div className="adventure-hero-actions"><Link href="/practice" className="adventure-button simulation-cta"><Compass size={20} aria-hidden="true" />เริ่มผจญภัย ฝึกฟรี<ArrowRight size={18} aria-hidden="true" /></Link><Link href="/treasure">เปิดขุมทรัพย์อ่านฟรี →</Link></div>
      <div className="adventure-hero-proof"><span><b><CountUp value={14} /></b>บทเรียน ม.4–ม.6</span><span><b><CountUp value={700} /></b>ข้อให้ฝึก</span><span><b>98/100</b>คะแนน A-Level ผู้สอน</span></div>
    </div>
    <div className="hero-region-deck" aria-label="สำรวจสามดินแดน">{ADVENTURE_REGIONS.map((region,index) => <motion.div key={region.grade} animate={active ? { y:[0,-7,0] } : { y:0 }} transition={{ duration:4+index,repeat:active?Infinity:0,ease:'easeInOut',delay:index*.4 }}>
      <TiltCard><Link href="/practice" className="hero-region-card"><Image src={region.image} fill sizes="200px" alt="" /><span className="hero-region-frame"><span>{region.grade}</span><strong>{region.name}</strong><small>เปิดภารกิจ →</small></span></Link></TiltCard>
    </motion.div>)}</div>
    <div className="hero-explore-hint" aria-hidden="true"><motion.span animate={active && !reduced ? { y:[0,6,0] } : { y:0 }} transition={{ duration:2,repeat:active?Infinity:0 }}>↓</motion.span>โลกแห่งการฝึกเริ่มตรงนี้</div>
  </section>
}
