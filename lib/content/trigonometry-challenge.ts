import type { Question } from '@/lib/types/question'

type Key = 'a' | 'b' | 'c' | 'd' | 'e'
type Choices = NonNullable<Question['content']['choices']>
const keys: Key[] = ['a', 'b', 'c', 'd', 'e']

function q(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, choices: Choices, answer: Key, hint: string, steps: string[]): Question {
  return { id: `trigonometry-challenge-${String(id).padStart(2, '0')}`, topicId: 'trigonometry', subtopic, level: 'A-Level', difficulty, type: 'multiple-choice', content: { text, choices }, answer, hint, solution: { steps }, tags: ['original', 'challenge'], source: 'MathPrep original' }
}

function numeric(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, correct: number, distractors: number[], hint: string, steps: string[]): Question {
  const values = [...new Set(distractors.filter(value => value !== correct))].slice(0, 4)
  let next = correct + 1
  while (values.length < 4) { if (next !== correct && !values.includes(next)) values.push(next); next++ }
  const index = (id * 2 + 4) % 5
  values.splice(index, 0, correct)
  return q(id, subtopic, difficulty, text, Object.fromEntries(keys.map((key, i) => [key, String(values[i])])) as Choices, keys[index], hint, steps)
}

const angles: Question[] = [
  q(1, 'angle-measure', 'medium', '$150^\\circ$ เท่ากับกี่เรเดียน', { a: '$\\dfrac{5\\pi}{6}$', b: '$\\dfrac{3\\pi}{4}$', c: '$\\dfrac{2\\pi}{3}$', d: '$\\dfrac{5\\pi}{3}$', e: '$\\dfrac{6\\pi}{5}$' }, 'a', 'คูณองศาด้วย $\\pi/180$', ['$150^\\circ\\cdot\\dfrac{\\pi}{180^\\circ}=\\dfrac{5\\pi}{6}$']),
  numeric(2, 'angle-measure', 'medium', '$\\dfrac{7\\pi}{4}$ เรเดียนเท่ากับกี่องศา', 315, [225, 270, 300, 360], 'คูณเรเดียนด้วย $180/\\pi$', ['$\\dfrac{7\\pi}{4}\\cdot\\dfrac{180^\\circ}{\\pi}$', '$=315^\\circ$']),
  q(3, 'unit-circle', 'medium', '$\\cos240^\\circ$ มีค่าเท่าใด', { a: '$-\\dfrac12$', b: '$\\dfrac12$', c: '$-\\dfrac{\\sqrt3}{2}$', d: '$\\dfrac{\\sqrt3}{2}$', e: '$0$' }, 'a', 'มุมอ้างอิงคือ $60^\\circ$ และอยู่จตุภาคที่ 3', ['$\\cos240^\\circ=-\\cos60^\\circ$', '$=-\\dfrac12$']),
  q(4, 'quadrant', 'medium', 'ถ้า $\\sin\\theta=\\dfrac35$ และ $\\theta$ อยู่จตุภาคที่ 2 แล้ว $\\cos\\theta$ เท่ากับเท่าใด', { a: '$-\\dfrac45$', b: '$\\dfrac45$', c: '$-\\dfrac35$', d: '$\\dfrac34$', e: '$\\dfrac54$' }, 'a', 'ใช้เอกลักษณ์พีทาโกรัสและเลือกเครื่องหมายตามจตุภาค', ['$\\cos^2\\theta=1-9/25=16/25$', 'จตุภาคที่ 2 มี cosine เป็นลบ จึง $\\cos\\theta=-4/5$']),
  q(5, 'quadrant', 'hard', 'ถ้า $0^\\circ\\le\\theta<360^\\circ$, $\\tan\\theta=-\\sqrt3$ และ $\\theta$ อยู่จตุภาคที่ 4 แล้ว $\\theta$ เท่ากับเท่าใด', { a: '$300^\\circ$', b: '$240^\\circ$', c: '$120^\\circ$', d: '$330^\\circ$', e: '$60^\\circ$' }, 'a', 'มุมอ้างอิงที่ tangent มีขนาด $\\sqrt3$ คือ $60^\\circ$', ['$\\theta=360^\\circ-60^\\circ$', '$=300^\\circ$']),
  q(6, 'reciprocal-functions', 'medium', 'ถ้า $\\cos\\theta=-\\dfrac25$ แล้ว $\\sec\\theta$ เท่ากับเท่าใด', { a: '$-\\dfrac52$', b: '$\\dfrac52$', c: '$-\\dfrac25$', d: '$\\dfrac25$', e: '$-\\dfrac32$' }, 'a', '$\\sec\\theta$ เป็นส่วนกลับของ $\\cos\\theta$', ['$\\sec\\theta=1/\\cos\\theta$', '$=-5/2$']),
  q(7, 'reciprocal-functions', 'medium', 'ถ้า $\\tan\\theta=\\dfrac34$ แล้ว $\\cot\\theta$ เท่ากับเท่าใด', { a: '$\\dfrac43$', b: '$\\dfrac34$', c: '$-\\dfrac43$', d: '$\\dfrac53$', e: '$\\dfrac45$' }, 'a', '$\\cot$ เป็นส่วนกลับของ $\\tan$', ['$\\cot\\theta=1/\\tan\\theta$', '$=4/3$']),
  q(8, 'reference-angle', 'medium', 'มุมอ้างอิงของ $\\dfrac{5\\pi}{6}$ คือข้อใด', { a: '$\\dfrac\\pi6$', b: '$\\dfrac\\pi3$', c: '$\\dfrac{5\\pi}{6}$', d: '$\\dfrac{7\\pi}{6}$', e: '$\\dfrac\\pi2$' }, 'a', 'มุมอยู่จตุภาคที่ 2 จึงลบออกจาก $\\pi$', ['$\\pi-\\dfrac{5\\pi}{6}=\\dfrac\\pi6$']),
  q(9, 'symmetry', 'medium', '$\\sin(-\\theta)$ เท่ากับข้อใด', { a: '$-\\sin\\theta$', b: '$\\sin\\theta$', c: '$\\cos\\theta$', d: '$-\\cos\\theta$', e: '$\\tan\\theta$' }, 'a', 'sine เป็นฟังก์ชันคี่', ['$\\sin(-\\theta)=-\\sin\\theta$']),
  q(10, 'periodicity', 'medium', '$\\sin\\dfrac{13\\pi}{6}$ มีค่าเท่าใด', { a: '$\\dfrac12$', b: '$-\\dfrac12$', c: '$\\dfrac{\\sqrt3}{2}$', d: '$0$', e: '$1$' }, 'a', 'ลบคาบ $2\\pi=12\\pi/6$', ['$\\sin\\dfrac{13\\pi}{6}=\\sin\\dfrac\\pi6$', '$=1/2$']),
]

