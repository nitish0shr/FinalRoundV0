"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  role: 'interviewer' | 'candidate'
  content: string
  timestamp: number
}

interface AIInterviewProps {
  jobRole: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number // minutes
  onComplete: (transcript: Message[], feedback: any) => void
}

export function AIInterviewRoom({ jobRole, difficulty, duration, onComplete }: AIInterviewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(duration * 60)
  const [isComplete, setIsComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Start interview
  useEffect(() => {
    startInterview()
  }, [])

  // Timer
  useEffect(() => {
    if (isComplete) return
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endInterview()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isComplete])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startInterview = async () => {
    const greeting = await getAIResponse([
      { role: 'interviewer', content: 'Start the interview', timestamp: Date.now() }
    ])
    
    setMessages([{
      role: 'interviewer',
      content: greeting,
      timestamp: Date.now()
    }])
  }

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return

    const userMessage: Message = {
      role: 'candidate',
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsThinking(true)

    try {
      const response = await getAIResponse([...messages, userMessage])
      
      setMessages(prev => [...prev, {
        role: 'interviewer',
        content: response,
        timestamp: Date.now()
      }])
    } catch (error) {
      toast.error('Failed to get response')
    } finally {
      setIsThinking(false)
    }
  }

  const getAIResponse = async (conversation: Message[]): Promise<string> => {
    const response = await fetch('/api/ai-interview/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation,
        jobRole,
        difficulty
      })
    })

    const data = await response.json()
    return data.response
  }

  const endInterview = async () => {
    setIsComplete(true)
    
    // Generate feedback
    const response = await fetch('/api/ai-interview/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: messages,
        jobRole,
        difficulty
      })
    })

    const feedback = await response.json()
    onComplete(messages, feedback)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isComplete) {
    return (
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Interview Complete!</h2>
          <p className="text-muted-foreground">Generating your feedback...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-violet-400" />
                AI Mock Interview
              </CardTitle>
              <CardDescription>{jobRole} - {difficulty}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-violet-400">
                {formatTime(timeRemaining)}
              </div>
              <Badge variant="outline">
                {messages.filter(m => m.role === 'candidate').length} responses
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="p-6">
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'interviewer'
                        ? 'bg-violet-500/20 border border-violet-500/30'
                        : 'bg-blue-500/20 border border-blue-500/30'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.role === 'interviewer' ? 'AI Interviewer' : 'You'}
                    </p>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-violet-500/20 border border-violet-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Type your answer..."
              rows={3}
              className="bg-white/5 border-white/10"
              disabled={isThinking}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isThinking}
                className="h-full"
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={endInterview}
                className="h-full"
              >
                End
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
