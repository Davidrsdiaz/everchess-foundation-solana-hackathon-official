import type { SVGProps } from "react"

interface ChessPawn3DIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  color?: string
}

export function ChessPawn3DIcon({ size = 24, color = "#9333EA", ...props }: ChessPawn3DIconProps) {
  // Purple color by default for Dragon Kingdom
  const primaryColor = color
  const secondaryColor = color === "#9333EA" ? "#7E22CE" : "#6B21A8"
  const highlightColor = color === "#9333EA" ? "#A855F7" : "#C084FC"

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Base */}
      <ellipse cx="12" cy="19" rx="6" ry="2" fill={secondaryColor} />

      {/* Middle section */}
      <path d="M9 19V14C9 12.3431 10.3431 11 12 11V11C13.6569 11 15 12.3431 15 14V19" fill={primaryColor} />

      {/* Top sphere */}
      <circle cx="12" cy="9" r="3" fill={primaryColor} />

      {/* Highlights */}
      <path d="M12 6C13.1046 6 14 6.89543 14 8C14 9.10457 13.1046 10 12 10" stroke={highlightColor} strokeWidth="0.5" />
      <path d="M9 14.5C9 13.1193 10.1193 12 11.5 12H12.5" stroke={highlightColor} strokeWidth="0.5" />

      {/* Base highlight */}
      <path d="M8 18.5C9.5 19.5 14.5 19.5 16 18.5" stroke={highlightColor} strokeWidth="0.5" />
    </svg>
  )
}
