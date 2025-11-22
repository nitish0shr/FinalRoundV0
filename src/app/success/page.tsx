'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export default function SuccessPage() {
    const [hiredCount, setHiredCount] = useState(0)

    useEffect(() => {
        // Trigger confetti
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#8B5CF6', '#EC4899', '#3B82F6'],
            })
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#8B5CF6', '#EC4899', '#3B82F6'],
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }

        frame()

        // Fetch success count
        fetch('/api/outcomes')
            .then((res) => res.json())
            .then((data) => setHiredCount(data.count))
    }, [])

    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl text-center">
                    <CardHeader>
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                            <Sparkles className="h-10 w-10" />
                        </div>
                        <CardTitle className="text-4xl mb-4">FinalRound Success Stories</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center">
                            <div className="text-7xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                {hiredCount}
                            </div>
                            <p className="text-xl text-muted-foreground mt-2">
                                candidates got hired this month
                            </p>
                        </div>

                        <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-6">
                            <p className="text-lg">
                                Join thousands of successful candidates who aced their final rounds with expert guidance.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
