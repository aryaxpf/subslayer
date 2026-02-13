"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, GitCommit, Zap, Globe, Shield, Rocket, Users, FileText, Scale, TrendingDown, MessageCircle, Sparkles, ShieldCheck } from "lucide-react"

export default function ChangelogPage() {
    const releases = [
        {
            version: "v1.3.3",
            date: "February 2026",
            title: "Precision Parsing",
            description: "Smarter PDF analysis that understands more bank formats.",
            changes: [
                "Fixed 'Invalid Date' errors with strict ISO validation.",
                "New Smart Date Engine: Supports YYYY-MM-DD, DD.MM.YYYY, and many more.",
                "Intelligent filtering: Ignores account opening dates to find the real transaction."
            ],
            icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />
        },
        {
            version: "v1.3.2",
            date: "February 2026",
            title: "Visual Experience",
            description: "Enhancing the magic of the analysis process.",
            changes: [
                "Tornado Loader: A dynamic swirling animation of service logos during analysis.",
                "Visual Polish: Removed gradients for cleaner text readability."
            ],
            icon: <Sparkles className="h-5 w-5 text-indigo-500" />
        },
        {
            version: "v1.3.1",
            date: "February 2026",
            title: "Get in Touch",
            description: "Direct lines of communication to the developer.",
            changes: [
                "Contact Page: Direct support via Instagram and GitHub.",
                "Added 'Support the Project': Buy me a Coffee & Donate Crypto."
            ],
            icon: <MessageCircle className="h-5 w-5 text-pink-500" />
        },
        {
            version: "v1.3.0",
            date: "February 2026",
            title: "Community Growth",
            description: "Tools to help you share the savings with friends.",
            changes: [
                "Refer & Earn: Share the tool with friends and track your impact.",
            ],
            icon: <Users className="h-5 w-5 text-purple-500" />
        },
        {
            version: "v1.2.3",
            date: "February 2026",
            title: "Legal & Trust",
            description: "Added comprehensive legal protections and transparency docs.",
            changes: [
                "Added Legal & Support pages (Privacy, Terms, FAQ).",
                "Clarified data handling and 'No Storage' policies."
            ],
            icon: <Scale className="h-5 w-5 text-gray-500" />
        },
        {
            version: "v1.2.2",
            date: "February 2026",
            title: "Bureaucracy Slayer",
            description: "Tools to handle difficult cancellations that require written notice.",
            changes: [
                "Formal Letter Generator: Create official PDF cancellation notices.",
                "Templates for Gyms, ISPs, and other bureaucracy-heavy services."
            ],
            icon: <FileText className="h-5 w-5 text-orange-500" />
        },
        {
            version: "v1.2.1",
            date: "February 2026",
            title: "Value Intelligence",
            description: "Data-driven insights to help you decide what to keep.",
            changes: [
                "Value Inspector: Calculate your real 'cost-per-use'.",
                "Smart Verdicts: Instantly spot 'Money Pits' vs 'Great Value' subs."
            ],
            icon: <TrendingDown className="h-5 w-5 text-red-500" />
        },
        {
            version: "v1.2.0",
            date: "February 2026",
            title: "The 'Kill Switch'",
            description: "Direct action links to stop unwanted charges immediately.",
            changes: [
                "Verified Deep Links: Direct buttons for Netflix, Spotify, and more.",
                "One-click navigation to cancellation pages."
            ],
            icon: <Zap className="h-5 w-5 text-yellow-500" />
        },
        {
            version: "v1.1.0",
            date: "February 2026",
            title: "Global Intelligence",
            description: "Making the scanner smarter and more adaptable to different regions.",
            changes: [
                "Multi-Currency Support: Native handling for IDR, USD, EUR, etc.",
                "Smart Currency Detection: Automatically infers currency from CSV context (e.g., 'Biaya').",
                "Smart Reminders: Add next billing dates directly to your Google Calendar.",
                "Improved Logo Engine: Curated official logos for Indonesian services (PLN, Telkomsel)."
            ],
            icon: <Globe className="h-5 w-5 text-blue-500" />
        },
        {
            version: "v1.0.0",
            date: "January 2026",
            title: "Initial Release",
            description: " The birth of Subscription Slayer. Local-only analysis for your peace of mind.",
            changes: [
                "Client-Side Parsing: Analyze PDF and CSV statements without server uploads.",
                "Subscription Detection: Pattern matching engine to find recurring payments.",
                "Spending Dashboard: Visualize monthly spend and potential yearly savings.",
                "Secure by Design: No database, no tracking, complete privacy."
            ],
            icon: <Rocket className="h-5 w-5 text-green-500" />
        }
    ]

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
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
                        <p className="text-muted-foreground">Tracking the evolution of Subscription Slayer.</p>
                    </div>
                </div>

                <div className="relative border-l border-muted ml-4 space-y-12">
                    {releases.map((release, index) => (
                        <div key={index} className="relative pl-8">
                            {/* Timeline Dot */}
                            <div className="absolute -left-3 top-0 bg-background p-1 border rounded-full">
                                {release.icon}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                                        {release.version}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{release.date}</span>
                                </div>

                                <h2 className="text-xl font-bold">{release.title}</h2>
                                <p className="text-muted-foreground text-sm">{release.description}</p>

                                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground/80 pt-2">
                                    {release.changes.map((change, i) => (
                                        <li key={i}>{change}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
