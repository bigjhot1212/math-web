type BrandMarkProps = {
  className?: string
}

export default function BrandMark({ className = 'h-5 w-7' }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 34 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8.5 16C5.46 16 3 13.31 3 10s2.46-6 5.5-6C14 4 18 16 23.5 16c3.04 0 5.5-2.69 5.5-6 0-1.1-.27-2.14-.75-3.02C27.28 4.94 25.53 4 23.5 4 18 4 14 16 8.5 16Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25.15 2.7c2.55-.7 5.4.45 6.45 2.7.4.85.02 1.85-.85 2.22l-3.42 1.43a1.72 1.72 0 0 1-2.08-.5l-2.03-2.39c-.99-1.17-.22-3.13 1.93-3.46Z"
        fill="currentColor"
      />
      <circle cx="29" cy="5.1" r="0.78" fill="var(--background)" />
      <path
        d="m31.05 6.66 2.32-.6m-2.32.6 2.12 1.02"
        stroke="currentColor"
        strokeWidth="0.78"
        strokeLinecap="round"
      />
    </svg>
  )
}
