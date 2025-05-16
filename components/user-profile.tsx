"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useStatus, type UserStatus } from "@/contexts/status-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function UserProfile() {
  // Default user data
  const userData = {
    name: "Einstein",
    level: 24,
    xp: 420,
    maxXp: 500,
  }

  const { status, setStatus, statusColor } = useStatus()
  const progress = (userData.xp / userData.maxXp) * 100

  // Status options for the dropdown - simplified to just online and away
  const statusOptions: { value: UserStatus; label: string; color: string }[] = [
    { value: "online", label: "Online", color: "bg-green-500" },
    { value: "away", label: "Away", color: "bg-orange-500" }, // Changed from red to orange
  ]

  return (
    <div className="py-4 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border border-everchess-yellow/30 bg-everchess-yellow">
              <AvatarImage src="/male-avatar.svg" alt="User" />
              <AvatarFallback className="bg-everchess-yellow text-background-900">EI</AvatarFallback>
            </Avatar>

            {/* Status indicator */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full ${statusColor} ring-2 ring-background-800 cursor-pointer hover:ring-background-700 transition-colors`}
                  aria-label={`Status: ${status}`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-background-800 border-gray-700">
                {statusOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    className="flex items-center gap-2 text-white hover:bg-background-700 cursor-pointer"
                    onClick={() => setStatus(option.value)}
                  >
                    <div className={`h-2.5 w-2.5 rounded-full ${option.color}`} />
                    <span>{option.label}</span>
                    {status === option.value && <span className="ml-auto text-xs text-everchess-yellow">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{userData.name}</span>
            <span className="text-xs text-muted-foreground">Level {userData.level}</span>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-4 mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">XP Progress</span>
          <span className="text-muted-foreground">
            {userData.xp}/{userData.maxXp}
          </span>
        </div>
        <Progress value={progress} className="h-2" indicatorClassName="bg-sky-500" />
      </div>

      <div className="border-b border-gray-700/50"></div>
    </div>
  )
}
