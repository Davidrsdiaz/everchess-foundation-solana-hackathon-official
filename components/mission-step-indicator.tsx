"use client"

interface MissionStepIndicatorProps {
  steps: number
  activeStep: number
  setActiveStep: (step: number) => void
}

export function MissionStepIndicator({ steps = 3, activeStep, setActiveStep }: MissionStepIndicatorProps) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: steps }).map((_, i) => (
        <button
          key={i}
          className={`h-3 w-3 transform rotate-45 border ${
            i === activeStep
              ? "border-everchess-cyan bg-everchess-cyan shadow-[0_0_6px_rgba(0,182,255,0.6)]"
              : "border-everchess-cyan"
          } transition-all duration-200 hover:border-everchess-cyan hover:shadow-[0_0_6px_rgba(0,182,255,0.4)]`}
          aria-label={`Mission step ${i + 1}`}
          onClick={() => setActiveStep(i)}
        />
      ))}
    </div>
  )
}
