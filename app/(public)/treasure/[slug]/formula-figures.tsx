import type { ReactNode } from 'react'
import styles from './treasure-article.module.css'

// Diagrams that sit under a formula box. Every curve is computed from its equation
// so the picture matches the formula exactly.

type Point = [number, number]
type View = { minX: number; maxX: number; minY: number; maxY: number }

const WIDTH = 480

function makePlane(view: View) {
  const scale = WIDTH / (view.maxX - view.minX)
  const height = (view.maxY - view.minY) * scale
  const x = (value: number) => (value - view.minX) * scale
  const y = (value: number) => (view.maxY - value) * scale
  const at = ([px, py]: Point) => `${x(px).toFixed(1)},${y(py).toFixed(1)}`
  return { view, height, x, y, at }
}
type Plane = ReturnType<typeof makePlane>

function graph(plane: Plane, fn: (x: number) => number, from: number, to: number, steps = 80) {
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const px = from + ((to - from) * i) / steps
    return plane.at([px, fn(px)])
  })
  return `M${points.join('L')}`
}

function parametric(plane: Plane, fx: (t: number) => number, fy: (t: number) => number, from: number, to: number, steps = 120) {
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const t = from + ((to - from) * i) / steps
    return plane.at([fx(t), fy(t)])
  })
  return `M${points.join('L')}`
}

function Axes({ plane }: { plane: Plane }) {
  const { view, x, y } = plane
  return (
    <g className={styles.figAxis}>
      <line x1={x(view.minX)} y1={y(0)} x2={x(view.maxX)} y2={y(0)} />
      <line x1={x(0)} y1={y(view.minY)} x2={x(0)} y2={y(view.maxY)} />
      <text className={styles.figAxisLabel} x={x(view.maxX) - 14} y={y(0) - 8}>x</text>
      <text className={styles.figAxisLabel} x={x(0) + 8} y={y(view.maxY) + 16}>y</text>
      <text className={styles.figAxisLabel} x={x(0) - 16} y={y(0) + 18}>O</text>
    </g>
  )
}

function Segment({ plane, from, to, className }: { plane: Plane; from: Point; to: Point; className: string }) {
  return <line className={className} x1={plane.x(from[0])} y1={plane.y(from[1])} x2={plane.x(to[0])} y2={plane.y(to[1])} />
}

function Dot({ plane, at, className = styles.figDot }: { plane: Plane; at: Point; className?: string }) {
  return <circle className={className} cx={plane.x(at[0])} cy={plane.y(at[1])} r={4.5} />
}

// Text placed at a math point, nudged by (dx, dy) screen pixels.
function Label({ plane, at, dx = 0, dy = 0, anchor = 'middle', className = styles.figLabel, children }: {
  plane: Plane; at: Point; dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end'; className?: string; children: ReactNode
}) {
  return <text className={className} x={plane.x(at[0]) + dx} y={plane.y(at[1]) + dy} textAnchor={anchor}>{children}</text>
}

// Small square marking a right angle at `corner`, between unit directions u and v.
function RightAngle({ plane, corner, u, v, size = 0.28 }: { plane: Plane; corner: Point; u: Point; v: Point; size?: number }) {
  const a: Point = [corner[0] + u[0] * size, corner[1] + u[1] * size]
  const b: Point = [a[0] + v[0] * size, a[1] + v[1] * size]
  const c: Point = [corner[0] + v[0] * size, corner[1] + v[1] * size]
  return <path className={styles.figMark} d={`M${plane.at(a)}L${plane.at(b)}L${plane.at(c)}`} />
}

function Figure({ plane, label, children }: { plane: Plane; label: string; children: ReactNode }) {
  return (
    <svg className={styles.figSvg} viewBox={`0 0 ${WIDTH} ${plane.height.toFixed(0)}`} role="img" aria-label={label}>
      {children}
    </svg>
  )
}

function unit([dx, dy]: Point): Point {
  const length = Math.hypot(dx, dy)
  return [dx / length, dy / length]
}

function distanceFigure() {
  const p = makePlane({ minX: -0.7, maxX: 6.6, minY: -0.6, maxY: 5 })
  const a: Point = [1, 1]
  const b: Point = [5, 4]
  const corner: Point = [5, 1]
  return (
    <Figure plane={p} label="สามเหลี่ยมมุมฉากที่มีด้านตรงข้ามมุมฉากเป็นระยะ d ระหว่างสองจุด">
      <Axes plane={p} />
      <Segment plane={p} from={a} to={corner} className={styles.figGuide} />
      <Segment plane={p} from={corner} to={b} className={styles.figGuide} />
      <RightAngle plane={p} corner={corner} u={[-1, 0]} v={[0, 1]} />
      <Segment plane={p} from={a} to={b} className={styles.figMain} />
      <Dot plane={p} at={a} />
      <Dot plane={p} at={b} />
      <Label plane={p} at={a} dx={-10} dy={22} anchor="end">(x₁, y₁)</Label>
      <Label plane={p} at={b} dx={-12} dy={-12} anchor="end">(x₂, y₂)</Label>
      <Label plane={p} at={[3, 1]} dy={24} className={styles.figGuideLabel}>x₂ − x₁</Label>
      <Label plane={p} at={[5, 2.5]} dx={12} anchor="start" className={styles.figGuideLabel}>y₂ − y₁</Label>
      <Label plane={p} at={[3, 2.5]} dx={-14} dy={-8} anchor="end" className={styles.figMainLabel}>d</Label>
    </Figure>
  )
}

