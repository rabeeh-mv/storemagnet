import { getPrizes } from "@/app/actions/prizes-actions"
import { PrizeForm } from "@/components/dashboard/PrizeForm"

export default async function PrizesPage() {
    const prizes = await getPrizes()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Prizes</h2>
                <p className="text-muted-foreground">Customize what your customers can win.</p>
            </div>
            {/* We pass prizes. If strictly typed, might need to map or ensure Prisma dates vs strings. 
                Prize from Prisma has Dates. Client component expects JSON serializable (which Next.js handles for server components props... mostly).
                Wait, Next.js Server Actions return Serializable.
                But fetching in Page Component (Server Component) and passing to Client Component:
                Props must be serializable. Dates are NOT serializable directly in props from server to client unless converted to string or using superjson (if enabled).
                Next.js handles Date objects in server component props by warning usually.
                I should convert dates to strings or omit them if not needed.
                PrizeForm only needs id, name, probability, color.
                It doesn't use createdAt/updatedAt.
                I'll verify getPrizes return type.
             */}
            <PrizeForm initialPrizes={prizes.map(p => ({
                id: p.id,
                name: p.name,
                probability: p.probability,
                color: p.color
            }))} />
        </div>
    )
}
