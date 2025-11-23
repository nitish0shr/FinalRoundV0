"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Building2, Clock, Star, Video, CheckCircle2, Award } from "lucide-react"
import { TiltCard3D, LiquidSuccessRing } from "@/components/animated"
import { useState } from "react"

export interface ExpertData {
  id: string
  name: string
  role: string
  company: string
  yearsExperience: number
  hourlyRate: number
  successRate: number
  totalSessions: number
  avatar: string
  expertise: string[]
  verified: boolean
  introVideoUrl?: string
  isElite?: boolean
}

interface ExpertTradingCardProps {
  expert: ExpertData
  onBook?: (expertId: string) => void
  delay?: number
}

export function ExpertTradingCard({ expert, onBook, delay = 0 }: ExpertTradingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)

  const isElite = expert.successRate >= 96

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="h-full"
    >
      <TiltCard3D
        tiltMaxAngleX={15}
        tiltMaxAngleY={15}
        scale={1.05}
        glareEnable={true}
        glareMaxOpacity={isElite ? 0.3 : 0.15}
        glareColor={isElite ? "#10b981" : "#a78bfa"}
      >
        <Card
          className={`
            relative overflow-hidden h-full
            border-2 transition-all duration-300
            ${isElite
              ? "border-green-500/50 bg-gradient-to-br from-green-500/10 via-white/5 to-emerald-500/10 shadow-2xl shadow-green-500/20"
              : "border-white/10 bg-white/5 hover:border-violet-500/30"
            }
            backdrop-blur-xl
          `}
        >
          {/* Holographic overlay for elite experts */}
          {isElite && (
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: "linear-gradient(45deg, transparent 30%, rgba(16, 185, 129, 0.3) 50%, transparent 70%)",
                backgroundSize: "200% 200%",
                animation: "holographic 3s ease infinite"
              }}
            />
          )}

          {/* Video Preview Background (on hover) */}
          {expert.introVideoUrl && (
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
              <video
                src={expert.introVideoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay={videoPlaying}
                onMouseEnter={() => setVideoPlaying(true)}
                onMouseLeave={() => setVideoPlaying(false)}
              />
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            </div>
          )}

          <CardHeader className="relative z-10">
            <div className="flex items-start gap-4">
              {/* Avatar with Success Ring */}
              <div className="relative flex-shrink-0">
                <LiquidSuccessRing
                  percentage={expert.successRate}
                  size={80}
                  strokeWidth={4}
                  showLabel={false}
                  animated={true}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg shadow-xl">
                    {expert.avatar}
                  </div>
                </div>
                
                {/* Elite Badge */}
                {isElite && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: delay + 0.3, type: "spring" }}
                    className="absolute -top-1 -right-1"
                  >
                    <Award className="h-6 w-6 text-green-400 drop-shadow-lg" fill="currentColor" />
                  </motion.div>
                )}
              </div>

              {/* Header Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold truncate group-hover:text-violet-400 transition-colors">
                      {expert.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {expert.role}
                    </p>
                  </div>
                  
                  {expert.verified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: delay + 0.2 }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-blue-400" fill="currentColor" />
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{expert.company}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    • {expert.yearsExperience}y exp
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 relative z-10">
            {/* Success Rate Badge */}
            <motion.div
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                <span className="font-semibold">{expert.successRate}% success</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{expert.totalSessions} sessions</span>
              </div>
            </motion.div>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2">
              {expert.expertise.map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: delay + 0.1 * idx }}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </div>

            {/* Video Preview Indicator */}
            {expert.introVideoUrl && (
              <motion.div
                className="flex items-center gap-2 text-xs text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <Video className="h-4 w-4 text-violet-400" />
                <span>Hover to preview intro video</span>
              </motion.div>
            )}

            {/* Price and CTA */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold text-gradient-gold">
                    ${expert.hourlyRate}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">/hour</span>
                </div>
                {isElite && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30">
                    Elite Expert
                  </Badge>
                )}
              </div>

              <Button
                onClick={() => onBook?.(expert.id)}
                disabled={!onBook}
                className={`
                  w-full font-semibold
                  ${isElite
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
                  }
                  text-white shadow-lg hover:shadow-xl transition-all duration-300
                `}
                size="lg"
              >
                {onBook ? "Book Session" : "Coming Soon"}
              </Button>
            </div>
          </CardContent>

          {/* Elite Corner Ribbon */}
          {isElite && (
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
              <div className="absolute top-3 -right-10 rotate-45 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs font-bold py-1 px-10 shadow-lg">
                ELITE
              </div>
            </div>
          )}
        </Card>
      </TiltCard3D>
    </motion.div>
  )
}