function slopeFigure() {
  const p = makePlane({ minX: -0.7, maxX: 8.2, minY: -0.6, maxY: 4.8 })
  const line = (x: number) => 0.5 * x + 0.5
  const a: Point = [1, line(1)]
  const b: Point = [5, line(5)]
  const corner: Point = [5, a[1]]
  return (
    <Figure plane={p} label="เส้นตรงที่มีระยะขึ้นและระยะไประหว่างสองจุด">
      <Axes plane={p} />
      <path className={styles.figMain} d={graph(p, line, -0.4, 6.8)} />
      <Segment plane={p} from={a} to={corner} className={styles.figGuide} />
      <Segment plane={p} from={corner} to={b} className={styles.figAccent} />
      <RightAngle plane={p} corner={corner} u={[-1, 0]} v={[0, 1]} />
      <Dot plane={p} at={a} />
      <Dot plane={p} at={b} />
      <Label plane={p} at={a} dx={-6} dy={-14} anchor="end">(x₁, y₁)</Label>
      <Label plane={p} at={b} dx={-10} dy={-14} anchor="end">(x₂, y₂)</Label>
      <Label plane={p} at={[3, a[1]]} dy={24} className={styles.figGuideLabel}>ระยะไป x₂ − x₁</Label>
      <Label plane={p} at={[5, (a[1] + b[1]) / 2]} dx={16} dy={5} anchor="start" className={styles.figAccentLabel}>ระยะขึ้น y₂ − y₁</Label>
    </Figure>
  )
}

function lineFigure() {
  const p = makePlane({ minX: -0.8, maxX: 7, minY: -0.8, maxY: 5 })
  const point: Point = [2, 2]
  const main = (x: number) => 0.5 * x + 1
  const parallel = (x: number) => 0.5 * x - 0.5
  const perpendicular = (x: number) => -2 * x + 6
  return (
    <Figure plane={p} label="เส้นตรงผ่านจุดหนึ่ง พร้อมเส้นที่ขนานและเส้นที่ตั้งฉาก">
      <Axes plane={p} />
      <path className={styles.figGuide} d={graph(p, parallel, 0.4, 6.8)} />
      <path className={styles.figAccent} d={graph(p, perpendicular, 0.6, 3.3)} />
      <path className={styles.figMain} d={graph(p, main, -0.4, 6.8)} />
      <RightAngle plane={p} corner={point} u={unit([2, 1])} v={unit([-1, 2])} />
      <Dot plane={p} at={point} />
      <Label plane={p} at={point} dx={-18} dy={-4} anchor="end">(x₁, y₁)</Label>
      <Label plane={p} at={[6.6, main(6.6)]} dy={-12} anchor="end" className={styles.figMainLabel}>ความชัน m</Label>
      <Label plane={p} at={[3.4, parallel(3.4)]} dx={6} dy={26} anchor="start" className={styles.figGuideLabel}>ขนาน: m เท่ากัน</Label>
      <Label plane={p} at={[1.25, perpendicular(1.25)]} dx={20} anchor="start" className={styles.figAccentLabel}>ตั้งฉาก: m₁m₂ = −1</Label>
    </Figure>
  )
}

function pointLineFigure() {
  const p = makePlane({ minX: -0.7, maxX: 7, minY: -0.6, maxY: 5 })
  const line = (x: number) => 0.5 * x + 0.5
  const point: Point = [2, 4]
  const base: Point = [0, line(0)]
  const direction = unit([2, 1])
  const along = (point[0] - base[0]) * direction[0] + (point[1] - base[1]) * direction[1]
  const foot: Point = [base[0] + along * direction[0], base[1] + along * direction[1]]
  return (
    <Figure plane={p} label="ระยะจากจุดถึงเส้นตรงวัดตามแนวตั้งฉาก">
      <Axes plane={p} />
      <path className={styles.figMain} d={graph(p, line, -0.4, 6.8)} />
      <Segment plane={p} from={point} to={foot} className={styles.figAccent} />
      <RightAngle plane={p} corner={foot} u={direction} v={unit([point[0] - foot[0], point[1] - foot[1]])} />
      <Dot plane={p} at={point} />
      <Label plane={p} at={point} dx={12} dy={-6} anchor="start">(x₀, y₀)</Label>
      <Label plane={p} at={[(point[0] + foot[0]) / 2, (point[1] + foot[1]) / 2]} dx={12} anchor="start" className={styles.figAccentLabel}>d</Label>
      <Label plane={p} at={[6.6, line(6.6)]} dy={-12} anchor="end" className={styles.figMainLabel}>Ax + By + C = 0</Label>
    </Figure>
  )
}

function circleFigure() {
  const p = makePlane({ minX: -0.8, maxX: 7, minY: -0.6, maxY: 5.2 })
  const center: Point = [3, 2.4]
  const r = 2
  const angle = (40 * Math.PI) / 180
  const onCircle: Point = [center[0] + r * Math.cos(angle), center[1] + r * Math.sin(angle)]
  const radial = unit([onCircle[0] - center[0], onCircle[1] - center[1]])
  const tangent: Point = [-radial[1], radial[0]]
  const tangentFrom: Point = [onCircle[0] - 1.6 * tangent[0], onCircle[1] - 1.6 * tangent[1]]
  const tangentTo: Point = [onCircle[0] + 1.6 * tangent[0], onCircle[1] + 1.6 * tangent[1]]
  return (
    <Figure plane={p} label="วงกลมศูนย์กลาง (h, k) รัศมี r และเส้นสัมผัสที่ตั้งฉากกับรัศมี">
      <Axes plane={p} />
      <path className={styles.figMain} d={parametric(p, (t) => center[0] + r * Math.cos(t), (t) => center[1] + r * Math.sin(t), 0, 2 * Math.PI)} />
      <Segment plane={p} from={tangentFrom} to={tangentTo} className={styles.figGuide} />
      <Segment plane={p} from={center} to={onCircle} className={styles.figAccent} />
      <RightAngle plane={p} corner={onCircle} u={[-radial[0], -radial[1]]} v={tangent} />
      <Dot plane={p} at={center} />
      <Dot plane={p} at={onCircle} />
      <Label plane={p} at={center} dy={24}>(h, k)</Label>
      <Label plane={p} at={onCircle} dx={16} dy={-4} anchor="start">(x, y)</Label>
      <Label plane={p} at={[(center[0] + onCircle[0]) / 2, (center[1] + onCircle[1]) / 2]} dx={-4} dy={-10} anchor="end" className={styles.figAccentLabel}>r</Label>
      <Label plane={p} at={tangentFrom} dx={8} dy={4} anchor="start" className={styles.figGuideLabel}>เส้นสัมผัส</Label>
    </Figure>
  )
}

