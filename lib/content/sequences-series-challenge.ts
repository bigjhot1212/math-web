import type { Question } from '@/lib/types/question'
import { placeAnswer } from '@/lib/content/answer-position'

type Key = 'a' | 'b' | 'c' | 'd' | 'e'
type Choices = NonNullable<Question['content']['choices']>
const keys: Key[] = ['a', 'b', 'c', 'd', 'e']

function build(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, choices: Choices, answer: Key, hint: string, steps: string[]): Question {
  return { id: `sequences-series-challenge-${String(id).padStart(2, '0')}`, topicId: 'sequences-series', subtopic, level: 'A-Level', difficulty, type: 'multiple-choice', content: { text, choices }, answer, hint, solution: { steps }, tags: ['original', 'challenge'], source: 'MathPrep original' }
}

function q(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, choices: Choices, answer: Key, hint: string, steps: string[]): Question {
  const placed = placeAnswer(choices, answer, id, 2)
  return build(id, subtopic, difficulty, text, placed.choices, placed.answer, hint, steps)
}

function numeric(id: number, subtopic: string, difficulty: Question['difficulty'], text: string, correct: number, distractors: number[], hint: string, steps: string[]): Question {
  const values = [...new Set(distractors.filter(value => value !== correct))].slice(0, 4)
  let next = correct + 1
  while (values.length < 4) { if (next !== correct && !values.includes(next)) values.push(next); next++ }
  const index = (id * 3 + 1) % 5
  values.splice(index, 0, correct)
  return build(id, subtopic, difficulty, text, Object.fromEntries(keys.map((key, i) => [key, String(values[i])])) as Choices, keys[index], hint, steps)
}

const foundations: Question[] = [
  numeric(1, 'pattern', 'medium', 'พจน์ถัดไปของลำดับ $2,5,8,11,\\ldots$ คือเท่าใด', 14, [12, 13, 15, 16], 'ผลต่างระหว่างพจน์ติดกันคงที่', ['$11+3=14$']),
  numeric(2, 'nth-term', 'medium', 'ถ้า $a_n=3n-2$ แล้ว $a_{10}$ เท่ากับเท่าใด', 28, [26, 27, 29, 30], 'แทน $n=10$', ['$a_{10}=3(10)-2=28$']),
  numeric(3, 'recursive-sequence', 'medium', 'กำหนด $a_1=2$ และ $a_n=a_{n-1}+4$ เมื่อ $n\\ge2$ แล้ว $a_6$ เท่ากับเท่าใด', 22, [18, 20, 24, 26], 'จากพจน์แรกถึงพจน์ที่ 6 เพิ่มทั้งหมด 5 ครั้ง', ['$a_6=2+5(4)=22$']),
  numeric(4, 'nth-term', 'medium', 'ถ้า $a_n=n^2-n$ แล้ว $a_5$ เท่ากับเท่าใด', 20, [15, 16, 24, 25], 'แทน $n=5$ ลงในสูตร', ['$5^2-5=20$']),
  numeric(5, 'alternating-sequence', 'medium', 'ถ้า $a_n=(-1)^n n$ แล้ว $a_7$ เท่ากับเท่าใด', -7, [-8, -6, 7, 49], 'พิจารณาว่าเลขชี้กำลังเป็นคู่หรือคี่', ['$(-1)^7=-1$ จึง $a_7=-7$']),
  numeric(6, 'sigma', 'medium', '$\\sum_{k=1}^{5}k$ เท่ากับเท่าใด', 15, [10, 20, 25, 30], 'บวกจำนวนเต็มตั้งแต่ 1 ถึง 5', ['$1+2+3+4+5=15$']),
  numeric(7, 'sum-odd-numbers', 'medium', 'ผลบวกของจำนวนคี่ 10 จำนวนแรกเท่ากับเท่าใด', 100, [90, 99, 110, 121], 'ผลบวกจำนวนคี่ $n$ จำนวนแรกเท่ากับ $n^2$', ['$10^2=100$']),
  q(8, 'telescoping', 'hard', '$\\sum_{k=1}^{4}\\dfrac1{k(k+1)}$ เท่ากับข้อใด', { a: '$\\frac45$', b: '$\\frac14$', c: '$\\frac34$', d: '$1$', e: '$\\frac54$' }, 'a', 'แยก $1/[k(k+1)]$ เป็นผลต่างสองเศษส่วน', ['$\\dfrac1{k(k+1)}=\\dfrac1k-\\dfrac1{k+1}$', 'พจน์กลางหักล้างกัน เหลือ $1-1/5=4/5$']),
  numeric(9, 'fibonacci', 'medium', 'กำหนด $a_1=a_2=1$ และ $a_n=a_{n-1}+a_{n-2}$ แล้ว $a_7$ เท่ากับเท่าใด', 13, [8, 11, 15, 21], 'เขียนพจน์ถัดไปโดยบวกสองพจน์ก่อนหน้า', ['$1,1,2,3,5,8,13$']),
  q(10, 'rational-sequence', 'medium', 'ถ้า $a_n=\\dfrac{2n+1}{n-1}$ แล้ว $a_3$ เท่ากับข้อใด', { a: '$\\frac72$', b: '$\\frac73$', c: '$\\frac52$', d: '$3$', e: '$7$' }, 'a', 'แทน $n=3$', ['$a_3=(2(3)+1)/(3-1)=7/2$']),
]

