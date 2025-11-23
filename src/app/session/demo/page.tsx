"use client"

import { AIWhisperer, useAIWhisperer } from "@/components/session/ai-whisperer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Video, Mic, Share, MessageSquare } from "lucide-react"

export default function SessionDemoPage() {
  const [aiEnabled, setAiEnabled] = useState(true)
  const { suggestions, addSuggestion } = useAIWhisperer()
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)

    const suggestionTimers = [
      setTimeout(() => {
        addSuggestion(
          "Great start! Consider structuring your answer using the STAR method.",
          "tip",
          "medium"
        )
      }, 5000),
      setTimeout(() => {
        addSuggestion(
          "You're speaking very fast. Take a breath and slow down.",
          "warning",
          "high"
        )
      }, 15000),
      setTimeout(() => {
        addSuggestion(
          "Excellent example! Your metrics really demonstrate impact.",
          "encouragement",
          "low"
        )
      }, 25000)
    ]

    return () => {
      clearInterval(timer)
      suggestionTimers.forEach(t => clearTimeout(t))
    }
  }, [addSuggestion])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      <div className="container py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mock Interview Session</h1>
            <p className="text-sm text-muted-foreground">with Sarah Chen - System Design</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-mono font-bold text-violet-400">
              {formatTime(sessionTime)}
            </div>
            <Button variant="destructive">End Session</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-white/10 bg-black aspect-video relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-3xl mx-auto">
                    SC
                  </div>
                  <p className="text-white font-medium">Sarah Chen</p>
                  <p className="text-sm text-white/60">Video will appear here</p>
                </div>
              </div>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="py-4">
                <div className="flex items-center justify-center gap-4">
                  <Button size="lg" variant="outline" className="rounded-full w-14 h-14">
                    <Mic className="h-6 w-6" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full w-14 h-14">
                    <Video className="h-6 w-6" />
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full w-14 h-14">
                    <Share className="h-6 w-6" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant={aiEnabled ? "default" : "outline"}
                    className="rounded-full px-6"
                    onClick={() => setAiEnabled(!aiEnabled)}
                  >
                    AI Whisperer: {aiEnabled ? 'ON' : 'OFF'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 h-64 overflow-y-auto">
                  <div className="text-sm text-muted-foreground text-center py-8">
                    Chat messages will appear here
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg">Session Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">System Design</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">60 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recording:</span>
                    <span className="font-medium text-red-400">● Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-violet-500/30 bg-violet-500/10">
          <CardContent className="py-4">
            <p className="text-sm text-center text-muted-foreground">
              <strong>Demo Mode:</strong> Video functionality will be added with Daily.co. 
              AI Whisperer is fully functional - enable it to see suggestions!
            </p>
          </CardContent>
        </Card>
      </div>

      <AIWhisperer
        enabled={aiEnabled}
        suggestions={suggestions}
        position="bottom-right"
        onToggle={setAiEnabled}
      />
    </div>
  )
}
