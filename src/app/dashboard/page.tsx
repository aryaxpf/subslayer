"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnalysisResult } from "@/lib/types"
import { SubscriptionList } from "@/components/subscription-list"
import { formatCurrency } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dynamic from "next/dynamic"

// Dynamic imports for heavy components
const SpendingChart = dynamic(() => import("@/components/spending-chart").then(mod => mod.SpendingChart), {
    loading: () => <p>Loading chart...</p>,
    ssr: false
})
import { SubscriptionCalendar } from "@/components/subscription-calendar"
import { SpendingForecast } from "@/components/spending-forecast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Wallet, PiggyBank, FileText, FileSpreadsheet, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
    const router = useRouter()
    const [data, setData] = useState<AnalysisResult | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("subscription_slayer_data")
        if (!stored) {
            router.push("/")
            return
        }
        try {
            setData(JSON.parse(stored))
        } catch (e) {
            console.error("Failed to parse data", e)
            router.push("/")
        }
    }, [router])

    if (!data) return null

    return (
        <div className="min-h-screen bg-background p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Scan Results</h1>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                // Clear data when going back to upload new file
                                localStorage.removeItem("subscription_slayer_data")
                                router.push("/")
                            }}
                            className="hover:bg-transparent hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Upload new file
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={async () => {
                                    const { exportToPDF } = await import("@/lib/export")
                                    exportToPDF(data)
                                }}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async () => {
                                    const { exportToCSV } = await import("@/lib/export")
                                    exportToCSV(data)
                                }}>
                                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                                    Export as CSV
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => {
                                        localStorage.removeItem("subscription_slayer_data")
                                        router.push("/")
                                    }}
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Clear Data & Exit
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Main Content Area - Fixed Height for no page scroll */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)] min-h-[500px]">
                    {/* Left Panel - Subscription List (Scrollable) */}
                    <div className="lg:col-span-4 h-full overflow-hidden flex flex-col">
                        <SubscriptionList subscriptions={data.subscriptions} currency={data.currency as "IDR" | "USD"} />
                    </div>

                    {/* Right Panel - Widgets (Scrollable if needed, or compact) */}
                    <div className="lg:col-span-8 h-full overflow-y-auto pr-2 space-y-6">
                        {/* Summary Cards Row */}
                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
                                    <Wallet className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(data.totalMonthlySpend, data.currency)}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Across {data.subscriptions.length} detected subscriptions
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Yearly Savings</CardTitle>
                                    <PiggyBank className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                                        {formatCurrency(data.yearlyProjection, data.currency)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Potential savings per year
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Analyzed</CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{data.processedTransactions}</div>
                                    <p className="text-xs text-muted-foreground">
                                        Transactions processed locally
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Visualization Tabs & Coffee */}
                        <div className="grid grid-cols-1 gap-6">
                            <Tabs defaultValue="insights" className="w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <TabsList>
                                        <TabsTrigger value="insights">Insights</TabsTrigger>
                                        <TabsTrigger value="calendar">Calendar</TabsTrigger>
                                        <TabsTrigger value="forecast">Forecast</TabsTrigger>
                                    </TabsList>
                                </div>
                                <div className="mt-0">
                                    <TabsContent value="insights" className="mt-0">
                                        <SpendingChart subscriptions={data.subscriptions} currency={data.currency as "IDR" | "USD"} />
                                    </TabsContent>
                                    <TabsContent value="calendar" className="mt-0">
                                        <SubscriptionCalendar subscriptions={data.subscriptions} currency={data.currency as "IDR" | "USD"} />
                                    </TabsContent>
                                    <TabsContent value="forecast" className="mt-0">
                                        <SpendingForecast subscriptions={data.subscriptions} currency={data.currency as "IDR" | "USD"} />
                                    </TabsContent>
                                </div>
                            </Tabs>

                            {/* Support Section - Compact */}
                            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100 dark:from-orange-950/20 dark:to-amber-950/20 dark:border-orange-900/30">
                                <div className="flex items-center justify-between p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-full">
                                            <span className="text-xl">☕</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm">Find this useful?</h3>
                                            <p className="text-xs text-muted-foreground">Support the developer with a coffee</p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        className="bg-[#FF813F] hover:bg-[#FF813F]/90 text-white font-bold"
                                        onClick={() => window.open('https://saweria.co/aryapfir', '_blank')}
                                    >
                                        Support via Saweria
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
