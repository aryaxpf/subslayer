"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Share2, Gift, Users, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export default function ReferPage() {
    const [copied, setCopied] = useState(false)
    const referralLink = "https://subscription-slayer.vercel.app/?ref=slayer_friend"

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl space-y-8">

                {/* Header */}
                <div className="flex items-center space-x-4 mb-8">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Refer & Earn</h1>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Main Value Prop */}
                    <div className="space-y-6">
                        <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                            <Gift className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold">Help friends save money, earn rewards.</h2>
                        <p className="text-muted-foreground">
                            Subscription Slayer is free, but your support helps us grow. Share the tool with friends and family to help them stop wasting money on forgotten subscriptions.
                        </p>
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-muted p-2 rounded-full">
                                    <Share2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">1. Share your link</p>
                                    <p className="text-sm text-muted-foreground">Send it to friends who have too many subs.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-muted p-2 rounded-full">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">2. They save money</p>
                                    <p className="text-sm text-muted-foreground">They use the tool to find and kill wastage.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-muted p-2 rounded-full">
                                    <Gift className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">3. Earn Perks (Coming Soon)</p>
                                    <p className="text-sm text-muted-foreground">We are building a rewards program for top referrers!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Share Card */}
                    <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col justify-center space-y-6">
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold">Your Referral Link</h3>
                            <p className="text-sm text-muted-foreground">Copy and share this link to track your impact.</p>
                        </div>

                        <div className="flex space-x-2">
                            <Input
                                value={referralLink}
                                readOnly
                                className="bg-muted text-muted-foreground font-mono text-xs"
                            />
                            <Button size="icon" onClick={handleCopy}>
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>

                        <div className="pt-4 border-t">
                            <p className="text-xs text-center text-muted-foreground mb-4">Or share directly:</p>
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" className="w-full" asChild>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=I%20just%20saved%20money%20canceling%20unused%20subscriptions%20with%20Subscription%20Slayer!%20Check%20it%20out:&url=${encodeURIComponent(referralLink)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Twitter
                                    </a>
                                </Button>
                                <Button variant="outline" className="w-full" asChild>
                                    <a
                                        href={`https://wa.me/?text=Check%20out%20Subscription%20Slayer,%20it%20helps%20you%20find%20and%20cancel%20wasteful%20subscriptions!%20${encodeURIComponent(referralLink)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        WhatsApp
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
