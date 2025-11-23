"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, ThumbsDown, Sparkles, TrendingUp, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSounds } from '@/lib/sound-system'

interface FeedbackFlowProps {
  sessionId: string
  expertName: string
  userRole: 'candidate' | 'expert'
  onComplete: () => void
}

export function FeedbackFlow({ sessionId, expertName, userRole, onComplete }: FeedbackFlowProps) {
  const { playSuccess } = useSounds()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [gotOffer, setGotOffer] = useState<boolean | null>(null)
  const [offerCompany, setOfferCompany] = useState('')
  const [strengths, setStrengths] = useState('')
  const [weaknesses, setWeaknesses] = useState('')
  const [resources, setResources] = useState('')

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const feedbackData = userRole === 'candidate' 
        ? { rating, review, got_offer: gotOffer, offer_company: offerCompany }
        : { strengths, weaknesses, resources }

      await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, ...feedbackData }),
      })

      playSuccess?.()
      toast.success('Thank you for your feedback!')
      onComplete()
    } catch (error) {
      toast.error('Failed to submit feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (userRole === 'candidate') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-violet-900/10 py-20">
        <div className="container max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-3xl">How was your session?</CardTitle>
                    <CardDescription>Rate your experience with {expertName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-lg">Overall Rating</Label>
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => setRating(star)}>
                            <Star className={`h-12 w-12 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="review">Share your experience (optional)</Label>
                      <Textarea id="review" value={review} onChange={(e) => setReview(e.target.value)} 
                        placeholder="What went well?" rows={4} className="bg-white/5 border-white/10" />
                    </div>
                    <Button onClick={() => setStep(2)} disabled={rating === 0} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600" size="lg">
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-3xl">Track Your Success</CardTitle>
                    <CardDescription>Did you receive an offer?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant={gotOffer === true ? 'default' : 'outline'} onClick={() => setGotOffer(true)} className="h-20 text-lg">
                        <ThumbsUp className="mr-2 h-6 w-6" />Yes! 🎉
                      </Button>
                      <Button variant={gotOffer === false ? 'default' : 'outline'} onClick={() => setGotOffer(false)} className="h-20 text-lg">
                        <ThumbsDown className="mr-2 h-6 w-6" />Not yet
                      </Button>
                    </div>
                    {gotOffer === true && (
                      <div className="space-y-3">
                        <Label>Which company?</Label>
                        <Input value={offerCompany} onChange={(e) => setOfferCompany(e.target.value)} placeholder="e.g., Google" />
                      </div>
                    )}
                    <Button onClick={handleSubmit} disabled={isSubmitting || gotOffer === null} className="w-full" size="lg">
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-green-900/10 py-20">
      <div className="container max-w-2xl">
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-3xl">Session Feedback</CardTitle>
            <CardDescription>Provide feedback to help the candidate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Strengths</Label>
              <Textarea value={strengths} onChange={(e) => setStrengths(e.target.value)} rows={4} />
            </div>
            <div className="space-y-3">
              <Label>Areas for Improvement</Label>
              <Textarea value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} rows={4} />
            </div>
            <div className="space-y-3">
              <Label>Recommended Resources</Label>
              <Textarea value={resources} onChange={(e) => setResources(e.target.value)} rows={3} />
            </div>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full" size="lg">
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
