import type { Question } from '@/lib/types/question'
import { placeAnswer } from '@/lib/content/answer-position'

type Key = 'a' | 'b' | 'c' | 'd' | 'e'
type Choices = NonNullable<Question['content']['choices']>
const keys: Key[] = ['a', 'b', 'c', 'd', 'e']

function build(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, choices: Choices, answer: Key, hint: string, steps: string[]): Question {
  return {
    id: `real-numbers-challenge-${String(id).padStart(2, '0')}`,
    topicId: 'real-numbers', subtopic, level: 'A-Level', difficulty, type: 'multiple-choice',
    content: { text, choices }, answer, hint, solution: { steps },
    tags: ['original', 'challenge'], source: 'MathPrep original',
  }
}

function q(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, choices: Choices, answer: Key, hint: string, steps: string[]): Question {
  const placed = placeAnswer(choices, answer, id, 2)
  return build(id, subtopic, difficulty, text, placed.choices, placed.answer, hint, steps)
}

function numeric(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, correct: number, distractors: number[], hint: string, steps: string[]): Question {
  const values = [...new Set(distractors.filter(value => value !== correct))].slice(0, 4)
  let next = correct + 1
  while (values.length < 4) {
    if (!values.includes(next) && next !== correct) values.push(next)
    next++
  }
  const index = (id * 2 + 1) % 5
  values.splice(index, 0, correct)
  const choices = Object.fromEntries(keys.map((key, i) => [key, String(values[i])])) as Choices
  return build(id, subtopic, difficulty, text, choices, keys[index], hint, steps)
}

const structure: Question[] = [
  q(1, 'number-system', 'medium', 'ข้อใดเป็นจำนวนอตรรกยะ', { a: '$\\dfrac{7}{11}$', b: '$0.\\overline{27}$', c: '$\\sqrt{18}$', d: '$\\sqrt{49}$', e: '$-3.125$' }, 'c', 'จำนวนตรรกยะเขียนเป็นเศษส่วนของจำนวนเต็มได้', ['$\\sqrt{18}=3\\sqrt2$ ซึ่งเป็นจำนวนอตรรกยะ', 'ตัวเลือกอื่นเป็นจำนวนตรรกยะทั้งหมด']),
  q(2, 'number-system', 'hard', 'ข้อใดเป็นจริงเสมอสำหรับจำนวนจริง $a,b$', { a: 'ถ้า $a^2=b^2$ แล้ว $a=b$', b: 'ถ้า $a<b$ แล้ว $a^2<b^2$', c: 'ถ้า $ab=0$ แล้ว $a=0$ หรือ $b=0$', d: '$\\sqrt{a^2}=a$', e: 'ถ้า $a\\ne0$ แล้ว $a+\\dfrac1a\\ge2$' }, 'c', 'ลองทดสอบจำนวนลบกับข้อความที่มีกำลังสองและราก', ['สมบัติผลคูณเป็นศูนย์ให้ $a=0$ หรือ $b=0$', 'ข้ออื่นมีตัวอย่างโต้แย้งจากจำนวนลบ']),
  numeric(3, 'custom-operation', 'medium', 'กำหนด $x*y=x+y-xy$ แล้ว $3*4$ เท่ากับเท่าใด', -5, [-12, 7, 11, 19], 'แทนค่าในนิยามตามลำดับ', ['$3*4=3+4-(3)(4)$', '$=7-12=-5$']),
  numeric(4, 'custom-operation', 'hard', 'กำหนด $x*y=x+y+xy$ เอกลักษณ์ $e$ ที่ทำให้ $x*e=x$ สำหรับทุก $x$ มีค่าเท่าใด', 0, [-1, 1, 2, -2], 'ตั้งสมการ $x+e+xe=x$', ['$e(1+x)=0$ สำหรับทุก $x$', 'จึงต้องมี $e=0$']),
  q(5, 'custom-operation', 'hard', 'กำหนด $x*y=x+y+xy$ ถ้า $2*y=0$ แล้ว $y$ เท่ากับเท่าใด', { a: '$-2$', b: '$-\\dfrac23$', c: '$\\dfrac23$', d: '$-\\dfrac12$', e: '$0$' }, 'b', 'แก้สมการจากนิยามโดยตรง', ['$2+y+2y=0$', '$3y=-2$ จึง $y=-\\dfrac23$']),
  numeric(6, 'symmetric-expression', 'medium', 'ถ้า $x+\\dfrac1x=3$ แล้ว $x^2+\\dfrac1{x^2}$ เท่ากับเท่าใด', 7, [5, 6, 8, 9], 'ยกกำลังสองสมการที่กำหนด', ['$\\left(x+\\dfrac1x\\right)^2=x^2+2+\\dfrac1{x^2}=9$', 'ดังนั้นค่าที่ต้องการเท่ากับ 7']),
  numeric(7, 'symmetric-expression', 'medium', 'ถ้า $a+b=5$ และ $ab=3$ แล้ว $a^2+b^2$ เท่ากับเท่าใด', 19, [13, 16, 22, 25], 'ใช้ $(a+b)^2=a^2+b^2+2ab$', ['$a^2+b^2=5^2-2(3)$', '$=25-6=19$']),
  numeric(8, 'symmetric-expression', 'hard', 'ถ้า $a-b=4$ และ $ab=5$ แล้ว $a^2+b^2$ เท่ากับเท่าใด', 26, [6, 16, 21, 36], 'ใช้ $(a-b)^2=a^2+b^2-2ab$', ['$a^2+b^2=(a-b)^2+2ab$', '$=16+10=26$']),
  q(9, 'rationalization', 'medium', '$\\dfrac1{\\sqrt5-2}$ เท่ากับข้อใด', { a: '$\\sqrt5-2$', b: '$\\sqrt5+2$', c: '$5+2\\sqrt5$', d: '$\\dfrac{\\sqrt5+2}{5}$', e: '$3$' }, 'b', 'คูณด้วยสังยุคของส่วน', ['$\\dfrac1{\\sqrt5-2}\\cdot\\dfrac{\\sqrt5+2}{\\sqrt5+2}$', 'ส่วนเป็น $5-4=1$ จึงได้ $\\sqrt5+2$']),
  numeric(10, 'indices', 'hard', 'ถ้า $2^x=8\\sqrt2$ แล้ว $x$ เท่ากับเท่าใด', 3.5, [2.5, 3, 4, 4.5], 'เขียนรากให้อยู่ในรูปเลขชี้กำลัง', ['$8\\sqrt2=2^3\\cdot2^{1/2}=2^{7/2}$', 'ดังนั้น $x=\\dfrac72=3.5$']),
]

