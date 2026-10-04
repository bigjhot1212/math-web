import type { Question } from '@/lib/types/question'
import { placeAnswer } from '@/lib/content/answer-position'

type Key = 'a' | 'b' | 'c' | 'd' | 'e'
type Choices = NonNullable<Question['content']['choices']>
const keys: Key[] = ['a', 'b', 'c', 'd', 'e']

function build(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, choices: Choices, answer: Key, hint: string, steps: string[]): Question {
  return { id: `exponential-logarithm-challenge-${String(id).padStart(2, '0')}`, topicId: 'exponential-logarithm', subtopic, level: 'A-Level', difficulty, type: 'multiple-choice', content: { text, choices }, answer, hint, solution: { steps }, tags: ['original', 'challenge'], source: 'MathPrep original' }
}

function q(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, choices: Choices, answer: Key, hint: string, steps: string[]): Question {
  const placed = placeAnswer(choices, answer, id, 0)
  return build(id, subtopic, difficulty, text, placed.choices, placed.answer, hint, steps)
}

function numeric(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, correct: number, distractors: number[], hint: string, steps: string[]): Question {
  const values = [...new Set(distractors.filter(value => value !== correct))].slice(0, 4)
  let next = correct + 1
  while (values.length < 4) { if (next !== correct && !values.includes(next)) values.push(next); next++ }
  const index = (id * 2 + 3) % 5
  values.splice(index, 0, correct)
  return build(id, subtopic, difficulty, text, Object.fromEntries(keys.map((key, i) => [key, String(values[i])])) as Choices, keys[index], hint, steps)
}

const powers: Question[] = [
  numeric(1, 'indices', 'medium', '$\\dfrac{2^3\\cdot2^5}{2^4}$ มีค่าเท่าใด', 16, [4, 8, 32, 64], 'เมื่อคูณให้บวกเลขชี้กำลัง เมื่อหารให้ลบ', ['$2^{3+5-4}=2^4$', '$=16$']),
  numeric(2, 'fractional-indices', 'medium', '$27^{2/3}$ มีค่าเท่าใด', 9, [3, 6, 18, 81], 'ถอดรากที่สามก่อนแล้วยกกำลังสอง', ['$27^{1/3}=3$', '$27^{2/3}=3^2=9$']),
  q(3, 'negative-indices', 'medium', '$16^{-3/4}$ มีค่าเท่าใด', { a: '$\\dfrac18$', b: '$\\dfrac14$', c: '$8$', d: '$-8$', e: '$\\dfrac1{16}$' }, 'a', 'เลขชี้กำลังลบทำให้กลับเศษส่วน', ['$16^{3/4}=(16^{1/4})^3=2^3=8$', 'ดังนั้น $16^{-3/4}=\\dfrac18$']),
  numeric(4, 'indices', 'hard', 'กำหนด $a>0$, $a\\ne1$ ถ้า $\\dfrac{(a^x)^3a^2}{a^5}=a^9$ แล้ว $x$ เท่ากับเท่าใด', 4, [2, 3, 5, 6], 'รวมเลขชี้กำลังก่อนเทียบกัน', ['$a^{3x+2-5}=a^{3x-3}=a^9$', '$3x-3=9$ จึง $x=4$']),
  q(5, 'fractional-indices', 'medium', '$\\sqrt[3]{x^2}$ เมื่อ $x>0$ เขียนเป็นเลขยกกำลังได้อย่างไร', { a: '$x^{2/3}$', b: '$x^{3/2}$', c: '$x^6$', d: '$x^{-2/3}$', e: '$2x^{1/3}$' }, 'a', 'รากที่ $n$ เท่ากับยกกำลัง $1/n$', ['$\\sqrt[3]{x^2}=(x^2)^{1/3}$', '$=x^{2/3}$']),
  q(6, 'surds', 'hard', 'ถ้า $a=2^{1/2}$ และ $b=2^{1/3}$ แล้ว $a^2b^3$ เท่ากับเท่าใด', { a: '$2$', b: '$4$', c: '$8$', d: '$2^{5/6}$', e: '$2^{6/5}$' }, 'b', 'คูณเลขชี้กำลังเมื่อยกกำลังซ้อน', ['$a^2=2$ และ $b^3=2$', '$a^2b^3=4$']),
  numeric(7, 'indices', 'hard', 'ถ้า $8^x=4^{x+1}$ แล้ว $x$ เท่ากับเท่าใด', 2, [-2, -1, 1, 4], 'เปลี่ยนทั้งสองข้างเป็นฐาน 2', ['$2^{3x}=2^{2x+2}$', '$3x=2x+2$ จึง $x=2$']),
  q(8, 'indices', 'hard', 'นิพจน์ $\\dfrac{x^{3/2}x^{-1/3}}{x^{1/6}}$ เมื่อ $x>0$ เท่ากับข้อใด', { a: '$x$', b: '$x^{2/3}$', c: '$x^{4/3}$', d: '$x^2$', e: '$x^{-1}$' }, 'a', 'รวมเลขชี้กำลัง $\\frac32-\\frac13-\\frac16$', ['$\\dfrac32-\\dfrac13-\\dfrac16=1$', 'จึงได้นิพจน์เท่ากับ $x$']),
  numeric(9, 'indices', 'medium', 'ถ้า $3^a=5$ และ $3^b=7$ แล้ว $3^{a+b}$ เท่ากับเท่าใด', 35, [12, 21, 25, 49], 'ใช้ $3^{a+b}=3^a3^b$', ['$3^{a+b}=5\\cdot7$', '$=35$']),
  numeric(10, 'indices', 'hard', 'ถ้า $x^{1/2}=3$ และ $y^{1/3}=2$ แล้ว $xy$ เท่ากับเท่าใด', 72, [6, 12, 18, 36], 'หาค่า $x,y$ แยกกันก่อน', ['$x=3^2=9$ และ $y=2^3=8$', '$xy=9(8)=72$']),
]

