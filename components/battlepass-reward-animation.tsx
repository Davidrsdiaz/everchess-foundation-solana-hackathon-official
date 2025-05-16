"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, Star, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface BattlepassRewardAnimationProps {
  isVisible: boolean
  onComplete: () => void
  rewardType?: "chess-set" | "app-coin" | "emote"
  rewardTier?: number
}

export function BattlepassRewardAnimation({
  isVisible,
  onComplete,
  rewardType = "chess-set",
  rewardTier = 24,
}: BattlepassRewardAnimationProps) {
  const [show, setShow] = useState(isVisible)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showReward, setShowReward] = useState(false)

  useEffect(() => {
    setShow(isVisible)

    if (isVisible) {
      // Show confetti after a short delay
      const confettiTimer = setTimeout(() => {
        setShowConfetti(true)
      }, 500)

      // Show reward after confetti
      const rewardTimer = setTimeout(() => {
        setShowReward(true)
      }, 1000)

      // Auto-close after animation completes
      const closeTimer = setTimeout(() => {
        setShow(false)
        onComplete()
      }, 6000)

      return () => {
        clearTimeout(confettiTimer)
        clearTimeout(rewardTimer)
        clearTimeout(closeTimer)
      }
    }
  }, [isVisible, onComplete])

  // Generate random confetti pieces
  const confettiPieces = Array.from({ length: 40 }).map((_, i) => {
    const x = Math.random() * 300 - 150
    const y = Math.random() * -300 - 50
    const scale = Math.random() * 0.5 + 0.3
    const rotation = Math.random() * 360
    const duration = Math.random() * 1.5 + 1.5
    const delay = Math.random() * 0.5

    return { id: i, x, y, scale, rotation, duration, delay }
  })

  // Determine reward image and text based on rewardType
  const getRewardImage = () => {
    switch (rewardType) {
      case "chess-set":
        return "/chess-pawn-red.png"
      case "app-coin":
        return "/solana-sol-logo.png"
      case "emote":
      default:
        return "/chess-pawn-yellow.png"
    }
  }

  const getRewardName = () => {
    switch (rewardType) {
      case "chess-set":
        return "Crimson Knight Chess Set"
      case "app-coin":
        return "500 App Coins"
      case "emote":
      default:
        return "Victory Emote Pack"
    }
  }

  const getRewardRarity = () => {
    switch (rewardType) {
      case "chess-set":
        return "Epic"
      case "app-coin":
        return "Rare"
      case "emote":
      default:
        return "Uncommon"
    }
  }

  const getRarityColor = () => {
    switch (rewardType) {
      case "chess-set":
        return "from-red-500 to-red-700"
      case "app-coin":
        return "from-everchess-yellow to-amber-600"
      case "emote":
      default:
        return "from-blue-500 to-cyan-500"
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background-800 border border-everchess-cyan rounded-xl p-3 flex flex-col items-center shadow-[0_0_20px_rgba(0,182,255,0.4)] relative overflow-hidden max-w-[280px] w-[95%] mx-auto"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
          >
            {/* Confetti animation */}
            {showConfetti && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {confettiPieces.map(({ id, x, y, scale, rotation, duration, delay }) => (
                  <motion.div
                    key={id}
                    className="absolute left-1/2 top-1/2 w-2 h-2 rounded-sm"
                    initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
                    animate={{
                      x,
                      y,
                      scale,
                      rotate: rotation,
                      opacity: [1, 1, 0],
                    }}
                    transition={{
                      duration,
                      delay,
                      ease: ["easeOut", "easeOut", "easeIn"],
                    }}
                    style={{
                      backgroundColor: id % 3 === 0 ? "#fcdf3a" : id % 3 === 1 ? "#00B6FF" : "#dc2626",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Header with battlepass icon */}
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                className="h-8 w-8 rounded-full bg-everchess-yellow/20 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
              >
                <Star className="h-5 w-5 text-everchess-yellow" />
              </motion.div>
              <motion.h2
                className="text-lg font-bold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Battlepass Reward!
              </motion.h2>
            </div>

            <motion.div
              className="text-everchess-cyan text-sm font-medium mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tier {rewardTier} Reward Unlocked
            </motion.div>

            {/* Reward reveal animation */}
            <motion.div
              className="relative w-full h-32 mb-3 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Gift box that disappears */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: showReward ? 0 : 1, scale: showReward ? 1.2 : 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <Gift className="w-20 h-20 text-red-500" strokeWidth={1} />
                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <div className="absolute top-0 left-1/2 w-1 h-1 rounded-full bg-everchess-yellow shadow-[0_0_10px_rgba(252,223,58,0.8)]" />
                    <div className="absolute top-1/2 right-0 w-1 h-1 rounded-full bg-everchess-cyan shadow-[0_0_10px_rgba(0,182,255,0.8)]" />
                    <div className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                    <div className="absolute top-1/2 left-0 w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Revealed reward */}
              <motion.div
                className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b ${getRarityColor()} bg-opacity-10 rounded-lg py-3`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: showReward ? 1 : 0,
                  scale: showReward ? 1 : 0.8,
                  y: showReward ? [20, -5, 0] : 0,
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div
                  className="relative h-16 w-16 mb-2"
                  animate={{
                    rotateY: showReward ? [0, 360, 720, 1080] : 0,
                    scale: showReward ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                >
                  <Image
                    src={getRewardImage() || "/placeholder.svg"}
                    alt="Reward"
                    layout="fill"
                    objectFit="contain"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  />
                </motion.div>
                <motion.h3
                  className="text-base font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: showReward ? 1 : 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {getRewardName()}
                </motion.h3>
                <motion.span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    rewardType === "chess-set"
                      ? "bg-red-500/20 text-red-400"
                      : rewardType === "app-coin"
                        ? "bg-everchess-yellow/20 text-everchess-yellow"
                        : "bg-blue-500/20 text-blue-400"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: showReward ? 1 : 0, y: showReward ? 0 : 10 }}
                  transition={{ delay: 1 }}
                >
                  {getRewardRarity()}
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Battlepass progress update */}
            <motion.div
              className="flex items-center gap-2 bg-background-700 px-3 py-1.5 rounded-lg mb-3 w-full text-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-1 text-everchess-cyan">
                <ChevronUp className="h-3 w-3" />
                <span className="font-medium">Next: Tier {rewardTier + 1}</span>
              </div>
              <div className="ml-auto text-muted-foreground">{rewardTier}/100</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full"
            >
              <Button
                onClick={() => {
                  setShow(false)
                  onComplete()
                }}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-[0_4px_12px_rgba(220,38,38,0.3)] text-sm py-1.5 h-auto"
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
