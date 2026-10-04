type ArtworkConfig = {
  background: string
  accent: string
  secondary: string
  label: string
  kind: string
}

const ARTWORKS: Record<string, ArtworkConfig> = {
  'foundation-high-school': { background: '#171a3b', accent: '#f5a65b', secondary: '#8dd9c4', label: 'FOUNDATION', kind: 'foundation' },
  'a-level-math-1-intensive': { background: '#28133d', accent: '#ff8a5b', secondary: '#b6a2ff', label: 'A-LEVEL 1', kind: 'intensive' },
  set: { background: '#12264a', accent: '#6fb7ff', secondary: '#c3a6ff', label: 'SET THEORY', kind: 'set' },
  logic: { background: '#21173d', accent: '#b6a2ff', secondary: '#70d5c1', label: 'LOGIC', kind: 'logic' },
  'real-numbers': { background: '#173145', accent: '#70d5c1', secondary: '#f5c768', label: 'REAL NUMBERS', kind: 'numbers' },
  'relations-functions': { background: '#172554', accent: '#7cb5ff', secondary: '#f59e7a', label: 'FUNCTIONS', kind: 'function' },
  'exponential-logarithm': { background: '#331a3f', accent: '#e49cff', secondary: '#ffad66', label: 'EXP · LOG', kind: 'exponential' },
  'analytic-geometry-conics': { background: '#173349', accent: '#79d9c5', secondary: '#75a9ff', label: 'CONICS', kind: 'conics' },
  trigonometry: { background: '#1e2450', accent: '#ffad66', secondary: '#8eb8ff', label: 'TRIGONOMETRY', kind: 'trigonometry' },
  matrix: { background: '#231b46', accent: '#a99cff', secondary: '#76d8c3', label: 'MATRIX', kind: 'matrix' },
  vector: { background: '#12324a', accent: '#70d5c1', secondary: '#ffb36b', label: 'VECTORS', kind: 'vector' },
  'complex-numbers': { background: '#27204c', accent: '#b6a2ff', secondary: '#6fb7ff', label: 'COMPLEX', kind: 'complex' },
  'counting-probability': { background: '#3a2034', accent: '#ff9b75', secondary: '#f4d37b', label: 'COUNTING', kind: 'counting' },
  'sequences-series': { background: '#183044', accent: '#75d7c4', secondary: '#f1c76a', label: 'SEQUENCES', kind: 'sequence' },
  calculus: { background: '#181e49', accent: '#7caeff', secondary: '#ff956d', label: 'CALCULUS', kind: 'calculus' },
  'statistics-distributions': { background: '#263044', accent: '#f0c86d', secondary: '#78d3c0', label: 'STATISTICS', kind: 'statistics' },
}

