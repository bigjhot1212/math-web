import type { ReactNode } from 'react'
import styles from './treasure-article.module.css'

type Props = { value: string }

const OPERATOR = /\s*([=≡⇔↔→⟹∧∨+−×÷/≤≥<>∈∉⊂])\s*/g

function formatPlain(value: string) {
  return value
    .replace(OPERATOR, ' $1 ')
    .replace(/([A-Za-z0-9)])~(?=[A-Za-z])/g, '$1 ~ ')
    .replace(/\s+/g, ' ')
}

function readScript(value: string, start: number) {
  const opener = value[start]
  if (opener === '{' || opener === '(') {
    const closer = opener === '{' ? '}' : ')'
    let depth = 1
    let index = start + 1
    while (index < value.length && depth > 0) {
      if (value[index] === opener) depth += 1
      if (value[index] === closer) depth -= 1
      index += 1
    }
    return { content: value.slice(start + 1, depth === 0 ? index - 1 : index), end: index }
  }

  const match = value.slice(start).match(/^[A-Za-z0-9∞]+/)
  const content = match?.[0] ?? opener
  return { content, end: start + content.length }
}

function renderLine(line: string, lineIndex: number) {
  const parts: ReactNode[] = []
  let plain = ''
  let index = 0

  function flush() {
    if (!plain) return
    parts.push(formatPlain(plain))
    plain = ''
  }

  while (index < line.length) {
    const character = line[index]
    if ((character === '_' || character === '^') && index + 1 < line.length) {
      flush()
      const script = readScript(line, index + 1)
      const content = formatPlain(script.content).trim()
      parts.push(character === '_'
        ? <sub key={`${lineIndex}-sub-${index}`}>{content}</sub>
        : <sup key={`${lineIndex}-sup-${index}`}>{content}</sup>)
      index = script.end
      continue
    }
    plain += character
    index += 1
  }
  flush()

  return <span className={styles.mathLine} key={`${lineIndex}-${line}`}>{parts}</span>
}

export default function MathExpression({ value }: Props) {
  const lines = value
    .split(/\s*;\s*|:\s{2,}|\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  return <span className={styles.mathExpression}>{lines.map(renderLine)}</span>
}