const identities: Question[] = [
  numeric(11, 'identities', 'medium', '$\\sin^2x+\\cos^2x$ มีค่าเท่าใด', 1, [0, 2, -1, 0.5], 'ใช้เอกลักษณ์พีทาโกรัส', ['$\\sin^2x+\\cos^2x=1$']),
  numeric(12, 'identities', 'medium', '$\\dfrac{1-\\cos^2x}{\\sin^2x}$ เมื่อ $\\sin x\\ne0$ มีค่าเท่าใด', 1, [0, 2, -1, 0.5], '$1-\\cos^2x=\\sin^2x$', ['$\\dfrac{\\sin^2x}{\\sin^2x}=1$']),
  q(13, 'identities', 'hard', '$\\tan x+\\cot x$ เมื่อทุกพจน์นิยาม เท่ากับข้อใด', { a: '$\\dfrac1{\\sin x\\cos x}$', b: '$\\sin x\\cos x$', c: '$1$', d: '$\\sec x\\csc x-1$', e: '$\\tan2x$' }, 'a', 'เขียน tan และ cot ด้วย sine/cosine แล้วรวมเศษส่วน', ['$\\dfrac{\\sin x}{\\cos x}+\\dfrac{\\cos x}{\\sin x}$', '$=\\dfrac{\\sin^2x+\\cos^2x}{\\sin x\\cos x}=\\dfrac1{\\sin x\\cos x}$']),
  numeric(14, 'identities', 'medium', '$\\sec^2x-\\tan^2x$ มีค่าเท่าใด', 1, [0, 2, -1, 4], 'ใช้ $\\sec^2x=1+\\tan^2x$', ['$\\sec^2x-\\tan^2x=1$']),
  q(15, 'double-angle', 'hard', '$\\dfrac{1-\\cos2x}{\\sin2x}$ เมื่อทุกพจน์นิยาม เท่ากับข้อใด', { a: '$\\tan x$', b: '$\\cot x$', c: '$\\sin x$', d: '$\\cos x$', e: '$\\tan2x$' }, 'a', 'ใช้สูตรครึ่งมุมในตัวเศษและสูตรมุมสองเท่าในส่วน', ['$1-\\cos2x=2\\sin^2x$', '$\\sin2x=2\\sin x\\cos x$', 'อัตราส่วนจึงเป็น $\\tan x$']),
  q(16, 'sum-difference', 'hard', '$\\sin75^\\circ$ เท่ากับข้อใด', { a: '$\\dfrac{\\sqrt6+\\sqrt2}{4}$', b: '$\\dfrac{\\sqrt6-\\sqrt2}{4}$', c: '$\\dfrac{\\sqrt3}{2}$', d: '$\\dfrac12$', e: '$\\dfrac{\\sqrt2}{2}$' }, 'a', 'เขียน $75^\\circ=45^\\circ+30^\\circ$', ['$\\sin75^\\circ=\\sin45^\\circ\\cos30^\\circ+\\cos45^\\circ\\sin30^\\circ$', '$=\\dfrac{\\sqrt6+\\sqrt2}{4}$']),
  q(17, 'sum-difference', 'hard', '$\\cos15^\\circ$ เท่ากับข้อใด', { a: '$\\dfrac{\\sqrt6+\\sqrt2}{4}$', b: '$\\dfrac{\\sqrt6-\\sqrt2}{4}$', c: '$\\dfrac{\\sqrt3}{2}$', d: '$\\dfrac12$', e: '$\\dfrac{\\sqrt2}{2}$' }, 'a', 'เขียน $15^\\circ=45^\\circ-30^\\circ$', ['$\\cos15^\\circ=\\cos45^\\circ\\cos30^\\circ+\\sin45^\\circ\\sin30^\\circ$', '$=\\dfrac{\\sqrt6+\\sqrt2}{4}$']),
  q(18, 'sum-difference', 'hard', 'ถ้า $\\tan A=\\dfrac12$ และ $\\tan B=\\dfrac13$ แล้ว $\\tan(A+B)$ เท่ากับเท่าใด', { a: '$1$', b: '$\\dfrac15$', c: '$\\dfrac56$', d: '$\\dfrac65$', e: '$\\dfrac12$' }, 'a', 'ใช้สูตร tangent ของผลบวก', ['$\\tan(A+B)=\\dfrac{1/2+1/3}{1-(1/2)(1/3)}$', '$=\\dfrac{5/6}{5/6}=1$']),
  q(19, 'double-angle', 'medium', '$2\\sin x\\cos x$ เท่ากับข้อใด', { a: '$\\sin2x$', b: '$\\cos2x$', c: '$\\tan2x$', d: '$1-\\cos2x$', e: '$\\sin^2x$' }, 'a', 'เป็นสูตร sine มุมสองเท่าโดยตรง', ['$\\sin2x=2\\sin x\\cos x$']),
  q(20, 'double-angle', 'hard', 'ถ้า $\\sin\\theta+\\cos\\theta=\\sqrt{\\dfrac32}$ แล้ว $\\sin2\\theta$ เท่ากับเท่าใด', { a: '$\\dfrac12$', b: '$-\\dfrac12$', c: '$\\dfrac32$', d: '$\\dfrac{\\sqrt3}{2}$', e: '$1$' }, 'a', 'ยกกำลังสองทั้งสองข้าง', ['$(\\sin\\theta+\\cos\\theta)^2=1+\\sin2\\theta$', '$3/2=1+\\sin2\\theta$ จึง $\\sin2\\theta=1/2$']),
]

