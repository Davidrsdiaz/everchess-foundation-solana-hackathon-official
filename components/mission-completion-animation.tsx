"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface MissionCompletionAnimationProps {
  isVisible: boolean
  xpAmount: number
  onComplete: () => void
}

export function MissionCompletionAnimation({ isVisible, xpAmount, onComplete }: MissionCompletionAnimationProps) {
  const [show, setShow] = useState(isVisible)

  useEffect(() => {
    setShow(isVisible)

    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false)
        onComplete()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background-800 border border-everchess-cyan rounded-xl p-8 flex flex-col items-center shadow-[0_0_30px_rgba(0,182,255,0.4)]"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Mission Complete!
            </motion.h2>

            <motion.div
              className="text-everchess-yellow text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [1, 1.2, 1] }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              +{xpAmount} XP
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
