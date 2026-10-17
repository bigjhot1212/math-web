type BrandMarkProps = {
  className?: string
}

export default function BrandMark({ className = 'h-5 w-7' }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8.5 16C5.46 16 3 13.31 3 10s2.46-6 5.5-6C14 4 18 16 23.5 16c3.04 0 5.5-2.69 5.5-6s-2.46-6-5.5-6C18 4 14 16 8.5 16Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
