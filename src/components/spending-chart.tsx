import { useMemo } from "react"
import { Subscription } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { formatCurrency, formatCompactCurrency } from "@/lib/utils"

interface SpendingChartProps {
    subscriptions: Subscription[]
    currency: "USD" | "IDR"
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function SpendingChart({ subscriptions, currency }: SpendingChartProps) {
    const data = useMemo(() => {
        const categories: Record<string, number> = {}
        const RATES: Record<string, number> = { "IDR": 1, "USD": 16000, "EUR": 17000, "GBP": 20000 };

        subscriptions.forEach(sub => {
            if (sub.status === "Active") {
                const sRate = RATES[sub.currency] || 16000;
                const tRate = RATES[currency] || 16000;
                const valInIDR = sub.amount * (sub.currency === "IDR" ? 1 : sRate);
                const valInTarget = valInIDR / (currency === "IDR" ? 1 : tRate);

                categories[sub.category] = (categories[sub.category] || 0) + valInTarget;
            }
        })
        return Object.entries(categories).map(([name, value]) => ({ name, value }))
    }, [subscriptions, currency])

    if (data.length === 0) return null

    return (
        <Card>
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>
                    Where your money is going every month
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                            />
                            <YAxis
                                tickFormatter={(value) => formatCompactCurrency(value, currency)}
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                width={80}
                            />
                            <Tooltip
                                formatter={(value: any) => [formatCurrency(value || 0, currency), "Monthly Spend"]}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            />
                            <Bar
                                dataKey="value"
                                fill="hsl(var(--primary))"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
