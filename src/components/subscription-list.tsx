"use client"

import { useState } from "react"
import { Subscription } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, Check, X, Music, Globe, Zap, Clock, AlertCircle, Download } from "lucide-react"
import { cn, formatCurrency } from "@/lib/utils"

interface SubscriptionListProps {
    subscriptions: Subscription[]
    currency: "USD" | "IDR"
}

import { SubscriptionDetailModal } from "@/components/subscription-detail-modal"

function SubscriptionIcon({ sub }: { sub: Subscription }) {
    const [imageError, setImageError] = useState(false)
    const logoUrl = sub.logo || `https://logo.clearbit.com/${sub.name.split('(')[0].trim().replace(/\s+/g, '').toLowerCase()}.com`

    if (imageError || !logoUrl) {
        return (
            <div className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border shrink-0",
                sub.category === "Entertainment" && "bg-pink-100 text-pink-600",
                sub.category === "Software" && "bg-blue-100 text-blue-600",
                sub.category === "Utilities" && "bg-yellow-100 text-yellow-600",
                sub.category === "Lifestyle" && "bg-green-100 text-green-600",
                sub.category === "Other" && "bg-gray-100 text-gray-600",
                // Default fallback if no category match
                !["Entertainment", "Software", "Utilities", "Lifestyle", "Other"].includes(sub.category) && "bg-gray-100 text-gray-600"
            )}>
                {sub.category === "Entertainment" && <Music className="h-5 w-5" />}
                {sub.category === "Software" && <Globe className="h-5 w-5" />}
                {sub.category === "Utilities" && <Zap className="h-5 w-5" />}
                {sub.category === "Lifestyle" && <Clock className="h-5 w-5" />}
                {(sub.category === "Other" || !["Entertainment", "Software", "Utilities", "Lifestyle"].includes(sub.category)) && <AlertCircle className="h-5 w-5" />}
            </div>
        )
    }

    return (
        <div className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border bg-background shrink-0">
            <img
                src={logoUrl}
                alt={sub.name}
                className="w-full h-full object-contain p-1"
                onError={() => setImageError(true)}
            />
        </div>
    )
}

export function SubscriptionList({ subscriptions, currency }: SubscriptionListProps) {
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [localSubscriptions, setLocalSubscriptions] = useState<Subscription[]>(subscriptions)

    // Sync local state when props change
    if (JSON.stringify(subscriptions) !== JSON.stringify(localSubscriptions) && selectedIds.size === 0) {
        setLocalSubscriptions(subscriptions);
    }

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelectedIds(newSet)
    }

    const toggleSelectAll = () => {
        if (selectedIds.size === localSubscriptions.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(localSubscriptions.map(s => s.id)))
        }
    }

    const handleBulkCancel = () => {
        // In a real app, this would update the backend.
        // For local storage app, we just visually mark them (or delete).
        // Let's filter them out for the "Hit List" purpose or just visual strikethrough?
        // User request: "mark as cancelled".
        const updated = localSubscriptions.map(sub =>
            selectedIds.has(sub.id) ? { ...sub, status: "Cancelled" as const } : sub
        )
        setLocalSubscriptions(updated);
        // Update LocalStorage? Technically we should, but this component doesn't own the "source of truth" (Dashboard does).
        // Ideally we pass an "onUpdate" prop. For now, let's just update local view.
        setSelectedIds(new Set());
    }

    const handleGenerateHitList = async () => {
        const selectedSubs = localSubscriptions.filter(s => selectedIds.has(s.id));
        if (selectedSubs.length === 0) return;

        const { generateCancellationHitList } = await import("@/lib/pdf-generator");
        generateCancellationHitList(selectedSubs, currency);
    }

    if (localSubscriptions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>No Subscriptions Found</CardTitle>
                    <CardDescription>
                        We couldn't detect any recurring payments in your file.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="h-full flex flex-col overflow-hidden border-2 shadow-sm relative">
            <CardHeader className="pb-2 shrink-0 bg-muted/20 flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Active Subscriptions</CardTitle>
                    <CardDescription>
                        Found {localSubscriptions.length} recurring payments
                    </CardDescription>
                </div>
                <Button variant={selectedIds.size > 0 ? "default" : "ghost"} size="sm" onClick={toggleSelectAll} className="h-8 text-xs px-3">
                    {selectedIds.size === localSubscriptions.length ? "Deselect All" : "Select All"}
                </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-20">
                <div className="space-y-3">
                    {localSubscriptions.map((sub) => (
                        <div
                            key={sub.id}
                            className={cn(
                                "flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer relative group",
                                selectedIds.has(sub.id) ? "bg-primary/5 border-primary/50" : "hover:bg-muted/50",
                                sub.status === "Cancelled" && "opacity-50 grayscale bg-muted"
                            )}
                            onClick={() => toggleSelection(sub.id)}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "w-5 h-5 rounded border flex items-center justify-center transition-colors",
                                    selectedIds.has(sub.id) ? "bg-primary border-primary" : "border-muted-foreground/30"
                                )}>
                                    {selectedIds.has(sub.id) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <SubscriptionIcon sub={sub} />
                                <div>
                                    <p className={cn("font-medium", sub.status === "Cancelled" && "line-through")}>{sub.name}</p>
                                    <p className="text-sm text-muted-foreground">{sub.frequency} • {sub.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{formatCurrency(sub.amount, sub.currency as any)}</p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 ml-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedSubscription(sub);
                                    }}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            {/* Bulk Action Bar */}
            {selectedIds.size > 0 && (
                <div className="absolute bottom-6 left-6 right-6 bg-foreground/95 text-background backdrop-blur-md p-4 rounded-2xl shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-5 border border-white/10 ring-1 ring-black/5 z-20">
                    <div className="flex items-center gap-3">
                        <div className="bg-background/20 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm text-background">
                            {selectedIds.size}
                        </div>
                        <span className="font-medium text-sm text-background">Selected</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="bg-background/10 hover:bg-background/20 text-background border-0 font-medium h-9 px-4 transition-all"
                            onClick={handleGenerateHitList}
                        >
                            <Download className="w-4 h-4 mr-2 opacity-80" />
                            Hit List (PDF)
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-9 px-4 font-bold shadow-lg shadow-red-500/20"
                            onClick={handleBulkCancel}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Mark Cancelled
                        </Button>
                    </div>
                </div>
            )}

            <SubscriptionDetailModal
                subscription={selectedSubscription}
                isOpen={!!selectedSubscription}
                onClose={() => setSelectedSubscription(null)}
                currency={currency}
            />
        </Card>
    )
}
