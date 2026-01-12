# Database Integration Guide for ScanPro

This guide explains how to integrate and use the PostgreSQL database with Prisma in your Next.js application.

## 1. Prerequisites

Ensure you have the following configured:

- **Environment Variable**: Your `.env` file must contain the `DATABASE_URL` for your PostgreSQL database.
  ```env
  DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
  ```
- **Dependencies**: You already have `@prisma/client` and `prisma` installed.

## 2. Setting up the Database (Where to get the Key)

Prisma is an **ORM** (a tool to talk to the database), not the database itself. You need a hosted **PostgreSQL** database.

### Recommended Providers (Free Tier Available):

**Option A: Neon (Easiest)**
1.  Go to [neon.tech](https://neon.tech) and Sign Up.
2.  Create a new project.
3.  Copy the **Connection String** provided in the dashboard.
4.  It will look like: `postgres://neondb_owner:AbC123...@ep-cool-....aws.neon.tech/neondb?sslmode=require`

**Option B: Supabase**
1.  Go to [supabase.com](https://supabase.com) and Sign Up.
2.  Create a new project.
3.  Go to **Project Settings** -> **Database**.
4.  Under **Connection String** -> **URI**, copy the string. (You will need to insert your password manually).

### Paste the Key
Open your `.env` file in this project and paste the URL:
```env
DATABASE_URL="your_copied_connection_string_here"
```


## 2. Initialize the Database Client

We have created a singleton Prisma client instance at `src/lib/db.ts`. This ensures we don't exhaust database connections during hot-reloading in development.

**File:** `src/lib/db.ts`
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

## 3. Syncing the Schema

Whenever you modify `prisma/schema.prisma`, you need to sync the changes with your database and regenerate the client.

**Run this command to push schema changes to the DB:**
```bash
npx prisma db push
```

**Run this command to update the TypeScript client (types):**
```bash
npx prisma generate
```

## 4. How to Use in Your App

You can straightforwardly import `db` from `@/lib/db` in your **Server Components**, **Server Actions**, or **Route Handlers**.

### Example 1: Fetching Data (Server Component)

In `src/app/dashboard/page.tsx`:

```tsx
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
```

### Example 2: Creating Data (Server Action)

In `src/app/actions/create-shop.ts`:

```typescript
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
```

## 5. Next Steps

1.  **Check your `.env`**: Make sure `DATABASE_URL` is correct.
2.  **Push the Schema**: Run `npx prisma db push` to create the tables in your database.
3.  **Start Coding**: Import `db` and start building your features!
