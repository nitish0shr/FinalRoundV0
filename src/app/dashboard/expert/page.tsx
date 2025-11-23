"use client"

import { MoneyPrinterDashboard } from "@/components/dashboard/money-printer-dashboard"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import toast from "react-hot-toast"

export default function ExpertDashboardPage() {
  const [earnings] = useState(12500)
  
  const expertData = {
    totalEarnings: earnings,
    pendingPayouts: 450,
    thisWeekEarnings: 1250,
    averageSessionRate: 250,
    totalSessions: 50,
    nextPayoutDate: "December 1, 2025"
  }

  const handleRequestPayout = () => {
    toast.success("Payout request submitted! You'll receive funds within 2-3 business days.", {
      icon: "💰",
      duration: 4000
    })
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
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                  <div>
                    <p className="font-medium">Mock Interview - System Design</p>
                    <p className="text-sm text-muted-foreground">Tomorrow at 2:00 PM</p>
                  </div>
                  <Button variant="outline">Join Session</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
