"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Star, Briefcase, Award } from "lucide-react"
import Link from "next/link"

export default function ExpertsPage() {
    return (
        <div className="container py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Browse <span className="text-violet-400">Elite Experts</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Connect with verified interviewers from FAANG and top tech companies
                    </p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl text-center py-12">
                    <CardContent className="space-y-4">
                        <div className="flex justify-center mb-4">
                            <div className="h-20 w-20 rounded-full bg-violet-500/20 flex items-center justify-center">
                                <Star className="h-10 w-10 text-violet-400" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold">Expert Directory Coming Soon</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            We're currently onboarding and verifying elite interview experts from top tech companies.
                            Check back soon!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link href="/signup">
                                <Button className="bg-violet-600 hover:bg-violet-700">
                                    Get Notified When Available
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button variant="outline" className="border-white/10">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Preview Features */}
                <div className="grid gap-6 md:grid-cols-3 pt-8">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4">
                                <Briefcase className="h-6 w-6 text-violet-400" />
                            </div>
                            <CardTitle>Verified Backgrounds</CardTitle>
                            <CardDescription>
                                All experts verified through LinkedIn and company email verification
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-fuchsia-500/20 flex items-center justify-center mb-4">
                                <Star className="h-6 w-6 text-fuchsia-400" />
                            </div>
                            <CardTitle>Success Tracking</CardTitle>
                            <CardDescription>
                                Real offer data and success rates tracked for every expert
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                                <Award className="h-6 w-6 text-blue-400" />
                            </div>
                            <CardTitle>Premium Experience</CardTitle>
                            <CardDescription>
                                High-fidelity video rooms with collaborative coding and whiteboard tools
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </motion.div>
        </div>
    )
}
