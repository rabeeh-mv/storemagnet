'use server'
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createShop(formData: FormData) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const shopName = formData.get('name') as string;
    let slug = formData.get('slug') as string;

    // Basic validation
    if (!shopName || shopName.length < 3) {
        throw new Error("Shop name must be at least 3 characters");
    }

    if (!slug || slug.length < 3) {
        // Fallback generation if empty (though UI should enforce it)
        slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Sanitize slug
    slug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '');

    // 1. Find the local owner ID using Clerk ID
    const owner = await db.owner.findUnique({
        where: { clerkId: user.id }
    });

    if (!owner) throw new Error("Owner not found");

    // Check availability (optional but good)
    const existing = await db.shop.findUnique({ where: { slug } });
    if (existing) {
        throw new Error("This Link ID is already taken. Please try another.");
    }

    // 2. Create the shop
    await db.shop.create({
        data: {
            name: shopName,
            slug: slug,
            ownerId: owner.id
        }
    });

    revalidatePath('/dashboard');
}