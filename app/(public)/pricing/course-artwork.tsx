type ArtworkConfig = {
  background: string
  accent: string
  label: string
  symbol: string
  symbolSize: number
}

const ARTWORKS: Record<string, ArtworkConfig> = {
  'foundation-high-school': { background: '#171a3b', accent: '#f5a65b', label: 'FOUNDATION', symbol: '±', symbolSize: 100 },
  'a-level-math-1-intensive': { background: '#28133d', accent: '#ff8a5b', label: 'A-LEVEL 1', symbol: '∑', symbolSize: 96 },
  set: { background: '#12264a', accent: '#6fb7ff', label: 'SET THEORY', symbol: '∪', symbolSize: 96 },
  logic: { background: '#21173d', accent: '#b6a2ff', label: 'LOGIC', symbol: '⇒', symbolSize: 84 },
  'real-numbers': { background: '#173145', accent: '#70d5c1', label: 'REAL NUMBERS', symbol: 'ℝ', symbolSize: 88 },
  'relations-functions': { background: '#172554', accent: '#7cb5ff', label: 'FUNCTIONS', symbol: 'f(x)', symbolSize: 66 },
  'exponential-logarithm': { background: '#331a3f', accent: '#e49cff', label: 'EXP · LOG', symbol: 'eˣ', symbolSize: 80 },
  'analytic-geometry-conics': { background: '#173349', accent: '#79d9c5', label: 'CONICS', symbol: 'x²', symbolSize: 84 },
  trigonometry: { background: '#1e2450', accent: '#ffad66', label: 'TRIGONOMETRY', symbol: 'sin θ', symbolSize: 60 },
  matrix: { background: '#231b46', accent: '#a99cff', label: 'MATRIX', symbol: 'A⁻¹', symbolSize: 76 },
  vector: { background: '#12324a', accent: '#70d5c1', label: 'VECTORS', symbol: 'v⃗', symbolSize: 90 },
  'complex-numbers': { background: '#27204c', accent: '#b6a2ff', label: 'COMPLEX', symbol: 'i', symbolSize: 104 },
  'counting-probability': { background: '#3a2034', accent: '#ff9b75', label: 'COUNTING', symbol: 'C', symbolSize: 96 },
  'sequences-series': { background: '#183044', accent: '#75d7c4', label: 'SEQUENCES', symbol: 'Σ', symbolSize: 98 },
  calculus: { background: '#181e49', accent: '#7caeff', label: 'CALCULUS', symbol: '∫', symbolSize: 104 },
  'statistics-distributions': { background: '#263044', accent: '#f0c86d', label: 'STATISTICS', symbol: 'x̄', symbolSize: 90 },
}

export default function CourseArtwork({ courseId, courseName }: { courseId: string; courseName: string }) {
  const artwork = ARTWORKS[courseId] ?? ARTWORKS['relations-functions']

  return (
    <div className="relative h-full w-full overflow-hidden" role="img" aria-label={`สัญลักษณ์คณิตศาสตร์ประจำคอร์ส${courseName}`}>
      <svg viewBox="0 0 320 220" className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.025]" aria-hidden="true">
        <rect width="320" height="220" fill={artwork.background} />
        <circle cx="160" cy="98" r="68" fill={artwork.accent} fillOpacity=".08" />
        <text x="160" y="129" fill="white" fontFamily="Georgia, 'Times New Roman', serif" fontSize={artwork.symbolSize} fontWeight="600" textAnchor="middle">{artwork.symbol}</text>
        <circle cx="160" cy="169" r="3" fill={artwork.accent} />
        <text x="18" y="204" fill="white" fillOpacity=".52" fontSize="10" fontWeight="700" letterSpacing="2.2">{artwork.label}</text>
      </svg>
    </div>
  )
}
