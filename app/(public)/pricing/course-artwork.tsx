type ArtworkConfig = {
  background: string
  backgroundEnd: string
  accent: string
  secondary: string
  label: string
  kind: string
  arcana: string
  numeral: string
}

const ARTWORKS: Record<string, ArtworkConfig> = {
  'foundation-high-school': { background: '#6D28D9', backgroundEnd: '#281057', accent: '#FFD166', secondary: '#5EEAD4', label: 'FOUNDATION', kind: 'foundation', arcana: 'THE FOOL', numeral: '0' },
  'a-level-math-1-intensive': { background: '#E11D48', backgroundEnd: '#59122D', accent: '#FFE066', secondary: '#67E8F9', label: 'A-LEVEL 1', kind: 'intensive', arcana: 'THE CHARIOT', numeral: 'VII' },
  set: { background: '#0284C7', backgroundEnd: '#173A75', accent: '#FDE047', secondary: '#F0ABFC', label: 'SET THEORY', kind: 'set', arcana: 'THE LOVERS', numeral: 'VI' },
  logic: { background: '#7C3AED', backgroundEnd: '#2E1065', accent: '#FDE68A', secondary: '#6EE7B7', label: 'LOGIC', kind: 'logic', arcana: 'JUSTICE', numeral: 'XI' },
  'real-numbers': { background: '#059669', backgroundEnd: '#064E3B', accent: '#FDE047', secondary: '#93C5FD', label: 'REAL NUMBERS', kind: 'numbers', arcana: 'THE WORLD', numeral: 'XXI' },
  'relations-functions': { background: '#2563EB', backgroundEnd: '#312E81', accent: '#FBBF24', secondary: '#FB7185', label: 'FUNCTIONS', kind: 'function', arcana: 'THE EMPRESS', numeral: 'III' },
  'exponential-logarithm': { background: '#C026D3', backgroundEnd: '#581C87', accent: '#FDE047', secondary: '#FDBA74', label: 'EXP · LOG', kind: 'exponential', arcana: 'THE TOWER', numeral: 'XVI' },
  'analytic-geometry-conics': { background: '#0891B2', backgroundEnd: '#164E63', accent: '#FDE68A', secondary: '#C4B5FD', label: 'CONICS', kind: 'conics', arcana: 'THE STAR', numeral: 'XVII' },
  trigonometry: { background: '#F97316', backgroundEnd: '#9A3412', accent: '#FEF08A', secondary: '#7DD3FC', label: 'TRIGONOMETRY', kind: 'trigonometry', arcana: 'THE SUN', numeral: 'XIX' },
  matrix: { background: '#4F46E5', backgroundEnd: '#312E81', accent: '#F9A8D4', secondary: '#5EEAD4', label: 'MATRIX', kind: 'matrix', arcana: 'THE HIGH PRIESTESS', numeral: 'II' },
  vector: { background: '#0D9488', backgroundEnd: '#134E4A', accent: '#FDE047', secondary: '#FDA4AF', label: 'VECTORS', kind: 'vector', arcana: 'THE EMPEROR', numeral: 'IV' },
  'complex-numbers': { background: '#7E22CE', backgroundEnd: '#3B0764', accent: '#FDE68A', secondary: '#60A5FA', label: 'COMPLEX', kind: 'complex', arcana: 'THE MOON', numeral: 'XVIII' },
  'counting-probability': { background: '#DB2777', backgroundEnd: '#831843', accent: '#FDE047', secondary: '#FDBA74', label: 'COUNTING', kind: 'counting', arcana: 'WHEEL OF FORTUNE', numeral: 'X' },
  'sequences-series': { background: '#16A34A', backgroundEnd: '#14532D', accent: '#FDE047', secondary: '#7DD3FC', label: 'SEQUENCES', kind: 'sequence', arcana: 'TEMPERANCE', numeral: 'XIV' },
  calculus: { background: '#4F46E5', backgroundEnd: '#1E1B4B', accent: '#FBBF24', secondary: '#FB7185', label: 'CALCULUS', kind: 'calculus', arcana: 'THE MAGICIAN', numeral: 'I' },
  'statistics-distributions': { background: '#EA580C', backgroundEnd: '#7C2D12', accent: '#FEF08A', secondary: '#5EEAD4', label: 'STATISTICS', kind: 'statistics', arcana: 'THE HERMIT', numeral: 'IX' },
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
  const gradientId = `course-gradient-${courseId}`
  const glowId = `course-glow-${courseId}`

  return (
    <div className="relative h-full w-full overflow-hidden" role="img" aria-label={`ภาพประกอบคอร์ส${courseName}`}>
      <svg viewBox="0 0 320 420" className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.025]" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={artwork.background} />
            <stop offset="1" stopColor={artwork.backgroundEnd} />
          </linearGradient>
          <radialGradient id={glowId} cx="50%" cy="42%" r="58%">
            <stop stopColor={artwork.accent} stopOpacity=".28" />
            <stop offset="1" stopColor={artwork.accent} stopOpacity="0" />
          </radialGradient>
          <pattern id={gridId} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="white" strokeOpacity=".045" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="420" fill={`url(#${gradientId})`} />
        <rect width="320" height="420" fill={`url(#${gridId})`} />
        <rect width="320" height="420" fill={`url(#${glowId})`} />

        <rect x="12" y="12" width="296" height="396" rx="18" fill="none" stroke={artwork.accent} strokeWidth="3" />
        <rect x="21" y="21" width="278" height="378" rx="13" fill="none" stroke="white" strokeOpacity=".5" />
        <path d="M21 72H67L83 56H237L253 72H299M21 340H67L83 356H237L253 340H299" fill="none" stroke={artwork.accent} strokeWidth="2" />
        <path d="M32 42L39 49L32 56L25 49ZM288 42L295 49L288 56L281 49ZM32 364L39 371L32 378L25 371ZM288 364L295 371L288 378L281 371Z" fill={artwork.secondary} />

        <circle cx="160" cy="52" r="24" fill={artwork.backgroundEnd} stroke={artwork.accent} strokeWidth="2" />
        <path d="M160 31V73M139 52H181M145 37L175 67M175 37L145 67" stroke={artwork.accent} strokeOpacity=".5" strokeWidth="1" />
        <text x="160" y="57" fill="white" fontSize="14" fontWeight="800" textAnchor="middle" letterSpacing="1">{artwork.numeral}</text>

        <ellipse cx="160" cy="202" rx="126" ry="119" fill={artwork.backgroundEnd} fillOpacity=".34" stroke="white" strokeOpacity=".22" strokeWidth="2" />
        <circle cx="160" cy="202" r="105" fill="none" stroke={artwork.accent} strokeOpacity=".3" strokeWidth="1" strokeDasharray="3 8" />
        <g transform="translate(0 91)">
          <Diagram kind={artwork.kind} accent={artwork.accent} secondary={artwork.secondary} />
        </g>

        <path d="M72 327H248" stroke="white" strokeOpacity=".3" />
        <text x="160" y="354" fill={artwork.accent} fontSize="17" fontWeight="800" textAnchor="middle" letterSpacing="2.6">{artwork.arcana}</text>
        <text x="160" y="379" fill="white" fillOpacity=".88" fontSize="10" fontWeight="700" textAnchor="middle" letterSpacing="2.4">{artwork.label}</text>
        <circle cx="126" cy="393" r="2.5" fill={artwork.secondary} /><path d="M136 393H184" stroke="white" strokeOpacity=".4" /><circle cx="194" cy="393" r="2.5" fill={artwork.secondary} />
      </svg>
    </div>
  )
}
