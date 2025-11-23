"use client"

import { useEffect, useRef } from 'react'
import { DailyCall } from '@daily-co/daily-js'

interface VideoTileProps {
  participant: any
  isLocal?: boolean
  className?: string
}

export function VideoTile({ participant, isLocal = false, className = '' }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (!participant) return

    // Set video track
    if (videoRef.current && participant.videoTrack) {
      videoRef.current.srcObject = new MediaStream([participant.videoTrack])
    }

    // Set audio track (not for local participant to avoid echo)
    if (!isLocal && audioRef.current && participant.audioTrack) {
      audioRef.current.srcObject = new MediaStream([participant.audioTrack])
    }
  }, [participant, isLocal])

  const videoEnabled = participant?.video
  const audioEnabled = participant?.audio

  return (
    <div className={`relative rounded-xl overflow-hidden bg-black ${className}`}>
      {/* Video */}
      {videoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900 to-fuchsia-900">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
              {participant?.user_name?.[0]?.toUpperCase() || '?'}
            </div>
            <p className="text-white/80 text-sm">Camera off</p>
          </div>
        </div>
      )}

      {/* Audio (hidden) */}
      {!isLocal && <audio ref={audioRef} autoPlay />}

      {/* Participant info */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
          <span className="text-white text-sm font-medium">
            {participant?.user_name || 'Guest'}
            {isLocal && ' (You)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!audioEnabled && (
            <div className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