const exponentialEquations: Question[] = [
  numeric(11, 'exponential-equation', 'medium', 'ถ้า $2^{x+1}=16$ แล้ว $x$ เท่ากับเท่าใด', 3, [1, 2, 4, 5], 'เขียน 16 เป็นฐาน 2', ['$2^{x+1}=2^4$', '$x+1=4$ จึง $x=3$']),
  numeric(12, 'exponential-equation', 'medium', 'ถ้า $3^{2x-1}=27$ แล้ว $x$ เท่ากับเท่าใด', 2, [1, 1.5, 2.5, 3], 'เขียน 27 เป็น $3^3$', ['$2x-1=3$', '$x=2$']),
  numeric(13, 'exponential-equation', 'medium', 'ถ้า $4^x=8$ แล้ว $x$ เท่ากับเท่าใด', 1.5, [0.5, 1, 2, 3], 'เปลี่ยนเป็นฐาน 2', ['$2^{2x}=2^3$', '$2x=3$ จึง $x=1.5$']),
  numeric(14, 'exponential-equation', 'medium', 'ถ้า $5^x=\\dfrac1{125}$ แล้ว $x$ เท่ากับเท่าใด', -3, [-5, -2, 2, 3], '$125=5^3$', ['$\\dfrac1{125}=5^{-3}$', 'ดังนั้น $x=-3$']),
  numeric(15, 'exponential-equation', 'hard', 'ถ้า $2^x+2^{x+1}=24$ แล้ว $x$ เท่ากับเท่าใด', 3, [2, 4, 6, 8], 'ดึง $2^x$ เป็นตัวร่วม', ['$2^x(1+2)=24$', '$2^x=8=2^3$ จึง $x=3$']),
  numeric(16, 'exponential-equation', 'hard', 'ผลบวกของคำตอบทั้งหมดของ $9^x-10\\cdot3^x+9=0$ เท่ากับเท่าใด', 2, [0, 1, 3, 9], 'ให้ $u=3^x>0$', ['$u^2-10u+9=0$ จึง $u=1,9$', '$3^x=1$ ให้ $x=0$ และ $3^x=9$ ให้ $x=2$', 'ผลบวกเท่ากับ 2']),
  numeric(17, 'exponential-equation', 'hard', 'สมการ $4^x-5\\cdot2^x+4=0$ มีคำตอบจริงกี่คำตอบ', 2, [0, 1, 3, 4], 'ให้ $u=2^x>0$', ['$u^2-5u+4=0$ จึง $u=1,4$', 'ได้ $x=0,2$ รวม 2 คำตอบ']),
  q(18, 'exponential-equation', 'hard', 'คำตอบของ $2^x=3$ คือข้อใด', { a: '$\\log_2 3$', b: '$\\log_3 2$', c: '$\\dfrac23$', d: '$\\ln2+\\ln3$', e: '$3^2$' }, 'a', 'นิยามลอการิทึมกลับจากรูปเลขยกกำลัง', ['$2^x=3$', 'จึง $x=\\log_2 3$']),
  q(19, 'exponential-inequality', 'medium', 'เซตคำตอบของ $3^{x-1}>9$ คือข้อใด', { a: '$x>2$', b: '$x>3$', c: '$x<3$', d: '$x\\ge3$', e: '$x<2$' }, 'b', 'ฐาน 3 มากกว่า 1 จึงคงทิศอสมการ', ['$3^{x-1}>3^2$', '$x-1>2$ จึง $x>3$']),
  q(20, 'exponential-inequality', 'hard', 'เซตคำตอบของ $\\left(\\dfrac12\\right)^{2x-1}\\le\\left(\\dfrac12\\right)^3$ คือข้อใด', { a: '$x\\le2$', b: '$x\\ge2$', c: '$x<1$', d: '$x>1$', e: '$x\\ge1$' }, 'b', 'ฐานอยู่ระหว่าง 0 กับ 1 จึงกลับทิศเมื่อเทียบเลขชี้กำลัง', ['$2x-1\\ge3$', '$2x\\ge4$ จึง $x\\ge2$']),
]

