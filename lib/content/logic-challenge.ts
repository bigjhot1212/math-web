import type { Question } from '@/lib/types/question'

type ChoiceKey = 'a' | 'b' | 'c' | 'd' | 'e'
type Choices = NonNullable<Question['content']['choices']>

const keys: ChoiceKey[] = ['a', 'b', 'c', 'd', 'e']

function question(
  id: number,
  subtopic: string,
  difficulty: Question['difficulty'],
  text: string,
  choices: Choices,
  answer: ChoiceKey,
  hint: string,
  steps: string[],
): Question {
  return {
    id: `logic-challenge-${String(id).padStart(2, '0')}`,
    topicId: 'logic',
    subtopic,
    level: 'A-Level',
    difficulty,
    type: 'multiple-choice',
    content: { text, choices },
    answer,
    hint,
    solution: { steps },
    tags: ['original', 'challenge'],
    source: 'MathPrep original',
  }
}

function numericQuestion(
  id: number,
  subtopic: string,
  difficulty: Question['difficulty'],
  text: string,
  correct: number,
  hint: string,
  steps: string[],
): Question {
  const candidates = [correct - 2, correct - 1, correct + 1, correct + 2, correct + 3]
    .filter((value, index, values) => value >= 0 && value !== correct && values.indexOf(value) === index)
  let next = 0
  while (candidates.length < 4) {
    if (next !== correct && !candidates.includes(next)) candidates.push(next)
    next++
  }
  const answerIndex = (id * 3) % 5
  const values = candidates.slice(0, 4)
  values.splice(answerIndex, 0, correct)
  const choices = Object.fromEntries(keys.map((key, index) => [key, String(values[index])])) as Choices
  return question(id, subtopic, difficulty, text, choices, keys[answerIndex], hint, steps)
}

const truthCountSpecs: Array<[number, string, number, string]> = [
  [1, '$p\\land q$', 1, 'จริงเฉพาะเมื่อทั้งสองประพจน์จริง'],
  [2, '$p\\to q$', 3, 'เท็จเพียงกรณี $p$ จริงและ $q$ เท็จ'],
  [3, '$p\\leftrightarrow q$', 2, 'จริงเมื่อ $p,q$ มีค่าความจริงเหมือนกัน'],
  [4, '$(p\\lor q)\\land\\neg r$', 3, '$p\\lor q$ ต้องจริงและ $r$ ต้องเท็จ'],
  [5, '$(p\\to q)\\land(q\\to r)$', 4, 'ตรวจแปดแถวโดยตัดแถวที่อิมพลิเคชันตัวใดตัวหนึ่งเป็นเท็จ'],
  [6, '$(p\\lor q)\\to r$', 5, 'เท็จเมื่อ $p\\lor q$ จริง แต่ $r$ เท็จ'],
  [7, '$(p\\leftrightarrow q)\\lor r$', 6, 'ถ้า $r$ จริง รูปแบบจริงทันที; ถ้า $r$ เท็จต้องมี $p=q$'],
  [8, '$(p\\land q)\\to(p\\lor r)$', 8, 'เมื่อเหตุจริง $p$ จริงอยู่แล้วจึงทำให้ผลจริง'],
  [9, '$(p\\to q)\\leftrightarrow(\\neg q\\to\\neg p)$', 4, 'สองข้างเป็นประพจน์สมมูลกันทุกกรณี'],
  [10, '$(p\\oplus q)\\land(q\\oplus r)$', 2, 'ต้องมี $p\\ne q$ และ $q\\ne r$ พร้อมกัน'],
]

const truthCountQuestions = truthCountSpecs.map(([id, formula, correct, reason]) =>
  numericQuestion(
    id,
    'truth-table',
    id < 5 ? 'medium' : 'hard',
    `เมื่อ $p,q${id >= 4 && id !== 9 ? ',r' : ''}$ แทนประพจน์ รูปแบบ ${formula} เป็นจริงทั้งหมดกี่แถวในตารางค่าความจริง`,
    correct,
    'พิจารณาเงื่อนไขที่ทำให้ตัวเชื่อมหลักเป็นจริง แทนการคำนวณแบบสุ่มทีละแถว',
    [reason, `จึงมีแถวที่เป็นจริงทั้งหมด ${correct} แถว`],
  ),
)

