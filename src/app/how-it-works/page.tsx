"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Sparkles, Users, Video, CheckCircle2, TrendingUp } from "lucide-react"

export default function HowItWorksPage() {
    return (
        <div className="container py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-16"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold tracking-tight">
                        How <span className="text-violet-400">FinalRound</span> Works
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        From job application to offer acceptance — we guide you through every step of your final round interview preparation.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-8">
                    <StepCard
                        number={1}
                        icon={<Sparkles className="h-8 w-8 text-violet-400" />}
                        title="Add Your Job & Resume"
                        description="Paste any job description and upload your resume. Our AI instantly analyzes skill gaps and identifies areas to focus on."
                        features={[
                            "AI-powered JD parsing",
                            "Resume gap analysis",
                            "Skill categorization (covered/partial/missing)",
                            "Personalized prep roadmap"
                        ]}
                    />

                    <StepCard
                        number={2}
                        icon={<Users className="h-8 w-8 text-fuchsia-400" />}
                        title="Find Your Expert Match"
                        description="Browse verified interviewers from FAANG and top tech companies. Filter by company, role, and expertise to find your perfect coach."
                        features={[
                            "Verified FAANG interviewers",
                            "Real success metrics",
                            "Company-specific expertise",
                            "Flexible scheduling"
                        ]}
                        comingSoon
                    />

                    <StepCard
                        number={3}
                        icon={<Video className="h-8 w-8 text-blue-400" />}
                        title="Practice & Prepare"
                        description="Join premium video sessions with whiteboard, code editor, and real-time collaboration tools. Get authentic interview experience."
                        features={[
                            "HD video rooms",
                            "Collaborative whiteboard",
                            "Live code editor",
                            "Session recordings"
                        ]}
                        comingSoon
                    />

                    <StepCard
                        number={4}
                        icon={<TrendingUp className="h-8 w-8 text-green-400" />}
                        title="Track & Improve"
                        description="Monitor your progress, review session feedback, and measure improvement over time. Share outcomes to help others."
                        features={[
                            "Progress tracking",
                            "Expert feedback",
                            "Success analytics",
                            "Outcome reporting"
                        ]}
                        comingSoon
                    />
                </div>

                {/* CTA */}
                <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl">
                    <CardContent className="py-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-3xl font-bold">Ready to ace your interview?</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto">
                                Join FinalRound today and get access to AI-powered analysis and expert coaching.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/signup">
                                    <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                                        Get Started Free
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/experts">
                                    <Button size="lg" variant="outline" className="border-white/10">
                                        Browse Experts
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

function StepCard({ 
    number, 
    icon, 
    title, 
    description, 
    features,
    comingSoon = false 
}: { 
    number: number
    icon: React.ReactNode
    title: string
    description: string
    features: string[]
    comingSoon?: boolean
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: number * 0.1 }}
        >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl relative">
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl font-bold text-violet-400">
                                {number}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {icon}
                                <CardTitle className="text-2xl">{title}</CardTitle>
                                {comingSoon && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                        Coming Soon
                                    </span>
                                )}
                            </div>
                            <CardDescription className="text-base">
                                {description}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="grid gap-2">
                        {features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    )
}
