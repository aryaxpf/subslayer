"use client"

import { Subscription } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, Check, X } from "lucide-react"

interface SubscriptionListProps {
    subscriptions: Subscription[]
}

import { SubscriptionDetailModal } from "@/components/subscription-detail-modal"

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
    if (subscriptions.length === 0) {
        return (
            <Card className="text-center p-12">
                <h3 className="text-lg font-medium">No subscriptions detected</h3>
                <p className="text-muted-foreground">We couldn't find any recurring payments in your provided data.</p>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Detected Subscriptions ({subscriptions.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {subscriptions.map((sub) => (
                        <div
                            key={sub.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                {sub.logo ? (
                                    <img src={sub.logo} alt={sub.name} className="h-10 w-10 rounded-full object-cover bg-white" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {sub.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold">{sub.name}</h4>
                                    <p className="text-sm text-muted-foreground capitalize">{sub.category} • {sub.frequency} • Last: {new Date(sub.lastPaymentDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="font-bold text-lg">${sub.amount.toFixed(2)}</p>
                                    <p className="text-xs text-muted-foreground">/mo</p>
                                </div>
                                <div className="flex space-x-2">
                                    <SubscriptionDetailModal subscription={sub}>
                                        <Button variant="outline" size="sm" className="hidden md:flex">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </SubscriptionDetailModal>
                                    <SubscriptionDetailModal subscription={sub}>
                                        <Button variant="default" size="sm" className="md:hidden">
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </SubscriptionDetailModal>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card >
    )
}