const logProperties: Question[] = [
  numeric(21, 'log-definition', 'medium', '$\\log_2 64$ มีค่าเท่าใด', 6, [4, 5, 8, 32], 'หาเลขชี้กำลังที่ทำให้ 2 ยกกำลังแล้วได้ 64', ['$64=2^6$', 'ดังนั้น $\\log_2 64=6$']),
  q(22, 'log-definition', 'medium', '$\\log_{1/3}27$ มีค่าเท่าใด', { a: '$-3$', b: '$-\\dfrac13$', c: '$3$', d: '$\\dfrac13$', e: '$9$' }, 'a', 'แก้ $(1/3)^x=27$', ['$3^{-x}=3^3$', '$-x=3$ จึง $x=-3$']),
  numeric(23, 'log-properties', 'medium', '$\\log_3 9+\\log_3 27$ มีค่าเท่าใด', 5, [3, 4, 6, 9], 'คำนวณแต่ละพจน์หรือรวมเป็น log ของผลคูณ', ['$\\log_3 9=2$ และ $\\log_3 27=3$', 'ผลบวกเท่ากับ 5']),
  numeric(24, 'log-properties', 'medium', '$\\log_2 40-\\log_2 5$ มีค่าเท่าใด', 3, [2, 4, 5, 8], 'ผลต่างของ log เท่ากับ log ของผลหาร', ['$\\log_2(40/5)=\\log_2 8$', '$=3$']),
  q(25, 'log-properties', 'hard', '$2\\log_a x-\\log_a y$ เท่ากับข้อใด', { a: '$\\log_a\\dfrac{x^2}{y}$', b: '$\\log_a(2x-y)$', c: '$\\log_a\\dfrac{2x}{y}$', d: '$\\log_a(x^2-y)$', e: '$\\log_a(xy^2)$' }, 'a', 'สัมประสิทธิ์หน้า log ย้ายเป็นเลขชี้กำลัง', ['$2\\log_a x=\\log_a x^2$', 'ผลต่างของ log เท่ากับ log ของผลหาร จึงได้ $\\log_a\\dfrac{x^2}{y}$']),
  q(26, 'change-of-base', 'hard', 'ถ้า $\\log_2 3=a$ แล้ว $\\log_8 9$ เท่ากับข้อใด', { a: '$\\dfrac{2a}{3}$', b: '$\\dfrac{3a}{2}$', c: '$2a$', d: '$3a$', e: '$a^2$' }, 'a', 'เปลี่ยนฐานเป็น 2', ['$\\log_8 9=\\dfrac{\\log_2 9}{\\log_2 8}$', '$=\\dfrac{2a}{3}$']),
  q(27, 'change-of-base', 'hard', 'ถ้า $\\log_a b=2$ แล้ว $\\log_b a$ เท่ากับข้อใด', { a: '$\\dfrac12$', b: '$2$', c: '$-2$', d: '$\\dfrac1a$', e: '$\\dfrac1b$' }, 'a', 'ใช้สมบัติกลับฐาน', ['$\\log_b a=\\dfrac1{\\log_a b}$', '$=\\dfrac12$']),
  numeric(28, 'log-properties', 'hard', 'ถ้า $\\log 2=0.3010$ แล้ว $\\log 50$ มีค่าประมาณเท่าใด', 1.699, [0.699, 1.301, 2.301, 2.699], 'เขียน $50=100/2$', ['$\\log50=\\log100-\\log2$', '$=2-0.3010=1.6990$']),
  q(29, 'natural-log', 'medium', '$\\ln(e^5)$ มีค่าเท่าใด', { a: '$5$', b: '$e^5$', c: '$\\ln5$', d: '$1$', e: '$0$' }, 'a', '$\\ln$ และ $e^x$ เป็นฟังก์ชันผกผันกัน', ['$\\ln(e^5)=5$']),
  q(30, 'log-domain', 'hard', 'นิพจน์ $\\log_{x-1}(5-x)$ นิยามเมื่อใด', { a: '$1<x<5$ และ $x\\ne2$', b: '$x>1$', c: '$x<5$', d: '$1<x<5$', e: '$x>0$ และ $x\\ne1$' }, 'a', 'ฐานต้องบวกและไม่เท่ากับ 1 ส่วนจำนวนภายในต้องบวก', ['$x-1>0$ ให้ $x>1$ และ $x-1\\ne1$ ให้ $x\\ne2$', '$5-x>0$ ให้ $x<5$', 'รวมเป็น $1<x<5$, $x\\ne2$']),
]

