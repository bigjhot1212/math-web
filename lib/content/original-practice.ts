import type { Question } from '@/lib/types/question'

type Draft = Omit<Question, 'id' | 'level' | 'type' | 'source' | 'tags'> & { id: string; kind: 'example' | 'exercise' }

function q({ id, kind, ...question }: Draft): Question {
  return { ...question, id: `original-${id}`, level: 'A-Level', type: 'multiple-choice', tags: ['original', kind], source: 'MathPrep original' }
}

// Newly written for MathPrep. These questions do not reproduce the supplied PDF.
const baseOriginalPracticeQuestions: Question[] = [
  q({ id: 'set-example-01', kind: 'example', topicId: 'set', subtopic: 'cardinality', difficulty: 'easy', content: { text: 'กำหนดให้ $A = \\{2, 4, 6\\}$ จงหา $n(A)$', choices: { a: '2', b: '3', c: '4', d: '6', e: '8' } }, answer: 'b', hint: 'นับจำนวนสมาชิกที่ไม่ซ้ำกันในเซต', solution: { steps: ['เซต $A$ มีสมาชิกคือ 2, 4 และ 6', 'ดังนั้น $n(A)=3$'] } }),
  q({ id: 'set-exercise-01', kind: 'exercise', topicId: 'set', subtopic: 'inclusion-exclusion', difficulty: 'medium', content: { text: 'ถ้า $n(A \\cup B)=12$, $n(A)=7$ และ $n(B)=8$ แล้ว $n(A \\cap B)$ เท่ากับเท่าใด', choices: { a: '1', b: '2', c: '3', d: '4', e: '5' } }, answer: 'c', hint: 'ใช้สูตร $n(A \\cup B)=n(A)+n(B)-n(A \\cap B)$', solution: { steps: ['$12=7+8-n(A \\cap B)$', 'ดังนั้น $n(A \\cap B)=3$'], keyFormula: '$n(A \\cup B)=n(A)+n(B)-n(A \\cap B)$' } }),
  q({ id: 'logic-example-01', kind: 'example', topicId: 'logic', subtopic: 'implication', difficulty: 'easy', content: { text: 'ถ้า $p$ เป็นจริง และ $q$ เป็นเท็จ แล้วประพจน์ $p \\to q$ มีค่าความจริงเป็นอย่างไร', choices: { a: 'จริง', b: 'เท็จ', c: 'บอกไม่ได้', d: 'จริงและเท็จพร้อมกัน', e: 'ไม่เป็นประพจน์' } }, answer: 'b', hint: 'นิเสธเพียงกรณีที่เหตุเป็นจริง แต่ผลเป็นเท็จ', solution: { steps: ['$p \\to q$ เป็นเท็จเมื่อ $p$ จริงและ $q$ เท็จ', 'ตรงกับเงื่อนไขที่กำหนด จึงตอบเท็จ'] } }),
  q({ id: 'logic-exercise-01', kind: 'exercise', topicId: 'logic', subtopic: 'equivalence', difficulty: 'medium', content: { text: 'ประพจน์ใดสมมูลกับ $p \\to q$', choices: { a: '$q \\to p$', b: '$\\neg q \\to \\neg p$', c: '$\\neg p \\to \\neg q$', d: '$p \\land q$', e: '$\\neg p \\land q$' } }, answer: 'b', hint: 'นึกถึงบทกลับทางนิเสธ', solution: { steps: ['ประพจน์ $p \\to q$ สมมูลกับบทกลับทางนิเสธ', 'จึงได้ $\\neg q \\to \\neg p$'] } }),
  q({ id: 'real-numbers-example-01', kind: 'example', topicId: 'real-numbers', subtopic: 'absolute-value', difficulty: 'easy', content: { text: 'เซตคำตอบของ $|2x-5|=3$ คือข้อใด', choices: { a: '$\\{1\\}$', b: '$\\{4\\}$', c: '$\\{1,4\\}$', d: '$\\{-1,4\\}$', e: 'ไม่มีคำตอบ' } }, answer: 'c', hint: 'แยกเป็น $2x-5=3$ และ $2x-5=-3$', solution: { steps: ['$2x-5=3$ ให้ $x=4$', '$2x-5=-3$ ให้ $x=1$', 'ดังนั้นคำตอบคือ $\\{1,4\\}$'] } }),
  q({ id: 'real-numbers-exercise-01', kind: 'exercise', topicId: 'real-numbers', subtopic: 'quadratic-inequality', difficulty: 'medium', content: { text: 'คำตอบของอสมการ $x^2-5x+6 \\leq 0$ คือข้อใด', choices: { a: '$x < 2$', b: '$2 \\leq x \\leq 3$', c: '$x > 3$', d: '$x \\leq 2$ หรือ $x \\geq 3$', e: 'จำนวนจริงทุกจำนวน' } }, answer: 'b', hint: 'แยกตัวประกอบเป็น $(x-2)(x-3)$ แล้วพิจารณาเครื่องหมาย', solution: { steps: ['$x^2-5x+6=(x-2)(x-3)$', 'พาราโบลาหงาย จึงมีค่าน้อยกว่าหรือเท่ากับศูนย์ระหว่างราก', 'ดังนั้น $2 \\leq x \\leq 3$'] } }),
  q({ id: 'relations-functions-example-01', kind: 'example', topicId: 'relations-functions', subtopic: 'function-value', difficulty: 'easy', content: { text: 'กำหนด $f(x)=2x+3$ แล้ว $f(4)$ มีค่าเท่าใด', choices: { a: '8', b: '11', c: '14', d: '19', e: '5' } }, answer: 'b', hint: 'แทน $x=4$ ลงในนิยามของฟังก์ชัน', solution: { steps: ['$f(4)=2(4)+3$', '$f(4)=11$'] } }),
  q({ id: 'relations-functions-exercise-01', kind: 'exercise', topicId: 'relations-functions', subtopic: 'domain', difficulty: 'medium', content: { text: 'โดเมนของ $f(x)=\\sqrt{5-x}$ คือข้อใด', choices: { a: '$x \\geq 5$', b: '$x > 5$', c: '$x < 5$', d: '$x \\leq 5$', e: 'จำนวนจริงทุกจำนวน' } }, answer: 'd', hint: 'ค่าภายในรากที่สองต้องไม่ติดลบ', solution: { steps: ['$5-x \\geq 0$', 'ย้ายข้างจะได้ $x \\leq 5$'] } }),
  q({ id: 'exponential-logarithm-example-01', kind: 'example', topicId: 'exponential-logarithm', subtopic: 'exponential-equation', difficulty: 'easy', content: { text: 'ถ้า $2^{x+1}=16$ แล้ว $x$ เท่ากับเท่าใด', choices: { a: '1', b: '2', c: '3', d: '4', e: '5' } }, answer: 'c', hint: 'เขียน 16 ให้อยู่ในฐาน 2', solution: { steps: ['$16=2^4$ จึงได้ $x+1=4$', 'ดังนั้น $x=3$'] } }),
  q({ id: 'exponential-logarithm-exercise-01', kind: 'exercise', topicId: 'exponential-logarithm', subtopic: 'logarithm', difficulty: 'medium', content: { text: '$\\log_3 81$ มีค่าเท่าใด', choices: { a: '2', b: '3', c: '4', d: '8', e: '27' } }, answer: 'c', hint: 'หาเลขชี้กำลังที่ทำให้ $3$ ยกกำลังแล้วได้ 81', solution: { steps: ['$81=3^4$', 'ดังนั้น $\\log_3 81=4$'] } }),
  q({ id: 'analytic-geometry-conics-example-01', kind: 'example', topicId: 'analytic-geometry-conics', subtopic: 'circle', difficulty: 'medium', content: { text: 'จุดศูนย์กลางของวงกลม $x^2+y^2-4x+6y-3=0$ คือข้อใด', choices: { a: '$(-2,3)$', b: '$(2,-3)$', c: '$(2,3)$', d: '$(-2,-3)$', e: '$(4,-6)$' } }, answer: 'b', hint: 'จัดกำลังสองสมบูรณ์ของ $x$ และ $y$', solution: { steps: ['$x^2-4x+y^2+6y=3$', 'ได้ $(x-2)^2+(y+3)^2=16$', 'ศูนย์กลางคือ $(2,-3)$'] } }),
  q({ id: 'analytic-geometry-conics-exercise-01', kind: 'exercise', topicId: 'analytic-geometry-conics', subtopic: 'distance', difficulty: 'easy', content: { text: 'ระยะห่างระหว่างจุด $(1,2)$ และ $(4,6)$ เท่ากับเท่าใด', choices: { a: '3', b: '4', c: '$\\sqrt{17}$', d: '5', e: '7' } }, answer: 'd', hint: 'ใช้สูตรระยะห่างระหว่างจุดสองจุด', solution: { steps: ['$d=\\sqrt{(4-1)^2+(6-2)^2}$', '$d=\\sqrt{9+16}=5$'] } }),
  q({ id: 'trigonometry-example-01', kind: 'example', topicId: 'trigonometry', subtopic: 'special-angles', difficulty: 'easy', content: { text: '$\\sin 30^\\circ$ มีค่าเท่าใด', choices: { a: '$0$', b: '$\\dfrac{1}{2}$', c: '$\\dfrac{\\sqrt{2}}{2}$', d: '$\\dfrac{\\sqrt{3}}{2}$', e: '$1$' } }, answer: 'b', hint: 'นึกถึงสามเหลี่ยมมุม 30-60-90 องศา', solution: { steps: ['ค่ามาตรฐานคือ $\\sin 30^\\circ=\\dfrac{1}{2}$'] } }),
  q({ id: 'trigonometry-exercise-01', kind: 'exercise', topicId: 'trigonometry', subtopic: 'trig-ratios', difficulty: 'medium', content: { text: 'ถ้า $\\sin \\theta=\\dfrac{3}{5}$ และ $\\theta$ อยู่ในควอดแรนต์ที่ 1 แล้ว $\\cos \\theta$ เท่ากับเท่าใด', choices: { a: '$-\\dfrac{4}{5}$', b: '$-\\dfrac{3}{5}$', c: '$\\dfrac{4}{5}$', d: '$\\dfrac{3}{4}$', e: '$\\dfrac{5}{4}$' } }, answer: 'c', hint: 'ใช้ $\\sin^2\\theta+\\cos^2\\theta=1$', solution: { steps: ['$\\cos^2\\theta=1-\\left(\\dfrac35\\right)^2=\\dfrac{16}{25}$', 'ควอดแรนต์ที่ 1 มีค่า cos เป็นบวก จึงได้ $\\cos\\theta=\\dfrac45$'] } }),
  q({ id: 'matrix-example-01', kind: 'example', topicId: 'matrix', subtopic: 'determinant', difficulty: 'easy', content: { text: 'ดีเทอร์มิแนนต์ของ $\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$ เท่ากับเท่าใด', choices: { a: '2', b: '$-2$', c: '5', d: '10', e: '$-5$' } }, answer: 'b', hint: 'เมทริกซ์ $2\\times2$ ใช้ $ad-bc$', solution: { steps: ['$\\det(A)=1(4)-2(3)$', '$\\det(A)=-2$'] } }),
  q({ id: 'matrix-exercise-01', kind: 'exercise', topicId: 'matrix', subtopic: 'multiplication', difficulty: 'medium', content: { text: '$\\begin{pmatrix}2&1\\\\0&3\\end{pmatrix}\\begin{pmatrix}1\\\\2\\end{pmatrix}$ มีค่าเท่ากับข้อใด', choices: { a: '$\\begin{pmatrix}2\\\\6\\end{pmatrix}$', b: '$\\begin{pmatrix}3\\\\3\\end{pmatrix}$', c: '$\\begin{pmatrix}4\\\\6\\end{pmatrix}$', d: '$\\begin{pmatrix}4\\\\3\\end{pmatrix}$', e: '$\\begin{pmatrix}6\\\\4\\end{pmatrix}$' } }, answer: 'c', hint: 'คูณแถวของเมทริกซ์แรกกับหลักของเมทริกซ์ที่สอง', solution: { steps: ['แถวแรกได้ $2(1)+1(2)=4$', 'แถวที่สองได้ $0(1)+3(2)=6$', 'จึงได้ $\\begin{pmatrix}4\\\\6\\end{pmatrix}$'] } }),
  q({ id: 'vector-example-01', kind: 'example', topicId: 'vector', subtopic: 'addition', difficulty: 'easy', content: { text: 'ถ้า $\\vec{u}=(2,-1)$ และ $\\vec{v}=(3,4)$ แล้ว $\\vec{u}+\\vec{v}$ เท่ากับข้อใด', choices: { a: '$(1,-5)$', b: '$(5,3)$', c: '$(6,-4)$', d: '$(-1,5)$', e: '$(5,-3)$' } }, answer: 'b', hint: 'บวกพิกัดตำแหน่งเดียวกัน', solution: { steps: ['$\\vec{u}+\\vec{v}=(2+3,-1+4)$', 'จึงได้ $(5,3)$'] } }),
  q({ id: 'vector-exercise-01', kind: 'exercise', topicId: 'vector', subtopic: 'dot-product', difficulty: 'medium', content: { text: 'กำหนด $\\vec{a}=(1,2)$ และ $\\vec{b}=(3,-2)$ แล้ว $\\vec{a}\\cdot\\vec{b}$ เท่ากับเท่าใด', choices: { a: '$-4$', b: '$0$', c: '$1$', d: '$-1$', e: '$5$' } }, answer: 'd', hint: 'คูณพิกัดตำแหน่งเดียวกันแล้วบวก', solution: { steps: ['$\\vec{a}\\cdot\\vec{b}=1(3)+2(-2)$', 'ดังนั้น $\\vec{a}\\cdot\\vec{b}=-1$'] } }),
  q({ id: 'complex-numbers-example-01', kind: 'example', topicId: 'complex-numbers', subtopic: 'powers-of-i', difficulty: 'easy', content: { text: '$i^{23}$ มีค่าเท่ากับข้อใด', choices: { a: '$1$', b: '$i$', c: '$-i$', d: '$-1$', e: '$23i$' } }, answer: 'c', hint: 'กำลังของ $i$ วนซ้ำทุก 4 กำลัง', solution: { steps: ['$23=4(5)+3$', '$i^{23}=i^3=-i$'] } }),
  q({ id: 'complex-numbers-exercise-01', kind: 'exercise', topicId: 'complex-numbers', subtopic: 'multiplication', difficulty: 'medium', content: { text: '$(3+2i)(1-i)$ มีค่าเท่ากับข้อใด', choices: { a: '$1+i$', b: '$5-i$', c: '$5+i$', d: '$1-i$', e: '$-5+i$' } }, answer: 'b', hint: 'กระจายพจน์และใช้ $i^2=-1$', solution: { steps: ['$(3+2i)(1-i)=3-3i+2i-2i^2$', 'เมื่อ $i^2=-1$ จึงได้ $5-i$'] } }),
  q({ id: 'counting-probability-example-01', kind: 'example', topicId: 'counting-probability', subtopic: 'counting-principle', difficulty: 'easy', content: { text: 'มีเสื้อ 3 ตัว และกางเกง 4 ตัว ถ้าเลือกอย่างละ 1 ตัว จะจัดชุดได้กี่แบบ', choices: { a: '7', b: '12', c: '16', d: '24', e: '64' } }, answer: 'b', hint: 'ใช้หลักการคูณ', solution: { steps: ['เลือกเสื้อได้ 3 วิธี และกางเกงได้ 4 วิธี', 'จำนวนชุดทั้งหมดคือ $3\\times4=12$ วิธี'] } }),
  q({ id: 'counting-probability-exercise-01', kind: 'exercise', topicId: 'counting-probability', subtopic: 'probability', difficulty: 'medium', content: { text: 'ทอยลูกเต๋ามาตรฐาน 2 ลูกพร้อมกัน ความน่าจะเป็นที่ผลรวมเป็น 7 เท่ากับเท่าใด', choices: { a: '$\\dfrac{1}{12}$', b: '$\\dfrac{1}{9}$', c: '$\\dfrac{1}{6}$', d: '$\\dfrac{1}{4}$', e: '$\\dfrac{1}{3}$' } }, answer: 'c', hint: 'นับผลลัพธ์ที่ผลรวมเป็น 7 จากทั้งหมด 36 แบบ', solution: { steps: ['ผลรวมเป็น 7 ได้ 6 แบบ', 'ดังนั้นความน่าจะเป็นคือ $\\dfrac{6}{36}=\\dfrac16$'] } }),
  q({ id: 'sequences-series-example-01', kind: 'example', topicId: 'sequences-series', subtopic: 'arithmetic-sequence', difficulty: 'easy', content: { text: 'ลำดับเลขคณิตมีพจน์แรกเป็น 5 และผลต่างร่วมเป็น 3 พจน์ที่ 10 มีค่าเท่าใด', choices: { a: '27', b: '32', c: '35', d: '50', e: '75' } }, answer: 'b', hint: 'ใช้ $a_n=a_1+(n-1)d$', solution: { steps: ['$a_{10}=5+(10-1)(3)$', '$a_{10}=32$'] } }),
  q({ id: 'sequences-series-exercise-01', kind: 'exercise', topicId: 'sequences-series', subtopic: 'geometric-sequence', difficulty: 'medium', content: { text: 'ลำดับเรขาคณิต $2,6,18,\\ldots$ พจน์ที่ 5 มีค่าเท่าใด', choices: { a: '54', b: '72', c: '108', d: '162', e: '486' } }, answer: 'd', hint: 'อัตราส่วนร่วมคือ 3', solution: { steps: ['$a_5=2(3)^{5-1}$', '$a_5=2(81)=162$'] } }),
  q({ id: 'calculus-example-01', kind: 'example', topicId: 'calculus', subtopic: 'limits', difficulty: 'easy', content: { text: 'จงหา $\\lim_{x\\to3}\\dfrac{x^2-9}{x-3}$', choices: { a: '0', b: '3', c: '6', d: '9', e: 'ไม่มีลิมิต' } }, answer: 'c', hint: 'แยกตัวประกอบของ $x^2-9$', solution: { steps: ['$x^2-9=(x-3)(x+3)$', 'ตัด $(x-3)$ แล้วแทน $x=3$ ได้ $3+3=6$'] } }),
  q({ id: 'calculus-exercise-01', kind: 'exercise', topicId: 'calculus', subtopic: 'derivatives', difficulty: 'medium', content: { text: 'ถ้า $f(x)=3x^2-4x+7$ แล้ว $f\'(x)$ คือข้อใด', choices: { a: '$3x-4$', b: '$6x-4$', c: '$6x+7$', d: '$3x^2-4$', e: '$6x-4x$' } }, answer: 'b', hint: 'หาอนุพันธ์ทีละพจน์', solution: { steps: ['$\\dfrac{d}{dx}(3x^2)=6x$, $\\dfrac{d}{dx}(-4x)=-4$', 'ค่าคงที่ 7 มีอนุพันธ์เป็น 0', 'ดังนั้น $f\'(x)=6x-4$'] } }),
  q({ id: 'statistics-distributions-example-01', kind: 'example', topicId: 'statistics-distributions', subtopic: 'mean', difficulty: 'easy', content: { text: 'ค่าเฉลี่ยเลขคณิตของข้อมูล $4,6,8,10$ เท่ากับเท่าใด', choices: { a: '6', b: '7', c: '8', d: '9', e: '28' } }, answer: 'b', hint: 'นำผลรวมของข้อมูลหารด้วยจำนวนข้อมูล', solution: { steps: ['ผลรวมคือ $4+6+8+10=28$', 'มีข้อมูล 4 ค่า จึงได้ค่าเฉลี่ย $\\dfrac{28}{4}=7$'] } }),
  q({ id: 'statistics-distributions-exercise-01', kind: 'exercise', topicId: 'statistics-distributions', subtopic: 'median', difficulty: 'medium', content: { text: 'มัธยฐานของข้อมูล $3,5,7,9,11$ เท่ากับเท่าใด', choices: { a: '5', b: '6', c: '7', d: '8', e: '9' } }, answer: 'c', hint: 'ข้อมูลเรียงแล้วและมีจำนวนข้อมูลเป็นจำนวนคี่', solution: { steps: ['มีข้อมูล 5 ค่า ตำแหน่งกึ่งกลางคือค่าที่ 3', 'ค่าที่ 3 คือ 7 จึงเป็นมัธยฐาน'] } }),
]

