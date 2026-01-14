'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createShop } from '@/app/actions/create-shop'
import { Loader2 } from 'lucide-react'

export function CreateShopModal({ open }: { open: boolean }) {
    const [loading, setLoading] = useState(false)
    const [shopName, setShopName] = useState('')
    const [slug, setSlug] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Auto-generate slug from name if user hasn't typed in slug manually
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setShopName(name)
        if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, slug.length)) {
            setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('name', shopName)
            formData.append('slug', slug)
            await createShop(formData)
            // If successful, the page will revalidate and this modal will unmount
            // or we could force a refresh window.location.reload() if needed for full state reset
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Welcome to StoreMagnet!</DialogTitle>
                    <DialogDescription>
                        To get started, please create your shop. This will be your identity within the app.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Shop Name</Label>
                        <Input
                            id="name"
                            value={shopName}
                            onChange={handleNameChange}
                            placeholder="My Awesome Cafe"
                            required
                            minLength={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Unique Link ID</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-sm">storemagnet.com/</span>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                placeholder="my-awesome-cafe"
                                required
                                minLength={3}
                            />
                        </div>
                        <p className="text-xs text-zinc-500">This will be your shop's public URL.</p>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={loading || !shopName || !slug}>
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Shop
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
