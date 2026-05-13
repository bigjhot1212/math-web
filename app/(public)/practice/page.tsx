import Link from 'next/link'

const topics = [
  { id: 'set', name: 'เซต', nameEn: 'Set', icon: '∪' },
  { id: 'logic', name: 'ตรรกศาสตร์', nameEn: 'Logic', icon: '∧' },
  { id: 'real-numbers', name: 'จำนวนจริง', nameEn: 'Real Numbers', icon: 'ℝ' },
  { id: 'relations-functions', name: 'ความสัมพันธ์และฟังก์ชัน', nameEn: 'Relations & Functions', icon: 'f(x)' },
  { id: 'exponential-logarithm', name: 'เอกซ์โพเนนเชียลและลอการิทึม', nameEn: 'Exponential & Logarithm', icon: 'eˣ' },
  { id: 'analytic-geometry-conics', name: 'เรขาคณิตวิเคราะห์และภาคตัดกรวย', nameEn: 'Analytic Geometry & Conics', icon: '⊙' },
  { id: 'trigonometry', name: 'ฟังก์ชันตรีโกณมิติ', nameEn: 'Trigonometry', icon: '△' },
  { id: 'matrix', name: 'เมทริกซ์', nameEn: 'Matrix', icon: '[]' },
  { id: 'vector', name: 'เวกเตอร์', nameEn: 'Vector', icon: '→' },
  { id: 'complex-numbers', name: 'จำนวนเชิงซ้อน', nameEn: 'Complex Numbers', icon: 'ℂ' },
  { id: 'counting-probability', name: 'หลักการนับเบื้องต้นและความน่าจะเป็น', nameEn: 'Counting & Probability', icon: 'n!' },
  { id: 'sequences-series', name: 'ลำดับและอนุกรม', nameEn: 'Sequences & Series', icon: '∑' },
  { id: 'calculus', name: 'แคลคูลัสเบื้องต้น', nameEn: 'Calculus', icon: '∫' },
  { id: 'statistics-distributions', name: 'สถิติและตัวแปรสุ่ม', nameEn: 'Statistics & Distributions', icon: 'σ' },
]

const levels = ['ONET', 'A-Level', 'PAT1']

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            ฝึกทำโจทย์
          </h1>
          <p className="text-muted-foreground">
            เลือกหัวข้อและระดับข้อสอบที่ต้องการฝึก
          </p>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-3">ระดับข้อสอบ</p>
          <div className="flex gap-3 flex-wrap">
            {levels.map(level => (
              <button
                key={level}
                className="px-4 py-2 rounded-full border border-border text-sm hover:bg-accent transition-colors"
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map(topic => (
            <Link
              key={topic.id}
              href={`/practice/${topic.id}`}
              className="group p-6 rounded-xl border border-border hover:border-primary hover:bg-accent/50 transition-all"
            >
              <div className="mb-3">
                <span className="text-2xl">{topic.icon}</span>
              </div>
              <h2 className="font-medium text-foreground mb-1">{topic.name}</h2>
              <p className="text-sm text-muted-foreground">{topic.nameEn}</p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}