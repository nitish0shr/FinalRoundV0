"use client"

// Sound System for FinalRound
// Provides cash register, confetti, notification, and other audio feedback

export class SoundSystem {
  private static instance: SoundSystem
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private enabled: boolean = true

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  static getInstance(): SoundSystem {
    if (!SoundSystem.instance) {
      SoundSystem.instance = new SoundSystem()
    }
    return SoundSystem.instance
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  // Play synthesized sounds (no audio files needed)
  playCashRegister() {
    if (!this.enabled || !this.audioContext) return
    const ctx = this.audioContext
    const now = ctx.currentTime

    // Create "cha-ching" sound
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    // Cha (first note)
    oscillator.frequency.setValueAtTime(800, now)
    oscillator.frequency.exponentialRampToValueAtTime(600, now + 0.1)
    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
    
    oscillator.start(now)
    oscillator.stop(now + 0.2)
    
    // Ching (second note)
    setTimeout(() => {
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      
      osc2.frequency.setValueAtTime(1200, now + 0.15)
      osc2.frequency.exponentialRampToValueAtTime(1000, now + 0.3)
      gain2.gain.setValueAtTime(0.3, now + 0.15)
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.4)
      
      osc2.start(now + 0.15)
      osc2.stop(now + 0.4)
    }, 150)
  }

  playSuccess() {
    if (!this.enabled || !this.audioContext) return
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    // Create success sound (upward arpeggio)
    const notes = [523.25, 659.25, 783.99] // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.2, now + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3)
      
      osc.start(now + i * 0.1)
      osc.stop(now + i * 0.1 + 0.3)
    })
  }

  playNotification() {
    if (!this.enabled || !this.audioContext) return
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(800, now)
    osc.frequency.setValueAtTime(1000, now + 0.1)
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
    
    osc.start(now)
    osc.stop(now + 0.2)
  }

  playClick() {
    if (!this.enabled || !this.audioContext) return
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.value = 1000
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05)
    
    osc.start(now)
    osc.stop(now + 0.05)
  }

  playError() {
    if (!this.enabled || !this.audioContext) return
    const ctx = this.audioContext
    const now = ctx.currentTime
    
    // Create error sound (downward)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3)
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
    
    osc.start(now)
    osc.stop(now + 0.3)
  }
}

// Export singleton instance
export const soundSystem = typeof window !== 'undefined' ? SoundSystem.getInstance() : null

// React hook for sound
export function useSounds() {
  return {
    playCashRegister: () => soundSystem?.playCashRegister(),
    playSuccess: () => soundSystem?.playSuccess(),
    playNotification: () => soundSystem?.playNotification(),
    playClick: () => soundSystem?.playClick(),
    playError: () => soundSystem?.playError(),
    setEnabled: (enabled: boolean) => soundSystem?.setEnabled(enabled)
  }
}
