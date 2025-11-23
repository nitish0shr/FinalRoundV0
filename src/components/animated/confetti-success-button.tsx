"use client"

import { useState } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, Sparkles } from "lucide-react"

interface ConfettiSuccessButtonProps {
  onSuccess?: () => void
  label?: string
  disabled?: boolean
  className?: string
}

export function ConfettiSuccessButton({
  onSuccess,
  label = "Got the Offer! 🎉",
  disabled = false,
  className = ""
}: ConfettiSuccessButtonProps) {
  const [isExploding, setIsExploding] = useState(false)
  const [hasExploded, setHasExploded] = useState(false)

  const triggerConfetti = () => {
    // Success sound (you can add audio file later)
    // const audio = new Audio('/sounds/success.mp3')
    // audio.play()

    setIsExploding(true)
    setHasExploded(true)

    // Center explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    // Left and right side explosions
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      })
    }, 200)

    // Continuous confetti rain for 3 seconds
    const duration = 3000
    const animationEnd = Date.now() + duration
    const colors = ["#a78bfa", "#e879f9", "#10b981", "#fbbf24"]

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame)
      }
    }
    frame()

    setTimeout(() => {
      setIsExploding(false)
      onSuccess?.()
    }, 1000)
  }

  return (
    <motion.div
      animate={isExploding ? {
        scale: [1, 1.2, 1.1, 1.15, 1],
        rotate: [0, -5, 5, -3, 0]
      } : {}}
      transition={{ duration: 0.6 }}
    >
      <Button
        onClick={triggerConfetti}
        disabled={disabled || hasExploded}
        className={`
          relative overflow-hidden
          ${hasExploded
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
          }
          text-white font-semibold
          shadow-lg hover:shadow-xl
          transition-all duration-300
          ${className}
        `}
        size="lg"
      >
        {hasExploded ? (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Offer Reported! 🎊
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            {label}
          </>
        )}
        
        {/* Shimmer effect */}
        {!hasExploded && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "linear"
            }}
          />
        )}
      </Button>
    </motion.div>
  )
}
