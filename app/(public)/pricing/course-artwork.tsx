import Image from 'next/image'

type TarotCard = {
  arcana: string
  numeral: string
}

const TAROT_CARDS: Record<string, TarotCard> = {
  'foundation-high-school': { arcana: 'THE FOOL', numeral: '0' },
  'a-level-math-1-intensive': { arcana: 'THE CHARIOT', numeral: 'VII' },
  set: { arcana: 'THE LOVERS', numeral: 'VI' },
  logic: { arcana: 'JUSTICE', numeral: 'XI' },
  'real-numbers': { arcana: 'THE WORLD', numeral: 'XXI' },
  'relations-functions': { arcana: 'THE EMPRESS', numeral: 'III' },
  'exponential-logarithm': { arcana: 'THE TOWER', numeral: 'XVI' },
  'analytic-geometry-conics': { arcana: 'THE STAR', numeral: 'XVII' },
  trigonometry: { arcana: 'THE SUN', numeral: 'XIX' },
  matrix: { arcana: 'THE HIGH PRIESTESS', numeral: 'II' },
  vector: { arcana: 'THE EMPEROR', numeral: 'IV' },
  'complex-numbers': { arcana: 'THE MOON', numeral: 'XVIII' },
  'counting-probability': { arcana: 'WHEEL OF FORTUNE', numeral: 'X' },
  'sequences-series': { arcana: 'TEMPERANCE', numeral: 'XIV' },
  calculus: { arcana: 'THE MAGICIAN', numeral: 'I' },
  'statistics-distributions': { arcana: 'THE HERMIT', numeral: 'IX' },
}

export default function CourseArtwork({ courseId, courseName }: { courseId: string; courseName: string }) {
  const tarot = TAROT_CARDS[courseId] ?? TAROT_CARDS['foundation-high-school']

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0d2030]" role="img" aria-label={`ภาพไพ่ทาโร่ ${tarot.arcana} สำหรับคอร์ส${courseName}`}>
      <Image
        src={`/course-tarot/${courseId}.webp`}
        alt=""
        fill
        sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 260px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#081926]/25 via-transparent to-[#081926]/95" aria-hidden="true" />
      <div className="absolute inset-2.5 rounded-[14px] border-2 border-[#c4d2d6] shadow-[inset_0_0_0_1px_rgba(235,244,242,0.34)]" aria-hidden="true" />
      <div className="absolute inset-[15px] rounded-[10px] border border-[#e8efed]/45" aria-hidden="true" />

      <div className="absolute left-1/2 top-4 grid h-9 min-w-9 -translate-x-1/2 place-items-center rounded-full border border-[#c4d2d6] bg-[#0b2030]/85 px-2 text-[10px] font-bold tracking-wider text-[#eef4f2] shadow-lg backdrop-blur-sm">
        {tarot.numeral}
      </div>

      <div className="absolute inset-x-0 bottom-0 px-7 pb-7 pt-16 text-center">
        <div className="mx-auto mb-3 h-px w-16 bg-[#c4d2d6]/80" aria-hidden="true" />
        <p className="font-heading text-sm font-extrabold tracking-[0.16em] text-[#eef4f2] drop-shadow-md">
          {tarot.arcana}
        </p>
        <div className="mx-auto mt-3 flex w-20 items-center justify-between" aria-hidden="true">
          <span className="h-1.5 w-1.5 rotate-45 bg-[#9dbdb2]" />
          <span className="h-px w-10 bg-[#e8efed]/60" />
          <span className="h-1.5 w-1.5 rotate-45 bg-[#8fb4ca]" />
        </div>
      </div>
    </div>
  )
}
