'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import toast from 'react-hot-toast'

export default function ExpertOnboardingPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        company: '',
        role: '',
        yearsExperience: '',
        hourlyRate: '',
        bio: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // In production, this would call a server action to create expert profile
            toast.success('Profile submitted for review!')
            router.push('/dashboard')
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
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
                        <CardTitle className="text-3xl">Become an Expert</CardTitle>
                        <CardDescription>Share your expertise and help candidates succeed</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company">Current Company *</Label>
                                    <Input
                                        id="company"
                                        required
                                        className="bg-white/5 border-white/10"
                                        placeholder="Google, Meta, etc."
                                        value={formData.company}
                                        onChange={(e) => updateField('company', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Current Role *</Label>
                                    <Input
                                        id="role"
                                        required
                                        className="bg-white/5 border-white/10"
                                        placeholder="Senior Software Engineer"
                                        value={formData.role}
                                        onChange={(e) => updateField('role', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Years of Experience *</Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        required
                                        min="0"
                                        className="bg-white/5 border-white/10"
                                        placeholder="5"
                                        value={formData.yearsExperience}
                                        onChange={(e) => updateField('yearsExperience', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rate">Hourly Rate (USD) *</Label>
                                    <Input
                                        id="rate"
                                        type="number"
                                        required
                                        min="0"
                                        className="bg-white/5 border-white/10"
                                        placeholder="150"
                                        value={formData.hourlyRate}
                                        onChange={(e) => updateField('hourlyRate', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Professional Bio *</Label>
                                <textarea
                                    id="bio"
                                    required
                                    className="w-full min-h-[120px] px-3 py-2 bg-white/5 border border-white/10 rounded-md"
                                    placeholder="Describe your background, expertise, and interview specialties..."
                                    value={formData.bio}
                                    onChange={(e) => updateField('bio', e.target.value)}
                                />
                            </div>

                            <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-lg p-4">
                                <h3 className="font-semibold mb-2">Verification Process</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your profile will be reviewed by our team. We'll verify your employment and reach out within 24-48 hours.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-fuchsia-600 hover:bg-fuchsia-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Submitting...' : 'Submit for Review'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
