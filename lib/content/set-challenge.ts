import type { Question } from '@/lib/types/question'

const keys = ['a', 'b', 'c', 'd', 'e'] as const
type Key = (typeof keys)[number]
type Choices = NonNullable<Question['content']['choices']>

function options(correct: number, seed: number): { choices: Choices; answer: Key } {
  const candidates = [correct - 1, correct + 1, correct - 2, correct + 2, correct * 2, Math.floor(correct / 2)]
    .filter(value => value >= 0 && value !== correct)
  const values = [...new Set(candidates)].slice(0, 4)
  let filler = correct + 3
  while (values.length < 4) {
    if (!values.includes(filler)) values.push(filler)
    filler++
  }
  const answerIndex = seed % 5
  values.splice(answerIndex, 0, correct)
  return {
    choices: Object.fromEntries(keys.map((key, index) => [key, String(values[index])])) as Choices,
    answer: keys[answerIndex],
  }
}

function numericQuestion({
  id, subtopic, difficulty, text, correct, hint, steps,
}: {
  id: number
  subtopic: string
  difficulty: Question['difficulty']
  text: string
  correct: number
  hint: string
  steps: string[]
}): Question {
  const choice = options(correct, id)
  return {
    id: `set-challenge-${String(id).padStart(2, '0')}`,
    topicId: 'set',
    subtopic,
    level: 'A-Level',
    difficulty,
    type: 'multiple-choice',
    content: { text, choices: choice.choices },
    answer: choice.answer,
    hint,
    solution: { steps },
    tags: ['original', 'set-challenge'],
    source: 'MathPrep original',
  }
}

function manualQuestion(
  id: number,
  subtopic: string,
  difficulty: Question['difficulty'],
  text: string,
  choices: Choices,
  answer: Key,
  hint: string,
  steps: string[],
): Question {
  return {
    id: `set-challenge-${String(id).padStart(2, '0')}`,
    topicId: 'set', subtopic, level: 'A-Level', difficulty, type: 'multiple-choice',
    content: { text, choices }, answer, hint, solution: { steps },
    tags: ['original', 'set-challenge'], source: 'MathPrep original',
  }
}

