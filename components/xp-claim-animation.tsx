"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface XpClaimAnimationProps {
  isVisible: boolean
  totalXp: number
  onComplete: () => void
}

export function XpClaimAnimation({ isVisible, totalXp, onComplete }: XpClaimAnimationProps) {
  const [show, setShow] = useState(isVisible)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setShow(isVisible)

    if (isVisible) {
      // Show confetti after a short delay
      const confettiTimer = setTimeout(() => {
        setShowConfetti(true)
      }, 500)

      // Auto-close after animation completes
      const closeTimer = setTimeout(() => {
        setShow(false)
        onComplete()
      }, 4000)

      return () => {
        clearTimeout(confettiTimer)
        clearTimeout(closeTimer)
      }
    }
  }, [isVisible, onComplete])

  // Generate random confetti pieces
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
    const x = Math.random() * 400 - 200
    const y = Math.random() * -300 - 50
    const scale = Math.random() * 0.6 + 0.4
    const rotation = Math.random() * 360
    const duration = Math.random() * 1 + 1.5
    const delay = Math.random() * 0.5

    return { id: i, x, y, scale, rotation, duration, delay }
  })

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
            className="bg-background-800 border border-everchess-cyan rounded-xl p-8 flex flex-col items-center shadow-[0_0_30px_rgba(0,182,255,0.4)] relative overflow-hidden"
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
                    className="absolute left-1/2 top-1/2 w-3 h-3 rounded-sm"
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

            <motion.div
              className="h-16 w-16 rounded-full bg-everchess-yellow/20 flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <Zap className="h-10 w-10 text-everchess-yellow" />
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              XP Claimed!
            </motion.h2>

            <motion.div
              className="text-everchess-yellow text-4xl font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [1, 1.3, 1] }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              +{totalXp} XP
            </motion.div>

            {/* Profile level update animation - now always rendered */}
            <motion.div
              className="flex items-center gap-2 bg-background-700 px-4 py-2 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }} // Adjusted delay to be after the XP number animation
            >
              <div className="flex items-center gap-1 text-everchess-cyan">
                <ArrowUp className="h-4 w-4" />
                <span className="text-sm font-medium">Profile Updated</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <Button
                onClick={() => {
                  setShow(false)
                  onComplete()
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6"
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
