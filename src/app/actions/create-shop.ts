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

    // 2. Create the shop
    await db.shop.create({
        data: {
            name: shopName,
            ownerId: owner.id
        }
    });

    revalidatePath('/dashboard');
}