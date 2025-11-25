"use client"

import { BookingFlow } from "@/components/booking/booking-flow"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

interface Expert {
  id: string
  name: string
  avatar: string
  hourlyRate: number
  calendlyLink?: string
}

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const expertId = searchParams.get('expert')
  const [expert, setExpert] = useState<Expert | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExpert() {
      if (!expertId) {
        setError('No expert selected')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/experts?id=${expertId}`)
        const data = await response.json()

        if (data.expert) {
          setExpert({
            id: data.expert.id,
            name: data.expert.name,
            avatar: data.expert.avatar,
            hourlyRate: data.expert.hourlyRate,
            calendlyLink: data.expert.calendlyLink,
          })
        } else {
          setError('Expert not found')
        }
      } catch (err) {
        console.error('Failed to fetch expert:', err)
        setError('Failed to load expert details')
      } finally {
        setLoading(false)
      }
    }

    fetchExpert()
  }, [expertId])

  const handleComplete = async (bookingData: any) => {
    toast.success('Booking confirmed! Check your email for session details.', {
      icon: '🎉',
      duration: 5000
    })

    // Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000)
  }

  const handleCancel = () => {
    router.push('/experts')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-violet-900/10">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-violet-900/10">
        <p className="text-lg text-muted-foreground mb-4">{error || 'Expert not found'}</p>
        <button
          onClick={() => router.push('/experts')}
          className="text-violet-400 hover:text-violet-300"
        >
          Browse experts
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-violet-900/10 py-20">
      <div className="container">
        <BookingFlow
          expert={expert}
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}