const nestedSetQuestions: Question[] = [
  manualQuestion(1, 'membership-subset', 'medium', 'กำหนด $A=\\{\\emptyset,\\{\\emptyset\\},0,\\{0\\}\\}$ ข้อใดถูกต้อง', { a: '$\\emptyset\\notin A$', b: '$\\{\\emptyset\\}\\subseteq A$', c: '$\\{0,\\emptyset\\}\\not\\subseteq A$', d: '$\\{\\{0\\}\\}\\not\\subseteq A$', e: '$\\{\\emptyset\\}\\notin A$' }, 'b', 'แยกความหมายของ “เป็นสมาชิก” กับ “เป็นสับเซต” ทีละข้อความ', ['$\\emptyset\\in A$ และ $0\\in A$', 'ดังนั้นเซตที่มีสมาชิกเป็น $\\emptyset$ เพียงตัวเดียว คือ $\\{\\emptyset\\}$ เป็นสับเซตของ $A$']),
  manualQuestion(2, 'membership-subset', 'hard', 'ให้ $B=\\{1,\\{1\\},\\{1,2\\},\\{\\{1\\}\\}\\}$ ข้อใดเป็นเท็จ', { a: '$1\\in B$', b: '$\\{1\\}\\in B$', c: '$\\{1\\}\\subseteq B$', d: '$\\{\\{1\\}\\}\\subseteq B$', e: '$2\\in B$' }, 'e', 'สมาชิก 2 ที่อยู่ข้างในเซตซ้อน ไม่ได้เป็นสมาชิกของ $B$ โดยตรง', ['$B$ มีสมาชิกโดยตรง 4 ตัว ได้แก่ $1,\\{1\\},\\{1,2\\},\\{\\{1\\}\\}$', 'จึงได้ $2\\notin B$']),
  manualQuestion(3, 'membership-subset', 'hard', 'กำหนด $C=\\{\\emptyset,\\{a\\},\\{a,b\\}\\}$ จำนวนข้อความที่เป็นจริงต่อไปนี้มีกี่ข้อความ: $\\emptyset\\in C$, $\\emptyset\\subseteq C$, $\\{a\\}\\in C$, $\\{a\\}\\subseteq C$, $a\\in C$', { a: '1', b: '2', c: '3', d: '4', e: '5' }, 'c', 'ตรวจสมาชิกโดยตรงของ $C$ ก่อน แล้วจึงตรวจสับเซต', ['$\\emptyset\\in C$, $\\emptyset\\subseteq C$ และ $\\{a\\}\\in C$ เป็นจริง', '$a\\notin C$ จึงทำให้ $\\{a\\}\\not\\subseteq C$', 'มีข้อความจริงทั้งหมด 3 ข้อ']),
  manualQuestion(4, 'set-builder', 'medium', 'กำหนด $D=\\{x\\in\\mathbb Z\\mid |2x-1|<6\\}$ แล้ว $n(D)$ เท่ากับเท่าใด', { a: '4', b: '5', c: '6', d: '7', e: '8' }, 'c', 'แก้อสมการประกอบแล้วนับเฉพาะจำนวนเต็ม', ['$-6<2x-1<6$', '$-5<2x<7$ จึงได้ $-2.5<x<3.5$', '$x=-2,-1,0,1,2,3$ รวม 6 ค่า']),
  manualQuestion(5, 'set-builder', 'hard', 'ให้ $E=\\{x\\in\\mathbb Z\\mid x^2-5x+6\\le 0\\}$ และ $F=\\{x\\in\\mathbb Z\\mid |x-3|\\le2\\}$ แล้ว $n(F-E)$ เท่ากับเท่าใด', { a: '1', b: '2', c: '3', d: '4', e: '5' }, 'c', 'หาเซตคำตอบของแต่ละเงื่อนไขก่อนดำเนินการผลต่าง', ['$E=\\{2,3\\}$ เพราะ $(x-2)(x-3)\\le0$', '$F=\\{1,2,3,4,5\\}$', '$F-E=\\{1,4,5\\}$ จึงมี 3 สมาชิก']),
  manualQuestion(6, 'set-builder', 'hard', 'ให้ $A=\\{x\\in\\mathbb Z\\mid x^2<20\\}$ และ $B=\\{x\\in\\mathbb Z\\mid 3\\mid x\\}$ แล้ว $n(A\\cap B)$ เท่ากับเท่าใด', { a: '1', b: '2', c: '3', d: '4', e: '5' }, 'c', 'ลิสต์จำนวนเต็มใน $A$ แล้วเลือกเฉพาะพหุคูณของ 3', ['$A=\\{-4,-3,-2,-1,0,1,2,3,4\\}$', '$A\\cap B=\\{-3,0,3\\}$', 'ดังนั้นมี 3 สมาชิก']),
  manualQuestion(7, 'set-equality', 'medium', 'ถ้า $\\{2,a+1,7\\}=\\{2,5,7\\}$ แล้วค่าที่เป็นไปได้ของ $a$ คือข้อใด', { a: '1', b: '2', c: '3', d: '4', e: '6' }, 'd', 'เซตเท่ากันเมื่อมีสมาชิกเหมือนกัน โดยไม่สนใจลำดับ', ['$a+1$ ต้องเป็นสมาชิกที่ขาดอยู่คือ 5', 'ดังนั้น $a=4$']),
  manualQuestion(8, 'set-equality', 'hard', 'กำหนด $A=\\{1,x,x^2\\}$ ถ้า $n(A)=2$ และ $-1<x<1$ แล้ว $x$ เท่ากับเท่าใด', { a: '$-2$', b: '$-1$', c: '$0$', d: '$1$', e: '$2$' }, 'c', 'สมาชิกหนึ่งคู่ต้องซ้ำกัน และใช้ช่วงที่กำหนดตัดค่าที่ไม่เป็นไปได้', ['$x=0$ ทำให้ $x=x^2$ และได้ $A=\\{1,0\\}$', 'ค่าอื่นในช่วง $-1<x<1$ ทำให้สมาชิกทั้งสามแตกต่างกัน', 'ดังนั้น $x=0$']),
  manualQuestion(9, 'finite-infinite', 'medium', 'ข้อใดเป็นเซตอนันต์', { a: 'เซตของจำนวนเต็มที่มีค่าสัมบูรณ์น้อยกว่า 100', b: 'เซตของจำนวนเฉพาะที่หาร 210 ลงตัว', c: 'เซตของจำนวนจริง $x$ ที่ $0<x<1$', d: 'เซตของเดือนที่มี 31 วัน', e: 'เซตคำตอบจำนวนเต็มของ $x^2=4$' }, 'c', 'ช่วงของจำนวนจริงมีสมาชิกต่อเนื่องไม่สิ้นสุด', ['ระหว่าง 0 กับ 1 มีจำนวนจริงอยู่ไม่สิ้นสุด', 'ตัวเลือกอื่นล้วนระบุสมาชิกได้จำกัด']),
  manualQuestion(10, 'membership-subset', 'hard', 'ถ้า $A=\\{1,2\\}$ ข้อใดถูกต้อง', { a: '$A\\in A$', b: '$A\\in\\mathcal P(A)$', c: '$\\mathcal P(A)\\subseteq A$', d: '$\\{A\\}\\subseteq A$', e: '$\\mathcal P(A)\\in A$' }, 'b', 'วัตถุจะเป็นสมาชิกของเพาเวอร์เซตเมื่อวัตถุนั้นเป็นสับเซตของเซตเดิม', ['$A\\subseteq A$ เป็นจริง', 'จึงได้ $A\\in\\mathcal P(A)$']),
]

