'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useAdventureMotion } from './use-adventure-motion'

// React Bits-inspired treatments adapted to our single Motion engine; see THIRD_PARTY_NOTICES.md.
export function ShinyText({ children }: { children: ReactNode }) {
  const { ref, active } = useAdventureMotion<HTMLSpanElement>()
  return <motion.span ref={ref} className="adventure-shiny" initial={false} animate={{ backgroundPosition: active ? ['150% 0%', '-150% 0%'] : '0% 0%' }} transition={{ duration: 2.5, repeat: active ? Infinity : 0, repeatDelay: 5, ease: 'linear' }}>{children}</motion.span>
}

export function AnimatedContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, active } = useAdventureMotion()
  return <motion.div ref={ref} className={className} initial={false} animate={active ? { opacity: [.6, 1], y: [18, 0] } : { opacity: 1, y: 0 }} transition={{ duration: .55, ease: 'easeOut' }}>{children}</motion.div>
}

export function CountUp({ value: target, suffix = '' }: { value: number; suffix?: string }) {
  const { ref, active } = useAdventureMotion<HTMLSpanElement>()
  const played = useRef(false)
  const value = useMotionValue(target)
  const text = useTransform(value, latest => `${Math.round(latest).toLocaleString('th-TH')}${suffix}`)
  useEffect(() => {
    if (!active || played.current) { value.set(target); return }
    played.current = true
    const animation = animate(value, [0, target], { duration: .8, ease: 'easeOut' })
    return () => { animation.stop(); value.set(target) }
  }, [active, target, value])
  return <span ref={ref} aria-label={`${target}${suffix}`}><motion.span aria-hidden="true">{text}</motion.span></span>
}

export function ClickSpark() {
  const { ref, active } = useAdventureMotion()
  return <div ref={ref} className="selection-spark" aria-hidden="true">{active && Array.from({ length: 8 }, (_, i) => <motion.i key={i} initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 0], x: Math.cos(i * Math.PI / 4) * 100, y: Math.sin(i * Math.PI / 4) * 75, rotate: i * 45, scaleX: [.2, 1, .2] }} transition={{ duration: .55, delay: .08 }} />)}</div>
}
