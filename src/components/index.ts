// Enhanced UI Components for FinalRound
// Created: 2025-11-22
// These components complete the premium UI modernization

// Dashboard Components
export { MoneyPrinterDashboard } from './dashboard/money-printer-dashboard'

// Booking Components
export { BookingFlow } from './booking/booking-flow'

// Session Components
export { AIWhisperer, useAIWhisperer } from './session/ai-whisperer'
export { VideoSessionRoom } from './session/video-session-room'
export { VideoTile } from './session/video-tile'

// Feedback Components
export { FeedbackFlow } from './feedback/feedback-flow'

// Intake Components
export { JobDescriptionIntake } from './intake/job-description-intake'

// Layout Components
export { EnhancedHero } from './layout/enhanced-hero'

// Re-export existing animated components
export {
  AnimatedBackground,
  AnimatedCounter,
  ConfettiSuccessButton,
  LiquidSuccessRing,
  SuccessFeedTicker,
  TiltCard3D,
  FloatingParticles,
  ShimmerSkeleton as ExpertCardSkeleton
} from './animated'

// Export Expert Components
export { ExpertTradingCard } from './experts/expert-trading-card'
export type { ExpertData } from './experts/expert-trading-card'

// Export types
export type { 
  BookingFlowProps,
  VideoSessionRoomProps,
  FeedbackFlowProps,
  JobDescriptionIntakeProps
} from '@/types'
