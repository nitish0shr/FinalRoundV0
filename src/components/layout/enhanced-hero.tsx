"use client"

import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles, Play } from "lucide-react"
import { AnimatedBackground, FloatingParticles, SuccessFeedTicker } from "@/components/animated"
import { useState, useRef } from "react"

export function EnhancedHero() {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <section 
      ref={containerRef}
      className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background z-10" />
        {videoPlaying ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
            poster="/hero-poster.jpg"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full">
            <AnimatedBackground />
          </div>
        )}
      </div>

      <FloatingParticles count={30} className="z-10" />
      
      <motion.div 
        className="container relative z-20 px-4 mx-auto"
        style={{ opacity, scale, y }}
      >
        <div className="text-center space-y-8 max-w-6xl mx-auto">
          {/* Success Badge with Animation */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-4 w-4 text-green-400" />
            </motion.div>
            <span className="text-sm font-medium">
              <motion.span
                key="success-rate"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                96% Success Rate
              </motion.span>
              {" • "}
              <motion.span
                key="offers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                10,000+ Offers Secured
              </motion.span>
            </span>
          </motion.div>

          {/* Main Headline with Gradient Animation */}
          <div className="space-y-4">
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span
                className="block mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Master Your
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                  textShadow: "0 0 80px rgba(167, 139, 250, 0.5)"
                }}
              >
                Final Round
              </motion.span>
            </motion.h1>
          </div>

          {/* Subheadline with Staggered Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-2"
          >
            <p className="text-xl md:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              The <span className="text-violet-400 font-semibold">premium marketplace</span> for elite interview coaching.
            </p>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Practice with experts from{" "}
              <motion.span 
                className="text-gradient-gold font-semibold inline-block"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                FAANG & top companies
              </motion.span>
              , get AI-powered insights.
            </p>
          </motion.div>
          {/* CTA Buttons with Enhanced Animations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/experts">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white h-16 px-12 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 overflow-hidden"
              >
                {/* Animated background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{
                    scale: [1, 1.5, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <span className="relative z-10 flex items-center">
                  Find Your Expert
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
            
            <Link href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="h-16 px-12 text-lg border-2 border-white/20 hover:bg-white/10 bg-white/5 backdrop-blur-xl hover:border-violet-400/50 transition-all duration-300"
              >
                <Sparkles className="mr-2 h-5 w-5 text-violet-400" />
                Start Free Trial
              </Button>
            </Link>
          </motion.div>

          {/* Play Demo Button */}
          <motion.button
            onClick={() => setVideoPlaying(!videoPlaying)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all"
          >
            <div className="p-2 bg-violet-500 rounded-full">
              <Play className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-sm font-medium">{videoPlaying ? 'Pause' : 'Watch'} Demo</span>
          </motion.button>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground pt-8"
          >
            {[
              { icon: CheckCircle2, text: "Money-back guarantee" },
              { icon: CheckCircle2, text: "Verified experts only" },
              { icon: CheckCircle2, text: "Cancel anytime" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + idx * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <item.icon className="h-4 w-4 text-green-400" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Success Feed Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <SuccessFeedTicker />
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {[
              { value: "10K+", label: "Success Stories" },
              { value: "96%", label: "Success Rate" },
              { value: "500+", label: "Elite Experts" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                whileHover={{ scale: 1.1 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 + idx * 0.1, type: "spring" }}
              >
                <motion.p 
                  className="text-4xl md:text-5xl font-bold text-gradient-violet"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-8 h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-white/50 rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
