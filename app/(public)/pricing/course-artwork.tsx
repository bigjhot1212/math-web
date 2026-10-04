type ArtworkConfig = {
  background: string
  accent: string
  label: string
  symbol: string
  symbolSize: number
}

const ARTWORKS: Record<string, ArtworkConfig> = {
  'foundation-high-school': { background: '#17204a', accent: '#8ca8ff', label: 'MATH FOUNDATION', symbol: 'x + y', symbolSize: 64 },
  'a-level-math-1-intensive': { background: '#261745', accent: '#c4b5fd', label: 'A-LEVEL MATH 1', symbol: '∫₀¹', symbolSize: 82 },
  set: { background: '#12264a', accent: '#6fb7ff', label: 'SET THEORY', symbol: '∪', symbolSize: 96 },
  logic: { background: '#21173d', accent: '#b6a2ff', label: 'LOGIC', symbol: '⇒', symbolSize: 84 },
  'real-numbers': { background: '#123247', accent: '#70d5d1', label: 'REAL NUMBERS', symbol: 'ℝ', symbolSize: 88 },
  'relations-functions': { background: '#172554', accent: '#7cb5ff', label: 'FUNCTIONS', symbol: 'f(x)', symbolSize: 66 },
  'exponential-logarithm': { background: '#2b1b46', accent: '#cf9cff', label: 'EXP · LOG', symbol: 'eˣ', symbolSize: 80 },
  'analytic-geometry-conics': { background: '#173349', accent: '#79d9d1', label: 'CONICS', symbol: 'x²', symbolSize: 84 },
  trigonometry: { background: '#1e2450', accent: '#8eb8ff', label: 'TRIGONOMETRY', symbol: 'sin θ', symbolSize: 60 },
  matrix: { background: '#231b46', accent: '#a99cff', label: 'MATRIX', symbol: 'A⁻¹', symbolSize: 76 },
  vector: { background: '#12324a', accent: '#70d5d1', label: 'VECTORS', symbol: 'v⃗', symbolSize: 90 },
  'complex-numbers': { background: '#27204c', accent: '#b6a2ff', label: 'COMPLEX', symbol: 'i', symbolSize: 104 },
  'counting-probability': { background: '#24204b', accent: '#8fb5ff', label: 'COUNTING', symbol: 'C', symbolSize: 96 },
  'sequences-series': { background: '#183044', accent: '#75d7d0', label: 'SEQUENCES', symbol: 'Σ', symbolSize: 98 },
  calculus: { background: '#181e49', accent: '#7caeff', label: 'CALCULUS', symbol: '∫', symbolSize: 104 },
  'statistics-distributions': { background: '#22294b', accent: '#9aaeff', label: 'STATISTICS', symbol: 'x̄', symbolSize: 90 },
}

export default function CourseArtwork({ courseId, courseName, featured = false }: { courseId: string; courseName: string; featured?: boolean }) {
  const artwork = ARTWORKS[courseId] ?? ARTWORKS['relations-functions']

  return (
    <div className="relative h-full w-full overflow-hidden" role="img" aria-label={`สัญลักษณ์คณิตศาสตร์ประจำคอร์ส${courseName}`}>
      <svg viewBox={featured ? '0 0 400 200' : '0 0 320 220'} className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.025]" aria-hidden="true">
        <rect width={featured ? 400 : 320} height={featured ? 200 : 220} fill={artwork.background} />
        <circle cx={featured ? 200 : 160} cy={featured ? 86 : 98} r={featured ? 66 : 68} fill={artwork.accent} fillOpacity=".09" />
        <text x={featured ? 200 : 160} y={featured ? 112 : 129} fill="white" fontFamily="Georgia, 'Times New Roman', serif" fontSize={artwork.symbolSize} fontWeight="600" textAnchor="middle">{artwork.symbol}</text>
        {!featured && <circle cx="160" cy="169" r="3" fill={artwork.accent} />}
        <text x="18" y={featured ? 181 : 204} fill="white" fillOpacity=".52" fontSize="10" fontWeight="700" letterSpacing="2.2">{artwork.label}</text>
      </svg>
    </div>
  )
}