const arithmetic: Question[] = [
  numeric(11, 'arithmetic-nth-term', 'medium', 'ลำดับเลขคณิตมี $a_1=5$ และผลต่างร่วม 3 แล้ว $a_{12}$ เท่ากับเท่าใด', 38, [33, 35, 36, 41], 'ใช้ $a_n=a_1+(n-1)d$', ['$a_{12}=5+11(3)=38$']),
  numeric(12, 'arithmetic-difference', 'medium', 'ลำดับเลขคณิตมี $a_4=10$ และ $a_9=25$ ผลต่างร่วมเท่ากับเท่าใด', 3, [2, 4, 5, 15], 'ผลต่างของพจน์เท่ากับจำนวนช่วงคูณผลต่างร่วม', ['$a_9-a_4=5d$', '$15=5d$ จึง $d=3$']),
  numeric(13, 'arithmetic-first-term', 'medium', 'ลำดับเลขคณิตมี $a_5=18$ และผลต่างร่วม 4 แล้ว $a_1$ เท่ากับเท่าใด', 2, [-2, 4, 6, 14], '$a_5=a_1+4d$', ['$18=a_1+16$ จึง $a_1=2$']),
  q(14, 'arithmetic-formula', 'medium', 'พจน์ทั่วไปของลำดับ $7,11,15,19,\\ldots$ คือข้อใด', { a: '$a_n=4n+3$', b: '$a_n=4n+7$', c: '$a_n=3n+4$', d: '$a_n=7n-3$', e: '$a_n=4n-3$' }, 'a', '$a_n=a_1+(n-1)d$', ['$a_n=7+4(n-1)=4n+3$']),
  numeric(15, 'arithmetic-position', 'medium', '55 เป็นพจน์ที่เท่าใดของลำดับ $3,7,11,15,\\ldots$', 14, [12, 13, 15, 16], 'ตั้ง $3+(n-1)4=55$', ['$4(n-1)=52$', '$n=14$']),
  numeric(16, 'arithmetic-sum', 'hard', 'ผลบวก 20 พจน์แรกของลำดับ $2,5,8,11,\\ldots$ เท่ากับเท่าใด', 610, [570, 590, 620, 1220], 'ใช้ $S_n=n[2a_1+(n-1)d]/2$', ['$S_{20}=10[4+19(3)]$', '$=10(61)=610$']),
  numeric(17, 'arithmetic-sum', 'medium', 'ผลบวก $1+3+5+\\cdots+39$ เท่ากับเท่าใด', 400, [200, 380, 420, 800], 'มีจำนวนคี่ตั้งแต่ 1 ถึง 39 ทั้งหมด 20 จำนวน', ['$S=20(1+39)/2=400$']),
  numeric(18, 'arithmetic-three-terms', 'hard', 'จำนวนบวกสามจำนวนเรียงเป็นลำดับเลขคณิต มีผลบวก 24 และผลคูณของพจน์แรกกับพจน์ที่สามเท่ากับ 55 ผลต่างร่วมเป็นบวกเท่ากับเท่าใด', 3, [1, 2, 4, 5], 'เขียนสามพจน์เป็น $8-d,8,8+d$', ['$(8-d)(8+d)=55$', '$64-d^2=55$ จึง $d=3$']),
  q(19, 'arithmetic-means', 'hard', 'แทรกจำนวน 4 จำนวนระหว่าง 4 และ 20 ให้ทั้งหกจำนวนเป็นลำดับเลขคณิต ผลต่างร่วมเท่ากับข้อใด', { a: '$\\frac{16}{5}$', b: '$4$', c: '$\\frac83$', d: '$3$', e: '$\\frac{20}{3}$' }, 'a', 'จากพจน์แรกถึงพจน์ที่หกมี 5 ช่วง', ['$d=(20-4)/5=16/5$']),
  numeric(20, 'partial-arithmetic-sum', 'hard', 'กำหนด $a_n=2n+1$ แล้ว $a_{10}+a_{11}+\\cdots+a_{20}$ เท่ากับเท่าใด', 341, [310, 320, 330, 351], 'มี 11 พจน์และใช้ค่าเฉลี่ยของพจน์แรกกับพจน์สุดท้าย', ['$a_{10}=21$, $a_{20}=41$', '$S=11(21+41)/2=341$']),
]

