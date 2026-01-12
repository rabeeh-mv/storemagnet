import 'dotenv/config'
import { db } from "../src/lib/db.ts"

async function verifyDashboardData() {
    console.log("Verifying Dashboard Data Logic...")

    // 1. Get an Owner (Mocking logged in user)
    const owner = await db.owner.findFirst({
        include: { shops: true }
    })

    if (!owner) {
        console.log("No owners found in DB. Cannot verify data fetching.")
        return
    }

    console.log(`Found owner: ${owner.email}`)

    if (owner.shops.length === 0) {
        console.log("Owner has no shops.")
        return
    }

    const shop = owner.shops[0]
    console.log(`Checking shop: ${shop.name} (${shop.id})`)

    // 2. Simulate the logic from dashboard-actions
    const totalLeads = await db.customer.count({
        where: { shopId: shop.id }
    })
    console.log(`Total Leads: ${totalLeads}`)

    const wins = await db.win.findMany({
        where: { shopId: shop.id },
        include: { prize: true }
    })

    const totalScans = wins.length
    console.log(`Total Scans (Wins): ${totalScans}`)

    const redeemedPrizes = wins.filter((w: any) => w.redeemed).length
    console.log(`Redeemed Prizes: ${redeemedPrizes}`)

    const activeCampaigns = await db.prize.count({
        where: { shopId: shop.id }
    })
    console.log(`Active Campaigns (Prizes): ${activeCampaigns}`)

    console.log("Verification Logic Complete.")
}

verifyDashboardData()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })
