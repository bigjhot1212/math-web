import type { ReactNode } from 'react'
import katex from 'katex'
import styles from './treasure-article.module.css'

type Props = { value: string; lineLabels?: string[] }
type TextProps = { value: string }

const OPERATOR = /\s*([=≡⇔↔→⟹∧∨+−×÷≤≥<>∈∉⊂])\s*/g
const RELATIONS = new Set(['=', '≡', '⇔', '↔', '→', '⟹'])
const ROOT_DEGREES: Record<string, string> = { '√': '', '∛': '3', '∜': '4' }
const ACCENTED_SYMBOL = /^([A-Z]{2}|[A-Za-z0-9])([⃗̂])/
const SUPERSCRIPT_DIGITS: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
}

function formatPlain(value: string) {
  return value
    .replace(OPERATOR, ' $1 ')
    .replace(/([A-Za-z0-9)])~(?=[A-Za-z])/g, '$1 ~ ')
    .replace(/\s+/g, ' ')
}

function readScript(value: string, start: number) {
  const opener = value[start]
  if (opener === '{' || opener === '(' || opener === '[') {
    const closer = opener === '{' ? '}' : opener === '(' ? ')' : ']'
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

function readRadicand(value: string, start: number) {
  let tokenStart = start
  while (value[tokenStart] === ' ') tokenStart += 1

  if ('([{'.includes(value[tokenStart] ?? '')) {
    return readScript(value, tokenStart)
  }

  let end = tokenStart
  if (value[end] === '−' || value[end] === '-') end += 1

  const number = value.slice(end).match(/^\d+(?:\.\d+)?/)
  if (number) end += number[0].length
  else if (value[end]) end += 1

  while (end < value.length) {
    if ((value[end] === '_' || value[end] === '^') && end + 1 < value.length) {
      end = readScript(value, end + 1).end
      continue
    }
    if (SUPERSCRIPT_DIGITS[value[end]]) {
      end += 1
      continue
    }
    break
  }

  return { content: value.slice(tokenStart, end), end }
}

function toKatex(value: string) {
  let output = ''
  let index = 0

  while (index < value.length) {
    const accented = value.slice(index).match(ACCENTED_SYMBOL)
    if (accented) {
      output += accentLatex(accented[1], accented[2])
      index += accented[0].length
      continue
    }
    const character = value[index]
    const rootDegree = ROOT_DEGREES[character]
    if (rootDegree !== undefined && index + 1 < value.length) {
      const radicand = readRadicand(value, index + 1)
      output += `\\sqrt${rootDegree ? `[${rootDegree}]` : ''}{${toKatex(radicand.content)}}`
      index = radicand.end
      continue
    }

    if (SUPERSCRIPT_DIGITS[character]) {
      let digits = ''
      while (index < value.length && SUPERSCRIPT_DIGITS[value[index]]) {
        digits += SUPERSCRIPT_DIGITS[value[index]]
        index += 1
      }
      output += `^{${digits}}`
      continue
    }

    output += character === '−' ? '-' : character === '×' ? '\\times ' : character === '÷' ? '\\div ' : character
    index += 1
  }

  return output
}

function accentLatex(symbol: string, accent: string) {
  const command = accent === '̂' ? 'hat' : symbol.length > 1 ? 'overrightarrow' : 'vec'
  return `\\${command}{${symbol}}`
}

function renderAccent(symbol: string, accent: string, key: string) {
  const label = accent === '̂' ? `${symbol} หมวก` : `เวกเตอร์ ${symbol}`
  const html = katex.renderToString(accentLatex(symbol, accent), {
    output: 'html', throwOnError: false, strict: 'ignore',
  })

  return <span className={styles.mathAccent} aria-label={label} key={key} dangerouslySetInnerHTML={{ __html: html }} />
}

function renderRadical(radicand: { content: string; end: number }, degree: string, key: string) {
  const latex = `\\sqrt${degree ? `[${degree}]` : ''}{${toKatex(radicand.content)}}`
  const label = degree ? `รากที่ ${degree} ของ ${radicand.content}` : `รากที่สองของ ${radicand.content}`
  const html = katex.renderToString(latex, { output: 'html', throwOnError: false, strict: 'ignore' })

  return (
    <span
      className={styles.radical}
      aria-label={label}
      key={key}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function renderScripts(value: string, keyPrefix: string) {
  const parts: ReactNode[] = []
  let plain = ''
  let index = 0

  function flush() {
    if (!plain) return
    parts.push(formatPlain(plain))
    plain = ''
  }

  while (index < value.length) {
    const accented = value.slice(index).match(ACCENTED_SYMBOL)
    if (accented) {
      flush()
      parts.push(renderAccent(accented[1], accented[2], `${keyPrefix}-accent-${index}`))
      index += accented[0].length
      continue
    }
    const character = value[index]
    if (character === '(') {
      const group = readScript(value, index)
      if (topLevelSlash(group.content) >= 0) {
        flush()
        parts.push(
          <span className={styles.mathGrouped} key={`${keyPrefix}-group-${index}`}>
            <span aria-hidden="true">(</span>
            {renderSegment(group.content, `${keyPrefix}-group-content-${index}`)}
            <span aria-hidden="true">)</span>
          </span>,
        )
        index = group.end
        continue
      }
    }
    let indexedDegree = ''
    let rootIndex = index
    while (rootIndex < value.length && SUPERSCRIPT_DIGITS[value[rootIndex]]) {
      indexedDegree += SUPERSCRIPT_DIGITS[value[rootIndex]]
      rootIndex += 1
    }
    if (indexedDegree && value[rootIndex] === '√' && rootIndex + 1 < value.length) {
      const radicand = readRadicand(value, rootIndex + 1)
      flush()
      parts.push(renderRadical(radicand, indexedDegree, `${keyPrefix}-radical-${index}`))
      index = radicand.end
      continue
    }
    if (ROOT_DEGREES[character] !== undefined && index + 1 < value.length) {
      const radicand = readRadicand(value, index + 1)
      flush()
      parts.push(renderRadical(radicand, ROOT_DEGREES[character], `${keyPrefix}-radical-${index}`))
      index = radicand.end
      continue
    }
    if ((character === '∑' || character === 'Σ') && value[index + 1] === '_') {
      const lower = readScript(value, index + 2)
      let end = lower.end
      let upperContent = ''
      if (value[end] === '^' && end + 1 < value.length) {
        const upper = readScript(value, end + 1)
        upperContent = formatPlain(upper.content).trim()
        end = upper.end
      }
      flush()
      parts.push(
        <span className={styles.summation} aria-label={`ผลรวมตั้งแต่ ${lower.content} ถึง ${upperContent}`} key={`${keyPrefix}-sum-${index}`}>
          <span className={styles.summationUpper} aria-hidden="true">{upperContent}</span>
          <span className={styles.summationSymbol} aria-hidden="true">∑</span>
          <span className={styles.summationLower} aria-hidden="true">{formatPlain(lower.content).trim()}</span>
        </span>,
      )
      index = end
      continue
    }
    if ((character === '_' || character === '^') && index + 1 < value.length) {
      flush()
      const script = readScript(value, index + 1)
      const content = formatPlain(script.content).trim()
      parts.push(character === '_'
        ? <sub key={`${keyPrefix}-sub-${index}`}>{content}</sub>
        : <sup key={`${keyPrefix}-sup-${index}`}>{content}</sup>)
      index = script.end
      continue
    }
    plain += character
    index += 1
  }
  flush()
  return parts
}

export function MathText({ value }: TextProps) {
  // Keep one inline box when this text is used in a grid-based list item.
  return <span>{renderScripts(value, 'math-text')}</span>
}

function splitRelations(value: string) {
  const parts: string[] = []
  let depth = 0
  let start = 0

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if ('([{'.includes(character)) depth += 1
    if (')]}'.includes(character)) depth = Math.max(0, depth - 1)
    if (depth === 0 && RELATIONS.has(character)) {
      parts.push(value.slice(start, index).trim(), character)
      start = index + 1
    }
  }
  parts.push(value.slice(start).trim())
  return parts.filter(Boolean)
}

function topLevelSlash(value: string) {
  let depth = 0
  let slash = -1
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]
    if ('([{'.includes(character)) depth += 1
    if (')]}'.includes(character)) depth = Math.max(0, depth - 1)
    if (character === '/' && depth === 0) {
      if (slash >= 0) return -1
      slash = index
    }
  }
  return slash
}

function splitDenominator(value: string) {
  const trimmed = value.trim()
  if (!trimmed || !'([{'.includes(trimmed[0])) return { denominator: trimmed, suffix: '' }

  const opener = trimmed[0]
  const closer = opener === '(' ? ')' : opener === '[' ? ']' : '}'
  let depth = 0
  let index = 0

  for (; index < trimmed.length; index += 1) {
    if (trimmed[index] === opener) depth += 1
    if (trimmed[index] === closer) {
      depth -= 1
      if (depth === 0) {
        index += 1
        break
      }
    }
  }

  while (index < trimmed.length && /[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(trimmed[index])) index += 1
  if (trimmed[index] === '^') index = readScript(trimmed, index + 1).end

  return {
    denominator: trimmed.slice(0, index).trim(),
    suffix: trimmed.slice(index).trim(),
  }
}

function renderSegment(segment: string, keyPrefix: string) {
  const slash = topLevelSlash(segment)
  if (slash < 0) return renderScripts(segment, keyPrefix)

  let numerator = segment.slice(0, slash).trim()
  const { denominator, suffix } = splitDenominator(segment.slice(slash + 1))
  let prefix = ''

  const limit = numerator.match(/^(lim_(?:\{[^}]+\}|[^\s]+))(\s*\[.*\])$/)
  if (limit) {
    prefix = limit[1]
    numerator = limit[2].trim()
  } else if (/[ก-๙]/.test(numerator)) {
    const boundary = numerator.lastIndexOf(' ')
    if (boundary > 0) {
      prefix = numerator.slice(0, boundary + 1)
      numerator = numerator.slice(boundary + 1)
    }
  }

  return [
    ...renderScripts(prefix, `${keyPrefix}-prefix`),
    <span className={styles.fraction} aria-label={`${numerator} หารด้วย ${denominator}`} key={`${keyPrefix}-fraction`}>
      <span aria-hidden="true">{renderScripts(numerator, `${keyPrefix}-numerator`)}</span>
      <span aria-hidden="true">{renderScripts(denominator, `${keyPrefix}-denominator`)}</span>
    </span>,
    ...(suffix ? renderScripts(` ${suffix}`, `${keyPrefix}-suffix`) : []),
  ]
}

function renderCompactLine(line: string, lineIndex: number) {
  const parts = splitRelations(line).map((part, partIndex) => (
    RELATIONS.has(part)
      ? <span className={styles.mathRelation} key={`${lineIndex}-relation-${partIndex}`}>{part}</span>
      : <span key={`${lineIndex}-segment-${partIndex}`}>{renderSegment(part, `${lineIndex}-${partIndex}`)}</span>
  ))

  return <span className={styles.mathLineCompact} key={`${lineIndex}-${line}`}>{parts}</span>
}

function renderRelationTail(parts: string[], lineIndex: number) {
  return parts.flatMap((part, partIndex) => (
    RELATIONS.has(part)
      ? <span className={styles.mathRelationInline} key={`${lineIndex}-tail-relation-${partIndex}`}>{part}</span>
      : renderSegment(part, `${lineIndex}-tail-${partIndex}`)
  ))
}

function renderLine(line: string, lineIndex: number, label?: string) {
  const parts = splitRelations(line)
  const relationIndex = parts.findIndex((part) => RELATIONS.has(part))
  const hasRelation = relationIndex > 0 && relationIndex < parts.length - 1

  return (
    <span className={styles.mathLine} key={`${lineIndex}-${line}`}>
      <span className={styles.mathLineMeta}>{label ?? `รูปแบบที่ ${lineIndex + 1}`}</span>
      {hasRelation ? (
        <span className={styles.mathEquation}>
          <span className={styles.mathLhs}>{renderSegment(parts[0], `${lineIndex}-lhs`)}</span>
          <span className={styles.mathRelation}>{parts[relationIndex]}</span>
          <span className={styles.mathRhs}>{renderRelationTail(parts.slice(relationIndex + 1), lineIndex)}</span>
        </span>
      ) : (
        <span className={styles.mathStandalone}>{renderSegment(line, `${lineIndex}-standalone`)}</span>
      )}
    </span>
  )
}

export default function MathExpression({ value, lineLabels }: Props) {
  const lines = value
    .split(/\s*;\s*|:\s{2,}|\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <span className={styles.mathExpression} data-layout={lines.length === 1 ? 'single' : 'multiple'}>
      {lineLabels
        ? lines.map((line, index) => renderLine(line, index, lineLabels[index]))
        : lines.map(renderCompactLine)}
    </span>
  )
}
