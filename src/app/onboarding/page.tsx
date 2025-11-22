'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OnboardingPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleRoleSelect = async (role: 'candidate' | 'expert') => {
        setIsLoading(true)
        try {
            // In a real app, we might update the user's metadata here via server action
            // For now, just redirect to the specific onboarding flow
            router.push(`/onboarding/${role}`)
        } catch (error) {
            toast.error('Something went wrong')
            setIsLoading(false)
        }
    }

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Choose your path</h1>
                    <p className="text-xl text-muted-foreground">
                        How do you want to use FinalRound?
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Candidate Card */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                            className="h-full cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                            onClick={() => handleRoleSelect('candidate')}
                        >
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                                    <User className="h-6 w-6 text-violet-400" />
                                </div>
                                <CardTitle className="text-2xl">I'm a Candidate</CardTitle>
                                <CardDescription>
                                    I want to prepare for interviews, get AI feedback, and mock interview with experts.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>✓ AI Resume Analysis</li>
                                    <li>✓ Mock Interview Sessions</li>
                                    <li>✓ Personalized Roadmap</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Expert Card */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Card
                            className="h-full cursor-pointer border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                            onClick={() => handleRoleSelect('expert')}
                        >
                            <CardHeader>
                                <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 flex items-center justify-center mb-4">
                                    <Briefcase className="h-6 w-6 text-fuchsia-400" />
                                </div>
                                <CardTitle className="text-2xl">I'm an Expert</CardTitle>
                                <CardDescription>
                                    I want to interview candidates, earn money, and help others succeed.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>✓ Set your own rates</li>
                                    <li>✓ Flexible schedule</li>
                                    <li>✓ Guaranteed payouts</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
