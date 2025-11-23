"use client"

import { BookingFlow } from "@/components/booking/booking-flow"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import toast from "react-hot-toast"

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const expertId = searchParams.get('expert') || '1'

  // Mock expert data - replace with real Supabase query
  const mockExperts: Record<string, any> = {
    '1': {
      id: '1',
      name: 'Sarah Chen',
      avatar: 'SC',
      hourlyRate: 250,
      calendlyLink: 'https://calendly.com/demo'
    },
    '2': {
      id: '2',
      name: 'Michael Rodriguez',
      avatar: 'MR',
      hourlyRate: 300,
      calendlyLink: 'https://calendly.com/demo'
    }
  }

  const expert = mockExperts[expertId] || mockExperts['1']

  const handleComplete = async (bookingData: any) => {
    console.log('Booking completed:', bookingData)
    
    // TODO: Save booking to Supabase
    // await supabase.from('bookings').insert(bookingData)
    
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
