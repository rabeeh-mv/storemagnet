"use client"

import { useRef } from "react"
import QRCode from "react-qr-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Printer } from "lucide-react"

export function QRCodeCard() {
    const svgRef = useRef<any>(null)

    // In a real app, this URL would be dynamic based on the shop ID
    // For MVP, we point to the current hosted URL or localhost
    const shopUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"

    const handleDownload = () => {
        const svg = svgRef.current
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            const pngFile = canvas.toDataURL("image/png")

            const downloadLink = document.createElement("a")
            downloadLink.download = "StoreMagnet-QR.png"
            downloadLink.href = pngFile
            downloadLink.click()
        }

        img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <Card className="w-full max-w-sm mx-auto shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
                <CardTitle>Your Shop QR Code</CardTitle>
                <CardDescription>Print this and place it on your tables.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                <div className="border-4 border-black p-4 rounded-xl">
                    <QRCode
                        // @ts-ignore
                        ref={svgRef}
                        value={shopUrl}
                        size={200}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1">
                    <Download className="mr-2 w-4 h-4" /> Download PNG
                </Button>
            </CardFooter>
        </Card>
    )
}