const subsetSpecs = [
  [11, 3, 7, 'inclusive'], [12, 4, 9, 'strictBoth'], [13, 5, 8, 'excludeLower'], [14, 2, 7, 'excludeUpper'],
  [15, 4, 10, 'disjoint'], [16, 3, 8, 'meet'], [17, 5, 9, 'strictBoth'], [18, 2, 6, 'meet'],
  [19, 6, 10, 'excludeLower'], [20, 1, 7, 'disjoint'],
] as const

const subsetQuestions = subsetSpecs.map(([id, a, b, mode]) => {
  const gap = b - a
  let correct: number
  let condition: string
  let explanation: string
  if (mode === 'inclusive') {
    correct = 2 ** gap; condition = '$A\\subseteq X\\subseteq B$'; explanation = `เลือกสมาชิกจาก $B-A$ ได้อิสระ ${gap} ตัว`
  } else if (mode === 'strictBoth') {
    correct = 2 ** gap - 2; condition = '$A\\subsetneq X\\subsetneq B$'; explanation = 'ตัดกรณี $X=A$ และ $X=B$ ออก'
  } else if (mode === 'excludeLower') {
    correct = 2 ** gap - 1; condition = '$A\\subsetneq X\\subseteq B$'; explanation = 'ตัดกรณี $X=A$ ออกหนึ่งกรณี'
  } else if (mode === 'excludeUpper') {
    correct = 2 ** gap - 1; condition = '$A\\subseteq X\\subsetneq B$'; explanation = 'ตัดกรณี $X=B$ ออกหนึ่งกรณี'
  } else if (mode === 'disjoint') {
    correct = 2 ** gap; condition = '$X\\subseteq B$ และ $X\\cap A=\\emptyset$'; explanation = `เลือกได้เฉพาะสมาชิก ${gap} ตัวใน $B-A$`
  } else {
    correct = (2 ** a - 1) * 2 ** gap; condition = '$X\\subseteq B$ และ $X\\cap A\\ne\\emptyset$'; explanation = 'เลือกสมาชิกจาก $A$ แบบไม่ว่าง แล้วเลือกสมาชิกส่วนที่เหลือได้อิสระ'
  }
  return numericQuestion({
    id, subtopic: 'constrained-subsets', difficulty: id < 14 ? 'medium' : 'hard',
    text: `กำหนด $A\\subseteq B$, $n(A)=${a}$ และ $n(B)=${b}$ จำนวนเซต $X$ ที่ทำให้ ${condition} มีกี่เซต`,
    correct, hint: 'แยกสมาชิกที่บังคับให้อยู่ใน $X$ ออกจากสมาชิกที่เลือกได้อิสระ',
    steps: [`มีสมาชิกใน $B-A$ จำนวน ${gap} ตัว`, explanation, `จึงมีคำตอบ ${correct} เซต`],
  })
})

