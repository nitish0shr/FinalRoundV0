"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { DollarSign, TrendingUp, Wallet, Download, Sparkles, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { AnimatedCounter } from "@/components/animated"

interface MoneyPrinterProps {
  totalEarnings: number
  pendingPayouts: number
  thisWeekEarnings: number
  averageSessionRate: number
  totalSessions: number
  nextPayoutDate?: string
  onRequestPayout?: () => void
}

export function MoneyPrinterDashboard({
  totalEarnings = 0,
  pendingPayouts = 0,
  thisWeekEarnings = 0,
  averageSessionRate = 0,
  totalSessions = 0,
  nextPayoutDate,
  onRequestPayout
}: MoneyPrinterProps) {
  const [showMoneyRain, setShowMoneyRain] = useState(false)
  const [chaChing, setChaChing] = useState(false)
  const [floatingDollars, setFloatingDollars] = useState<number[]>([])

  // Trigger money rain when earnings increase
  useEffect(() => {
    if (thisWeekEarnings > 0) {
      triggerMoneyRain()
    }
  }, [thisWeekEarnings])

  const triggerMoneyRain = () => {
    setShowMoneyRain(true)
    setChaChing(true)
    playChaChing()
    const dollars = Array.from({ length: 15 }, (_, i) => i)
    setFloatingDollars(dollars)
    setTimeout(() => {
      setShowMoneyRain(false)
      setChaChing(false)
      setFloatingDollars([])
    }, 3000)
  }

  const playChaChing = () => {
    console.log('💰 CHA-CHING!')
  }

  const canRequestPayout = pendingPayouts >= 50

  return (
    <div className="space-y-6 relative">
      <AnimatePresence>
        {showMoneyRain && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {floatingDollars.map((id) => (
              <motion.div
                key={id}
                initial={{
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 500,
                  y: -50,
                  rotate: Math.random() * 360,
                  scale: 0.5 + Math.random() * 0.5
                }}
                animate={{
                  y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                  rotate: Math.random() * 720,
                  x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 + Math.random() * 2, ease: "linear" }}
                className="absolute text-6xl"
              >
                💵
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        animate={chaChing ? { scale: [1, 1.05, 1.02, 1.05, 1], rotate: [0, -2, 2, -1, 0] } : {}}
        transition={{ duration: 0.6 }}
      >
        <Card className="relative overflow-hidden border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 via-white/5 to-emerald-500/10 backdrop-blur-xl shadow-2xl shadow-green-500/20">
          <div className="absolute inset-0 opacity-30">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            />
          </div>

          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
          />

          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Wallet className="h-6 w-6 text-green-400" />
                </div>
                Total Earnings
              </CardTitle>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 space-y-6">
            <motion.div className="space-y-2" whileHover={{ scale: 1.02 }}>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl md:text-7xl font-bold text-gradient-gold">
                  $<AnimatedCounter value={totalEarnings} duration={2000} />
                </span>
                <motion.div
                  animate={{ y: [0, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground">
                From {totalSessions} coaching session{totalSessions !== 1 ? 's' : ''}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground mb-1">This Week</p>
                <p className="text-2xl font-bold text-green-400">
                  ${thisWeekEarnings.toFixed(2)}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <p className="text-sm text-muted-foreground mb-1">Avg. Rate</p>
                <p className="text-2xl font-bold text-violet-400">
                  ${averageSessionRate}/hr
                </p>
              </div>
            </div>
            <motion.div
              className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-green-500/10 border border-yellow-500/30"
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(234, 179, 8, 0.3)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold">Pending Payout</span>
                </div>
                <span className="text-2xl font-bold text-yellow-400">
                  ${pendingPayouts.toFixed(2)}
                </span>
              </div>
              {nextPayoutDate && (
                <p className="text-xs text-muted-foreground">Next payout: {nextPayoutDate}</p>
              )}
              {canRequestPayout ? (
                <Button
                  onClick={() => { onRequestPayout?.(); triggerMoneyRain() }}
                  className="w-full mt-3 bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Request Payout
                </Button>
              ) : (
                <div className="mt-3 text-center">
                  <p className="text-xs text-muted-foreground">
                    Minimum payout: $50 (${(50 - pendingPayouts).toFixed(2)} to go)
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(pendingPayouts / 50) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
            <Button
              onClick={triggerMoneyRain}
              variant="outline"
              size="sm"
              className="w-full border-green-500/30 hover:bg-green-500/10 text-green-400"
            >
              <Zap className="mr-2 h-4 w-4" />
              Test Money Printer 💰
            </Button>
          </CardContent>

          <motion.div
            className="absolute top-4 right-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-6 w-6 text-yellow-400 opacity-50" />
          </motion.div>
        </Card>
      </motion.div>

      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Earnings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <EarningsRow label="Total Gross" amount={totalEarnings} color="text-green-400" />
            <EarningsRow label="Platform Fee (15%)" amount={totalEarnings * 0.15} color="text-orange-400" isNegative />
            <div className="border-t border-white/10 pt-3">
              <EarningsRow label="Your Net Earnings" amount={totalEarnings * 0.85} color="text-green-400" isBold />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EarningsRow({ label, amount, color, isNegative = false, isBold = false }: {
  label: string; amount: number; color: string; isNegative?: boolean; isBold?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${isBold ? 'font-bold' : 'text-muted-foreground'}`}>
        {label}
      </span>
      <span className={`${color} ${isBold ? 'text-xl font-bold' : 'text-base'}`}>
        {isNegative ? '-' : ''}${amount.toFixed(2)}
      </span>
    </div>
  )
}