const polynomials: Question[] = [
  q(11, 'quadratic', 'medium', 'รากของ $2x^2-7x+3=0$ มีผลบวกเท่าใด', { a: '$-\\dfrac72$', b: '$\\dfrac32$', c: '$\\dfrac72$', d: '$3$', e: '$7$' }, 'c', 'ใช้สูตรผลบวกราก $-b/a$', ['$x_1+x_2=-\\dfrac{-7}{2}=\\dfrac72$']),
  q(12, 'quadratic', 'medium', 'สมการกำลังสองที่มีรากเป็น $2$ และ $-5$ คือข้อใด', { a: '$x^2-3x-10=0$', b: '$x^2+3x-10=0$', c: '$x^2-7x+10=0$', d: '$x^2+7x+10=0$', e: '$x^2-3x+10=0$' }, 'b', 'สร้างจาก $(x-r_1)(x-r_2)$', ['$(x-2)(x+5)=0$', 'กระจายได้ $x^2+3x-10=0$']),
  numeric(13, 'remainder-theorem', 'medium', 'เศษจากการหาร $P(x)=2x^3-3x^2+4x-5$ ด้วย $x-2$ เท่ากับเท่าใด', 7, [3, 5, 9, 11], 'ใช้ทฤษฎีบทเศษเหลือ คำนวณ $P(2)$', ['$P(2)=2(8)-3(4)+4(2)-5$', '$=16-12+8-5=7$']),
  numeric(14, 'factor-theorem', 'hard', 'ถ้า $x-3$ เป็นตัวประกอบของ $x^3+kx^2-5x-3$ แล้ว $k$ เท่ากับเท่าใด', -1, [-3, -2, 1, 2], 'ตัวประกอบ $x-3$ ทำให้ $P(3)=0$', ['$27+9k-15-3=0$', '$9k+9=0$ จึง $k=-1$']),
  numeric(15, 'remainder-theorem', 'hard', 'พหุนาม $P(x)$ หารด้วย $x-1$ เหลือเศษ 3 และหารด้วย $x+1$ เหลือเศษ 7 ถ้า $P(x)$ หารด้วย $x^2-1$ เหลือเศษ $ax+b$ แล้ว $a+b$ เท่ากับเท่าใด', 3, [-5, -2, 5, 7], 'แทน $x=1,-1$ ในเศษ $ax+b$', ['$a+b=P(1)=3$', 'จึงตอบได้ทันทีว่า $a+b=3$']),
  numeric(16, 'factor-theorem', 'hard', 'ถ้า $x+2$ เป็นตัวประกอบของ $2x^3-3x^2+kx+10$ แล้ว $k$ เท่ากับเท่าใด', -9, [-19, -7, 7, 9], 'ใช้ $P(-2)=0$', ['$2(-8)-3(4)-2k+10=0$', '$-18-2k=0$ จึง $k=-9$']),
  numeric(17, 'vieta', 'hard', 'ถ้า $\\alpha,\\beta$ เป็นรากของ $x^2-6x+2=0$ แล้ว $\\alpha^2+\\beta^2$ เท่ากับเท่าใด', 32, [28, 30, 34, 36], 'ใช้ผลบวกและผลคูณของราก', ['$\\alpha+\\beta=6$ และ $\\alpha\\beta=2$', '$\\alpha^2+\\beta^2=6^2-2(2)=32$']),
  q(18, 'vieta', 'hard', 'ถ้า $\\alpha,\\beta$ เป็นรากของ $2x^2-5x+1=0$ แล้ว $\\dfrac1\\alpha+\\dfrac1\\beta$ เท่ากับเท่าใด', { a: '$\\dfrac25$', b: '$\\dfrac52$', c: '$5$', d: '$1$', e: '$-5$' }, 'c', 'รวมเศษส่วนแล้วใช้ผลบวกและผลคูณของราก', ['$\\dfrac1\\alpha+\\dfrac1\\beta=\\dfrac{\\alpha+\\beta}{\\alpha\\beta}$', '$=\\dfrac{5/2}{1/2}=5$']),
  numeric(19, 'discriminant', 'medium', 'สมการ $x^2-4x+k=0$ มีรากจริงซ้ำกันเมื่อ $k$ เท่ากับเท่าใด', 4, [0, 2, 8, 16], 'รากซ้ำเกิดเมื่อดิสคริมิแนนต์เป็นศูนย์', ['$(-4)^2-4(1)k=0$', '$16-4k=0$ จึง $k=4$']),
  numeric(20, 'polynomial-roots', 'hard', 'สมการ $x^4-5x^2+4=0$ มีรากจริงที่แตกต่างกันกี่ราก', 4, [0, 1, 2, 3], 'แทน $u=x^2$ แล้วแก้สมการกำลังสอง', ['$(x^2-1)(x^2-4)=0$', '$x=\\pm1,\\pm2$ รวม 4 ราก']),
]

