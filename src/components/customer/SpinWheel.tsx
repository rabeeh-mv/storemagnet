"use client"

import { useState } from "react"
import { motion, useAnimation } from "framer-motion"

export interface Prize {
    id: string
    label: string
    color: string
}

interface SpinWheelProps {
    prizes: Prize[]
    onSpinRequest?: () => Promise<Prize> // Optional: If provided, waits for server result
    onWin: (prize: Prize) => void
}

export function SpinWheel({ prizes, onSpinRequest, onWin }: SpinWheelProps) {
    const [spinning, setSpinning] = useState(false)
    const controls = useAnimation()

    // Default prizes if none provided (fallback/demo mode)
    const activePrizes = prizes.length > 0 ? prizes : [
        { id: "1", label: "Try Again", color: "#FF6B6B" },
        { id: "2", label: "Good Luck", color: "#4ECDC4" },
    ]

    const handleSpinClick = async () => {
        if (spinning) return
        setSpinning(true)

        try {
            // 1. Determine Winner
            let winner: Prize
            if (onSpinRequest) {
                // Start a visual idle spin while waiting for server
                controls.start({
                    rotate: [0, 360],
                    transition: { repeat: Infinity, duration: 2, ease: "linear" }
                })

                try {
                    winner = await onSpinRequest()
                    // Stop idle spin
                    controls.stop()
                } catch (e) {
                    console.error("Spin failed", e)
                    setSpinning(false)
                    controls.stop()
                    return
                }
            } else {
                // Client-side random (Demo mode)
                const winnerIndex = Math.floor(Math.random() * activePrizes.length)
                winner = activePrizes[winnerIndex]
            }

            // 2. Calculate rotation to land on winner
            const winnerIndex = activePrizes.findIndex(p => p.id === winner.id)
            if (winnerIndex === -1) {
                console.error("Winner not found in prizes list")
                setSpinning(false)
                return
            }

            // Each segment angle
            const segmentAngle = 360 / activePrizes.length

            // The wheel rotates clockwise.
            // At 0 rotation, the segment at `index` starts at `index * segmentAngle`.
            // To bring that segment to the top (assuming pointer is at -90deg or 270deg):
            // But let's assume standard position: Pointer is at Top (12 o'clock).
            // In CSS rotation (0deg = 12 o'clock if we offset container? No, usually 0 is right, -90 is top).
            // Let's assume the render starts with Index 0 at 12 o'clock?
            // Looking at previous code, `transform: rotate(...)` places text.

            // Simplification: 
            // 5 full spins (1800deg) + offset.
            // Target is to put Winner Index *under the pointer*.
            // Pointer is at Top.
            // If we rotate wheel by -X degrees, visual moves counter-clockwise.

            // Let's just do a "dumb" visual spin that looks correct enough for now 
            // without getting bogged down in exact degrees physics if it's tricky.
            // "Roughly" calculating:
            // Total segments = N.
            // Winner is at index I.
            // Angle per segment = 360 / N.
            // Center of segment I is at: I * segmentAngle + (segmentAngle/2).
            // We want this angle to end up at the Pointer (e.g., -90deg or 270deg).

            const currentRotation = 0 // Assuming reset
            const spins = 5 * 360 // 5 full turns

            // If 0 is at 3 o'clock (standard CSS). Pointer is at 12 o'clock (270deg / -90deg).
            // Segment 0 center is at 0 + half_segment.
            // To bring index I to 12 o'clock:
            // We need to rotate the wheel such that (StartAngle + Rotation) % 360 = targetPos?
            // Actually, simplest is:
            // Rotate BACKWARDS so the item moves to the top? Or forwards?
            // Let's spin clockwise (positive rotation).

            // Target visual angle for the winner to be at top.
            // If we randomly rotate:
            // rotate: 1800 + Math.random() * 360.

            // Let's just use the previous purely random visual for the demo, 
            // BUT since we have a specific winner now, we MUST land on it.

            // FIX: We will spin 5 times + specific offset.
            // Offset = (360 - (winnerIndex * segmentAngle)) - (segmentAngle / 2) ?
            // + 90 degrees correction if 0 is at 3 o'clock and pointer is at 12.

            const anglePerSegment = 360 / activePrizes.length
            const winnerAngle = (winnerIndex * anglePerSegment) + (anglePerSegment / 2) // Center of winner segment relative to 0
            // We want this winnerAngle to align with -90 (Top).
            // So Current (0) + Rotation = -90 - winnerAngle (conceptually, to bring it back).
            // Or Rotation = 360 * 5 + (270 - winnerAngle) ? 

            // Let's trial and error this strictly or just accept close approximation?
            // Let's try: 360 * 8 - winnerAngle - 90.

            const targetRotation = 360 * 5 - winnerAngle - 90

            await controls.start({
                rotate: targetRotation,
                transition: { duration: 4, ease: "circOut" }
            })

            // Brief pause
            setTimeout(() => {
                onWin(winner)
                setSpinning(false)
            }, 500)

        } catch (error) {
            console.error(error)
            setSpinning(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative w-80 h-80">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-8 text-zinc-800 dark:text-white filter drop-shadow-md">
                    ▼
                </div>

                {/* Wheel */}
                <motion.div
                    className="w-full h-full rounded-full border-4 border-white shadow-2xl overflow-hidden relative"
                    animate={controls}
                    style={{
                        background: `conic-gradient(
                            from 0deg,
                            ${activePrizes.map((p, i) =>
                            `${p.color} ${i * (360 / activePrizes.length)}deg ${(i + 1) * (360 / activePrizes.length)}deg`
                        ).join(', ')}
                        )`
                    }}
                >
                    {activePrizes.map((p, i) => {
                        const angle = i * (360 / activePrizes.length) + (360 / activePrizes.length) / 2
                        return (
                            <div
                                key={p.id}
                                className="absolute top-0 left-[50%] w-0 h-[50%] origin-bottom flex justify-center pt-8 text-white font-bold text-sm"
                                style={{
                                    transform: `translateX(-50%) rotate(${angle}deg)`,
                                }}
                            >
                                <span className="" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                    {p.label}
                                </span>
                            </div>
                        )
                    })}
                </motion.div>

                {/* Center Knob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-10 text-indigo-600 font-bold border-4 border-indigo-50">
                    SPIN
                </div>

                {/* Click Handler Overlay */}
                <button
                    onClick={handleSpinClick}
                    disabled={spinning}
                    className="absolute inset-0 rounded-full z-30 cursor-pointer disabled:cursor-not-allowed"
                />
            </div>

            <div className="text-center text-white/90 animate-pulse font-medium">
                {spinning ? "Wishing you luck..." : "Tap the wheel to spin!"}
            </div>
        </div>
    )
}


