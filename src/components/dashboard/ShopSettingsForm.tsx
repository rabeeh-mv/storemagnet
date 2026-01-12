"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { updateShopName, createShop } from "@/app/actions/settings-actions"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ShopSettingsFormProps {
    initialShop: {
        id: string
        name: string
    } | null
}

export function ShopSettingsForm({ initialShop }: ShopSettingsFormProps) {
    const [name, setName] = useState(initialShop?.name || "")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (initialShop) {
                await updateShopName(initialShop.id, name)
                alert("Shop updated successfully")
            } else {
                await createShop(name)
                alert("Shop created successfully")
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Shop Details</CardTitle>
                <CardDescription>
                    {initialShop ? "Update your shop details." : "Create your shop to get started."}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Shop Name
                        </label>
                        <Input
                            id="name"
                            placeholder="Enter shop name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialShop ? "Save Changes" : "Create Shop"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