function parabolaFigure() {
  const p = makePlane({ minX: -2.7, maxX: 8, minY: -0.6, maxY: 5.4 })
  const h = 2.5
  const k = 1.5
  const focalLength = 1
  const curve = (x: number) => k + ((x - h) ** 2) / (4 * focalLength)
  const vertex: Point = [h, k]
  const focus: Point = [h, k + focalLength]
  const directrixY = k - focalLength
  const point: Point = [5.5, curve(5.5)]
  const onDirectrix: Point = [point[0], directrixY]
  return (
    <Figure plane={p} label="พาราโบลา จุดบนกราฟอยู่ห่างจากโฟกัสเท่ากับห่างจากไดเรกตริกซ์">
      <Axes plane={p} />
      <Segment plane={p} from={[p.view.minX + 0.2, directrixY]} to={[p.view.maxX - 0.2, directrixY]} className={styles.figGuide} />
      <path className={styles.figMain} d={graph(p, curve, -1.1, 6.1)} />
      <Segment plane={p} from={point} to={focus} className={styles.figAccent} />
      <Segment plane={p} from={point} to={onDirectrix} className={styles.figAccent} />
      <Dot plane={p} at={vertex} />
      <Dot plane={p} at={focus} className={styles.figFocus} />
      <Dot plane={p} at={point} />
      <Label plane={p} at={vertex} dx={-12} dy={18} anchor="end">จุดยอด (h, k)</Label>
      <Label plane={p} at={focus} dx={-12} dy={-6} anchor="end" className={styles.figAccentLabel}>โฟกัส</Label>
      <Label plane={p} at={[h, k + focalLength / 2]} dx={12} dy={5} anchor="start" className={styles.figGuideLabel}>p</Label>
      <Label plane={p} at={[h, k - focalLength / 2]} dx={12} dy={5} anchor="start" className={styles.figGuideLabel}>p</Label>
      <Label plane={p} at={[-2.6, directrixY]} dy={19} anchor="start" className={styles.figGuideLabel}>ไดเรกตริกซ์</Label>
      <Label plane={p} at={point} dx={12} dy={-4} anchor="start">P</Label>
      <Label plane={p} at={[point[0], (point[1] + directrixY) / 2]} dx={10} anchor="start" className={styles.figAccentLabel}>ระยะเท่ากัน</Label>
    </Figure>
  )
}

function ellipseFigure() {
  const p = makePlane({ minX: -5.2, maxX: 5.2, minY: -3.3, maxY: 3.3 })
  const a = 4
  const b = 2.4
  const c = Math.sqrt(a * a - b * b)
  const leftFocus: Point = [-c, 0]
  const rightFocus: Point = [c, 0]
  const t = (-125 * Math.PI) / 180
  const point: Point = [a * Math.cos(t), b * Math.sin(t)]
  return (
    <Figure plane={p} label="วงรี โฟกัสสองจุด และสามเหลี่ยมมุมฉากที่มีด้าน b, c และ a">
      <Axes plane={p} />
      <path className={styles.figMain} d={parametric(p, (s) => a * Math.cos(s), (s) => b * Math.sin(s), 0, 2 * Math.PI)} />
      <Segment plane={p} from={point} to={leftFocus} className={styles.figAccent} />
      <Segment plane={p} from={point} to={rightFocus} className={styles.figAccent} />
      <Segment plane={p} from={[0, 0]} to={[0, b]} className={styles.figGuide} />
      <Segment plane={p} from={[0, 0]} to={rightFocus} className={styles.figGuide} />
      <Segment plane={p} from={[0, b]} to={rightFocus} className={styles.figGuide} />
      <RightAngle plane={p} corner={[0, 0]} u={[1, 0]} v={[0, 1]} size={0.3} />
      <Dot plane={p} at={leftFocus} className={styles.figFocus} />
      <Dot plane={p} at={rightFocus} className={styles.figFocus} />
      <Dot plane={p} at={point} />
      <Label plane={p} at={[0, b / 2]} dx={-8} dy={5} anchor="end" className={styles.figGuideLabel}>b</Label>
      <Label plane={p} at={[c / 2, 0]} dy={22} className={styles.figGuideLabel}>c</Label>
      <Label plane={p} at={[c / 2, b / 2]} dx={8} dy={-6} anchor="start" className={styles.figGuideLabel}>a</Label>
      <Label plane={p} at={leftFocus} dy={-12} className={styles.figAccentLabel}>F₁</Label>
      <Label plane={p} at={rightFocus} dx={8} dy={22} anchor="start" className={styles.figAccentLabel}>F₂</Label>
      <Label plane={p} at={[a, 0]} dx={8} dy={-8} anchor="start" className={styles.figMainLabel}>a</Label>
      <Label plane={p} at={point} dx={-10} dy={20} anchor="end">P</Label>
      <Label plane={p} at={[0.3, -2.9]} anchor="start" className={styles.figAccentLabel}>PF₁ + PF₂ = 2a</Label>
    </Figure>
  )
}

