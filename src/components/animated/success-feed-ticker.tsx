"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Trophy, Sparkles } from "lucide-react"

interface SuccessItem {
  id: string
  name: string
  company: string
  role: string
  timestamp: Date
  avatar?: string
}

// Mock data - replace with real data from your API
const mockSuccesses: SuccessItem[] = [
  { id: "1", name: "Sarah Chen", company: "Google", role: "Senior SWE", timestamp: new Date(), avatar: "SC" },
  { id: "2", name: "Michael R.", company: "Meta", role: "Staff Engineer", timestamp: new Date(), avatar: "MR" },
  { id: "3", name: "Priya P.", company: "Amazon", role: "Engineering Manager", timestamp: new Date(), avatar: "PP" },
  { id: "4", name: "James Wilson", company: "Apple", role: "iOS Developer", timestamp: new Date(), avatar: "JW" },
  { id: "5", name: "Elena Martinez", company: "Netflix", role: "ML Engineer", timestamp: new Date(), avatar: "EM" },
]

export function SuccessFeedTicker({ className = "" }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockSuccesses.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused])

  const currentSuccess = mockSuccesses[currentIndex]

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSuccess.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl"
        >
          {/* Trophy icon */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="flex-shrink-0"
          >
            <Trophy className="h-6 w-6 text-yellow-400" />
          </motion.div>

          {/* Avatar */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold">
            {currentSuccess.avatar}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              <span className="font-bold">{currentSuccess.name}</span>
              {" "}just got hired at{" "}
              <span className="font-bold text-green-400">{currentSuccess.company}</span>
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentSuccess.role} • Just now
            </p>
          </div>

          {/* Sparkles */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex justify-center gap-1 mt-2">
        {mockSuccesses.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex
                ? "w-6 bg-green-400"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Compact version for sidebars
export function SuccessFeedCompact({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
        <Trophy className="h-4 w-4 text-yellow-400" />
        Recent Success Stories
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {mockSuccesses.slice(0, 5).map((success, idx) => (
          <motion.div
            key={success.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">
              {success.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{success.name}</p>
              <p className="text-xs text-muted-foreground truncate">{success.company}</p>
            </div>
            <Sparkles className="h-3 w-3 text-yellow-400 flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