const equivalenceQuestions: Question[] = [
  question(11, 'equivalence', 'medium', 'ข้อใดสมมูลกับ $\\neg(p\\to q)$', { a: '$\\neg p\\to\\neg q$', b: '$p\\land\\neg q$', c: '$\\neg p\\lor q$', d: '$p\\lor\\neg q$', e: '$\\neg p\\land q$' }, 'b', 'แทน $p\\to q$ ด้วย $\\neg p\\lor q$ แล้วใส่นิเสธทั้งก้อน', ['$\\neg(p\\to q)=\\neg(\\neg p\\lor q)$', 'ใช้กฎดีมอร์แกนได้ $p\\land\\neg q$']),
  question(12, 'equivalence', 'medium', 'ข้อใดสมมูลกับ $p\\to(q\\land r)$', { a: '$(p\\to q)\\land(p\\to r)$', b: '$(p\\to q)\\lor(p\\to r)$', c: '$(q\\to p)\\land(r\\to p)$', d: '$p\\land(q\\to r)$', e: '$(p\\land q)\\to r$' }, 'a', 'เปลี่ยนอิมพลิเคชันเป็น “ไม่เหตุ หรือ ผล” แล้วแจกแจง', ['$p\\to(q\\land r)=\\neg p\\lor(q\\land r)$', '$=(\\neg p\\lor q)\\land(\\neg p\\lor r)$', '$=(p\\to q)\\land(p\\to r)$']),
  question(13, 'equivalence', 'hard', 'ข้อใดสมมูลกับ $(p\\land q)\\to r$', { a: '$p\\to(q\\to r)$', b: '$(p\\to r)\\land(q\\to r)$', c: '$r\\to(p\\land q)$', d: '$p\\land(q\\to r)$', e: '$(p\\lor q)\\to r$' }, 'a', 'เขียนทั้งสองรูปให้อยู่ในตัวเชื่อม $\\neg,\\lor$', ['$(p\\land q)\\to r=\\neg p\\lor\\neg q\\lor r$', '$p\\to(q\\to r)=\\neg p\\lor(\\neg q\\lor r)$', 'จึงสมมูลกัน']),
  question(14, 'equivalence', 'medium', 'นิเสธของ $p\\leftrightarrow q$ สมมูลกับข้อใด', { a: '$p\\leftrightarrow\\neg q$', b: '$p\\land q$', c: '$p\\lor q$', d: '$p\\to q$', e: '$\\neg p\\land\\neg q$' }, 'a', 'นิเสธของ “มีค่าเหมือนกัน” คือ “มีค่าต่างกัน”', ['$p\\leftrightarrow q$ จริงเมื่อค่าตรงกัน', '$p\\leftrightarrow\\neg q$ จริงเมื่อค่าของ $p,q$ ต่างกัน จึงเป็นนิเสธกัน']),
  question(15, 'equivalence', 'hard', 'ข้อใดสมมูลกับ $(p\\lor q)\\land(p\\lor\\neg q)$', { a: '$p$', b: '$q$', c: '$\\neg p$', d: '$p\\land q$', e: '$p\\lor q$' }, 'a', 'ใช้กฎแจกแจงรูป $(A\\lor B)\\land(A\\lor C)$', ['$=p\\lor(q\\land\\neg q)$', '$=p\\lor F=p$']),
  question(16, 'equivalence', 'hard', 'ข้อใดสมมูลกับ $(p\\to r)\\land(q\\to r)$', { a: '$(p\\lor q)\\to r$', b: '$(p\\land q)\\to r$', c: '$r\\to(p\\land q)$', d: '$p\\to(q\\to r)$', e: '$(p\\leftrightarrow q)\\to r$' }, 'a', 'รวมพจน์ที่มี $r$ เหมือนกัน', ['$(\\neg p\\lor r)\\land(\\neg q\\lor r)$', '$=(\\neg p\\land\\neg q)\\lor r$', '$=\\neg(p\\lor q)\\lor r=(p\\lor q)\\to r$']),
  question(17, 'equivalence', 'medium', 'บทกลับทางนิเสธของ $p\\to(q\\lor r)$ คือข้อใด', { a: '$\\neg q\\land\\neg r\\to\\neg p$', b: '$\\neg q\\lor\\neg r\\to\\neg p$', c: '$\\neg p\\to(\\neg q\\land\\neg r)$', d: '$(q\\lor r)\\to p$', e: '$p\\to(\\neg q\\land\\neg r)$' }, 'a', 'สลับเหตุผลแล้วนิเสธทั้งสองข้าง', ['นิเสธของ $q\\lor r$ คือ $\\neg q\\land\\neg r$', 'จึงได้ $(\\neg q\\land\\neg r)\\to\\neg p$']),
  question(18, 'equivalence', 'hard', 'ข้อใดสมมูลกับ $\\neg[(p\\lor q)\\to r]$', { a: '$(p\\lor q)\\land\\neg r$', b: '$(\\neg p\\land\\neg q)\\lor r$', c: '$\\neg p\\land\\neg q\\land r$', d: '$(p\\lor q)\\lor\\neg r$', e: '$r\\to(p\\lor q)$' }, 'a', 'นิเสธอิมพลิเคชันมีรูป “เหตุจริงและผลเท็จ”', ['$\\neg(A\\to B)=A\\land\\neg B$', 'ให้ $A=p\\lor q$ และ $B=r$ จึงได้ $(p\\lor q)\\land\\neg r$']),
  question(19, 'equivalence', 'hard', 'ข้อใดสมมูลกับ $(p\\leftrightarrow q)\\land(q\\leftrightarrow r)$', { a: 'ทั้ง $p,q,r$ มีค่าความจริงเหมือนกัน', b: 'อย่างน้อยหนึ่งประพจน์เป็นจริง', c: 'มีประพจน์จริงพอดีหนึ่งประพจน์', d: '$p$ กับ $r$ มีค่าต่างกัน', e: '$q$ เป็นจริงเสมอ' }, 'a', 'อ่านเครื่องหมายก็ต่อเมื่อเป็นเงื่อนไขว่าค่าทั้งสองด้านต้องตรงกัน', ['$p=q$ และ $q=r$', 'ดังนั้น $p=q=r$']),
  question(20, 'equivalence', 'hard', 'รูป $\\neg p\\lor(q\\land r)$ สมมูลกับข้อใด', { a: '$(p\\to q)\\land(p\\to r)$', b: '$(q\\to p)\\land(r\\to p)$', c: '$(p\\to q)\\lor(p\\to r)$', d: '$p\\land(q\\to r)$', e: '$(q\\land r)\\to p$' }, 'a', 'แจกแจง $A\\lor(B\\land C)$', ['$\\neg p\\lor(q\\land r)=(\\neg p\\lor q)\\land(\\neg p\\lor r)$', 'จึงเป็น $(p\\to q)\\land(p\\to r)$']),
]

