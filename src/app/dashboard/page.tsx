"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { PlusCircle, Briefcase, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"

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
        <div className="container py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Demo Mode Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-sm text-yellow-200 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <span>
                            <strong>Demo Mode:</strong> Data is stored in memory and will be lost on server restart. 
                            To persist data, configure Supabase in your .env.local file.
                        </span>
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Welcome back, {session?.user?.name || "Candidate"}
                        </h1>
                        <p className="text-muted-foreground">
                            Your interview prep journey starts here.
                        </p>
                    </div>
                    <Link href="/jobs/new">
                        <Button className="bg-violet-600 hover:bg-violet-700">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Job Application
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Jobs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{jobs.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Applications tracked
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Upcoming Sessions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                With experts
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Skill Gaps
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                To work on
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Success Rate
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">0%</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Offers received
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Jobs */}
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Your Job Applications</CardTitle>
                                <CardDescription>
                                    Jobs you're preparing for with AI-powered insights
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="py-8 text-center text-muted-foreground">
                                Loading your jobs...
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="py-12 text-center">
                                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
                                <p className="text-muted-foreground mb-6">
                                    Add your first job to start analyzing skill gaps and preparing for interviews
                                </p>
                                <Link href="/jobs/new">
                                    <Button className="bg-violet-600 hover:bg-violet-700">
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Add Your First Job
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobs.map((job) => (
                                    <div
                                        key={job.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                                <Briefcase className="h-6 w-6 text-violet-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{job.role}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {job.company} • {job.level}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(job.createdAt).toLocaleDateString()}
                                            </span>
                                            <Button variant="outline" size="sm" className="border-white/10">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Upcoming Sessions</CardTitle>
                            <CardDescription>Book time with our experts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full bg-violet-600 hover:bg-violet-700" disabled>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Book a Session
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Coming soon
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>AI Mock Interviews</CardTitle>
                            <CardDescription>Practice with AI-powered scenarios</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" disabled>
                                <TrendingUp className="mr-2 h-4 w-4" />
                                Start Practice
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Coming soon
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle>Browse Experts</CardTitle>
                            <CardDescription>Find your perfect interview coach</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" disabled>
                                <FileText className="mr-2 h-4 w-4" />
                                Explore Experts
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Coming soon
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    )
}
