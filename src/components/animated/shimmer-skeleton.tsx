"use client"

import { motion } from "framer-motion"

interface ShimmerSkeletonProps {
  className?: string
  variant?: "card" | "text" | "circle" | "button"
  width?: string
  height?: string
  count?: number
}

export function ShimmerSkeleton({
  className = "",
  variant = "card",
  width = "100%",
  height = "auto",
  count = 1
}: ShimmerSkeletonProps) {
  const baseClass = "relative overflow-hidden bg-white/5 rounded-lg"
  
  const variantClasses = {
    card: "h-64",
    text: "h-4 rounded",
    circle: "rounded-full",
    button: "h-10 rounded-lg"
  }

  const Skeleton = () => (
    <div
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
      style={{ width, height: variant === "circle" ? width : height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "200%"]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )

  if (count === 1) {
    return <Skeleton />
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} />
      ))}
    </div>
  )
}

// Expert Card Skeleton
export function ExpertCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4">
      <div className="flex items-start gap-4">
        <ShimmerSkeleton variant="circle" width="64px" height="64px" />
        <div className="flex-1 space-y-2">
          <ShimmerSkeleton variant="text" height="20px" width="60%" />
          <ShimmerSkeleton variant="text" height="16px" width="80%" />
        </div>
      </div>
      
      <ShimmerSkeleton variant="text" height="16px" width="90%" />
      
      <div className="flex gap-2">
        <ShimmerSkeleton variant="button" height="24px" width="80px" />
        <ShimmerSkeleton variant="button" height="24px" width="100px" />
        <ShimmerSkeleton variant="button" height="24px" width="90px" />
      </div>
      
      <div className="pt-4 border-t border-white/10">
        <ShimmerSkeleton variant="text" height="32px" width="40%" />
      </div>
      
      <ShimmerSkeleton variant="button" height="40px" width="100%" />
    </div>
  )
}
