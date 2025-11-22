"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { FileText, Sparkles, Users, Video, TrendingUp, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
    return (
        <div className="container py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
            >
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">
                        How <span className="text-violet-400">FinalRound</span> Works
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        From job description to offer letter—here's how we help you ace your interviews
                    </p>
                </div>

                {/* Step-by-Step Process */}
                <div className="max-w-4xl mx-auto space-y-8">
                    <StepCard
                        number={1}
                        icon={<FileText className="h-10 w-10 text-violet-400" />}
                        title="Add Your Target Job"
                        description="Paste the job description or LinkedIn URL. Our AI instantly parses requirements, skills, and company details."
                        features={[
                            "Automatic skill extraction",
                            "Company research",
                            "Level detection (Junior/Senior/Staff)"
                        ]}
                    />

                    <StepCard
                        number={2}
                        icon={<Sparkles className="h-10 w-10 text-fuchsia-400" />}
                        title="Upload Your Resume"
                        description="Get instant AI-powered gap analysis. See exactly which skills you have, which need work, and what's missing."
                        features={[
                            "Skills coverage analysis",
                            "Gap identification",
                            "Personalized recommendations"
                        ]}
                    />

                    <StepCard
                        number={3}
                        icon={<Users className="h-10 w-10 text-blue-400" />}
                        title="Book an Expert"
                        description="Choose from verified interviewers who've worked at your target company. Schedule a mock interview tailored to your role."
                        features={[
                            "Company-specific experts",
                            "Flexible scheduling",
                            "1-on-1 or blind interviews"
                        ]}
                        comingSoon
                    />

                    <StepCard
                        number={4}
                        icon={<Video className="h-10 w-10 text-green-400" />}
                        title="Practice in Real-Time"
                        description="Join a premium video room with whiteboard, code editor, and screen sharing. Get immediate feedback and coaching."
                        features={[
                            "HD video & audio",
                            "Collaborative whiteboard",
                            "Code execution environment"
                        ]}
                        comingSoon
                    />

                    <StepCard
                        number={5}
                        icon={<TrendingUp className="h-10 w-10 text-orange-400" />}
                        title="Track Your Progress"
                        description="Monitor your improvement across sessions. See your success rate, skills development, and expert recommendations."
                        features={[
                            "Performance analytics",
                            "Skill progression tracking",
                            "Outcome tracking (offers received)"
                        ]}
                        comingSoon
                    />
                </div>

                {/* CTA Section */}
                <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 backdrop-blur-xl max-w-3xl mx-auto">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold">Ready to Master Your Final Round?</h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                Join candidates who've landed offers at top tech companies with FinalRound's AI-powered prep and expert coaching.
                            </p>
                            <div className="flex gap-4 justify-center pt-4">
                                <Link href="/signup">
                                    <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link href="/dashboard">
                                    <Button size="lg" variant="outline" className="border-white/10">
                                        View Dashboard
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
    comingSoon
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
            transition={{ delay: number * 0.1 }}
            viewport={{ once: true }}
        >
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl relative">
                {comingSoon && (
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-xs font-medium text-violet-300">
                            Coming Soon
                        </span>
                    </div>
                )}
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xl">
                                {number}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="mb-3">{icon}</div>
                            <CardTitle className="text-2xl mb-2">{title}</CardTitle>
                            <CardDescription className="text-base">{description}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 ml-16">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </motion.div>
    )
}
