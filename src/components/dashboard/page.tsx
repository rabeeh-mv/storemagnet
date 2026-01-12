import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) return <div>Please sign in</div>;

    // Fetch the owner record associated with the logged-in user
    const owner = await db.owner.findUnique({
        where: { clerkId: user.id },
        include: { shops: true } // Include related shops
    });

    if (!owner) {
        return <div>Onboarding required</div>;
    }

    return (
        <div>
            <h1>Welcome {owner.email}</h1>
            <p>You have {owner.shops.length} shops.</p>
        </div>
    );
}