const formQuestions: Question[] = [
  question(21, 'tautology', 'medium', 'ข้อใดเป็นสัจนิรันดร์', { a: '$p\\lor\\neg p$', b: '$p\\land\\neg p$', c: '$p\\to\\neg p$', d: '$p\\leftrightarrow\\neg p$', e: '$p\\land q$' }, 'a', 'สัจนิรันดร์ต้องจริงทุกค่าความจริง', '$p$ กับ $\\neg p$ ต้องมีอย่างน้อยหนึ่งประพจน์จริงเสมอ|ดังนั้น $p\\lor\\neg p$ จริงทุกกรณี'.split('|')),
  question(22, 'tautology', 'hard', 'รูปแบบใดต่อไปนี้จริงทุกค่าความจริงของ $p$ และ $q$', { a: '$(p\\land q)\\to p$', b: '$p\\to(p\\land q)$', c: '$(p\\lor q)\\to p$', d: '$p\\leftrightarrow q$', e: '$p\\land(q\\lor\\neg q)$' }, 'a', 'ลองหากรณีที่อิมพลิเคชันเป็นเท็จ', ['ถ้าเหตุ $p\\land q$ จริง จะได้ $p$ จริงแน่นอน', 'ถ้าเหตุเท็จ อิมพลิเคชันก็จริง จึงจริงทุกกรณี']),
  question(23, 'tautology', 'hard', 'ข้อใดเป็นข้อขัดแย้ง', { a: '$(p\\to q)\\land p\\land\\neg q$', b: '$p\\lor q$', c: '$p\\leftrightarrow q$', d: '$p\\to q$', e: '$(p\\land q)\\to p$' }, 'a', 'ข้อขัดแย้งต้องเท็จทุกกรณี', ['ถ้า $p\\land\\neg q$ จริง จะทำให้ $p\\to q$ เท็จ', 'ถ้า $p\\land\\neg q$ เท็จ ทั้งก้อนก็เท็จ จึงไม่มีกรณีจริง']),
  question(24, 'tautology', 'hard', 'รูปแบบใดเป็นประพจน์บังเอิญ', { a: '$p\\to q$', b: '$p\\lor\\neg p$', c: '$p\\land\\neg p$', d: '$(p\\land q)\\to p$', e: '$(p\\to q)\\leftrightarrow(\\neg q\\to\\neg p)$' }, 'a', 'ประพจน์บังเอิญมีทั้งแถวจริงและแถวเท็จ', ['$p\\to q$ เท็จเมื่อ $p=T,q=F$', 'และจริงในกรณีอื่น จึงเป็นประพจน์บังเอิญ']),
  question(25, 'tautology', 'hard', 'ข้อใดไม่เป็นสัจนิรันดร์', { a: '$[(p\\to q)\\land q]\\to p$', b: '$[p\\land(p\\to q)]\\to q$', c: '$(p\\land q)\\to q$', d: '$p\\to(p\\lor q)$', e: '$(p\\to q)\\lor(q\\to p)$' }, 'a', 'หาแถวโต้แย้งที่เหตุจริงแต่ผลเท็จ', ['กำหนด $p=F,q=T$', 'จะได้ $(p\\to q)\\land q=T$ แต่ผล $p=F$ จึงทั้งรูปเป็นเท็จ']),
  question(26, 'tautology', 'hard', 'กำหนด $A=(p\\to q)\\lor(q\\to p)$ และ $B=(p\\land q)\\land\\neg(p\\lor q)$ ข้อใดถูกต้อง', { a: '$A$ เป็นสัจนิรันดร์ และ $B$ เป็นข้อขัดแย้ง', b: 'ทั้ง $A,B$ เป็นสัจนิรันดร์', c: 'ทั้ง $A,B$ เป็นข้อขัดแย้ง', d: 'ทั้ง $A,B$ เป็นประพจน์บังเอิญ', e: '$A$ เป็นข้อขัดแย้ง และ $B$ เป็นสัจนิรันดร์' }, 'a', 'แยกตรวจรูปแบบทั้งสองก่อนจับคู่คำตอบ', ['อิมพลิเคชันสองทิศทางอย่างน้อยหนึ่งทิศจริงเสมอ จึง $A$ เป็นสัจนิรันดร์', '$p\\land q$ ขัดกับ $\\neg(p\\lor q)$ จึง $B$ เป็นข้อขัดแย้ง']),
  question(27, 'tautology', 'medium', 'ถ้ารูปแบบหนึ่งมีตัวแปรประพจน์ 4 ตัว ตารางค่าความจริงเต็มมีทั้งหมดกี่แถว', { a: '4', b: '8', c: '12', d: '16', e: '32' }, 'd', 'ตัวแปรแต่ละตัวเลือกได้ 2 ค่าอย่างอิสระ', ['$2^4=16$', 'ดังนั้นตารางเต็มมี 16 แถว']),
  question(28, 'tautology', 'hard', 'รูปแบบ $(p\\to q)\\land(p\\to\\neg q)$ สมมูลกับรูปใด', { a: '$\\neg p$', b: '$p$', c: '$q$', d: '$\\neg q$', e: '$p\\land q$' }, 'a', 'แจกแจงรูปที่มี $\\neg p$ ซ้ำกัน', ['$(\\neg p\\lor q)\\land(\\neg p\\lor\\neg q)$', '$=\\neg p\\lor(q\\land\\neg q)=\\neg p$']),
  question(29, 'tautology', 'hard', 'ถ้า $(p\\to q)\\land(q\\to r)$ เป็นจริง และ $p$ เป็นจริง ข้อใดต้องเป็นจริง', { a: '$q\\land r$', b: '$\\neg q\\land r$', c: '$q\\land\\neg r$', d: '$\\neg q\\land\\neg r$', e: '$p\\land\\neg r$' }, 'a', 'ใช้เหตุจริงไล่ผ่านอิมพลิเคชันทีละตัว', ['$p$ จริงและ $p\\to q$ จริง บังคับให้ $q$ จริง', '$q$ จริงและ $q\\to r$ จริง บังคับให้ $r$ จริง']),
  question(30, 'tautology', 'hard', 'ถ้า $p\\leftrightarrow q$ เป็นเท็จ และ $q\\to r$ เป็นเท็จ ค่าความจริงของ $(p,q,r)$ คือข้อใด', { a: '$(T,T,F)$', b: '$(F,T,F)$', c: '$(T,F,T)$', d: '$(F,F,T)$', e: '$(T,F,F)$' }, 'b', '$q\\to r$ เท็จระบุค่า $q,r$ ได้ทันที', ['$q\\to r$ เท็จ จึง $q=T,r=F$', '$p\\leftrightarrow q$ เท็จและ $q=T$ จึง $p=F$']),
]

