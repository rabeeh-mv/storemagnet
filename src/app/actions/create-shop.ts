'use server'
import { db } from '@/lib/db';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function createShop(formData: FormData) {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const shopName = formData.get('name') as string;

    // 1. Find the local owner ID using Clerk ID
    const owner = await db.owner.findUnique({
        where: { clerkId: user.id }
    });

    if (!owner) throw new Error("Owner not found");

    // Generate a simple slug
    const slug = shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // 2. Create the shop
    await db.shop.create({
        data: {
            name: shopName,
            slug: slug + '-' + Math.random().toString(36).substring(2, 7), // Ensure uniqueness
            ownerId: owner.id
        }
    });

    revalidatePath('/dashboard');
}