export type HunterDraftIssue = { question: number | null; message: string }

export function validateHunterDraft(value: unknown): HunterDraftIssue[] {
  if (!Array.isArray(value)) return [{ question: null, message: 'ข้อมูลต้องเป็นรายการข้อสอบแบบ JSON array' }]
  const issues: HunterDraftIssue[] = []
  if (value.length !== 30) issues.push({ question: null, message: `ต้องมี 30 ข้อ ปัจจุบันมี ${value.length} ข้อ` })
  const ids = new Set<string>()
  value.forEach((raw, index) => {
    const number = index + 1
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) { issues.push({ question: number, message: 'รูปแบบข้อนี้ไม่ถูกต้อง' }); return }
    const q = raw as Record<string, unknown>
    const content = q.content && typeof q.content === 'object' ? q.content as Record<string, unknown> : {}
    const solution = q.solution && typeof q.solution === 'object' ? q.solution as Record<string, unknown> : {}
    if (typeof q.id !== 'string' || !q.id.trim()) issues.push({ question: number, message: 'ไม่มีรหัสข้อสอบ' })
    else if (ids.has(q.id)) issues.push({ question: number, message: 'รหัสข้อสอบซ้ำ' })
    else ids.add(q.id)
    if (typeof content.text !== 'string' || !content.text.trim()) issues.push({ question: number, message: 'ไม่มีข้อความโจทย์' })
    if (typeof q.topicId !== 'string' || !q.topicId.trim()) issues.push({ question: number, message: 'ไม่มีรหัสบท' })
    if (typeof q.subtopic !== 'string' || !q.subtopic.trim()) issues.push({ question: number, message: 'ไม่มีหัวข้อย่อย' })
    if (!['ONET', 'A-Level', 'PAT1'].includes(String(q.level))) issues.push({ question: number, message: 'ระดับข้อสอบไม่ถูกต้อง' })
    if (!['easy', 'medium', 'hard'].includes(String(q.difficulty))) issues.push({ question: number, message: 'ระดับความยากไม่ถูกต้อง' })
    if (typeof q.hint !== 'string' || !q.hint.trim()) issues.push({ question: number, message: 'ไม่มีคำใบ้' })
    if (!Array.isArray(q.tags) || q.tags.some(tag => typeof tag !== 'string')) issues.push({ question: number, message: 'แท็กต้องเป็นรายการข้อความ' })
    if (!Array.isArray(solution.steps) || !solution.steps.length || solution.steps.some(step => typeof step !== 'string' || !step.trim())) issues.push({ question: number, message: 'เฉลยต้องมีขั้นตอนเป็นข้อความที่ไม่ว่าง' })
    if (index < 25) {
      const choices = content.choices && typeof content.choices === 'object' ? content.choices as Record<string, unknown> : {}
      if (q.type !== 'multiple-choice') issues.push({ question: number, message: 'ข้อ 1–25 ต้องเป็นปรนัย' })
      if (['a', 'b', 'c', 'd', 'e'].some(key => typeof choices[key] !== 'string' || !(choices[key] as string).trim())) issues.push({ question: number, message: 'ตัวเลือกต้องครบ a–e' })
      if (typeof q.answer !== 'string' || !['a', 'b', 'c', 'd', 'e'].includes(q.answer)) issues.push({ question: number, message: 'คำตอบปรนัยต้องเป็น a–e' })
    } else {
      if (q.type !== 'short-answer') issues.push({ question: number, message: 'ข้อ 26–30 ต้องเป็นอัตนัยตัวเลข' })
      if (!/^-?\d+(?:\.\d+)?$/.test(String(q.answer ?? ''))) issues.push({ question: number, message: 'คำตอบอัตนัยต้องเป็นตัวเลข' })
    }
  })
  return issues
}