const inequalities: Question[] = [
  q(21, 'inequality', 'medium', 'เซตคำตอบของ $(x-2)(x+3)>0$ คือข้อใด', { a: '$(-3,2)$', b: '$(-\\infty,-3)\\cup(2,\\infty)$', c: '$[-3,2]$', d: '$(-\\infty,2)$', e: '$(-3,\\infty)$' }, 'b', 'พหุนามกำลังสองสัมประสิทธิ์นำเป็นบวก', ['จุดเปลี่ยนเครื่องหมายคือ $-3,2$', 'ผลคูณเป็นบวกนอกช่วงราก']),
  q(22, 'inequality', 'medium', 'เซตคำตอบของ $x^2-5x+6\\le0$ คือข้อใด', { a: '$(-\\infty,2]$', b: '$[2,3]$', c: '$[3,\\infty)$', d: '$(-\\infty,2]\\cup[3,\\infty)$', e: '$(2,3)$' }, 'b', 'แยกเป็น $(x-2)(x-3)$', ['พาราโบลาหงายและต้องการค่าไม่เกินศูนย์', 'จึงได้ $2\\le x\\le3$']),
  q(23, 'inequality', 'hard', 'เซตคำตอบของ $\\dfrac{x-1}{x+2}<0$ คือข้อใด', { a: '$(-\\infty,-2)$', b: '$(-2,1)$', c: '$(1,\\infty)$', d: '$(-\\infty,-2)\\cup(1,\\infty)$', e: '$[-2,1]$' }, 'b', 'ทำตารางเครื่องหมายที่ $x=-2,1$', ['เศษและส่วนมีเครื่องหมายต่างกันในช่วง $(-2,1)$', '$x=-2$ ทำให้ส่วนเป็นศูนย์ และ $x=1$ ทำให้ค่าเป็น 0 ซึ่งไม่น้อยกว่า 0 จึงไม่รวมปลายทั้งสอง']),
  q(24, 'inequality', 'hard', 'เซตคำตอบของ $\\dfrac{x+1}{x-3}\\ge1$ คือข้อใด', { a: '$(-\\infty,3)$', b: '$(3,\\infty)$', c: '$(-\\infty,-1]$', d: '$[-1,3)$', e: 'จำนวนจริงทุกจำนวนยกเว้น 3' }, 'b', 'ย้าย 1 มารวมเป็นเศษส่วนเดียวก่อน', ['$\\dfrac{x+1}{x-3}-1=\\dfrac4{x-3}\\ge0$', 'เศษเป็นบวก จึงต้อง $x-3>0$ หรือ $x>3$']),
  numeric(25, 'inequality', 'hard', 'จำนวนเต็มที่สอดคล้องกับ $-2<\\dfrac{3x-1}{2}\\le7$ มีทั้งหมดกี่จำนวน', 6, [5, 7, 8, 9], 'แก้อสมการประกอบแล้วนับจำนวนเต็ม', ['$-4<3x-1\\le14$ จึง $-3<3x\\le15$', '$-1<x\\le5$ ให้ $x=0,1,2,3,4,5$ รวม 6 จำนวน']),
  q(26, 'intervals', 'medium', 'ถ้า $A=[-2,4)$ และ $B=(1,6]$ แล้ว $A\\cap B$ เท่ากับข้อใด', { a: '$[-2,6]$', b: '$(1,4)$', c: '$[1,4]$', d: '$(1,6]$', e: '$[-2,1]$' }, 'b', 'ส่วนร่วมต้องอยู่ในทั้งสองช่วงพร้อมกัน', ['ขอบซ้ายต้องมากกว่า 1 และขอบขวาต้องน้อยกว่า 4', 'ปลายทั้งสองไม่รวม จึงได้ $(1,4)$']),
  q(27, 'bounds', 'medium', 'ถ้า $-1<x<3$ แล้วช่วงค่าของ $2x-5$ คือข้อใด', { a: '$-7<2x-5<1$', b: '$-3<2x-5<11$', c: '$-7\\le2x-5\\le1$', d: '$-5<2x-5<3$', e: '$-6<2x-5<0$' }, 'a', 'คูณด้วยจำนวนบวกแล้วลบ 5 ทุกส่วน', ['$-2<2x<6$', '$-7<2x-5<1$']),
  numeric(28, 'bounds', 'hard', 'ถ้า $1\\le x\\le4$ และ $-2\\le y\\le3$ ค่าสูงสุดของ $2x-y$ เท่ากับเท่าใด', 10, [5, 7, 8, 11], 'ต้องการ $x$ มากที่สุดและ $y$ น้อยที่สุด', ['$2x-y$ สูงสุดเมื่อ $x=4,y=-2$', '$2(4)-(-2)=10$']),
  q(29, 'inequality', 'medium', 'เซตคำตอบของ $\\dfrac1{x-2}>0$ คือข้อใด', { a: '$x<2$', b: '$x>2$', c: '$x\\ne2$', d: '$x\\ge2$', e: '$x\\le2$' }, 'b', 'เศษเป็นบวกคงที่ เครื่องหมายจึงขึ้นกับส่วน', ['$x-2$ ต้องเป็นบวก', 'ดังนั้น $x>2$']),
  q(30, 'inequality', 'hard', 'เซตคำตอบของ $x(x-1)(x+2)\\le0$ คือข้อใด', { a: '$(-\\infty,-2]\\cup[0,1]$', b: '$[-2,0]\\cup[1,\\infty)$', c: '$(-\\infty,0]$', d: '$[-2,1]$', e: '$(-\\infty,-2)\\cup(0,1)$' }, 'a', 'เรียงราก $-2,0,1$ แล้วสลับเครื่องหมายตามช่วง', ['พหุนามดีกรีสามสัมประสิทธิ์นำเป็นบวก มีเครื่องหมาย $-,+,-,+$', 'เลือกช่วงไม่เป็นบวกและรวมราก ได้ $(-\\infty,-2]\\cup[0,1]$']),
]