function hyperbolaFigure() {
  const p = makePlane({ minX: -5.6, maxX: 5.6, minY: -4.9, maxY: 4 })
  const a = 2
  const b = 2.2
  const c = Math.sqrt(a * a + b * b)
  const slope = b / a
  const leftFocus: Point = [-c, 0]
  const rightFocus: Point = [c, 0]
  const t = 0.9
  const point: Point = [a * Math.cosh(t), b * Math.sinh(t)]
  const branch = (sign: number) => parametric(p, (s) => sign * a * Math.cosh(s), (s) => b * Math.sinh(s), -1.32, 1.32)
  return (
    <Figure plane={p} label="ไฮเพอร์โบลา โฟกัสสองจุด กรอบ 2a คูณ 2b และเส้นกำกับ">
      <Axes plane={p} />
      <path className={styles.figGuide} d={`M${p.at([-a, -b])}L${p.at([a, -b])}L${p.at([a, b])}L${p.at([-a, b])}Z`} />
      <path className={styles.figAsymptote} d={graph(p, (x) => slope * x, -3.55, 3.55, 2)} />
      <path className={styles.figAsymptote} d={graph(p, (x) => -slope * x, -3.55, 3.55, 2)} />
      <path className={styles.figMain} d={branch(1)} />
      <path className={styles.figMain} d={branch(-1)} />
      <Segment plane={p} from={point} to={leftFocus} className={styles.figAccent} />
      <Segment plane={p} from={point} to={rightFocus} className={styles.figAccent} />
      <Dot plane={p} at={[-a, 0]} />
      <Dot plane={p} at={[a, 0]} />
      <Dot plane={p} at={leftFocus} className={styles.figFocus} />
      <Dot plane={p} at={rightFocus} className={styles.figFocus} />
      <Dot plane={p} at={point} />
      <Label plane={p} at={[a / 2, -b]} dy={20} className={styles.figGuideLabel}>a</Label>
      <Label plane={p} at={[a, -b / 2]} dx={-8} dy={5} anchor="end" className={styles.figGuideLabel}>b</Label>
      <Label plane={p} at={leftFocus} dy={22} className={styles.figAccentLabel}>F₁</Label>
      <Label plane={p} at={rightFocus} dy={22} className={styles.figAccentLabel}>F₂</Label>
      <Label plane={p} at={point} dx={10} dy={-6} anchor="start">P</Label>
      <Label plane={p} at={[3.55, slope * 3.55]} dx={-8} dy={4} anchor="end" className={styles.figAsymptoteLabel}>เส้นกำกับ</Label>
      <Label plane={p} at={[5.5, -4.55]} anchor="end" className={styles.figAccentLabel}>|PF₁ − PF₂| = 2a</Label>
    </Figure>
  )
}

function limitMeaningFigure() {
  const p = makePlane({ minX: -3.8, maxX: 4.4, minY: -0.4, maxY: 5 })
  const curve = (x: number) => 0.18 * (x - 1) ** 2 + 1.4
  const a = 1
  const limit = curve(a)
  return (
    <Figure plane={p} label="กราฟเข้าใกล้จุดรูโหว่จากทั้งซ้ายและขวา แม้ค่าฟังก์ชันที่จุดนั้นอยู่คนละตำแหน่ง">
      <Axes plane={p} />
      <path className={styles.figMain} d={graph(p, curve, -3.2, 0.9, 70)} />
      <path className={styles.figMain} d={graph(p, curve, 1.1, 4, 70)} />
      <Segment plane={p} from={[a, 0]} to={[a, 4]} className={styles.figGuide} />
      <circle className={styles.figOpenDot} cx={p.x(a)} cy={p.y(limit)} r={6} />
      <Dot plane={p} at={[a, 3.75]} className={styles.figFocus} />
      <Label plane={p} at={[a, limit]} dx={14} dy={5} anchor="start" className={styles.figMainLabel}>L</Label>
      <Label plane={p} at={[a, 3.75]} dx={14} dy={5} anchor="start" className={styles.figAccentLabel}>f(a)</Label>
      <Label plane={p} at={[a, 0]} dy={20}>a</Label>
      <path className={styles.figMotion} d={`M${p.at([-0.9, curve(-0.9)])}L${p.at([0.35, curve(0.35)])}`} />
      <path className={styles.figMotion} d={`M${p.at([2.9, curve(2.9)])}L${p.at([1.65, curve(1.65)])}`} />
    </Figure>
  )
}

function oneSidedLimitFigure() {
  const p = makePlane({ minX: -4, maxX: 4.4, minY: -0.4, maxY: 4.8 })
  const left = (x: number) => 1.5 + 0.12 * x
  const right = (x: number) => 3.3 + 0.12 * x
  return (
    <Figure plane={p} label="กราฟกระโดดที่ลิมิตซ้ายและลิมิตขวาเข้าใกล้คนละระดับ">
      <Axes plane={p} />
      <path className={styles.figMain} d={graph(p, left, -3.5, -0.08, 45)} />
      <path className={styles.figAccent} d={graph(p, right, 0.08, 3.8, 45)} />
      <Segment plane={p} from={[0, 0]} to={[0, 4.15]} className={styles.figGuide} />
      <circle className={styles.figOpenDot} cx={p.x(0)} cy={p.y(left(0))} r={6} />
      <circle className={styles.figOpenDotAccent} cx={p.x(0)} cy={p.y(right(0))} r={6} />
      <Label plane={p} at={[-0.15, left(0)]} dx={-12} dy={5} anchor="end" className={styles.figMainLabel}>L₋</Label>
      <Label plane={p} at={[0.15, right(0)]} dx={12} dy={5} anchor="start" className={styles.figAccentLabel}>L₊</Label>
      <Label plane={p} at={[0, 0]} dy={20}>a</Label>
      <Label plane={p} at={[-2.5, left(-2.5)]} dy={-14} className={styles.figGuideLabel}>เข้าใกล้จากซ้าย</Label>
      <Label plane={p} at={[2.4, right(2.4)]} dy={-14} className={styles.figGuideLabel}>เข้าใกล้จากขวา</Label>
    </Figure>
  )
}

function continuityFigure() {
  const p = makePlane({ minX: -3.6, maxX: 4.2, minY: -0.4, maxY: 4.8 })
  const curve = (x: number) => 0.055 * (x - 0.6) ** 3 + 2.2
  const a = 0.6
  const value = curve(a)
  return (
    <Figure plane={p} label="กราฟต่อเนื่องผ่านจุดที่ลิมิตจากซ้าย ลิมิตจากขวา และค่าฟังก์ชันเท่ากัน">
      <Axes plane={p} />
      <path className={styles.figMain} d={graph(p, curve, -3.1, 3.8)} />
      <Segment plane={p} from={[a, 0]} to={[a, value]} className={styles.figGuide} />
      <Segment plane={p} from={[0, value]} to={[a, value]} className={styles.figGuide} />
      <Dot plane={p} at={[a, value]} className={styles.figFocus} />
      <Label plane={p} at={[a, value]} dx={14} dy={-10} anchor="start" className={styles.figAccentLabel}>f(a) = L</Label>
      <Label plane={p} at={[a, 0]} dy={20}>a</Label>
      <Label plane={p} at={[0, value]} dx={-10} dy={5} anchor="end">L</Label>
    </Figure>
  )
}

