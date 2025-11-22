"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Sparkles, Users, Video } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-background to-background" />
        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              Master Your <br />
              <span className="text-violet-400">Final Round</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The premium marketplace for elite interview coaching.
              Practice with experts from top companies and get AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/experts">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-white h-12 px-8 text-lg">
                  Find an Expert <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg border-white/10 hover:bg-white/5">
                  Join as Candidate
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-violet-400" />}
              title="Elite Experts"
              description="Book sessions with verified interviewers from FAANG and top startups."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-fuchsia-400" />}
              title="AI Insights"
              description="Get instant, AI-powered feedback on your resume and interview performance."
            />
            <FeatureCard
              icon={<Video className="h-10 w-10 text-blue-400" />}
              title="Premium Video"
              description="High-fidelity video room with shared whiteboard and coding tools."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 transition-colors"
    >
      <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  )
}
