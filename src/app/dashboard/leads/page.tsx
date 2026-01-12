import { getLeads } from "@/app/actions/leads-actions"
import { LeadTable } from "@/components/dashboard/LeadTable"

export default async function LeadsPage() {
    const leads = await getLeads()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
                <p className="text-muted-foreground">Manage and export your customer data.</p>
            </div>
            <LeadTable leads={leads} />
        </div>
    )
}
