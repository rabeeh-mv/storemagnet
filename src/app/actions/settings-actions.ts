'use server'

import { db } from "@/lib/db"
import { auth, currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function getShopDetails() {
    const { userId } = await auth()
    if (!userId) return null

    const owner = await db.owner.findUnique({
        where: { clerkId: userId },
        include: { shops: true }
    })

    if (!owner || owner.shops.length === 0) return null

    return {
        id: owner.shops[0].id,
        name: owner.shops[0].name
    }
}

export async function updateShopName(shopId: string, newName: string) {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    // Verify ownership
    const shop = await db.shop.findUnique({
        where: { id: shopId },
        include: { owner: true }
    })

    if (!shop || shop.owner.clerkId !== userId) {
        throw new Error("Unauthorized")
    }

    await db.shop.update({
        where: { id: shopId },
        data: { name: newName }
    })

    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function createShop(name: string) {
    const user = await currentUser()
    if (!user) throw new Error("Unauthorized")

    // Find or create Owner
    let owner = await db.owner.findUnique({
        where: { clerkId: user.id }
    })

    if (!owner) {
        const email = user.emailAddresses[0]?.emailAddress
        if (!email) throw new Error("Email required")

        owner = await db.owner.create({
            data: {
                clerkId: user.id,
                email: email
            }
        })
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `shop-${Date.now()}`

    await db.shop.create({
        data: {
            name,
            slug,
            ownerId: owner.id
        }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/settings')
    return { success: true }
}
