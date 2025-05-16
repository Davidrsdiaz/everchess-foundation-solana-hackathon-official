"use client"

import { useState, useRef } from "react"
import {
  Trophy,
  Gamepad2,
  Settings,
  Users,
  Clock,
  Eye,
  Star,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useQueue } from "@/contexts/queue-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

export default function PlayPage() {
  // Reduce initial loading states to improve performance
  const [isLoading, setIsLoading] = useState(false)
  const [expandedTimeOptions, setExpandedTimeOptions] = useState<string[]>([])
  const { startQueue } = useQueue()
  const queueAnimationRef = useRef<HTMLDivElement>(null)

  // Tournament creation state
  const [showCreateTournament, setShowCreateTournament] = useState(false)
  const [tournamentName, setTournamentName] = useState("")
  const [tournamentTimeControl, setTournamentTimeControl] = useState("5+5")
  const [tournamentSize, setTournamentSize] = useState("32")
  const [tournamentDate, setTournamentDate] = useState<Date | undefined>(new Date())
  const [tournamentTime, setTournamentTime] = useState("18:00")

  // Track registered tournaments
  const [registeredTournaments, setRegisteredTournaments] = useState<string[]>([])

  // Tournament data
  const [tournaments, setTournaments] = useState([
    {
      id: "hello-everchess",
      title: "Hello Everchess",
      timeControl: "5+5",
      participants: "0/32",
      startTime: "In 3 hours",
      prize: "500 XP",
      status: "upcoming",
    },
    {
      id: "weekend-blitz",
      title: "Weekend Blitz",
      timeControl: "3+2",
      participants: "32/64",
      startTime: "In 2 hours",
      prize: "500 XP",
      status: "upcoming",
    },
    {
      id: "daily-rapid",
      title: "Daily Rapid",
      timeControl: "10+5",
      participants: "16/32",
      startTime: "In 5 hours",
      prize: "300 XP",
      status: "upcoming",
    },
    {
      id: "grandmaster-invitational",
      title: "GM Invitational",
      timeControl: "15+10",
      participants: "8/8",
      startTime: "Tomorrow",
      prize: "1000 XP",
      status: "upcoming",
    },
  ])

  // Game mode data with titles and icons - same as homepage
  const gameModes = [
    {
      id: "ranked",
      title: "Ranked",
      icon: Gamepad2,
      hasMoreOptions: true,
      iconColor: "text-everchess-yellow",
      description: "Compete for ranking points and climb the leaderboard",
      timeControl: "Various",
      players: "1v1",
      featured: true,
      comingSoon: false,
    },
    {
      id: "tournaments",
      title: "Tournaments",
      icon: Trophy,
      hasMoreOptions: true,
      iconColor: "text-everchess-yellow",
      description: "Join scheduled tournaments with prizes",
      timeControl: "Various",
      players: "Multiple",
      comingSoon: false,
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
      hasMoreOptions: true,
      comingSoon: true,
      iconColor: "text-everchess-yellow",
      description: "Jump into a game with random players",
      timeControl: "Various",
      players: "1v1",
    },
    {
      id: "custom",
      title: "Custom",
      icon: Settings,
      hasMoreOptions: true,
      comingSoon: true,
      iconColor: "text-everchess-yellow",
      description: "Practice against different AI difficulty levels",
      timeControl: "Your choice",
      players: "1v1",
    },
  ]

  // Initial time options for game modes
  const initialTimeOptions = [
    { label: "3 | 2+", minutes: 3, increment: 2 },
    { label: "5 | 5+", minutes: 5, increment: 5 },
    { label: "15 | 10+", minutes: 15, increment: 10 },
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

  // Tournament time control options
  const tournamentTimeOptions = [
    { value: "3+2", label: "3 min + 2 sec" },
    { value: "5+5", label: "5 min + 5 sec" },
    { value: "10+5", label: "10 min + 5 sec" },
    { value: "15+10", label: "15 min + 10 sec" },
  ]

  // Tournament size options
  const tournamentSizeOptions = [
    { value: "8", label: "8 players" },
    { value: "16", label: "16 players" },
    { value: "32", label: "32 players" },
    { value: "64", label: "64 players" },
  ]

  // Live games data - memoized to prevent re-renders
  const liveGames = [
    {
      id: "game1",
      whitePlayer: "GrandMaster99",
      whiteRating: 2450,
      blackPlayer: "ChessWizard",
      blackRating: 2380,
      timeControl: "5+3",
      moveCount: 24,
      viewerCount: 128,
    },
    {
      id: "game2",
      whitePlayer: "QueenKnight42",
      whiteRating: 2380,
      blackPlayer: "BishopPro",
      blackRating: 2310,
      timeControl: "3+2",
      moveCount: 18,
      viewerCount: 76,
    },
    {
      id: "game3",
      whitePlayer: "RookMaster",
      whiteRating: 2280,
      blackPlayer: "KnightRider",
      blackRating: 2210,
      timeControl: "10+5",
      moveCount: 32,
      viewerCount: 54,
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

  // Handle time option selection - start queue
  const handleTimeOptionClick = (modeId: string, option: { label: string; minutes: number; increment: number }) => {
    const mode = gameModes.find((m) => m.id === modeId)
    if (mode && !mode.comingSoon) {
      // Start queue using the context
      startQueue(mode.title, option.label)
    }
  }

  // Handle tournament creation
  const handleCreateTournament = () => {
    // Generate a unique ID
    const id = `tournament-${Date.now()}`

    // Calculate start time display
    const now = new Date()
    const tournamentDateTime = tournamentDate ? new Date(tournamentDate) : new Date()
    const [hours, minutes] = tournamentTime.split(":").map(Number)
    tournamentDateTime.setHours(hours, minutes, 0)

    let startTimeDisplay = "Tomorrow"
    const diffHours = Math.round((tournamentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffHours < 24) {
      startTimeDisplay = `In ${diffHours} hours`
    } else if (diffHours >= 24 && diffHours < 48) {
      startTimeDisplay = "Tomorrow"
    } else {
      startTimeDisplay = format(tournamentDateTime, "MMM d")
    }

    // Create new tournament
    const newTournament = {
      id,
      title: tournamentName,
      timeControl: tournamentTimeControl,
      participants: `0/${tournamentSize}`,
      startTime: startTimeDisplay,
      prize: "500 XP",
      status: "upcoming",
    }

    // Add to tournaments list
    setTournaments([newTournament, ...tournaments])

    // Reset form and close dialog
    setTournamentName("")
    setTournamentTimeControl("5+5")
    setTournamentSize("32")
    setTournamentDate(new Date())
    setTournamentTime("18:00")
    setShowCreateTournament(false)

    // Show success toast
    toast({
      title: "Tournament Created",
      description: `Your tournament "${tournamentName}" has been created successfully.`,
      variant: "default",
    })
  }

  // Handle tournament registration
  const handleTournamentRegistration = (tournamentId: string) => {
    if (registeredTournaments.includes(tournamentId)) {
      // Unregister from tournament
      setRegisteredTournaments(registeredTournaments.filter((id) => id !== tournamentId))

      // Update participants count
      setTournaments(
        tournaments.map((tournament) => {
          if (tournament.id === tournamentId) {
            const [current, max] = tournament.participants.split("/")
            const newCurrent = Number.parseInt(current) - 1
            return {
              ...tournament,
              participants: `${newCurrent}/${max}`,
            }
          }
          return tournament
        }),
      )

      toast({
        title: "Unregistered",
        description: "You have been removed from the tournament.",
        variant: "destructive",
      })
    } else {
      // Register for tournament
      setRegisteredTournaments([...registeredTournaments, tournamentId])

      // Update participants count
      setTournaments(
        tournaments.map((tournament) => {
          if (tournament.id === tournamentId) {
            const [current, max] = tournament.participants.split("/")
            const newCurrent = Number.parseInt(current) + 1
            return {
              ...tournament,
              participants: `${newCurrent}/${max}`,
            }
          }
          return tournament
        }),
      )

      toast({
        title: "Registered",
        description: "You have successfully registered for the tournament.",
        variant: "default",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-white">Play Now</h1>
        <p className="text-muted-foreground">Choose your game mode and start playing</p>
      </div>

      {/* Game Mode Containers */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
        {gameModes.map((mode) => {
          const Icon = mode.icon
          const isExpanded = expandedTimeOptions.includes(mode.id)

          return (
            <Card
              key={mode.id}
              className={`bg-background-700 text-white transition-all duration-300 overflow-hidden relative h-auto border-everchess-cyan/60 hover:border-everchess-cyan hover:shadow-[0_0_10px_rgba(0,182,255,0.15)]
              ${mode.comingSoon ? "opacity-90" : ""}`}
            >
              {/* Card header with icon */}
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-everchess-cyan/20 relative z-10">
                <CardTitle className="text-lg font-bold text-white drop-shadow-sm">{mode.title}</CardTitle>
                <div className={`${mode.iconColor} transition-transform duration-300 drop-shadow-md hover:scale-110`}>
                  {typeof Icon === "function" ? <Icon /> : <Icon />}
                </div>
              </CardHeader>
              <CardContent className="relative pt-4 z-10">
                {/* Always show initial time options */}
                <div className="grid grid-cols-3 gap-2">
                  {initialTimeOptions.map((option) => (
                    <Button
                      key={option.label}
                      className={`h-14 flex items-center justify-center transition-all duration-300 text-white
                      ${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                      onClick={() => {
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

                {/* Show either More Time Options button or extended time options */}
                {!isExpanded ? (
                  <div className="relative">
                    {/* More Time Options button */}
                    <Button
                      className={`h-14 w-full mt-3 flex items-center justify-center transition-all duration-200 text-white
  ${
    mode.comingSoon
      ? "bg-background-900 opacity-80 cursor-not-allowed"
      : "bg-background-900 hover:bg-red-600 hover:scale-105 active:scale-95 hover:shadow-[0_0_10px_rgba(220,38,38,0.4)]"
  }`}
                      onClick={() => {
                        if (!mode.comingSoon && mode.hasMoreOptions) {
                          toggleExpandedTimeOptions(mode.id)
                        }
                      }}
                      disabled={mode.comingSoon || !mode.hasMoreOptions}
                    >
                      <span className="text-sm font-bold flex items-center gap-2 text-white">
                        {mode.hasMoreOptions ? (
                          "More Time Options"
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

                    {/* Coming Soon badge for locked modes */}
                    {mode.comingSoon && (
                      <div className="mt-3 flex justify-center">
                        <Badge className="bg-yellow-600/80 text-white px-3 py-1 text-sm">Coming Soon</Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Extended time options - 2 rows of 3 */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {extendedTimeOptions.slice(0, 3).map((option) => (
                        <Button
                          key={option.label}
                          className={`h-14 flex items-center justify-center transition-all duration-300 text-white
                         ${mode.comingSoon ? "bg-gray-700 opacity-80 cursor-not-allowed" : "bg-gradient-to-r from-red-600 to-red-700 hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 cursor-pointer"}`}
                          onClick={() => {
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
                          onClick={() => {
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
                      className="h-14 w-full mt-3 bg-background-900 hover:bg-red-600 hover:scale-105 active:scale-95 text-white transition-all duration-200 hover:shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                      onClick={() => toggleExpandedTimeOptions(mode.id)}
                    >
                      <span className="text-sm font-bold text-white">Show Fewer Options</span>
                    </Button>

                    {/* Coming Soon badge for locked modes */}
                    {mode.comingSoon && (
                      <div className="mt-3 flex justify-center">
                        <Badge className="bg-yellow-600/80 text-white px-3 py-1 text-sm">Coming Soon</Badge>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tournaments and Stats Containers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Tournaments Container */}
        <Card className="bg-background-700 text-white border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-white">Tournaments</CardTitle>
            <Trophy className="h-5 w-5 text-everchess-yellow" />
          </CardHeader>

          {/* Scrollable tournament list */}
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <div className="space-y-4 overflow-y-auto pr-1 custom-scrollbar flex-1 max-h-[350px]">
              {isLoading ? (
                // Loading skeleton for tournaments
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse space-y-2">
                      <div className="flex justify-between">
                        <div className="h-5 w-32 bg-background-800 rounded"></div>
                        <div className="h-5 w-16 bg-background-800 rounded"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 w-24 bg-background-800 rounded"></div>
                        <div className="h-4 w-20 bg-background-800 rounded"></div>
                      </div>
                      <div className="h-10 w-full bg-background-800 rounded"></div>
                    </div>
                  ))}
                </>
              ) : (
                // Tournament list
                <>
                  {tournaments.map((tournament) => {
                    const isRegistered = registeredTournaments.includes(tournament.id)

                    return (
                      <div
                        key={tournament.id}
                        className={`p-4 rounded-lg bg-background-800 border transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,182,255,0.15)] cursor-pointer relative
                        ${isRegistered ? "border-green-600/50 hover:border-green-600" : "border-gray-700/50 hover:border-everchess-cyan/30"}`}
                        onClick={() => handleTournamentRegistration(tournament.id)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium text-white">{tournament.title}</h3>
                          <Badge
                            className={
                              isRegistered
                                ? "bg-green-600 hover:bg-red-600 text-white"
                                : "bg-everchess-yellow hover:bg-everchess-yellow/80 text-black font-medium"
                            }
                          >
                            {isRegistered ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Registered
                              </span>
                            ) : (
                              "Register"
                            )}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{tournament.timeControl}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{tournament.participants}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{tournament.startTime}</span>
                          <span className="text-xs text-everchess-yellow font-medium">{tournament.prize}</span>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </CardContent>

          {/* Fixed footer with Create Tournament button */}
          <CardFooter className="pt-4 pb-4 border-t border-gray-700/30 mt-auto">
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
              onClick={() => setShowCreateTournament(true)}
            >
              Create Tournament
            </Button>
          </CardFooter>
        </Card>

        {/* Stats Container */}
        <Card className="bg-background-700 text-white border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold text-white">Your Stats</CardTitle>
            <Star className="h-5 w-5 text-everchess-yellow" />
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col">
            {/* Rating Progress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rating</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">1250</span>
                  <Badge className="bg-green-600 text-xs">+15</Badge>
                </div>
              </div>
              <div className="relative">
                <Progress value={65} className="h-2" indicatorClassName="bg-everchess-cyan" />
                <div className="text-xs text-muted-foreground text-right mt-1">Next rank: 1300</div>
              </div>
            </div>

            {/* Stats Grid - Made larger to fill the space */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="bg-background-800 rounded-lg p-6 border border-gray-700/50 flex flex-col justify-between">
                <div className="text-muted-foreground text-sm">Games Played</div>
                <div className="text-3xl font-bold text-white mt-4">42</div>
              </div>
              <div className="bg-background-800 rounded-lg p-6 border border-gray-700/50 flex flex-col justify-between">
                <div className="text-muted-foreground text-sm">Win Rate</div>
                <div className="text-3xl font-bold text-white mt-4">58%</div>
              </div>
              <div className="bg-background-800 rounded-lg p-6 border border-gray-700/50 flex flex-col justify-between">
                <div className="text-muted-foreground text-sm">Current Streak</div>
                <div className="text-3xl font-bold text-green-500 mt-4">3W</div>
              </div>
              <div className="bg-background-800 rounded-lg p-6 border border-gray-700/50 flex flex-col justify-between">
                <div className="text-muted-foreground text-sm">Best Time Control</div>
                <div className="text-3xl font-bold text-white mt-4">5+5</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spectate Games Container */}
      <Card className="bg-background-700 text-white border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300 relative">
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-yellow-600 text-xs font-medium">Coming Soon</Badge>
        </div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold text-white">Spectate Games</CardTitle>
          <Eye className="h-5 w-5 text-everchess-yellow" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            // Loading skeleton for live games
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-2 bg-background-800 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div className="h-5 w-32 bg-background-700 rounded"></div>
                    <div className="h-5 w-16 bg-background-700 rounded"></div>
                  </div>
                  <div className="h-20 w-full bg-background-700 rounded"></div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-background-700 rounded"></div>
                    <div className="h-4 w-20 bg-background-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {liveGames.map((game) => (
                <div
                  key={game.id}
                  className="bg-background-800 rounded-lg p-4 border border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,182,255,0.15)] cursor-pointer relative"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm font-medium">Live</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>{game.viewerCount}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-sm font-medium">{game.whitePlayer}</div>
                      <div className="text-xs text-muted-foreground">{game.whiteRating}</div>
                    </div>
                    <div className="text-lg font-bold">vs</div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{game.blackPlayer}</div>
                      <div className="text-xs text-muted-foreground">{game.blackRating}</div>
                    </div>
                  </div>

                  <div className="h-[60px] bg-background-900 rounded-md mb-3 flex items-center justify-center">
                    {/* Placeholder for game preview */}
                  </div>

                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{game.timeControl}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Move {game.moveCount}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-3 bg-everchess-cyan/20 hover:bg-everchess-cyan/30 text-everchess-cyan text-xs flex items-center justify-center gap-1"
                    variant="outline"
                  >
                    Watch Game
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Tournament Dialog */}
      <Dialog open={showCreateTournament} onOpenChange={setShowCreateTournament}>
        <DialogContent className="bg-background-700 text-white border-gray-700 sm:max-w-[425px]">
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => setShowCreateTournament(false)}
          >
            <X className="h-4 w-4 text-white" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-everchess-yellow" />
              Create Tournament
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Tournament Name */}
            <div className="space-y-2">
              <Label htmlFor="tournament-name" className="text-white">
                Tournament Name
              </Label>
              <Input
                id="tournament-name"
                placeholder="Enter tournament name"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                className="bg-background-800 border-gray-700 text-white"
              />
            </div>

            {/* Time Control */}
            <div className="space-y-2">
              <Label htmlFor="time-control" className="text-white">
                Time Control
              </Label>
              <Select value={tournamentTimeControl} onValueChange={setTournamentTimeControl}>
                <SelectTrigger id="time-control" className="bg-background-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select time control" />
                </SelectTrigger>
                <SelectContent className="bg-background-800 border-gray-700 text-white">
                  {tournamentTimeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-background-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tournament Size */}
            <div className="space-y-2">
              <Label htmlFor="tournament-size" className="text-white">
                Tournament Size
              </Label>
              <Select value={tournamentSize} onValueChange={setTournamentSize}>
                <SelectTrigger id="tournament-size" className="bg-background-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select tournament size" />
                </SelectTrigger>
                <SelectContent className="bg-background-800 border-gray-700 text-white">
                  {tournamentSizeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-background-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label className="text-white">Tournament Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background-800 border-gray-700 text-white",
                      !tournamentDate && "text-muted-foreground",
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {tournamentDate ? format(tournamentDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background-800 border-gray-700">
                  <CalendarComponent
                    mode="single"
                    selected={tournamentDate}
                    onSelect={setTournamentDate}
                    initialFocus
                    className="bg-background-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="tournament-time" className="text-white">
                Start Time
              </Label>
              <Input
                id="tournament-time"
                type="time"
                value={tournamentTime}
                onChange={(e) => setTournamentTime(e.target.value)}
                className="bg-background-800 border-gray-700 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="bg-background-800 text-white border-gray-700 hover:bg-background-900"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)]"
              onClick={handleCreateTournament}
              disabled={!tournamentName}
            >
              Create Tournament
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
