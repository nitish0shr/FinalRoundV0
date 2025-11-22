"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { GapAnalysis } from "@/types/job"

interface GapAnalysisDisplayProps {
    analysis: GapAnalysis
}

export function GapAnalysisDisplay({ analysis }: GapAnalysisDisplayProps) {
    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
                <CardTitle>Gap Analysis</CardTitle>
                <CardDescription>
                    AI-powered comparison of your resume vs job requirements
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                    {/* Covered Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                            <h3 className="font-semibold">Covered</h3>
                        </div>
                        <div className="space-y-2">
                            {analysis.covered.length > 0 ? (
                                analysis.covered.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-sm"
                                    >
                                        {skill}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No skills covered</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Partial Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-yellow-400">
                            <AlertCircle className="h-5 w-5" />
                            <h3 className="font-semibold">Partial</h3>
                        </div>
                        <div className="space-y-2">
                            {analysis.partial.length > 0 ? (
                                analysis.partial.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm"
                                    >
                                        {skill}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No partial skills</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Missing Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-red-400">
                            <XCircle className="h-5 w-5" />
                            <h3 className="font-semibold">Missing</h3>
                        </div>
                        <div className="space-y-2">
                            {analysis.missing.length > 0 ? (
                                analysis.missing.map((skill, i) => (
                                    <div
                                        key={i}
                                        className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm"
                                    >
                                        {skill}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">All skills covered!</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    )
}
