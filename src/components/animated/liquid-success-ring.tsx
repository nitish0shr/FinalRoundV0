"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface LiquidSuccessRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  showLabel?: boolean
  animated?: boolean
  className?: string
}

export function LiquidSuccessRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  animated = true,
  className = ""
}: LiquidSuccessRingProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (displayPercentage / 100) * circumference

  // Determine color based on success rate
  const getColor = (pct: number) => {
    if (pct >= 96) return { primary: "#10b981", secondary: "#34d399", glow: "rgba(16, 185, 129, 0.3)" } // Elite Green
    if (pct >= 86) return { primary: "#10b981", secondary: "#84cc16", glow: "rgba(16, 185, 129, 0.2)" } // Green
    if (pct >= 71) return { primary: "#f59e0b", secondary: "#fbbf24", glow: "rgba(245, 158, 11, 0.2)" } // Orange
    return { primary: "#ef4444", secondary: "#f87171", glow: "rgba(239, 68, 68, 0.2)" } // Red
  }

  const colors = getColor(percentage)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayPercentage(percentage)
    }
  }, [percentage, animated])

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Animated liquid ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#gradient-${percentage})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 2,
            ease: "easeOut",
            delay: 0.2
          }}
          style={{
            filter: percentage >= 96 ? `drop-shadow(0 0 8px ${colors.glow})` : "none"
          }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id={`gradient-${percentage}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>
      </svg>

      {/* Center label */}
      {showLabel && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-2xl font-bold" style={{ color: colors.primary }}>
            {Math.round(displayPercentage)}%
          </span>
          <span className="text-xs text-muted-foreground">success</span>
        </motion.div>
      )}

      {/* Elite badge for 96%+ */}
      {percentage >= 96 && (
        <motion.div
          className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          ⭐ Elite
        </motion.div>
      )}
    </div>
  )
}
