"use client"

import { Subscription } from "@/lib/types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle } from "lucide-react"

interface SubscriptionDetailModalProps {
    subscription: Subscription
    children: React.ReactNode
}

export function SubscriptionDetailModal({ subscription, children }: SubscriptionDetailModalProps) {
    const cancelUrl = `https://google.com/search?q=cancel+${subscription.name.toLowerCase()}+subscription`

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center space-x-4 mb-4">
                        {subscription.logo ? (
                            <img src={subscription.logo} alt={subscription.name} className="h-12 w-12 rounded-full object-cover bg-white" />
                        ) : (
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                {subscription.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <DialogTitle>{subscription.name}</DialogTitle>
                            <DialogDescription className="capitalize">
                                {subscription.category} • {subscription.frequency}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted p-3 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Cost</p>
                            <p className="text-xl font-bold">${subscription.amount.toFixed(2)}</p>
                        </div>
                        <div className="bg-muted p-3 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground uppercase font-bold">Confidence</p>
                            <p className="text-xl font-bold">{(subscription.confidence * 100).toFixed(0)}%</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">How to Cancel</h4>
                        <p className="text-sm text-muted-foreground">
                            We can't cancel this directly for security reasons, but we can take you to the right place.
                        </p>
                        <Button className="w-full" asChild>
                            <a href={cancelUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Find Cancellation Page
                            </a>
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Last Transaction</h4>
                        <div className="text-sm p-3 border rounded-md bg-muted/20">
                            <div className="flex justify-between">
                                <span>Date</span>
                                <span className="font-mono">{new Date(subscription.lastPaymentDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
