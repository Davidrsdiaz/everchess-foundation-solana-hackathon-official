"use client"

import type React from "react"

import { useState } from "react"
import { Progress } from "@/components/ui/progress"
import { MissionStepIndicator } from "./mission-step-indicator"

interface Mission {
  title: string
  progress: string
  completed: boolean
  xp: number
}

interface MissionItemProps {
  missions: Mission[]
  icon: React.ReactNode
  initialStep?: number
}

export function MissionItem({ missions, icon, initialStep = 0 }: MissionItemProps) {
  const [activeStep, setActiveStep] = useState(initialStep)

  // Current mission based on active step
  const currentMission = missions[activeStep]

  // Parse progress string to get values for progress bar
  const [current, total] = currentMission.progress.split("/").map(Number)
  const progressValue = (current / total) * 100

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className="text-base font-medium">{currentMission.title}</p>
            <p className="text-sm text-muted-foreground">Progress: {currentMission.progress}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm font-medium text-everchess-yellow">+{currentMission.xp} XP</span>
          <MissionStepIndicator steps={missions.length} activeStep={activeStep} setActiveStep={setActiveStep} />
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
  )
}
