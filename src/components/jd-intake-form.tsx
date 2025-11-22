"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, FileText, Link as LinkIcon, Upload, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import { ParsedJD } from "@/types/job"

interface JDIntakeFormProps {
    onParsed: (parsedJD: ParsedJD) => void
}

export function JDIntakeForm({ onParsed }: JDIntakeFormProps) {
    const [activeTab, setActiveTab] = useState("text")
    const [jdText, setJdText] = useState("")
    const [jdUrl, setJdUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleParseText = async () => {
        if (!jdText.trim()) {
            toast.error("Please enter a job description")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/parse-jd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jdText }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to parse JD")
            }

            toast.success("Job description parsed successfully!")
            onParsed(result.data)
        } catch (error: any) {
            toast.error(error.message || "Failed to parse job description")
        } finally {
            setIsLoading(false)
        }
    }

    const handleScrapeUrl = async () => {
        if (!jdUrl.trim()) {
            toast.error("Please enter a URL")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/scrape-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: jdUrl }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to scrape URL")
            }

            toast.success("Job description scraped and parsed!")
            onParsed(result.data)
        } catch (error: any) {
            toast.error(error.message || "Failed to scrape URL")
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file")
            return
        }

        setIsLoading(true)
        try {
            // Read file as text
            const text = await file.text()

            // Parse as text
            const response = await fetch("/api/parse-jd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jdText: text }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Failed to parse JD")
            }

            toast.success("PDF parsed successfully!")
            onParsed(result.data)
        } catch (error: any) {
            toast.error(error.message || "Failed to parse PDF")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-violet-400" />
                    Add Job Description
                </CardTitle>
                <CardDescription>
                    Provide the job description in any format—we'll parse it with AI
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5">
                        <TabsTrigger value="text" className="data-[state=active]:bg-violet-600">
                            <FileText className="h-4 w-4 mr-2" />
                            Paste Text
                        </TabsTrigger>
                        <TabsTrigger value="url" className="data-[state=active]:bg-violet-600">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            URL
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="data-[state=active]:bg-violet-600">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload PDF
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="text" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="jd-text">Job Description</Label>
                            <Textarea
                                id="jd-text"
                                placeholder="Paste the full job description here..."
                                className="min-h-[300px] bg-white/5 border-white/10"
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            onClick={handleParseText}
                            disabled={isLoading || !jdText.trim()}
                            className="w-full bg-violet-600 hover:bg-violet-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Parsing with AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Parse with AI
                                </>
                            )}
                        </Button>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="jd-url">Job Posting URL</Label>
                            <Input
                                id="jd-url"
                                type="url"
                                placeholder="https://linkedin.com/jobs/..."
                                className="bg-white/5 border-white/10"
                                value={jdUrl}
                                onChange={(e) => setJdUrl(e.target.value)}
                                disabled={isLoading}
                            />
                            <p className="text-sm text-muted-foreground">
                                We'll scrape and parse the job description automatically
                            </p>
                        </div>
                        <Button
                            onClick={handleScrapeUrl}
                            disabled={isLoading || !jdUrl.trim()}
                            className="w-full bg-violet-600 hover:bg-violet-700"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scraping & Parsing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Scrape & Parse
                                </>
                            )}
                        </Button>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="jd-file">Upload Job Description (PDF)</Label>
                            <Input
                                id="jd-file"
                                type="file"
                                accept=".pdf"
                                className="bg-white/5 border-white/10 cursor-pointer"
                                onChange={handleFileUpload}
                                disabled={isLoading}
                            />
                            <p className="text-sm text-muted-foreground">
                                Upload a PDF containing the job description
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
