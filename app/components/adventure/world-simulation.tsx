'use client'

import dynamic from 'next/dynamic'
import { useId } from 'react'
import { useInView } from 'motion/react'
import { Compass } from 'lucide-react'
import { useAdventureMotion } from './use-adventure-motion'

const GradientASCII = dynamic(() => import('./gradient-ascii'), { ssr: false })
const colors = ['#042F35', '#07665C', '#18BC99', '#A6F4C5', '#F3CE78']

export default function WorldSimulation({ map = false }: { map?: boolean }) {
  const { ref, reduced } = useAdventureMotion()
  const entered = useInView(ref, { once: true, margin: '100px' })
  return <div ref={ref} className={`world-simulation ${map ? 'simulation-map' : ''}`} aria-hidden="true">
    <div className="simulation-fallback" />
    {entered && !reduced && <GradientASCII colors={colors} characters=" .:+*01=≋∑∞" shape="horizon" cellSize={16} density={.78} glyphOpacity={.85} gradientOpacity={.35} glow={.3} grain={.025} flicker={0} flow={.35} speed={.4} dpr={1} intro={false} clickEffect="none" scrambleRadius={.12} className="simulation-ascii" />}
    <div className="simulation-grid" />
  </div>
}

export function WorldCompass() {
  const { ref, active } = useAdventureMotion()
  const id = useId()
  return <div ref={ref} className="world-compass" data-active={active} aria-hidden="true">
    <svg viewBox="0 0 120 120"><defs><path id={id} d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" /></defs><circle cx="60" cy="60" r="57" /><circle cx="60" cy="60" r="34" /><text><textPath href={`#${id}`} textLength="293">MATH HUNTERS · EXPLORE & DISCOVER · </textPath></text></svg>
    <Compass size={42} strokeWidth={1} />
    <span>N</span>
  </div>
}