const absoluteAndRadicals: Question[] = [
  numeric(31, 'absolute-value', 'medium', 'ผลบวกของคำตอบทั้งหมดของ $|2x-3|=5$ เท่ากับเท่าใด', 3, [-3, 1, 5, 8], 'แยกเป็นสองสมการ', ['$2x-3=5$ ให้ $x=4$', '$2x-3=-5$ ให้ $x=-1$', 'ผลบวกเท่ากับ 3']),
  numeric(32, 'absolute-value', 'medium', 'จำนวนเต็มที่สอดคล้องกับ $|x-1|<3$ มีทั้งหมดกี่จำนวน', 5, [4, 6, 7, 8], 'แปลงเป็นอสมการประกอบ', ['$-3<x-1<3$ จึง $-2<x<4$', 'จำนวนเต็มคือ $-1,0,1,2,3$ รวม 5 จำนวน']),
  q(33, 'absolute-value', 'medium', 'เซตคำตอบของ $|x+2|\\ge4$ คือข้อใด', { a: '$[-6,2]$', b: '$(-\\infty,-6]\\cup[2,\\infty)$', c: '$(-6,2)$', d: '$(-\\infty,-2]\\cup[4,\\infty)$', e: '$[-2,4]$' }, 'b', 'ระยะจาก $-2$ ต้องไม่น้อยกว่า 4', ['$x+2\\le-4$ หรือ $x+2\\ge4$', 'จึง $x\\le-6$ หรือ $x\\ge2$']),
  numeric(34, 'absolute-value', 'hard', 'ค่าต่ำสุดของ $|x-1|+|x-3|$ เมื่อ $x$ เป็นจำนวนจริงเท่ากับเท่าใด', 2, [0, 1, 3, 4], 'มองเป็นผลรวมระยะทางจาก $x$ ไปยัง 1 และ 3', ['เมื่อ $1\\le x\\le3$ ผลรวมระยะทางคงที่เท่ากับ $3-1$', 'ค่าต่ำสุดจึงเป็น 2']),
  numeric(35, 'absolute-value', 'hard', 'สมการ $|x-2|+|x+1|=5$ มีคำตอบจริงกี่คำตอบ', 2, [0, 1, 3, 4], 'แบ่งช่วงที่จุดเปลี่ยนเครื่องหมาย $-1,2$', ['เมื่อ $x\\ge2$ ได้ $x=3$', 'เมื่อ $x\\le-1$ ได้ $x=-2$', 'ช่วงกลางให้ผลรวม 3 จึงไม่มีคำตอบ รวม 2 คำตอบ']),
  q(36, 'radical-equation', 'hard', 'คำตอบของ $\\sqrt{x+3}=x-1$ คือข้อใด', { a: '$\\dfrac{3+\\sqrt{17}}2$', b: '$\\dfrac{3-\\sqrt{17}}2$', c: '$\\dfrac{-3+\\sqrt{17}}2$', d: '$2$', e: 'ไม่มีคำตอบ' }, 'a', 'ต้องมี $x\\ge1$ ก่อนยกกำลังสอง', ['$x+3=(x-1)^2$ จึง $x^2-3x-2=0$', '$x=\\dfrac{3\\pm\\sqrt{17}}2$', 'เงื่อนไข $x\\ge1$ เหลือเพียง $\\dfrac{3+\\sqrt{17}}2$']),
  numeric(37, 'radical-equation', 'medium', 'คำตอบของ $\\sqrt{2x+3}=x$ เท่ากับเท่าใด', 3, [-3, -1, 1, 5], 'ด้านขวาต้องไม่ติดลบก่อนยกกำลังสอง', ['$2x+3=x^2$ จึง $(x-3)(x+1)=0$', '$x=-1$ ไม่ผ่านเงื่อนไข $x\\ge0$ จึงเหลือ $x=3$']),
  q(38, 'radical-equation', 'hard', 'ถ้า $\\sqrt{x+4}+\\sqrt{x}=4$ แล้ว $x$ เท่ากับเท่าใด', { a: '$\\dfrac14$', b: '$1$', c: '$\\dfrac94$', d: '$4$', e: '$\\dfrac{25}4$' }, 'c', 'แยกรากหนึ่งข้างแล้วค่อยยกกำลังสอง', ['$\\sqrt{x+4}=4-\\sqrt x$', 'ยกกำลังสองได้ $x+4=16-8\\sqrt x+x$', '$\\sqrt x=\\dfrac32$ จึง $x=\\dfrac94$']),
  q(39, 'radicals', 'medium', '$\\sqrt{50}-2\\sqrt8$ เท่ากับข้อใด', { a: '$\\sqrt2$', b: '$2\\sqrt2$', c: '$3\\sqrt2$', d: '$7\\sqrt2$', e: '$\\sqrt{42}$' }, 'a', 'แยกตัวประกอบกำลังสองสมบูรณ์ในราก', ['$\\sqrt{50}=5\\sqrt2$ และ $2\\sqrt8=4\\sqrt2$', 'ผลต่างคือ $\\sqrt2$']),
  q(40, 'rationalization', 'medium', '$\\dfrac3{\\sqrt7+2}$ เท่ากับข้อใด', { a: '$\\sqrt7+2$', b: '$\\sqrt7-2$', c: '$3\\sqrt7-6$', d: '$\\dfrac{\\sqrt7-2}{3}$', e: '$\\sqrt3$' }, 'b', 'คูณด้วยสังยุคของส่วน', ['$\\dfrac3{\\sqrt7+2}\\cdot\\dfrac{\\sqrt7-2}{\\sqrt7-2}$', 'ส่วนเป็น $7-4=3$ ตัดกับเศษ เหลือ $\\sqrt7-2$']),
]