const equations: Question[] = [
  q(21, 'trig-equation', 'medium', 'คำตอบของ $\\sin x=\\dfrac12$ เมื่อ $0\\le x<2\\pi$ คือข้อใด', { a: '$x=\\dfrac\\pi6,\\dfrac{5\\pi}{6}$', b: '$x=\\dfrac\\pi6,\\dfrac{11\\pi}{6}$', c: '$x=\\dfrac\\pi3,\\dfrac{2\\pi}{3}$', d: '$x=0,\\pi$', e: '$x=\\dfrac\\pi2,\\dfrac{3\\pi}{2}$' }, 'a', 'sine เป็นบวกในจตุภาคที่ 1 และ 2', ['มุมอ้างอิงคือ $\\pi/6$', 'จึงได้ $x=\\pi/6,5\\pi/6$']),
  q(22, 'trig-equation', 'medium', 'คำตอบของ $\\cos x=-\\dfrac{\\sqrt2}{2}$ เมื่อ $0\\le x<2\\pi$ คือข้อใด', { a: '$x=\\dfrac{3\\pi}{4},\\dfrac{5\\pi}{4}$', b: '$x=\\dfrac\\pi4,\\dfrac{7\\pi}{4}$', c: '$x=\\dfrac\\pi4,\\dfrac{3\\pi}{4}$', d: '$x=\\dfrac{5\\pi}{4},\\dfrac{7\\pi}{4}$', e: '$x=\\dfrac\\pi2,\\dfrac{3\\pi}{2}$' }, 'a', 'cosine เป็นลบในจตุภาคที่ 2 และ 3', ['มุมอ้างอิงคือ $\\pi/4$', 'จึงได้ $3\\pi/4,5\\pi/4$']),
  q(23, 'trig-equation', 'medium', 'คำตอบของ $\\tan x=1$ เมื่อ $0\\le x<2\\pi$ คือข้อใด', { a: '$x=\\dfrac\\pi4,\\dfrac{5\\pi}{4}$', b: '$x=\\dfrac\\pi4,\\dfrac{7\\pi}{4}$', c: '$x=\\dfrac{3\\pi}{4},\\dfrac{7\\pi}{4}$', d: '$x=0,\\pi$', e: '$x=\\dfrac\\pi2,\\dfrac{3\\pi}{2}$' }, 'a', 'tangent มีคาบ $\\pi$ และเป็นบวกในจตุภาค 1,3', ['$x=\\pi/4+k\\pi$', 'ในช่วงที่กำหนดได้ $\\pi/4,5\\pi/4$']),
  numeric(24, 'trig-equation', 'hard', 'สมการ $2\\sin^2x-1=0$ มีคำตอบกี่ค่าเมื่อ $0\\le x<2\\pi$', 4, [1, 2, 3, 6], '$\\sin^2x=1/2$ ทำให้ sine เป็นได้ทั้งบวกและลบ', ['$\\sin x=\\pm\\sqrt2/2$', 'ได้ $x=\\pi/4,3\\pi/4,5\\pi/4,7\\pi/4$ รวม 4 ค่า']),
  numeric(25, 'trig-equation', 'hard', 'สมการ $\\sin2x=0$ มีคำตอบกี่ค่าเมื่อ $0\\le x<2\\pi$', 4, [2, 3, 5, 6], '$2x=k\\pi$', ['$x=k\\pi/2$', 'ในช่วงกำหนดได้ $0,\\pi/2,\\pi,3\\pi/2$ รวม 4 ค่า']),
  numeric(26, 'trig-equation', 'hard', 'สมการ $\\cos2x=\\cos x$ มีคำตอบกี่ค่าเมื่อ $0\\le x<2\\pi$', 3, [1, 2, 4, 6], 'เขียน $\\cos2x=2\\cos^2x-1$', ['$2c^2-c-1=0$ เมื่อ $c=\\cos x$', '$(2c+1)(c-1)=0$ จึง $c=1$ หรือ $c=-1/2$', 'ได้ $x=0,2\\pi/3,4\\pi/3$ รวม 3 ค่า']),
  numeric(27, 'trig-equation', 'medium', 'สมการ $\\sin x=\\cos x$ มีคำตอบกี่ค่าเมื่อ $0\\le x<2\\pi$', 2, [1, 3, 4, 6], 'เมื่อ cosine ไม่เป็นศูนย์ หารเพื่อได้ $\\tan x=1$', ['$x=\\pi/4+k\\pi$', 'ในช่วงได้ $\\pi/4,5\\pi/4$ รวม 2 ค่า']),
  q(28, 'trig-equation', 'hard', 'ผลบวกของคำตอบทั้งหมดของ $2\\cos x+1=0$ เมื่อ $0\\le x<2\\pi$ เท่ากับข้อใด', { a: '$2\\pi$', b: '$\\pi$', c: '$\\dfrac{4\\pi}{3}$', d: '$\\dfrac{2\\pi}{3}$', e: '$3\\pi$' }, 'a', ['$\\cos x=-1/2$'].join(''), ['$x=2\\pi/3,4\\pi/3$', 'ผลบวกเท่ากับ $2\\pi$']),
  numeric(29, 'trig-equation', 'hard', 'สมการ $\\sin x(2\\cos x-1)=0$ มีคำตอบกี่ค่าเมื่อ $0\\le x<2\\pi$', 4, [2, 3, 5, 6], 'แยกแต่ละตัวประกอบเท่ากับศูนย์', ['$\\sin x=0$ ให้ $x=0,\\pi$', '$\\cos x=1/2$ ให้ $x=\\pi/3,5\\pi/3$', 'รวม 4 ค่า']),
  q(30, 'trig-inequality', 'medium', 'เซตคำตอบของ $\\sin x>0$ เมื่อ $0\\le x<2\\pi$ คือข้อใด', { a: '$(0,\\pi)$', b: '$(\\pi,2\\pi)$', c: '$[0,\\pi]$', d: '$(0,2\\pi)$', e: '$(\\pi/2,3\\pi/2)$' }, 'a', 'sine เป็นบวกในจตุภาคที่ 1 และ 2', ['ช่วงที่ sine อยู่เหนือแกน $x$ คือ $(0,\\pi)$']),
]

