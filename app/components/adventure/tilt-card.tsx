'use client'

import type { ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { useAdventureMotion } from './use-adventure-motion'

// Adapted from React Bits Tilted Card. See THIRD_PARTY_NOTICES.md.
export default function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, active } = useAdventureMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const lightX = useMotionValue(50)
  const lightY = useMotionValue(30)
  const light = useMotionValue(0)
  const spotlight = useMotionTemplate`radial-gradient(circle at ${lightX}% ${lightY}%, #FFF3B966, transparent 65%)`
  const rotateX = useSpring(x, { stiffness: 180, damping: 24 })
  const rotateY = useSpring(y, { stiffness: 180, damping: 24 })
  return (
    <motion.div ref={ref} className={`adventure-tilt ${className}`} style={{ rotateX: active ? rotateX : 0, rotateY: active ? rotateY : 0, transformPerspective: 900 }}
      onPointerMove={event => {
        if (!active || event.pointerType !== 'mouse') return
        const bounds = event.currentTarget.getBoundingClientRect()
        const clamp = (value: number) => Math.max(-1, Math.min(1, value))
        lightX.set((event.clientX - bounds.left) / bounds.width * 100)
        lightY.set((event.clientY - bounds.top) / bounds.height * 100)
        light.set(1)
        x.set(clamp((event.clientY - bounds.top) / bounds.height * 2 - 1) * -7)
        y.set(clamp((event.clientX - bounds.left) / bounds.width * 2 - 1) * 7)
      }}
      onPointerLeave={() => { x.set(0); y.set(0); light.set(0) }}>
      {children}
      <motion.span className="card-spotlight" aria-hidden="true" style={{ background: spotlight, opacity: active ? light : 0 }} />
    </motion.div>
  )
}
