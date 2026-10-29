'use client'

import { useRef, useSyncExternalStore } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback)
  return () => document.removeEventListener('visibilitychange', callback)
}
export function useAdventureMotion<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { amount: 0.05 })
  const visible = useSyncExternalStore(subscribeVisibility, () => document.visibilityState !== 'hidden', () => false)
  const reduced = useReducedMotion()
  return { ref, active: inView && visible && !reduced, reduced }
}
