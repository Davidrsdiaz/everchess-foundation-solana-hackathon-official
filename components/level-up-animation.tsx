"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, Sparkles, Zap, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface LevelUpAnimationProps {
  isVisible: boolean
  onComplete: () => void
  oldLevel: number
  newLevel: number
  rewards?: {
    type: "gold" | "xp-boost" | "chess-piece" | "emote"
    name?: string
    amount?: number
    rarity?: "common" | "rare" | "epic" | "legendary"
  }[]
}

export function LevelUpAnimation({
  isVisible,
  onComplete,
  oldLevel = 5,
  newLevel = 6,
  rewards = [
    { type: "gold", amount: 100 },
    { type: "xp-boost", amount: 5 },
  ],
}: LevelUpAnimationProps) {
  const [show, setShow] = useState(isVisible)
  const [animateLevel, setAnimateLevel] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(oldLevel)
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    setShow(isVisible)
    setCurrentLevel(oldLevel)
    setAnimateLevel(false)
    setShowRewards(false)

    if (isVisible) {
      // Animate level change
      const levelTimer = setTimeout(() => {
        setAnimateLevel(true)
        // Increment level with a delay
        const incrementTimer = setTimeout(() => {
          setCurrentLevel(newLevel)
        }, 800)
        return () => clearTimeout(incrementTimer)
      }, 600)

      // Show rewards after level animation
      const rewardsTimer = setTimeout(() => {
        setShowRewards(true)
      }, 1800)

      // Auto-close after animation completes
      const closeTimer = setTimeout(() => {
        setShow(false)
        onComplete()
      }, 5000)

      return () => {
        clearTimeout(levelTimer)
        clearTimeout(rewardsTimer)
        clearTimeout(closeTimer)
      }
    }
  }, [isVisible, onComplete, oldLevel, newLevel])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background-800 border border-everchess-cyan rounded-lg p-4 flex flex-col items-center shadow-[0_0_20px_rgba(0,182,255,0.4)] relative overflow-hidden max-w-[280px] w-full mx-auto"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
          >
            {/* Level Up Header */}
            <motion.div
              className="flex items-center gap-2 mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="h-5 w-5 text-everchess-yellow" />
              <h2 className="text-xl font-bold text-white">Level Up!</h2>
            </motion.div>

            {/* Level Circle with Animation */}
            <div className="relative mb-4">
              {/* Level circle */}
              <motion.div
                className="relative h-20 w-20 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                animate={{
                  scale: animateLevel ? [1, 1.15, 1] : 1,
                }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: animateLevel ? [0, 0.6, 0] : 0,
                    scale: animateLevel ? [1, 1.3, 1] : 1,
                  }}
                  transition={{ duration: 0.8 }}
                  style={{
                    background: "radial-gradient(circle, rgba(252,223,58,0.4) 0%, rgba(252,223,58,0) 70%)",
                  }}
                />

                <motion.span
                  className="text-4xl font-bold text-white"
                  key={currentLevel}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentLevel}
                </motion.span>
              </motion.div>
            </div>

            {/* Level progress indicator */}
            <motion.div
              className="w-full mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Level {oldLevel}</span>
                <span>Level {newLevel}</span>
              </div>
              <div className="h-1.5 w-full bg-background-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-everchess-cyan"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </div>
            </motion.div>

            {/* Rewards Section - Simplified */}
            <motion.div
              className="w-full mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: showRewards ? 1 : 0,
                y: showRewards ? 0 : 10,
              }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-center gap-3">
                {rewards.slice(0, 2).map((reward, index) => (
                  <motion.div
                    key={`reward-${index}`}
                    className="bg-background-700 rounded-md p-2 flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: showRewards ? 1 : 0,
                      scale: showRewards ? 1 : 0.9,
                    }}
                    transition={{ delay: 0.2 + index * 0.2 }}
                  >
                    <div className="h-8 w-8 rounded-full flex items-center justify-center mb-1">
                      {reward.type === "gold" && (
                        <div className="h-full w-full rounded-full bg-everchess-yellow/20 flex items-center justify-center">
                          <Trophy className="h-4 w-4 text-everchess-yellow" />
                        </div>
                      )}
                      {reward.type === "xp-boost" && (
                        <div className="h-full w-full rounded-full bg-green-500/20 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                      {reward.type === "chess-piece" && (
                        <div className="h-full w-full flex items-center justify-center">
                          {reward.rarity === "common" && (
                            <Image src="/chess-pawn-white.png" alt="Common Chess Piece" width={16} height={16} />
                          )}
                          {reward.rarity === "rare" && (
                            <Image src="/chess-pawn-blue.png" alt="Rare Chess Piece" width={16} height={16} />
                          )}
                          {reward.rarity === "epic" && (
                            <Image src="/chess-pawn-purple.png" alt="Epic Chess Piece" width={16} height={16} />
                          )}
                          {reward.rarity === "legendary" && (
                            <Image src="/chess-pawn-yellow.png" alt="Legendary Chess Piece" width={16} height={16} />
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white text-center">
                        {reward.type === "gold" && `${reward.amount} Gold`}
                        {reward.type === "xp-boost" && `${reward.amount}% XP`}
                        {reward.type === "chess-piece" && `${reward.rarity}`}
                        {reward.type === "emote" && (reward.name || "Emote")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* New ability unlocked - Updated text */}
            <motion.div
              className="flex items-center gap-1 bg-background-700 px-3 py-1.5 rounded-md mb-4 w-full justify-center"
              initial={{ opacity: 0, y: 5 }}
              animate={{
                opacity: showRewards ? 1 : 0,
                y: showRewards ? 0 : 5,
              }}
              transition={{ delay: 0.6 }}
            >
              <ChevronUp className="h-3 w-3 text-everchess-cyan" />
              <span className="text-xs font-medium text-everchess-cyan">Battlepass Rewards Unlocked!</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full"
            >
              <Button
                onClick={() => {
                  setShow(false)
                  onComplete()
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-[0_0_10px_rgba(220,38,38,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-sm py-1.5"
              >
                Continue
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