const answerKeys = ['a', 'b', 'c', 'd', 'e'] as const

function numberChoices(correct: number, distractors: number[], answerIndex: number) {
  const values = [...new Set(distractors.filter(value => value !== correct))].slice(0, 4)
  let next = correct + 1
  while (values.length < 4) {
    if (!values.includes(next)) values.push(next)
    next++
  }
  values.splice(answerIndex, 0, correct)
  return {
    choices: Object.fromEntries(answerKeys.map((key, index) => [key, String(values[index])])) as NonNullable<Question['content']['choices']>,
    answer: answerKeys[answerIndex],
  }
}

function numericSetQuestion({
  id, subtopic, difficulty, text, correct, distractors, hint, steps,
}: {
  id: string
  subtopic: string
  difficulty: Question['difficulty']
  text: string
  correct: number
  distractors: number[]
  hint: string
  steps: string[]
}) {
  const { choices, answer } = numberChoices(correct, distractors, Number(id.slice(-2)) % 5)
  return q({
    id, kind: 'exercise', topicId: 'set', subtopic, difficulty,
    content: { text, choices }, answer, hint, solution: { steps },
  })
}

const setMemberCounts = [
  ['03', '1, 3, 5, 7', 4], ['04', '2, 4, 6, 8, 10', 5], ['05', '0, 1, 2, 3, 4, 5', 6], ['06', '-3, -1, 0, 1, 3', 5],
  ['07', '2, 3, 5, 7, 11, 13, 17', 7], ['08', 'a, e, i, o, u', 5], ['09', '1, 2, 2, 3, 3, 3, 4', 4], ['10', 'แดง, น้ำเงิน, เขียว, เหลือง, ม่วง, ส้ม', 6],
] as const

