export type TopicProgress = { done: number; total: number }
export type AdventureGrade = 'all' | 'ม.4' | 'ม.5' | 'ม.6'

export type AdventureTopic = {
  id: string
  icon: string
  name: string
  nameEn: string
  grade: Exclude<AdventureGrade, 'all'>
  formula: string
}

export const ADVENTURE_TOPICS: AdventureTopic[] = [
  { id: 'set', icon: '∪', name: 'เซต', nameEn: 'Set', grade: 'ม.4', formula: 'A \\cup B = \\{x \\mid x \\in A \\lor x \\in B\\}' },
  { id: 'logic', icon: '∧', name: 'ตรรกศาสตร์', nameEn: 'Logic', grade: 'ม.4', formula: 'p \\to q \\equiv \\neg p \\lor q' },
  { id: 'real-numbers', icon: 'ℝ', name: 'จำนวนจริง', nameEn: 'Real Numbers', grade: 'ม.4', formula: '|2x-3|<5' },
  { id: 'relations-functions', icon: 'f', name: 'ความสัมพันธ์และฟังก์ชัน', nameEn: 'Relations & Functions', grade: 'ม.4', formula: '(f \\circ g)(x)=f(g(x))' },
  { id: 'exponential-logarithm', icon: 'eˣ', name: 'เอกซ์โพเนนเชียลและลอการิทึม', nameEn: 'Exponential & Logarithm', grade: 'ม.4', formula: '\\log_a(xy)=\\log_a x+\\log_a y' },
  { id: 'analytic-geometry-conics', icon: '⊙', name: 'เรขาคณิตวิเคราะห์และภาคตัดกรวย', nameEn: 'Analytic Geometry & Conics', grade: 'ม.4', formula: '(x-h)^2+(y-k)^2=r^2' },
  { id: 'trigonometry', icon: '△', name: 'ฟังก์ชันตรีโกณมิติ', nameEn: 'Trigonometry', grade: 'ม.5', formula: '\\sin^2\\theta+\\cos^2\\theta=1' },
  { id: 'matrix', icon: '[ ]', name: 'เมทริกซ์', nameEn: 'Matrix', grade: 'ม.5', formula: '\\det(AB)=\\det A\\cdot\\det B' },
  { id: 'vector', icon: '→', name: 'เวกเตอร์', nameEn: 'Vector', grade: 'ม.5', formula: '\\mathbf{u}\\cdot\\mathbf{v}=|u||v|\\cos\\theta' },
  { id: 'complex-numbers', icon: 'ℂ', name: 'จำนวนเชิงซ้อน', nameEn: 'Complex Numbers', grade: 'ม.5', formula: 'i^2=-1' },
  { id: 'counting-probability', icon: 'n!', name: 'หลักการนับเบื้องต้นและความน่าจะเป็น', nameEn: 'Counting & Probability', grade: 'ม.5', formula: '\\binom{n}{r}=\\frac{n!}{r!(n-r)!}' },
  { id: 'sequences-series', icon: '∑', name: 'ลำดับและอนุกรม', nameEn: 'Sequences & Series', grade: 'ม.6', formula: 'S_n=\\frac{n}{2}(a_1+a_n)' },
  { id: 'calculus', icon: '∫', name: 'แคลคูลัสเบื้องต้น', nameEn: 'Calculus', grade: 'ม.6', formula: '\\frac{d}{dx}x^n=nx^{n-1}' },
  { id: 'statistics-distributions', icon: 'σ', name: 'สถิติและตัวแปรสุ่ม', nameEn: 'Statistics & Distributions', grade: 'ม.6', formula: 'z=\\frac{x-\\mu}{\\sigma}' },
]

export const ADVENTURE_REGIONS = [
  { grade: 'ม.4', name: 'ป่าแห่งการเริ่มต้น', subtitle: 'Forest of beginnings', image: '/adventure/grade4.webp', color: '#0B684D' },
  { grade: 'ม.5', name: 'หอคอยแห่งการค้นพบ', subtitle: 'Observatory of discovery', image: '/adventure/grade5.webp', color: '#087D8A' },
  { grade: 'ม.6', name: 'วิหารเหนือเมฆ', subtitle: 'Sanctuary in the clouds', image: '/adventure/grade6.webp', color: '#8A5715' },
] as const