const powerSpecs = [
  [21, 'powerGiven', 256, 8], [22, 'properGiven', 1023, 10], [23, 'choose', 8, 3], [24, 'choose', 9, 4], [25, 'doublePower', 65536, 4],
  [26, 'powerIntersection', 4, 16], [27, 'powerUnion', 3, 4], [28, 'choose', 10, 2], [29, 'properGiven', 255, 8], [30, 'doublePower', 256, 3],
] as const

function combination(n: number, r: number) {
  let result = 1
  for (let i = 1; i <= r; i++) result = result * (n - r + i) / i
  return result
}

const powerQuestions = powerSpecs.map(([id, mode, p, q]) => {
  if (mode === 'powerGiven') return numericQuestion({ id, subtopic: 'power-set', difficulty: 'medium', text: `ถ้า $n(\\mathcal P(A))=${p}$ แล้ว $n(A)$ เท่ากับเท่าใด`, correct: q, hint: 'ใช้ $n(\\mathcal P(A))=2^{n(A)}$', steps: [`$${p}=2^{${q}}$`, `ดังนั้น $n(A)=${q}$`] })
  if (mode === 'properGiven') return numericQuestion({ id, subtopic: 'proper-subsets', difficulty: 'medium', text: `ถ้าเซต $A$ มีสับเซตแท้ ${p} เซต แล้ว $n(A)$ เท่ากับเท่าใด`, correct: q, hint: 'จำนวนสับเซตแท้คือ $2^n-1$', steps: [`$${p}=2^n-1$`, `$2^n=${p + 1}=2^{${q}}$`, `ดังนั้น $n(A)=${q}$`] })
  if (mode === 'choose') {
    const correct = combination(p, q)
    return numericQuestion({ id, subtopic: 'fixed-size-subsets', difficulty: 'hard', text: `เซต $A$ มีสมาชิก ${p} ตัว จำนวนสับเซตของ $A$ ที่มีสมาชิก ${q} ตัวพอดีเท่ากับเท่าใด`, correct, hint: 'เป็นการเลือกสมาชิกโดยไม่สนใจลำดับ', steps: [`จำนวนที่ต้องการคือ $\\binom{${p}}{${q}}$`, `$\\binom{${p}}{${q}}=${correct}$`] })
  }
  if (mode === 'doublePower') return numericQuestion({ id, subtopic: 'nested-power-set', difficulty: 'hard', text: `ถ้า $n(\\mathcal P(\\mathcal P(A)))=${p}$ แล้ว $n(A)$ เท่ากับเท่าใด`, correct: q, hint: 'ใช้สูตรเพาเวอร์เซตสองครั้ง', steps: [`$n(\\mathcal P(\\mathcal P(A)))=2^{2^{n(A)}}$`, `$${p}=2^{2^{${q}}}$`, `ดังนั้น $n(A)=${q}$`] })
  if (mode === 'powerIntersection') return numericQuestion({ id, subtopic: 'power-set-operations', difficulty: 'hard', text: `ถ้า $n(A\\cap B)=${p}$ แล้ว $n(\\mathcal P(A)\\cap\\mathcal P(B))$ เท่ากับเท่าใด`, correct: q, hint: 'ใช้เอกลักษณ์ $\\mathcal P(A)\\cap\\mathcal P(B)=\\mathcal P(A\\cap B)$', steps: ['$\\mathcal P(A)\\cap\\mathcal P(B)=\\mathcal P(A\\cap B)$', `$n=2^{${p}}=${q}$`] })
  const correct = 2 ** p + 2 ** q - 2 ** 2
  return numericQuestion({ id, subtopic: 'power-set-operations', difficulty: 'hard', text: `กำหนด $n(A)=${p}$, $n(B)=${q}$ และ $n(A\\cap B)=2$ แล้ว $n(\\mathcal P(A)\\cup\\mathcal P(B))$ เท่ากับเท่าใด`, correct, hint: 'ใช้หลักบวกลบรวมกับเพาเวอร์เซต', steps: [`$n(\\mathcal P(A))=2^{${p}}$ และ $n(\\mathcal P(B))=2^{${q}}$`, '$\\mathcal P(A)\\cap\\mathcal P(B)=\\mathcal P(A\\cap B)$ มี 4 สมาชิก', `ผลลัพธ์คือ $2^{${p}}+2^{${q}}-4=${correct}$`] })
})

