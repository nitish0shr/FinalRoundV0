"use client"

import { useState } from "react"
import { JDIntakeForm } from "@/components/jd-intake-form"
import { ResumeUpload } from "@/components/resume-upload"
import { GapAnalysisDisplay } from "@/components/gap-analysis-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { ParsedJD, GapAnalysis } from "@/types/job"
import { ArrowRight, Check, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function NewJobPage() {
    const router = useRouter()
    const [step, setStep] = useState<'jd' | 'parsed' | 'resume' | 'analysis'>('jd')
    const [parsedJD, setParsedJD] = useState<ParsedJD | null>(null)
    const [resumeText, setResumeText] = useState<string | null>(null)
    const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)

    const handleJDParsed = (parsed: ParsedJD) => {
        setParsedJD(parsed)
        setStep('parsed')
    }

    const handleSaveAndContinue = () => {
        setStep('resume')
        setIsEditMode(false)
    }

    const handleAnalysisComplete = (text: string, analysis: GapAnalysis) => {
        setResumeText(text)
        setGapAnalysis(analysis)
        setStep('analysis')
    }

    const handleFinish = async () => {
        if (!parsedJD || !resumeText || !gapAnalysis) {
            toast.error("Missing required data")
            return
        }

        try {
            // Save job first
            const jobResponse = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company: parsedJD.company,
                    role: parsedJD.role,
                    level: parsedJD.level,
                    requiredSkills: parsedJD.requiredSkills,
                    niceToHaveSkills: parsedJD.niceToHaveSkills,
                    jdRaw: JSON.stringify(parsedJD),
                    jdParsed: parsedJD
                })
            })

            if (!jobResponse.ok) {
                throw new Error('Failed to save job')
            }

            const jobData = await jobResponse.json()
            const jobId = jobData.data.id

            // Then save resume with gap analysis
            const resumeResponse = await fetch('/api/resumes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId,
                    resumeText,
                    gapAnalysis
                })
            })

            if (!resumeResponse.ok) {
                throw new Error('Failed to save resume')
            }

            toast.success("Job and resume saved successfully!")
            setTimeout(() => {
                router.push('/dashboard')
            }, 1500)
        } catch (error) {
            console.error('Save error:', error)
            toast.error("Failed to save. Please try again.")
        }
    }

    return (
        <div className="container py-10 max-w-5xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div>
                    <h1 className="text-4xl font-bold mb-2">Add New Job</h1>
                    <p className="text-muted-foreground">
                        Let AI analyze the job description and your resume to identify skill gaps
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <Step number={1} label="JD Intake" active={step === 'jd'} completed={step !== 'jd'} />
                    <div className="flex-1 h-0.5 bg-white/10" />
                    <Step number={2} label="Review JD" active={step === 'parsed'} completed={step !== 'jd' && step !== 'parsed'} />
                    <div className="flex-1 h-0.5 bg-white/10" />
                    <Step number={3} label="Resume" active={step === 'resume'} completed={step === 'analysis'} />
                    <div className="flex-1 h-0.5 bg-white/10" />
                    <Step number={4} label="Analysis" active={step === 'analysis'} completed={false} />
                </div>

                <AnimatePresence mode="wait">
                    {step === 'jd' && (
                        <motion.div
                            key="jd-intake"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <JDIntakeForm onParsed={handleJDParsed} />
                        </motion.div>
                    )}

                    {step === 'parsed' && parsedJD && (
                        <motion.div
                            key="parsed-jd"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle>Parsed Job Description</CardTitle>
                                            <CardDescription>
                                                Review and edit the AI-extracted information
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditMode(!isEditMode)}
                                            className="border-white/10"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            {isEditMode ? 'Preview' : 'Edit'}
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isEditMode ? (
                                        <>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Company</Label>
                                                    <Input
                                                        value={parsedJD.company}
                                                        onChange={(e) => setParsedJD({ ...parsedJD, company: e.target.value })}
                                                        className="bg-white/5 border-white/10"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Role</Label>
                                                    <Input
                                                        value={parsedJD.role}
                                                        onChange={(e) => setParsedJD({ ...parsedJD, role: e.target.value })}
                                                        className="bg-white/5 border-white/10"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Level</Label>
                                                <Input
                                                    value={parsedJD.level}
                                                    onChange={(e) => setParsedJD({ ...parsedJD, level: e.target.value as ParsedJD['level'] })}
                                                    className="bg-white/5 border-white/10"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Company</p>
                                                <p className="font-semibold">{parsedJD.company}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Role</p>
                                                <p className="font-semibold">{parsedJD.role}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Level</p>
                                                <p className="font-semibold capitalize">{parsedJD.level}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Required Skills ({parsedJD.requiredSkills.length})</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {parsedJD.requiredSkills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Nice to Have Skills ({parsedJD.niceToHaveSkills.length})</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {parsedJD.niceToHaveSkills.map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-sm"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSaveAndContinue}
                                        className="w-full bg-violet-600 hover:bg-violet-700"
                                    >
                                        Save & Continue to Resume Upload
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 'resume' && parsedJD && (
                        <motion.div
                            key="resume-upload"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <ResumeUpload
                                requiredSkills={parsedJD.requiredSkills}
                                onAnalysisComplete={handleAnalysisComplete}
                            />
                        </motion.div>
                    )}

                    {step === 'analysis' && gapAnalysis && (
                        <motion.div
                            key="gap-analysis"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <GapAnalysisDisplay analysis={gapAnalysis} />
                            <div className="flex justify-end gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep('resume')}
                                    className="border-white/10"
                                >
                                    Upload Different Resume
                                </Button>
                                <Button
                                    onClick={handleFinish}
                                    className="bg-violet-600 hover:bg-violet-700"
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Save & Finish
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

function Step({ number, label, active, completed }: { number: number; label: string; active: boolean; completed: boolean }) {
    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${completed
                    ? 'bg-green-600 text-white'
                    : active
                        ? 'bg-violet-600 text-white'
                        : 'bg-white/10 text-muted-foreground'
                    }`}
            >
                {completed ? <Check className="h-5 w-5" /> : number}
            </div>
            <p className={`text-xs mt-2 ${active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {label}
            </p>
        </div>
    )
}