function derivativeDefinitionFigure() {
  const p = makePlane({ minX: -1.1, maxX: 6.3, minY: -0.5, maxY: 5.3 })
  const curve = (x: number) => 0.14 * (x - 0.5) ** 2 + 0.65
  const a = 1.2
  const b = 4.5
  const pa: Point = [a, curve(a)]
  const pb: Point = [b, curve(b)]
  const secantSlope = (pb[1] - pa[1]) / (b - a)
  const tangentSlope = 0.28 * (a - 0.5)
  const secant = (x: number) => pa[1] + secantSlope * (x - a)
  const tangent = (x: number) => pa[1] + tangentSlope * (x - a)
  return (
    <Figure plane={p} label="เส้นตัดผ่านสองจุดบนกราฟเคลื่อนเข้าใกล้เส้นสัมผัสเมื่อระยะ h ลดลงสู่ศูนย์">
      <Axes plane={p} />
      <path className={styles.figMain} d={graph(p, curve, -0.6, 5.8)} />
      <path className={styles.figGuide} d={graph(p, secant, -0.3, 5.9, 2)} />
      <path className={styles.figAccent} d={graph(p, tangent, -0.3, 5.9, 2)} />
      <Dot plane={p} at={pa} />
      <Dot plane={p} at={pb} className={styles.figFocus} />
      <Segment plane={p} from={[a, pa[1] - 0.22]} to={[b, pa[1] - 0.22]} className={styles.figMark} />
      <Label plane={p} at={pa} dx={-10} dy={-12} anchor="end">(a, f(a))</Label>
      <Label plane={p} at={pb} dx={10} dy={-12} anchor="start">(a+h, f(a+h))</Label>
      <Label plane={p} at={[(a + b) / 2, pa[1] - 0.22]} dy={20} className={styles.figGuideLabel}>h → 0</Label>
      <Label plane={p} at={[5.6, tangent(5.6)]} dy={-12} anchor="end" className={styles.figAccentLabel}>เส้นสัมผัส</Label>
      <Label plane={p} at={[4.75, secant(4.75)]} dx={8} dy={18} anchor="start" className={styles.figGuideLabel}>เส้นตัด</Label>
    </Figure>
  )
}

function linearityFigure() {
  const p = makePlane({ minX: -0.8, maxX: 6.8, minY: -0.5, maxY: 6.2 })
  const f = (x: number) => 0.34 * x + 0.7
  const g = (x: number) => 0.09 * (x - 1.2) ** 2 + 0.45
  const sum = (x: number) => f(x) + g(x)
  const sampleX = 3.5
  return (
    <Figure plane={p} label="กราฟ f กราฟ g และกราฟผลบวก f บวก g ที่อัตราการเปลี่ยนแปลงรวมกัน">
      <Axes plane={p} />
      <path className={styles.figGuide} d={graph(p, f, 0, 6.2)} />
      <path className={styles.figAccent} d={graph(p, g, 0, 6.2)} />
      <path className={styles.figMain} d={graph(p, sum, 0, 6.2)} />
      <Segment plane={p} from={[sampleX, g(sampleX)]} to={[sampleX, sum(sampleX)]} className={styles.figMeasure} />
      <Label plane={p} at={[6, f(6)]} dx={-6} dy={-12} anchor="end" className={styles.figGuideLabel}>f</Label>
      <Label plane={p} at={[6, g(6)]} dx={-6} dy={20} anchor="end" className={styles.figAccentLabel}>g</Label>
      <Label plane={p} at={[5.7, sum(5.7)]} dx={-6} dy={-12} anchor="end" className={styles.figMainLabel}>f + g</Label>
      <Label plane={p} at={[sampleX, (g(sampleX) + sum(sampleX)) / 2]} dx={12} dy={4} anchor="start" className={styles.figGuideLabel}>รวมความสูง</Label>
      <Label plane={p} at={[2.7, 5.7]} className={styles.figMainLabel}>(f + g)′ = f′ + g′</Label>
    </Figure>
  )
}

function combinedRulesFigure() {
  return (
    <svg className={styles.figSvg} viewBox="0 0 480 286" role="img" aria-label="ภาพโครงสร้างกฎผลคูณ กฎผลหาร และกฎลูกโซ่">
      <rect className={styles.figBox} x="30" y="24" width="124" height="82" rx="10" />
      <rect className={styles.figArea} x="30" y="24" width="92" height="58" rx="4" />
      <path className={styles.figAccent} d="M30 82H154M122 24V106" />
      <text className={styles.figMainLabel} x="92" y="128" textAnchor="middle">ผลคูณ: พื้นที่ uv</text>
      <text className={styles.figGuideLabel} x="75" y="68" textAnchor="middle">uv</text>
      <text className={styles.figAccentLabel} x="138" y="68" textAnchor="middle">u′v</text>
      <text className={styles.figAccentLabel} x="75" y="98" textAnchor="middle">uv′</text>

      <rect className={styles.figBox} x="184" y="24" width="110" height="82" rx="10" />
      <line className={styles.figMain} x1="201" y1="65" x2="277" y2="65" />
      <text className={styles.figMainLabel} x="239" y="53" textAnchor="middle">u</text>
      <text className={styles.figAccentLabel} x="239" y="88" textAnchor="middle">v ≠ 0</text>
      <text className={styles.figMainLabel} x="239" y="128" textAnchor="middle">ผลหาร: บน ÷ ล่าง</text>

      <rect className={styles.figBox} x="325" y="24" width="124" height="82" rx="10" />
      <rect className={styles.figSoftFill} x="339" y="38" width="96" height="54" rx="9" />
      <rect className={styles.figArea} x="355" y="50" width="64" height="30" rx="7" />
      <text className={styles.figMainLabel} x="387" y="70" textAnchor="middle">g(x)</text>
      <text className={styles.figGuideLabel} x="387" y="128" textAnchor="middle">ลูกโซ่: ชั้นในซ้อนชั้นนอก</text>

      <path className={styles.figGuide} d="M74 176H406" />
      <circle className={styles.figOpenDot} cx="85" cy="219" r="14" />
      <circle className={styles.figOpenDotAccent} cx="240" cy="219" r="14" />
      <circle className={styles.figOpenDot} cx="395" cy="219" r="14" />
      <path className={styles.figMotion} d="M103 219H218M258 219H373" />
      <text className={styles.figLabel} x="85" y="224" textAnchor="middle">x</text>
      <text className={styles.figAccentLabel} x="240" y="224" textAnchor="middle">g</text>
      <text className={styles.figLabel} x="395" y="224" textAnchor="middle">f</text>
      <text className={styles.figMainLabel} x="240" y="268" textAnchor="middle">ดิฟชั้นนอก × ดิฟชั้นใน</text>
    </svg>
  )
}