const graphs: Question[] = [
  numeric(31, 'trig-graph', 'medium', 'แอมพลิจูดของ $y=3\\sin x-2$ เท่ากับเท่าใด', 3, [1, 2, 5, 6], 'แอมพลิจูดคือค่าสัมบูรณ์ของสัมประสิทธิ์หน้า sine', ['$|3|=3$']),
  q(32, 'trig-period', 'medium', 'คาบของ $y=\\sin2x$ เท่ากับข้อใด', { a: '$\\pi$', b: '$2\\pi$', c: '$\\dfrac\\pi2$', d: '$4\\pi$', e: '$1$' }, 'a', 'คาบ sine คือ $2\\pi/|b|$', ['$T=2\\pi/2=\\pi$']),
  q(33, 'trig-period', 'medium', 'คาบของ $y=\\tan3x$ เท่ากับข้อใด', { a: '$\\dfrac\\pi3$', b: '$\\dfrac{2\\pi}{3}$', c: '$3\\pi$', d: '$\\pi$', e: '$\\dfrac\\pi6$' }, 'a', 'คาบ tangent คือ $\\pi/|b|$', ['$T=\\pi/3$']),
  q(34, 'trig-range', 'medium', 'เรนจ์ของ $y=2\\cos x-1$ คือข้อใด', { a: '$[-3,1]$', b: '$[-2,2]$', c: '$[-1,3]$', d: '$(-3,1)$', e: '$[-1,1]$' }, 'a', '$-1\\le\\cos x\\le1$', ['$-2\\le2\\cos x\\le2$', 'ลบ 1 ได้ $-3\\le y\\le1$']),
  q(35, 'graph-transformations', 'medium', 'กราฟ $y=\\sin(x-\\pi/4)$ ได้จาก $y=\\sin x$ อย่างไร', { a: 'เลื่อนไปขวา $\\pi/4$', b: 'เลื่อนไปซ้าย $\\pi/4$', c: 'เลื่อนขึ้น $\\pi/4$', d: 'สะท้อนแกน $x$', e: 'ยืดแนวตั้ง 4 เท่า' }, 'a', '$f(x-h)$ เลื่อนกราฟไปขวา $h$', ['จึงเลื่อนไปขวา $\\pi/4$']),
  numeric(36, 'trig-extrema', 'hard', 'ค่าสูงสุดของ $3\\sin x+4\\cos x$ เท่ากับเท่าใด', 5, [4, 6, 7, 12], 'ค่าสูงสุดของ $a\\sin x+b\\cos x$ คือ $\\sqrt{a^2+b^2}$', ['$\\sqrt{3^2+4^2}=5$']),
  numeric(37, 'trig-extrema', 'hard', 'ค่าต่ำสุดของ $3\\sin x+4\\cos x$ เท่ากับเท่าใด', -5, [-7, -4, 0, 5], 'พิสัยสมมาตรรอบศูนย์', ['$-5\\le3\\sin x+4\\cos x\\le5$', 'ค่าต่ำสุดคือ $-5$']),
  numeric(38, 'trig-graph', 'medium', 'กราฟ $y=\\cos x$ มีจุดตัดแกน $x$ กี่จุดเมื่อ $0\\le x<2\\pi$', 2, [0, 1, 3, 4], '$\\cos x=0$ ที่มุมแกน $y$', ['$x=\\pi/2,3\\pi/2$', 'รวม 2 จุด']),
  q(39, 'trig-period', 'hard', 'คาบมูลฐานของ $y=|\\sin x|$ คือข้อใด', { a: '$\\pi$', b: '$2\\pi$', c: '$\\dfrac\\pi2$', d: '$4\\pi$', e: '$1$' }, 'a', 'การพับส่วนลบขึ้นทำให้รูปซ้ำเร็วขึ้นครึ่งหนึ่ง', ['$sin(x+\\pi)=-\\sin x$', 'เมื่อใส่ค่าสัมบูรณ์จึง $|\\sin(x+\\pi)|=|\\sin x|$']),
  q(40, 'even-odd', 'medium', 'ข้อใดเป็นฟังก์ชันคู่', { a: '$\\cos x$', b: '$\\sin x$', c: '$\\tan x$', d: '$\\sin x+\\cos x$', e: '$x+\\sin x$' }, 'a', 'ฟังก์ชันคู่มี $f(-x)=f(x)$', ['$\\cos(-x)=\\cos x$']),
]

