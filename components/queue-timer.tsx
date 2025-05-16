"use client"

import { useState, useEffect, useRef } from "react"
import { X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createPortal } from "react-dom"
import { useQueue } from "@/contexts/queue-context"
import { useIsMobile } from "@/hooks/use-mobile"

interface QueueTimerProps {
  standalone?: boolean
}

export function QueueTimer({ standalone = false }: QueueTimerProps) {
  const { queueStatus, queueTime, showFullQueueUI, matchFound, setShowFullQueueUI, cancelQueue } = useQueue()
  const [headerTimerMounted, setHeaderTimerMounted] = useState(false)
  const fullQueueRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<HTMLDivElement>(null)
  const [headerTimerContainer, setHeaderTimerContainer] = useState<HTMLElement | null>(null)
  const isMobile = useIsMobile()

  // Format queue time
  const formatQueueTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  // Find the header timer container element
  useEffect(() => {
    if (queueStatus?.active) {
      const timerContainer = document.getElementById("header-queue-timer-container")
      if (timerContainer) {
        setHeaderTimerContainer(timerContainer)
      }
    }
  }, [queueStatus])

  // Handle transition from full UI to header timer
  useEffect(() => {
    if (queueStatus?.active && !showFullQueueUI) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setHeaderTimerMounted(true)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [queueStatus, showFullQueueUI])

  // Reset header timer when queue is canceled
  useEffect(() => {
    if (!queueStatus?.active) {
      setHeaderTimerMounted(false)
    }
  }, [queueStatus])

  if (!queueStatus?.active && !standalone) return null

  // Render the header timer
  const renderHeaderTimer = () => (
    <div
      ref={timerRef}
      className="queue-timer-header flex items-center justify-center cursor-pointer group"
      onClick={() => setShowFullQueueUI(true)}
      aria-label="Queue Timer"
      style={{
        background: "linear-gradient(to bottom, rgba(0, 182, 255, 0.3), rgba(0, 182, 255, 0.2))",
        borderRadius: "50%",
        padding: "2px",
        boxShadow: "0 0 12px rgba(0, 182, 255, 0.5)",
        width: "44px",
        height: "44px",
        animation: "fadeIn 0.3s ease-out forwards",
        transition: "all 0.2s ease",
        marginRight: isMobile ? "3px" : "4px",
      }}
    >
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="absolute inset-0 bg-background-800/90 rounded-full"></div>
        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r="19" fill="none" stroke="#1e293b" strokeWidth="3" />
          <circle
            cx="22"
            cy="22"
            r="19"
            fill="none"
            stroke="#00b6ff"
            strokeWidth="3"
            strokeDasharray="119.4"
            strokeDashoffset={119.4 - (119.4 * Math.min(queueTime, 120)) / 120}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="relative z-20 text-white font-heading font-medium" style={{ fontSize: "0.8rem" }}>
            {formatQueueTime(queueTime)}
          </span>
        </div>
        <div className="absolute inset-0 bg-everchess-cyan/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"></div>
      </div>
    </div>
  )

  return (
    <>
      {/* Full Queue Status UI */}
      {showFullQueueUI && (
        <div
          ref={fullQueueRef}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center"
        >
          <div className="bg-background-800 border border-everchess-cyan/30 rounded-lg p-6 max-w-md w-full mx-4 relative animate-in fade-in zoom-in duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-muted-foreground hover:text-white"
              onClick={() => setShowFullQueueUI(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="text-center space-y-6">
              {matchFound ? (
                // Match found UI
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Match Found!</h2>
                    <p className="text-muted-foreground">
                      {queueStatus?.mode} • {queueStatus?.timeOption}
                    </p>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                      <Users className="h-10 w-10 text-green-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-white">Preparing your game...</p>
                    <div className="flex justify-center">
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                          style={{ animationDelay: "600ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Regular queue UI
                <>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Finding Match</h2>
                    <p className="text-muted-foreground">
                      {queueStatus?.mode} • {queueStatus?.timeOption}
                    </p>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xl font-mono font-bold text-white font-heading">
                        {formatQueueTime(queueTime)}
                      </div>
                    </div>
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="60" fill="none" stroke="#1e293b" strokeWidth="8" />
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        fill="none"
                        stroke="#00b6ff"
                        strokeWidth="8"
                        strokeDasharray="377"
                        strokeDashoffset={377 - (377 * Math.min(queueTime, 120)) / 120}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Searching for players with similar rating...</p>
                    <div className="flex justify-center">
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 rounded-full bg-everchess-cyan animate-pulse"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-everchess-cyan animate-pulse"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-everchess-cyan animate-pulse"
                          style={{ animationDelay: "600ms" }}
                        ></div>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                      onClick={cancelQueue}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header Queue Timer (minimized) - Using Portal to inject into header */}
      {!showFullQueueUI &&
        headerTimerMounted &&
        headerTimerContainer &&
        createPortal(renderHeaderTimer(), headerTimerContainer)}
    </>
  )
}
