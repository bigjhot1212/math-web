type BrandMarkProps = { className?: string; reversed?: boolean }

export default function BrandMark({ className = 'h-8 w-8', reversed = false }: BrandMarkProps) {
  const paper = reversed ? '#F1CF79' : '#174B38'
  const edge = reversed ? '#FFF3D4' : '#D8AA4D'
  const ink = reversed ? '#174B38' : '#FFFFFF'
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M50 36C37 26 24 24 11 29v42c14-5 26-2 39 7 13-9 25-12 39-7V29c-13-5-26-3-39 7Z" fill={paper} stroke={edge} strokeWidth="3" strokeLinejoin="round" />
      <path d="M50 38v36M17 76c13-3 23 0 33 7 10-7 20-10 33-7" stroke={edge} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 51c-8-13-23-13-23-2 0 14 15 12 23-1 8-13 23-13 23-2 0 14-15 18-23 5Z" stroke={ink} strokeWidth="4.8" strokeLinecap="round" />
      <path d="m50 6 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill={edge} />
    </svg>
  )
}