const logEquations: Question[] = [
  numeric(31, 'log-equation', 'medium', 'ถ้า $\\log_3(x-1)=2$ แล้ว $x$ เท่ากับเท่าใด', 10, [7, 8, 9, 11], 'เปลี่ยนเป็นรูปเลขยกกำลัง', ['$x-1=3^2=9$', '$x=10$']),
  numeric(32, 'log-equation', 'medium', 'ถ้า $\\log_2 x+\\log_2(x-2)=3$ แล้ว $x$ เท่ากับเท่าใด', 4, [-2, 2, 3, 6], 'รวม log และตรวจโดเมน $x>2$', ['$\\log_2[x(x-2)]=3$ จึง $x(x-2)=8$', '$(x-4)(x+2)=0$', 'โดเมนเหลือ $x=4$']),
  numeric(33, 'log-equation', 'hard', 'ผลบวกของคำตอบที่ผ่านโดเมนของ $\\log_3(x^2-4)=1$ เท่ากับเท่าใด', 0, [-4, -2, 2, 4], 'เปลี่ยนเป็นสมการพีชคณิตแล้วตรวจค่าภายใน log', ['$x^2-4=3$', '$x^2=7$ จึง $x=\\pm\\sqrt7$', 'ทั้งคู่ผ่านโดเมนและผลบวกเป็น 0']),
  numeric(34, 'log-equation', 'hard', 'ถ้า $\\log_x16=4$ และ $x>0$, $x\\ne1$ แล้ว $x$ เท่ากับเท่าใด', 2, [0.5, 4, 8, 16], 'เปลี่ยนเป็น $x^4=16$ และตรวจเงื่อนไขฐาน', ['$x^4=16$', 'เมื่อ $x>0$ จึง $x=2$']),
  q(35, 'log-equation', 'hard', 'คำตอบของ $\\log_2 x=\\log_4(x+6)$ คือข้อใด', { a: '$2$', b: '$3$', c: '$4$', d: '$6$', e: '$8$' }, 'b', 'เปลี่ยน $\\log_4$ เป็นฐาน 2', ['$\\log_4(x+6)=\\dfrac12\\log_2(x+6)$', '$2\\log_2x=\\log_2(x+6)$ จึง $x^2=x+6$', 'ได้ $x=3,-2$ แต่โดเมนเหลือ $x=3$']),
  q(36, 'log-inequality', 'medium', 'เซตคำตอบของ $\\log_2(x-1)>3$ คือข้อใด', { a: '$x>9$', b: '$x>8$', c: '$1<x<9$', d: '$x\\ge9$', e: '$x<9$' }, 'a', 'ฐาน 2 มากกว่า 1 จึงคงทิศ', ['$x-1>2^3=8$', '$x>9$']),
  q(37, 'log-inequality', 'hard', 'เซตคำตอบของ $\\log_{1/2}(x+1)\\ge-2$ คือข้อใด', { a: '$-1<x\\le4$', b: '$x\\ge3$', c: '$-1<x\\le3$', d: '$x<3$', e: '$x\\ge-1$' }, 'c', 'ฐานน้อยกว่า 1 ต้องกลับทิศ และยังต้องรักษาโดเมน', ['$x+1\\le(1/2)^{-2}=4$', '$x\\le3$ และโดเมนให้ $x>-1$', 'จึง $-1<x\\le3$']),
  q(38, 'log-inequality', 'hard', 'เซตคำตอบของ $\\log_3(x^2-1)>1$ คือข้อใด', { a: '$x<-2$ หรือ $x>2$', b: '$-2<x<2$', c: '$x<-1$ หรือ $x>1$', d: '$x\\le-2$ หรือ $x\\ge2$', e: '$x>2$' }, 'a', 'ฐานมากกว่า 1 เปลี่ยนเป็นอสมการของค่าภายในได้', ['$x^2-1>3$', '$x^2>4$ จึง $x<-2$ หรือ $x>2$']),
  numeric(39, 'log-equation', 'hard', 'ถ้า $\\ln x+\\ln(x-1)=\\ln6$ แล้ว $x$ เท่ากับเท่าใด', 3, [-2, 1, 2, 6], 'รวม log และใช้โดเมน $x>1$', ['$x(x-1)=6$', '$(x-3)(x+2)=0$', 'โดเมนเหลือ $x=3$']),
  numeric(40, 'mixed-equation', 'hard', 'ถ้า $2^{\\log_2(x-1)}=7$ แล้ว $x$ เท่ากับเท่าใด', 8, [6, 7, 9, 14], 'ฟังก์ชันเลขยกกำลังและ log ฐานเดียวกันหักล้างกัน', ['$2^{\\log_2(x-1)}=x-1$', '$x-1=7$ จึง $x=8$']),
]