const argumentQuestions: Question[] = [
  question(31, 'argument', 'medium', 'เหตุ: $p\\to q$, $p$ เป็นจริง ข้อสรุปใดทำให้การอ้างเหตุผลสมเหตุสมผล', { a: '$q$', b: '$\\neg q$', c: '$\\neg p$', d: '$q\\to p$', e: '$p\\leftrightarrow q$' }, 'a', 'ใช้กฎ modus ponens', ['$p\\to q$ และ $p$ จริง', 'จึงสรุป $q$ ได้']),
  question(32, 'argument', 'medium', 'เหตุ: $p\\to q$, $\\neg q$ เป็นจริง ข้อสรุปใดถูกต้อง', { a: '$\\neg p$', b: '$p$', c: '$q$', d: '$q\\to p$', e: '$p\\land q$' }, 'a', 'ใช้บทกลับทางนิเสธ', ['$p\\to q$ สมมูลกับ $\\neg q\\to\\neg p$', 'เมื่อ $\\neg q$ จริง จึงได้ $\\neg p$']),
  question(33, 'argument', 'hard', 'ข้อใดเป็นการอ้างเหตุผลที่ไม่สมเหตุสมผล', { a: '$p\\to q,\\ q\\ \\therefore p$', b: '$p\\to q,\\ p\\ \\therefore q$', c: '$p\\to q,\\neg q\\ \\therefore\\neg p$', d: '$p\\lor q,\\neg p\\ \\therefore q$', e: '$p\\land q\\ \\therefore p$' }, 'a', 'ระวังการยืนยันผลแล้วสรุปย้อนกลับไปหาเหตุ', ['$p\\to q$ และ $q$ ไม่ได้บังคับให้ $p$ จริง', 'เช่น $p=F,q=T$ ทำให้เหตุทั้งสองจริง แต่ข้อสรุปเท็จ']),
  question(34, 'argument', 'hard', 'เหตุ: $p\\to q$, $q\\to r$, $\\neg r$ ข้อสรุปใดตามมา', { a: '$\\neg p\\land\\neg q$', b: '$p\\land q$', c: '$\\neg p\\land q$', d: '$p\\land\\neg q$', e: '$r$' }, 'a', 'ไล่ modus tollens ย้อนกลับจาก $\\neg r$', ['$q\\to r$ และ $\\neg r$ ให้ $\\neg q$', '$p\\to q$ และ $\\neg q$ ให้ $\\neg p$']),
  question(35, 'argument', 'hard', 'เหตุ: $p\\lor q$, $p\\to r$, $q\\to r$ ข้อสรุปใดต้องจริง', { a: '$r$', b: '$p$', c: '$q$', d: '$p\\land q$', e: '$\\neg r$' }, 'a', 'แยกกรณีตาม $p\\lor q$', ['ถ้า $p$ จริง จาก $p\\to r$ ได้ $r$', 'ถ้า $q$ จริง จาก $q\\to r$ ได้ $r$', 'ทุกกรณีจึงได้ $r$']),
  question(36, 'argument', 'hard', 'เหตุ: $p\\to(q\\land r)$ และ $\\neg r$ ข้อสรุปใดสมเหตุสมผล', { a: '$\\neg p$', b: '$p$', c: '$q$', d: '$\\neg q$', e: '$q\\land r$' }, 'a', 'หาก $p$ จริง ผลทั้งก้อนต้องจริง', ['$\\neg r$ ทำให้ $q\\land r$ เท็จ', 'ใช้ modus tollens กับ $p\\to(q\\land r)$ จึงได้ $\\neg p$']),
  question(37, 'argument', 'hard', 'ข้อใดเป็นค่าความจริงที่แสดงว่าเหตุ $p\\to q$, $q\\to r$ ไม่เพียงพอจะสรุป $r\\to p$', { a: '$(p,q,r)=(F,F,T)$', b: '$(T,T,T)$', c: '$(F,F,F)$', d: '$(F,T,T)$', e: '$(T,F,F)$' }, 'a', 'ต้องทำให้เหตุทุกข้อจริง แต่ข้อสรุปเท็จ', ['เมื่อ $(F,F,T)$ เหตุ $p\\to q$ และ $q\\to r$ จริง', 'แต่ $r\\to p$ เป็น $T\\to F$ จึงเท็จ']),
  question(38, 'argument', 'medium', 'เหตุ: นักเรียนทุกคนที่ส่งงานครบจะผ่านรายวิชา, เมย์ส่งงานครบ ข้อสรุปใดถูกต้อง', { a: 'เมย์ผ่านรายวิชา', b: 'ทุกคนผ่านรายวิชา', c: 'คนที่ผ่านทุกคนส่งงานครบ', d: 'เมย์เป็นนักเรียนเพียงคนเดียวที่ผ่าน', e: 'สรุปอะไรไม่ได้' }, 'a', 'แทนเงื่อนไขเป็นอิมพลิเคชันแล้วใช้เหตุเฉพาะบุคคล', ['ส่งงานครบ $\\to$ ผ่านรายวิชา', 'เมย์ส่งงานครบ จึงสรุปว่าเมย์ผ่านรายวิชา']),
  question(39, 'argument', 'hard', 'เหตุ: ไม่มีจำนวนคี่ใดหารด้วย 2 ลงตัว, 15 เป็นจำนวนคี่ ข้อสรุปใดตามมา', { a: '15 หารด้วย 2 ไม่ลงตัว', b: '15 เป็นจำนวนคู่', c: 'จำนวนที่หารด้วย 2 ไม่ลงตัวทุกจำนวนเป็น 15', d: 'ไม่มีจำนวนใดหารด้วย 2 ลงตัว', e: '15 หารด้วย 3 ไม่ลงตัว' }, 'a', 'นำสมาชิกเฉพาะตัวเข้าสู่กฎสากล', ['จำนวนคี่ทุกจำนวนมีสมบัติหารด้วย 2 ไม่ลงตัว', '15 เป็นจำนวนคี่ จึงมีสมบัตินั้น']),
  question(40, 'argument', 'hard', 'เหตุ: $p\\lor q$, $\\neg p\\lor r$, $\\neg q$ ข้อสรุปใดต้องจริง', { a: '$r$', b: '$\\neg r$', c: '$q$', d: '$\\neg p$', e: '$p\\land\\neg r$' }, 'a', '$\\neg q$ ช่วยตัดหนึ่งทางเลือกในเหตุแรก', ['$p\\lor q$ และ $\\neg q$ ให้ $p$', '$\\neg p\\lor r$ เทียบเท่า $p\\to r$', 'เมื่อ $p$ จริง จึงได้ $r$']),
]

