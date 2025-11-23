"use client"

import { motion } from "framer-motion"
import Tilt from "react-parallax-tilt"
import { ReactNode } from "react"

interface TiltCard3DProps {
  children: ReactNode
  className?: string
  tiltMaxAngleX?: number
  tiltMaxAngleY?: number
  scale?: number
  transitionSpeed?: number
  glareEnable?: boolean
  glareMaxOpacity?: number
  glareColor?: string
  glareBorderRadius?: string
}

export function TiltCard3D({
  children,
  className = "",
  tiltMaxAngleX = 10,
  tiltMaxAngleY = 10,
  scale = 1.05,
  transitionSpeed = 1500,
  glareEnable = true,
  glareMaxOpacity = 0.15,
  glareColor = "#a78bfa",
  glareBorderRadius = "16px"
}: TiltCard3DProps) {
  return (
    <Tilt
      tiltMaxAngleX={tiltMaxAngleX}
      tiltMaxAngleY={tiltMaxAngleY}
      scale={scale}
      transitionSpeed={transitionSpeed}
      glareEnable={glareEnable}
      glareMaxOpacity={glareMaxOpacity}
      glareColor={glareColor}
      glareBorderRadius={glareBorderRadius}
      className={`transform-gpu ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {children}
      </motion.div>
    </Tilt>
  )
}
