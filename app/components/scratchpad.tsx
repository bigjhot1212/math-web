'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  Check,
  Eraser,
  Expand,
  Minimize2,
  PenLine,
  Redo2,
  Trash2,
  Undo2,
  X,
} from 'lucide-react'
import styles from './scratchpad.module.css'

type Tool = 'pen' | 'eraser'

type Point = {
  x: number
  y: number
  pressure: number
}

type Stroke = {
  id: string
  tool: Tool
  color: string
  width: number
  points: Point[]
}

type Props = {
  storageKey: string
  title: string
}

const COLORS = ['#132d66', '#d7463e'] as const
const WIDTHS = [2.5, 4.5, 7] as const
const MAX_STROKES = 250

function isStroke(value: unknown): value is Stroke {
  if (!value || typeof value !== 'object') return false
  const stroke = value as Partial<Stroke>
  return (
    (stroke.tool === 'pen' || stroke.tool === 'eraser') &&
    typeof stroke.color === 'string' &&
    typeof stroke.width === 'number' &&
    Array.isArray(stroke.points)
  )
}

export default function Scratchpad({ storageKey, title }: Props) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [tool, setTool] = useState<Tool>('pen')
  const [color, setColor] = useState<(typeof COLORS)[number]>(COLORS[0])
  const [width, setWidth] = useState<(typeof WIDTHS)[number]>(WIDTHS[1])
  const [penOnly, setPenOnly] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [redoStack, setRedoStack] = useState<Stroke[]>([])
  const [clearArmed, setClearArmed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeStrokeRef = useRef<Stroke | null>(null)
  const storageId = `math-hunters:scratchpad:${storageKey}`

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageId)
      if (saved) {
        const parsed = JSON.parse(saved) as unknown
        // Restoring the student's local drawing is the purpose of this synchronization effect.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed)) setStrokes(parsed.filter(isStroke).slice(-MAX_STROKES))
      }
    } catch {
      // A malformed or unavailable local cache must never interrupt an exam.
    } finally {
      setLoaded(true)
    }
  }, [storageId])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(storageId, JSON.stringify(strokes.slice(-MAX_STROKES)))
    } catch {
      // Drawing still works when private browsing or storage limits block persistence.
    }
  }, [loaded, storageId, strokes])

  useEffect(() => {
    if (!clearArmed) return
    const timeout = window.setTimeout(() => setClearArmed(false), 3000)
    return () => window.clearTimeout(timeout)
  }, [clearArmed])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setFullscreen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  useEffect(() => {
    if (!fullscreen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [fullscreen])

  function closeScratchpad() {
    setOpen(false)
    setFullscreen(false)
  }

  const drawStroke = useCallback((context: CanvasRenderingContext2D, stroke: Stroke, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    if (stroke.points.length === 0 || rect.width === 0 || rect.height === 0) return

    context.save()
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = stroke.color
    context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over'

    if (stroke.points.length === 1) {
      const point = stroke.points[0]
      const radius = (stroke.tool === 'eraser' ? stroke.width * 3 : stroke.width) / 2
      context.beginPath()
      context.arc(point.x * rect.width, point.y * rect.height, radius, 0, Math.PI * 2)
      context.fillStyle = stroke.tool === 'eraser' ? 'rgba(0,0,0,1)' : stroke.color
      context.fill()
      context.restore()
      return
    }

    for (let index = 1; index < stroke.points.length; index += 1) {
      const previous = stroke.points[index - 1]
      const point = stroke.points[index]
      const pressure = Math.max(0.2, (previous.pressure + point.pressure) / 2)
      context.lineWidth = stroke.tool === 'eraser'
        ? stroke.width * 3
        : stroke.width * (0.7 + pressure * 0.55)
      context.beginPath()
      context.moveTo(previous.x * rect.width, previous.y * rect.height)
      context.lineTo(point.x * rect.width, point.y * rect.height)
      context.stroke()
    }
    context.restore()
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const nextWidth = Math.max(1, Math.round(rect.width * dpr))
    const nextHeight = Math.max(1, Math.round(rect.height * dpr))
    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth
      canvas.height = nextHeight
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, rect.width, rect.height)
    strokes.forEach(stroke => drawStroke(context, stroke, canvas))
  }, [drawStroke, strokes])

  useEffect(() => {
    if (!open) return
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(redraw)
    observer.observe(canvas)
    const frame = window.requestAnimationFrame(redraw)
    return () => {
      observer.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [fullscreen, open, redraw])

  function pointFromEvent(event: React.PointerEvent<HTMLCanvasElement>): Point {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
      pressure: event.pointerType === 'mouse' ? 0.5 : Math.max(0.2, event.pressure || 0.5),
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (event.button !== 0 || (penOnly && event.pointerType === 'touch')) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const stroke: Stroke = {
      id: `${Date.now()}-${event.pointerId}`,
      tool,
      color,
      width,
      points: [pointFromEvent(event)],
    }
    activeStrokeRef.current = stroke
    const context = event.currentTarget.getContext('2d')
    if (context) drawStroke(context, stroke, event.currentTarget)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const stroke = activeStrokeRef.current
    if (!stroke || !event.currentTarget.hasPointerCapture(event.pointerId)) return
    event.preventDefault()
    const point = pointFromEvent(event)
    const previous = stroke.points.at(-1)
    if (previous) {
      const rect = event.currentTarget.getBoundingClientRect()
      const distance = Math.hypot((point.x - previous.x) * rect.width, (point.y - previous.y) * rect.height)
      if (distance < 1.2) return
    }
    stroke.points.push(point)
    const context = event.currentTarget.getContext('2d')
    if (context) drawStroke(context, { ...stroke, points: stroke.points.slice(-2) }, event.currentTarget)
  }

  function finishStroke(event: React.PointerEvent<HTMLCanvasElement>) {
    const stroke = activeStrokeRef.current
    if (!stroke) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    activeStrokeRef.current = null
    setStrokes(previous => [...previous, stroke].slice(-MAX_STROKES))
    setRedoStack([])
  }

  function undo() {
    setStrokes(previous => {
      const removed = previous.at(-1)
      if (!removed) return previous
      setRedoStack(items => [...items, removed])
      return previous.slice(0, -1)
    })
  }

  function redo() {
    setRedoStack(previous => {
      const restored = previous.at(-1)
      if (!restored) return previous
      setStrokes(items => [...items, restored].slice(-MAX_STROKES))
      return previous.slice(0, -1)
    })
  }

  function clearAll() {
    if (!clearArmed) {
      setClearArmed(true)
      return
    }
    setStrokes([])
    setRedoStack([])
    setClearArmed(false)
  }

  return (
    <>
      <button
        type="button"
        className={styles.launcher}
        onClick={() => open ? closeScratchpad() : setOpen(true)}
        aria-label={open ? 'ซ่อนกระดาษทด' : 'เปิดกระดาษทด'}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <PenLine aria-hidden="true" />
        <span>{open ? 'ซ่อนกระดาษทด' : 'เปิดกระดาษทด'}</span>
        {strokes.length > 0 && <span className={styles.savedDot} aria-label="มีรอยทดที่บันทึกไว้" />}
      </button>

      {open && (
        <aside
          id={panelId}
          className={`${styles.drawer} ${fullscreen ? styles.fullscreen : ''}`}
          aria-label={title}
        >
          <header className={styles.header}>
            <div>
              <h2>{title}</h2>
              <p>บันทึกเฉพาะบนเครื่องนี้</p>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => setFullscreen(value => !value)}
                aria-label={fullscreen ? 'ย่อกระดาษทด' : 'ขยายกระดาษทดเต็มจอ'}
                title={fullscreen ? 'ย่อ' : 'เต็มจอ'}
              >
                {fullscreen ? <Minimize2 aria-hidden="true" /> : <Expand aria-hidden="true" />}
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={closeScratchpad}
                aria-label="ปิดกระดาษทด"
              >
                <X aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className={styles.toolbar} aria-label="เครื่องมือเขียน">
            <div className={styles.toolGroup}>
              <button
                type="button"
                className={`${styles.toolButton} ${tool === 'pen' ? styles.selected : ''}`}
                onClick={() => setTool('pen')}
                aria-pressed={tool === 'pen'}
              >
                <PenLine aria-hidden="true" />
                ปากกา
              </button>
              <button
                type="button"
                className={`${styles.toolButton} ${tool === 'eraser' ? styles.selected : ''}`}
                onClick={() => setTool('eraser')}
                aria-pressed={tool === 'eraser'}
              >
                <Eraser aria-hidden="true" />
                ยางลบ
              </button>
            </div>

            <div className={styles.toolGroup} aria-label="สีปากกา">
              {COLORS.map(option => (
                <button
                  type="button"
                  key={option}
                  className={`${styles.colorButton} ${color === option ? styles.colorSelected : ''}`}
                  style={{ '--ink-color': option } as React.CSSProperties}
                  onClick={() => { setColor(option); setTool('pen') }}
                  aria-label={option === COLORS[0] ? 'หมึกสีน้ำเงิน' : 'หมึกสีแดง'}
                  aria-pressed={color === option}
                >
                  {color === option && <Check aria-hidden="true" />}
                </button>
              ))}
            </div>

            <div className={styles.toolGroup} aria-label="ขนาดเส้น">
              {WIDTHS.map(option => (
                <button
                  type="button"
                  key={option}
                  className={`${styles.widthButton} ${width === option ? styles.selected : ''}`}
                  onClick={() => setWidth(option)}
                  aria-label={`เส้นขนาด ${option === WIDTHS[0] ? 'เล็ก' : option === WIDTHS[1] ? 'กลาง' : 'ใหญ่'}`}
                  aria-pressed={width === option}
                >
                  <span style={{ width: option + 2, height: option + 2 }} />
                </button>
              ))}
            </div>

            <div className={`${styles.toolGroup} ${styles.historyGroup}`}>
              <button type="button" className={styles.iconButton} onClick={undo} disabled={strokes.length === 0} aria-label="ย้อนกลับ">
                <Undo2 aria-hidden="true" />
              </button>
              <button type="button" className={styles.iconButton} onClick={redo} disabled={redoStack.length === 0} aria-label="ทำซ้ำ">
                <Redo2 aria-hidden="true" />
              </button>
              <button
                type="button"
                className={`${styles.clearButton} ${clearArmed ? styles.clearArmed : ''}`}
                onClick={clearAll}
                disabled={strokes.length === 0}
                aria-label={clearArmed ? 'ยืนยันล้างกระดาษทดทั้งหมด' : 'ล้างกระดาษทดทั้งหมด'}
              >
                <Trash2 aria-hidden="true" />
                <span>{clearArmed ? 'ยืนยันล้าง' : 'ล้าง'}</span>
              </button>
            </div>
          </div>

          <div className={styles.paper}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              style={{ touchAction: penOnly ? 'pan-y' : 'none' }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishStroke}
              onPointerCancel={finishStroke}
              aria-label="พื้นที่เขียนกระดาษทด"
            >
              เบราว์เซอร์นี้ไม่รองรับพื้นที่เขียน
            </canvas>
            {strokes.length === 0 && (
              <div className={styles.emptyHint} aria-hidden="true">
                <PenLine />
                <span>เขียนด้วย Apple Pencil นิ้ว หรือเมาส์ได้เลย</span>
              </div>
            )}
          </div>

          <footer className={styles.footer}>
            <label className={styles.penOnlyToggle}>
              <input type="checkbox" checked={penOnly} onChange={event => setPenOnly(event.target.checked)} />
              <span aria-hidden="true" />
              รับรอยเขียนจากปากกาเท่านั้น
            </label>
            <p>{penOnly ? 'ใช้นิ้วเลื่อนกระดาษได้' : 'รับปากกา นิ้ว และเมาส์'}</p>
          </footer>
        </aside>
      )}
    </>
  )
}
