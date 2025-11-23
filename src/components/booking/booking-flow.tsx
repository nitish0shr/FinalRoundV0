"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, Clock, CreditCard, Eye, EyeOff, Check, 
  ArrowLeft, ArrowRight, DollarSign, Shield 
} from "lucide-react"
import { useSounds } from "@/lib/sound-system"

interface BookingFlowProps {
  expert: {
    id: string
    name: string
    avatar: string
    hourlyRate: number
    calendlyLink?: string
  }
  onComplete?: (bookingData: BookingData) => void
  onCancel?: () => void
}

interface BookingData {
  expertId: string
  scheduledAt: string
  duration: number
  price: number
  isBlind: boolean
}

type Step = 'duration' | 'schedule' | 'payment' | 'confirmation'

export function BookingFlow({ expert, onComplete, onCancel }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('duration')
  const [selectedDuration, setSelectedDuration] = useState<60 | 120 | 180>(60)
  const [isBlindBooking, setIsBlindBooking] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const { playClick, playSuccess } = useSounds()

  const platformFee = 0.15
  const basePrice = (expert.hourlyRate * selectedDuration) / 60
  const fee = basePrice * platformFee
  const totalPrice = basePrice + fee

  const steps: Step[] = ['duration', 'schedule', 'payment', 'confirmation']
  const currentStepIndex = steps.indexOf(currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const handleNext = () => {
    playClick?.()
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const handleBack = () => {
    playClick?.()
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex])
    }
  }

  const handleComplete = () => {
    playSuccess?.()
    const bookingData: BookingData = {
      expertId: expert.id,
      scheduledAt: selectedDate || new Date().toISOString(),
      duration: selectedDuration,
      price: totalPrice,
      isBlind: isBlindBooking
    }
    onComplete?.(bookingData)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
              <span className="font-semibold">{Math.round(progress)}% Complete</span>
            </div>
            <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'duration' && (
            <DurationStep
              expert={expert}
              selectedDuration={selectedDuration}
              onSelectDuration={setSelectedDuration}
              isBlindBooking={isBlindBooking}
              onToggleBlind={setIsBlindBooking}
              basePrice={basePrice}
              platformFee={fee}
              totalPrice={totalPrice}
            />
          )}

          {currentStep === 'schedule' && (
            <ScheduleStep
              expert={expert}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentStep
              expert={expert}
              duration={selectedDuration}
              totalPrice={totalPrice}
              isBlind={isBlindBooking}
            />
          )}

          {currentStep === 'confirmation' && (
            <ConfirmationStep
              expert={expert}
              duration={selectedDuration}
              scheduledAt={selectedDate}
              totalPrice={totalPrice}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {/* Navigation */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={currentStepIndex === 0 ? onCancel : handleBack}
              variant="outline"
              size="lg"
              className="border-white/10 hover:bg-white/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {currentStepIndex === 0 ? 'Cancel' : 'Back'}
            </Button>

            <div className="flex-1" />

            {currentStep === 'confirmation' ? (
              <Button
                onClick={handleComplete}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Check className="mr-2 h-5 w-5" />
                Confirm Booking
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                size="lg"
                disabled={currentStep === 'schedule' && !selectedDate}
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Duration Selection Step
function DurationStep({
  expert,
  selectedDuration,
  onSelectDuration,
  isBlindBooking,
  onToggleBlind,
  basePrice,
  platformFee,
  totalPrice
}: {
  expert: { name: string; hourlyRate: number }
  selectedDuration: 60 | 120 | 180
  onSelectDuration: (duration: 60 | 120 | 180) => void
  isBlindBooking: boolean
  onToggleBlind: (blind: boolean) => void
  basePrice: number
  platformFee: number
  totalPrice: number
}) {
  const durations: Array<{ value: 60 | 120 | 180; label: string; recommended?: boolean }> = [
    { value: 60, label: '1 Hour', recommended: true },
    { value: 120, label: '2 Hours' },
    { value: 180, label: '3 Hours' }
  ]

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Choose Session Duration</CardTitle>
        <CardDescription>Select how long you'd like to practice with {expert.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Duration Options */}
        <div className="grid gap-4 md:grid-cols-3">
          {durations.map((duration) => {
            const price = (expert.hourlyRate * duration.value) / 60
            const isSelected = selectedDuration === duration.value
            
            return (
              <motion.button
                key={duration.value}
                onClick={() => onSelectDuration(duration.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative p-6 rounded-xl border-2 transition-all
                  ${isSelected
                    ? 'border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20'
                    : 'border-white/10 bg-white/5 hover:border-violet-500/50'
                  }
                `}
              >
                {duration.recommended && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-0">
                    Recommended
                  </Badge>
                )}
                <div className="flex items-center justify-center mb-3">
                  <Clock className={`h-8 w-8 ${isSelected ? 'text-violet-400' : 'text-muted-foreground'}`} />
                </div>
                <p className="text-lg font-bold mb-1">{duration.label}</p>
                <p className="text-2xl font-bold text-violet-400">${price.toFixed(2)}</p>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <Check className="h-5 w-5 text-violet-400" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
        {/* Blind Booking Toggle */}
        <motion.div
          className="p-4 rounded-xl border border-white/10 bg-white/5"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isBlindBooking ? <EyeOff className="h-5 w-5 text-violet-400" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                <h3 className="font-semibold">Blind Booking</h3>
                <Badge variant="outline" className="text-xs">Optional</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Both you and the expert remain anonymous until after the session. Names revealed upon completion.
              </p>
            </div>
            <Button
              onClick={() => onToggleBlind(!isBlindBooking)}
              variant={isBlindBooking ? "default" : "outline"}
              className={isBlindBooking ? "bg-violet-600 hover:bg-violet-700" : ""}
            >
              {isBlindBooking ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </motion.div>

        {/* Price Breakdown */}
        <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-3">Price Breakdown</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Session Fee ({selectedDuration} min)</span>
            <span className="font-medium">${basePrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee (15%)</span>
            <span className="font-medium">${platformFee.toFixed(2)}</span>
          </div>
          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-bold text-violet-400">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span>100% Money-back guarantee on your first session</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Schedule Selection Step
function ScheduleStep({
  expert,
  selectedDate,
  onSelectDate
}: {
  expert: { name: string; calendlyLink?: string }
  selectedDate: string
  onSelectDate: (date: string) => void
}) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Choose a Time</CardTitle>
        <CardDescription>Select an available time slot with {expert.name}</CardDescription>
      </CardHeader>
      <CardContent>
        {expert.calendlyLink ? (
          <div className="min-h-[600px] rounded-xl overflow-hidden border border-white/10">
            <iframe
              src={expert.calendlyLink}
              width="100%"
              height="600"
              frameBorder="0"
              title="Schedule Session"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-muted-foreground py-8">
              Calendar integration coming soon. For now, please contact the expert directly.
            </p>
            <Button
              onClick={() => onSelectDate(new Date().toISOString())}
              className="w-full"
              variant="outline"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Request Custom Time
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Payment Step
function PaymentStep({
  expert,
  duration,
  totalPrice,
  isBlind
}: {
  expert: { name: string; avatar: string }
  duration: number
  totalPrice: number
  isBlind: boolean
}) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Payment</CardTitle>
        <CardDescription>Secure payment powered by Stripe Connect</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                {expert.avatar}
              </div>
              <div className="flex-1">
                <p className="font-medium">{isBlind ? 'Anonymous Expert' : expert.name}</p>
                <p className="text-sm text-muted-foreground">{duration} minute session</p>
              </div>
              <p className="text-xl font-bold text-violet-400">${totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Stripe Payment Form Placeholder */}
        <div className="p-6 rounded-xl border-2 border-dashed border-white/20 text-center space-y-4">
          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">
            Stripe Connect integration goes here
          </p>
          <p className="text-xs text-muted-foreground">
            Payment processing will be added in next phase
          </p>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="h-4 w-4 text-green-400 mt-0.5" />
          <p>
            Your payment is held in escrow until the session is completed. 
            If you're not satisfied, request a full refund within 24 hours.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Confirmation Step
function ConfirmationStep({
  expert,
  duration,
  scheduledAt,
  totalPrice
}: {
  expert: { name: string; avatar: string }
  duration: number
  scheduledAt: string
  totalPrice: number
}) {
  const formattedDate = new Date(scheduledAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Review & Confirm</CardTitle>
        <CardDescription>Double-check your booking details before confirming</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-xl">
              {expert.avatar}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{expert.name}</p>
              <p className="text-sm text-muted-foreground">Interview Expert</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-violet-400" />
                <p className="font-semibold">Duration</p>
              </div>
              <p className="text-lg">{duration} minutes</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-violet-400" />
                <p className="font-semibold">Scheduled</p>
              </div>
              <p className="text-sm">{formattedDate}</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-violet-400" />
                <p className="font-semibold">Total Payment</p>
              </div>
              <p className="text-3xl font-bold text-violet-400">${totalPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="space-y-3 p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <h4 className="font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-violet-400" />
            What happens next?
          </h4>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• You'll receive a confirmation email with a video session link</li>
            <li>• Your payment is held securely in escrow until session completion</li>
            <li>• Join the session 5 minutes early to test your setup</li>
            <li>• After the session, you can rate and review the expert</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
