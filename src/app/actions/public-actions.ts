'use server'

import { db } from "@/lib/db"

export async function getShopBySlug(slug: string) {
    const shop = await db.shop.findUnique({
        where: { slug },
        include: {
            prizes: {
                orderBy: { probability: 'asc' } // Or however we want to sort
            }
        }
    })
    return shop
}

export async function joinCampaign(shopId: string, name: string, phone: string) {
    // Check if customer exists for this shop
    let customer = await db.customer.findFirst({
        where: {
            shopId,
            phone
        }
    })

    if (!customer) {
        customer = await db.customer.create({
            data: {
                name,
                phone,
                shopId
            }
        })
    }

    // Return customer ID to allow spinning
    return { success: true, customerId: customer.id }
}

export async function spinWheel(shopId: string, customerId: string) {
    // 1. Get Prizes
    const prizes = await db.prize.findMany({
        where: { shopId }
    })

    if (prizes.length === 0) {
        throw new Error("No prizes configured")
    }

    // 2. Weighted Random
    const totalWeight = prizes.reduce((sum, p) => sum + p.probability, 0)
    let random = Math.random() * totalWeight
    let selectedPrize = prizes[0]

    for (const prize of prizes) {
        if (random < prize.probability) {
            selectedPrize = prize
            break
        }
        random -= prize.probability
    }

    // 3. Record Win
    const win = await db.win.create({
        data: {
            shopId,
            customerId,
            prizeId: selectedPrize.id
        }
    })

    return {
        prize: selectedPrize.name,
        color: selectedPrize.color,
        winId: win.id
    }
}
