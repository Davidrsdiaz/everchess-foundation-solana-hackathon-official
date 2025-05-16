"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"

type QueueStatus = {
  active: boolean
  mode: string
  timeOption: string
} | null

interface QueueContextType {
  queueStatus: QueueStatus
  queueTime: number
  showFullQueueUI: boolean
  matchFound: boolean
  setQueueStatus: (status: QueueStatus) => void
  setQueueTime: (time: number) => void
  setShowFullQueueUI: (show: boolean) => void
  setMatchFound: (found: boolean) => void
  startQueue: (mode: string, timeOption: string) => void
  cancelQueue: () => void
}

const QueueContext = createContext<QueueContextType | undefined>(undefined)

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [queueStatus, setQueueStatus] = useState<QueueStatus>(null)
  const [queueTime, setQueueTime] = useState(0)
  const [showFullQueueUI, setShowFullQueueUI] = useState(false)
  const [matchFound, setMatchFound] = useState(false)

  // Start queue with mode and time option
  const startQueue = (mode: string, timeOption: string) => {
    setQueueStatus({
      active: true,
      mode,
      timeOption,
    })
    setQueueTime(0)
    setShowFullQueueUI(true)
    setMatchFound(false)
  }

  // Cancel queue
  const cancelQueue = () => {
    setQueueStatus(null)
    setQueueTime(0)
    setShowFullQueueUI(false)
    setMatchFound(false)
  }

  // Increment queue time when active and handle match finding
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (queueStatus?.active) {
      // Start the timer
      interval = setInterval(() => {
        setQueueTime((prev) => {
          const newTime = prev + 1

          // Check if we've reached 10 seconds for match finding
          if (newTime === 10 && !matchFound) {
            setMatchFound(true)
            // We'll navigate to the game page after a short delay
            setTimeout(() => {
              router.push("/game")
            }, 1500) // Short delay to show the match found UI
          }

          return newTime
        })
      }, 1000)

      // If we're showing the full UI, set a timeout to minimize it
      if (showFullQueueUI) {
        const minimizeTimer = setTimeout(() => {
          setShowFullQueueUI(false)
        }, 3000)

        return () => {
          clearInterval(interval)
          clearTimeout(minimizeTimer)
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [queueStatus, showFullQueueUI, matchFound, router])

  // Persist queue state in localStorage
  useEffect(() => {
    // Load queue state from localStorage on initial render
    const savedQueueState = localStorage.getItem("queueState")
    if (savedQueueState) {
      try {
        const { status, time, showFull, found } = JSON.parse(savedQueueState)
        // Only restore if the queue was active and the page was refreshed recently (within 30 seconds)
        if (status && status.active && time && Date.now() - time.timestamp < 30000) {
          setQueueStatus(status)
          setQueueTime(time.value + Math.floor((Date.now() - time.timestamp) / 1000))
          setShowFullQueueUI(showFull)
          setMatchFound(found || false)
        } else {
          // Clear outdated queue state
          localStorage.removeItem("queueState")
        }
      } catch (error) {
        console.error("Error parsing queue state from localStorage:", error)
        localStorage.removeItem("queueState")
      }
    }
  }, [])

  // Save queue state to localStorage whenever it changes
  useEffect(() => {
    if (queueStatus?.active) {
      localStorage.setItem(
        "queueState",
        JSON.stringify({
          status: queueStatus,
          time: { value: queueTime, timestamp: Date.now() },
          showFull: showFullQueueUI,
          found: matchFound,
        }),
      )
    } else {
      localStorage.removeItem("queueState")
    }
  }, [queueStatus, queueTime, showFullQueueUI, matchFound])

  return (
    <QueueContext.Provider
      value={{
        queueStatus,
        queueTime,
        showFullQueueUI,
        matchFound,
        setQueueStatus,
        setQueueTime,
        setShowFullQueueUI,
        setMatchFound,
        startQueue,
        cancelQueue,
      }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export function useQueue() {
  const context = useContext(QueueContext)
  if (context === undefined) {
    throw new Error("useQueue must be used within a QueueProvider")
  }
  return context
}
