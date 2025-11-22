"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Search, Star, Building2, Clock, DollarSign, CheckCircle2, Mail } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

// Mock expert data for preview
const mockExperts = [
    {
        id: "1",
        name: "Sarah Chen",
        role: "Senior Software Engineer",
        company: "Google",
        yearsExperience: 8,
        hourlyRate: 250,
        successRate: 94,
        totalSessions: 47,
        avatar: "SC",
        expertise: ["System Design", "Algorithms", "Behavioral"],
    },
    {
        id: "2",
        name: "Michael Rodriguez",
        role: "Staff Engineer",
        company: "Meta",
        yearsExperience: 10,
        hourlyRate: 300,
        successRate: 96,
        totalSessions: 89,
        avatar: "MR",
        expertise: ["Distributed Systems", "Leadership", "Architecture"],
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
    },
]

export default function ExpertsPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleEarlyAccess = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error("Please enter your email")
            return
        }
        
        setLoading(true)
        // Simulate submission
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success("Thanks! We'll notify you when expert booking is live.")
        setEmail("")
        setLoading(false)
    }

    return (
        <div className="container py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                {/* Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h1 className="text-5xl font-bold tracking-tight">
                        Meet Our <span className="text-violet-400">Expert</span> Interviewers
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Practice with verified interviewers from top tech companies. Real experience, real results.
                    </p>
                </div>

                {/* Coming Soon Banner */}
                <Card className="border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl">
                    <CardContent className="py-8">
                        <div className="text-center space-y-4">
                            <div className="inline-flex px-4 py-2 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium border border-violet-500/30">
                                Coming Soon
                            </div>
                            <h2 className="text-2xl font-bold">Expert booking launches soon!</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We're currently onboarding elite interviewers from FAANG and top tech companies. 
                                Join the waitlist to get early access.
                            </p>
                            <form onSubmit={handleEarlyAccess} className="max-w-md mx-auto flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/5 border-white/10"
                                />
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-violet-600 hover:bg-violet-700"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    {loading ? "Joining..." : "Join Waitlist"}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>

                {/* Mock Expert Profiles */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Preview: Expert Profiles</h2>
                        <div className="text-sm text-muted-foreground">
                            Showing mock data
                        </div>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {mockExperts.map((expert, idx) => (
                            <ExpertCard key={expert.id} expert={expert} delay={idx * 0.1} />
                        ))}
                    </div>
                </div>

                {/* Features */}
                <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                    <FeatureCard
                        icon={<CheckCircle2 className="h-6 w-6 text-green-400" />}
                        title="Verified Experts"
                        description="All interviewers verified through employment history and expertise validation"
                    />
                    <FeatureCard
                        icon={<Star className="h-6 w-6 text-yellow-400" />}
                        title="Proven Success"
                        description="Track record of helping candidates secure offers at top companies"
                    />
                    <FeatureCard
                        icon={<DollarSign className="h-6 w-6 text-violet-400" />}
                        title="Fair Pricing"
                        description="Transparent hourly rates with money-back guarantee on first session"
                    />
                </div>
            </motion.div>
        </div>
    )
}

function ExpertCard({ expert, delay }: { expert: typeof mockExperts[0], delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl hover:border-violet-500/30 transition-colors h-full">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                            {expert.avatar}
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-lg">{expert.name}</CardTitle>
                            <CardDescription className="text-sm">
                                {expert.role}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{expert.company}</span>
                        <span className="text-muted-foreground">• {expert.yearsExperience} years</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>{expert.successRate}% success</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{expert.totalSessions} sessions</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {expert.expertise.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">${expert.hourlyRate}</span>
                            <span className="text-sm text-muted-foreground">/hour</span>
                        </div>
                    </div>

                    <Button disabled className="w-full" variant="outline">
                        Coming Soon
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl text-center">
            <CardContent className="pt-6 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    {icon}
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
