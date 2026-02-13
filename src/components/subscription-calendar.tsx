"use client"

import { useState } from "react"
import { Subscription } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { cn, formatCurrency, formatCompactCurrency } from "@/lib/utils"

interface SubscriptionCalendarProps {
    subscriptions: Subscription[]
    currency: "USD" | "IDR"
}

export function SubscriptionCalendar({ subscriptions, currency }: SubscriptionCalendarProps) {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    // Helper to get days in month
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()

    // Generate calendar days
    const daysInMonth = getDaysInMonth(currentYear, currentMonth)
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay() // 0 = Sunday

    // Map subscriptions to days
    const paymentsByDay: Record<number, Subscription[]> = {}

    subscriptions.forEach(sub => {
        if (sub.status !== "Active") return

        // Simple heuristic for Monthly: Use the day of the last payment
        // TODO: Handle Weekly/Yearly more accurately
        const lastDate = new Date(sub.lastPaymentDate)
        const paymentDay = lastDate.getDate()

        // Adjust for months with fewer days (e.g. 31st on Feb)
        const day = Math.min(paymentDay, daysInMonth)

        if (!paymentsByDay[day]) {
            paymentsByDay[day] = []
        }
        paymentsByDay[day].push(sub)
    })

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-lg font-medium">Upcoming Payments</CardTitle>
                    <CardDescription>
                        {monthNames[currentMonth]} {currentYear}
                    </CardDescription>
                </div>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground mb-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                        <div key={day} className="py-1">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for previous month */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square bg-muted/20 rounded-md" />
                    ))}

                    {/* Days of current month */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const subsToday = paymentsByDay[day] || []
                        const hasPayments = subsToday.length > 0
                        const isPast = day < today.getDate()
                        const isToday = day === today.getDate()

                        return (
                            <div
                                key={day}
                                className={`
                                    aspect-square rounded-md p-1 relative flex flex-col justify-between
                                    ${isToday ? "ring-2 ring-primary bg-primary/5" : "bg-card border"}
                                    ${hasPayments ? "border-primary/50 bg-primary/5" : "border-border"}
                                    ${isPast ? "opacity-50" : ""}
                                `}
                            >
                                <span className="text-xs font-semibold self-start ml-1">{day}</span>

                                {hasPayments && (
                                    <div className="flex flex-col items-end gap-0.5">
                                        <div className="flex -space-x-1.5 overflow-hidden">
                                            {subsToday.slice(0, 3).map((sub, idx) => {
                                                // Simple logo heuristic: try clearbit, fallback to initial
                                                // Clean name for better hit rate
                                                const cleanName = sub.name.split('(')[0].trim().replace(/\s+/g, '').toLowerCase()
                                                const logoUrl = sub.logo || `https://logo.clearbit.com/${cleanName}.com`

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="w-4 h-4 rounded-full bg-background border border-border flex items-center justify-center text-[8px] font-bold text-primary shrink-0 relative z-10 overflow-hidden"
                                                        title={sub.name}
                                                    >
                                                        <img
                                                            src={logoUrl}
                                                            alt={sub.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.parentElement!.innerText = sub.name.charAt(0);
                                                            }}
                                                        />
                                                    </div>
                                                )
                                            })}
                                            {subsToday.length > 3 && (
                                                <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px] pr-0.5">
                                                    +{subsToday.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-[9px] font-bold text-primary truncate w-full text-right pr-0.5">
                                            {formatCompactCurrency(
                                                subsToday.reduce((sum, s) => {
                                                    // Convert to dominant currency for display
                                                    // Simple static rate map (duplicating for UI, ideally shared)
                                                    const RATES: Record<string, number> = { "IDR": 1, "USD": 16000, "EUR": 17000, "GBP": 20000 };
                                                    const sRate = RATES[s.currency] || 16000;
                                                    const tRate = RATES[currency] || 16000;
                                                    const valInIDR = s.amount * (s.currency === "IDR" ? 1 : sRate);
                                                    const valInTarget = valInIDR / (currency === "IDR" ? 1 : tRate);
                                                    return sum + valInTarget;
                                                }, 0),
                                                currency
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card >
    )
}