const applications: Question[] = [
  q(41, 'law-of-sines', 'hard', 'ในสามเหลี่ยม $ABC$ ถ้า $A=30^\\circ$, $B=45^\\circ$ และ $a=6$ แล้ว $b$ เท่ากับเท่าใด', { a: '$6\\sqrt2$', b: '$3\\sqrt2$', c: '$6$', d: '$3\\sqrt3$', e: '$12$' }, 'a', 'ใช้ $a/\\sin A=b/\\sin B$', ['$b=6\\dfrac{\\sin45^\\circ}{\\sin30^\\circ}$', '$=6\\sqrt2$']),
  numeric(42, 'law-of-cosines', 'medium', 'สามเหลี่ยมมีด้านประกอบมุมฉากยาว 3 และ 4 ด้านตรงข้ามมุมฉากยาวเท่าใด', 5, [1, 6, 7, 12], 'กฎโคไซน์ที่มุม $90^\\circ$ ลดรูปเป็นพีทาโกรัส', ['$c^2=3^2+4^2=25$', '$c=5$']),
  q(43, 'law-of-cosines', 'hard', 'สามเหลี่ยมมีด้านสองด้านยาว 5 และ 7 และมุมระหว่างด้านทั้งสอง $60^\\circ$ ด้านตรงข้ามมุมนี้ยาวเท่าใด', { a: '$\\sqrt{39}$', b: '$\\sqrt{74}$', c: '$6$', d: '$8$', e: '$12$' }, 'a', 'ใช้ $c^2=a^2+b^2-2ab\\cos C$', ['$c^2=25+49-2(5)(7)(1/2)$', '$=74-35=39$', '$c=\\sqrt{39}$']),
  numeric(44, 'triangle-area', 'medium', 'สามเหลี่ยมมีด้านสองด้านยาว 8 และ 10 และมุมระหว่างด้าน $30^\\circ$ มีพื้นที่เท่าใด', 20, [10, 30, 40, 80], 'ใช้พื้นที่ $\\frac12ab\\sin C$', ['$K=\\dfrac12(8)(10)\\sin30^\\circ$', '$=40(1/2)=20$']),
  numeric(45, 'triangle-angles', 'medium', 'สามเหลี่ยมมีมุมสองมุม $45^\\circ$ และ $60^\\circ$ มุมที่สามกี่องศา', 75, [65, 70, 85, 105], 'ผลบวกมุมภายในสามเหลี่ยมเท่ากับ $180^\\circ$', ['$180-45-60=75^\\circ$']),
  q(46, 'elevation', 'hard', 'ยืนห่างจากฐานอาคาร $20\\sqrt3$ เมตร มองยอดอาคารเป็นมุมเงย $30^\\circ$ โดยระดับสายตาอยู่ที่ฐานพอดี อาคารสูงเท่าใด', { a: '$20$ เมตร', b: '$20\\sqrt3$ เมตร', c: '$40$ เมตร', d: '$10\\sqrt3$ เมตร', e: '$60$ เมตร' }, 'a', '$\\tan30^\\circ=h/(20\\sqrt3)$', ['$h=20\\sqrt3\\tan30^\\circ$', '$=20\\sqrt3(1/\\sqrt3)=20$ เมตร']),
  q(47, 'elevation', 'medium', 'เสาต้นหนึ่งทอดเงายาว $10\\sqrt3$ เมตร เมื่อมุมเงยของดวงอาทิตย์เป็น $30^\\circ$ เสาสูงเท่าใด', { a: '$10$ เมตร', b: '$10\\sqrt3$ เมตร', c: '$20$ เมตร', d: '$5\\sqrt3$ เมตร', e: '$30$ เมตร' }, 'a', 'ใช้ tangent ของมุมเงย', ['$h=10\\sqrt3\\tan30^\\circ$', '$=10$ เมตร']),
  numeric(48, 'circumradius', 'hard', 'ในสามเหลี่ยม ด้าน $a=10$ อยู่ตรงข้ามมุม $A=30^\\circ$ รัศมีวงกลมล้อมรอบสามเหลี่ยมเท่ากับเท่าใด', 10, [5, 15, 20, 30], 'ใช้กฎไซน์แบบขยาย $a/\\sin A=2R$', ['$R=\\dfrac{a}{2\\sin A}$', '$=\\dfrac{10}{2(1/2)}=10$']),
  q(49, 'chord', 'hard', 'วงกลมรัศมี 1 มีคอร์ดรองรับมุมที่จุดศูนย์กลาง $120^\\circ$ คอร์ดยาวเท่าใด', { a: '$\\sqrt3$', b: '$1$', c: '$2$', d: '$\\sqrt2$', e: '$\\dfrac{\\sqrt3}{2}$' }, 'a', 'คอร์ดยาว $2R\\sin(\\theta/2)$', ['$L=2(1)\\sin60^\\circ$', '$=\\sqrt3$']),
  q(50, 'triangle-area', 'hard', 'สามเหลี่ยมมีด้านยาว 7, 8, 9 หน่วย พื้นที่เท่ากับเท่าใด', { a: '$12\\sqrt5$', b: '$24$', c: '$10\\sqrt5$', d: '$18\\sqrt3$', e: '$36$' }, 'a', 'ใช้สูตรของเฮรอน', ['$s=(7+8+9)/2=12$', '$K=\\sqrt{12(5)(4)(3)}=\\sqrt{720}=12\\sqrt5$']),
]

export const trigonometryChallengeQuestions: Question[] = [...angles, ...identities, ...equations, ...graphs, ...applications]
if (trigonometryChallengeQuestions.length !== 50) throw new Error(`Expected 50 trigonometry questions, received ${trigonometryChallengeQuestions.length}`)
const ids = new Set<string>()
for (const item of trigonometryChallengeQuestions) {
  if (ids.has(item.id)) throw new Error(`Duplicate trigonometry question id: ${item.id}`)
  ids.add(item.id)
  const choices = item.content.choices
  if (!choices || !(item.answer in choices)) throw new Error(`Invalid answer key for ${item.id}`)
  if (new Set(Object.values(choices)).size !== 5) throw new Error(`Duplicate choices in ${item.id}`)
}
