import { getDashboardStats } from "@/app/actions/dashboard-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Scan, Trophy, TrendingUp } from "lucide-react"
import { CreateShopModal } from "@/components/dashboard/CreateShopModal"

export default async function DashboardPage() {
    const stats = await getDashboardStats()

    if (!stats) {
        return <div className="p-8">Please log in to view your dashboard.</div>
    }

    return (
        <div className="space-y-6">
            <CreateShopModal open={!stats.hasShop} />
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                <p className="text-muted-foreground">Welcome back! Here's what's happening in your shop.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Leads"
                    value={stats.totalLeads.toString()}
                    description="Total customers"
                    icon={Users}
                />
                <StatsCard
                    title="Total Scans"
                    value={stats.totalScans.toString()}
                    description="Total checks"
                    icon={Scan}
                />
                <StatsCard
                    title="Prizes Redeemed"
                    value={stats.redeemedPrizes.toString()}
                    description={`${stats.totalScans > 0 ? Math.round((stats.redeemedPrizes / stats.totalScans) * 100) : 0}% redemption rate`}
                    icon={Trophy}
                />
                <StatsCard
                    title="Active Campaigns"
                    value={stats.activeCampaigns.toString()}
                    description="Active prizes"
                    icon={TrendingUp}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {stats.recentActivity.map((activity: { id: string; customer: string; prize: string; time: string; redeemed: boolean }) => (
                                    <div key={activity.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-sm">{activity.customer} won {activity.prize}</p>
                                            <p className="text-xs text-muted-foreground">{new Date(activity.time).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full ${activity.redeemed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {activity.redeemed ? 'Redeemed' : 'Pending'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground border-dashed border-2 rounded-md">
                                No recent activity
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Top Prizes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {stats.topPrizes.length > 0 ? (
                            <div className="space-y-4">
                                {stats.topPrizes.map((prize, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="flex-1 font-medium text-sm">{prize.name}</div>
                                        <div className="text-muted-foreground text-sm">{prize.percentage}%</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-[200px] flex items-center justify-center text-muted-foreground border-dashed border-2 rounded-md">
                                No data yet
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatsCard({ title, value, description, icon: Icon }: any) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
