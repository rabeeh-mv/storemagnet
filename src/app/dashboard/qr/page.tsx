import { QRCodeCard } from "@/components/dashboard/QRCodeCard"

export default function QRPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">QR Generator</h2>
                <p className="text-muted-foreground">Download your unique QR code to start collecting leads.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <QRCodeCard />

                {/* Helper Instructions */}
                <div className="md:col-span-1 lg:col-span-2 space-y-4 p-6 border rounded-xl bg-zinc-50 dark:bg-zinc-900">
                    <h3 className="font-semibold text-lg">Quick Tips</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <li>Place the QR code on every table using a small acrylic standee.</li>
                        <li>Ensure the standee has a clear Call-to-Action like <b>"Scan to Spin & Win!"</b></li>
                        <li>Train your staff to mention the game when seating customers.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
