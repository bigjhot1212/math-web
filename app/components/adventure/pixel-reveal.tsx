'use client'

import { motion, useReducedMotion } from 'motion/react'

export default function PixelReveal() {
  const reduced = useReducedMotion()
  if (reduced) return null
  return <div className="pixel-reveal" aria-hidden="true">{Array.from({ length: 36 }, (_, i) => (
    <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
      transition={{ duration: 0.5, delay: (i % 6) * 0.025 + Math.floor(i / 6) * 0.015, times: [0, 0.25, 0.5, 1] }} />
  ))}</div>
}
