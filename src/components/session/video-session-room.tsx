"use client"

import { useState, useEffect, useCallback } from 'react'
import { useDailyVideo } from '@/hooks/use-daily-video'
import { VideoTile } from './video-tile'
import { AIWhisperer, useAIWhisperer } from './ai-whisperer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Video, VideoOff, Mic, MicOff, Share, PhoneOff, 
  MessageSquare, Maximize2, Minimize2, Radio
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSounds } from '@/lib/sound-system'

interface VideoSessionRoomProps {
  roomUrl: string
  sessionId: string
  userName: string
  userRole: 'candidate' | 'expert'
  onEndSession: () => void
}

export function VideoSessionRoom({
  roomUrl,
  sessionId,
  userName,
  userRole,
  onEndSession
}: VideoSessionRoomProps) {
  const [sessionTime, setSessionTime] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, text: string, timestamp: number}>>([])
  const [chatInput, setChatInput] = useState('')
  const [aiEnabled, setAiEnabled] = useState(userRole === 'candidate')
  
  const { suggestions, addSuggestion } = useAIWhisperer()
  const { playNotification, playSuccess } = useSounds()

  const {
    callObject,
    isJoining,
    isJoined,
    participants,
    localVideo,
    localAudio,
    isScreenSharing,
    error,
    joinMeeting,
    leaveMeeting,
    toggleVideo,
    toggleAudio,
  } = useDailyVideo({
    roomUrl,
    userName,
    onJoined: () => {
      console.log('Joined meeting!')
      playSuccess?.()
    },
    onLeft: () => {
      console.log('Left meeting')
      onEndSession()
    },
    onError: (err) => {
      console.error('Video error:', err)
    }
  })

  // Auto-join on mount
  useEffect(() => {
    joinMeeting()
  }, [joinMeeting])

  // Session timer
  useEffect(() => {
    if (!isJoined) return
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isJoined])

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hrs > 0 
      ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Send chat message
  const sendMessage = () => {
    if (!chatInput.trim() || !callObject) return
    
    const message = {
      id: Date.now().toString(),
      user: userName,
      text: chatInput,
      timestamp: Date.now()
    }
    
    setChatMessages(prev => [...prev, message])
    
    // Send via Daily.co app message
    callObject.sendAppMessage({ type: 'chat', message }, '*')
    
    setChatInput('')
  }

  // Receive chat messages
  useEffect(() => {
    if (!callObject) return

    const handleAppMessage = (event: any) => {
      if (event?.data?.type === 'chat') {
        setChatMessages(prev => [...prev, event.data.message])
        playNotification?.()
      }
    }

    callObject.on('app-message' as any, handleAppMessage)
    return () => {
      callObject.off('app-message' as any, handleAppMessage)
    }
  }, [callObject, playNotification])

  // Get local and remote participants
  const localParticipant = Object.values(participants).find((p: any) => p.local)
  const remoteParticipants = Object.values(participants).filter((p: any) => !p.local)

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-red-900/10">
        <Card className="max-w-md border-red-500/30 bg-red-500/10">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">❌</div>
              <h2 className="text-2xl font-bold">Connection Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={onEndSession} variant="outline">
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isJoining || !isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-violet-900/10">
        <Card className="max-w-md border-violet-500/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl mx-auto w-16 h-16"
              >
                ⭕
              </motion.div>
              <h2 className="text-2xl font-bold">Joining Session...</h2>
              <p className="text-muted-foreground">Connecting to video room</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background">
      <div className="container py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mock Interview Session</h1>
            <p className="text-sm text-muted-foreground">
              {userRole === 'candidate' ? 'Practice Interview' : 'Coaching Session'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isRecording && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
                <Radio className="h-4 w-4 text-red-400 animate-pulse" />
                <span className="text-sm font-medium text-red-400">Recording</span>
              </div>
            )}
            <div className="text-2xl font-mono font-bold text-violet-400">
              {formatTime(sessionTime)}
            </div>
            <Button 
              onClick={() => leaveMeeting()} 
              variant="destructive"
              className="gap-2"
            >
              <PhoneOff className="h-4 w-4" />
              End Session
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Video Area */}
          <div className={`space-y-4 ${chatOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            {/* Remote Participant(s) */}
            <div className="grid grid-cols-1 gap-4">
              {remoteParticipants.length > 0 ? (
                remoteParticipants.map((participant: any) => (
                  <VideoTile
                    key={participant.session_id}
                    participant={participant}
                    className="aspect-video"
                  />
                ))
              ) : (
                <Card className="aspect-video border-dashed border-2 border-white/10 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="text-lg">Waiting for other participant...</p>
                  </div>
                </Card>
              )}
            </div>

            {/* Local Participant (Picture-in-Picture) */}
            {localParticipant && (
              <VideoTile
                participant={localParticipant}
                isLocal
                className="w-64 h-48"
              />
            )}

            {/* Controls */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
              <CardContent className="py-4">
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant={localAudio ? "default" : "destructive"}
                    className="rounded-full w-14 h-14"
                    onClick={toggleAudio}
                  >
                    {localAudio ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant={localVideo ? "default" : "destructive"}
                    className="rounded-full w-14 h-14"
                    onClick={toggleVideo}
                  >
                    {localVideo ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-14 h-14"
                    disabled
                  >
                    <Share className="h-6 w-6" />
                  </Button>

                  {userRole === 'candidate' && (
                    <Button
                      size="lg"
                      variant={aiEnabled ? "default" : "outline"}
                      className="rounded-full px-6"
                      onClick={() => setAiEnabled(!aiEnabled)}
                    >
                      AI Whisperer: {aiEnabled ? 'ON' : 'OFF'}
                    </Button>
                  )}

                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-14 h-14 lg:hidden"
                    onClick={() => setChatOpen(!chatOpen)}
                  >
                    <MessageSquare className="h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1"
              >
                <Card className="border-white/10 bg-white/5 backdrop-blur-xl h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Chat
                      </CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="lg:hidden"
                        onClick={() => setChatOpen(false)}
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 space-y-3 overflow-y-auto mb-4 max-h-96">
                      {chatMessages.length === 0 ? (
                        <div className="text-sm text-muted-foreground text-center py-8">
                          No messages yet
                        </div>
                      ) : (
                        chatMessages.map((msg) => (
                          <div key={msg.id} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-violet-400">
                                {msg.user}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm bg-white/5 rounded-lg p-2">
                              {msg.text}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="bg-white/5 border-white/10"
                      />
                      <Button onClick={sendMessage}>Send</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Whisperer (for candidates only) */}
      {userRole === 'candidate' && (
        <AIWhisperer
          enabled={aiEnabled}
          suggestions={suggestions}
          position="bottom-right"
          onToggle={setAiEnabled}
        />
      )}
    </div>
  )
}
