"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnalysisResult } from "@/lib/types"
import { SubscriptionList } from "@/components/subscription-list"
import { SpendingChart } from "@/components/spending-chart"
import { exportToCSV, exportToPDF } from "@/lib/export"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Wallet, PiggyBank, FileText, FileSpreadsheet } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
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
                    <Button variant="ghost" onClick={() => router.push("/")} className="pl-0 hover:bg-transparent hover:text-primary">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Upload new file
                    </Button>
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Report
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => exportToPDF(data)}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => exportToCSV(data)}>
                                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                                    Export as CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${data.totalMonthlySpend.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">
                                Across {data.subscriptions.length} detected subscriptions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Yearly Savings Potential</CardTitle>
                            <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                                ${(data.yearlyProjection).toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                If you cancel everything
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transactions Analyzed</CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{data.processedTransactions}</div>
                            <p className="text-xs text-muted-foreground">
                                Processed locally on your device
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <SubscriptionList subscriptions={data.subscriptions} />
                    </div>
                    <div>
                        <SpendingChart subscriptions={data.subscriptions} />
                    </div>
                </div>
            </div>
        </div>
    )
}
