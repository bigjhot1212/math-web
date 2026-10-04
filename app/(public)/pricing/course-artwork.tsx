type ArtworkConfig = {
  background: string
  accent: string
  secondary: string
  label: string
  symbol: string
  symbolSize: number
  left: string
  right: string
  formula: string
}

const ARTWORKS: Record<string, ArtworkConfig> = {
  'foundation-high-school': { background: '#171a3b', accent: '#f5a65b', secondary: '#8dd9c4', label: 'FOUNDATION', symbol: '±', symbolSize: 92, left: '×', right: '÷', formula: 'a + b − c' },
  'a-level-math-1-intensive': { background: '#28133d', accent: '#ff8a5b', secondary: '#b6a2ff', label: 'A-LEVEL 1', symbol: '∑', symbolSize: 88, left: '∫', right: 'π', formula: 'lim  ·  ∂  ·  ∞' },
  set: { background: '#12264a', accent: '#6fb7ff', secondary: '#c3a6ff', label: 'SET THEORY', symbol: '∪', symbolSize: 88, left: '∩', right: '⊂', formula: 'A ∪ B' },
  logic: { background: '#21173d', accent: '#b6a2ff', secondary: '#70d5c1', label: 'LOGIC', symbol: '⇒', symbolSize: 76, left: '∧', right: '¬', formula: 'p ⇒ q' },
  'real-numbers': { background: '#173145', accent: '#70d5c1', secondary: '#f5c768', label: 'REAL NUMBERS', symbol: 'ℝ', symbolSize: 80, left: '√', right: '|x|', formula: 'x ∈ ℝ' },
  'relations-functions': { background: '#172554', accent: '#7cb5ff', secondary: '#f59e7a', label: 'FUNCTIONS', symbol: 'f(x)', symbolSize: 60, left: '↦', right: 'f⁻¹', formula: 'y = f(x)' },
  'exponential-logarithm': { background: '#331a3f', accent: '#e49cff', secondary: '#ffad66', label: 'EXP · LOG', symbol: 'eˣ', symbolSize: 72, left: 'log', right: 'ln', formula: 'aˣ = b' },
  'analytic-geometry-conics': { background: '#173349', accent: '#79d9c5', secondary: '#75a9ff', label: 'CONICS', symbol: 'x²', symbolSize: 76, left: 'F', right: 'e', formula: 'x²/a² + y²/b² = 1' },
  trigonometry: { background: '#1e2450', accent: '#ffad66', secondary: '#8eb8ff', label: 'TRIGONOMETRY', symbol: 'sin θ', symbolSize: 55, left: 'cos', right: 'tan', formula: 'sin²θ + cos²θ = 1' },
  matrix: { background: '#231b46', accent: '#a99cff', secondary: '#76d8c3', label: 'MATRIX', symbol: 'A⁻¹', symbolSize: 68, left: 'det', right: '|A|', formula: '[ a  b ; c  d ]' },
  vector: { background: '#12324a', accent: '#70d5c1', secondary: '#ffb36b', label: 'VECTORS', symbol: 'v⃗', symbolSize: 82, left: '·', right: '×', formula: 'u⃗ · v⃗' },
  'complex-numbers': { background: '#27204c', accent: '#b6a2ff', secondary: '#6fb7ff', label: 'COMPLEX', symbol: 'i', symbolSize: 96, left: 'Re', right: 'Im', formula: 'z = a + bi' },
  'counting-probability': { background: '#3a2034', accent: '#ff9b75', secondary: '#f4d37b', label: 'COUNTING', symbol: 'C', symbolSize: 88, left: 'n!', right: 'P', formula: 'P(A) = n(A)/n(S)' },
  'sequences-series': { background: '#183044', accent: '#75d7c4', secondary: '#f1c76a', label: 'SEQUENCES', symbol: 'Σ', symbolSize: 90, left: 'aₙ', right: 'r', formula: 'aₙ = a₁rⁿ⁻¹' },
  calculus: { background: '#181e49', accent: '#7caeff', secondary: '#ff956d', label: 'CALCULUS', symbol: '∫', symbolSize: 96, left: 'lim', right: 'd/dx', formula: '∫ f(x) dx' },
  'statistics-distributions': { background: '#263044', accent: '#f0c86d', secondary: '#78d3c0', label: 'STATISTICS', symbol: 'x̄', symbolSize: 82, left: 'σ', right: 'μ', formula: 'P(X ≤ x)' },
}

export default function CourseArtwork({ courseId, courseName }: { courseId: string; courseName: string }) {
  const artwork = ARTWORKS[courseId] ?? ARTWORKS['relations-functions']
  const gridId = `course-grid-${courseId}`

  return (
    <div className="relative h-full w-full overflow-hidden" role="img" aria-label={`สัญลักษณ์คณิตศาสตร์ประจำคอร์ส${courseName}`}>
      <svg viewBox="0 0 320 220" className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.025]" aria-hidden="true">
        <defs>
          <pattern id={gridId} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="white" strokeOpacity=".05" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="320" height="220" fill={artwork.background} />
        <rect width="320" height="220" fill={`url(#${gridId})`} />
        <circle cx="160" cy="99" r="72" fill={artwork.accent} fillOpacity=".07" stroke={artwork.accent} strokeOpacity=".25" />
        <circle cx="160" cy="99" r="57" fill="none" stroke="white" strokeOpacity=".12" strokeDasharray="3 8" />
        <path d="M75 99H245M160 18V180" stroke="white" strokeOpacity=".07" />

        <g fontFamily="Georgia, 'Times New Roman', serif" textAnchor="middle">
          <text x="160" y="123" fill="white" fontSize={artwork.symbolSize} fontWeight="600">{artwork.symbol}</text>
          <g>
            <circle cx="65" cy="72" r="25" fill={artwork.secondary} fillOpacity=".15" stroke={artwork.secondary} strokeOpacity=".55" />
            <text x="65" y="79" fill={artwork.secondary} fontSize={artwork.left.length > 2 ? 17 : 25} fontWeight="600">{artwork.left}</text>
          </g>
          <g>
            <circle cx="255" cy="126" r="25" fill={artwork.accent} fillOpacity=".14" stroke={artwork.accent} strokeOpacity=".6" />
            <text x="255" y="133" fill={artwork.accent} fontSize={artwork.right.length > 2 ? 16 : 24} fontWeight="600">{artwork.right}</text>
          </g>
          <text x="160" y="177" fill="white" fillOpacity=".76" fontSize="17" letterSpacing=".6">{artwork.formula}</text>
        </g>

        <text x="18" y="204" fill="white" fillOpacity=".52" fontSize="10" fontWeight="700" letterSpacing="2.2">{artwork.label}</text>
        <path d="M18 190H52" stroke={artwork.accent} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}
