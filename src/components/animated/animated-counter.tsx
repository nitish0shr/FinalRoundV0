"use client"

import { useEffect, useRef } from "react"
import CountUp from "react-countup"
import { motion } from "framer-motion"
import { DollarSign } from "lucide-react"

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  showIcon?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
  onComplete?: () => void
  enableSound?: boolean
  className?: string
}

export function AnimatedCounter({
  value,
  prefix = "$",
  suffix = "",
  decimals = 0,
  duration = 2.5,
  showIcon = true,
  size = "lg",
  color = "text-green-400",
  onComplete,
  enableSound = false,
  className = ""
}: AnimatedCounterProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const sizeClasses = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl",
    xl: "text-7xl"
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  }

  useEffect(() => {
    if (enableSound && value > 0) {
      // Cash register sound (you can add audio file)
      // audioRef.current = new Audio('/sounds/cash-register.mp3')
      // audioRef.current.play()
    }
  }, [value, enableSound])

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {showIcon && (
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 1, ease: "easeInOut" },
            scale: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
          }}
          className={`rounded-full bg-gradient-to-br from-yellow-400 to-green-500 p-2 ${iconSizes[size]}`}
        >
          <DollarSign className={`${iconSizes[size]} text-white`} />
        </motion.div>
      )}

      <div className="flex flex-col">
        <motion.div
          className={`font-bold ${sizeClasses[size]} ${color} tabular-nums`}
          animate={value > 0 ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.3 }}
        >
          <CountUp
            start={0}
            end={value}
            duration={duration}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
            separator=","
            onEnd={onComplete}
          />
        </motion.div>
        
        {suffix && (
          <span className="text-xs text-muted-foreground ml-1">
            {suffix}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// Money Printer specific variant
export function MoneyPrinterCounter({
  amount,
  label = "Total Earnings",
  className = ""
}: {
  amount: number
  label?: string
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <AnimatedCounter
        value={amount}
        prefix="$"
        decimals={2}
        duration={2}
        size="xl"
        color="text-gradient-gold"
        showIcon={true}
        enableSound={true}
      />
      <motion.p
        className="text-xs text-muted-foreground flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Money printer go brrrr 🚀
      </motion.p>
    </div>
  )
}
