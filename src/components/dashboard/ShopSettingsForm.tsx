"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateShopName } from "@/app/actions/settings-actions"
import { createShop } from "@/app/actions/create-shop" // Using the robust creation action
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface ShopSettingsFormProps {
    initialShop: {
        id: string
        name: string
        slug: string
    } | null
}

export function ShopSettingsForm({ initialShop }: ShopSettingsFormProps) {
    const [name, setName] = useState(initialShop?.name || "")
    const [slug, setSlug] = useState(initialShop?.slug || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setName(val)
        // Auto-generate slug only if creating new shop and user hasn't heavily modified slug
        // or just simple auto-generation logic
        if (!initialShop) {
            const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            // Only update if slug is empty or looks like a draft of previous name
            if (!slug || slug.startsWith(generated.slice(0, -1))) {
                setSlug(generated)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            if (initialShop) {
                // Update mode (Only name for now, as slug changes break links)
                await updateShopName(initialShop.id, name)
                alert("Shop updated successfully")
            } else {
                // Create mode
                const formData = new FormData()
                formData.append('name', name)
                formData.append('slug', slug)
                await createShop(formData)
                // createShop will revalidate /dashboard, redirecting us there if we were blocked
                router.push('/dashboard')
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message || "An error occurred")
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
                        <Label htmlFor="name">Shop Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter shop name"
                            value={name}
                            onChange={handleNameChange}
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Unique Link ID {initialShop && "(Cannot be changed)"}</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-sm whitespace-nowrap">storemagnet.com/</span>
                            <Input
                                id="slug"
                                placeholder="my-shop"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                required
                                minLength={3}
                                disabled={!!initialShop} // Disable editing slug after creation to prevent breaking QR codes
                                className="font-mono text-sm"
                            />
                        </div>
                        {!initialShop && <p className="text-xs text-muted-foreground">This will be your shop's permanent URL.</p>}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
                            {error}
                        </div>
                    )}
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
