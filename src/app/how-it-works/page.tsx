"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, Search, Calendar, Video, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
    return (
        <div className="container py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        How <span className="text-violet-400">FinalRound</span> Works
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your journey from job application to offer, powered by AI and expert guidance
                    </p>
                </div>

                {/* Process Steps */}
                <div className="space-y-8">
                    <ProcessStep
                        number={1}
                        icon={<FileText className="h-8 w-8 text-violet-400" />}
                        title="Add Your Job Description"
                        description="Paste the JD, upload a PDF, or provide a URL. Our AI instantly extracts required skills, experience level, and key requirements."
                        status="Available Now"
                    />

                    <ProcessStep
                        number={2}
                        icon={<Search className="h-8 w-8 text-fuchsia-400" />}
                        title="AI Gap Analysis"
                        description="Upload your resume and get instant AI-powered analysis showing which skills you have, which need work, and where you stand vs. requirements."
                        status="Available Now"
                    />

                    <ProcessStep
                        number={3}
                        icon={<Calendar className="h-8 w-8 text-blue-400" />}
                        title="Book Expert Sessions"
                        description="Browse verified experts from your target company or similar roles. See their success rates, reviews, and availability."
                        status="Coming Soon"
                    />

                    <ProcessStep
                        number={4}
                        icon={<Video className="h-8 w-8 text-green-400" />}
                        title="Practice & Prepare"
                        description="Join high-quality video sessions with real-time coding, whiteboard collaboration, and expert feedback tailored to your gaps."
                        status="Coming Soon"
                    />

                    <ProcessStep
                        number={5}
                        icon={<TrendingUp className="h-8 w-8 text-yellow-400" />}
                        title="Track Your Progress"
                        description="Monitor your improvement, get offer outcome tracking, and see how you compare to successful candidates."
                        status="Coming Soon"
                    />
                </div>

                {/* CTA Section */}
                <Card className="border-white/10 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl text-center">
                    <CardContent className="py-12 space-y-6">
                        <h2 className="text-3xl font-bold">Ready to Ace Your Interview?</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Start with AI-powered gap analysis and track your preparation journey
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup">
                                <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                                    Get Started Free
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button size="lg" variant="outline" className="border-white/10">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}

function ProcessStep({
    number,
    icon,
    title,
    description,
    status,
}: {
    number: number
    icon: React.ReactNode
    title: string
    description: string
    status: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: number * 0.1 }}
            className="relative"
        >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="h-16 w-16 rounded-full bg-white/5 border-2 border-violet-500/30 flex items-center justify-center text-2xl font-bold text-violet-400">
                                {number}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    {icon}
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-xl">{title}</CardTitle>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        status === "Available Now" 
                                            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                                            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                    }`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                            <CardDescription className="text-base">{description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </motion.div>
    )
}
