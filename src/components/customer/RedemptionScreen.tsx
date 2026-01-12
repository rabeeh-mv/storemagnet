"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, MapPin } from "lucide-react"

interface RedemptionScreenProps {
    prize: { label: string; color: string }
}

export function RedemptionScreen({ prize }: RedemptionScreenProps) {
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const [isRedeeming, setIsRedeeming] = useState(false)

    useEffect(() => {
        if (isRedeeming && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
            return () => clearInterval(timer)
        }
    }, [isRedeeming, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const handleGoogleReview = () => {
        // Mock redirect
        window.open("https://maps.google.com", "_blank")
    }

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md px-4"
        >
            <Card className="border-2 border-primary/20 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-700">Congratulations!</CardTitle>
                    <p className="text-muted-foreground">You won:</p>
                    <div className="text-4xl font-black mt-2 text-primary">{prize.label}</div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {!isRedeeming ? (
                        <div className="text-center space-y-4">
                            <p className="text-sm text-zinc-500">
                                Show this screen to the staff to redeem your prize.
                            </p>
                            <Button
                                onClick={() => setIsRedeeming(true)}
                                size="lg"
                                className="w-full text-lg h-14 bg-green-600 hover:bg-green-700 animate-bounce"
                            >
                                Redeem Now
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
                            <p className="text-sm font-medium text-red-600 mb-2">Expires in:</p>
                            <div className="text-5xl font-mono font-bold text-red-600 flex items-center justify-center gap-2">
                                <Clock className="w-8 h-8" />
                                {formatTime(timeLeft)}
                            </div>
                            <p className="text-xs text-red-400 mt-2">Active Timer</p>
                        </div>
                    )}

                    <div className="pt-6 border-t">
                        <p className="text-center text-sm font-medium mb-3">While you wait...</p>
                        <Button
                            variant="outline"
                            className="w-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                            onClick={handleGoogleReview}
                        >
                            <MapPin className="mr-2 w-4 h-4" /> Rate us on Google Maps
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
