interface Props {
  size?: number
  className?: string
}

export default function LogoMark({ size = 32, className = '' }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Rounded square background */}
      <rect width="40" height="40" rx="10" fill="#059669" />

      {/* Subtle geometric accent — top-right arc */}
      <path
        d="M28 4 Q36 4 36 12"
        stroke="rgba(255,255,255,0.20)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 4 Q36 4 36 8"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arabic letter ف (Fa) — represents Fechal */}
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontFamily="'Amiri', 'Noto Naskh Arabic', serif"
        fontWeight="700"
      >
        ف
      </text>
    </svg>
  )
}
