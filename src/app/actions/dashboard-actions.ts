'use server'

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { Win, Prize, Customer } from "@prisma/client"

export async function getDashboardStats() {
    const { userId } = await auth()

    if (!userId) {
        return null
    }

    const owner = await db.owner.findUnique({
        where: { clerkId: userId },
        include: {
            shops: {
                include: {
                    prizes: true
                }
            }
        }
    })

    if (!owner || owner.shops.length === 0) {
        return {
            totalLeads: 0,
            totalScans: 0,
            redeemedPrizes: 0,
            activeCampaigns: 0,
            recentActivity: [],
            topPrizes: []
        }
    }

    const shop = owner.shops[0] // Assuming single shop for now

    // Parallelize queries for performance
    const [totalLeads, wins, activeCampaigns] = await Promise.all([
        db.customer.count({
            where: { shopId: shop.id }
        }),
        db.win.findMany({
            where: { shopId: shop.id },
            include: {
                prize: true,
                customer: true
            },
            orderBy: { createdAt: 'desc' }
        }),
        db.prize.count({
            where: { shopId: shop.id } // Ideally filter by some 'active' status if it existed
        })
    ])

    const totalScans = wins.length
    const redeemedPrizes = wins.filter((w: Win & { prize: Prize; customer: Customer }) => w.redeemed).length

    // Top Prizes Logic
    const prizeCounts: Record<string, number> = {}
    wins.forEach((win: Win & { prize: Prize; customer: Customer }) => {
        const prizeName = win.prize.name
        prizeCounts[prizeName] = (prizeCounts[prizeName] || 0) + 1
    })

    const topPrizes = Object.entries(prizeCounts)
        .map(([name, count]: [string, number]) => ({ name, count }))
        .sort((a: { name: string; count: number }, b: { name: string; count: number }) => b.count - a.count)
        .slice(0, 5) // Top 5
        .map((p: { name: string; count: number }) => ({
            ...p,
            percentage: totalScans > 0 ? Math.round((p.count / totalScans) * 100) : 0
        }))

    const recentActivity = wins.slice(0, 5).map((win: Win & { prize: Prize; customer: Customer }) => ({
        id: win.id,
        prize: win.prize.name,
        customer: win.customer.name,
        redeemed: win.redeemed,
        time: win.createdAt.toISOString()
    }))

    return {
        totalLeads,
        totalScans,
        redeemedPrizes,
        activeCampaigns, // Or just counts of prizes as proxy for now
        recentActivity,
        topPrizes
    }
}
