'use server'

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function getLeads() {
    const { userId } = await auth()

    if (!userId) {
        return []
    }

    const owner = await db.owner.findUnique({
        where: { clerkId: userId },
        include: {
            shops: true
        }
    })

    if (!owner || owner.shops.length === 0) {
        return []
    }

    const shop = owner.shops[0]

    const wins = await db.win.findMany({
        where: { shopId: shop.id },
        include: {
            customer: true,
            prize: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return wins.map(win => ({
        id: win.id,
        name: win.customer.name,
        phone: win.customer.phone,
        date: win.createdAt.toISOString().split('T')[0], // YYYY-MM-DD
        prize: win.prize.name,
        status: win.redeemed ? "Redeemed" : "Pending"
    }))
}
