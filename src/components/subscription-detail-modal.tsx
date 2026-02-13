"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, AlertTriangle, Mail, Copy, Check, FileText, Calendar, Download, Zap, TrendingDown, ThumbsUp, BookOpen, PiggyBank, Sparkles, ArrowRight } from "lucide-react"
import { cn, formatCurrency, generateGoogleCalendarLink, downloadICSFile } from "@/lib/utils"
import { generateCancellationLetter } from "@/lib/pdf-generator"
import { getServiceKnowledge } from "@/lib/subscriptions"

function LogoImage({ subscription }: { subscription: Subscription }) {
    const [src, setSrc] = useState(subscription.logo || `https://logo.clearbit.com/${subscription.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`)
    const [error, setError] = useState(false)

    if (error) {
        return (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                {subscription.name.charAt(0)}
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={subscription.name}
            className="h-12 w-12 rounded-full object-contain p-1 bg-white border border-border shrink-0"
            onError={() => {
                // If specific logo fails AND we guessed a domain, try one more generic guess or fail
                if (src !== subscription.logo) {
                    setError(true)
                } else {
                    // If provided logo failed, try guessing domain
                    setSrc(`https://logo.clearbit.com/${subscription.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`)
                }
            }}
        />
    )
}

interface SubscriptionDetailModalProps {
    subscription: Subscription | null
    isOpen: boolean
    onClose: () => void
    currency: "USD" | "IDR"
}

export function SubscriptionDetailModal({ subscription, isOpen, onClose, currency }: SubscriptionDetailModalProps) {
    const [activeTab, setActiveTab] = useState<"details" | "assistant" | "reminders" | "inspector" | "alternatives">("details")
    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [copied, setCopied] = useState(false)
    const [usageFrequency, setUsageFrequency] = useState<number | null>(null) // Monthly uses

    if (!subscription) return null

    // "Kill Switch" Logic: Check if cancellationUrl is specifically set in our verification list (vs google search fallback)
    const isVerifiedKillSwitch = subscription.cancellationUrl && !subscription.cancellationUrl.includes("google.com/search");
    const cancelUrl = subscription.cancellationUrl || `https://google.com/search?q=cancel+${subscription.name.toLowerCase()}+subscription`

    // Calculate Next Payment Date
    const lastDate = new Date(subscription.lastPaymentDate);
    const nextDate = new Date(lastDate);
    if (subscription.frequency === "Monthly") {
        nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (subscription.frequency === "Yearly") {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else if (subscription.frequency === "Weekly") {
        nextDate.setDate(nextDate.getDate() + 7);
    }
    // If nextDate is in the past (because dataset is old), keep adding until future? 
    // For now, let's just show the calculated next date even if strictly "past" relative to today, 
    // unless it's way off. But simpler to just start from "Today" + frequency if last date is old.
    // Actually, let's assume the user wants to be reminded for the *next* logical occurrence.
    // If last payment was 2023, and it's monthly, we probably want next month relative to *now*.
    // But let's stick to the simple logic: Last + Frequency.

    // Ensure we don't set a reminder in the past if possible (optional polish)
    if (nextDate < new Date()) {
        // logic to project to next future date could go here, but omitted for MVP simplicity
    }

    const formattedCost = formatCurrency(subscription.amount, subscription.currency);

    const handleGoogleCalendar = () => {
        const link = generateGoogleCalendarLink(subscription.name, formattedCost, nextDate);
        window.open(link, '_blank');
    }

    const handleDownloadICS = () => {
        downloadICSFile(subscription.name, formattedCost, nextDate);
    }

    const generateEmailBody = () => {
        return `Subject: Cancellation Request - ${subscription.name} Account\n\nTo whom it may concern,\n\nI am writing to formally request the cancellation of my ${subscription.name} subscription, effective immediately.\n\nAccount Details:\n- Name: ${userName || "[Your Name]"}\n- Account Email: ${userEmail || "[Your Account Email]"}\n- Service: ${subscription.name}\n\nPlease confirm receipt of this request and provide date of termination.\n\nThank you,\n${userName || "[Your Name]"}`
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(generateEmailBody())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleMailto = () => {
        const subject = `Cancellation Request - ${subscription.name}`
        const body = generateEmailBody()
        window.location.href = `mailto:support@${subscription.name.toLowerCase().replace(/\s/g, "")}.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    }

    // Value Inspector Logic
    const calculateValue = () => {
        if (!usageFrequency) return null;
        return subscription.amount / usageFrequency;
    }

    const valuePerUse = calculateValue();
    const isGoodValue = valuePerUse ? (subscription.currency === "IDR" ? valuePerUse < 15000 : valuePerUse < 1) : false;
    const isMoneyPit = valuePerUse ? (subscription.currency === "IDR" ? valuePerUse > 50000 : valuePerUse > 5) : false;

    // Downgrade Logic
    const knowledge = getServiceKnowledge(subscription.name);
    const downgradeOptions = knowledge?.downgradeOptions || [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <div className="flex items-center space-x-4 mb-4">
                        <LogoImage subscription={subscription} />
                        <div>
                            <DialogTitle>{subscription.name}</DialogTitle>
                            <DialogDescription className="capitalize">
                                {subscription.category} • {subscription.frequency}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Custom Tabs */}
                <div className="flex space-x-2 border-b mb-4 overflow-x-auto pb-1">
                    <button
                        onClick={() => setActiveTab("details")}
                        className={cn(
                            "px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                            activeTab === "details" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Details
                    </button>
                    {/* Suggestion Tab - Only show if options exist */}
                    {downgradeOptions.length > 0 && (
                        <button
                            onClick={() => setActiveTab("alternatives")}
                            className={cn(
                                "px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap",
                                activeTab === "alternatives" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <PiggyBank className="w-3 h-3 mr-2" />
                            Alternatives
                        </button>
                    )}
                    <button
                        onClick={() => setActiveTab("inspector")}
                        className={cn(
                            "px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap",
                            activeTab === "inspector" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <TrendingDown className="w-3 h-3 mr-2" />
                        Value Check
                    </button>
                    <button
                        onClick={() => setActiveTab("reminders")}
                        className={cn(
                            "px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap",
                            activeTab === "reminders" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Calendar className="w-3 h-3 mr-2" />
                        Remind Me
                    </button>
                    <button
                        onClick={() => setActiveTab("assistant")}
                        className={cn(
                            "px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center whitespace-nowrap",
                            activeTab === "assistant" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Mail className="w-3 h-3 mr-2" />
                        Writer
                    </button>
                </div>

                {activeTab === "details" ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-muted p-3 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground uppercase font-bold">Cost</p>
                                <p className="text-xl font-bold">{formatCurrency(subscription.amount, subscription.currency)}</p>
                            </div>
                            <div className="bg-muted p-3 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground uppercase font-bold">Confidence</p>
                                <p className="text-xl font-bold">{(subscription.confidence * 100).toFixed(0)}%</p>
                            </div>
                        </div>

                        {/* Quick optimization nudge (if available) */}
                        {downgradeOptions.length > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-3 rounded-lg flex items-center justify-between cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors" onClick={() => setActiveTab("alternatives")}>
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="h-4 w-4 text-green-600" />
                                    <p className="text-sm font-medium text-green-800 dark:text-green-300">Cheaper options available!</p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-green-600" />
                            </div>
                        )}

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">Action</h4>
                            <p className="text-sm text-muted-foreground">
                                {isVerifiedKillSwitch
                                    ? "Official direct cancellation link available. Proceed with caution."
                                    : "No verified direct link found. Use our search helper."}
                            </p>
                            <Button
                                className={cn("w-full transition-all", isVerifiedKillSwitch ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20" : "")}
                                asChild
                            >
                                <a href={cancelUrl} target="_blank" rel="noopener noreferrer">
                                    {isVerifiedKillSwitch ? <Zap className="h-4 w-4 mr-2 text-white fill-white" /> : <ExternalLink className="h-4 w-4 mr-2" />}
                                    {isVerifiedKillSwitch ? "LAUNCH KILL SWITCH (Cancel Now)" : "Find Cancellation Page"}
                                </a>
                            </Button>
                            {isVerifiedKillSwitch && (
                                <p className="text-[10px] text-center text-red-600 font-medium mt-1">
                                    Takes you directly to the cancellation confirmation page.
                                </p>
                            )}


                            {subscription.knowledgeId && (
                                <Button variant="outline" className="w-full mt-2" asChild>
                                    <a href={`/how-to-cancel/${subscription.knowledgeId}`} target="_blank" rel="noopener noreferrer">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        View Step-by-Step Guide
                                    </a>
                                </Button>
                            )}
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
                ) : activeTab === "alternatives" ? (
                    <div className="space-y-6 animate-in fade-in-50">
                        <div className="text-center space-y-2">
                            <PiggyBank className="w-12 h-12 mx-auto text-green-600 opacity-80" />
                            <h3 className="font-medium text-lg">Save without Cancelling</h3>
                            <p className="text-sm text-muted-foreground">
                                We found cheaper ways to keep this service.
                            </p>
                        </div>

                        <div className="grid gap-3">
                            {downgradeOptions.map((opt, i) => (
                                <div key={i} className="border p-4 rounded-xl flex items-center justify-between hover:border-green-400 bg-background hover:bg-green-50/50 transition-all shadow-sm">
                                    <div>
                                        <p className="font-bold">{opt.name}</p>
                                        <p className="text-sm text-muted-foreground">{opt.price}</p>
                                    </div>
                                    <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                                        {opt.savings}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-muted p-4 rounded-lg mt-4">
                            <p className="text-xs text-muted-foreground text-center">
                                To apply these, log in to your account management page.
                            </p>
                        </div>
                    </div>
                ) : activeTab === "inspector" ? (
                    <div className="space-y-6 animate-in fade-in-50">
                        <div className="text-center space-y-2">
                            <TrendingDown className="w-12 h-12 mx-auto text-primary opacity-80" />
                            <h3 className="font-medium text-lg">Are you getting your money's worth?</h3>
                            <p className="text-sm text-muted-foreground">
                                Estimate how much this subscription costs you per use.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Label>How often do you use {subscription.name}?</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant={usageFrequency === 30 ? "default" : "outline"} onClick={() => setUsageFrequency(30)} className="h-auto py-3 flex-col">
                                    <span className="font-bold">Daily</span>
                                    <span className="text-xs font-normal opacity-70">~30x / month</span>
                                </Button>
                                <Button variant={usageFrequency === 4 ? "default" : "outline"} onClick={() => setUsageFrequency(4)} className="h-auto py-3 flex-col">
                                    <span className="font-bold">Weekly</span>
                                    <span className="text-xs font-normal opacity-70">~4x / month</span>
                                </Button>
                                <Button variant={usageFrequency === 1 ? "default" : "outline"} onClick={() => setUsageFrequency(1)} className="h-auto py-3 flex-col">
                                    <span className="font-bold">Monthly</span>
                                    <span className="text-xs font-normal opacity-70">1x / month</span>
                                </Button>
                                <Button variant={usageFrequency === 0.2 ? "default" : "outline"} onClick={() => setUsageFrequency(0.2)} className="h-auto py-3 flex-col">
                                    <span className="font-bold">Rarely</span>
                                    <span className="text-xs font-normal opacity-70">Every few months</span>
                                </Button>
                            </div>
                        </div>

                        {valuePerUse && (
                            <div className={cn("p-4 rounded-lg text-center animate-in zoom-in-95 border-2",
                                isMoneyPit ? "bg-red-50 border-red-200 text-red-900" :
                                    isGoodValue ? "bg-green-50 border-green-200 text-green-900" : "bg-muted border-transparent"
                            )}>
                                <p className="text-xs uppercase font-bold mb-1 opacity-70">Real Cost Per Use</p>
                                <p className="text-2xl font-black">{formatCurrency(valuePerUse, subscription.currency)}</p>

                                <div className="mt-3 font-medium flex items-center justify-center gap-2">
                                    {isMoneyPit ? (
                                        <>
                                            <AlertTriangle className="h-5 w-5 text-red-600" />
                                            <span>MONEY PIT! Cancel recommended.</span>
                                        </>
                                    ) : isGoodValue ? (
                                        <>
                                            <ThumbsUp className="h-5 w-5 text-green-600" />
                                            <span>Great Value! Keep it.</span>
                                        </>
                                    ) : (
                                        <span>Average Value.</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : activeTab === "assistant" ? (
                    <div className="space-y-4 animate-in fade-in-50">
                        <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Account Email</Label>
                            <Input
                                id="email"
                                placeholder="john@example.com"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Generated Email</Label>
                            <textarea
                                className="w-full h-32 p-3 text-xs md:text-sm font-mono border rounded-md resize-none bg-muted focus:outline-none focus:ring-1 focus:ring-primary"
                                readOnly
                                value={generateEmailBody()}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" onClick={handleCopy} className="w-full">
                                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                {copied ? "Copied!" : "Copy Text"}
                            </Button>
                            <Button onClick={handleMailto} className="w-full">
                                <Mail className="h-4 w-4 mr-2" />
                                Open Mail App
                            </Button>
                        </div>

                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => generateCancellationLetter({
                                subscriptionName: subscription.name,
                                subscriptionAmount: subscription.amount,
                                currency: subscription.currency,
                                userName: userName,
                                userEmail: userEmail
                            })}
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            Download Formal Letter (PDF)
                        </Button>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md flex items-start space-x-3 mt-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                This is a template. Make sure to double-check the recipient address before sending!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in-50">
                        <div className="text-center space-y-2">
                            <Calendar className="w-12 h-12 mx-auto text-primary opacity-80" />
                            <h3 className="font-medium text-lg">Never Miss a Cancellation</h3>
                            <p className="text-sm text-muted-foreground">
                                Add a reminder to your calendar before the next billing date to avoid unwanted charges.
                            </p>
                        </div>

                        <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold uppercase text-muted-foreground">Next Estimated Charge</p>
                                <p className="font-mono text-lg">{nextDate.toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Cost</p>
                                <p className="font-bold">{formattedCost}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button onClick={handleGoogleCalendar} className="w-full" variant="outline">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="w-4 h-4 mr-2" alt="Google" />
                                Add to Google Calendar
                            </Button>
                            <Button onClick={handleDownloadICS} className="w-full" variant="secondary">
                                <Download className="w-4 h-4 mr-2" />
                                Download Calendar File (.ics)
                            </Button>
                        </div>
                        <p className="text-xs text-center text-muted-foreground px-4">
                            We recommend setting the alert for <strong>3 days before</strong> the billing date.
                        </p>
                    </div>
                )}
            </DialogContent>
        </Dialog >
    )
}
