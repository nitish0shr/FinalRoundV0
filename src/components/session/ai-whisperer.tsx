"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, X, Minimize2, Maximize2, Volume2, VolumeX } from "lucide-react"

interface AIWhispererProps {
  enabled?: boolean
  suggestions?: Suggestion[]
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  onToggle?: (enabled: boolean) => void
}

interface Suggestion {
  id: string
  text: string
  type: 'tip' | 'warning' | 'encouragement' | 'clarification'
  timestamp: number
  priority: 'low' | 'medium' | 'high'
}

export function AIWhisperer({
  enabled = true,
  suggestions = [],
  position = 'bottom-right',
  onToggle
}: AIWhispererProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null)
  const [suggestionHistory, setSuggestionHistory] = useState<Suggestion[]>([])

  useEffect(() => {
    if (suggestions.length > 0 && enabled) {
      const latest = suggestions[suggestions.length - 1]
      if (!suggestionHistory.find(s => s.id === latest.id)) {
        setCurrentSuggestion(latest)
        setSuggestionHistory(prev => [...prev, latest])
        if (soundEnabled) {
          playNotificationSound()
        }
        // Auto-hide low priority suggestions after 5 seconds
        if (latest.priority === 'low') {
          setTimeout(() => setCurrentSuggestion(null), 5000)
        }
      }
    }
  }, [suggestions, enabled, suggestionHistory, soundEnabled])

  const playNotificationSound = () => {
    // Subtle notification sound
    console.log('🔔 AI suggestion arrived')
  }

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-6 right-6',
      'bottom-left': 'bottom-6 left-6',
      'top-right': 'top-6 right-6',
      'top-left': 'top-6 left-6'
    }
    return positions[position]
  }

  const getTypeStyles = (type: Suggestion['type']) => {
    const styles = {
      tip: 'border-blue-500/30 bg-blue-500/10',
      warning: 'border-yellow-500/30 bg-yellow-500/10',
      encouragement: 'border-green-500/30 bg-green-500/10',
      clarification: 'border-violet-500/30 bg-violet-500/10'
    }
    return styles[type]
  }

  const getTypeIcon = (type: Suggestion['type']) => {
    const icons = {
      tip: '💡',
      warning: '⚠️',
      encouragement: '🌟',
      clarification: '🔍'
    }
    return icons[type]
  }

  if (!enabled) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className={`fixed ${getPositionClasses()} z-50 max-w-md`}
      >
        {isMinimized ? (
          <motion.button
            onClick={() => setIsMinimized(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-4 rounded-full bg-violet-600 shadow-2xl shadow-violet-500/50 border-2 border-violet-400/50"
          >
            <Sparkles className="h-6 w-6 text-white" />
            {currentSuggestion && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.button>
        ) : (
          <Card className={`
            relative overflow-hidden backdrop-blur-xl
            border-2 shadow-2xl
            ${currentSuggestion ? getTypeStyles(currentSuggestion.type) : 'border-white/10 bg-white/5'}
          `}>
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <h3 className="font-semibold">AI Whisperer</h3>
                  <Badge variant="outline" className="text-xs">BETA</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="h-8 w-8"
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsMinimized(true)}
                    className="h-8 w-8"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onToggle?.(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Content */}
            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              <AnimatePresence mode="wait">
                {currentSuggestion ? (
                  <motion.div
                    key={currentSuggestion.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getTypeIcon(currentSuggestion.type)}</span>
                      <div className="flex-1">
                        <motion.p
                          className="text-sm leading-relaxed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {currentSuggestion.text}
                        </motion.p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCurrentSuggestion(null)}
                      className="w-full text-xs"
                    >
                      Dismiss
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Listening to your session...</p>
                    <p className="text-xs mt-1">I'll provide subtle suggestions when helpful</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recent Suggestions */}
              {suggestionHistory.length > 0 && !currentSuggestion && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">Recent Suggestions</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {suggestionHistory.slice(-5).reverse().map((suggestion) => (
                      <motion.button
                        key={suggestion.id}
                        onClick={() => setCurrentSuggestion(suggestion)}
                        whileHover={{ scale: 1.02 }}
                        className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 text-left text-xs border border-white/5 transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <span>{getTypeIcon(suggestion.type)}</span>
                          <span className="truncate">{suggestion.text}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Animated border glow */}
            {currentSuggestion && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(167, 139, 250, 0)',
                    '0 0 20px rgba(167, 139, 250, 0.5)',
                    '0 0 0px rgba(167, 139, 250, 0)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </Card>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Example usage and mock suggestions generator
export function useAIWhisperer() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const addSuggestion = (text: string, type: Suggestion['type'], priority: Suggestion['priority'] = 'medium') => {
    const newSuggestion: Suggestion = {
      id: Date.now().toString(),
      text,
      type,
      timestamp: Date.now(),
      priority
    }
    setSuggestions(prev => [...prev, newSuggestion])
  }

  return { suggestions, addSuggestion }
}
