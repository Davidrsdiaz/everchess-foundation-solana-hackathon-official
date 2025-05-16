"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { calculateProgressPercentage, parseProgressString } from "@/utils/mission-utils"
import { MissionCompletionAnimation } from "@/components/mission-completion-animation"
import { MissionSkeleton } from "@/components/mission-skeleton"

interface MissionProps {
  title: string
  progressString: string
  xpReward: number
  icon: React.ReactNode
  isLoading?: boolean
  onComplete?: () => void
  currentStep?: number
  totalSteps?: number
}

export function MissionProgress({
  title,
  progressString,
  xpReward,
  icon,
  isLoading = false,
  onComplete,
  currentStep = 0,
  totalSteps = 3,
}: MissionProps) {
  const [showCompletion, setShowCompletion] = useState(false)
  const [wasCompleted, setWasCompleted] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    if (isLoading) return

    const { current, total } = parseProgressString(progressString)
    const percentage = calculateProgressPercentage(current, total)
    setProgressValue(percentage)

    // Check if mission was just completed
    const isComplete = current >= total
    if (isComplete && !wasCompleted) {
      setShowCompletion(true)
      setWasCompleted(true)
    }
  }, [progressString, isLoading, wasCompleted])

  if (isLoading) {
    return <MissionSkeleton />
  }

  // Generate step indicators
  const renderStepIndicators = () => {
    return Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`w-5 h-5 rounded-sm flex items-center justify-center transition-all duration-300 ${
          index === currentStep
            ? "bg-everchess-cyan text-background-900 shadow-[0_0_8px_rgba(0,182,255,0.6)]"
            : "border border-everchess-cyan/30 bg-background-800"
        }`}
      >
        <div className="w-3 h-3 transform rotate-45" />
      </div>
    ))
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <div>
              <p className="text-base font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">Progress: {progressString}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-medium text-everchess-yellow">+{xpReward} XP</span>
            <div className="flex gap-1">{renderStepIndicators()}</div>
          </div>
        </div>
        <div className="relative">
          <Progress
            value={progressValue}
            className="h-2"
            indicatorClassName="bg-gradient-to-r from-everchess-cyan to-blue-500"
          />
          <div
            className="absolute -top-1 w-2 h-4 bg-everchess-cyan rounded-full shadow-[0_0_8px_rgba(0,182,255,0.6)] transform -translate-x-1 transition-all duration-300 ease-in-out"
            style={{ left: `${progressValue}%` }}
          />
        </div>
      </div>

      <MissionCompletionAnimation
        isVisible={showCompletion}
        xpAmount={xpReward}
        onComplete={() => {
          setShowCompletion(false)
          if (onComplete) onComplete()
        }}
      />
    </>
  )
}