const geometric: Question[] = [
  numeric(21, 'geometric-pattern', 'medium', 'พจน์ถัดไปของลำดับเรขาคณิต $3,6,12,24,\\ldots$ คือเท่าใด', 48, [27, 36, 42, 54], 'อัตราส่วนร่วมเท่ากับ 2', ['$24(2)=48$']),
  numeric(22, 'geometric-nth-term', 'medium', 'ลำดับเรขาคณิตมี $a_1=2$ และอัตราส่วนร่วม 3 แล้ว $a_6$ เท่ากับเท่าใด', 486, [162, 243, 729, 1458], 'ใช้ $a_n=a_1r^{n-1}$', ['$a_6=2(3^5)=486$']),
  numeric(23, 'geometric-ratio', 'medium', 'ลำดับเรขาคณิตมี $a_3=12$, $a_5=48$ และอัตราส่วนร่วมเป็นบวก แล้วอัตราส่วนร่วมเท่ากับเท่าใด', 2, [1, 3, 4, 6], '$a_5/a_3=r^2$', ['$r^2=48/12=4$', '$r>0$ จึง $r=2$']),
  q(24, 'geometric-formula', 'medium', 'พจน์ทั่วไปของลำดับ $5,10,20,40,\\ldots$ คือข้อใด', { a: '$a_n=5(2^{n-1})$', b: '$a_n=5(2^n)$', c: '$a_n=2(5^{n-1})$', d: '$a_n=5+2n$', e: '$a_n=10n-5$' }, 'a', 'ใช้พจน์แรกคูณอัตราส่วนร่วมยกกำลัง $n-1$', ['$a_n=5(2^{n-1})$']),
  numeric(25, 'geometric-position', 'medium', '128 เป็นพจน์ที่เท่าใดของลำดับ $1,2,4,8,\\ldots$', 8, [7, 9, 10, 128], '$128=2^7$', ['$a_n=2^{n-1}$', '$n-1=7$ จึง $n=8$']),
  numeric(26, 'geometric-sum', 'medium', 'ผลบวก 8 พจน์แรกของ $1+2+4+8+\\cdots$ เท่ากับเท่าใด', 255, [127, 256, 510, 511], 'ใช้ $S_n=(r^n-1)/(r-1)$ เมื่อพจน์แรกเป็น 1', ['$S_8=2^8-1=255$']),
  numeric(27, 'geometric-sum', 'medium', 'ผลบวก 5 พจน์แรกของลำดับเรขาคณิต $3,6,12,\\ldots$ เท่ากับเท่าใด', 93, [45, 63, 96, 189], 'ใช้สูตรผลบวกเรขาคณิตจำกัด', ['$S_5=3(2^5-1)/(2-1)=3(31)=93$']),
  numeric(28, 'infinite-geometric', 'medium', 'ผลบวกอนันต์ $12+6+3+\\cdots$ เท่ากับเท่าใด', 24, [18, 20, 21, 36], 'ใช้ $S_\\infty=a/(1-r)$ เมื่อ $|r|<1$', ['$S_\\infty=12/(1-1/2)=24$']),
  q(29, 'infinite-geometric', 'hard', 'ผลบวกอนันต์ $5-\\frac52+\\frac54-\\frac58+\\cdots$ เท่ากับข้อใด', { a: '$\\frac{10}{3}$', b: '$\\frac52$', c: '$5$', d: '$\\frac{20}{3}$', e: '$\\frac53$' }, 'a', 'อัตราส่วนร่วมคือ $-1/2$', ['$S_\\infty=5/[1-(-1/2)]=10/3$']),
  numeric(30, 'geometric-mean', 'medium', 'จำนวนบวกที่แทรกระหว่าง 4 และ 36 ให้ทั้งสามจำนวนเป็นลำดับเรขาคณิตเท่ากับเท่าใด', 12, [8, 10, 16, 18], 'พจน์กลางยกกำลังสองเท่ากับผลคูณพจน์ข้างเคียง', ['$x^2=4(36)=144$', '$x>0$ จึง $x=12$']),
]

