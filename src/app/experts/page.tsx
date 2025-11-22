"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Star, Briefcase, CheckCircle, Users } from "lucide-react"
import Link from "next/link"

export default function ExpertsPage() {
    return (
        <div className="container py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">
                        Meet Our <span className="text-violet-400">Elite Experts</span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Verified interviewers from FAANG and top tech companies, ready to help you ace your final round.
                    </p>
                </div>

                {/* Coming Soon Banner */}
                <Card className="border-violet-500/30 bg-violet-500/5 backdrop-blur-xl max-w-2xl mx-auto">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <Users className="h-16 w-16 text-violet-400 mx-auto" />
                            <h2 className="text-2xl font-bold">Expert Marketplace Coming Soon</h2>
                            <p className="text-muted-foreground">
                                We're currently onboarding elite interview experts from:
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 pt-2">
                                {['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Netflix'].map((company) => (
                                    <span
                                        key={company}
                                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium"
                                    >
                                        {company}
                                    </span>
                                ))}
                            </div>
                            <div className="pt-4">
                                <Link href="/signup">
                                    <Button className="bg-violet-600 hover:bg-violet-700">
                                        Join Waitlist
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Features Grid */}
                <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto pt-8">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <Star className="h-8 w-8 text-yellow-400 mb-2" />
                            <CardTitle>Verified Expertise</CardTitle>
                            <CardDescription>
                                All experts verified with employment history at top tech companies
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
                            <CardTitle>Proven Results</CardTitle>
                            <CardDescription>
                                Track record of helping candidates land offers at competitive companies
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <Briefcase className="h-8 w-8 text-blue-400 mb-2" />
                            <CardTitle>Real Experience</CardTitle>
                            <CardDescription>
                                Active or former hiring managers and senior engineers from FAANG
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </motion.div>
        </div>
    )
}