const algebraQuestions: Question[] = [
  manualQuestion(31, 'set-algebra', 'hard', '$(A-B)\\cup(A\\cap B)$ เขียนอย่างง่ายได้เป็นข้อใด', { a: '$A$', b: '$B$', c: '$A\\cup B$', d: '$A\\cap B$', e: '$A-B$' }, 'a', 'แยก $A$ เป็นส่วนที่อยู่นอก $B$ และส่วนที่อยู่ใน $B$', ['$A-B=A\\cap B\'$', '$(A\\cap B\')\\cup(A\\cap B)=A\\cap(B\'\\cup B)=A$']),
  manualQuestion(32, 'set-algebra', 'hard', '$(A\\cup B)-(A\\cap B)$ ตรงกับข้อใด', { a: '$(A-B)\\cup(B-A)$', b: '$A\\cap B$', c: '$A-B$', d: '$B-A$', e: '$A\\cup B$' }, 'a', 'ส่วนนี้คือสมาชิกที่อยู่เพียงเซตเดียว', ['ตัดส่วนร่วมออกจากยูเนียน', 'เหลือส่วนที่อยู่ใน $A$ อย่างเดียวหรือ $B$ อย่างเดียว คือ $(A-B)\\cup(B-A)$']),
  manualQuestion(33, 'set-algebra', 'hard', '$(A\\cap B\')\\cup(A\'\\cap B)$ เป็นเซตใด', { a: 'ส่วนที่อยู่ในทั้งสองเซต', b: 'ส่วนที่ไม่อยู่ในทั้งสองเซต', c: 'ส่วนที่อยู่ในเซตใดเซตหนึ่งเพียงเซตเดียว', d: '$A\'\\cap B\'$', e: '$A\\cap B$' }, 'c', 'แปลแต่ละอินเตอร์เซกชันเป็นเงื่อนไขคำพูด', ['$A\\cap B\'$ คืออยู่ใน $A$ แต่ไม่อยู่ใน $B$', '$A\'\\cap B$ คืออยู่ใน $B$ แต่ไม่อยู่ใน $A$', 'ยูเนียนจึงเป็นส่วนที่อยู่เพียงเซตเดียว']),
  manualQuestion(34, 'set-algebra', 'hard', '$[A-(B\\cup C)]\'$ เท่ากับข้อใด', { a: '$A\'\\cap B\\cap C$', b: '$A\'\\cup B\\cup C$', c: '$A\\cap B\'\\cap C\'$', d: '$A\\cup(B\\cap C)$', e: '$A\'-(B\\cup C)$' }, 'b', 'เขียนผลต่างเป็นอินเตอร์เซกชันกับคอมพลีเมนต์แล้วใช้ดีมอร์แกน', ['$A-(B\\cup C)=A\\cap(B\\cup C)\'$', 'นำคอมพลีเมนต์ทั้งก้อนได้ $A\'\\cup(B\\cup C)$', 'จึงเป็น $A\'\\cup B\\cup C$']),
  manualQuestion(35, 'set-algebra', 'hard', 'ถ้า $A\\cap B=A\\cup B$ แล้วข้อใดต้องเป็นจริง', { a: '$A\\cap B=\\emptyset$', b: '$A=B$', c: '$A\\subsetneq B$', d: '$B\\subsetneq A$', e: '$A\\cup B=U$' }, 'b', 'อินเตอร์เซกชันไม่ใหญ่กว่าสองเซต ส่วนยูเนียนไม่เล็กกว่าสองเซต', ['$A\\cap B\\subseteq A\\subseteq A\\cup B$', 'ถ้าปลายทั้งสองเท่ากัน จะได้ $A=B$']),
  manualQuestion(36, 'set-algebra', 'hard', 'ถ้า $A-B=\\emptyset$ แล้วข้อใดสรุปได้แน่นอน', { a: '$A=B$', b: '$B\\subseteq A$', c: '$A\\subseteq B$', d: '$A\\cap B=\\emptyset$', e: '$A\\cup B=U$' }, 'c', 'ไม่มีสมาชิกของ $A$ ที่อยู่นอก $B$', ['$A-B=\\emptyset$ หมายถึงสมาชิกทุกตัวของ $A$ อยู่ใน $B$', 'ดังนั้น $A\\subseteq B$']),
  manualQuestion(37, 'set-algebra', 'hard', '$A\\cap(A\'\\cup B)$ เท่ากับข้อใด', { a: '$A$', b: '$B$', c: '$A\\cap B$', d: '$A\\cup B$', e: '$\\emptyset$' }, 'c', 'แจกแจงอินเตอร์เซกชันเข้าไปในวงเล็บ', ['$A\\cap(A\'\\cup B)=(A\\cap A\')\\cup(A\\cap B)$', '$=\\emptyset\\cup(A\\cap B)=A\\cap B$']),
  manualQuestion(38, 'set-algebra', 'hard', '$(A\\cup B)\\cap(A\\cup B\')$ เท่ากับข้อใด', { a: '$A$', b: '$B$', c: '$A\\cap B$', d: '$A\\cup B$', e: '$U$' }, 'a', 'ใช้กฎ $(X\\cup Y)\\cap(X\\cup Z)=X\\cup(Y\\cap Z)$', ['$=A\\cup(B\\cap B\')$', '$=A\\cup\\emptyset=A$']),
  manualQuestion(39, 'set-algebra', 'hard', '$(A-B)\\cap(B-A)$ เท่ากับข้อใดเสมอ', { a: '$A$', b: '$B$', c: '$A\\cap B$', d: '$A\\cup B$', e: '$\\emptyset$' }, 'e', 'สมาชิกตัวเดียวไม่สามารถอยู่ใน $A$ อย่างเดียวและ $B$ อย่างเดียวพร้อมกัน', ['$A-B=A\\cap B\'$ และ $B-A=B\\cap A\'$', 'อินเตอร์เซกชันมีทั้ง $A\\cap A\'$ จึงเป็น $\\emptyset$']),
  manualQuestion(40, 'set-algebra', 'hard', 'ข้อใดเท่ากับ $(A\\cap B\\cap C)\'$', { a: '$A\'\\cap B\'\\cap C\'$', b: '$A\'\\cup B\'\\cup C\'$', c: '$A\\cup B\\cup C$', d: '$A\'\\cap(B\\cup C)$', e: '$(A\\cup B\\cup C)\'$' }, 'b', 'ใช้กฎดีมอร์แกนกับอินเตอร์เซกชันสามเซต', ['คอมพลีเมนต์ของ “และ” เปลี่ยนเป็น “หรือ” ของคอมพลีเมนต์', 'จึงได้ $A\'\\cup B\'\\cup C\'$']),
]

