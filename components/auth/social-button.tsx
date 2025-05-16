import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  bgColor?: string
  size?: "sm" | "md" | "lg"
  iconScale?: number
  iconClassName?: string
}

export function SocialButton({
  children,
  className,
  bgColor = "bg-background-800",
  size = "md",
  iconScale = 1.2, // Default scale factor for icons
  iconClassName = "",
  ...props
}: SocialButtonProps) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  }

  return (
    <button
      type="button"
      className={cn(
        "social-button p-0 rounded-full mx-auto overflow-hidden flex items-center justify-center border border-gray-700/50 hover:border-everchess-yellow hover:shadow-[0_0_12px_rgba(252,223,58,0.5)] transition-all duration-300",
        bgColor,
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "w-full h-full flex items-center justify-center transition-colors",
          bgColor,
          "hover:brightness-110",
        )}
      >
        <div
          className={cn("flex items-center justify-center transform-gpu", iconClassName)}
          style={{
            transform: `scale(${iconScale})`,
            // Ensure consistent positioning
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </button>
  )
}
