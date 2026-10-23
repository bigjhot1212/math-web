'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import styles from './treasure-article.module.css'

type FormulaTopic = {
  id: string
  number: string
  title: string
  preview: ReactNode
  examFocus?: string
  content: ReactNode
}

type Props = {
  topics: FormulaTopic[]
}

export default function FormulaTopics({ topics }: Props) {
  const [openTopics, setOpenTopics] = useState<string[]>([])
  const allOpen = openTopics.length === topics.length

  function toggleTopic(id: string) {
    setOpenTopics(current => current.includes(id)
      ? current.filter(topicId => topicId !== id)
      : [...current, id])
  }

  return (
    <div className={styles.formulaTopics}>
      <div className={styles.formulaTopicToolbar}>
        <p>
          <strong>{topics.length} หัวข้อย่อย</strong>
          <span>เลือกเปิดเฉพาะเรื่องที่อยากอ่านได้</span>
        </p>
        <div>
          <button
            type="button"
            onClick={() => setOpenTopics(topics.map(topic => topic.id))}
            disabled={allOpen}
          >
            <ChevronsUpDown aria-hidden="true" />
            เปิดทั้งหมด
          </button>
          <button
            type="button"
            onClick={() => setOpenTopics([])}
            disabled={openTopics.length === 0}
          >
            <ChevronsDownUp aria-hidden="true" />
            ย่อทั้งหมด
          </button>
        </div>
      </div>

      <div className={styles.formulaList}>
        {topics.map(topic => {
          const isOpen = openTopics.includes(topic.id)
          const panelId = `${topic.id}-content`
          const triggerId = `${topic.id}-trigger`

          return (
            <section
              className={`${styles.formulaTopic} ${topic.examFocus ? styles.formulaTopicFocus : ''}`}
              id={topic.id}
              key={topic.id}
            >
              <button
                type="button"
                className={styles.formulaTopicSummary}
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleTopic(topic.id)}
              >
                <span className={styles.formulaTopicNumber}>{topic.number}</span>
                <span className={styles.formulaTopicCopy}>
                  <span className={styles.formulaTopicName} role="heading" aria-level={3}>{topic.title}</span>
                  <span className={styles.formulaTopicPreview}>{topic.preview}</span>
                </span>
                {topic.examFocus && <span className={styles.examBadge}>ออกสอบบ่อย</span>}
                <span className={styles.formulaTopicAction}>
                  <span>{isOpen ? 'ย่อเนื้อหา' : 'เปิดอ่าน'}</span>
                  <ChevronDown aria-hidden="true" />
                </span>
              </button>
              <div
                className={styles.formulaTopicPanel}
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!isOpen}
              >
                <div className={styles.formulaTopicContent}>{topic.content}</div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
