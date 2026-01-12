import { getShopDetails } from "@/app/actions/settings-actions"
import { ShopSettingsForm } from "@/components/dashboard/ShopSettingsForm"

export default async function SettingsPage() {
    const shop = await getShopDetails()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account and shop settings.</p>
            </div>
            <ShopSettingsForm initialShop={shop} />
        </div>
    )
}
