"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Search, Mail, Filter, SlidersHorizontal } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { ExpertTradingCard, type ExpertData } from "@/components/experts/expert-trading-card"
import { ExpertCardSkeleton } from "@/components/animated"
import { AnimatedBackground } from "@/components/animated"

// Mock expert data - replace with real API call
const mockExperts: ExpertData[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Software Engineer",
    company: "Google",
    yearsExperience: 8,
    hourlyRate: 250,
    successRate: 96,
    totalSessions: 47,
    avatar: "SC",
    expertise: ["System Design", "Algorithms", "Behavioral"],
    verified: true,
    isElite: true,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    role: "Staff Engineer",
    company: "Meta",
    yearsExperience: 10,
    hourlyRate: 300,
    successRate: 98,
    totalSessions: 89,
    avatar: "MR",
    expertise: ["Distributed Systems", "Leadership", "Architecture"],
    verified: true,
    isElite: true,
  },
  {
    id: "3",
    name: "Priya Patel",
    role: "Engineering Manager",
    company: "Amazon",
    yearsExperience: 12,
    hourlyRate: 275,
    successRate: 92,
    totalSessions: 63,
    avatar: "PP",
    expertise: ["Behavioral", "Leadership", "System Design"],
    verified: true,
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Principal Engineer",
    company: "Apple",
    yearsExperience: 15,
    hourlyRate: 400,
    successRate: 97,
    totalSessions: 124,
    avatar: "JW",
    expertise: ["iOS", "Mobile Architecture", "System Design"],
    verified: true,
    isElite: true,
  },
  {
    id: "5",
    name: "Elena Martinez",
    role: "ML Engineer",
    company: "Netflix",
    yearsExperience: 9,
    hourlyRate: 280,
    successRate: 94,
    totalSessions: 56,
    avatar: "EM",
    expertise: ["Machine Learning", "Python", "Data Structures"],
    verified: true,
  },
  {
    id: "6",
    name: "David Kim",
    role: "Staff SWE",
    company: "Stripe",
    yearsExperience: 11,
    hourlyRate: 320,
    successRate: 95,
    totalSessions: 78,
    avatar: "DK",
    expertise: ["Backend", "APIs", "System Design"],
    verified: true,
  },
]

export default function ExpertsPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleEarlyAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success("Thanks! We'll notify you when expert booking is live.")
    setEmail("")
    setLoading(false)
  }

  // Filter experts based on search
  const filteredExperts = mockExperts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="min-h-screen relative">
      {/* Hero Section with Background */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <AnimatedBackground className="opacity-50" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-4 max-w-4xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 backdrop-blur-xl"
              >
                <span className="text-sm font-medium">🎯 1,000+ Elite Experts Available</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Meet Your{" "}
                <span className="text-gradient-violet">Perfect</span>
                <br />
                Interview Coach
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground">
                Practice with verified experts from FAANG & top companies.
                <br />
                <span className="text-green-400 font-semibold">94% success rate</span> • Real experience, real results.
              </p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name, company, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 bg-white/5 border-white/10 backdrop-blur-xl text-lg"
                  />
                </div>
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="lg"
                  className="h-14 px-6 border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="container py-8">
        <Card className="border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl">
          <CardContent className="py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="inline-flex px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium border border-violet-500/30">
                🚀 Expert Booking Launches Soon
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Join the waitlist for early access</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're onboarding elite interviewers from FAANG and top tech companies. 
                Be the first to book sessions when we launch.
              </p>
              <form onSubmit={handleEarlyAccess} className="max-w-md mx-auto flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 backdrop-blur-xl"
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {loading ? "Joining..." : "Join Waitlist"}
                </Button>
              </form>
            </motion.div>
          </CardContent>
        </Card>
      </section>

      {/* Expert Grid */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Browse <span className="text-gradient-violet">Elite Experts</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Sort by:</span>
            <Button variant="ghost" size="sm" className="font-semibold text-violet-400">
              Fit Score ↓
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ExpertCardSkeleton key={idx} />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredExperts.map((expert, idx) => (
              <ExpertTradingCard
                key={expert.id}
                expert={expert}
                delay={idx * 0.1}
                onBook={(id) => {
                  router.push(`/booking?expert=${id}`)
                }}
              />
            ))}
          </div>
        )}

        {filteredExperts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-muted-foreground">
              No experts found matching "{searchTerm}"
            </p>
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
              className="mt-4"
            >
              Clear Search
            </Button>
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 border border-violet-500/30 backdrop-blur-xl p-12 text-center"
        >
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold">
              Not sure which expert to choose?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI matching engine analyzes your resume and job description 
              to find your perfect interview coach
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white h-14 px-10 text-lg"
            >
              Get AI Recommendations
            </Button>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500 rounded-full filter blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-fuchsia-500 rounded-full filter blur-[100px]" />
          </div>
        </motion.div>
      </section>
    </div>
  )
}
