"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Zap, Settings, Gamepad2, CastleIcon } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { MissionItem } from "@/components/mission-item"
import { XpClaimAnimation } from "@/components/xp-claim-animation"
import { BattlepassRewardAnimation } from "@/components/battlepass-reward-animation"
import { useQueue } from "@/contexts/queue-context"
// Add the import for LevelUpAnimation at the top with the other imports
import { LevelUpAnimation } from "@/components/level-up-animation"

export default function DashboardPage() {
  // Track active game mode for enhanced interaction
  const [activeGameMode, setActiveGameMode] = useState<string | null>(null)
  const [expandedTimeOptions, setExpandedTimeOptions] = useState<string[]>([])
  const { startQueue } = useQueue()

  // Update the daily mission XP values
  const winGamesMissions = [
    { title: "Win 1 Game", progress: "1/1", completed: true, xp: 25 },
    { title: "Win 2 Games", progress: "2/2", completed: true, xp: 50 },
    { title: "Win 3 Games", progress: "2/3", completed: false, xp: 75 },
  ]

  const playGamesMissions = [
    { title: "Play 1 Game", progress: "1/1", completed: true, xp: 25 },
    { title: "Play 3 Games", progress: "3/3", completed: true, xp: 50 },
    { title: "Play 5 Games", progress: "3/5", completed: false, xp: 75 },
  ]

  const tournamentMissions = [
    { title: "Play 1 Tournament", progress: "0/1", completed: false, xp: 50 },
    { title: "Play 2 Tournaments", progress: "0/2", completed: false, xp: 100 },
    { title: "Place Top 3 in Tourney", progress: "0/1", completed: false, xp: 150 },
  ]

  // Update the weekly mission XP values
  const weeklyWinGamesMissions = [
    { title: "Win 5 Games", progress: "4/5", completed: false, xp: 100 },
    { title: "Win 10 Games", progress: "4/10", completed: false, xp: 150 },
    { title: "Win 15 Games", progress: "4/15", completed: false, xp: 200 },
  ]

  const weeklyPlayGamesMissions = [
    { title: "Play 10 Games", progress: "7/10", completed: false, xp: 100 },
    { title: "Play 15 Games", progress: "7/15", completed: false, xp: 150 },
    { title: "Play 20 Games", progress: "7/20", completed: false, xp: 200 },
  ]

  const weeklyTournamentMissions = [
    { title: "Play 3 Tournaments", progress: "1/3", completed: false, xp: 150 },
    { title: "Play 5 Tournaments", progress: "1/5", completed: false, xp: 200 },
    { title: "Place Top 3 in Tourneys (3)", progress: "0/3", completed: false, xp: 250 },
  ]

  const timeOptions = [
    { label: "3 | 2+", minutes: 3, increment: 2 },
    { label: "5 | 5+", minutes: 5, increment: 5 },
    { label: "15 | 10+", minutes: 15, increment: 10 }, // Updated from 5 to 10 second increment
  ]

  // Extended time options when "More Time Options" is clicked
  const extendedTimeOptions = [
    { label: "2 | 1+", minutes: 2, increment: 1 },
    { label: "5 | 2+", minutes: 5, increment: 2 },
    { label: "10 | 5+", minutes: 10, increment: 5 },
    { label: "2 | 0", minutes: 2, increment: 0 },
    { label: "5 | 0", minutes: 5, increment: 0 },
    { label: "10 | 0", minutes: 10, increment: 0 },
  ]

  // Game mode data with titles and icons
  const gameModes = [
    {
      id: "ranked",
      title: "Ranked",
      icon: Gamepad2,
      hasMoreOptions: true,
      iconColor: "text-everchess-yellow",
    },
    {
      id: "tournaments",
      title: "Tournaments",
      icon: Trophy,
      hasMoreOptions: true,
      iconColor: "text-everchess-yellow",
    },
    {
      id: "wagers",
      title: "Wagers",
      icon: () => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-everchess-yellow"
        >
          <path
            d="M16 2H8L2 8L12 22L22 8L16 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M2 8H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 2L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 2L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      hasMoreOptions: false,
      comingSoon: true,
      iconColor: "text-everchess-yellow",
    },
    {
      id: "custom",
      title: "Custom",
      icon: Settings,
      hasMoreOptions: false,
      comingSoon: true,
      iconColor: "text-everchess-yellow",
    },
  ]

  // Toggle expanded time options
  const toggleExpandedTimeOptions = (modeId: string) => {
    if (expandedTimeOptions.includes(modeId)) {
      setExpandedTimeOptions(expandedTimeOptions.filter((id) => id !== modeId))
    } else {
      setExpandedTimeOptions([...expandedTimeOptions, modeId])
    }
  }

  // Update the game mode click handler to prevent clicking on "Wagers" and "Custom" modes
  const handleGameModeClick = (modeId: string) => {
    // Only allow clicking on non-coming-soon modes
    const mode = gameModes.find((m) => m.id === modeId)
    if (mode && !mode.comingSoon) {
      setActiveGameMode(activeGameMode === modeId ? null : modeId)
    }
  }

  // Handle time option selection
  const handleTimeOptionClick = (modeId: string, option: (typeof timeOptions)[0]) => {
    const mode = gameModes.find((m) => m.id === modeId)
    if (mode && !mode.comingSoon) {
      // Start queue using the context
      startQueue(mode.title, option.label)

      // Reset active game mode after selection
      setActiveGameMode(null)
    }
  }

  // Add a loading state simulation for demonstration purposes
  const [isLoading, setIsLoading] = useState(true)

  const [showXpClaimAnimation, setShowXpClaimAnimation] = useState(false)
  const [showBattlepassRewardAnimation, setShowBattlepassRewardAnimation] = useState(false)
  const [totalXpToClaim, setTotalXpToClaim] = useState(0)
  const [battlepassRewardType, setBattlepassRewardType] = useState<"chess-set" | "app-coin" | "emote">("chess-set")

  // Add state for level up animation after the other animation states
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(5)
  const [newLevel, setNewLevel] = useState(6)

  useEffect(() => {
    // Simulate loading data from an API
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Modify the handleClaimXp function to show the level up animation after XP claim
  const handleClaimXp = () => {
    // Calculate total XP to claim from all active missions
    let totalXp = 0

    // Add XP from daily missions that are completed
    winGamesMissions.forEach((mission) => {
      if (mission.completed) totalXp += mission.xp
    })

    playGamesMissions.forEach((mission) => {
      if (mission.completed) totalXp += mission.xp
    })

    tournamentMissions.forEach((mission) => {
      if (mission.completed) totalXp += mission.xp
    })

    // Set the total XP and show the animation
    setTotalXpToClaim(totalXp > 0 ? totalXp : 250) // Default to 250 XP for demo purposes
    setShowXpClaimAnimation(true)

    // Simulate level up check - in a real app, this would check if the XP causes a level up
    const shouldLevelUp = Math.random() > 0.3 // 70% chance to level up for demo purposes
    if (shouldLevelUp) {
      // Prepare level up animation to show after XP claim
      setCurrentLevel(5)
      setNewLevel(6)
    }
  }

  const handleClaimBattlepassReward = () => {
    // Randomly select a reward type for demonstration
    const rewardTypes: Array<"chess-set" | "app-coin" | "emote"> = ["chess-set", "app-coin", "emote"]
    const randomRewardType = rewardTypes[Math.floor(Math.random() * rewardTypes.length)]

    setBattlepassRewardType(randomRewardType)
    setShowBattlepassRewardAnimation(true)
  }

  // Add a useEffect to log when the showLevelUpAnimation state changes
  // Add this after the other useEffect blocks:

  useEffect(() => {
    if (showLevelUpAnimation) {
      console.log("Level up animation triggered")
    }
  }, [showLevelUpAnimation])

  return (
    <div className="space-y-6">
      <div className="space-y-2 flex flex-col items-center text-center">
        <div>
          <h2 className="text-xl font-bold text-white">Welcome back, Einstein</h2>
          <p className="text-muted-foreground">Choose a mode, time, and chess set.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
          {gameModes.map((mode) => {
            const Icon = mode.icon
            const isActive = activeGameMode === mode.id
            const isExpanded = expandedTimeOptions.includes(mode.id)

            return (
              <Card
                key={mode.id}
                className={`bg-background-700 text-white transition-all duration-300 cursor-pointer overflow-hidden relative h-auto
${
  isActive
    ? "ring-2 ring-everchess-cyan shadow-[0_0_15px_rgba(0,182,255,0.3)] border-everchess-cyan"
    : "hover:bg-background-600/90 hover:border-everchess-cyan hover:shadow-[0_0_10px_rgba(0,182,255,0.15)] border-everchess-cyan/60"
}
${mode.comingSoon ? "opacity-80" : ""}`}
                onClick={() => handleGameModeClick(mode.id)}
              >
                {/* Card header with icon */}
                <CardHeader
                  className={`flex flex-row items-center justify-between pb-2 transition-all duration-300 relative z-10
${isActive ? "border-b border-everchess-cyan/20" : ""}`}
                >
                  <CardTitle className="text-lg font-bold text-white drop-shadow-sm">{mode.title}</CardTitle>
                  <div
                    className={`${mode.iconColor} transition-transform duration-300 drop-shadow-md ${isActive ? "scale-110" : "hover:scale-110"}`}
                  >
                    {typeof Icon === "function" ? <Icon /> : <Icon />}
                  </div>
                </CardHeader>
                <CardContent className="relative pt-2 z-10">
                  {/* Initial time options - always visible */}
                  {!isActive && !isExpanded && (
                    <div
                      className={`flex items-center justify-center h-14 mt-6 text-sm font-medium text-white transition-all duration-300 rounded-md
${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                    >
                      Start Game
                    </div>
                  )}

                  {/* Active state content */}
                  {isActive && (
                    <div className="pt-2">
                      <div className="grid grid-cols-3 gap-2">
                        {timeOptions.map((option) => (
                          <Button
                            key={option.label}
                            className={`h-14 flex items-center justify-center transition-all duration-300 text-white
${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!mode.comingSoon) {
                                handleTimeOptionClick(mode.id, option)
                              }
                            }}
                            disabled={mode.comingSoon}
                          >
                            <span className="text-sm font-bold text-white">{option.label}</span>
                          </Button>
                        ))}
                      </div>

                      {/* Show extended time options if expanded */}
                      {isExpanded && (
                        <>
                          {/* Extended time options - 2 rows of 3 */}
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            {extendedTimeOptions.slice(0, 3).map((option) => (
                              <Button
                                key={option.label}
                                className={`h-14 flex items-center justify-center transition-all duration-300 text-white
${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!mode.comingSoon) {
                                    handleTimeOptionClick(mode.id, option)
                                  }
                                }}
                                disabled={mode.comingSoon}
                              >
                                <span className="text-sm font-bold text-white">{option.label}</span>
                              </Button>
                            ))}
                          </div>

                          {/* Second row of extended time options */}
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {extendedTimeOptions.slice(3, 6).map((option) => (
                              <Button
                                key={option.label}
                                className={`h-14 flex items-center justify-center transition-all duration-300 text-white
                ${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!mode.comingSoon) {
                                    handleTimeOptionClick(mode.id, option)
                                  }
                                }}
                                disabled={mode.comingSoon}
                              >
                                <span className="text-sm font-bold text-white">{option.label}</span>
                              </Button>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Add the appropriate button based on the game mode */}
                      <Button
                        className={`h-14 w-full mt-3 flex items-center justify-center transition-all duration-200 text-white
${
  mode.comingSoon
    ? "bg-background-900 opacity-80 cursor-not-allowed"
    : "bg-background-900 hover:bg-red-600 hover:scale-105 active:scale-95 hover:shadow-[0_0_10px_rgba(220,38,38,0.4)]"
}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle the button click based on the mode
                          if (mode.hasMoreOptions && !mode.comingSoon) {
                            toggleExpandedTimeOptions(mode.id)
                          }
                        }}
                        disabled={mode.comingSoon}
                      >
                        <span className="text-sm font-bold flex items-center gap-2 text-white">
                          {mode.hasMoreOptions ? (
                            isExpanded ? (
                              "Show Fewer Options"
                            ) : (
                              "More Time Options"
                            )
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-300"
                              >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                              </svg>
                              Coming Soon
                            </>
                          )}
                        </span>
                      </Button>
                    </div>
                  )}

                  {/* Expanded time options state (when not active) */}
                  {!isActive && isExpanded && (
                    <div className="pt-2">
                      <div className="grid grid-cols-3 gap-2">
                        {timeOptions.map((option) => (
                          <Button
                            key={option.label}
                            className={`h-14 flex items-center justify-center transition-all duration-300 text-white
${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!mode.comingSoon) {
                                handleTimeOptionClick(mode.id, option)
                              }
                            }}
                            disabled={mode.comingSoon}
                          >
                            <span className="text-sm font-bold text-white">{option.label}</span>
                          </Button>
                        ))}
                      </div>

                      {/* Extended time options - 2 rows of 3 */}
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {extendedTimeOptions.slice(0, 3).map((option) => (
                          <Button
                            key={option.label}
                            className={`h-14 flex items-center justify-center transition-all duration-300 text-white
                  ${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!mode.comingSoon) {
                                handleTimeOptionClick(mode.id, option)
                              }
                            }}
                            disabled={mode.comingSoon}
                          >
                            <span className="text-sm font-bold text-white">{option.label}</span>
                          </Button>
                        ))}
                      </div>

                      {/* Second row of extended time options */}
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {extendedTimeOptions.slice(3, 6).map((option) => (
                          <Button
                            key={option.label}
                            className={`h-14 flex items-center justify-center transition-all duration-300 text-white
                  ${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (!mode.comingSoon) {
                                handleTimeOptionClick(mode.id, option)
                              }
                            }}
                            disabled={mode.comingSoon}
                          >
                            <span className="text-sm font-bold text-white">{option.label}</span>
                          </Button>
                        ))}
                      </div>

                      {/* Show fewer options button */}
                      <Button
                        className="h-14 w-full mt-3 bg-background-900 hover:bg-red-600 hover:scale-105 active:scale-95 text-white transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpandedTimeOptions(mode.id)
                        }}
                      >
                        <span className="text-sm font-bold text-white">Show Fewer Options</span>
                      </Button>
                    </div>
                  )}

                  {/* Coming Soon badge for locked modes */}
                  {mode.comingSoon && (
                    <div className="mt-3 flex justify-center">
                      <Badge className="bg-yellow-600/80 text-white px-3 py-1 text-sm">Coming Soon</Badge>
                    </div>
                  )}

                  {/* Add hover effect overlay */}
                  <div
                    className={`absolute inset-0 bg-everchess-cyan/5 opacity-0 transition-opacity duration-300 pointer-events-none ${
                      isActive ? "" : "hover:opacity-100"
                    }`}
                  ></div>

                  {mode.comingSoon && (
                    <div className="absolute inset-0 bg-background-900/10 pointer-events-none z-10"></div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="w-full lg:col-span-4 bg-background-700 text-white flex flex-col border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-everchess-yellow" />
              Season 1 Battlepass
            </CardTitle>
            <p className="text-muted-foreground text-sm">Your battlepass progress and rewards</p>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tier 24</span>
                <span className="text-muted-foreground">24/100</span>
              </div>
              <div className="relative">
                <Progress value={24} className="h-2" indicatorClassName="bg-everchess-cyan" />
              </div>
              <div className="text-right text-xs text-muted-foreground">210/250 XP</div>
            </div>

            <div className="relative h-[200px] overflow-hidden rounded-lg bg-background-350 border border-gray-700/50">
              <div className="flex h-full items-center justify-center">
                <div className="gift-box-3d w-40 h-40 relative">
                  <div className="gift-box absolute inset-0 flex items-center justify-center animate-spin-slow">
                    <svg
                      width="140"
                      height="140"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-red-500/10"
                      style={{ filter: "drop-shadow(0 0 12px rgba(220,38,38,0.8))" }}
                    >
                      <path
                        d="M20 12V22H4V12"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 7H2V12H22V7Z"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 22V7"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 7H7.5C6.83696 7 6.20107 6.73661 5.73223 6.26777C5.26339 5.79893 5 5.16304 5 4.5C5 3.83696 5.26339 3.20107 5.73223 2.73223C6.20107 2.26339 6.83696 2 7.5 2C11 2 12 7 12 7Z"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="rgba(220,38,38,0.05)"
                      />
                      <path
                        d="M12 7H16.5C17.163 7 17.7989 6.73661 18.2678 6.26777C18.7366 5.79893 19 5.16304 19 4.5C19 3.83696 18.7366 3.20107 18.2678 2.73223C17.7989 2.26339 17.163 2 16.5 2C13 2 12 7 12 7Z"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="rgba(220,38,38,0.05)"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-lg bg-red-500/5 border border-red-500/20 animate-pulse"></div>
                  </div>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                    style={{ backgroundSize: "200% 100%" }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-radial from-red-500/10 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex flex-col items-center justify-center rounded-md bg-background-350 p-4 border border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-everchess-yellow"
                >
                  <path
                    d="M16 2H8L2 8L12 22L22 8L16 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 8H22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 2L12 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 2L12 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="mt-2 text-xs text-muted-foreground text-center">App Coin</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md bg-background-350 p-4 border border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
                <div className="relative h-14 w-14 flex items-center justify-center">
                  <Image src="/chess-pawn-red.png" alt="Chess Set" width={56} height={56} className="object-contain" />
                </div>
                <span className="mt-2 text-xs text-muted-foreground text-center">Chess Set</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-md bg-background-350 p-4 border border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-everchess-yellow"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
                <span className="mt-2 text-xs text-muted-foreground text-center">Emote</span>
              </div>
            </div>
          </CardContent>
          <div className="px-6 pb-6 mt-auto">
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
              onClick={handleClaimBattlepassReward}
            >
              Claim Reward
            </Button>
          </div>
        </Card>

        <Card className="w-full lg:col-span-3 bg-background-700 text-white flex flex-col border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-everchess-yellow" />
              Missions
            </CardTitle>
            <p className="text-muted-foreground text-sm">Complete missions to earn XP and rewards</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Tabs defaultValue="daily" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-background-900">
                <TabsTrigger value="daily" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Weekly
                </TabsTrigger>
              </TabsList>
              {/* Wrapper div with relative positioning */}
              <div className="flex-1 flex flex-col relative">
                {/* Wrapper div with relative positioning */}
                <div className="relative flex-1 flex flex-col">
                  <TabsContent value="daily" className="flex-1 flex flex-col data-[state=inactive]:hidden">
                    {/* Mission content container with fixed height and specific spacing */}
                    <div className="flex-1 flex flex-col justify-between pt-8 pb-8">
                      {!isLoading ? (
                        <>
                          {/* First mission */}
                          <div className="mb-8">
                            <MissionItem
                              missions={winGamesMissions}
                              icon={<Gamepad2 className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={0}
                            />
                          </div>

                          {/* Second mission */}
                          <div className="mb-8">
                            <MissionItem
                              missions={playGamesMissions}
                              icon={<Gamepad2 className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={1}
                            />
                          </div>

                          {/* Third mission */}
                          <div>
                            <MissionItem
                              missions={tournamentMissions}
                              icon={<Trophy className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={0}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="animate-pulse space-y-5 mb-8">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-everchess-yellow/20"></div>
                                <div>
                                  <div className="h-4 w-32 bg-background-600 rounded mb-2"></div>
                                  <div className="h-3 w-20 bg-background-600 rounded"></div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-16 bg-background-600 rounded"></div>
                                <div className="flex gap-1.5">
                                  {[0, 1, 2].map((i) => (
                                    <div
                                      key={i}
                                      className="h-3 w-3 bg-background-600 rounded-sm transform rotate-45"
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-background-600 rounded-full"></div>
                          </div>

                          <div className="animate-pulse space-y-5 mb-8">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-everchess-yellow/20"></div>
                                <div>
                                  <div className="h-4 w-32 bg-background-600 rounded mb-2"></div>
                                  <div className="h-3 w-20 bg-background-600 rounded"></div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-16 bg-background-600 rounded"></div>
                                <div className="flex gap-1.5">
                                  {[0, 1, 2].map((i) => (
                                    <div
                                      key={i}
                                      className="h-3 w-3 bg-background-600 rounded-sm transform rotate-45"
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-background-600 rounded-full"></div>
                          </div>

                          <div className="animate-pulse space-y-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-everchess-yellow/20"></div>
                                <div>
                                  <div className="h-4 w-32 bg-background-600 rounded mb-2"></div>
                                  <div className="h-3 w-20 bg-background-600 rounded"></div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-16 bg-background-600 rounded"></div>
                                <div className="flex gap-1.5">
                                  {[0, 1, 2].map((i) => (
                                    <div
                                      key={i}
                                      className="h-3 w-3 bg-background-600 rounded-sm transform rotate-45"
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-background-600 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="weekly" className="flex-1 flex flex-col data-[state=inactive]:hidden">
                    {/* Mission content container with fixed height and specific spacing */}
                    <div className="flex-1 flex flex-col justify-between pt-8 pb-8">
                      {!isLoading ? (
                        <>
                          {/* First mission */}
                          <div className="mb-8">
                            <MissionItem
                              missions={weeklyWinGamesMissions}
                              icon={<Gamepad2 className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={0}
                            />
                          </div>

                          {/* Second mission */}
                          <div className="mb-8">
                            <MissionItem
                              missions={weeklyPlayGamesMissions}
                              icon={<Gamepad2 className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={0}
                            />
                          </div>

                          {/* Third mission */}
                          <div>
                            <MissionItem
                              missions={weeklyTournamentMissions}
                              icon={<Trophy className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={0}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="animate-pulse space-y-5 mb-8">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-everchess-yellow/20"></div>
                                <div>
                                  <div className="h-4 w-32 bg-background-600 rounded mb-2"></div>
                                  <div className="h-3 w-20 bg-background-600 rounded"></div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-16 bg-background-600 rounded"></div>
                                <div className="flex gap-1.5">
                                  {[0, 1, 2].map((i) => (
                                    <div
                                      key={i}
                                      className="h-3 w-3 bg-background-600 rounded-sm transform rotate-45"
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-background-600 rounded-full"></div>
                          </div>

                          <div className="animate-pulse space-y-5 mb-8">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-everchess-yellow/20"></div>
                                <div>
                                  <div className="h-4 w-32 bg-background-600 rounded mb-2"></div>
                                  <div className="h-3 w-20 bg-background-600 rounded"></div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-16 bg-background-600 rounded"></div>
                                <div className="flex gap-1.5">
                                  {[0, 1, 2].map((i) => (
                                    <div
                                      key={i}
                                      className="h-3 w-3 bg-background-600 rounded-sm transform rotate-45"
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-background-600 rounded-full"></div>
                          </div>

                          <div className="animate-pulse space-y-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-6 w-6 rounded-full bg-everchess-yellow/20"></div>
                                <div>
                                  <div className="h-4 w-32 bg-background-600 rounded mb-2"></div>
                                  <div className="h-3 w-20 bg-background-600 rounded"></div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="h-4 w-16 bg-background-600 rounded"></div>
                                <div className="flex gap-1.5">
                                  {[0, 1, 2].map((i) => (
                                    <div
                                      key={i}
                                      className="h-3 w-3 bg-background-600 rounded-sm transform rotate-45"
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="h-2 w-full bg-background-600 rounded-full"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </CardContent>
          <div className="px-6 pb-6 mt-auto">
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
              onClick={handleClaimXp}
            >
              Claim XP
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-background-700 text-white border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CastleIcon className="h-5 w-5 text-everchess-yellow" />
              Chess Sets
            </CardTitle>
            <p className="text-muted-foreground text-sm">Customize your gameplay with chess sets</p>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="flex items-center gap-4 rounded-lg bg-amber-950 p-5 transition-all duration-200 hover:shadow-[0_0_15px_rgba(252,223,58,0.2)] hover:scale-[1.01] cursor-pointer border border-transparent hover:border-everchess-yellow/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-background-800 relative overflow-hidden">
                <div className="relative h-12 w-12">
                  <Image
                    src="/chess-pawn-blue.png"
                    alt="Classic Wood Set"
                    layout="fill"
                    objectFit="contain"
                    style={{
                      filter: "sepia(100%) saturate(300%) brightness(70%) hue-rotate(320deg)",
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Classic Wood</h4>
                <p className="text-xs text-muted-foreground">Common</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-5 transition-all duration-200 hover:from-blue-500/30 hover:to-cyan-500/30 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(0,182,255,0.3)] cursor-pointer border border-transparent hover:border-everchess-cyan/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-background-800 relative overflow-hidden">
                <div className="relative h-12 w-12">
                  <Image src="/chess-pawn-blue.png" alt="Crystal Set" layout="fill" objectFit="contain" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Crystal Set</h4>
                <p className="text-xs text-muted-foreground">Rare</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-5 transition-all duration-200 hover:from-purple-500/30 hover:to-indigo-500/30 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer border border-transparent hover:border-purple-500/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-background-800 relative overflow-hidden">
                <div className="relative h-12 w-12">
                  <Image src="/chess-pawn-purple.png" alt="Dragon Kingdom" layout="fill" objectFit="contain" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Dragon Kingdom</h4>
                <p className="text-xs text-muted-foreground">Epic</p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg bg-gradient-to-r from-red-600/20 to-red-500/20 p-5 transition-all duration-200 hover:from-red-600/30 hover:to-red-500/30 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer border border-transparent hover:border-red-500/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-md bg-background-800 relative overflow-hidden">
                <div className="relative h-12 w-12">
                  <Image src="/chess-pawn-red.png" alt="Chinese Dragon" layout="fill" objectFit="contain" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">Chinese Dragon</h4>
                <p className="text-xs text-muted-foreground">Legendary</p>
              </div>
            </div>
          </CardContent>
          <div className="px-6 pb-6 mt-auto pt-2">
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
              onClick={() => (window.location.href = "/chess-sets")}
            >
              View More Sets
            </Button>
          </div>
        </Card>

        <Card className="bg-background-700 text-white border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-everchess-yellow" />
              Top Players
            </CardTitle>
            <p className="text-muted-foreground text-sm">Global ranking leaderboard</p>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="flex items-center justify-between rounded-lg bg-background-900 p-5 transition-all duration-200 hover:shadow-[0_0_15px_rgba(252,223,58,0.2)] hover:scale-[1.01] cursor-pointer border border-transparent hover:border-everchess-cyan/30">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-everchess-yellow/20 text-sm font-bold text-everchess-yellow shadow-[0_0_8px_rgba(252,223,58,0.3)]">
                  1
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-background-800 border border-everchess-yellow/30">
                    <div className="flex h-full w-full items-center justify-center text-xs">GM</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">ChessMaster99</p>
                    <p className="text-xs text-muted-foreground">Rating: 2450</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-everchess-yellow" />
                <span className="text-xs font-medium">12 Wins</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-background-900 p-5 transition-all duration-200 hover:shadow-[0_0_15px_rgba(252,223,58,0.2)] hover:scale-[1.01] cursor-pointer border border-transparent hover:border-everchess-cyan/30">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-everchess-yellow/20 text-sm font-bold text-everchess-yellow shadow-[0_0_8px_rgba(252,223,58,0.3)]">
                  2
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-background-800 border border-everchess-yellow/30">
                    <div className="flex h-full w-full items-center justify-center text-xs">QK</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">QueenKnight42</p>
                    <p className="text-xs text-muted-foreground">Rating: 2380</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-everchess-yellow" />
                <span className="text-xs font-medium">9 Wins</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-background-900 p-5 transition-all duration-200 hover:shadow-[0_0_15px_rgba(252,223,58,0.2)] hover:scale-[1.01] cursor-pointer border border-transparent hover:border-everchess-cyan/30">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-everchess-yellow/20 text-sm font-bold text-everchess-yellow">
                  3
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-background-800 border border-everchess-yellow/30">
                    <div className="flex h-full w-full items-center justify-center text-xs">BP</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">BishopPro</p>
                    <p className="text-xs text-muted-foreground">Rating: 2310</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-everchess-yellow" />
                <span className="text-xs font-medium">7 Wins</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-background-900 p-5 transition-all duration-200 hover:shadow-[0_0_15px_rgba(252,223,58,0.2)] hover:scale-[1.01] cursor-pointer border border-transparent hover:border-everchess-cyan/30">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/20 text-sm font-bold text-gray-300">
                  4
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-background-800 border border-gray-700/50">
                    <div className="flex h-full w-full items-center justify-center text-xs">RK</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">RookMaster</p>
                    <p className="text-xs text-muted-foreground">Rating: 2280</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-everchess-yellow" />
                <span className="text-xs font-medium">5 Wins</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-background-900 p-5 transition-all duration-200 hover:shadow-[0_0_15px_rgba(252,223,58,0.2)] hover:scale-[1.01] cursor-pointer border border-transparent hover:border-everchess-cyan/30">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/20 text-sm font-bold text-gray-300">
                  5
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-background-800 border border-gray-700/50">
                    <div className="flex h-full w-full items-center justify-center text-xs">KN</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">KnightRider</p>
                    <p className="text-xs text-muted-foreground">Rating: 2210</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-everchess-yellow" />
                <span className="text-xs font-medium">4 Wins</span>
              </div>
            </div>
          </CardContent>
          <div className="px-6 pb-6 mt-auto">
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
              onClick={() => (window.location.href = "/ranking")}
            >
              View Full Leaderboard
            </Button>
          </div>
        </Card>
      </div>

      <XpClaimAnimation
        isVisible={showXpClaimAnimation}
        totalXp={totalXpToClaim}
        onComplete={() => {
          setShowXpClaimAnimation(false)
          // Here you would typically update the user's XP in state
          console.log(`Added ${totalXpToClaim} XP to user account`)

          // Check if we should show level up animation
          const shouldLevelUp = Math.random() > 0.3 // 70% chance to level up for demo purposes
          if (shouldLevelUp) {
            // Show level up animation after a short delay
            setTimeout(() => {
              setShowLevelUpAnimation(true)
            }, 300)
          }
        }}
      />
      <BattlepassRewardAnimation
        isVisible={showBattlepassRewardAnimation}
        rewardType={battlepassRewardType}
        onComplete={() => {
          setShowBattlepassRewardAnimation(false)
          console.log(`Claimed battlepass reward: ${battlepassRewardType}`)
        }}
      />
      <LevelUpAnimation
        isVisible={showLevelUpAnimation}
        oldLevel={currentLevel}
        newLevel={newLevel}
        rewards={[
          { type: "gold", amount: 100 },
          { type: "xp-boost", amount: 5 },
        ]}
        onComplete={() => {
          setShowLevelUpAnimation(false)
          console.log(`Level up animation completed: ${currentLevel} -> ${newLevel}`)
        }}
      />
    </div>
  )
}