export const ADVENTURE_DESTINATIONS = [
  { id: 'archive', name: 'หอสมุดกลางพฤกษา', description: 'เริ่มจากสิ่งที่เกี่ยวข้องกัน แล้วค้นหาความจริงทีละเงื่อนไข', topics: ['set', 'logic'] },
  { id: 'crystal', name: 'ถ้ำผลึกแห่งจำนวน', description: 'สำรวจโลกของจำนวน จากเส้นจำนวนสู่ระนาบเชิงซ้อน', topics: ['real-numbers', 'complex-numbers'] },
  { id: 'curves', name: 'สวนแห่งการเปลี่ยนแปลง', description: 'มองความสัมพันธ์ อ่านกราฟ และเข้าใจสิ่งที่กำลังเปลี่ยน', topics: ['relations-functions', 'calculus'] },
  { id: 'clockwork', name: 'หอคอยแห่งแบบรูป', description: 'ค้นหากฎของการเติบโต และมองให้เห็นรูปแบบที่ซ่อนอยู่', topics: ['exponential-logarithm', 'sequences-series'] },
  { id: 'geometry', name: 'วิหารเรขาคณิต', description: 'เชื่อมรูปทรง พิกัด และการคำนวณให้เป็นภาพเดียวกัน', topics: ['analytic-geometry-conics', 'matrix'] },
  { id: 'harbour', name: 'ท่าเรือแห่งทิศทาง', description: 'ออกสำรวจมุม ระยะทาง และทิศทางของการเคลื่อนที่', topics: ['trigonometry', 'vector'] },
  { id: 'celestial', name: 'สวนดาราแห่งความเป็นไปได้', description: 'นับความเป็นไปได้ แล้วใช้ข้อมูลทำความเข้าใจความไม่แน่นอน', topics: ['counting-probability', 'statistics-distributions'] },
] as const

export function getTopicArtwork(topicId: string) {
  const destination = ADVENTURE_DESTINATIONS.find(place => place.topics.some(id => id === topicId))
  return destination ? `/adventure/${destination.id}.webp` : '/adventure/island.webp'
}

export const MAP_LOCATIONS = [
  [11, 24], [26, 37], [10, 50], [27, 66], [10, 78], [26, 91],
  [44, 25], [59, 41], [43, 55], [59, 70], [46, 88],
  [79, 29], [87, 55], [77, 80],
] as const

export function filterAdventureTopics(grade: AdventureGrade, query: string) {
  const search = query.trim().toLocaleLowerCase('th')
  return ADVENTURE_TOPICS.filter(topic => (grade === 'all' || topic.grade === grade)
    && `${topic.name} ${topic.nameEn}`.toLocaleLowerCase('th').includes(search))
}

export function getTopicProgress(progress: Record<string, TopicProgress>, topicId: string) {
  const value = progress[topicId] ?? { done: 0, total: 50 }
  const total = Math.max(0, value.total)
  const done = Math.max(0, Math.min(value.done, total))
  return { done, total, percent: total > 0 ? Math.round(done / total * 100) : 0 }
}

export function getPracticeHref(topicId: string, signedIn: boolean) {
  const href = `/practice/${topicId}`
  return signedIn ? href : `/login?next=${encodeURIComponent(href)}`
}

export function buildTopicProgress(rows: Array<{ topic_id: string; question_id: string }>): Record<string, TopicProgress> {
  const completed = new Map<string, Set<string>>()
  for (const row of rows) {
    const ids = completed.get(row.topic_id) ?? new Set<string>()
    ids.add(row.question_id)
    completed.set(row.topic_id, ids)
  }
  return Object.fromEntries([...completed].map(([topicId, ids]) => [topicId, { done: Math.min(ids.size, 50), total: 50 }]))
}
