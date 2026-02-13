"use client"

import { useMemo } from "react"
import { Subscription } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface SpendingForecastProps {
    subscriptions: Subscription[]
    currency: "USD" | "IDR"
}

export function SpendingForecast({ subscriptions, currency }: SpendingForecastProps) {
    const totalMonthly = useMemo(() => {
        const RATES: Record<string, number> = { "IDR": 1, "USD": 16000, "EUR": 17000, "GBP": 20000 };
        return subscriptions
            .filter(sub => sub.status === "Active")
            .reduce((acc, sub) => {
                const sRate = RATES[sub.currency] || 16000;
                const tRate = RATES[currency] || 16000;
                const valInIDR = sub.amount * (sub.currency === "IDR" ? 1 : sRate);
                const valInTarget = valInIDR / (currency === "IDR" ? 1 : tRate);
                return acc + valInTarget;
            }, 0)
    }, [subscriptions, currency])

    const data = useMemo(() => {
        return [
            { name: "Now", amount: 0, label: "Today" },
            { name: "1 Year", amount: totalMonthly * 12, label: "12 Months" },
            { name: "3 Years", amount: totalMonthly * 36, label: "36 Months" },
            { name: "5 Years", amount: totalMonthly * 60, label: "60 Months" },
        ]
    }, [totalMonthly])



    if (totalMonthly === 0) return null

    return (
        <Card className="hover:border-destructive/50 transition-colors">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-destructive" />
                    <span>The Cost of Doing Nothing</span>
                </CardTitle>
                <CardDescription>
                    Projected cumulative waste if you don't cancel these subscriptions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                fontSize={12}
                                stroke="var(--muted-foreground)"
                            />
                            <YAxis
                                tickFormatter={(value) => formatCurrency(value, currency)}
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                stroke="var(--muted-foreground)"
                            />
                            <Tooltip
                                formatter={(value: any) => [formatCurrency(value, currency), "Cumulative Cost"]}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorAmount)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        In 5 years, you could lose <span className="font-bold text-foreground text-lg">{formatCurrency(totalMonthly * 60, currency)}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