const numberTheory: Question[] = [
  numeric(41, 'gcd-lcm', 'medium', 'ห.ร.ม. ของ 252 และ 198 เท่ากับเท่าใด', 18, [6, 9, 12, 36], 'ใช้ขั้นตอนวิธีของยุคลิด', ['$252=198+54$', '$198=3(54)+36$', '$54=36+18$ จึง ห.ร.ม. เท่ากับ 18']),
  numeric(42, 'gcd-lcm', 'medium', 'ค.ร.น. ของ 72 และ 120 เท่ากับเท่าใด', 360, [240, 480, 720, 840], 'แยกตัวประกอบเฉพาะแล้วเลือกเลขชี้กำลังสูงสุด', ['$72=2^3\\cdot3^2$ และ $120=2^3\\cdot3\\cdot5$', 'ค.ร.น. $=2^3\\cdot3^2\\cdot5=360$']),
  numeric(43, 'gcd-lcm', 'hard', 'จำนวนบวก $a,b$ มี ห.ร.ม. เท่ากับ 12 และ ค.ร.น. เท่ากับ 420 ถ้า $a=60$ แล้ว $b$ เท่ากับเท่าใด', 84, [72, 96, 108, 120], 'ใช้ $ab=\\gcd(a,b)\\operatorname{lcm}(a,b)$', ['$60b=12(420)$', '$b=84$']),
  numeric(44, 'modular-arithmetic', 'hard', 'เศษจากการหาร $2^{20}$ ด้วย 7 เท่ากับเท่าใด', 4, [0, 1, 2, 6], 'กำลังของ 2 เมื่อหาร 7 มีคาบ 3', ['$2^3\\equiv1\\pmod7$', '$20=3(6)+2$ จึง $2^{20}\\equiv2^2=4\\pmod7$']),
  numeric(45, 'modular-arithmetic', 'medium', 'เลขหลักหน่วยของ $7^{2025}$ คือเลขใด', 7, [1, 3, 9, 5], 'เลขหลักหน่วยของกำลัง 7 วนทุก 4 ขั้น', ['$2025\\equiv1\\pmod4$', 'จึงมีหลักหน่วยเหมือน $7^1$ คือ 7']),
  numeric(46, 'divisors', 'hard', 'จำนวนตัวหารบวกทั้งหมดของ 360 เท่ากับเท่าใด', 24, [12, 18, 20, 30], 'แยกตัวประกอบเฉพาะแล้วบวก 1 ที่เลขชี้กำลัง', ['$360=2^3\\cdot3^2\\cdot5$', 'จำนวนตัวหาร $=(3+1)(2+1)(1+1)=24$']),
  numeric(47, 'divisors', 'hard', 'ผลบวกของตัวหารบวกทั้งหมดของ 72 เท่ากับเท่าใด', 195, [156, 180, 216, 234], 'ใช้ผลคูณของผลบวกกำลังจำนวนเฉพาะ', ['$72=2^3\\cdot3^2$', 'ผลบวกตัวหาร $=(1+2+4+8)(1+3+9)=15(13)=195$']),
  numeric(48, 'gcd-lcm', 'medium', 'จำนวนนับที่น้อยที่สุดซึ่งหารด้วย 12, 18 และ 30 ลงตัว เท่ากับเท่าใด', 180, [90, 120, 360, 540], 'โจทย์ถาม ค.ร.น. ของทั้งสามจำนวน', ['$12=2^2\\cdot3$, $18=2\\cdot3^2$, $30=2\\cdot3\\cdot5$', 'ค.ร.น. $=2^2\\cdot3^2\\cdot5=180$']),
  numeric(49, 'modular-arithmetic', 'hard', 'จำนวนเต็มบวกที่น้อยที่สุดซึ่งเมื่อหารด้วย 5 เหลือเศษ 2 และหารด้วย 7 เหลือเศษ 3 เท่ากับเท่าใด', 17, [12, 22, 27, 32], 'ไล่จำนวนรูป $5k+2$ แล้วตรวจเศษเมื่อหาร 7', ['จำนวนรูป $5k+2$ คือ $2,7,12,17,\\ldots$', '$17\\equiv3\\pmod7$ จึงเป็นค่าน้อยที่สุด']),
  numeric(50, 'gcd', 'hard', 'สำหรับจำนวนนับ $n$ ใด ๆ ห.ร.ม. ของ $2n+1$ และ $4n+3$ เท่ากับเท่าใด', 1, [2, 3, 4, 2 * 1 + 1], 'ใช้ผลต่างเชิงเส้นของสองจำนวน', ['$2(2n+1)-(4n+3)=-1$', 'ตัวหารร่วมต้องหาร 1 ลงตัว จึงมี ห.ร.ม. เท่ากับ 1']),
]

export const realNumbersChallengeQuestions: Question[] = [
  ...structure, ...polynomials, ...inequalities, ...absoluteAndRadicals, ...numberTheory,
]

if (realNumbersChallengeQuestions.length !== 50) throw new Error(`Expected 50 real-number questions, received ${realNumbersChallengeQuestions.length}`)
const ids = new Set<string>()
for (const item of realNumbersChallengeQuestions) {
  if (ids.has(item.id)) throw new Error(`Duplicate real-number question id: ${item.id}`)
  ids.add(item.id)
  const choices = item.content.choices
  if (!choices || !(item.answer in choices)) throw new Error(`Invalid answer key for ${item.id}`)
  if (new Set(Object.values(choices)).size !== 5) throw new Error(`Duplicate choices in ${item.id}`)
}
