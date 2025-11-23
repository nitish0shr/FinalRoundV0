"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import DailyIframe, { DailyCall, DailyEvent, DailyEventObject } from '@daily-co/daily-js'

interface UseDailyVideoProps {
  roomUrl: string
  userName?: string
  onJoined?: () => void
  onLeft?: () => void
  onError?: (error: Error) => void
  onParticipantJoined?: (participant: any) => void
  onParticipantLeft?: (participant: any) => void
}

export function useDailyVideo({
  roomUrl,
  userName,
  onJoined,
  onLeft,
  onError,
  onParticipantJoined,
  onParticipantLeft
}: UseDailyVideoProps) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [participants, setParticipants] = useState<Record<string, any>>({})
  const [localVideo, setLocalVideo] = useState(true)
  const [localAudio, setLocalAudio] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Initialize Daily call object
  useEffect(() => {
    const daily = DailyIframe.createCallObject({
      audioSource: true,
      videoSource: true,
    })
    setCallObject(daily)
    return () => { daily.destroy() }
  }, [])

  // Join meeting
  const joinMeeting = useCallback(async () => {
    if (!callObject || isJoining || isJoined) return
    setIsJoining(true)
    setError(null)
    try {
      await callObject.join({ url: roomUrl, userName: userName || 'Guest' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join')
      setIsJoining(false)
      onError?.(err instanceof Error ? err : new Error('Failed to join'))
    }
  }, [callObject, roomUrl, userName, isJoining, isJoined, onError])

  const leaveMeeting = useCallback(async () => {
    if (!callObject || !isJoined) return
    try { await callObject.leave() } catch (err) { console.error(err) }
  }, [callObject, isJoined])

  const toggleVideo = useCallback(async () => {
    if (!callObject || !isJoined) return
    const newState = !localVideo
    await callObject.setLocalVideo(newState)
    setLocalVideo(newState)
  }, [callObject, isJoined, localVideo])

  const toggleAudio = useCallback(async () => {
    if (!callObject || !isJoined) return
    const newState = !localAudio
    await callObject.setLocalAudio(newState)
    setLocalAudio(newState)
  }, [callObject, isJoined, localAudio])

  return {
    callObject, isJoining, isJoined, participants, localVideo, localAudio,
    isScreenSharing, error, joinMeeting, leaveMeeting, toggleVideo, toggleAudio
  }
}
