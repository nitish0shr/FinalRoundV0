"use client"

import { MoneyPrinterDashboard } from "@/components/dashboard/money-printer-dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Loader2, Calendar } from "lucide-react"

interface UpcomingSession {
  id: string
  scheduled_at: string
  booking?: {
    session_type: string
    candidate?: {
      name: string
    }
  }
}

export default function ExpertDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [expertData, setExpertData] = useState({
    totalEarnings: 0,
    pendingPayouts: 0,
    thisWeekEarnings: 0,
    averageSessionRate: 0,
    totalSessions: 0,
    nextPayoutDate: ""
  })
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])

  useEffect(() => {
    fetchExpertStats()
  }, [])

  const fetchExpertStats = async () => {
    try {
      const response = await fetch('/api/expert/stats')
      if (response.ok) {
        const data = await response.json()
        if (data.stats) {
          setExpertData(data.stats)
        }
        if (data.upcomingSessions) {
          setUpcomingSessions(data.upcomingSessions)
        }
      }
    } catch (error) {
      console.error('Failed to fetch expert stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestPayout = () => {
    toast.success("Payout request submitted! You'll receive funds within 2-3 business days.", {
      icon: "💰",
      duration: 4000
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-green-900/10">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-green-900/10">
      <div className="container py-10 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Expert Dashboard</h1>
          <p className="text-muted-foreground">
            Track your earnings, manage sessions, and grow your coaching business
          </p>
        </div>

        <MoneyPrinterDashboard
          {...expertData}
          onRequestPayout={handleRequestPayout}
        />

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled coaching sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No upcoming sessions scheduled</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="font-medium">
                        {session.booking?.session_type || 'Mock Interview'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.scheduled_at
                          ? new Date(session.scheduled_at).toLocaleString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })
                          : 'Time TBD'}
                        {session.booking?.candidate?.name && ` • ${session.booking.candidate.name}`}
                      </p>
                    </div>
                    <Button variant="outline">Join Session</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