function tangentNormalFigure() {
  const p = makePlane({ minX: -2.5, maxX: 5.4, minY: -0.6, maxY: 5.3 })
  const curve = (x: number) => 0.34 * (x - 0.6) ** 2 + 0.5
  const a = 2
  const point: Point = [a, curve(a)]
  const slope = 0.68 * (a - 0.6)
  const tangent = (x: number) => point[1] + slope * (x - a)
  const normal = (x: number) => point[1] - (x - a) / slope
  return (
    <Figure plane={p} label="เส้นสัมผัสและเส้นตั้งฉากตัดกันที่จุดบนกราฟ">
      <Axes plane={p} />
      <path className={styles.figMain} d={graph(p, curve, -1.8, 4.3)} />
      <path className={styles.figAccent} d={graph(p, tangent, 0.25, 5, 2)} />
      <path className={styles.figGuide} d={graph(p, normal, -1.4, 4.7, 2)} />
      <Dot plane={p} at={point} className={styles.figFocus} />
      <RightAngle plane={p} corner={point} u={unit([1, slope])} v={unit([1, -1 / slope])} size={0.34} />
      <Label plane={p} at={point} dx={-10} dy={-14} anchor="end">P(a, f(a))</Label>
      <Label plane={p} at={[4.5, tangent(4.5)]} dy={-12} anchor="end" className={styles.figAccentLabel}>m = f′(a)</Label>
      <Label plane={p} at={[-0.8, normal(-0.8)]} dx={10} dy={-8} anchor="start" className={styles.figGuideLabel}>m = −1/f′(a)</Label>
    </Figure>
  )
}

function increasingFigure() {
  const p = makePlane({ minX: -3.5, maxX: 3.8, minY: -3.8, maxY: 4.2 })
  const curve = (x: number) => 0.28 * x ** 3 - 1.45 * x
  return (
    <Figure plane={p} label="กราฟเพิ่ม ลด แล้วเพิ่มอีกครั้ง โดยจุดวิกฤตแบ่งช่วงเครื่องหมายของอนุพันธ์">
      <Axes plane={p} />
      <path className={styles.figMain} d={graph(p, curve, -2.9, 3)} />
      <Dot plane={p} at={[-1.31, curve(-1.31)]} className={styles.figFocus} />
      <Dot plane={p} at={[1.31, curve(1.31)]} className={styles.figFocus} />
      <path className={styles.figMotion} d={`M${p.at([-2.55, curve(-2.55)])}L${p.at([-1.65, curve(-1.65)])}`} />
      <path className={styles.figMotionDown} d={`M${p.at([-0.75, curve(-0.75)])}L${p.at([0.75, curve(0.75)])}`} />
      <path className={styles.figMotion} d={`M${p.at([1.65, curve(1.65)])}L${p.at([2.55, curve(2.55)])}`} />
      <Label plane={p} at={[-2.25, 2.95]} className={styles.figMainLabel}>f′ &gt; 0</Label>
      <Label plane={p} at={[0, -2.7]} className={styles.figAccentLabel}>f′ &lt; 0</Label>
      <Label plane={p} at={[2.35, 2.95]} className={styles.figMainLabel}>f′ &gt; 0</Label>
    </Figure>
  )
}

function antiderivativeFigure() {
  const p = makePlane({ minX: -3.4, maxX: 4, minY: -1, maxY: 5.2 })
  const family = (c: number) => (x: number) => 0.22 * (x - 0.25) ** 2 + c
  return (
    <Figure plane={p} label="ปฏิยานุพันธ์หลายเส้นที่มีรูปร่างเดียวกันและเลื่อนขึ้นลงด้วยค่าคงตัว C">
      <Axes plane={p} />
      <path className={styles.figGuide} d={graph(p, family(0.45), -3, 3.6)} />
      <path className={styles.figMain} d={graph(p, family(1.65), -3, 3.6)} />
      <path className={styles.figAccent} d={graph(p, family(2.85), -3, 3.6)} />
      <Label plane={p} at={[3.25, family(0.45)(3.25)]} dx={8} dy={3} anchor="start" className={styles.figGuideLabel}>F(x) − 1</Label>
      <Label plane={p} at={[3.25, family(1.65)(3.25)]} dx={8} dy={3} anchor="start" className={styles.figMainLabel}>F(x)</Label>
      <Label plane={p} at={[3.25, family(2.85)(3.25)]} dx={8} dy={3} anchor="start" className={styles.figAccentLabel}>F(x) + 1</Label>
      <Label plane={p} at={[-1.9, 4.55]} className={styles.figLabel}>ทุกเส้นมีอนุพันธ์ f(x) เดียวกัน</Label>
    </Figure>
  )
}

