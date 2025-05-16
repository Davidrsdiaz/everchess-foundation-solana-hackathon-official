"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoldCoinIcon } from "@/components/icons/gold-coin-icon"
import Image from "next/image"

export interface PurchaseItem {
  id: number
  name: string
  price: number
  currency: string
  image?: string
  icon?: React.ElementType
  iconColor?: string
  backgroundColor?: string
  rarity?: string
  rarityColor?: string
}

interface PurchaseAnimationProps {
  isVisible: boolean
  item: PurchaseItem | null
  previousGold: number
  currentGold: number
  onClose: () => void
}

export function PurchaseAnimation({ isVisible, item, previousGold, currentGold, onClose }: PurchaseAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible) {
      // Show confetti after a short delay
      const confettiTimer = setTimeout(() => {
        setShowConfetti(true)
      }, 300)

      return () => {
        clearTimeout(confettiTimer)
      }
    } else {
      setShowConfetti(false)
    }
  }, [isVisible])

  if (!item) return null

  // Generate random confetti pieces
  const confettiPieces = Array.from({ length: 60 }).map((_, i) => {
    const x = Math.random() * 500 - 250
    const y = Math.random() * -400 - 50
    const scale = Math.random() * 0.6 + 0.4
    const rotation = Math.random() * 360
    const duration = Math.random() * 1 + 1.5
    const delay = Math.random() * 0.5

    return { id: i, x, y, scale, rotation, duration, delay }
  })

  // Determine icon to display
  const ItemIcon = item.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`${
              item.backgroundColor || "bg-background-800"
            } border border-gray-700 rounded-xl p-8 flex flex-col items-center shadow-lg max-w-md w-full mx-4 relative overflow-hidden`}
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={(e) => e.stopPropagation()}
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
                      backgroundColor:
                        id % 5 === 0
                          ? "#fcdf3a" // Yellow
                          : id % 5 === 1
                            ? "#00B6FF" // Cyan
                            : id % 5 === 2
                              ? "#dc2626" // Red
                              : id % 5 === 3
                                ? "#a855f7" // Purple
                                : "#22c55e", // Green
                    }}
                  />
                ))}
              </div>
            )}

            {/* Success checkmark */}
            <motion.div
              className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <Check className="h-10 w-10 text-green-500" />
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-white mb-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Purchase Successful!
            </motion.h2>

            {/* Item display */}
            <motion.div
              className="flex flex-col items-center my-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div
                className={`w-20 h-20 flex items-center justify-center rounded-lg ${
                  item.backgroundColor || "bg-background-700"
                } mb-2`}
              >
                {item.image ? (
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                ) : ItemIcon ? (
                  <ItemIcon size={48} color={item.iconColor || "#ffffff"} />
                ) : (
                  <ShoppingCart size={48} color="#ffffff" />
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{item.name}</h3>
              {item.rarity && (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full mt-1 ${
                    item.rarityColor || "bg-gray-600"
                  } text-white`}
                >
                  {item.rarity}
                </span>
              )}
            </motion.div>

            {/* Updated gold balance */}
            <motion.div
              className="flex items-center justify-center gap-2 bg-background-700 px-4 py-2 rounded-lg mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-sm text-muted-foreground mr-2">New Balance:</div>
              <div className="flex items-center gap-1 text-everchess-yellow font-bold">
                <GoldCoinIcon size={18} />
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  {currentGold.toLocaleString()}
                </motion.span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              <Button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white px-6">
                Continue
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
