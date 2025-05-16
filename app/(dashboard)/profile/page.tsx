"use client"

import { useState } from "react"
import { Settings, Share2, Trophy, TrendingUp, Package, Castle, Brain, Award, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"

// Mock user data
const userData = {
  username: "Einstein",
  memberSince: "January 2023",
  isPremium: true,
  rating: 1250,
  rank: 42,
  gamesPlayed: 128,
  winRate: 62,
  tournaments: 7,
  gameStats: {
    ranked: {
      gamesPlayed: 78,
      wins: 48,
      losses: 30,
    },
    tournaments: {
      gamesPlayed: 7,
      wins: 3,
      losses: 4,
    },
  },
  recentGames: ["W", "W", "L", "W", "W", "L", "W", "L", "W", "W"],
  chessSets: [
    {
      id: 1,
      name: "Classic Wood",
      rarity: "Common",
      rarityColor: "bg-amber-800",
      image: "/chess-pawn-blue.png", // Using blue pawn as base and applying filter
      backgroundColor: "bg-amber-950",
    },
    {
      id: 2,
      name: "Crystal Set",
      rarity: "Rare",
      rarityColor: "bg-cyan-600",
      image: "/chess-pawn-blue.png",
      backgroundColor: "bg-cyan-900/30",
    },
  ],
  battlepass: {
    season: 1,
    tier: 24,
    maxTier: 100,
    xp: 210,
    xpNeeded: 250,
    nextReward: {
      name: "Mystery Box",
      tier: 25,
      image: "/gift-box-icon.png",
    },
  },
  achievements: [
    {
      id: 1,
      name: "First Win",
      icon: Trophy,
      color: "text-amber-500",
      backgroundColor: "bg-amber-950",
      unlocked: true,
    },
    {
      id: 2,
      name: "Rising Star",
      icon: TrendingUp,
      color: "text-red-500",
      backgroundColor: "bg-red-950",
      unlocked: true,
    },
    {
      id: 3,
      name: "Collector",
      icon: Package,
      color: "text-purple-500",
      backgroundColor: "bg-purple-950",
      unlocked: true,
    },
    {
      id: 4,
      name: "Strategist",
      icon: Brain,
      color: "text-blue-500",
      backgroundColor: "bg-blue-950",
      unlocked: true,
    },
    {
      id: 5,
      name: "Tournament Champion",
      icon: Award,
      color: "text-green-500",
      backgroundColor: "bg-green-950",
      unlocked: false,
    },
    {
      id: 6,
      name: "Grandmaster",
      icon: Castle,
      color: "text-amber-500",
      backgroundColor: "bg-amber-950",
      unlocked: false,
    },
  ],
}

export default function ProfilePage() {
  const [activeGameTab, setActiveGameTab] = useState("ranked")

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Profile</h1>
          <p className="text-muted-foreground">Manage your profile and view your stats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-background-700 rounded-lg p-6 flex flex-col items-center border border-gray-700/50">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-everchess-cyan-40 relative">
              <Avatar className="w-full h-full">
                <AvatarImage src="/male-avatar.svg" alt={userData.username} />
                <AvatarFallback className="bg-background-800 text-white text-2xl">
                  {userData.username.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Status indicator positioned outside the avatar circle */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background-700 z-10"></div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{userData.username}</h2>

          {userData.isPremium && <Badge className="bg-red-600 text-white mb-2">Premium Member</Badge>}

          <p className="text-sm text-muted-foreground mb-6">Member since {userData.memberSince}</p>

          <div className="w-full space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rating</span>
              <span className="text-white font-bold">{userData.rating}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rank</span>
              <span className="text-white font-bold">#{userData.rank}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Games Played</span>
              <span className="text-white font-bold">{userData.gamesPlayed}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="text-white font-bold">{userData.winRate}%</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tournaments</span>
              <span className="text-white font-bold">{userData.tournaments}</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <Button variant="destructive" className="w-full gap-2 bg-red-600 hover:bg-red-700">
              <Share2 className="h-4 w-4" />
              Share Profile
            </Button>

            <Button variant="destructive" className="w-full gap-2 bg-red-600 hover:bg-red-700">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Game Statistics Card */}
        <div className="bg-background-700 rounded-lg p-6 lg:col-span-2 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-2">Game Statistics</h2>
          <p className="text-muted-foreground mb-6">Performance in different modes</p>

          <Tabs defaultValue="ranked" className="w-full" onValueChange={setActiveGameTab}>
            <TabsList className="grid w-full grid-cols-2 bg-black rounded-lg h-12 mb-6">
              <TabsTrigger
                value="ranked"
                className="text-base data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                Ranked
              </TabsTrigger>
              <TabsTrigger
                value="tournaments"
                className="text-base data-[state=active]:bg-red-600 data-[state=active]:text-white"
              >
                Tournaments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ranked">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-background-900 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{userData.gameStats.ranked.gamesPlayed}</span>
                  <span className="text-sm text-muted-foreground">Games Played</span>
                </div>

                <div className="bg-background-900 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-green-500">{userData.gameStats.ranked.wins}</span>
                  <span className="text-sm text-muted-foreground">Wins</span>
                </div>

                <div className="bg-background-900 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-red-500">{userData.gameStats.ranked.losses}</span>
                  <span className="text-sm text-muted-foreground">Losses</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="text-white font-bold">{userData.winRate}%</span>
                </div>
                <Progress
                  value={userData.winRate}
                  className="h-2 bg-background-900"
                  indicatorClassName="bg-green-500"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Performance</h3>
                <div className="flex gap-2">
                  {userData.recentGames.map((result, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        result === "W" ? "bg-green-900 text-green-500" : "bg-red-900 text-red-500"
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tournaments">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-background-900 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{userData.gameStats.tournaments.gamesPlayed}</span>
                  <span className="text-sm text-muted-foreground">Games Played</span>
                </div>

                <div className="bg-background-900 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-green-500">{userData.gameStats.tournaments.wins}</span>
                  <span className="text-sm text-muted-foreground">Wins</span>
                </div>

                <div className="bg-background-900 rounded-lg p-4 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-red-500">{userData.gameStats.tournaments.losses}</span>
                  <span className="text-sm text-muted-foreground">Losses</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="text-white font-bold">
                    {Math.round(
                      (userData.gameStats.tournaments.wins / userData.gameStats.tournaments.gamesPlayed) * 100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={(userData.gameStats.tournaments.wins / userData.gameStats.tournaments.gamesPlayed) * 100}
                  className="h-2 bg-background-900"
                  indicatorClassName="bg-green-500"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chess Sets Collection */}
        <div className="bg-background-700 rounded-lg p-6 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-6">Chess Sets Collection</h2>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {userData.chessSets.map((set) => (
              <div
                key={set.id}
                className={`rounded-lg p-4 flex flex-col items-center border border-gray-700/50 text-center ${
                  set.backgroundColor
                }`}
              >
                <div className="w-16 h-16 mb-3 flex items-center justify-center">
                  <Image
                    src={set.image || "/placeholder.svg"}
                    alt={set.name}
                    width={56}
                    height={56}
                    className="object-contain"
                    style={
                      set.id === 1
                        ? {
                            filter: "sepia(100%) brightness(60%) saturate(400%) hue-rotate(320deg)",
                          }
                        : {}
                    }
                  />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{set.name}</h3>

                <Badge className={`${set.rarityColor} text-white mb-6`}>{set.rarity}</Badge>
              </div>
            ))}
          </div>

          <Link href="/chess-sets">
            <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
              Browse Chess Sets
            </Button>
          </Link>
        </div>

        {/* Battlepass Progress */}
        <div className="bg-background-700 rounded-lg p-6 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-2">Battlepass Progress</h2>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-white font-semibold">Tier {userData.battlepass.tier}</span>
              <span className="text-muted-foreground">
                {userData.battlepass.tier}/{userData.battlepass.maxTier}
              </span>
            </div>
            <Progress
              value={(userData.battlepass.tier / userData.battlepass.maxTier) * 100}
              className="h-2 bg-background-900"
              indicatorClassName="bg-everchess-cyan"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-white font-semibold">Next Reward: Tier {userData.battlepass.nextReward.tier}</span>
              <span className="text-muted-foreground">
                {userData.battlepass.xp}/{userData.battlepass.xpNeeded} XP
              </span>
            </div>
            <Progress
              value={(userData.battlepass.xp / userData.battlepass.xpNeeded) * 100}
              className="h-2 bg-background-900"
              indicatorClassName="bg-everchess-cyan"
            />
          </div>

          <div className="bg-background-900 rounded-lg p-4 flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-950 rounded-lg flex items-center justify-center">
                <Gift className="w-8 h-8 text-red-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">Next Reward: Mystery Box</h3>
                <p className="text-sm text-muted-foreground">Unlock at Tier 25</p>
              </div>
            </div>

            <Button variant="outline" className="border-gray-700 text-white">
              View
            </Button>
          </div>

          <Link href="/battlepass">
            <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
              View Full Battlepass
            </Button>
          </Link>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-background-700 rounded-lg p-6 border border-gray-700/50 relative">
        <div className="absolute top-0 right-0 m-2">
          <Badge className="bg-yellow-600 text-white whitespace-nowrap">Coming Soon</Badge>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Achievements</h2>
        <p className="text-muted-foreground mb-6">Unlocked achievement badges</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          {userData.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`${achievement.backgroundColor} rounded-lg p-4 flex flex-col items-center ${
                !achievement.unlocked ? "opacity-50" : ""
              } border border-gray-700/50`}
            >
              <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center mb-3">
                <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
              </div>

              <h3
                className={`text-sm font-semibold text-center ${achievement.unlocked ? "text-white" : "text-muted-foreground"}`}
              >
                {achievement.name}
              </h3>
            </div>
          ))}
        </div>

        <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
          View All Achievements
        </Button>
      </div>
    </div>
  )
}
