import { getShopBySlug } from "@/app/actions/public-actions"
import { ShopPublicPage } from "@/components/public/ShopPublicPage"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params
    const shop = await getShopBySlug(slug)

    if (!shop) {
        notFound()
    }

    return (
        <ShopPublicPage shop={{
            id: shop.id,
            name: shop.name,
            prizes: shop.prizes.map(p => ({
                id: p.id,
                label: p.name,
                color: p.color
            }))
        }} />
    )
}
