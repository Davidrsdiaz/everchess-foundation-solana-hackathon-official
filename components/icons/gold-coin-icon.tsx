import type { SVGProps } from "react"

interface GoldCoinIconProps extends SVGProps<SVGSVGElement> {
  size?: number
}

export function GoldCoinIcon({ size = 24, ...props }: GoldCoinIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" fill="#F7D14C" stroke="#E2B203" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="7" fill="#FFDE6A" />
      <path
        d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18"
        stroke="#E2B203"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6"
        stroke="#F7D14C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