function fundamentalTheoremFigure() {
  const p = makePlane({ minX: -0.8, maxX: 6.8, minY: -0.5, maxY: 4.9 })
  const curve = (x: number) => 1.25 + 0.22 * x + 0.6 * Math.sin(0.8 * x)
  const a = 0.7
  const x = 5.2
  const samples = Array.from({ length: 76 }, (_, i) => {
    const px = a + ((x - a) * i) / 75
    return [px, curve(px)] as Point
  })
  const areaPath = `M${p.at([a, 0])}L${samples.map((point) => p.at(point)).join('L')}L${p.at([x, 0])}Z`
  return (
    <Figure plane={p} label="พื้นที่สะสมใต้กราฟจาก a ถึง x และแถบพื้นที่เล็กเมื่อขยับปลายขวา">
      <Axes plane={p} />
      <path className={styles.figArea} d={areaPath} />
      <rect className={styles.figSlice} x={p.x(x - 0.18)} y={p.y(curve(x))} width={p.x(x) - p.x(x - 0.18)} height={p.y(0) - p.y(curve(x))} />
      <path className={styles.figMain} d={graph(p, curve, 0, 6.3)} />
      <Segment plane={p} from={[a, 0]} to={[a, curve(a)]} className={styles.figGuide} />
      <Segment plane={p} from={[x, 0]} to={[x, curve(x)]} className={styles.figGuide} />
      <Label plane={p} at={[a, 0]} dy={20}>a</Label>
      <Label plane={p} at={[x, 0]} dy={20}>x</Label>
      <Label plane={p} at={[(a + x) / 2, 1]} className={styles.figMainLabel}>F(x) = พื้นที่สะสม</Label>
      <Label plane={p} at={[x - 0.08, curve(x)]} dx={10} dy={-10} anchor="start" className={styles.figAccentLabel}>เพิ่ม ≈ f(x)Δx</Label>
    </Figure>
  )
}

function areaBetweenCurvesFigure() {
  const p = makePlane({ minX: -0.8, maxX: 6.7, minY: -0.4, maxY: 5 })
  const upper = (x: number) => 3.7 - 0.16 * (x - 3.1) ** 2
  const lower = (x: number) => 1.15 + 0.08 * (x - 3.1) ** 2
  const a = 0.7
  const b = 5.5
  const top = Array.from({ length: 76 }, (_, i) => {
    const x = a + ((b - a) * i) / 75
    return [x, upper(x)] as Point
  })
  const bottom = Array.from({ length: 76 }, (_, i) => {
    const x = b - ((b - a) * i) / 75
    return [x, lower(x)] as Point
  })
  const areaPath = `M${top.map((point) => p.at(point)).join('L')}L${bottom.map((point) => p.at(point)).join('L')}Z`
  const sampleX = 3.7
  return (
    <Figure plane={p} label="พื้นที่ระหว่างกราฟบนและกราฟล่าง วัดจากผลต่างแนวตั้งของสองฟังก์ชัน">
      <Axes plane={p} />
      <path className={styles.figArea} d={areaPath} />
      <path className={styles.figMain} d={graph(p, upper, a, b)} />
      <path className={styles.figAccent} d={graph(p, lower, a, b)} />
      <Segment plane={p} from={[sampleX, lower(sampleX)]} to={[sampleX, upper(sampleX)]} className={styles.figMeasure} />
      <Label plane={p} at={[4.85, upper(4.85)]} dy={-12} className={styles.figMainLabel}>บน f(x)</Label>
      <Label plane={p} at={[4.85, lower(4.85)]} dy={22} className={styles.figAccentLabel}>ล่าง g(x)</Label>
      <Label plane={p} at={[sampleX, (upper(sampleX) + lower(sampleX)) / 2]} dx={12} dy={4} anchor="start" className={styles.figGuideLabel}>f(x) − g(x)</Label>
      <Label plane={p} at={[a, 0]} dy={20}>a</Label>
      <Label plane={p} at={[b, 0]} dy={20}>b</Label>
    </Figure>
  )
}

