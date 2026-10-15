'use client'

import { useState, type KeyboardEvent } from 'react'
import { CheckCircle2, Eye, RefreshCcw, RotateCcw, Shuffle } from 'lucide-react'
import type { TreasureFormula } from '@/content/treasure'
import MathExpression, { MathText } from './math-expression'
import styles from './treasure-article.module.css'

type Props = {
  formulas: TreasureFormula[]
  topic: string
}

function makeDeck(length: number) {
  return Array.from({ length }, (_, index) => index)
}

function shuffled(values: number[]) {
  const next = [...values]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export default function FormulaFlashcards({ formulas, topic }: Props) {
  const [deck, setDeck] = useState(() => makeDeck(formulas.length))
  const [mastered, setMastered] = useState<number[]>([])
  const [revealed, setRevealed] = useState(false)
  const [reviewCount, setReviewCount] = useState(0)
  const currentIndex = deck[0]
  const card = formulas[currentIndex]
  const isComplete = deck.length === 0

  function reveal() {
    setRevealed(true)
  }

  function remember() {
    if (currentIndex === undefined) return
    setMastered((previous) => [...previous, currentIndex])
    setDeck((previous) => previous.slice(1))
    setRevealed(false)
  }

  function reviewAgain() {
    setDeck((previous) => previous.length > 1 ? [...previous.slice(1), previous[0]] : previous)
    setReviewCount((previous) => previous + 1)
    setRevealed(false)
  }

  function shuffleRemaining() {
    setDeck((previous) => shuffled(previous))
    setRevealed(false)
  }

  function restart() {
    setDeck(makeDeck(formulas.length))
    setMastered([])
    setReviewCount(0)
    setRevealed(false)
  }

  function handleKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return
    if (!revealed && (event.key === ' ' || event.key === 'Enter')) {
      event.preventDefault()
      reveal()
    } else if (revealed && event.key === '1') {
      reviewAgain()
    } else if (revealed && event.key === '2') {
      remember()
    }
  }

  return (
    <div className={styles.flashStudy} tabIndex={0} onKeyDown={handleKeyboard}>
      <div className={styles.flashProgress}>
        <div>
          <span>จำได้แล้ว {mastered.length} จาก {formulas.length} ใบ</span>
          <span aria-live="polite">เหลือทบทวน {deck.length} ใบ</span>
        </div>
        <progress value={mastered.length} max={formulas.length} aria-label={`จำได้แล้ว ${mastered.length} จาก ${formulas.length} ใบ`} />
      </div>

      {isComplete ? (
        <div className={styles.flashComplete}>
          <CheckCircle2 aria-hidden="true" />
          <h3>จำสูตรและเงื่อนไขครบทั้งบทแล้ว</h3>
          <p>คุณเปิดทบทวนซ้ำ {reviewCount} ครั้ง ลองเริ่มใหม่อีกครั้งโดยสลับลำดับ เพื่อเช็กว่าไม่ได้จำจากตำแหน่งของการ์ด</p>
          <button type="button" onClick={restart}><RefreshCcw aria-hidden="true" /> เริ่มทดสอบใหม่</button>
        </div>
      ) : (
        <>
          <div className={styles.flashToolbar}>
            <span>{topic} · ใบที่ {formulas.length - deck.length + 1}</span>
            <button type="button" onClick={shuffleRemaining}><Shuffle aria-hidden="true" /> สลับลำดับที่เหลือ</button>
          </div>

          <div className={styles.flashCard} data-revealed={revealed}>
            {!revealed ? (
              <div className={styles.flashQuestion}>
                <p>ลองพูดหรือเขียนจากความจำก่อน</p>
                <h3>{card.name}</h3>
                <ul>
                  <li>สูตรหรือข้อความสำคัญเขียนอย่างไร</li>
                  <li>ใช้ได้ภายใต้เงื่อนไขอะไร</li>
                  <li>ข้อสอบมักถามมาในรูปแบบไหน</li>
                </ul>
                <button type="button" onClick={reveal}><Eye aria-hidden="true" /> เปิดเฉลย</button>
              </div>
            ) : (
              <div className={styles.flashAnswer}>
                <p>เฉลย · {card.name}</p>
                <div className={styles.flashExpression}><MathExpression value={card.expression} /></div>
                <dl>
                  <div><dt>ความหมาย</dt><dd><MathText value={card.meaning} /></dd></div>
                  <div><dt>เงื่อนไข</dt><dd><MathText value={card.condition} /></dd></div>
                  <div><dt>ใช้กับโจทย์</dt><dd><MathText value={card.use} /></dd></div>
                  <div><dt>ต้องระวัง</dt><dd><MathText value={card.caution} /></dd></div>
                </dl>
              </div>
            )}
          </div>

          {revealed && <div className={styles.flashActions}>
            <button type="button" onClick={reviewAgain}><RotateCcw aria-hidden="true" /> ยังไม่แม่น — วนมาอีกครั้ง <kbd>1</kbd></button>
            <button type="button" onClick={remember}><CheckCircle2 aria-hidden="true" /> จำได้แล้ว <kbd>2</kbd></button>
          </div>}
          <p className={styles.flashHint}>{revealed ? 'เลือกตามจริง เพื่อให้การ์ดที่ยังไม่แม่นวนกลับมา' : 'กด Space หรือ Enter เพื่อเปิดเฉลย'}</p>
        </>
      )}
    </div>
  )
}
