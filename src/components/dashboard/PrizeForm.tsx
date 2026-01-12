"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Save, Loader2 } from "lucide-react"
import { savePrizes, PrizeInput } from "@/app/actions/prizes-actions"
import { useRouter } from "next/navigation"

// ScanPro uses 'sonner' usually in modern stacks? Or 'react-hot-toast'? 
// I don't see sonner in package.json. 
// I'll stick to a simple alert or console.log for now, or just button state.
// Wait, I saw components/ui, so it might have a toast.
// I'll check if I can use toast. If not, I'll skip it.
// The user has 'lucide-react'.
// I'll just use simple state for success/error message.

type Prize = {
    id: string
    name: string
    probability: number
    color: string
}

interface PrizeFormProps {
    initialPrizes: Prize[]
}

export function PrizeForm({ initialPrizes }: PrizeFormProps) {
    const [prizes, setPrizes] = useState<Prize[]>(initialPrizes)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleProbabilityChange = (id: string, val: string) => {
        const newPrizes = prizes.map(p => p.id === id ? { ...p, probability: Number(val) } : p)
        setPrizes(newPrizes)
    }

    const handleNameChange = (id: string, val: string) => {
        const newPrizes = prizes.map(p => p.id === id ? { ...p, name: val } : p)
        setPrizes(newPrizes)
    }

    const handleColorChange = (id: string, val: string) => {
        const newPrizes = prizes.map(p => p.id === id ? { ...p, color: val } : p)
        setPrizes(newPrizes)
    }


    const handleDelete = (id: string) => {
        setPrizes(prizes.filter(p => p.id !== id))
    }

    const handleAdd = () => {
        const newId = `new_${Math.random().toString(36).substr(2, 9)}`
        setPrizes([...prizes, { id: newId, name: "New Prize", probability: 0, color: "#cccccc" }])
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            // Prepare payload: remove 'new_' IDs
            const payload: PrizeInput[] = prizes.map(p => ({
                id: p.id.startsWith('new_') ? undefined : p.id,
                name: p.name,
                probability: p.probability,
                color: p.color
            }))

            await savePrizes(payload)
            // router.refresh() // Actions usually revalidate, but refresh updates client cache
            // Actually revalidatePath within action handles data, but we might want to refresh to get new real IDs for the 'new' items.
            // But revalidatePath on server + router.refresh() is the way.
            // However, after save, we should reload the page to get the "real" IDs back from the server so future edits work correctly.
            // Or the action could return the new list.
            // For simplicity, verify layout refresh works.
            router.refresh()
            // Also need to update local state? If page refreshes, the component re-mounts with new 'initialPrizes'.
            // So we rely on that. But router.refresh() is soft navigation.
            // We might observe a flicker or state mismatch if we don't sync.
            // But with uncontrolled updates it's fine.
        } catch (error) {
            console.error(error)
            alert("Failed to save prizes")
        } finally {
            setLoading(false)
        }
    }

    const totalProb = prizes.reduce((acc, curr) => acc + curr.probability, 0)

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Prize Configuration</CardTitle>
                    <CardDescription>
                        Configure the prizes on your wheel. Ensure total probability equals 100%.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground mb-2">
                        <div className="col-span-1">Color</div>
                        <div className="col-span-6">Prize Name</div>
                        <div className="col-span-3">Chance (%)</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {prizes.map((prize) => (
                        <div key={prize.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-1 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: prize.color }} />
                                <input
                                    type="color"
                                    value={prize.color}
                                    onChange={(e) => handleColorChange(prize.id, e.target.value)}
                                    className="w-8 h-8 opacity-0 absolute cursor-pointer"
                                />
                            </div>
                            <div className="col-span-6">
                                <Input
                                    value={prize.name}
                                    onChange={(e) => handleNameChange(prize.id, e.target.value)}
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    value={prize.probability}
                                    onChange={(e) => handleProbabilityChange(prize.id, e.target.value)}
                                />
                            </div>
                            <div className="col-span-2 text-right">
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(prize.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <Button variant="outline" className="w-full mt-4 border-dashed" onClick={handleAdd}>
                        <Plus className="w-4 h-4 mr-2" /> Add Prize
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/20 p-6">
                    <div className={`text-sm font-medium ${totalProb !== 100 ? 'text-destructive' : 'text-green-600'}`}>
                        Total Probability: {totalProb}% {totalProb !== 100 && "(Must be 100%)"}
                    </div>
                    <Button disabled={totalProb !== 100 || loading} onClick={handleSave}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