const series: Question[] = [
  numeric(31, 'sigma-arithmetic', 'medium', '$\\sum_{k=1}^{15}(2k+1)$ เท่ากับเท่าใด', 255, [225, 240, 256, 270], 'แยกเป็น $2\\sum k+\\sum 1$', ['$2\\cdot\\dfrac{15(16)}{2}+15$', '$=240+15=255$']),
  numeric(32, 'sum-squares', 'medium', '$\\sum_{k=1}^{10}k^2$ เท่ากับเท่าใด', 385, [55, 285, 365, 405], 'ใช้สูตร $n(n+1)(2n+1)/6$', ['$10(11)(21)/6=385$']),
  numeric(33, 'sigma-polynomial', 'hard', '$\\sum_{k=1}^{5}k(k+1)$ เท่ากับเท่าใด', 70, [40, 55, 65, 85], 'แยกเป็นผลบวกกำลังสองและผลบวกจำนวนเต็ม', ['$\\sum(k^2+k)=55+15=70$']),
  q(34, 'finite-alternating', 'hard', '$1-\\frac12+\\frac14-\\frac18$ เท่ากับข้อใด', { a: '$\\frac58$', b: '$\\frac38$', c: '$\\frac12$', d: '$\\frac78$', e: '$\\frac98$' }, 'a', 'ทำส่วนให้เท่ากันหรือใช้ผลบวกเรขาคณิต 4 พจน์', ['$8/8-4/8+2/8-1/8=5/8$']),
  q(35, 'telescoping', 'hard', '$\\sum_{k=1}^{9}\\dfrac1{k(k+1)}$ เท่ากับข้อใด', { a: '$\\frac9{10}$', b: '$\\frac1{10}$', c: '$\\frac89$', d: '$1$', e: '$\\frac{10}{9}$' }, 'a', 'แยกเป็น $1/k-1/(k+1)$', ['พจน์กลางหักล้างกัน', '$1-1/10=9/10$']),
  q(36, 'repeating-decimal', 'medium', '$0.7777\\ldots$ เท่ากับเศษส่วนใด', { a: '$\\frac79$', b: '$\\frac7{10}$', c: '$\\frac{77}{100}$', d: '$\\frac89$', e: '$\\frac{70}{99}$' }, 'a', 'ให้ $x=0.777\\ldots$ แล้วพิจารณา $10x-x$', ['$10x-x=7$ จึง $x=7/9$']),
  q(37, 'repeating-decimal', 'hard', '$0.121212\\ldots$ เท่ากับเศษส่วนอย่างต่ำใด', { a: '$\\frac4{33}$', b: '$\\frac{12}{100}$', c: '$\\frac{12}{101}$', d: '$\\frac2{11}$', e: '$\\frac6{55}$' }, 'a', 'ช่วงซ้ำมี 2 หลักจึงคูณด้วย 100', ['$100x-x=12$', '$x=12/99=4/33$']),
  q(38, 'infinite-series', 'medium', '$\\frac13+\\frac19+\\frac1{27}+\\cdots$ เท่ากับข้อใด', { a: '$\\frac12$', b: '$\\frac13$', c: '$\\frac23$', d: '$1$', e: '$\\frac14$' }, 'a', 'เป็นอนุกรมเรขาคณิตที่ $a=r=1/3$', ['$S_\\infty=(1/3)/(1-1/3)=1/2$']),
  q(39, 'convergence', 'medium', 'อนุกรมเรขาคณิตอนันต์ $a+ar+ar^2+\\cdots$ เมื่อ $a\\ne0$ ลู่เข้าเมื่อใด', { a: '$|r|<1$', b: '$r>1$', c: '$r\\ge1$', d: '$|r|>1$', e: 'ทุกค่าของ $r$' }, 'a', 'พจน์ $ar^n$ ต้องเข้าใกล้ศูนย์', ['เกิดขึ้นเมื่อ $|r|<1$']),
  q(40, 'sigma-identity', 'hard', '$\\sum_{k=1}^{n}(2k-1)$ เท่ากับข้อใด', { a: '$n^2$', b: '$2n-1$', c: '$n(n+1)$', d: '$2n^2$', e: '$n^2-1$' }, 'a', 'เป็นผลบวกจำนวนคี่ $n$ จำนวนแรก', ['$1+3+\\cdots+(2n-1)=n^2$']),
]

