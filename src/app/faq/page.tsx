"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, HelpCircle, ShieldCheck, FileSpreadsheet, Zap, DollarSign } from "lucide-react"

export default function FAQPage() {
    const faqs = [
        {
            question: "Is my financial data safe?",
            answer: "Yes, absolutely. Subscription Slayer runs entirely in your browser. Your bank statements and CSV files are never uploaded to any server. The analysis happens locally on your device, and the data is discarded as soon as you close the tab (unless you choose to save the *results* to your browser's local storage).",
            icon: <ShieldCheck className="h-5 w-5 text-primary" />
        },
        {
            question: "What file formats do you support?",
            answer: "We currently support PDF statements from major Indonesian banks (BCA, Mandiri, BRI, BNI) and standard CSV exports from most banks. If your bank isn't supported yet, you can try converting your statement to a simple CSV format.",
            icon: <FileSpreadsheet className="h-5 w-5 text-primary" />
        },
        {
            question: "How does the 'Kill Switch' work?",
            answer: "The Kill Switch is a direct link to the cancellation page of a service (like Netflix or Spotify). Instead of searching through settings menus, we take you straight to the page where you can say 'Goodbye'. We verifying these links manually to ensure they are safe.",
            icon: <Zap className="h-5 w-5 text-primary" />
        },
        {
            question: "Is this tool free?",
            answer: "Yes, Subscription Slayer is free and open-source. We built it to help people save money. If you find it useful, you can support the development by buying us a coffee via the link in the dashboard.",
            icon: <DollarSign className="h-5 w-5 text-primary" />
        },
        {
            question: "Why didn't it find my subscription?",
            answer: "We use pattern matching to find subscriptions based on common transaction names (e.g., 'Spotify', 'Netflix', 'Google'). If a transaction has a confusing name (like 'MERCANT 12345'), we might miss it. You can always check your statement manually to be sure.",
            icon: <HelpCircle className="h-5 w-5 text-primary" />
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
                    <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
                </div>

                <div className="grid gap-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="p-6 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-start">
                                <div className="mr-4 mt-1 bg-primary/10 p-2 rounded-full">
                                    {faq.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t text-center">
                    <p className="text-muted-foreground mb-4">Still have questions?</p>
                    <Button asChild>
                        <Link href="/contact" className="gap-2">
                            Contact Us
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
