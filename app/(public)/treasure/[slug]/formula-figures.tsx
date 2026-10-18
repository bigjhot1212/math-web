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
  const p = makePlane({ minX: -0.7, maxX: 7.4, minY: -0.6, maxY: 4.8 })
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
      <Label plane={p} at={[5, (a[1] + b[1]) / 2]} dx={12} dy={5} anchor="start" className={styles.figAccentLabel}>ระยะขึ้น y₂ − y₁</Label>
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
      <Label plane={p} at={[6.6, parallel(6.6)]} dy={22} anchor="end" className={styles.figGuideLabel}>ขนาน: m เท่ากัน</Label>
      <Label plane={p} at={[0.75, perpendicular(0.75)]} dx={12} anchor="start" className={styles.figAccentLabel}>ตั้งฉาก: m₁m₂ = −1</Label>
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
      <Label plane={p} at={onCircle} dx={10} dy={-10} anchor="start">(x, y)</Label>
      <Label plane={p} at={[(center[0] + onCircle[0]) / 2, (center[1] + onCircle[1]) / 2]} dx={-4} dy={-10} anchor="end" className={styles.figAccentLabel}>r</Label>
      <Label plane={p} at={tangentFrom} dx={8} dy={4} anchor="start" className={styles.figGuideLabel}>เส้นสัมผัส</Label>
    </Figure>
  )
}

function parabolaFigure() {
  const p = makePlane({ minX: -1.6, maxX: 7.3, minY: -0.6, maxY: 5.4 })
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
      <Label plane={p} at={[-1.5, directrixY]} dy={19} anchor="start" className={styles.figGuideLabel}>ไดเรกตริกซ์</Label>
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
  const p = makePlane({ minX: -5.6, maxX: 5.6, minY: -4, maxY: 4 })
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
      <Label plane={p} at={[-5.4, -3.6]} anchor="start" className={styles.figAccentLabel}>|PF₁ − PF₂| = 2a</Label>
    </Figure>
  )
}

export const FORMULA_FIGURES: Record<string, { figure: () => ReactNode; caption: string }> = {
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
