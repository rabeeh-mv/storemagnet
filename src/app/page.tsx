"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GateForm } from "@/components/customer/GateForm"
import { SpinWheel } from "@/components/customer/SpinWheel"
import { RedemptionScreen } from "@/components/customer/RedemptionScreen"
import { PartyPopper } from "lucide-react"

type Step = "GATE" | "WHEEL" | "REDEEM"

export default function Home() {
  const [step, setStep] = useState<Step>("GATE")
  const [customer, setCustomer] = useState<{ name: string; phone: string } | null>(null)
  const [prize, setPrize] = useState<{ label: string; color: string } | null>(null)

  const handleGateComplete = (data: { name: string; phone: string }) => {
    setCustomer(data)
    setStep("WHEEL")
  }

  const handleWin = (wonPrize: any) => {
    setPrize(wonPrize)
    // Add a small delay for celebration before showing redemption
    setTimeout(() => {
      setStep("REDEEM")
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 overflow-hidden relative">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-300/20 rounded-full blur-3xl animate-bounce" />
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center gap-6">

        {/* Header - Only show on Gate and Wheel */}
        {step !== "REDEEM" && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center text-white space-y-2"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <PartyPopper className="w-8 h-8 text-yellow-300" />
              <h1 className="text-3xl font-black tracking-tight drop-shadow-md">StoreMagnet</h1>
            </div>
            <p className="text-white/90 font-medium">Win a free gift with every visit!</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === "GATE" && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full"
            >
              <GateForm onComplete={handleGateComplete} />
            </motion.div>
          )}

          {step === "WHEEL" && (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="w-full"
            >
              <CardWrapper title={`Hi, ${customer?.name.split(' ')[0]}!`}>
                <SpinWheel
                  prizes={[
                    { id: "1", label: "Free Drink", color: "#FF6B6B" },
                    { id: "2", label: "5% Off", color: "#4ECDC4" },
                    { id: "3", label: "Free Dessert", color: "#FFE66D" },
                    { id: "4", label: "Try Again", color: "#1A535C" },
                    { id: "5", label: "10% Off", color: "#FF9F1C" },
                    { id: "6", label: "Mystery", color: "#2E2E2E" },
                  ]}
                  onWin={handleWin}
                />
              </CardWrapper>
            </motion.div>
          )}

          {step === "REDEEM" && prize && (
            <motion.div
              key="redeem"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <RedemptionScreen prize={prize} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function CardWrapper({ children, title }: { children: React.ReactNode, title?: string }) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center space-y-6">
      {title && <h2 className="text-2xl font-bold text-center text-zinc-800">{title}</h2>}
      {children}
    </div>
  )
}
