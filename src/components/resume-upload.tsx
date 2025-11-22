"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, FileText } from "lucide-react"
import toast from "react-hot-toast"
import { GapAnalysis } from "@/types/job"

interface ResumeUploadProps {
    requiredSkills: string[]
    onAnalysisComplete: (resumeText: string, analysis: GapAnalysis) => void
}

export function ResumeUpload({ requiredSkills, onAnalysisComplete }: ResumeUploadProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [resumeText, setResumeText] = useState("")

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            toast.error("Please enter your resume text")
            return
        }

        setIsAnalyzing(true)

        try {
            const response = await fetch("/api/upload-resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumeText,
                    requiredSkills,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to analyze resume")
            }

            toast.success("Resume analyzed successfully!")
            onAnalysisComplete(result.data.resumeText, result.data.gapAnalysis)
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to analyze resume"
            toast.error(message)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-violet-400" />
                    Add Resume
                </CardTitle>
                <CardDescription>
                    Paste your resume text for AI-powered gap analysis
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="resume-text">Resume Text</Label>
                    <Textarea
                        id="resume-text"
                        placeholder="Paste your resume text here..."
                        className="min-h-[300px] bg-white/5 border-white/10"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        disabled={isAnalyzing}
                    />
                </div>

                <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !resumeText.trim()}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing with AI...
                        </>
                    ) : (
                        <>
                            <FileText className="mr-2 h-4 w-4" />
                            Analyze Resume
                        </>
                    )}
                </Button>

                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-4"
                    >
                        <p className="text-sm text-muted-foreground">
                            AI is comparing your resume against job requirements...
                        </p>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    )
}