export const FORMULA_FIGURES: Record<string, { figure: () => ReactNode; caption: string }> = {
  'calculus-formula-guide::ความหมายของลิมิต': {
    figure: limitMeaningFigure,
    caption: 'ลิมิตดูว่ากราฟเข้าใกล้ระดับใดเมื่อ x เข้าใกล้ a จากรอบข้าง จุดทึบแสดง f(a) ซึ่งอาจอยู่คนละตำแหน่งกับลิมิตได้',
  },
  'calculus-formula-guide::ลิมิตซ้ายและลิมิตขวา': {
    figure: oneSidedLimitFigure,
    caption: 'เดินตามกราฟเข้าหา a จากแต่ละด้าน หากความสูงปลายทาง L₋ และ L₊ ไม่เท่ากัน ลิมิตสองข้างไม่มีค่า แม้ลิมิตด้านเดียวทั้งคู่จะมีค่า',
  },
  'calculus-formula-guide::ลิมิตและความต่อเนื่อง': {
    figure: continuityFigure,
    caption: 'ความต่อเนื่องหมายถึงกราฟผ่านจุดนั้นโดยไม่ขาด: ลิมิตซ้ายเท่ากับลิมิตขวา และระดับที่เข้าใกล้ต้องตรงกับจุดทึบ f(a)',
  },
  'calculus-formula-guide::นิยามอนุพันธ์': {
    figure: derivativeDefinitionFigure,
    caption: 'ความชันของเส้นตัดวัดการเปลี่ยนแปลงเฉลี่ย เมื่อจุดที่สองเลื่อนเข้าใกล้จุดแรกจน h → 0 เส้นตัดจะเข้าใกล้เส้นสัมผัสและความชันเข้าใกล้ f′(a)',
  },
  'calculus-formula-guide::กฎกำลังและความเป็นเชิงเส้น': {
    figure: linearityFigure,
    caption: 'เมื่อรวมฟังก์ชัน การเปลี่ยนแปลงของผลรวมก็คือผลรวมของการเปลี่ยนแปลงแต่ละส่วน จึงดิฟผลบวก ผลต่าง และค่าคงตัวคูณแยกทีละพจน์ได้',
  },
  'calculus-formula-guide::กฎผลคูณ ผลหาร และกฎลูกโซ่': {
    figure: combinedRulesFigure,
    caption: 'กฎผลคูณต้องนับการเปลี่ยนของทั้งสองด้าน กฎผลหารต้องรักษาโครงสร้างเศษ–ส่วน ส่วนกฎลูกโซ่ตามการเปลี่ยนผ่านฟังก์ชันทีละชั้นจากชั้นนอกกลับเข้าชั้นใน',
  },
  'calculus-formula-guide::เส้นสัมผัสและเส้นตั้งฉาก': {
    figure: tangentNormalFigure,
    caption: 'เส้นสัมผัสใช้ความชัน f′(a) ที่จุด P ส่วนเส้นตั้งฉากผ่านจุดเดียวกันและมีความชันเป็นลบส่วนกลับ เมื่อ f′(a) ≠ 0',
  },
  'calculus-formula-guide::เพิ่มลดและจุดวิกฤต': {
    figure: increasingFigure,
    caption: 'เครื่องหมายของ f′ บอกทิศการเดินของกราฟ: บวกคือกราฟเพิ่ม ลบคือกราฟลด จุดวิกฤตเป็นเพียงจุดแบ่งช่วง ต้องดูว่าเครื่องหมายเปลี่ยนอย่างไรก่อนสรุป',
  },
  'calculus-formula-guide::อินทิกรัลไม่จำกัดเขต': {
    figure: antiderivativeFigure,
    caption: 'ปฏิยานุพันธ์ทุกเส้นต่างกันเพียงการเลื่อนขึ้นลงด้วยค่าคงตัว C จึงมีอนุพันธ์เป็น f(x) เดียวกัน และต้องเขียน + C เสมอเมื่อไม่มีขอบเขต',
  },
  'calculus-formula-guide::ทฤษฎีบทมูลฐาน': {
    figure: fundamentalTheoremFigure,
    caption: 'เมื่อปลายขวาขยับจาก x ไป x+Δx พื้นที่เพิ่มประมาณ f(x)Δx ดังนั้นอัตราการเปลี่ยนของพื้นที่สะสมจึงเท่ากับความสูงของกราฟ f(x)',
  },
  'calculus-formula-guide::พื้นที่ระหว่างกราฟ': {
    figure: areaBetweenCurvesFigure,
    caption: 'แบ่งพื้นที่เป็นแถบตั้งเล็ก ๆ แต่ละแถบสูงเท่ากับกราฟบนลบกราฟล่าง แล้วสะสมตั้งแต่ a ถึง b ถ้ากราฟสลับตำแหน่งต้องแบ่งช่วงก่อน',
  },
  'analytic-geometry-conics-formula-guide::ระยะระหว่างสองจุด': {
    figure: distanceFigure,
    caption: 'ระยะ d คือด้านตรงข้ามมุมฉากของสามเหลี่ยมมุมฉากที่มีด้านประกอบมุมฉากยาว x₂ − x₁ และ y₂ − y₁ สูตรนี้จึงมาจากทฤษฎีบทพีทาโกรัส',
  },
  'analytic-geometry-conics-formula-guide::ความชันเส้นตรง': {
    figure: slopeFigure,
    caption: 'ความชันคือระยะขึ้นหารด้วยระยะไป ถ้า m > 0 เส้นเอียงขึ้นไปทางขวา ถ้า m < 0 เส้นเอียงลง และเส้นแนวตั้ง (x₂ = x₁) ไม่มีความชัน',
  },
  'analytic-geometry-conics-formula-guide::สมการเส้นตรง': {
    figure: lineFigure,
    caption: 'เส้นตรงผ่านจุด (x₁, y₁) ที่มีความชัน m เส้นที่ขนานกันมีความชันเท่ากัน ส่วนเส้นที่ตั้งฉากกันมีผลคูณความชันเท่ากับ −1',
  },
  'analytic-geometry-conics-formula-guide::ระยะจุดถึงเส้น': {
    figure: pointLineFigure,
    caption: 'ระยะจากจุดถึงเส้นตรงวัดตามแนวที่ตั้งฉากกับเส้นตรง ซึ่งเป็นระยะที่สั้นที่สุดจากจุดนั้นไปยังเส้นตรง',
  },
  'analytic-geometry-conics-formula-guide::วงกลม': {
    figure: circleFigure,
    caption: 'ทุกจุด (x, y) บนวงกลมอยู่ห่างจากศูนย์กลาง (h, k) เท่ากับ r เสมอ และเส้นสัมผัสวงกลมตั้งฉากกับรัศมีที่จุดสัมผัส',
  },
  'analytic-geometry-conics-formula-guide::พาราโบลา': {
    figure: parabolaFigure,
    caption: 'ทุกจุดบนพาราโบลาอยู่ห่างจากโฟกัสเท่ากับห่างจากไดเรกตริกซ์ จุดยอดอยู่กึ่งกลาง ห่างจากโฟกัสและไดเรกตริกซ์เป็นระยะ p เท่ากัน',
  },
  'analytic-geometry-conics-formula-guide::วงรี': {
    figure: ellipseFigure,
    caption: 'ผลบวกระยะจากจุด P ใด ๆ บนวงรีถึงโฟกัสทั้งสองเท่ากับ 2a เสมอ และสามเหลี่ยมมุมฉากที่มีด้าน b, c และด้านตรงข้ามมุมฉาก a แสดงว่า c² = a² − b² (ภาพนี้ศูนย์กลางอยู่ที่ (0, 0))',
  },
  'analytic-geometry-conics-formula-guide::ไฮเพอร์โบลา': {
    figure: hyperbolaFigure,
    caption: 'ผลต่างระยะจากจุด P ใด ๆ บนไฮเพอร์โบลาถึงโฟกัสทั้งสองเท่ากับ 2a เสมอ เส้นกำกับคือเส้นทแยงของกรอบขนาด 2a × 2b ซึ่งกราฟเข้าใกล้แต่ไม่ตัด (ภาพนี้ศูนย์กลางอยู่ที่ (0, 0))',
  },
}
