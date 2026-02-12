"use client"

import { useMemo } from "react"
import { Subscription } from "@/lib/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SpendingChartProps {
    subscriptions: Subscription[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function SpendingChart({ subscriptions }: SpendingChartProps) {
    const data = useMemo(() => {
        const categoryMap = new Map<string, number>()

        subscriptions.forEach(sub => {
            const current = categoryMap.get(sub.category) || 0
            categoryMap.set(sub.category, current + sub.amount)
        })

        return Array.from(categoryMap.entries()).map(([name, value]) => ({
            name,
            value
        })).sort((a, b) => b.value - a.value)
    }, [subscriptions])

    if (subscriptions.length === 0) return null

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => [`$${Number(value).toFixed(2)}`, "Amount"]}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
