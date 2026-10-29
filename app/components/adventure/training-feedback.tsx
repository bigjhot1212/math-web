'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export function CompletionBurst({ confirmed }: { confirmed: boolean }) {
  const reduced = useReducedMotion()
  if (!confirmed || reduced) return null
  return <div className="completion-burst" aria-hidden="true">{Array.from({length:12},(_,i)=><motion.span key={i} initial={{opacity:0,x:0,y:0,scale:.3}} animate={{opacity:[0,1,0],x:Math.cos(i*Math.PI/6)*90,y:Math.sin(i*Math.PI/6)*55-20,rotate:i*40,scale:[.3,1,.5]}} transition={{duration:.8,delay:i*.015}} />)}</div>
}
export function TrainingFeedback({ status, correct }: { status: 'saving'|'saved'|'error'; correct: boolean }) {
  return <div className={`training-feedback ${status==='error'?'feedback-save-error':correct?'feedback-correct':'feedback-retry'}`} data-save-state={status} role="status"><CompletionBurst confirmed={status==='saved' && correct} />
    <strong>{correct?'คำตอบถูกต้อง!':'ลองอ่านแนวคิด แล้วฝึกต่อได้เลย'}</strong><span>{status==='saving'?'กำลังบันทึกผล…':status==='saved'?'บันทึกผลการฝึกแล้ว':'บันทึกผลไม่สำเร็จ กรุณาตรวจการเชื่อมต่อ'}</span>
  </div>
}
export function ResultReveal({ children, confirmed }: { children: ReactNode; confirmed: boolean }) {
  const reduced = useReducedMotion()
  return <motion.div className="adventure-result" initial={false} animate={confirmed && !reduced ? {opacity:[.6,1],y:[12,0]} : {opacity:1,y:0}} transition={{duration:.5}}><CompletionBurst confirmed={confirmed} />{children}</motion.div>
}
