"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define the possible status types - simplified to just online and away
export type UserStatus = "online" | "away"

// Define the context type
interface StatusContextType {
  status: UserStatus
  setStatus: (status: UserStatus) => void
  statusColor: string
  statusLabel: string
}

// Create the context with default values
const StatusContext = createContext<StatusContextType | undefined>(undefined)

// Status provider component
export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<UserStatus>("online")

  // Get the color based on status
  const getStatusColor = (currentStatus: UserStatus): string => {
    switch (currentStatus) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-orange-500" // Changed from red to orange
      default:
        return "bg-green-500"
    }
  }

  // Get the label based on status
  const getStatusLabel = (currentStatus: UserStatus): string => {
    switch (currentStatus) {
      case "online":
        return "Online"
      case "away":
        return "Away"
      default:
        return "Online"
    }
  }

  // Persist status in localStorage
  useEffect(() => {
    // Load status from localStorage on initial render
    const savedStatus = localStorage.getItem("userStatus") as UserStatus | null
    if (savedStatus && ["online", "away"].includes(savedStatus)) {
      setStatus(savedStatus)
    }
  }, [])

  // Save status to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userStatus", status)
  }, [status])

  return (
    <StatusContext.Provider
      value={{
        status,
        setStatus,
        statusColor: getStatusColor(status),
        statusLabel: getStatusLabel(status),
      }}
    >
      {children}
    </StatusContext.Provider>
  )
}

// Custom hook to use the status context
export function useStatus() {
  const context = useContext(StatusContext)
  if (context === undefined) {
    throw new Error("useStatus must be used within a StatusProvider")
  }
  return context
}
