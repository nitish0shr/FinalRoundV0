"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { PlusCircle, Briefcase, TrendingUp, Target, Sparkles, Trophy } from "lucide-react"
import Link from "next/link"
import { AnimatedCounter, SuccessFeedCompact, ConfettiSuccessButton } from "@/components/animated"
import { TiltCard3D } from "@/components/animated"

interface Job {
  id: string
  company: string
  role: string
  level: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Mock stats - replace with real data
  const stats = {
    totalJobs: 3,
    upcomingSessions: 2,
    skillGapsIdentified: 5,
    successRate: 0 // Will update after first offer
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-violet-900/10">
      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                Welcome back,{" "}
                <span className="text-gradient-violet">
                  {session?.user?.name || "Candidate"}
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                Your interview prep journey continues 🚀
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/jobs/new">
                <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg hover:shadow-xl transition-all h-12 px-6">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Job Application
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards with Animations */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Jobs"
              value={stats.totalJobs}
              subtitle="Applications tracked"
              icon={<Briefcase className="h-6 w-6" />}
              gradient="from-violet-500 to-purple-500"
              delay={0.1}
            />
            
            <StatCard
              title="Upcoming Sessions"
              value={stats.upcomingSessions}
              subtitle="With experts"
              icon={<Target className="h-6 w-6" />}
              gradient="from-blue-500 to-cyan-500"
              delay={0.2}
            />
            
            <StatCard
              title="Skill Gaps"
              value={stats.skillGapsIdentified}
              subtitle="To work on"
              icon={<TrendingUp className="h-6 w-6" />}
              gradient="from-orange-500 to-yellow-500"
              delay={0.3}
            />
            
            <StatCard
              title="Success Rate"
              value={stats.successRate}
              suffix="%"
              subtitle="Offers received"
              icon={<Trophy className="h-6 w-6" />}
              gradient="from-green-500 to-emerald-500"
              delay={0.4}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Jobs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Your Job Applications</CardTitle>
                        <CardDescription className="text-base">
                          Jobs you're preparing for with AI-powered insights
                        </CardDescription>
                      </div>
                      <Sparkles className="h-6 w-6 text-violet-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="py-8 text-center text-muted-foreground">
                        Loading your jobs...
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className="py-12 text-center">
                        <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No jobs yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Add your first job to start analyzing skill gaps and preparing for interviews
                        </p>
                        <Link href="/jobs/new">
                          <Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Your First Job
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {jobs.map((job, idx) => (
                          <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + idx * 0.1 }}
                            className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all duration-300"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Briefcase className="h-7 w-7 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg group-hover:text-violet-400 transition-colors">
                                  {job.role}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {job.company} • {job.level}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                              <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10">
                                View Details
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Got the Offer Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl">
                  <CardContent className="py-8">
                    <div className="text-center space-y-4">
                      <Trophy className="mx-auto h-12 w-12 text-yellow-400" />
                      <h3 className="text-2xl font-bold">Landed an offer?</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Celebrate your success and help others see what's possible!
                      </p>
                      <ConfettiSuccessButton
                        onSuccess={() => {
                          console.log("User reported success!")
                        }}
                        className="mx-auto"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Success Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardContent className="pt-6">
                    <SuccessFeedCompact />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-white/10 hover:bg-white/10"
                      disabled
                    >
                      <Sparkles className="mr-2 h-4 w-4 text-violet-400" />
                      Start AI Mock Interview
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-white/10 hover:bg-white/10"
                      disabled
                    >
                      <Target className="mr-2 h-4 w-4 text-blue-400" />
                      Browse Experts
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-white/10 hover:bg-white/10"
                      disabled
                    >
                      <TrendingUp className="mr-2 h-4 w-4 text-green-400" />
                      View Progress Report
                    </Button>
                    <p className="text-xs text-center text-muted-foreground pt-2">
                      Coming soon
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  suffix = "",
  subtitle,
  icon,
  gradient,
  delay = 0
}: {
  title: string
  value: number
  suffix?: string
  subtitle: string
  icon: React.ReactNode
  gradient: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <TiltCard3D tiltMaxAngleX={5} tiltMaxAngleY={5}>
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-white/20 transition-all h-full">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                <div className="text-white">{icon}</div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <AnimatedCounter
                value={value}
                prefix=""
                suffix={suffix}
                duration={2}
                size="md"
                showIcon={false}
                className="mb-1"
              />
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </CardContent>
        </Card>
      </TiltCard3D>
    </motion.div>
  )
}
