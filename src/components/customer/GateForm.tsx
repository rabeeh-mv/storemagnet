"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Gift, ArrowRight } from "lucide-react"

interface GateFormProps {
    onComplete: (data: { name: string; phone: string }) => void
    isLoading?: boolean
}

export function GateForm({ onComplete, isLoading = false }: GateFormProps) {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && phone.length >= 10 && !isLoading) {
            onComplete({ name, phone })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md px-4"
        >
            <Card className="w-full border-none shadow-xl bg-white/90 backdrop-blur-md dark:bg-zinc-900/90">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Gift className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Unlock Your Reward
                    </CardTitle>
                    <CardDescription className="text-base">
                        Enter your details to spin the wheel and win exclusive prizes!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="h-12 bg-white/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">WhatsApp Number</label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="00000 00000"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="h-12 bg-white/50"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-opacity"
                        >
                            {isLoading ? "Starting..." : <>Start Playing <ArrowRight className="ml-2 w-5 h-5" /></>}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}