const applications: Question[] = [
  numeric(41, 'saving-plan', 'medium', 'เดือนแรกออม 100 บาท และเพิ่มเงินออมเดือนละ 20 บาท เดือนที่ 12 จะออมกี่บาท', 320, [300, 310, 330, 340], 'เป็นลำดับเลขคณิตที่ $a_1=100,d=20$', ['$a_{12}=100+11(20)=320$']),
  numeric(42, 'saving-total', 'hard', 'เดือนแรกออม 100 บาท และเพิ่มเงินออมเดือนละ 20 บาท เมื่อครบ 12 เดือนออมรวมกี่บาท', 2520, [1920, 2320, 2420, 2640], 'หาผลบวกลำดับเลขคณิต 12 พจน์', ['$a_{12}=320$', '$S_{12}=12(100+320)/2=2520$']),
  numeric(43, 'exponential-growth', 'medium', 'แบคทีเรียเริ่มต้น 500 ตัวและเพิ่มเป็นสองเท่าทุกชั่วโมง หลังผ่านไป 5 ชั่วโมงมีแบคทีเรียกี่ตัว', 16000, [8000, 12000, 32000, 64000], 'หลัง $t$ ชั่วโมงมี $500(2^t)$ ตัว', ['$500(2^5)=16000$']),
  numeric(44, 'depreciation', 'medium', 'รถราคา 800,000 บาท มูลค่าลดลงปีละ 10% ของมูลค่าปีก่อน หลัง 2 ปีมีมูลค่ากี่บาท', 648000, [640000, 650000, 720000, 792000], 'แต่ละปีคูณด้วย 0.9', ['$800000(0.9)^2=648000$']),
  numeric(45, 'bouncing-ball', 'hard', 'ปล่อยลูกบอลจากความสูง 10 เมตร ทุกครั้งกระดอนสูงเป็น 60% ของความสูงก่อนหน้า ระยะทางรวมจนหยุดเท่ากับกี่เมตร', 40, [25, 30, 35, 50], 'นับการตกครั้งแรกหนึ่งครั้ง และความสูงกระดอนแต่ละครั้งทั้งขึ้นและลง', ['$10+2(6+3.6+\\cdots)$', '$=10+2[6/(1-0.6)]=40$']),
  numeric(46, 'seating-rows', 'hard', 'หอประชุมมีแถวแรก 20 ที่นั่ง แต่ละแถวถัดไปเพิ่ม 2 ที่นั่ง ถ้ามี 15 แถว จะมีที่นั่งรวมกี่ที่', 510, [450, 480, 500, 540], 'ใช้ผลบวกลำดับเลขคณิต', ['$a_{15}=20+14(2)=48$', '$S_{15}=15(20+48)/2=510$']),
  numeric(47, 'compound-interest', 'medium', 'ลงทุน 10,000 บาท ได้ผลตอบแทนทบต้นปีละ 5% หลัง 2 ปีมีเงินกี่บาท', 11025, [10500, 11000, 11500, 12000], 'แต่ละปีคูณด้วย 1.05', ['$10000(1.05)^2=11025$']),
  numeric(48, 'exponential-decay', 'hard', 'ประชากรเริ่มต้น 6,250 ตัว ลดลงปีละ 20% ของปีก่อน หลัง 3 ปีเหลือกี่ตัว', 3200, [3000, 3600, 4000, 5000], 'แต่ละปีเหลือ 80% หรือคูณด้วย 0.8', ['$6250(0.8)^3=6250(0.512)=3200$']),
  numeric(49, 'arithmetic-model', 'medium', 'จำนวนสามจำนวนเรียงเป็นลำดับเลขคณิตและมีผลบวก 30 พจน์กลางเท่ากับเท่าใด', 10, [5, 8, 12, 15], 'พจน์แรกและพจน์ที่สามรวมกันเป็นสองเท่าของพจน์กลาง', ['ผลบวกสามพจน์เท่ากับสามเท่าของพจน์กลาง', '$3b=30$ จึง $b=10$']),
  q(50, 'sequence-properties', 'hard', 'ลำดับจำนวนบวกที่มีอย่างน้อย 3 พจน์เป็นทั้งลำดับเลขคณิตและเรขาคณิตพร้อมกัน ข้อใดต้องจริง', { a: 'ทุกพจน์เท่ากัน', b: 'ผลต่างร่วมเท่ากับ 1', c: 'อัตราส่วนร่วมเท่ากับ 0', d: 'พจน์สลับเครื่องหมาย', e: 'พจน์แรกต้องเท่ากับ 1' }, 'a', 'ให้สามพจน์ติดกันเป็น $a,b,c$ แล้วใช้ $2b=a+c$ และ $b^2=ac$', ['เงื่อนไขทั้งสองสำหรับจำนวนบวกบังคับให้ $a=b=c$', 'ดังนั้นผลต่างร่วมเป็น 0 และอัตราส่วนร่วมเป็น 1']),
]

export const sequencesSeriesChallengeQuestions: Question[] = [...foundations, ...arithmetic, ...geometric, ...series, ...applications]
if (sequencesSeriesChallengeQuestions.length !== 50) throw new Error(`Expected 50 sequences-series questions, received ${sequencesSeriesChallengeQuestions.length}`)
const ids = new Set<string>()
for (const item of sequencesSeriesChallengeQuestions) {
  if (ids.has(item.id)) throw new Error(`Duplicate sequences-series question id: ${item.id}`)
  ids.add(item.id)
}
