"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles, Users, Video, TrendingUp, Shield, Zap } from "lucide-react"
import { AnimatedBackground, FloatingParticles, SuccessFeedTicker, TiltCard3D } from "@/components/animated"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Hero Section with Animated Background */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-[90vh] flex items-center">
        <AnimatedBackground />
        <FloatingParticles count={30} />
        
        <div className="container relative z-10 px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Success Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl"
            >
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium">Premium Interview Coaching Platform</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <motion.span
                className="block mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Master Your
              </motion.span>
              <motion.span
                className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Final Round
              </motion.span>
            </h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              The <span className="text-violet-400 font-semibold">premium marketplace</span> for elite interview coaching.
              <br />
              Practice with experts from{" "}
              <span className="text-gradient-gold font-semibold">FAANG & top companies</span>,
              get AI-powered insights.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/experts">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  Find Your Expert
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-10 text-lg border-white/10 hover:bg-white/5 bg-white/5 backdrop-blur-xl"
                >
                  <Sparkles className="mr-2 h-5 w-5 text-violet-400" />
                  Start Free Trial
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground pt-8"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Money-back guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Verified experts only</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Success Feed Ticker */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-16 max-w-2xl mx-auto"
          >
            <SuccessFeedTicker />
          </motion.div>
        </div>
      </section>

      {/* Features Grid with 3D Cards */}
      <section className="py-32 relative bg-gradient-to-b from-background to-background/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />
        
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="text-gradient-violet">FinalRound</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The most advanced interview preparation platform on the planet
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Users className="h-10 w-10" />}
              title="Elite Experts"
              description="Book sessions with verified interviewers from FAANG and unicorn startups. Real experience, real results."
              gradient="from-violet-500 to-purple-500"
              delay={0.1}
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10" />}
              title="AI-Powered Insights"
              description="Get instant, AI-powered feedback on your resume and interview performance with actionable improvements."
              gradient="from-fuchsia-500 to-pink-500"
              delay={0.2}
            />
            <FeatureCard
              icon={<Video className="h-10 w-10" />}
              title="Premium Video Sessions"
              description="High-fidelity video rooms with shared whiteboard, real-time coding, and collaborative tools."
              gradient="from-blue-500 to-cyan-500"
              delay={0.3}
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10" />}
              title="Money-Back Guarantee"
              description="Not satisfied? Get 100% refund on your first session. We're that confident in our experts."
              gradient="from-green-500 to-emerald-500"
              delay={0.4}
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10" />}
              title="Track Your Progress"
              description="AI-powered roadmaps track your improvement across sessions with detailed analytics."
              gradient="from-orange-500 to-yellow-500"
              delay={0.5}
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10" />}
              title="Get Hired Faster"
              description="Accelerate your job search with targeted practice and personalized feedback from industry experts."
              gradient="from-purple-500 to-indigo-500"
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 bg-white/5 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-violet-500 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-fuchsia-500 rounded-full filter blur-[120px]" />
        </div>
        
        <div className="container px-4 mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-6xl font-bold">
              Start Your <span className="text-gradient-gold">Success Story</span> Today
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From software engineers to product managers, prepare to land offers at the world's best companies
            </p>
            <div className="pt-8">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white h-14 px-10 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  Get Started Free
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  gradient,
  delay = 0
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <TiltCard3D>
        <div className="group p-8 h-full rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/20">
          <div className={`mb-6 p-4 bg-gradient-to-br ${gradient} rounded-xl w-fit group-hover:scale-110 transition-transform duration-300`}>
            <div className="text-white">{icon}</div>
          </div>
          <h3 className="text-2xl font-bold mb-3 group-hover:text-violet-400 transition-colors">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </TiltCard3D>
    </motion.div>
  )
}