const setPowerSets = [
  ['11', 2], ['12', 3], ['13', 4], ['14', 5], ['15', 6], ['16', 1], ['17', 7], ['18', 0],
] as const

const setUnionCounts = [
  ['19', 9, 8, 3], ['20', 12, 10, 4], ['21', 15, 11, 5], ['22', 6, 7, 2],
  ['23', 20, 16, 8], ['24', 13, 9, 1], ['25', 18, 14, 6], ['26', 10, 10, 5],
] as const

const setComplementCounts = [
  ['27', 12, 5], ['28', 20, 8], ['29', 15, 9], ['30', 30, 12],
  ['31', 18, 7], ['32', 25, 15], ['33', 10, 4], ['34', 40, 18],
] as const

const setSurveyCounts = [
  ['35', 32, 25, 11], ['36', 40, 28, 13], ['37', 24, 19, 8], ['38', 45, 30, 17],
  ['39', 50, 36, 20], ['40', 27, 21, 9], ['41', 38, 29, 14], ['42', 60, 42, 25],
] as const

const extraSetPracticeQuestions: Question[] = [
  ...setMemberCounts.map(([id, members, correct]) => numericSetQuestion({
    id: `set-exercise-${id}`, subtopic: 'cardinality', difficulty: Number(id) <= 8 ? 'easy' : 'medium',
    text: `กำหนดให้ $A=\\{${members}\\}$ แล้ว $n(A)$ มีค่าเท่าใด`, correct, distractors: [correct - 2, correct - 1, correct + 1, correct + 2],
    hint: 'นับสมาชิกที่แตกต่างกันเท่านั้น สมาชิกที่เขียนซ้ำยังนับเพียงครั้งเดียว',
    steps: [`สมาชิกที่ไม่ซ้ำกันของ $A$ มีทั้งหมด ${correct} ตัว`, `ดังนั้น $n(A)=${correct}$`],
  })),
  ...setPowerSets.map(([id, memberCount]) => {
    const correct = 2 ** memberCount
    return numericSetQuestion({
      id: `set-exercise-${id}`, subtopic: 'power-set', difficulty: memberCount >= 5 ? 'medium' : 'easy',
      text: `ถ้าเซต $A$ มีสมาชิก ${memberCount} ตัว แล้วเพาเวอร์เซต $\\mathcal{P}(A)$ มีสมาชิกกี่เซต`, correct, distractors: [memberCount, 2 * memberCount, correct * 2, correct + 2],
      hint: 'เซตที่มีสมาชิก $n$ ตัว มีสับเซตทั้งหมด $2^n$ เซต',
      steps: [`$n(A)=${memberCount}$`, `$n(\\mathcal{P}(A))=2^{${memberCount}}=${correct}$`],
    })
  }),
  ...setUnionCounts.map(([id, a, b, intersection]) => {
    const correct = a + b - intersection
    return numericSetQuestion({
      id: `set-exercise-${id}`, subtopic: 'inclusion-exclusion', difficulty: 'medium',
      text: `กำหนดให้ $n(A)=${a}$, $n(B)=${b}$ และ $n(A\\cap B)=${intersection}$ แล้ว $n(A\\cup B)$ เท่ากับเท่าใด`, correct, distractors: [a + b, a + b - 2 * intersection, a - b + intersection, correct + intersection],
      hint: 'ตอนรวมสมาชิกของ $A$ กับ $B$ สมาชิกในส่วนร่วมถูกนับซ้ำหนึ่งครั้ง',
      steps: [`$n(A\\cup B)=n(A)+n(B)-n(A\\cap B)$`, `$=${a}+${b}-${intersection}=${correct}$`],
    })
  }),
  ...setComplementCounts.map(([id, universal, memberCount]) => {
    const correct = universal - memberCount
    return numericSetQuestion({
      id: `set-exercise-${id}`, subtopic: 'complement', difficulty: 'easy',
      text: `กำหนดให้ $n(U)=${universal}$ และ $n(A)=${memberCount}$ แล้ว $n(A\')$ เท่ากับเท่าใด`, correct, distractors: [memberCount, universal + memberCount, correct - 2, correct + 2],
      hint: 'คอมพลีเมนต์ของ $A$ คือสมาชิกในเอกภพสัมพัทธ์ที่ไม่อยู่ใน $A$',
      steps: [`$n(A\')=n(U)-n(A)$`, `$=${universal}-${memberCount}=${correct}$`],
    })
  }),
  ...setSurveyCounts.map(([id, math, science, both]) => {
    const correct = math + science - both
    return numericSetQuestion({
      id: `set-exercise-${id}`, subtopic: 'venn-diagram', difficulty: 'hard',
      text: `นักเรียนกลุ่มหนึ่งชอบคณิตศาสตร์ ${math} คน ชอบวิทยาศาสตร์ ${science} คน และชอบทั้งสองวิชา ${both} คน จำนวนนักเรียนที่ชอบอย่างน้อยหนึ่งวิชาเท่ากับเท่าใด`, correct, distractors: [math + science, math + science - 2 * both, math - both, science - both],
      hint: 'ใช้หลักบวกลบรวม โดยหักจำนวนคนที่ชอบทั้งสองวิชาออกหนึ่งครั้ง',
      steps: [`จำนวนที่ชอบอย่างน้อยหนึ่งวิชาคือ $n(M\\cup S)$`, `$=${math}+${science}-${both}=${correct}$ คน`],
    })
  }),
  q({ id: 'set-exercise-43', kind: 'exercise', topicId: 'set', subtopic: 'difference', difficulty: 'medium', content: { text: 'กำหนดให้ $A=\\{1,2,3,4,5,6\\}$ และ $B=\\{2,3,5,7\\}$ แล้ว $A-B$ คือข้อใด', choices: { a: '$\\{2,3,5\\}$', b: '$\\{1,4,6\\}$', c: '$\\{1,2,3,4,5,6,7\\}$', d: '$\\{7\\}$', e: '$\\emptyset$' } }, answer: 'b', hint: 'เก็บสมาชิกที่อยู่ใน $A$ แต่ตัดสมาชิกที่อยู่ใน $B$ ออก', solution: { steps: ['สมาชิกของ $A$ ที่ซ้ำกับ $B$ คือ 2, 3 และ 5', 'จึงเหลือ $A-B=\\{1,4,6\\}$'] } }),
  q({ id: 'set-exercise-44', kind: 'exercise', topicId: 'set', subtopic: 'de-morgan', difficulty: 'hard', content: { text: 'ข้อใดถูกต้องตามกฎของดีมอร์แกน', choices: { a: '$(A\\cup B)\'=A\'\\cup B\'$', b: '$(A\\cap B)\'=A\'\\cap B\'$', c: '$(A\\cup B)\'=A\'\\cap B\'$', d: '$A-B=B-A$', e: '$A\\cup B=A\\cap B$' } }, answer: 'c', hint: 'นิเสธของ “หรือ” จะเปลี่ยนเป็น “และ”', solution: { steps: ['สมาชิกที่ไม่อยู่ใน $A\\cup B$ ต้องไม่อยู่ทั้ง $A$ และ $B$', 'ดังนั้น $(A\\cup B)\'=A\'\\cap B\'$'] } }),
  q({ id: 'set-exercise-45', kind: 'exercise', topicId: 'set', subtopic: 'subset', difficulty: 'medium', content: { text: 'กำหนด $A=\\{1,2,3\\}$ ข้อใดเป็นสับเซตของ $A$', choices: { a: '$\\{1,4\\}$', b: '$\\{2,3\\}$', c: '$\\{0,1\\}$', d: '$\\{1,2,3,4\\}$', e: '$\\{\\{1\\},2\\}$' } }, answer: 'b', hint: 'สับเซตต้องมีสมาชิกทุกตัวอยู่ในเซตเดิม', solution: { steps: ['$\\{2,3\\}$ มีสมาชิกทุกตัวอยู่ใน $A$', 'จึงเป็นสับเซตของ $A$'] } }),
]

export const originalPracticeQuestions: Question[] = [
  ...baseOriginalPracticeQuestions.filter(question => question.topicId !== 'set'),
]

export const legacySetPracticeQuestions: Question[] = [
  ...extraSetPracticeQuestions,
  ...baseOriginalPracticeQuestions.filter(question => question.topicId === 'set'),
]