const quantifierQuestions: Question[] = [
  question(41, 'quantifier', 'medium', 'นิเสธของ “สำหรับทุกจำนวนจริง $x$, $x^2\\ge0$” คือข้อใด', { a: 'มีจำนวนจริง $x$ บางจำนวนที่ $x^2<0$', b: 'สำหรับทุก $x$, $x^2<0$', c: 'มี $x$ บางจำนวนที่ $x^2\\le0$', d: 'สำหรับทุก $x$, $x^2>0$', e: 'ไม่มีจำนวนจริง $x$' }, 'a', 'สลับ $\\forall$ เป็น $\\exists$ และนิเสธภาคแสดง', ['$\\neg[\\forall x\\,P(x)]\\equiv\\exists x\\,\\neg P(x)$', 'นิเสธของ $x^2\\ge0$ คือ $x^2<0$']),
  question(42, 'quantifier', 'medium', 'นิเสธของ “มีจำนวนเต็ม $x$ ที่ $x^2=2$” คือข้อใด', { a: 'สำหรับทุกจำนวนเต็ม $x$, $x^2\\ne2$', b: 'มีจำนวนเต็ม $x$ ที่ $x^2\\ne2$', c: 'สำหรับทุกจำนวนเต็ม $x$, $x^2=2$', d: 'ไม่มีจำนวนจริงที่ยกกำลังสองได้ 2', e: '$x^2<2$ สำหรับทุกจำนวนเต็ม $x$' }, 'a', 'สลับ $\\exists$ เป็น $\\forall$ แล้วนิเสธสมการ', ['$\\neg[\\exists x\\,P(x)]\\equiv\\forall x\\,\\neg P(x)$', 'จึงได้ $x^2\\ne2$ สำหรับจำนวนเต็มทุกตัว']),
  question(43, 'quantifier', 'hard', 'เมื่อเอกภพสัมพัทธ์เป็นจำนวนจริง ข้อใดเป็นจริง', { a: '$\\forall x\\,\\exists y\\,(y>x)$', b: '$\\exists y\\,\\forall x\\,(y>x)$', c: '$\\forall x\\,(x^2>0)$', d: '$\\exists x\\,(x^2<0)$', e: '$\\forall x\\,(x>x-1)$ เป็นเท็จ' }, 'a', 'ระวังลำดับของตัวบ่งปริมาณ', ['สำหรับทุก $x$ เลือก $y=x+1$ ได้ จึง $y>x$', 'ไม่มีจำนวนจริงตัวเดียวที่มากกว่าจำนวนจริงทุกตัว']),
  question(44, 'quantifier', 'hard', 'เมื่อเอกภพสัมพัทธ์เป็นจำนวนเต็ม ข้อใดเป็นเท็จ', { a: '$\\forall x\\,\\exists y\\,(x+y=0)$', b: '$\\exists x\\,\\forall y\\,(x+y=y)$', c: '$\\forall x\\,(x^2\\ge0)$', d: '$\\exists x\\,(x^2=9)$', e: '$\\forall x\\,\\exists y\\,(xy=1)$' }, 'e', 'ตรวจว่าจำนวนเต็มทุกตัวมีผกผันการคูณเป็นจำนวนเต็มหรือไม่', ['เลือก $x=2$ จะไม่มีจำนวนเต็ม $y$ ที่ทำให้ $2y=1$', 'จึงทำให้ข้อความสากลในข้อ e เป็นเท็จ']),
  question(45, 'quantifier', 'hard', 'นิเสธของ $\\forall x\\,[P(x)\\to Q(x)]$ คือข้อใด', { a: '$\\exists x\\,[P(x)\\land\\neg Q(x)]$', b: '$\\forall x\\,[P(x)\\land\\neg Q(x)]$', c: '$\\exists x\\,[\\neg P(x)\\land Q(x)]$', d: '$\\exists x\\,[P(x)\\to\\neg Q(x)]$', e: '$\\forall x\\,[\\neg P(x)\\lor Q(x)]$' }, 'a', 'นิเสธทั้งตัวบ่งปริมาณและอิมพลิเคชัน', ['$\\neg(P\\to Q)=P\\land\\neg Q$', 'จึงได้ $\\exists x\\,[P(x)\\land\\neg Q(x)]$']),
  question(46, 'quantifier', 'hard', 'ประโยค “นักเรียนทุกคนอ่านหนังสือบางเล่ม” เขียนได้ตรงที่สุดเป็นข้อใด เมื่อ $S(x)$ แปลว่า $x$ เป็นนักเรียน และ $R(x,y)$ แปลว่า $x$ อ่านหนังสือ $y$', { a: '$\\forall x\\,[S(x)\\to\\exists y\\,R(x,y)]$', b: '$\\exists y\\,\\forall x\\,[S(x)\\to R(x,y)]$', c: '$\\exists x\\,[S(x)\\land\\forall y\\,R(x,y)]$', d: '$\\forall y\\,\\exists x\\,[S(x)\\land R(x,y)]$', e: '$\\forall x\\forall y\\,[S(x)\\to R(x,y)]$' }, 'a', 'หนังสือที่แต่ละคนอ่านอาจเป็นคนละเล่มกัน', ['เริ่มด้วยนักเรียนแต่ละคน $\\forall x$', 'ภายในต้องมีหนังสืออย่างน้อยหนึ่งเล่ม $\\exists y$ ที่คนนั้นอ่าน']),
  question(47, 'quantifier', 'hard', 'ข้อใดอธิบายความต่างระหว่าง $\\forall x\\exists y\\,P(x,y)$ กับ $\\exists y\\forall x\\,P(x,y)$ ได้ถูกต้อง', { a: 'แบบแรก $y$ เปลี่ยนตาม $x$ ได้ แต่แบบหลังต้องมี $y$ ตัวเดียวใช้ได้กับทุก $x$', b: 'สองข้อความสมมูลกันเสมอ', c: 'แบบแรกเข้มกว่าแบบหลังเสมอ', d: 'แบบหลังให้ $y$ เปลี่ยนตาม $x$ ได้', e: 'ต่างกันเฉพาะเมื่อเอกภพว่าง' }, 'a', 'อ่านตัวบ่งปริมาณจากซ้ายไปขวาและดูว่าตัวแปรใดเลือกก่อน', ['ใน $\\forall x\\exists y$ เราเลือก $y$ หลังรู้ค่า $x$', 'ใน $\\exists y\\forall x$ ต้องเลือก $y$ หนึ่งตัวก่อน แล้วใช้กับทุก $x$']),
  question(48, 'quantifier', 'hard', 'เมื่อเอกภพเป็น $\\{1,2,3,4\\}$ และ $P(x)$ แปลว่า “$x$ เป็นจำนวนคู่” ข้อใดมีค่าความจริงเป็นจริง', { a: '$\\exists x\\,P(x)\\land\\exists x\\,\\neg P(x)$', b: '$\\forall x\\,P(x)$', c: '$\\forall x\\,\\neg P(x)$', d: '$\\neg\\exists x\\,P(x)$', e: '$\\exists x\\,[P(x)\\land\\neg P(x)]$' }, 'a', 'เอกภพมีทั้งสมาชิกคู่และสมาชิกคี่', ['$2,4$ ทำให้ $P(x)$ จริงได้', '$1,3$ ทำให้ $\\neg P(x)$ จริงได้ จึงข้อความประกอบในข้อ a เป็นจริง']),
  question(49, 'quantifier', 'hard', 'ให้ $P(x,y)$ แปลว่า $x<y$ บนเอกภพจำนวนจริง นิเสธของ $\\exists x\\forall y\\,P(x,y)$ คือข้อใด', { a: '$\\forall x\\exists y\\,(x\\ge y)$', b: '$\\exists x\\forall y\\,(x\\ge y)$', c: '$\\forall x\\forall y\\,(x\\ge y)$', d: '$\\exists x\\exists y\\,(x<y)$', e: '$\\forall x\\exists y\\,(x<y)$' }, 'a', 'สลับตัวบ่งปริมาณทุกชั้นตามลำดับ แล้วนิเสบภาคแสดง', ['$\\neg\\exists x\\forall y\\,P(x,y)\\equiv\\forall x\\exists y\\,\\neg P(x,y)$', 'นิเสธของ $x<y$ คือ $x\\ge y$']),
  question(50, 'quantifier', 'hard', 'เมื่อเอกภพเป็นจำนวนจริง ข้อใดมีค่าความจริงเหมือน $\\neg\\forall x\\,(x^2+x\\ge0)$', { a: 'มีจำนวนจริง $x$ ที่ $x^2+x<0$', b: 'ทุกจำนวนจริงทำให้ $x^2+x<0$', c: 'มีจำนวนจริง $x$ ที่ $x^2+x\\le0$', d: 'ไม่มีจำนวนจริง $x$ ที่ $x^2+x<0$', e: 'ทุกจำนวนจริงทำให้ $x^2+x>0$' }, 'a', 'นิเสธ $\\forall$ เป็น $\\exists$ และนิเสธ $\\ge$ เป็น $<$', ['$\\neg\\forall x\\,(x^2+x\\ge0)\\equiv\\exists x\\,(x^2+x<0)$', 'เช่น $x=-\\tfrac12$ ทำให้ค่าเป็น $-\\tfrac14<0$']),
]

export const logicChallengeQuestions: Question[] = [
  ...truthCountQuestions,
  ...equivalenceQuestions,
  ...formQuestions,
  ...argumentQuestions,
  ...quantifierQuestions,
]

if (logicChallengeQuestions.length !== 50) {
  throw new Error(`Expected 50 logic challenge questions, received ${logicChallengeQuestions.length}`)
}

const ids = new Set<string>()
for (const item of logicChallengeQuestions) {
  if (ids.has(item.id)) throw new Error(`Duplicate logic question id: ${item.id}`)
  ids.add(item.id)
  const choices = item.content.choices
  if (!choices || !(item.answer in choices)) throw new Error(`Invalid answer key for ${item.id}`)
  if (new Set(Object.values(choices)).size !== 5) throw new Error(`Duplicate choices in ${item.id}`)
}