function Diagram({ kind, accent, secondary }: Pick<ArtworkConfig, 'kind' | 'accent' | 'secondary'>) {
  const shared = { fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  switch (kind) {
    case 'foundation':
      return <>
        <path d="M56 160H258M80 184V40" stroke="white" strokeOpacity=".42" strokeWidth="2" {...shared} />
        <path d="M86 150L126 112L163 132L211 72L248 48" stroke={accent} strokeWidth="5" {...shared} />
        {[['86','150'],['126','112'],['163','132'],['211','72'],['248','48']].map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r="6" fill={secondary} stroke="white" strokeWidth="2" />)}
        <text x="95" y="70" fill="white" fillOpacity=".9" fontSize="25" fontFamily="Georgia, serif">x² + 2x</text>
      </>
    case 'intensive':
      return <>
        <rect x="72" y="38" width="176" height="144" rx="10" fill="white" fillOpacity=".08" stroke="white" strokeOpacity=".25" />
        <path d="M94 70H220M94 94H188M94 118H212" stroke="white" strokeOpacity=".55" strokeWidth="3" {...shared} />
        <circle cx="104" cy="150" r="14" stroke={secondary} strokeWidth="3" fill="none" />
        <circle cx="156" cy="150" r="14" stroke="white" strokeOpacity=".35" strokeWidth="3" fill="none" />
        <circle cx="208" cy="150" r="14" stroke="white" strokeOpacity=".35" strokeWidth="3" fill="none" />
        <path d="M96 150L102 156L114 142" stroke={accent} strokeWidth="4" {...shared} />
        <text x="206" y="73" fill={accent} fontSize="22" fontWeight="700">98</text>
      </>
    case 'set':
      return <>
        <circle cx="133" cy="111" r="59" fill={accent} fillOpacity=".16" stroke={accent} strokeWidth="4" />
        <circle cx="190" cy="111" r="59" fill={secondary} fillOpacity=".15" stroke={secondary} strokeWidth="4" />
        <text x="102" y="116" fill="white" fontSize="24" fontFamily="Georgia, serif">A</text>
        <text x="205" y="116" fill="white" fontSize="24" fontFamily="Georgia, serif">B</text>
        <path d="M157 89C171 99 171 123 157 134" stroke="white" strokeOpacity=".8" strokeWidth="2" {...shared} />
      </>
    case 'logic':
      return <>
        <rect x="70" y="47" width="180" height="128" rx="8" fill="white" fillOpacity=".05" stroke="white" strokeOpacity=".28" />
        <path d="M70 80H250M70 112H250M70 144H250M115 47V175M160 47V175M205 47V175" stroke="white" strokeOpacity=".22" strokeWidth="2" />
        <text x="86" y="70" fill={accent} fontSize="18">p</text><text x="132" y="70" fill={secondary} fontSize="18">q</text><text x="172" y="70" fill="white" fontSize="18">p → q</text>
        <path d="M84 96L92 104L104 89M129 96L137 104L149 89M214 121L236 143M236 121L214 143" stroke={accent} strokeWidth="3" {...shared} />
      </>
    case 'numbers':
      return <>
        <path d="M42 114H277" stroke="white" strokeOpacity=".65" strokeWidth="3" {...shared} />
        <path d="M48 107L38 114L48 121M270 107L280 114L270 121" stroke="white" strokeOpacity=".65" strokeWidth="3" {...shared} />
        {[75,115,160,205,245].map((x, i) => <g key={x}><path d={`M${x} 103V125`} stroke="white" strokeOpacity=".45" strokeWidth="2" /><text x={x - 7} y="148" fill="white" fillOpacity=".65" fontSize="14">{i - 2}</text></g>)}
        <circle cx="115" cy="114" r="8" fill={accent} /><circle cx="205" cy="114" r="8" fill={secondary} />
        <path d="M115 86C143 66 181 66 205 86" stroke={accent} strokeWidth="3" {...shared} />
      </>
    case 'function':
      return <>
        <path d="M50 166H270M83 190V34" stroke="white" strokeOpacity=".42" strokeWidth="2" {...shared} />
        <path d="M60 153C105 151 113 129 138 104C166 76 204 45 260 48" stroke={accent} strokeWidth="5" {...shared} />
        <path d="M61 66C102 42 139 52 165 92C191 133 221 150 260 143" stroke={secondary} strokeWidth="3" strokeDasharray="7 7" {...shared} />
        <text x="205" y="77" fill="white" fontSize="23" fontFamily="Georgia, serif">f(x)</text>
      </>
    case 'exponential':
      return <>
        <path d="M52 166H272M92 188V35" stroke="white" strokeOpacity=".38" strokeWidth="2" {...shared} />
        <path d="M62 157C145 156 190 137 216 91C232 63 243 44 263 32" stroke={accent} strokeWidth="5" {...shared} />
        <path d="M103 177C111 124 143 93 264 76" stroke={secondary} strokeWidth="4" {...shared} />
        <text x="214" y="126" fill="white" fontSize="20" fontFamily="Georgia, serif">log x</text>
      </>
    case 'conics':
      return <>
        <path d="M46 112H274M160 28V192" stroke="white" strokeOpacity=".28" strokeWidth="2" {...shared} />
        <ellipse cx="160" cy="111" rx="82" ry="48" fill={accent} fillOpacity=".08" stroke={accent} strokeWidth="4" />
        <path d="M72 174C116 166 137 139 160 111C183 83 205 56 250 48" stroke={secondary} strokeWidth="4" {...shared} />
        <circle cx="130" cy="111" r="5" fill="white" /><circle cx="190" cy="111" r="5" fill="white" />
      </>
    case 'trigonometry':
      return <>
        <circle cx="160" cy="112" r="72" fill="white" fillOpacity=".04" stroke={accent} strokeWidth="4" />
        <path d="M75 112H247M160 29V195" stroke="white" strokeOpacity=".3" strokeWidth="2" {...shared} />
        <path d="M160 112L213 63V112Z" fill={secondary} fillOpacity=".16" stroke={secondary} strokeWidth="4" strokeLinejoin="round" />
        <path d="M181 112A22 22 0 0 0 176 97" stroke="white" strokeWidth="2" {...shared} />
        <text x="184" y="100" fill="white" fontSize="16" fontFamily="Georgia, serif">θ</text>
      </>
    case 'matrix':
      return <>
        <path d="M92 52H72V172H92M228 52H248V172H228" stroke="white" strokeOpacity=".72" strokeWidth="4" {...shared} />
        {[0,1,2].flatMap(row => [0,1,2].map(col => <rect key={`${row}-${col}`} x={98 + col * 44} y={58 + row * 38} width="30" height="25" rx="4" fill={(row + col) % 2 ? secondary : accent} fillOpacity={(row + col) % 2 ? .45 : .72} />))}
        <text x="106" y="78" fill="white" fontSize="14">1</text><text x="195" y="154" fill="white" fontSize="14">−1</text>
      </>
    case 'vector':
      return <>
        <path d="M50 170H270M78 191V35" stroke="white" strokeOpacity=".32" strokeWidth="2" {...shared} />
        <path d="M78 170L218 68" stroke={accent} strokeWidth="5" {...shared} />
        <path d="M218 68L201 70M218 68L211 84" stroke={accent} strokeWidth="5" {...shared} />
        <path d="M78 170L143 58" stroke={secondary} strokeWidth="4" {...shared} />
        <path d="M143 58L129 68M143 58L142 76" stroke={secondary} strokeWidth="4" {...shared} />
        <path d="M143 58L218 68" stroke="white" strokeOpacity=".35" strokeWidth="2" strokeDasharray="6 6" />
      </>
    case 'complex':
      return <>
        <path d="M48 112H274M160 28V195" stroke="white" strokeOpacity=".35" strokeWidth="2" {...shared} />
        <path d="M160 112L222 63" stroke={accent} strokeWidth="5" {...shared} />
        <path d="M222 63L205 66M222 63L215 80" stroke={accent} strokeWidth="5" {...shared} />
        <path d="M180 112A22 22 0 0 0 176 99" stroke={secondary} strokeWidth="3" {...shared} />
        <circle cx="222" cy="63" r="7" fill={secondary} stroke="white" strokeWidth="2" />
        <text x="231" y="58" fill="white" fontSize="18" fontFamily="Georgia, serif">a + bi</text>
      </>
    case 'counting':
      return <>
        {[0,1,2,3].flatMap(row => Array.from({ length: row + 1 }, (_, col) => {
          const x = 160 - row * 30 + col * 60
          const y = 48 + row * 38
          return <circle key={`${row}-${col}`} cx={x} cy={y} r="12" fill={row === 3 ? accent : secondary} fillOpacity={row === 3 ? .75 : .42} stroke="white" strokeOpacity=".55" />
        }))}
        <path d="M160 60L130 86M160 60L190 86M130 98L100 124M130 98L160 124M190 98L160 124M190 98L220 124" stroke="white" strokeOpacity=".35" strokeWidth="2" />
        <text x="123" y="189" fill="white" fontSize="26" fontFamily="Georgia, serif">n! / r!</text>
      </>
    case 'sequence':
      return <>
        <path d="M48 172H273M73 192V35" stroke="white" strokeOpacity=".3" strokeWidth="2" {...shared} />
        {[0,1,2,3,4,5].map(i => <g key={i}><rect x={91 + i * 29} y={151 - i * 19} width="15" height={21 + i * 19} rx="3" fill={i % 2 ? secondary : accent} fillOpacity={.45 + i * .08} /><circle cx={98 + i * 29} cy={144 - i * 19} r="4" fill="white" /></g>)}
        <path d="M98 144L127 125L156 106L185 87L214 68L243 49" stroke="white" strokeOpacity=".65" strokeWidth="2" strokeDasharray="5 5" />
      </>
    case 'calculus':
      return <>
        <path d="M46 171H275M78 191V34" stroke="white" strokeOpacity=".32" strokeWidth="2" {...shared} />
        {[0,1,2,3,4].map(i => <rect key={i} x={104 + i * 27} y={151 - i * 12} width="23" height={20 + i * 12} fill={secondary} fillOpacity=".18" stroke={secondary} strokeOpacity=".5" />)}
        <path d="M62 160C99 157 115 146 140 119C166 91 180 55 261 47" stroke={accent} strokeWidth="5" {...shared} />
        <path d="M120 139L220 65" stroke="white" strokeOpacity=".7" strokeWidth="3" {...shared} />
        <text x="223" y="78" fill="white" fontSize="22" fontFamily="Georgia, serif">f′</text>
      </>
    default:
      return <>
        <path d="M54 169H270M78 190V34" stroke="white" strokeOpacity=".28" strokeWidth="2" {...shared} />
        {[0,1,2,3,4,5].map((i) => <rect key={i} x={92 + i * 27} y={139 - [14,31,52,73,48,24][i]} width="18" height={[14,31,52,73,48,24][i] + 30} rx="3" fill={i === 3 ? accent : secondary} fillOpacity={i === 3 ? .8 : .38} />)}
        <path d="M72 150C99 146 112 127 132 92C151 58 173 54 194 91C215 128 231 146 263 150" stroke={accent} strokeWidth="4" {...shared} />
        <path d="M194 54V169" stroke="white" strokeOpacity=".3" strokeWidth="2" strokeDasharray="5 6" />
      </>
  }
}

export default function CourseArtwork({ courseId, courseName }: { courseId: string; courseName: string }) {
  const artwork = ARTWORKS[courseId] ?? ARTWORKS['relations-functions']
  const gridId = `course-grid-${courseId}`

  return (
    <div className="relative h-full w-full overflow-hidden" role="img" aria-label={`ภาพประกอบคอร์ส${courseName}`}>
      <svg viewBox="0 0 320 220" className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.025]" aria-hidden="true">
        <defs>
          <pattern id={gridId} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="white" strokeOpacity=".055" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="220" fill={artwork.background} />
        <rect width="320" height="220" fill={`url(#${gridId})`} />
        <circle cx="278" cy="-6" r="82" fill={artwork.accent} fillOpacity=".08" />
        <circle cx="24" cy="218" r="72" fill={artwork.secondary} fillOpacity=".07" />
        <Diagram kind={artwork.kind} accent={artwork.accent} secondary={artwork.secondary} />
        <text x="18" y="204" fill="white" fillOpacity=".55" fontSize="10" fontWeight="700" letterSpacing="2.2">{artwork.label}</text>
        <path d="M18 190H52" stroke={artwork.accent} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  )
}
