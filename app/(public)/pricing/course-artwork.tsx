import Image from 'next/image'
import { getTopicArtwork } from '@/lib/adventure-topics'

type ArtworkConfig = {
  background: string
  accent: string
  label: string
  symbol: string
  symbolSize: number
}

const ARTWORKS: Record<string, ArtworkConfig> = {
  'foundation-high-school': { background: 'var(--accent)', accent: '#FFE3A2', label: 'MATH FOUNDATION', symbol: 'x + y', symbolSize: 64 },
  'a-level-math-1-intensive': { background: 'var(--accent)', accent: '#FFE3A2', label: 'A-LEVEL MATH 1', symbol: '∫₀¹', symbolSize: 82 },
  set: { background: 'var(--accent)', accent: '#FFE3A2', label: 'SET THEORY', symbol: '∪', symbolSize: 96 },
  logic: { background: 'var(--accent)', accent: '#FFE3A2', label: 'LOGIC', symbol: '⇒', symbolSize: 84 },
  'real-numbers': { background: 'var(--accent)', accent: '#FFE3A2', label: 'REAL NUMBERS', symbol: 'ℝ', symbolSize: 88 },
  'relations-functions': { background: 'var(--accent)', accent: '#FFE3A2', label: 'FUNCTIONS', symbol: 'f(x)', symbolSize: 66 },
  'exponential-logarithm': { background: 'var(--accent)', accent: '#FFE3A2', label: 'EXP · LOG', symbol: 'eˣ', symbolSize: 80 },
  'analytic-geometry-conics': { background: 'var(--accent)', accent: '#FFE3A2', label: 'CONICS', symbol: 'x²', symbolSize: 84 },
  trigonometry: { background: 'var(--accent)', accent: '#FFE3A2', label: 'TRIGONOMETRY', symbol: 'sin θ', symbolSize: 60 },
  matrix: { background: 'var(--accent)', accent: '#FFE3A2', label: 'MATRIX', symbol: 'A⁻¹', symbolSize: 76 },
  vector: { background: 'var(--accent)', accent: '#FFE3A2', label: 'VECTORS', symbol: 'v⃗', symbolSize: 90 },
  'complex-numbers': { background: 'var(--accent)', accent: '#FFE3A2', label: 'COMPLEX', symbol: 'i', symbolSize: 104 },
  'counting-probability': { background: 'var(--accent)', accent: '#FFE3A2', label: 'COUNTING', symbol: 'C', symbolSize: 96 },
  'sequences-series': { background: 'var(--accent)', accent: '#FFE3A2', label: 'SEQUENCES', symbol: 'Σ', symbolSize: 98 },
  calculus: { background: 'var(--accent)', accent: '#FFE3A2', label: 'CALCULUS', symbol: '∫', symbolSize: 104 },
  'statistics-distributions': { background: 'var(--accent)', accent: '#FFE3A2', label: 'STATISTICS', symbol: 'x̄', symbolSize: 90 },
}

export default function CourseArtwork({ courseId, courseName, featured = false }: { courseId: string; courseName: string; featured?: boolean }) {
  const artwork = ARTWORKS[courseId] ?? ARTWORKS['relations-functions']
  const image = courseId === 'foundation-high-school' ? '/adventure/archive.webp' : courseId === 'a-level-math-1-intensive' ? '/adventure/celestial.webp' : getTopicArtwork(courseId)

  return (
    <div className="relative h-full w-full overflow-hidden" role="img" aria-label={`สัญลักษณ์คณิตศาสตร์ประจำคอร์ส${courseName}`}>
      <Image src={image} fill sizes="(max-width: 640px) 100vw, 600px" alt="" />
      <svg viewBox={featured ? '0 0 400 200' : '0 0 320 220'} className="relative h-full w-full" aria-hidden="true">
        <rect width={featured ? 400 : 320} height={featured ? 200 : 220} fill="#0B3D34" fillOpacity=".48" />
        <circle cx={featured ? 200 : 160} cy={featured ? 86 : 98} r={featured ? 66 : 68} fill={artwork.accent} fillOpacity=".09" />
        <text x={featured ? 200 : 160} y={featured ? 112 : 129} fill={artwork.accent} fontFamily="Georgia, 'Times New Roman', serif" fontSize={artwork.symbolSize} fontWeight="600" textAnchor="middle">{artwork.symbol}</text>
        {!featured && <circle cx="160" cy="169" r="3" fill={artwork.accent} />}
        <text x="18" y={featured ? 181 : 204} fill={artwork.accent} fillOpacity="1" fontSize="10" fontWeight="700" letterSpacing=".5">{artwork.label}</text>
      </svg>
    </div>
  )
}
