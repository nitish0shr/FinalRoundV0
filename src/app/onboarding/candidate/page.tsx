'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export default function CandidateOnboardingPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [bio, setBio] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // In production, this would call a server action to update user profile
            // For now, just redirect to dashboard
            toast.success('Profile setup complete!')
            router.push('/dashboard')
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl">Complete Your Profile</CardTitle>
                        <CardDescription>Tell us a bit about yourself and your career goals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio (Optional)</Label>
                                <textarea
                                    id="bio"
                                    className="w-full min-h-[100px] px-3 py-2 bg-white/5 border border-white/10 rounded-md"
                                    placeholder="Tell us about your background and what you're looking for..."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </div>

                            <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-4">
                                <h3 className="font-semibold mb-2">What's next?</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>✓ Upload a job description to get started</li>
                                    <li>✓ Get AI-powered resume analysis</li>
                                    <li>✓ Book sessions with expert interviewers</li>
                                </ul>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-violet-600 hover:bg-violet-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Setting up...' : 'Continue to Dashboard'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
