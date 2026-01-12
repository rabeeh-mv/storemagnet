"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GateForm } from "@/components/customer/GateForm"
import { SpinWheel, Prize } from "@/components/customer/SpinWheel"
import { RedemptionScreen } from "@/components/customer/RedemptionScreen"
import { PartyPopper } from "lucide-react"
import { joinCampaign, spinWheel } from "@/app/actions/public-actions"

type Step = "GATE" | "WHEEL" | "REDEEM"

interface ShopPublicPageProps {
    shop: {
        id: string
        name: string
        prizes: Prize[]
    }
}

export function ShopPublicPage({ shop }: ShopPublicPageProps) {
    const [step, setStep] = useState<Step>("GATE")
    const [customer, setCustomer] = useState<{ id: string; name: string; phone: string } | null>(null)
    const [prize, setPrize] = useState<Prize | null>(null)
    const [loading, setLoading] = useState(false)

    const handleGateComplete = async (data: { name: string; phone: string }) => {
        setLoading(true)
        try {
            const res = await joinCampaign(shop.id, data.name, data.phone)
            if (res.success && res.customerId) {
                setCustomer({ ...data, id: res.customerId })
                setStep("WHEEL")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to join campaign. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleSpinRequest = async (): Promise<Prize> => {
        if (!customer) throw new Error("No customer")
        const result = await spinWheel(shop.id, customer.id)
        return {
            id: result.prize, // Note: Action returns prize name as 'prize', but let's assume mapping logic if needed or just use name
            // The action returns { prize: string, color: string, winId: string }
            // Our Prize interface needs id, label, color.
            // Let's adapt:
            id: result.winId, // Use winId as unique ID for this instance? Or strictly mapped?
            // Actually SpinWheel expects a Prize object that exists in the 'prizes' array to find index?
            // The 'prizes' prop in SpinWheel is used for rendering.
            // The 'onSpinRequest' returns the WON prize.
            // We need to return the Prize object that matches one in the list so SpinWheel can find the index.

            // Wait, standardizing:
            // The action returns: { prize: "Name", color: "#..." } mechanism.
            // We need to match it to our shop.prizes.
            label: result.prize,
            color: result.color
        }
    }

    // Adapter for SpinWheel which expects us to return the exact object ref or equal ID? 
    // The previous implementation of SpinWheel uses `activePrizes.findIndex(p => p.id === winner.id)`
    // So we need to ensure the ID matches.
    // The `spinWheel` action returns `prize` which is the NAME.
    // We should probably verify if we can match by Name or assume consistency.
    // Let's wrap handleSpinRequest to find the matching prize object from `shop.prizes`.

    const wrappedSpinRequest = async () => {
        if (!customer) throw new Error("No customer")
        const result = await spinWheel(shop.id, customer.id)

        // Find the prize in our local props that matches the result
        // The result.prize is the NAME.
        const matched = shop.prizes.find(p => p.label === result.prize)
        if (matched) {
            return matched
        }

        // Fallback if not found (shouldn't happen if sync)
        return {
            id: "unknown",
            label: result.prize,
            color: result.color
        }
    }


    const handleWin = (wonPrize: Prize) => {
        setPrize(wonPrize)
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

                {/* Header */}
                {step !== "REDEEM" && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center text-white space-y-2"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <PartyPopper className="w-8 h-8 text-yellow-300" />
                            <h1 className="text-3xl font-black tracking-tight drop-shadow-md">{shop.name}</h1>
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
                            <GateForm onComplete={handleGateComplete} isLoading={loading} />
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
                                    prizes={shop.prizes}
                                    onSpinRequest={wrappedSpinRequest}
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

