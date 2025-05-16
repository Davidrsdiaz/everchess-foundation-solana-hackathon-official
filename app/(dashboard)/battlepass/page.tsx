"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Star, ChevronLeft, ChevronRight, Clock, Smile, Zap, Trophy, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BattlepassRewardAnimation } from "@/components/battlepass-reward-animation"
import { XpClaimAnimation } from "@/components/xp-claim-animation"
import { MissionItem } from "@/components/mission-item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
// Add the import for LevelUpAnimation at the top with the other imports
import { LevelUpAnimation } from "@/components/level-up-animation"

export default function BattlepassPage() {
  // Change current tier from 24 to 10
  const [currentTier, setCurrentTier] = useState(10)
  const [xpProgress, setXpProgress] = useState(210)
  const [xpRequired, setXpRequired] = useState(250)
  const [isPremium, setIsPremium] = useState(false)
  const [visibleTierRange, setVisibleTierRange] = useState({ start: 1, end: 3 })
  const [showRewardAnimation, setShowRewardAnimation] = useState(false)
  const [rewardType, setRewardType] = useState<"chess-set" | "app-coin" | "emote">("app-coin")
  const [isLoading, setIsLoading] = useState(true)
  const [rewardsToShow, setRewardsToShow] = useState<any[]>([])
  const [currentRewardIndex, setCurrentRewardIndex] = useState(0)
  const [showMultipleRewards, setShowMultipleRewards] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showXpClaimAnimation, setShowXpClaimAnimation] = useState(false)
  const [totalXpToClaim, setTotalXpToClaim] = useState(0)

  // Add state for level up animation after the other animation states
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(5)
  const [newLevel, setNewLevel] = useState(6)

  // Add state for allTiers at the top of the component
  // Update tier 9 to be not claimed so it shows as claimable
  const [allTiers, setAllTiers] = useState([
    {
      tier: 1,
      freeReward: { type: "gold", amount: 50, claimed: true },
      premiumReward: { type: "gold", amount: 100, claimed: true },
    },
    {
      tier: 2,
      freeReward: { type: "xp-boost", amount: "5%", claimed: true },
      premiumReward: { type: "gold", amount: 75, claimed: true },
    },
    {
      tier: 3,
      freeReward: { type: "gold", amount: 75, claimed: true },
      premiumReward: { type: "emote", name: "Thumbs Up", claimed: true },
    },
    {
      tier: 4,
      freeReward: { type: "emote", name: "GG", claimed: true },
      premiumReward: { type: "gold", amount: 125, claimed: true },
    },
    {
      tier: 5,
      freeReward: { type: "gold", amount: 100, claimed: true },
      premiumReward: { type: "chess-piece", rarity: "common", claimed: true },
    },
    {
      tier: 6,
      freeReward: { type: "xp-boost", amount: "10%", claimed: true },
      premiumReward: { type: "emote", name: "Checkmate", claimed: true },
    },
    {
      tier: 7,
      freeReward: { type: "emote", name: "Pawn Power", claimed: true },
      premiumReward: { type: "gold", amount: 150, claimed: true },
    },
    {
      tier: 8,
      freeReward: { type: "gold", amount: 125, claimed: true },
      premiumReward: { type: "chess-piece", rarity: "rare", claimed: true },
    },
    {
      tier: 9,
      freeReward: { type: "emote", name: "Knight Rider", claimed: false },
      premiumReward: { type: "gold", amount: 200, claimed: false },
    },
    {
      tier: 10,
      freeReward: { type: "chess-piece", rarity: "common", claimed: false },
      premiumReward: { type: "chess-piece", rarity: "rare", claimed: false },
    },
    {
      tier: 11,
      freeReward: { type: "gold", amount: 150, claimed: false },
      premiumReward: { type: "gold", amount: 250, claimed: false },
    },
    {
      tier: 12,
      freeReward: { type: "xp-boost", amount: "15%", claimed: false },
      premiumReward: { type: "emote", name: "Royal Flush", claimed: false },
    },
    {
      tier: 13,
      freeReward: { type: "emote", name: "Bishop Dance", claimed: false },
      premiumReward: { type: "chess-piece", rarity: "epic", claimed: false },
    },
    {
      tier: 14,
      freeReward: { type: "gold", amount: 200, claimed: false },
      premiumReward: { type: "gold", amount: 300, claimed: false },
    },
    {
      tier: 15,
      freeReward: { type: "chess-piece", rarity: "epic", claimed: false },
      premiumReward: { type: "chess-set", name: "Ultimate Champion", claimed: false },
    },
  ])

  // Daily mission XP values
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

  // Weekly mission XP values
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

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Get visible tiers based on current range
  const visibleTiers = allTiers.filter(
    (tier) => tier.tier >= visibleTierRange.start && tier.tier <= visibleTierRange.end,
  )

  // Navigate through tiers - scroll by 2 rewards at a time
  const navigateTiers = (direction: "prev" | "next") => {
    if (direction === "prev" && visibleTierRange.start > 1) {
      setIsScrolling(true)
      setVisibleTierRange({
        start: Math.max(1, visibleTierRange.start - 2),
        end: Math.max(3, visibleTierRange.end - 2),
      })
      setTimeout(() => setIsScrolling(false), 300)
    } else if (direction === "next" && visibleTierRange.end < allTiers.length) {
      setIsScrolling(true)
      setVisibleTierRange({
        start: Math.min(allTiers.length - 2, visibleTierRange.start + 2),
        end: Math.min(allTiers.length, visibleTierRange.end + 2),
      })
      setTimeout(() => setIsScrolling(false), 300)
    }
  }

  // Handle claiming a reward
  const handleClaimReward = (rewardType: "chess-set" | "app-coin" | "emote") => {
    setRewardType(rewardType)
    setShowRewardAnimation(true)
  }

  // Modify the handleClaimAllRewards function to update the claimed status of rewards
  const handleClaimAllRewards = () => {
    // Find all unclaimed rewards
    const unclaimedRewards = []

    // Create a copy of allTiers to modify
    const updatedTiers = [...allTiers]

    for (let i = 0; i < updatedTiers.length; i++) {
      const tier = updatedTiers[i]
      // Only mark as claimed if tier is <= currentTier (claimable) and not already claimed
      if (tier.tier <= currentTier && tier.tier < 11) {
        if (!tier.freeReward.claimed) {
          unclaimedRewards.push({
            tier: tier.tier,
            reward: tier.freeReward,
            type: getRewardAnimationType(tier.freeReward),
          })
          // Mark as claimed
          updatedTiers[i] = {
            ...tier,
            freeReward: {
              ...tier.freeReward,
              claimed: true,
            },
          }
        }

        if (isPremium && !tier.premiumReward.claimed) {
          unclaimedRewards.push({
            tier: tier.tier,
            reward: tier.premiumReward,
            type: getRewardAnimationType(tier.premiumReward),
          })
          // Mark as claimed
          updatedTiers[i] = {
            ...updatedTiers[i],
            premiumReward: {
              ...tier.premiumReward,
              claimed: true,
            },
          }
        }
      }
    }

    // Update the allTiers state with the modified rewards
    setAllTiers(updatedTiers)

    if (unclaimedRewards.length > 0) {
      setRewardsToShow(unclaimedRewards)
      setCurrentRewardIndex(0)
      setShowMultipleRewards(true)
      setRewardType(unclaimedRewards[0].type)
      setShowRewardAnimation(true)
    }
  }

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
    setTotalXpToClaim(totalXp > 0 ? totalXp : 150) // Default to 150 XP for demo purposes
    setShowXpClaimAnimation(true)

    // Simulate level up check - in a real app, this would check if the XP causes a level up
    const shouldLevelUp = Math.random() > 0.3 // 70% chance to level up for demo purposes
    if (shouldLevelUp) {
      // Prepare level up animation to show after XP claim
      setCurrentLevel(5)
      setNewLevel(6)
    }
  }

  // Get reward animation type
  const getRewardAnimationType = (reward: any): "chess-set" | "app-coin" | "emote" => {
    if (reward.type === "chess-piece" || reward.type === "chess-set") {
      return "chess-set"
    } else if (reward.type === "gold" || reward.type === "xp-boost") {
      return "app-coin"
    } else {
      return "emote"
    }
  }

  // Handle reward animation completion
  const handleRewardAnimationComplete = () => {
    if (showMultipleRewards && rewardsToShow.length > 0) {
      if (currentRewardIndex < rewardsToShow.length - 1) {
        // Show next reward
        setCurrentRewardIndex(currentRewardIndex + 1)
        setRewardType(rewardsToShow[currentRewardIndex + 1].type)
      } else {
        // All rewards shown
        setShowRewardAnimation(false)
        setShowMultipleRewards(false)
        setRewardsToShow([])
        setCurrentRewardIndex(0)
      }
    } else {
      setShowRewardAnimation(false)
    }
  }

  // And update the getRewardStatusClass function to use the claimed property from state
  const getRewardStatusClass = (reward: any, tier: number) => {
    if (tier > currentTier) {
      return "opacity-50"
    } else if (reward.claimed) {
      return "" // Claimed
    }
    return "" // Claimable or locked but not grayed out
  }

  return (
    <div className="space-y-6">
      {/* Season 1 Battlepass Container */}
      <Card className="w-full bg-background-700 text-white flex flex-col border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-everchess-yellow" />
            Battlepass: Season 1
          </CardTitle>
          <p className="text-muted-foreground text-sm">Your battlepass progress and rewards</p>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 pt-2">
          {/* Simplified progress bar area */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tier {currentTier}/100</span>
              <span className="text-muted-foreground">
                {xpProgress}/{xpRequired} XP
              </span>
            </div>
            <div className="relative">
              <Progress value={currentTier} max={100} className="h-2" indicatorClassName="bg-everchess-cyan" />
            </div>
          </div>

          {/* Battlepass Rewards Horizontal Scroll */}
          <div className="relative mt-4">
            {/* Left Arrow */}
            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-background-800 border-gray-700 text-white hover:bg-accent hover:text-white"
              onClick={() => navigateTiers("prev")}
              disabled={visibleTierRange.start <= 1 || isScrolling}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Rewards Container */}
            <div className="overflow-hidden">
              <div ref={scrollContainerRef} className={`transition-transform duration-300 ease-in-out`}>
                {/* Free Rewards Row - Connected container */}
                <div className="mb-3">
                  {/* Connected dark container for rewards with badge inside */}
                  <div className="bg-background-800 rounded-lg border border-gray-700/50 p-4">
                    <div className="mb-3">
                      <Badge variant="outline" className="bg-background-800 text-white border-gray-700">
                        Free
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {visibleTiers.map((tierData) => {
                        const reward = tierData.freeReward
                        const statusClass = getRewardStatusClass(reward, tierData.tier)
                        // Update the isClaimed and isClaimable checks in the render function for both free and premium rewards
                        // For free rewards:
                        const isClaimed = reward.claimed
                        const isClaimable = !reward.claimed && tierData.tier <= currentTier
                        const isLocked = tierData.tier > currentTier

                        return (
                          <div
                            key={`free-${tierData.tier}`}
                            className={`relative flex flex-col items-center ${statusClass}`}
                          >
                            {/* Status indicator in the tier badge */}
                            <div className="text-center mb-1">
                              {isClaimed ? (
                                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
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
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </Badge>
                              ) : isClaimable ? (
                                <Badge
                                  variant="outline"
                                  className="bg-everchess-yellow/20 text-everchess-yellow border-everchess-yellow"
                                >
                                  Claim
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-background-900 text-gray-400 border-gray-700">
                                  🔒
                                </Badge>
                              )}
                            </div>

                            <div className="h-12 w-12 mb-1">
                              {reward.type === "gold" && (
                                <div className="h-full w-full rounded-full bg-everchess-yellow/20 flex items-center justify-center">
                                  <Clock className="h-7 w-7 text-everchess-yellow" />
                                </div>
                              )}
                              {reward.type === "emote" && (
                                <div className="h-full w-full rounded-full bg-everchess-cyan/20 flex items-center justify-center">
                                  <Smile className="h-7 w-7 text-everchess-cyan" />
                                </div>
                              )}
                              {reward.type === "chess-piece" && (
                                <div className="h-full w-full flex items-center justify-center">
                                  {reward.rarity === "common" && (
                                    <Image
                                      src="/chess-pawn-white.png"
                                      alt="Common Chess Piece"
                                      width={32}
                                      height={32}
                                    />
                                  )}
                                  {reward.rarity === "rare" && (
                                    <Image src="/chess-pawn-blue.png" alt="Rare Chess Piece" width={32} height={32} />
                                  )}
                                  {reward.rarity === "epic" && (
                                    <Image src="/chess-pawn-purple.png" alt="Epic Chess Piece" width={32} height={32} />
                                  )}
                                  {reward.rarity === "legendary" && (
                                    <Image
                                      src="/chess-pawn-yellow.png"
                                      alt="Legendary Chess Piece"
                                      width={32}
                                      height={32}
                                    />
                                  )}
                                </div>
                              )}
                              {reward.type === "xp-boost" && (
                                <div className="h-full w-full rounded-full bg-green-500/20 flex items-center justify-center">
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
                                    className="text-green-500"
                                  >
                                    <path d="M2 20h.01"></path>
                                    <path d="M7 20v-4"></path>
                                    <path d="M12 20v-8"></path>
                                    <path d="M17 20V8"></path>
                                    <path d="M22 4v16"></path>
                                  </svg>
                                </div>
                              )}
                            </div>

                            <div className="text-center">
                              <p className="text-xs font-medium text-white">
                                {reward.type === "gold" && `${reward.amount} Gold`}
                                {reward.type === "emote" && `${reward.name}`}
                                {reward.type === "chess-piece" &&
                                  `${reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}`}
                                {reward.type === "xp-boost" && `${reward.amount} XP`}
                              </p>
                            </div>
                            {/* Empty div to maintain spacing */}
                            <div className="text-center mt-1 h-5"></div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Premium Rewards Row - Connected container */}
                <div>
                  {/* Connected dark container for rewards with badge inside */}
                  <div className="bg-background-800 rounded-lg border border-gray-700/50 p-4">
                    <div className="mb-3">
                      <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-500">
                        Premium
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {visibleTiers.map((tierData) => {
                        const reward = tierData.premiumReward
                        const statusClass = getRewardStatusClass(reward, tierData.tier)
                        const isPremiumLocked = !isPremium
                        // For premium rewards:
                        const isClaimed = reward.claimed && isPremium
                        const isClaimable = !reward.claimed && tierData.tier <= currentTier && isPremium
                        const isLocked = tierData.tier > currentTier || !isPremium

                        return (
                          <div
                            key={`premium-${tierData.tier}`}
                            className={`relative flex flex-col items-center ${statusClass} ${isPremiumLocked ? "opacity-50" : ""}`}
                          >
                            {/* Status indicator in the tier badge */}
                            <div className="text-center mb-1">
                              {isClaimed ? (
                                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
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
                                  >
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </Badge>
                              ) : isClaimable ? (
                                <Badge
                                  variant="outline"
                                  className="bg-everchess-yellow/20 text-everchess-yellow border-everchess-yellow"
                                >
                                  Claim
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-background-900 text-gray-400 border-gray-700">
                                  🔒
                                </Badge>
                              )}
                            </div>

                            <div className="h-12 w-12 mb-1">
                              {reward.type === "gold" && (
                                <div className="h-full w-full rounded-full bg-everchess-yellow/20 flex items-center justify-center">
                                  <Clock className="h-7 w-7 text-everchess-yellow" />
                                </div>
                              )}
                              {reward.type === "emote" && (
                                <div className="h-full w-full rounded-full bg-everchess-cyan/20 flex items-center justify-center">
                                  <Smile className="h-7 w-7 text-everchess-cyan" />
                                </div>
                              )}
                              {reward.type === "chess-piece" && (
                                <div className="h-full w-full flex items-center justify-center">
                                  {reward.rarity === "common" && (
                                    <Image
                                      src="/chess-pawn-white.png"
                                      alt="Common Chess Piece"
                                      width={32}
                                      height={32}
                                    />
                                  )}
                                  {reward.rarity === "rare" && (
                                    <Image src="/chess-pawn-blue.png" alt="Rare Chess Piece" width={32} height={32} />
                                  )}
                                  {reward.rarity === "epic" && (
                                    <Image src="/chess-pawn-purple.png" alt="Epic Chess Piece" width={32} height={32} />
                                  )}
                                  {reward.rarity === "legendary" && (
                                    <Image
                                      src="/chess-pawn-yellow.png"
                                      alt="Legendary Chess Piece"
                                      width={32}
                                      height={32}
                                    />
                                  )}
                                </div>
                              )}
                              {reward.type === "xp-boost" && (
                                <div className="h-full w-full rounded-full bg-green-500/20 flex items-center justify-center">
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
                                    className="text-green-500"
                                  >
                                    <path d="M2 20h.01"></path>
                                    <path d="M7 20v-4"></path>
                                    <path d="M12 20v-8"></path>
                                    <path d="M17 20V8"></path>
                                    <path d="M22 4v16"></path>
                                  </svg>
                                </div>
                              )}
                            </div>

                            <div className="text-center">
                              <p className="text-xs font-medium text-white">
                                {reward.type === "gold" && `${reward.amount} Gold`}
                                {reward.type === "emote" && `${reward.name}`}
                                {reward.type === "chess-piece" &&
                                  `${reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}`}
                                {reward.type === "xp-boost" && `${reward.amount} XP`}
                              </p>
                            </div>
                            {/* Empty div to maintain spacing */}
                            <div className="text-center mt-1 h-5"></div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Arrow */}
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-background-800 border-gray-700 text-white hover:bg-accent hover:text-white"
              onClick={() => navigateTiers("next")}
              disabled={visibleTierRange.end >= allTiers.length || isScrolling}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <div className="px-6 pb-4 mt-2">
          <Button
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
            onClick={handleClaimAllRewards}
          >
            Claim All Rewards
          </Button>
        </div>
      </Card>

      {/* XP Missions and Market Containers side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* XP Missions Container - More compact */}
        <Card className="w-full bg-background-700 text-white flex flex-col border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-everchess-yellow" />
              Missions
            </CardTitle>
            <p className="text-muted-foreground text-sm">Complete missions to earn XP</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-2">
            <Tabs defaultValue="daily" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 bg-background-900">
                <TabsTrigger value="daily" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  Weekly
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 flex flex-col relative">
                <div className="relative flex-1 flex flex-col">
                  <TabsContent value="daily" className="flex-1 flex flex-col data-[state=inactive]:hidden">
                    <div className="flex-1 flex flex-col justify-between pt-4 pb-4">
                      {!isLoading ? (
                        <>
                          <div className="mb-4">
                            <MissionItem
                              missions={winGamesMissions}
                              icon={<Gamepad2 className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={0}
                            />
                          </div>
                          <div className="mb-4">
                            <MissionItem
                              missions={playGamesMissions}
                              icon={<Gamepad2 className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={1}
                            />
                          </div>
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
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse space-y-3 mb-4 last:mb-0">
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
                                    {[0, 1, 2].map((j) => (
                                      <div
                                        key={j}
                                        className="h-3 w-3 bg-background-600 rounded-sm transform rotate-45"
                                      ></div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="h-2 w-full bg-background-600 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="weekly" className="flex-1 flex flex-col data-[state=inactive]:hidden">
                    <div className="flex-1 flex flex-col justify-between pt-4 pb-4">
                      {!isLoading ? (
                        <>
                          <div className="mb-4">
                            <MissionItem
                              missions={weeklyWinGamesMissions}
                              icon={<Gamepad2 className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={0}
                            />
                          </div>
                          <div className="mb-4">
                            <MissionItem
                              missions={weeklyPlayGamesMissions}
                              icon={<Gamepad2 className="h-6 w-6 text-everchess-yellow" />}
                              initialStep={0}
                            />
                          </div>
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
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse space-y-3 mb-4 last:mb-0">
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
                                    {[0, 1, 2].map((j) => (
                                      <div
                                        key={j}
                                        className="h-3 w-3 bg-background-600 rounded-sm transform rotate-45"
                                      ></div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="h-2 w-full bg-background-600 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </CardContent>
          <div className="px-4 pb-4 mt-auto">
            <Button
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
              onClick={handleClaimXp}
            >
              Claim XP
            </Button>
          </div>
        </Card>

        {/* Market Container - More compact with stacked options */}
        <Card className="w-full bg-background-700 text-white flex flex-col border-gray-700/50 hover:border-everchess-cyan/30 transition-all duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
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
                <path d="M2 8H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              Market
            </CardTitle>
            <p className="text-muted-foreground text-sm">Upgrade or browse the market</p>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-2">
            {/* Stacked market options (like mobile) */}
            <div className="flex flex-col gap-4 h-full">
              <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 rounded-lg p-4 border border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all duration-300 flex flex-col items-center text-center">
                <Star className="h-10 w-10 text-everchess-yellow mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Premium Battlepass</h3>
                <p className="text-muted-foreground mb-4 text-sm">Unlock premium rewards and exclusive content</p>
                <Button
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                  onClick={() => setIsPremium(true)}
                >
                  Upgrade Now
                </Button>
              </div>

              <div className="bg-gradient-to-r from-everchess-cyan/20 to-blue-500/20 rounded-lg p-4 border border-everchess-cyan/30 hover:border-everchess-cyan/50 hover:shadow-[0_0_15px_rgba(0,182,255,0.3)] transition-all duration-300 flex flex-col items-center text-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-everchess-cyan mb-3"
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
                <h3 className="text-lg font-bold text-white mb-1">Full Market</h3>
                <p className="text-muted-foreground mb-4 text-sm">Browse all available items, chess sets, and more</p>
                <Link href="/market" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-everchess-cyan to-blue-500 text-white hover:shadow-[0_0_15px_rgba(0,182,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300">
                    View Market
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Animation */}
      <BattlepassRewardAnimation
        isVisible={showRewardAnimation}
        rewardType={rewardType}
        rewardTier={
          showMultipleRewards && rewardsToShow.length > 0 ? rewardsToShow[currentRewardIndex].tier : currentTier + 1
        }
        onComplete={handleRewardAnimationComplete}
      />

      {/* XP Claim Animation */}
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
            // Show level up animation immediately after XP claim
            setShowLevelUpAnimation(true)
          }
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