const graphsApplications: Question[] = [
  q(41, 'exponential-graph', 'medium', 'เรนจ์ของ $f(x)=2^x-3$ คือข้อใด', { a: '$(-3,\\infty)$', b: '$[-3,\\infty)$', c: '$(0,\\infty)$', d: '$(-\\infty,-3)$', e: '$\\mathbb R$' }, 'a', '$2^x>0$ สำหรับทุก $x$', ['$2^x-3>-3$', 'เข้าใกล้ $-3$ ได้แต่ไม่เท่ากับ จึงเรนจ์ $(-3,\\infty)$']),
  q(42, 'log-graph', 'medium', 'โดเมนของ $g(x)=\\log_3(x+4)$ คือข้อใด', { a: '$(-4,\\infty)$', b: '$[-4,\\infty)$', c: '$(0,\\infty)$', d: '$(-\\infty,-4)$', e: '$\\mathbb R$' }, 'a', 'ค่าภายใน log ต้องเป็นบวก', ['$x+4>0$', '$x>-4$']),
  q(43, 'graph-transformations', 'medium', 'กราฟ $y=3^{x-2}+1$ ได้จาก $y=3^x$ อย่างไร', { a: 'เลื่อนไปขวา 2 และขึ้น 1', b: 'เลื่อนไปซ้าย 2 และขึ้น 1', c: 'เลื่อนไปขวา 1 และขึ้น 2', d: 'สะท้อนแกน $x$', e: 'ยืดแนวตั้ง 3 เท่า' }, 'a', '$x-2$ เลื่อนขวา ส่วน $+1$ ด้านนอกเลื่อนขึ้น', ['เลื่อนไปขวา 2 หน่วย', 'แล้วเลื่อนขึ้น 1 หน่วย']),
  numeric(44, 'growth', 'medium', 'เงิน 10,000 บาท เพิ่มขึ้นปีละ 5% แบบทบต้น เมื่อครบ 2 ปีมีเงินกี่บาท', 11025, [10500, 11000, 11500, 12100], 'ใช้ $A=P(1+r)^n$', ['$A=10000(1.05)^2$', '$=11025$ บาท']),
  numeric(45, 'decay', 'medium', 'สารชนิดหนึ่งเหลือครึ่งหนึ่งทุก 3 ชั่วโมง ถ้าเริ่ม 160 กรัม ผ่านไป 9 ชั่วโมงจะเหลือกี่กรัม', 20, [10, 40, 60, 80], '9 ชั่วโมงเท่ากับ 3 ครึ่งชีวิต', ['$160(1/2)^3$', '$=20$ กรัม']),
  numeric(46, 'population-growth', 'hard', 'ประชากรเริ่มต้น 500 คนและเพิ่มเป็น 2 เท่าทุก 4 ปี หลัง 12 ปีมีประชากรกี่คน', 4000, [1000, 1500, 2000, 6000], '12 ปีมี 3 รอบการเพิ่มเป็นสองเท่า', ['$500\\cdot2^{12/4}=500\\cdot2^3$', '$=4000$ คน']),
  q(47, 'log-scale', 'hard', 'ถ้าความเข้มเสียงเพิ่มขึ้น 100 เท่า ระดับเดซิเบลซึ่งคำนวณจาก $10\\log(I/I_0)$ จะเพิ่มขึ้นกี่เดซิเบล', { a: '10', b: '20', c: '50', d: '100', e: '200' }, 'b', 'แทนอัตราส่วนความเข้มใหม่เป็น 100', ['$10\\log100=10(2)$', '$=20$ เดซิเบล']),
  numeric(48, 'compound-interest', 'hard', 'เงิน 20,000 บาท ได้ดอกเบี้ย 10% ต่อปี ทบต้นปีละครั้ง ครบ 3 ปีจะเป็นเงินกี่บาท', 26620, [22000, 24200, 26000, 28000], 'ใช้ $A=P(1+r)^n$', ['$A=20000(1.1)^3$', '$=20000(1.331)=26620$ บาท']),
  q(49, 'inverse-functions', 'hard', 'ฟังก์ชันผกผันของ $f(x)=2^x$ คือข้อใด', { a: '$\\log_2x$', b: '$2^{-x}$', c: '$\\dfrac1{2^x}$', d: '$x^2$', e: '$\\ln(2x)$' }, 'a', 'สลับ $x,y$ ใน $y=2^x$ แล้วแก้หา $y$', ['$x=2^y$', '$y=\\log_2x$']),
  numeric(50, 'exponential-model', 'hard', 'แบคทีเรียเริ่ม 300 ตัวและเพิ่มตาม $N(t)=300\\cdot3^{t/2}$ เมื่อ $t$ เป็นชั่วโมง หลัง 4 ชั่วโมงมีแบคทีเรียกี่ตัว', 2700, [900, 1800, 2400, 8100], 'แทน $t=4$', ['$N(4)=300\\cdot3^2$', '$=2700$ ตัว']),
]

export const exponentialLogarithmChallengeQuestions: Question[] = [...powers, ...exponentialEquations, ...logProperties, ...logEquations, ...graphsApplications]
if (exponentialLogarithmChallengeQuestions.length !== 50) throw new Error(`Expected 50 exponential/logarithm questions, received ${exponentialLogarithmChallengeQuestions.length}`)
const ids = new Set<string>()
for (const item of exponentialLogarithmChallengeQuestions) {
  if (ids.has(item.id)) throw new Error(`Duplicate exponential/logarithm question id: ${item.id}`)
  ids.add(item.id)
  const choices = item.content.choices
  if (!choices || !(item.answer in choices)) throw new Error(`Invalid answer key for ${item.id}`)
  if (new Set(Object.values(choices)).size !== 5) throw new Error(`Duplicate choices in ${item.id}`)
}
