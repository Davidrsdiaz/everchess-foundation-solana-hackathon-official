"use client"

import { useState } from "react"
import { Trophy, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"

// Mock data for rankings
const globalRankings = [
  {
    id: 1,
    rank: 1,
    username: "ChessMaster99",
    rating: 2450,
    wins: 12,
    avatar: "/male-avatar.svg",
  },
  {
    id: 2,
    rank: 2,
    username: "QueenKnight42",
    rating: 2380,
    wins: 9,
    avatar: "/male-avatar.svg",
  },
  {
    id: 3,
    rank: 3,
    username: "BishopPro",
    rating: 2310,
    wins: 7,
    avatar: "/male-avatar.svg",
  },
  {
    id: 4,
    rank: 4,
    username: "RookMaster",
    rating: 2280,
    wins: 5,
    avatar: "/male-avatar.svg",
  },
  {
    id: 5,
    rank: 5,
    username: "KnightRider",
    rating: 2210,
    wins: 4,
    avatar: "/male-avatar.svg",
  },
  {
    id: 6,
    rank: 10,
    username: "Player110",
    rating: 1950,
    wins: 3,
    avatar: "/male-avatar.svg",
  },
  {
    id: 7,
    rank: 42,
    username: "GrandMaster42",
    rating: 1250,
    wins: 1,
    avatar: "/male-avatar.svg",
    isCurrentUser: true,
  },
]

// Mock data for monthly rating history
const monthlyRatingData = [
  { month: "Jan", rating: 950 },
  { month: "Feb", rating: 1050 },
  { month: "Mar", rating: 1000 },
  { month: "Apr", rating: 1150 },
  { month: "May", rating: 1100 },
  { month: "Jun", rating: 1200 },
  { month: "Jul", rating: 1150 },
  { month: "Aug", rating: 1300 },
  { month: "Sep", rating: 1250 },
  { month: "Oct", rating: 1350 },
  { month: "Nov", rating: 1300 },
  { month: "Dec", rating: 1250 },
]

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState("global")
  const isMobile = useIsMobile()

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Tabs defaultValue="global" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 bg-background-700 rounded-lg h-12">
          <TabsTrigger
            value="global"
            className={`text-base ${activeTab === "global" ? "!bg-red-600 text-white" : "text-muted-foreground"}`}
          >
            Global
          </TabsTrigger>
          <TabsTrigger
            value="friends"
            className={`text-base ${activeTab === "friends" ? "!bg-red-600 text-white" : "text-muted-foreground"}`}
          >
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6 space-y-6">
          {/* Global Rankings Container */}
          <div className="bg-background-700 rounded-lg p-4 sm:p-6 border border-gray-700/40">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-everchess-yellow" />
              <div>
                <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
                <p className="text-gray-400">Top players around the world</p>
              </div>
            </div>

            <div className="space-y-2">
              {globalRankings.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    player.isCurrentUser ? "bg-red-950/30 border border-red-600/40" : "bg-background-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        player.rank <= 3
                          ? "bg-everchess-yellow/20 text-everchess-yellow shadow-[0_0_8px_rgba(252,223,58,0.3)]"
                          : "bg-gray-800 text-gray-300"
                      }`}
                    >
                      <span className="font-bold text-sm">{player.rank}</span>
                    </div>
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-blue-400/30 bg-blue-950/30">
                      <Image
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm sm:text-base">
                        {player.username}
                        {player.isCurrentUser && " (You)"}
                      </div>
                      <div className="text-xs text-gray-400">Rating: {player.rating}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Trophy className="h-4 w-4 text-everchess-yellow" />
                    <span className="text-white text-sm">{player.wins} W's</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                View Full Rankings
              </Button>
            </div>
          </div>

          {/* Ranking History Chart */}
          <div className="bg-background-700 rounded-lg p-4 sm:p-6 border border-gray-700/40">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-everchess-yellow" />
                Your Ranking History
              </h2>
              <p className="text-gray-400">Track your progress over time</p>
            </div>

            <div className="h-64 mt-6 relative bg-background-900 rounded-lg p-4 border border-gray-700/30">
              {/* Chart background grid */}
              <div className="absolute inset-0 grid grid-cols-1 grid-rows-4 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="col-span-1 border-t border-gray-700/30" />
                ))}
              </div>

              {/* Line chart */}
              <div className="absolute inset-0 flex items-center p-4">
                <svg className="w-full h-full" viewBox="0 0 1200 240" preserveAspectRatio="none">
                  {/* Gradient for the area under the line */}
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#E11D48" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Area under the line */}
                  <path
                    d={`
                      ${monthlyRatingData
                        .map((data, i) => {
                          const x = (i / (monthlyRatingData.length - 1)) * 1200
                          const y = 240 - ((data.rating - 900) / 500) * 200
                          return `${i === 0 ? "M" : "L"} ${x} ${y}`
                        })
                        .join(" ")}
                      L 1200 240 L 0 240 Z
                    `}
                    fill="url(#areaGradient)"
                  />

                  {/* Line path */}
                  <path
                    d={monthlyRatingData
                      .map((data, i) => {
                        const x = (i / (monthlyRatingData.length - 1)) * 1200
                        const y = 240 - ((data.rating - 900) / 500) * 200
                        return `${i === 0 ? "M" : "L"} ${x} ${y}`
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#E11D48"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Simple red dots */}
                  {monthlyRatingData.map((data, i) => {
                    const x = (i / (monthlyRatingData.length - 1)) * 1200
                    const y = 240 - ((data.rating - 900) / 500) * 200
                    return <circle key={i} cx={x} cy={y} r="4" fill="#E11D48" />
                  })}
                </svg>
              </div>

              {/* Month labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
                {isMobile
                  ? // Show fewer labels on mobile
                    monthlyRatingData
                      .filter((_, i) => i % 3 === 0 || i === monthlyRatingData.length - 1)
                      .map((data, index) => (
                        <div key={index} className="text-xs text-gray-400">
                          {data.month}
                        </div>
                      ))
                  : // Show all labels on desktop
                    monthlyRatingData.map((data, index) => (
                      <div key={index} className="text-xs text-gray-400">
                        {data.month}
                      </div>
                    ))}
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold" asChild>
                <Link href="/profile">View Detailed Stats</Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="friends">
          <div className="mt-6 bg-background-700 rounded-lg p-4 sm:p-6 border border-gray-700/40">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-everchess-yellow" />
              <div>
                <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
                <p className="text-gray-400">Top players between friends</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-gray-400">Connect with friends to see their rankings</p>
              <Button variant="outline" className="mt-4">
                Add Friends
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