const twoSetSpecs = [
  [41, 80, 45, 38, 20, 'neither'], [42, 100, 62, 51, 30, 'onlyA'], [43, 75, 48, 39, 22, 'onlyB'],
  [44, 120, 70, 65, 35, 'exactlyOne'], [45, 90, 54, 49, 28, 'union'],
] as const

const twoSetQuestions = twoSetSpecs.map(([id, total, a, b, both, ask]) => {
  const union = a + b - both
  const values = { neither: total - union, onlyA: a - both, onlyB: b - both, exactlyOne: a + b - 2 * both, union }
  const labels = { neither: 'ไม่อยู่ในเซตใดเลย', onlyA: 'อยู่ใน $A$ เท่านั้น', onlyB: 'อยู่ใน $B$ เท่านั้น', exactlyOne: 'อยู่ในเพียงหนึ่งเซต', union: 'อยู่ในอย่างน้อยหนึ่งเซต' }
  const correct = values[ask]
  return numericQuestion({ id, subtopic: 'two-set-venn', difficulty: id < 44 ? 'medium' : 'hard', text: `ในเอกภพที่มีสมาชิก ${total} ตัว กำหนด $n(A)=${a}$, $n(B)=${b}$ และ $n(A\\cap B)=${both}$ จำนวนสมาชิกที่${labels[ask]}เท่ากับเท่าใด`, correct, hint: 'แยกส่วนร่วม ส่วนที่อยู่เซตเดียว และส่วนนอกยูเนียนให้ครบ', steps: [`$n(A\\cup B)=${a}+${b}-${both}=${union}$`, `จำนวนที่${labels[ask]}เท่ากับ ${correct}`] })
})

const threeSetSpecs = [
  [46, 0, 40, 35, 30, 15, 12, 10, 5, 'union'],
  [47, 100, 45, 38, 33, 18, 14, 12, 6, 'none'],
  [48, 0, 50, 44, 39, 20, 17, 15, 8, 'exactlyOne'],
  [49, 0, 42, 36, 31, 16, 14, 12, 5, 'exactlyTwo'],
  [50, 0, 55, 48, 41, 22, 19, 17, 9, 'atLeastTwo'],
] as const

const threeSetQuestions = threeSetSpecs.map(spec => {
  const [id, total, a, b, c, ab, ac, bc, abc, ask] = spec
  const union = a + b + c - ab - ac - bc + abc
  const exactlyOne = a + b + c - 2 * (ab + ac + bc) + 3 * abc
  const exactlyTwo = ab + ac + bc - 3 * abc
  const atLeastTwo = ab + ac + bc - 2 * abc
  const values = { union, none: total - union, exactlyOne, exactlyTwo, atLeastTwo }
  const labels = { union: 'อยู่ในอย่างน้อยหนึ่งเซต', none: 'ไม่อยู่ในเซตใดเลย', exactlyOne: 'อยู่ในเพียงหนึ่งเซต', exactlyTwo: 'อยู่ในสองเซตพอดี', atLeastTwo: 'อยู่ในอย่างน้อยสองเซต' }
  const correct = values[ask]
  return numericQuestion({ id, subtopic: 'three-set-venn', difficulty: 'hard', text: `${total ? `เอกภพมีสมาชิก ${total} ตัว ` : ''}กำหนด $n(A)=${a}$, $n(B)=${b}$, $n(C)=${c}$, $n(A\\cap B)=${ab}$, $n(A\\cap C)=${ac}$, $n(B\\cap C)=${bc}$ และ $n(A\\cap B\\cap C)=${abc}$ จำนวนสมาชิกที่${labels[ask]}เท่ากับเท่าใด`, correct, hint: 'ระวังว่าส่วนร่วมทีละคู่รวมสมาชิกในส่วนร่วมสามเซตไว้แล้ว', steps: [`คำนวณ $n(A\\cup B\\cup C)=${a}+${b}+${c}-${ab}-${ac}-${bc}+${abc}=${union}$`, `จัดส่วนตามเงื่อนไข “${labels[ask]}” ได้ ${correct}`] })
})

export const setChallengeQuestions: Question[] = [
  ...nestedSetQuestions,
  ...subsetQuestions,
  ...powerQuestions,
  ...algebraQuestions,
  ...twoSetQuestions,
  ...threeSetQuestions,
]

if (setChallengeQuestions.length !== 50) {
  throw new Error(`Expected 50 set challenge questions, received ${setChallengeQuestions.length}`)
}

const setQuestionIds = new Set<string>()
for (const question of setChallengeQuestions) {
  if (setQuestionIds.has(question.id)) throw new Error(`Duplicate set question id: ${question.id}`)
  setQuestionIds.add(question.id)
  const choices = question.content.choices
  if (!choices || !(question.answer in choices)) throw new Error(`Invalid answer key for ${question.id}`)
  if (new Set(Object.values(choices)).size !== 5) throw new Error(`Duplicate choices in ${question.id}`)
}
